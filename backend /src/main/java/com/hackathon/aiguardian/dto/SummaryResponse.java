package com.hackathon.aiguardian.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * SummaryResponse
 *
 * Purpose: DTO carrying financial dashboard summary metrics to the frontend SummaryPanel.
 *
 * Responsibilities:
 * - Return current total balance, monthly spending, anomaly flag count, and recent transactions.
 *
 * Design: Immutable record. Matches frontend api.js mock structure exactly.
 */
public record SummaryResponse(

    BigDecimal totalBalance,
    String currency,
    BigDecimal monthlySpending,
    Integer securityFlagsCount,
    List<TransactionSummaryDto> recentTransactions

) {

    /**
     * Minimal transaction summary for the dashboard panel.
     * flagReason is null for non-flagged transactions.
     */
    public record TransactionSummaryDto(
        String id,
        String merchant,
        BigDecimal amount,
        String date,
        String category,
        Boolean flagged,
        String flagReason
    ) {}
}
