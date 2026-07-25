package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.exception.ScopeDeniedException;
import com.hackathon.aiguardian.model.ConsentScope;
import com.hackathon.aiguardian.repository.ConsentScopeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * ConsentScopeServiceTest
 *
 * Tests the consent scope permission validation logic.
 * Covers: granted permission passes, denied permission throws,
 * missing scope throws, and expired scope throws.
 */
@ExtendWith(MockitoExtension.class)
class ConsentScopeServiceTest {

    @Mock
    private ConsentScopeRepository consentScopeRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private ConsentScopeService consentScopeService;

    private static final String SESSION_ID = "session-testuser";

    private ConsentScope activeScope;

    @BeforeEach
    void setUp() {
        activeScope = ConsentScope.builder()
            .id(1L)
            .userId(1L)
            .sessionId(SESSION_ID)
            .grantedPermissions("read_transactions_90d,read_balances,verify_payee_registry")
            .deniedPermissions("execute_transfers_without_2fa,access_full_pan_cards")
            .status("ACTIVE")
            .grantedAt(LocalDateTime.now().minusHours(1))
            .expiresAt(LocalDateTime.now().plusHours(47))
            .build();
    }

    // ─── Happy Path ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should not throw when permission 'read_balances' is granted")
    void shouldPassWhenPermissionIsGranted() {
        when(consentScopeRepository.findBySessionIdAndStatus(SESSION_ID, "ACTIVE"))
            .thenReturn(Optional.of(activeScope));

        assertThatCode(() -> consentScopeService.validatePermission(SESSION_ID, "read_balances"))
            .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Should not throw when 'verify_payee_registry' permission is granted")
    void shouldPassForVerifyPayeeRegistryPermission() {
        when(consentScopeRepository.findBySessionIdAndStatus(SESSION_ID, "ACTIVE"))
            .thenReturn(Optional.of(activeScope));

        assertThatCode(() -> consentScopeService.validatePermission(SESSION_ID, "verify_payee_registry"))
            .doesNotThrowAnyException();
    }

    // ─── Denied Permission ────────────────────────────────────────────────────

    @Test
    @DisplayName("Should throw ScopeDeniedException for 'execute_transfers' (not in granted list)")
    void shouldThrowForDeniedPermission() {
        when(consentScopeRepository.findBySessionIdAndStatus(SESSION_ID, "ACTIVE"))
            .thenReturn(Optional.of(activeScope));
        when(auditLogService.logSecurity(anyString(), anyString())).thenReturn(null);

        assertThatThrownBy(() -> consentScopeService.validatePermission(SESSION_ID, "execute_transfers"))
            .isInstanceOf(ScopeDeniedException.class)
            .hasMessageContaining("execute_transfers");
    }

    // ─── Missing Scope ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should throw ScopeDeniedException when no active scope exists for the session")
    void shouldThrowWhenNoActiveScopeFound() {
        when(consentScopeRepository.findBySessionIdAndStatus("unknown-session", "ACTIVE"))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
            consentScopeService.validatePermission("unknown-session", "read_balances"))
            .isInstanceOf(ScopeDeniedException.class)
            .hasMessageContaining("No active consent scope");
    }

    // ─── Expired Scope ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should throw ScopeDeniedException when scope has expired")
    void shouldThrowForExpiredScope() {
        activeScope.setExpiresAt(LocalDateTime.now().minusHours(1)); // expired
        when(consentScopeRepository.findBySessionIdAndStatus(SESSION_ID, "ACTIVE"))
            .thenReturn(Optional.of(activeScope));

        assertThatThrownBy(() -> consentScopeService.validatePermission(SESSION_ID, "read_balances"))
            .isInstanceOf(ScopeDeniedException.class)
            .hasMessageContaining("expired");
    }
}
