package com.hackathon.aiguardian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * ActionConfirmationRequest
 *
 * Purpose: DTO carrying the user's explicit confirm or cancel decision for a pending action.
 *
 * Responsibilities:
 * - Transport action ID, session context, and the user's binary decision to ActionController.
 *
 * Design: Immutable record. Both fields are required — no ambiguous default behaviour.
 */
public record ActionConfirmationRequest(

    /** Session identifier for scope validation and audit logging. */
    String sessionId,

    @NotBlank(message = "Action ID is required")
    String actionId,

    /** true = confirm and execute; false = cancel the action. */
    @NotNull(message = "Confirmation decision (confirmed: true/false) is required")
    Boolean confirmed,

    /** Client-supplied timestamp — informational only. */
    String timestamp

) {}
