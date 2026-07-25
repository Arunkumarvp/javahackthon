package com.hackathon.aiguardian.dto;

import java.util.List;
import java.util.Map;

/**
 * ChatResponse
 *
 * Purpose: DTO carrying the LLM response, tool call metadata, and any pending action
 *          back to the frontend after an AI chat interaction.
 *
 * Responsibilities:
 * - Return the LLM's text reply to the user.
 * - List the tool names invoked during the AI processing pipeline.
 * - Carry any PendingAction requiring explicit user confirmation.
 * - Report security flags raised during processing.
 *
 * Design: Immutable record with nested DTOs. Matches frontend api.js mock structure exactly.
 */
public record ChatResponse(

    /** Unique message identifier (e.g. "msg-a1b2c3d4") */
    String messageId,

    /** The LLM's text response to the user */
    String aiResponse,

    /** List of tool names invoked (e.g. ["get_balance", "verify_payee"]) */
    List<String> toolCalls,

    /** Non-null when a state-mutating action requires user confirmation */
    PendingActionDto pendingAction,

    /** Security flags raised (e.g. ["payee_close_match", "confirm_gate_triggered"]) */
    List<String> securityFlags,

    /** ISO-8601 server timestamp */
    String timestamp

) {

    /**
     * Pending action details — shown in ConfirmActionModal on the frontend.
     */
    public record PendingActionDto(
        String actionId,
        String type,
        String title,
        Map<String, Object> details,
        PayeeVerificationDto payeeVerification,
        String reasoning
    ) {}

    /**
     * Verification of Payee (VoP) result embedded in the pending action.
     */
    public record PayeeVerificationDto(
        /** MATCH | CLOSE_MATCH | NO_MATCH */
        String status,
        String providedName,
        String registeredName,
        Integer matchConfidence,
        String notes
    ) {}
}
