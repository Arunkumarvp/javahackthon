package com.hackathon.aiguardian.dto;

/**
 * ActionConfirmationResponse
 *
 * Purpose: DTO carrying the result of an action confirmation or cancellation back to the frontend.
 *
 * Responsibilities:
 * - Return execution status (EXECUTED | CANCELLED), action ID, result message, and audit entry.
 *
 * Design: Immutable record. Matches frontend api.js mock structure exactly.
 */
public record ActionConfirmationResponse(

    /** EXECUTED | CANCELLED */
    String status,

    /** The action ID that was resolved */
    String actionId,

    /** Human-readable outcome message */
    String message,

    /** Embedded audit record confirming the event was logged for compliance */
    AuditEntryDto auditEntry

) {

    /**
     * Minimal audit entry reference included in the response for frontend display.
     */
    public record AuditEntryDto(
        String timestamp,
        String event,
        /** INFO | WARNING | ERROR | SECURITY */
        String severity
    ) {}
}
