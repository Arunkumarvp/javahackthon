package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.ScopeResponse;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.service.ConsentScopeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ScopeController
 *
 * Purpose: REST controller managing AI data access consent scope.
 *
 * Responsibilities:
 * - Return the current consent scope permissions for the frontend AccessScopeIndicator component.
 * - Handle emergency scope revocation (user-initiated "kill switch" for AI data access).
 *
 * Endpoints:
 * - GET  /api/scope        — Retrieve current scope state
 * - POST /api/scope/revoke — Immediately revoke all AI data access
 *
 * Dependencies:
 * - ConsentScopeService
 *
 * Design Principles:
 * - Thin controller: delegates all scope logic to ConsentScopeService.
 */
@Slf4j
@RestController
@RequestMapping("/api/scope")
@RequiredArgsConstructor
public class ScopeController {

    private final ConsentScopeService consentScopeService;

    /**
     * Returns the current AI data access consent scope for the authenticated user's session.
     *
     * @param authenticatedUser The user authenticated via Bearer token
     * @return ScopeResponse with all permissions, denied list, and expiry
     */
    @GetMapping
    public ResponseEntity<ScopeResponse> getScope(
        @AuthenticationPrincipal User authenticatedUser
    ) {
        String sessionId = "session-" + authenticatedUser.getUsername();
        log.info("[ScopeController] Scope requested for user: {}", authenticatedUser.getUsername());
        ScopeResponse scope = consentScopeService.getScope(sessionId);
        return ResponseEntity.ok(scope);
    }

    /**
     * Immediately revokes all AI data access permissions for the current session.
     * This is the user-facing "emergency stop" for AI access.
     *
     * @param authenticatedUser The user authenticated via Bearer token
     * @return Revoked ScopeResponse confirming all permissions have been removed
     */
    @PostMapping("/revoke")
    public ResponseEntity<ScopeResponse> revokeScope(
        @RequestBody(required = false) Map<String, String> body,
        @AuthenticationPrincipal User authenticatedUser
    ) {
        String sessionId = "session-" + authenticatedUser.getUsername();
        log.warn("[ScopeController] Emergency scope revocation by user: {}", authenticatedUser.getUsername());
        ScopeResponse revoked = consentScopeService.revokeScope(sessionId);
        return ResponseEntity.ok(revoked);
    }
}
