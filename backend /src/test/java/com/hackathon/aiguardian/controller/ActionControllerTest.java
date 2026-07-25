package com.hackathon.aiguardian.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.aiguardian.dto.ActionConfirmationRequest;
import com.hackathon.aiguardian.model.PendingAction;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.repository.PendingActionRepository;
import com.hackathon.aiguardian.service.AuditLogService;
import com.hackathon.aiguardian.service.BankingApiService;
import com.hackathon.aiguardian.service.ConsentScopeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ActionControllerTest
 *
 * Integration tests for the Confirm-Before-Action gate.
 * Validates that:
 * - Only PENDING actions can be confirmed or cancelled.
 * - Actions not found return 400.
 * - Already-executed actions return 400.
 */
@WebMvcTest(ActionController.class)
class ActionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PendingActionRepository pendingActionRepository;

    @MockBean
    private ConsentScopeService consentScopeService;

    @MockBean
    private BankingApiService bankingApiService;

    @MockBean
    private AuditLogService auditLogService;

    // ─── Helper ───────────────────────────────────────────────────────────────

    private UsernamePasswordAuthenticationToken mockAuthUser() {
        User user = User.builder()
            .id(1L)
            .username("testuser")
            .password("hashed")
            .sessionToken("guardian-token123")
            .build();
        return new UsernamePasswordAuthenticationToken(user, null, List.of());
    }

    // ─── Not Found ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return 400 BAD_REQUEST when action ID is not found")
    void shouldReturn400WhenActionNotFound() throws Exception {
        when(pendingActionRepository.findByActionId("unknown-action"))
            .thenReturn(Optional.empty());

        ActionConfirmationRequest request = new ActionConfirmationRequest(
            "session-testuser", "unknown-action", true, null
        );

        mockMvc.perform(post("/api/actions/confirm")
                .with(csrf())
                .with(authentication(mockAuthUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("INVALID_REQUEST"));
    }

    // ─── Already Executed ─────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return 400 BAD_REQUEST when action is already EXECUTED")
    void shouldReturn400WhenActionAlreadyExecuted() throws Exception {
        PendingAction alreadyExecuted = PendingAction.builder()
            .actionId("action-123")
            .status("EXECUTED")
            .sessionId("session-testuser")
            .title("Test Action")
            .type("execute_transfer")
            .build();

        when(pendingActionRepository.findByActionId("action-123"))
            .thenReturn(Optional.of(alreadyExecuted));

        ActionConfirmationRequest request = new ActionConfirmationRequest(
            "session-testuser", "action-123", true, null
        );

        mockMvc.perform(post("/api/actions/confirm")
                .with(csrf())
                .with(authentication(mockAuthUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("INVALID_REQUEST"));
    }

    // ─── Already Cancelled ────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return 400 BAD_REQUEST when action is already CANCELLED")
    void shouldReturn400WhenActionAlreadyCancelled() throws Exception {
        PendingAction alreadyCancelled = PendingAction.builder()
            .actionId("action-456")
            .status("CANCELLED")
            .sessionId("session-testuser")
            .title("Test Action")
            .type("execute_transfer")
            .build();

        when(pendingActionRepository.findByActionId("action-456"))
            .thenReturn(Optional.of(alreadyCancelled));

        ActionConfirmationRequest request = new ActionConfirmationRequest(
            "session-testuser", "action-456", false, null
        );

        mockMvc.perform(post("/api/actions/confirm")
                .with(csrf())
                .with(authentication(mockAuthUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
