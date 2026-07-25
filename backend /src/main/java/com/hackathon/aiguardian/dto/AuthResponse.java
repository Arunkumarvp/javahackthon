package com.hackathon.aiguardian.dto;

/**
 * AuthResponse
 *
 * Purpose: DTO carrying authentication result back to the client.
 *
 * Responsibilities:
 * - Return authentication status, user info, and session Bearer token.
 * - Match the response structure expected by the frontend api.js mock layer.
 *
 * Design: Immutable record with nested UserInfo record.
 */
public record AuthResponse(

    /** SUCCESS or FAILED */
    String status,

    /** Authenticated user details */
    UserInfo user,

    /** Bearer token for subsequent authenticated requests */
    String token,

    String message

) {

    /**
     * Minimal user information returned on successful authentication.
     * Deliberately excludes sensitive fields such as password hash.
     */
    public record UserInfo(String username) {}
}
