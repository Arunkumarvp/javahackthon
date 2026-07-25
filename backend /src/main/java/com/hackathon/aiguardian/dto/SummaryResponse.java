package com.hackathon.aiguardian.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * SummaryResponse
 *
 * Purpose: DTO carrying financial dashboard summary metrics and dynamic chart analytics to the frontend.
 */
public record SummaryResponse(

    BigDecimal totalBalance,
    String currency,
    BigDecimal monthlySpending,
    BigDecimal totalIncome,
    BigDecimal totalSavings,
    Integer securityFlagsCount,
    List<TransactionSummaryDto> recentTransactions,
    List<ChartDataDto> barChartData,
    List<ChartDataDto> lineChartData

) {

    /**
     * Transaction summary DTO for the dashboard panel.
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

    /**
     * Generic data point DTO for dashboard charts.
     */
    public record ChartDataDto(
        String name,
        BigDecimal value,
        Boolean active
    ) {}
}
