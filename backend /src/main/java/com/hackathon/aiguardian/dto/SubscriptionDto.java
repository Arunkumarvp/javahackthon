package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * SubscriptionDto
 *
 * Purpose: DTO representing a tracked recurring subscription service.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDto {

    private String id;
    private String name;
    private BigDecimal monthlyCost;
    private String status;
    private String lastUsedDate;
    private String category;
    private String logoEmoji;
}
