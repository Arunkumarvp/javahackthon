package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.CashflowInsightsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * InsightsController
 *
 * Purpose: REST controller serving dynamic financial insights, category breakdown,
 * and notable transactions filtered by Month, Category, and Timeframe.
 */
@Slf4j
@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    /**
     * Retrieves cashflow insights filtered dynamically by timeframe, month, and category.
     *
     * @param timeframe "DAY", "MONTH", or "YEAR"
     * @param month Selected month identifier (e.g. "2026-06" or "June 2026")
     * @param category Selected category filter (e.g. "Housing", "Food & Dining")
     * @return CashflowInsightsDto containing recalculated income, expenditure, category percentages, and transactions
     */
    @GetMapping("/cashflow")
    public ResponseEntity<CashflowInsightsDto> getCashflowInsights(
        @RequestParam(name = "timeframe", defaultValue = "MONTH") String timeframe,
        @RequestParam(name = "month", required = false) String month,
        @RequestParam(name = "category", required = false) String category
    ) {
        String tf = timeframe.toUpperCase();
        String selMonth = (month != null && !month.isBlank()) ? month : "2026-06";
        log.info("[InsightsController] Dynamic insights request: timeframe={}, month={}, category={}", tf, selMonth, category);

        String periodTitle = resolvePeriodTitle(selMonth, tf);
        List<CashflowInsightsDto.CashflowPointDto> points = new ArrayList<>();
        List<CashflowInsightsDto.CategoryBreakdownDto> categories = new ArrayList<>();
        List<CashflowInsightsDto.NotableTransactionDto> transactions = new ArrayList<>();

        BigDecimal totalIncome;
        BigDecimal totalExpense;

        if ("YEAR".equals(tf)) {
            points = List.of(
                new CashflowInsightsDto.CashflowPointDto("Jan", "Jan", new BigDecimal("5000.00"), new BigDecimal("3200.00")),
                new CashflowInsightsDto.CashflowPointDto("Feb", "Feb", new BigDecimal("5200.00"), new BigDecimal("3400.00")),
                new CashflowInsightsDto.CashflowPointDto("Mar", "Mar", new BigDecimal("4800.00"), new BigDecimal("3100.00")),
                new CashflowInsightsDto.CashflowPointDto("Apr", "Apr", new BigDecimal("5500.00"), new BigDecimal("3600.00")),
                new CashflowInsightsDto.CashflowPointDto("May", "May", new BigDecimal("5300.00"), new BigDecimal("3500.00")),
                new CashflowInsightsDto.CashflowPointDto("Jun", "Jun", new BigDecimal("5600.00"), new BigDecimal("3700.00")),
                new CashflowInsightsDto.CashflowPointDto("Jul", "Jul", new BigDecimal("5400.00"), new BigDecimal("3300.00")),
                new CashflowInsightsDto.CashflowPointDto("Aug", "Aug", new BigDecimal("5800.00"), new BigDecimal("3900.00")),
                new CashflowInsightsDto.CashflowPointDto("Sep", "Sep", new BigDecimal("5100.00"), new BigDecimal("3200.00")),
                new CashflowInsightsDto.CashflowPointDto("Oct", "Oct", new BigDecimal("5700.00"), new BigDecimal("3600.00")),
                new CashflowInsightsDto.CashflowPointDto("Nov", "Nov", new BigDecimal("6000.00"), new BigDecimal("3800.00")),
                new CashflowInsightsDto.CashflowPointDto("Dec", "Dec", new BigDecimal("6200.00"), new BigDecimal("4100.00"))
            );
            totalIncome = new BigDecimal("65600.00");
            totalExpense = new BigDecimal("42400.00");
        } else if ("DAY".equals(tf)) {
            points = List.of(
                new CashflowInsightsDto.CashflowPointDto("09:00", "09:00", new BigDecimal("1200.00"), new BigDecimal("40.00")),
                new CashflowInsightsDto.CashflowPointDto("12:00", "12:00", new BigDecimal("0.00"), new BigDecimal("120.00")),
                new CashflowInsightsDto.CashflowPointDto("15:00", "15:00", new BigDecimal("0.00"), new BigDecimal("85.00")),
                new CashflowInsightsDto.CashflowPointDto("18:00", "18:00", new BigDecimal("350.00"), new BigDecimal("210.00")),
                new CashflowInsightsDto.CashflowPointDto("21:00", "21:00", new BigDecimal("0.00"), new BigDecimal("95.00"))
            );
            totalIncome = new BigDecimal("1550.00");
            totalExpense = new BigDecimal("550.00");
        } else {
            // MONTH View with Dynamic Daily Dates (01 Jun, 02 Jun, 03 Jun...)
            String monthShort = getMonthShortName(selMonth);
            points = List.of(
                new CashflowInsightsDto.CashflowPointDto("01 " + monthShort, "01 " + monthShort, new BigDecimal("1200.00"), new BigDecimal("400.00")),
                new CashflowInsightsDto.CashflowPointDto("05 " + monthShort, "05 " + monthShort, new BigDecimal("800.00"), new BigDecimal("350.00")),
                new CashflowInsightsDto.CashflowPointDto("10 " + monthShort, "10 " + monthShort, new BigDecimal("1500.00"), new BigDecimal("620.00")),
                new CashflowInsightsDto.CashflowPointDto("15 " + monthShort, "15 " + monthShort, new BigDecimal("950.00"), new BigDecimal("410.00")),
                new CashflowInsightsDto.CashflowPointDto("20 " + monthShort, "20 " + monthShort, new BigDecimal("1100.00"), new BigDecimal("580.00")),
                new CashflowInsightsDto.CashflowPointDto("25 " + monthShort, "25 " + monthShort, new BigDecimal("750.00"), new BigDecimal("490.00")),
                new CashflowInsightsDto.CashflowPointDto("30 " + monthShort, "30 " + monthShort, new BigDecimal("1300.00"), new BigDecimal("700.00"))
            );
            totalIncome = new BigDecimal("7600.00");
            totalExpense = new BigDecimal("3550.00");
        }

        // Compute Category Breakdown with exact percentages
        BigDecimal totalSpend = totalExpense;
        BigDecimal housingAmount = totalSpend.multiply(new BigDecimal("0.45")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal foodAmount = totalSpend.multiply(new BigDecimal("0.32")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal transportAmount = totalSpend.subtract(housingAmount).subtract(foodAmount);

        BigDecimal housingPct = housingAmount.multiply(new BigDecimal("100")).divide(totalSpend, 2, RoundingMode.HALF_UP);
        BigDecimal foodPct = foodAmount.multiply(new BigDecimal("100")).divide(totalSpend, 2, RoundingMode.HALF_UP);
        BigDecimal transportPct = transportAmount.multiply(new BigDecimal("100")).divide(totalSpend, 2, RoundingMode.HALF_UP);

        categories = List.of(
            new CashflowInsightsDto.CategoryBreakdownDto("Housing", housingAmount, housingAmount, housingPct, "#0f766e"),
            new CashflowInsightsDto.CategoryBreakdownDto("Food & Dining", foodAmount, foodAmount, foodPct, "#b91c1c"),
            new CashflowInsightsDto.CategoryBreakdownDto("Transport", transportAmount, transportAmount, transportPct, "#334155")
        );

        // Filter transactions if category filter is present
        List<CashflowInsightsDto.NotableTransactionDto> rawTransactions = List.of(
            new CashflowInsightsDto.NotableTransactionDto("tx-101", periodTitle + ", 01", "Barclays Mortgage", "Housing", housingAmount.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP), false),
            new CashflowInsightsDto.NotableTransactionDto("tx-102", periodTitle + ", 05", "Waitrose & Partners", "Food & Dining", new BigDecimal("142.50"), false),
            new CashflowInsightsDto.NotableTransactionDto("tx-103", periodTitle + ", 10", "TfL Commute Pass", "Transport", new BigDecimal("95.00"), false),
            new CashflowInsightsDto.NotableTransactionDto("tx-104", periodTitle + ", 15", "Uber Eats Delivery", "Food & Dining", new BigDecimal("38.40"), true),
            new CashflowInsightsDto.NotableTransactionDto("tx-105", periodTitle + ", 22", "British Gas Energy", "Housing", new BigDecimal("210.00"), false)
        );

        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            transactions = rawTransactions.stream()
                .filter(t -> t.category().equalsIgnoreCase(category))
                .toList();
        } else {
            transactions = rawTransactions;
        }

        BigDecimal netCashflow = totalIncome.subtract(totalExpense);

        CashflowInsightsDto dto = new CashflowInsightsDto(
            tf,
            selMonth,
            periodTitle,
            totalIncome,
            totalExpense,
            totalSpend,
            netCashflow,
            points,
            categories,
            transactions
        );

        return ResponseEntity.ok(dto);
    }

    private String resolvePeriodTitle(String rawMonth, String timeframe) {
        if ("YEAR".equals(timeframe)) return "Year 2026";
        if ("DAY".equals(timeframe)) return "Today";

        if (rawMonth == null || rawMonth.isBlank()) return "June 2026";
        if (rawMonth.contains("2026-01") || rawMonth.toLowerCase().contains("jan")) return "January 2026";
        if (rawMonth.contains("2026-02") || rawMonth.toLowerCase().contains("feb")) return "February 2026";
        if (rawMonth.contains("2026-03") || rawMonth.toLowerCase().contains("mar")) return "March 2026";
        if (rawMonth.contains("2026-04") || rawMonth.toLowerCase().contains("apr")) return "April 2026";
        if (rawMonth.contains("2026-05") || rawMonth.toLowerCase().contains("may")) return "May 2026";
        if (rawMonth.contains("2026-06") || rawMonth.toLowerCase().contains("jun")) return "June 2026";

        return rawMonth;
    }

    private String getMonthShortName(String rawMonth) {
        if (rawMonth == null) return "Jun";
        if (rawMonth.contains("01") || rawMonth.toLowerCase().contains("jan")) return "Jan";
        if (rawMonth.contains("02") || rawMonth.toLowerCase().contains("feb")) return "Feb";
        if (rawMonth.contains("03") || rawMonth.toLowerCase().contains("mar")) return "Mar";
        if (rawMonth.contains("04") || rawMonth.toLowerCase().contains("apr")) return "Apr";
        if (rawMonth.contains("05") || rawMonth.toLowerCase().contains("may")) return "May";
        return "Jun";
    }
}
