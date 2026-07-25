package com.hackathon.aiguardian.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.aiguardian.dto.ChatRequest;
import com.hackathon.aiguardian.dto.ChatResponse;
import com.hackathon.aiguardian.repository.PendingActionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OpenRouterServiceTest {

    @Mock
    private RestTemplate openRouterRestTemplate;

    private PiiMaskingService piiMaskingService = new PiiMaskingService();

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private BankingApiService bankingApiService;

    @Mock
    private PayeeVerificationService payeeVerificationService;

    @Mock
    private RagRetrievalService ragRetrievalService;

    @Mock
    private PendingActionRepository pendingActionRepository;

    @Mock
    private McpToolRegistry mcpToolRegistry;

    private ObjectMapper objectMapper = new ObjectMapper();

    private OpenRouterService openRouterService;

    @BeforeEach
    void setUp() {
        openRouterService = new OpenRouterService(
            openRouterRestTemplate,
            piiMaskingService,
            auditLogService,
            bankingApiService,
            payeeVerificationService,
            ragRetrievalService,
            pendingActionRepository,
            mcpToolRegistry,
            objectMapper
        );
    }

    @Test
    void testProcessChat_WithPseudoXmlToolCall_ParsesToolAndSanitizesResponse() {
        when(ragRetrievalService.retrieve(anyString(), any(Integer.class))).thenReturn(List.of());

        String pseudoXmlContent = """
            <tool_call>
            <function=search_knowledge_base>
            <parameter=query>
            gold investment
            </parameter>
            </function>
            </tool_call>
            MCP Executed:get_balance
            <tool_call>
            <function=get_investment_rates>
            </function>
            </tool_call>
            Here is your gold investment guidance.
            """;

        Map<String, Object> mockMessage = Map.of(
            "role", "assistant",
            "content", pseudoXmlContent
        );

        Map<String, Object> mockChoice = Map.of("message", mockMessage);
        Map<String, Object> mockApiResponse = Map.of("choices", List.of(mockChoice));

        when(openRouterRestTemplate.exchange(anyString(), any(), any(), any(Class.class)))
            .thenReturn(org.springframework.http.ResponseEntity.ok(mockApiResponse));

        when(mcpToolRegistry.executeTool(anyString(), any()))
            .thenReturn(Map.of("status", "EXECUTED", "summary", "Tool executed successfully"));

        ChatRequest request = new ChatRequest("sess-1", "i plan invest in gold 50k", LocalDateTime.now().toString(), "INVESTMENT");
        ChatResponse response = openRouterService.processChat(request, 1L);

        assertNotNull(response);
        assertFalse(response.aiResponse().contains("<tool_call>"));
        assertFalse(response.aiResponse().contains("<function="));
        assertFalse(response.aiResponse().contains("MCP Executed:"));
        assertTrue(response.toolCalls().contains("search_knowledge_base"));
        assertTrue(response.toolCalls().contains("get_investment_rates"));
    }
}
