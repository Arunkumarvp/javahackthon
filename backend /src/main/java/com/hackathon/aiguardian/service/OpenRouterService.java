package com.hackathon.aiguardian.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.aiguardian.dto.ChatRequest;
import com.hackathon.aiguardian.dto.ChatResponse;
import com.hackathon.aiguardian.model.PendingAction;
import com.hackathon.aiguardian.repository.PendingActionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

/**
 * OpenRouterService
 *
 * Purpose: Core LLM brain service for the AI Financial Guardian.
 *          Routes all conversational AI interactions through the OpenRouter API
 *          using the OpenAI-compatible chat completions interface.
 *
 * Responsibilities:
 * 1. Load tool schemas from tool_schemas.json at startup via @PostConstruct.
 * 2. Construct OpenAI-compatible message payload with system prompt + tool definitions.
 * 3. Mask PII in user messages before any external dispatch (via PiiMaskingService).
 * 4. Augment system prompt with RAG context (via RagRetrievalService).
 * 5. Call OpenRouter API: POST /chat/completions with Bearer auth.
 * 6. Parse tool_calls[] from the LLM response.
 * 7. Dispatch read-only tool calls to internal handlers.
 * 8. Enforce Confirm-Before-Action gate for state-mutating tools (execute_transfer, set_budget_alert).
 * 9. Audit every AI interaction via AuditLogService.
 *
 * Dependencies:
 * - openRouterRestTemplate (OpenRouterConfig)
 * - PiiMaskingService, AuditLogService, BankingApiService
 * - PayeeVerificationService, RagRetrievalService
 * - PendingActionRepository, ObjectMapper
 *
 * Security Considerations:
 * - PII masking is applied BEFORE the LLM call — non-negotiable.
 * - State-mutating tools NEVER execute directly; they create a PendingAction for confirmation.
 * - API errors are logged and return a safe fallback response — never expose raw error to client.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OpenRouterService {

    @Qualifier("openRouterRestTemplate")
    private final RestTemplate openRouterRestTemplate;

    private final PiiMaskingService piiMaskingService;
    private final AuditLogService auditLogService;
    private final BankingApiService bankingApiService;
    private final PayeeVerificationService payeeVerificationService;
    private final RagRetrievalService ragRetrievalService;
    private final PendingActionRepository pendingActionRepository;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.base-url:https://openrouter.ai/api/v1}")
    private String openRouterBaseUrl;

    @Value("${openrouter.model:anthropic/claude-3.5-sonnet}")
    private String model;

    /** Tool schemas loaded from classpath tool_schemas.json at startup. */
    private List<Map<String, Object>> toolSchemas;

    /**
     * State-mutating tools that MUST go through the Confirm-Before-Action gate.
     * These tools create a PendingAction instead of executing directly.
     */
    private static final Set<String> CONFIRM_REQUIRED_TOOLS = Set.of(
        "execute_transfer",
        "set_budget_alert"
    );

    // =========================================================================
    // Startup: Load Tool Schemas
    // =========================================================================

    /**
     * Loads OpenAI-compatible tool schemas from the classpath at application startup.
     * Fails gracefully — if the file is missing, the LLM is called without tool definitions.
     */
    @PostConstruct
    public void loadToolSchemas() {
        try {
            ClassPathResource resource = new ClassPathResource("tool_schemas.json");
            toolSchemas = objectMapper.readValue(
                resource.getInputStream(),
                new TypeReference<List<Map<String, Object>>>() {}
            );
            log.info("[OpenRouterService] Loaded {} tool schemas from tool_schemas.json", toolSchemas.size());
        } catch (IOException ex) {
            log.warn("[OpenRouterService] tool_schemas.json not found on classpath — " +
                "LLM will run without tool definitions. Error: {}", ex.getMessage());
            toolSchemas = new ArrayList<>();
        }
    }

    // =========================================================================
    // Main Pipeline
    // =========================================================================

    /**
     * Processes a user chat message through the full OpenRouter LLM pipeline.
     *
     * @param request ChatRequest from the frontend
     * @param userId  Authenticated user's database ID
     * @return ChatResponse with AI reply, invoked tools, optional pending action, and security flags
     */
    @Transactional
    public ChatResponse processChat(ChatRequest request, Long userId) {
        String sessionId = resolveSessionId(request.sessionId(), userId);
        String messageId = "msg-" + UUID.randomUUID().toString().substring(0, 8);

        log.info("[OpenRouterService] Processing chat. Session: {}, MessageId: {}", sessionId, messageId);

        // Step 1: Mask PII in user message before any external call
        String maskedMessage = piiMaskingService.maskPii(request.message());

        // Step 2: Retrieve RAG context (graceful degradation if unavailable)
        List<String> ragChunks = ragRetrievalService.retrieve(maskedMessage, 3);

        // Step 3: Call OpenRouter API
        auditLogService.logInfo(sessionId, "AI chat request dispatched to OpenRouter (" + model + ").");
        Map<String, Object> apiResponse = callOpenRouterApi(maskedMessage, ragChunks, sessionId);

        // Step 4: Parse and return the response
        return parseApiResponse(apiResponse, sessionId, messageId, userId);
    }

    // =========================================================================
    // OpenRouter API Call
    // =========================================================================

    @SuppressWarnings("unchecked")
    private Map<String, Object> callOpenRouterApi(
        String maskedMessage, List<String> ragChunks, String sessionId
    ) {
        Map<String, Object> payload = buildRequestPayload(maskedMessage, ragChunks);

        try {
            Map<String, Object> response = openRouterRestTemplate.postForObject(
                openRouterBaseUrl + "/chat/completions",
                payload,
                Map.class
            );
            log.debug("[OpenRouterService] OpenRouter responded. Session: {}", sessionId);
            return response != null ? response : Map.of();

        } catch (Exception ex) {
            log.error("[OpenRouterService] OpenRouter API call failed: {}", ex.getMessage());
            auditLogService.logError(sessionId,
                "OpenRouter API call failed: " + ex.getClass().getSimpleName());
            return Map.of("_error", ex.getMessage());
        }
    }

    private Map<String, Object> buildRequestPayload(String maskedMessage, List<String> ragChunks) {
        List<Map<String, Object>> messages = List.of(
            Map.of("role", "system", "content", buildSystemPrompt(ragChunks)),
            Map.of("role", "user",   "content", maskedMessage)
        );

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("messages", messages);

        // Attach tool definitions if available
        if (!toolSchemas.isEmpty()) {
            payload.put("tools", toolSchemas);
            payload.put("tool_choice", "auto");
        }

        return payload;
    }

    private String buildSystemPrompt(List<String> ragChunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are AI Financial Guardian — a secure, transparent AI assistant for Open Banking.\n\n");
        sb.append("## Core Rules\n");
        sb.append("1. NEVER execute transfers or state-changing actions without using the correct tool call.\n");
        sb.append("2. ALWAYS call verify_payee BEFORE any execute_transfer.\n");
        sb.append("3. Be fully transparent about which tools you are calling and why.\n");
        sb.append("4. Flag any suspicious transaction patterns immediately.\n");
        sb.append("5. Keep responses concise and security-focused.\n\n");

        if (!ragChunks.isEmpty()) {
            sb.append("## Relevant Knowledge Base Context\n");
            ragChunks.forEach(chunk -> sb.append("- ").append(chunk).append("\n"));
            sb.append("\n");
        }

        sb.append("Always explain your reasoning before executing financial actions.");
        return sb.toString();
    }

    // =========================================================================
    // Response Parsing
    // =========================================================================

    @SuppressWarnings("unchecked")
    private ChatResponse parseApiResponse(
        Map<String, Object> apiResponse,
        String sessionId, String messageId, Long userId
    ) {
        List<String> invokedTools = new ArrayList<>();
        List<String> securityFlags = new ArrayList<>();
        ChatResponse.PendingActionDto pendingAction = null;
        String aiText = null;

        // Handle API-level error
        if (apiResponse.containsKey("_error")) {
            return buildFallbackResponse(messageId, sessionId);
        }

        try {
            List<Map<String, Object>> choices =
                (List<Map<String, Object>>) apiResponse.get("choices");

            if (choices == null || choices.isEmpty()) {
                return buildFallbackResponse(messageId, sessionId);
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            aiText = (String) message.get("content");

            // Process tool_calls if present in the response
            List<Map<String, Object>> toolCalls =
                (List<Map<String, Object>>) message.get("tool_calls");

            if (toolCalls != null && !toolCalls.isEmpty()) {
                for (Map<String, Object> toolCall : toolCalls) {
                    Map<String, Object> function = (Map<String, Object>) toolCall.get("function");
                    String toolName       = (String) function.get("name");
                    String argumentsJson  = (String) function.get("arguments");
                    Map<String, Object> arguments = parseJsonArguments(argumentsJson);

                    invokedTools.add(toolName);

                    if (CONFIRM_REQUIRED_TOOLS.contains(toolName)) {
                        // Confirm gate: create PendingAction, do NOT execute
                        pendingAction = createPendingAction(toolName, arguments, sessionId, aiText);
                        securityFlags.add("confirm_gate_triggered");
                    } else {
                        // Execute read-only tool and append result to AI text
                        String toolResult = executeReadOnlyTool(toolName, arguments, userId, sessionId);
                        if (aiText == null || aiText.isBlank()) {
                            aiText = toolResult;
                        }
                    }
                }
            }

            // Add security flag if payee verification was performed
            if (invokedTools.contains("verify_payee")) {
                securityFlags.add("payee_verification_performed");
            }

        } catch (Exception ex) {
            log.error("[OpenRouterService] Failed to parse API response: {}", ex.getMessage());
            auditLogService.logError(sessionId, "Response parse error: " + ex.getClass().getSimpleName());
        }

        auditLogService.logInfo(sessionId,
            "AI response complete. Tools: " + invokedTools + ". Flags: " + securityFlags);

        return new ChatResponse(
            messageId,
            resolveAiText(aiText),
            invokedTools,
            pendingAction,
            securityFlags,
            LocalDateTime.now().toString()
        );
    }

    // =========================================================================
    // Tool Execution Handlers
    // =========================================================================

    private String executeReadOnlyTool(
        String toolName, Map<String, Object> arguments, Long userId, String sessionId
    ) {
        log.info("[OpenRouterService] Executing tool: {}", toolName);

        return switch (toolName) {
            case "get_balance" -> {
                var balance = bankingApiService.getBalance(userId);
                yield "Current account balance: £" + balance + " GBP";
            }
            case "get_transactions" -> {
                var summary = bankingApiService.getDashboardSummary(userId);
                yield "Retrieved " + summary.recentTransactions().size() + " recent transactions.";
            }
            case "verify_payee" -> {
                var result = payeeVerificationService.verifyPayee(
                    String.valueOf(arguments.getOrDefault("provided_name", "Unknown")),
                    String.valueOf(arguments.getOrDefault("registered_name", "Unknown")),
                    String.valueOf(arguments.getOrDefault("account_number", "")),
                    String.valueOf(arguments.getOrDefault("sort_code", "")),
                    String.valueOf(arguments.getOrDefault("bank_name", "Unknown Bank"))
                );
                yield "Payee verification complete: " + result.status()
                    + " (" + result.matchConfidence() + "% confidence). " + result.notes();
            }
            case "rag_lookup" -> {
                String query = String.valueOf(arguments.getOrDefault("query", ""));
                List<String> chunks = ragRetrievalService.retrieve(query, 3);
                yield chunks.isEmpty()
                    ? "No relevant information found in the knowledge base for this query."
                    : String.join(" | ", chunks);
            }
            case "flag_transaction" -> {
                String txId = String.valueOf(arguments.getOrDefault("transaction_id", "unknown"));
                String reason = String.valueOf(arguments.getOrDefault("reason", "Flagged by AI"));
                auditLogService.logWarning(sessionId,
                    "Transaction flagged: " + txId + " — Reason: " + reason);
                yield "Transaction " + txId + " has been flagged for review. Reason: " + reason;
            }
            default -> {
                log.warn("[OpenRouterService] Unknown tool requested: {}", toolName);
                yield "Tool '" + toolName + "' result unavailable.";
            }
        };
    }

    private ChatResponse.PendingActionDto createPendingAction(
        String toolName, Map<String, Object> arguments, String sessionId, String aiReasoning
    ) {
        String actionId = "action-" + UUID.randomUUID().toString().substring(0, 8);

        // Run payee verification for transfer actions before creating the pending action
        ChatResponse.PayeeVerificationDto vopResult = null;
        if ("execute_transfer".equals(toolName)) {
            vopResult = payeeVerificationService.verifyPayee(
                String.valueOf(arguments.getOrDefault("payee_name", "Unknown")),
                String.valueOf(arguments.getOrDefault("payee_name", "Unknown")), // same initially
                String.valueOf(arguments.getOrDefault("account_number", "")),
                String.valueOf(arguments.getOrDefault("sort_code", "")),
                String.valueOf(arguments.getOrDefault("bank_name", "Unknown Bank"))
            );

            if ("CLOSE_MATCH".equals(vopResult.status())) {
                log.warn("[OpenRouterService] CLOSE_MATCH payee verification for action: {}", actionId);
            }
        }

        // Persist the PendingAction
        try {
            PendingAction pending = PendingAction.builder()
                .actionId(actionId)
                .sessionId(sessionId)
                .type(toolName)
                .title(buildActionTitle(toolName, arguments))
                .detailsJson(objectMapper.writeValueAsString(arguments))
                .payeeVerificationJson(vopResult != null
                    ? objectMapper.writeValueAsString(vopResult) : null)
                .reasoning(aiReasoning)
                .status("PENDING")
                .build();

            pendingActionRepository.save(pending);
            log.info("[OpenRouterService] PendingAction created: {} (type: {})", actionId, toolName);

        } catch (Exception ex) {
            log.error("[OpenRouterService] Failed to persist PendingAction: {}", ex.getMessage());
        }

        return new ChatResponse.PendingActionDto(
            actionId,
            toolName,
            buildActionTitle(toolName, arguments),
            arguments,
            vopResult,
            "Action confirmation required: This operation requires your explicit authorization before execution."
        );
    }

    private String buildActionTitle(String toolName, Map<String, Object> arguments) {
        return switch (toolName) {
            case "execute_transfer"  ->
                "Authorize GBP Transfer to " + arguments.getOrDefault("payee_name", "Payee");
            case "set_budget_alert"  ->
                "Set Budget Alert: £" + arguments.getOrDefault("limit", "?")
                    + " for " + arguments.getOrDefault("category", "category");
            default -> "Confirm Action: " + toolName;
        };
    }

    // =========================================================================
    // Utilities
    // =========================================================================

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonArguments(String argumentsJson) {
        try {
            return objectMapper.readValue(argumentsJson,
                new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            log.warn("[OpenRouterService] Could not parse tool arguments JSON: {}", ex.getMessage());
            return new HashMap<>();
        }
    }

    private String resolveSessionId(String requestSessionId, Long userId) {
        if (requestSessionId != null && !requestSessionId.isBlank()) {
            return requestSessionId;
        }
        return "session-user-" + userId;
    }

    private String resolveAiText(String aiText) {
        return (aiText != null && !aiText.isBlank())
            ? aiText
            : "Your request has been processed. Please review the details above.";
    }

    private ChatResponse buildFallbackResponse(String messageId, String sessionId) {
        auditLogService.logError(sessionId, "OpenRouter returned an empty or error response — fallback used.");
        return new ChatResponse(
            messageId,
            "I'm temporarily unable to process your request. Please try again in a moment.",
            List.of(),
            null,
            List.of(),
            LocalDateTime.now().toString()
        );
    }
}
