package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.ChatRequest;
import com.hackathon.aiguardian.dto.ChatResponse;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.service.OpenRouterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * ChatController
 *
 * Purpose: REST controller handling the conversational AI chat interface.
 *
 * Responsibilities:
 * - Accept user messages and delegate to OpenRouterService for LLM processing.
 * - Return AI response, tool invocations, optional pending action, and security flags.
 *
 * Endpoints:
 * - POST /api/chat
 *
 * Dependencies:
 * - OpenRouterService
 *
 * Design Principles:
 * - Controller is a pure thin adapter — zero business logic.
 * - Authenticated user is injected via Spring Security's @AuthenticationPrincipal.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final OpenRouterService openRouterService;

    /**
     * Processes a user's chat message through the full OpenRouter LLM pipeline.
     * PII masking, RAG augmentation, tool routing, and audit logging all happen in the service layer.
     *
     * @param request           Chat message payload from the frontend
     * @param authenticatedUser The user authenticated via Bearer token
     * @return ChatResponse with AI reply and any pending financial action
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
        @Valid @RequestBody ChatRequest request,
        @AuthenticationPrincipal User authenticatedUser
    ) {
        log.info("[ChatController] Chat message received. User: {}, Length: {}",
            authenticatedUser.getUsername(), request.message().length());

        ChatResponse response = openRouterService.processChat(request, authenticatedUser.getId());
        return ResponseEntity.ok(response);
    }
}
