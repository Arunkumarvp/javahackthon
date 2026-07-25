package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.SummaryResponse;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.service.BankingApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * TransactionController
 *
 * Purpose: REST controller providing financial dashboard summary metrics.
 *
 * Responsibilities:
 * - Return current balance, monthly spending, security flag count, and recent transactions.
 *
 * Endpoints:
 * - GET /api/summary
 *
 * Dependencies:
 * - BankingApiService
 *
 * Design Principles:
 * - Thin controller: delegates all data retrieval to BankingApiService.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {

    private final BankingApiService bankingApiService;

    /**
     * Retrieves the financial dashboard summary for the authenticated user.
     * Seeds demo transactions on first call if the user has none.
     *
     * @param authenticatedUser The user authenticated via Bearer token
     * @return SummaryResponse with balance, monthly spending, and recent transactions
     */
    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary(
        @AuthenticationPrincipal User authenticatedUser
    ) {
        log.info("[TransactionController] Summary requested by user: {}", authenticatedUser.getUsername());
        SummaryResponse summary = bankingApiService.getDashboardSummary(authenticatedUser.getId());
        return ResponseEntity.ok(summary);
    }
}
