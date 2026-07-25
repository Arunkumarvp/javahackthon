package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * RecommendationDto
 *
 * Purpose: Data Transfer Object representing a single recommendation card.
 *
 * Responsibilities:
 * - Transfers recommendation title, category, description, badge, expectedBenefit, and action metadata to API consumers.
 *
 * Dependencies:
 * - RecommendationService
 * - RecommendationsController
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDto {

    private String id;
    private String type;
    private String title;
    private String category;
    private String description;
    private String badge;
    private String badgeStyle;
    private String expectedBenefit;
    private String actionText;
    private Boolean applied;
    private BigDecimal potentialSavings;

    public RecommendationDto(
        String id,
        String title,
        String category,
        String description,
        String badge,
        String badgeStyle,
        String expectedBenefit,
        String actionText,
        Boolean applied,
        BigDecimal potentialSavings
    ) {
        this.id = id;
        this.type = "RECOMMENDATION";
        this.title = title;
        this.category = category;
        this.description = description;
        this.badge = badge;
        this.badgeStyle = badgeStyle;
        this.expectedBenefit = expectedBenefit;
        this.actionText = actionText;
        this.applied = applied;
        this.potentialSavings = potentialSavings;
    }
}
