package com.hackathon.aiguardian.dto;

import java.math.BigDecimal;

/**
 * RecommendationDto
 *
 * Purpose: DTO carrying personalized AI financial optimization recommendations,
 * badges, expected benefit calculations, and action triggers.
 */
public record RecommendationDto(

    String id,
    String title,
    String category,
    String description,
    String badge,                // e.g. "Spending Alert", "OPPORTUNITY", "SAVINGS"
    String badgeStyle,           // "alert" | "info" | "success"
    String expectedBenefit,      // e.g. "Potential savings: £45/month"
    String actionText,           // e.g. "Set Limit", "Cancel Subscription", "Create Auto-Transfer"
    Boolean applied,
    BigDecimal potentialSavings

) {}
