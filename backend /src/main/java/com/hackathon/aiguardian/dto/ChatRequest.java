package com.hackathon.aiguardian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * ChatRequest
 *
 * Purpose: DTO carrying a user's conversational message, target agent type, and session metadata.
 */
public record ChatRequest(

    String sessionId,

    @NotBlank(message = "Message cannot be blank")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    String message,

    String timestamp,

    /** Specialized agent identifier: GENERAL | BUDGET | INVESTMENT | TAX */
    String agentType

) {}
