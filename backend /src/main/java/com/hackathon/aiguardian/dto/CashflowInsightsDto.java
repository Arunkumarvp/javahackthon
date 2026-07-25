package com.hackathon.aiguardian.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * CashflowInsightsDto
 *
 * Purpose: DTO carrying dynamic cashflow analytics (income vs expenditure),
 * category breakdown with percentage calculations, and filtered notable transactions for the Insights page.
 */
public record CashflowInsightsDto(

    String timeframe,             // "DAY" | "MONTH" | "YEAR"
    String selectedMonth,         // e.g. "2026-06" or "June 2026"
    String formattedPeriodTitle,  // e.g. "June 2026"
    BigDecimal totalIncome,
    BigDecimal totalExpense,
    BigDecimal totalSpend,
    BigDecimal netCashflow,
    List<CashflowPointDto> chartData,
    List<CategoryBreakdownDto> categoryBreakdown,
    List<NotableTransactionDto> notableTransactions

) {

    /**
     * Individual data point for cashflow charts.
     */
    public record CashflowPointDto(
        String date,              // e.g. "01 Jun", "02 Jun"
        String name,
        BigDecimal income,
        BigDecimal expense
    ) {}

    /**
     * Category expense breakdown item.
     */
    public record CategoryBreakdownDto(
        String name,
        BigDecimal amount,
        BigDecimal value,
        BigDecimal percentage,
        String color
    ) {}

    /**
     * Notable transaction summary.
     */
    public record NotableTransactionDto(
        String id,
        String date,
        String description,
        String category,
        BigDecimal amount,
        Boolean warning
    ) {}
}
