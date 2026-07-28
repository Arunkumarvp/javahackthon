package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * WeekendBreakdownDto
 *
 * Purpose: DTO for weekend spike breakdown analysis modal.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeekendBreakdownDto {

    private Integer spikePercent;
    private List<String> topCategories;
    private List<DailySpikePoint> daily;
    private String aiInsight;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySpikePoint {
        private String date;
        private String day;
        private BigDecimal amount;
        private String category;
        private Boolean isWeekend;
    }
}
