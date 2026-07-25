package com.hackathon.aiguardian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * ChatRequest
 *
 * Purpose: DTO carrying a user's conversational message to the AI Financial Guardian.
 *
 * Responsibilities:
 * - Transport session context, user message, and optional timestamp to ChatController.
 * - Enforce validation to prevent empty messages reaching the LLM pipeline.
 *
 * Design: Immutable record.
 */
public record ChatRequest(

    /** Session identifier — used to scope consent, audit, and pending actions. */
    String sessionId,

    @NotBlank(message = "Message cannot be blank")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    String message,

    /** ISO-8601 timestamp from the client — informational only. */
    String timestamp

) {}
