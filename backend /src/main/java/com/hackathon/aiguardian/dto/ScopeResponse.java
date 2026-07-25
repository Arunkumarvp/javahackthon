package com.hackathon.aiguardian.dto;

import java.util.List;

/**
 * ScopeResponse
 *
 * Purpose: DTO carrying the current AI data access consent scope state to the frontend
 *          AccessScopeIndicator component.
 *
 * Responsibilities:
 * - Return scope ID, lifecycle status, granted/denied permission lists, and validity window.
 *
 * Design: Immutable record. Matches frontend api.js mock structure exactly.
 */
public record ScopeResponse(

    /** Unique scope identifier string */
    String scopeId,

    /** Scope lifecycle: ACTIVE | REVOKED | INACTIVE */
    String status,

    /** Full list of permissions with their granted/denied state */
    List<PermissionDto> permissions,

    /** List of explicitly denied permission IDs */
    List<String> denied,

    /** ISO-8601 string of when the scope was granted */
    String grantedAt,

    /** ISO-8601 string of when the scope expires */
    String expiresAt

) {

    /**
     * Individual permission entry with its current grant state.
     */
    public record PermissionDto(
        /** Machine-readable permission identifier */
        String id,
        /** Human-readable label for UI display */
        String label,
        /** true if this permission is currently granted */
        Boolean granted
    ) {}
}
