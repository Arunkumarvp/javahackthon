package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.ScopeResponse;
import com.hackathon.aiguardian.exception.ScopeDeniedException;
import com.hackathon.aiguardian.model.ConsentScope;
import com.hackathon.aiguardian.repository.ConsentScopeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * ConsentScopeService
 *
 * Purpose: Manages and validates the AI data access consent scope for each user session.
 *
 * Responsibilities:
 * - Initialise a default consent scope on user login.
 * - Validate that a requested operation falls within the granted permissions.
 * - Support emergency scope revocation (removes all permissions immediately).
 * - Return the current scope state for display in the frontend AccessScopeIndicator.
 *
 * Dependencies:
 * - ConsentScopeRepository
 * - AuditLogService
 *
 * Security Considerations:
 * - validatePermission() throws ScopeDeniedException (HTTP 403) for any denied or missing permission.
 * - Scope expiry is checked on every permission validation — expired scopes are treated as denied.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConsentScopeService {

    private final ConsentScopeRepository consentScopeRepository;
    private final AuditLogService auditLogService;

    // Default permissions granted at session start
    private static final String DEFAULT_GRANTED =
        "read_transactions_90d,read_balances,verify_payee_registry";
    private static final String DEFAULT_DENIED =
        "execute_transfers_without_2fa,access_full_pan_cards";

    /**
     * Initialises a default consent scope for a new user session.
     * Revokes any pre-existing active scope for the same session before creating a new one.
     *
     * @param userId    The authenticated user's ID
     * @param sessionId The session identifier
     * @return The newly created ConsentScope
     */
    @Transactional
    public ConsentScope initializeScope(Long userId, String sessionId) {
        // Revoke any existing active scope for this session to prevent stale scopes
        consentScopeRepository.findBySessionIdAndStatus(sessionId, "ACTIVE")
            .ifPresent(existing -> {
                existing.setStatus("REVOKED");
                consentScopeRepository.save(existing);
            });

        ConsentScope scope = ConsentScope.builder()
            .userId(userId)
            .sessionId(sessionId)
            .grantedPermissions(DEFAULT_GRANTED)
            .deniedPermissions(DEFAULT_DENIED)
            .status("ACTIVE")
            .expiresAt(LocalDateTime.now().plusHours(48))
            .build();

        ConsentScope saved = consentScopeRepository.save(scope);
        auditLogService.logInfo(sessionId,
            "Consent scope initialised with default permissions: " + DEFAULT_GRANTED);
        log.info("[ConsentScope] Scope initialised for session: {}", sessionId);
        return saved;
    }

    /**
     * Validates that the requested permission is granted for this session.
     * This is the primary guard called by ActionController before any state-mutating operation.
     *
     * @param sessionId  Session identifier
     * @param permission Permission ID to check (e.g. "execute_transfers")
     * @throws ScopeDeniedException if permission is denied, scope is inactive, or scope is expired
     */
    public void validatePermission(String sessionId, String permission) {
        ConsentScope scope = consentScopeRepository
            .findBySessionIdAndStatus(sessionId, "ACTIVE")
            .orElseThrow(() -> new ScopeDeniedException(
                "No active consent scope found for this session. Please re-authenticate."
            ));

        // Check scope expiry
        if (scope.getExpiresAt() != null && scope.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ScopeDeniedException(
                "Consent scope has expired. Please re-authenticate to continue."
            );
        }

        boolean isGranted = scope.getGrantedPermissions() != null
            && Arrays.asList(scope.getGrantedPermissions().split(",")).contains(permission);

        if (!isGranted) {
            auditLogService.logSecurity(sessionId,
                String.format("Scope denial: operation '%s' is outside granted permissions.", permission));
            throw new ScopeDeniedException(
                String.format("Permission '%s' is not within the granted consent scope.", permission)
            );
        }

        log.debug("[ConsentScope] Permission '{}' validated for session: {}", permission, sessionId);
    }

    /**
     * Immediately revokes all AI data access for the given session.
     * Clears granted permissions and transitions scope to REVOKED status.
     *
     * @param sessionId Session identifier
     * @return Updated ScopeResponse reflecting the revoked state
     */
    @Transactional
    public ScopeResponse revokeScope(String sessionId) {
        Optional<ConsentScope> scopeOpt =
            consentScopeRepository.findBySessionIdAndStatus(sessionId, "ACTIVE");

        if (scopeOpt.isPresent()) {
            ConsentScope scope = scopeOpt.get();
            scope.setStatus("REVOKED");
            scope.setGrantedPermissions("");
            consentScopeRepository.save(scope);
            auditLogService.logSecurity(sessionId,
                "Emergency scope revocation executed by user. All AI access revoked.");
            log.warn("[ConsentScope] Scope REVOKED for session: {}", sessionId);
        }

        return new ScopeResponse(
            "scope-" + sessionId,
            "REVOKED",
            List.of(),
            List.of(DEFAULT_DENIED),
            null,
            null
        );
    }

    /**
     * Retrieves the current scope state for a session as a response DTO.
     *
     * @param sessionId Session identifier
     * @return ScopeResponse with current permission state
     */
    @Transactional(readOnly = true)
    public ScopeResponse getScope(String sessionId) {
        return consentScopeRepository
            .findBySessionIdAndStatus(sessionId, "ACTIVE")
            .map(this::mapToScopeResponse)
            .orElseGet(() -> new ScopeResponse(
                "scope-" + sessionId,
                "INACTIVE",
                buildPermissionList(List.of()),
                List.of(DEFAULT_DENIED),
                null,
                null
            ));
    }

    private ScopeResponse mapToScopeResponse(ConsentScope scope) {
        List<String> granted = scope.getGrantedPermissions() != null
            ? Arrays.asList(scope.getGrantedPermissions().split(","))
            : List.of();

        List<String> denied = scope.getDeniedPermissions() != null
            ? Arrays.asList(scope.getDeniedPermissions().split(","))
            : List.of();

        return new ScopeResponse(
            "scope-" + scope.getSessionId(),
            scope.getStatus(),
            buildPermissionList(granted),
            denied,
            scope.getGrantedAt() != null ? scope.getGrantedAt().toString() : null,
            scope.getExpiresAt() != null ? scope.getExpiresAt().toString() : null
        );
    }

    private List<ScopeResponse.PermissionDto> buildPermissionList(List<String> granted) {
        return List.of(
            new ScopeResponse.PermissionDto(
                "read_transactions_90d", "Read Transactions (Last 90 days)",
                granted.contains("read_transactions_90d")),
            new ScopeResponse.PermissionDto(
                "read_balances", "Read Account Balances",
                granted.contains("read_balances")),
            new ScopeResponse.PermissionDto(
                "verify_payee_registry", "Verification of Payee (VOP)",
                granted.contains("verify_payee_registry")),
            new ScopeResponse.PermissionDto(
                "execute_transfers", "Execute Direct Payments",
                granted.contains("execute_transfers"))
        );
    }
}
