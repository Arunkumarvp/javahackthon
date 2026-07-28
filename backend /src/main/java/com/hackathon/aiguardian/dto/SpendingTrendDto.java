package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * SpendingTrendDto
 *
 * Purpose: DTO for food delivery spending trend chart series and AI insight text.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpendingTrendDto {

    private String category;
    private List<MonthlySpendPoint> series;
    private Integer percentChangeVsAverage;
    private String aiInsight;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlySpendPoint {
        private String month;
        private BigDecimal amount;
        private BigDecimal average;
    }
}
