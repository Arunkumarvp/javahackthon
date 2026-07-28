package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * RecommendationEntity
 *
 * Purpose: JPA entity representing a personalized AI financial recommendation card.
 *
 * Responsibilities:
 * - Persists metadata for spending alerts, subscription savings, interest opportunities, and budget rules.
 * - Stores priority rank, potential savings, action text, and applied status.
 *
 * Dependencies:
 * - RecommendationRepository
 * - RecommendationDataSeeder
 */
@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "type", length = 64, nullable = false)
    private String type;

    @Column(name = "title", length = 256, nullable = false)
    private String title;

    @Column(name = "category", length = 64, nullable = false)
    private String category;

    @Column(name = "description", length = 1024, nullable = false)
    private String description;

    @Column(name = "badge", length = 64)
    private String badge;

    @Column(name = "badge_style", length = 32)
    private String badgeStyle;

    @Column(name = "expected_benefit", length = 128)
    private String expectedBenefit;

    @Column(name = "action_text", length = 64)
    private String actionText;

    @Column(name = "applied", nullable = false)
    private Boolean applied;

    @Column(name = "potential_savings", precision = 10, scale = 2)
    private BigDecimal potentialSavings;

    @Column(name = "priority", nullable = false)
    private Integer priority;

    @Column(name = "as_of_date")
    private LocalDate asOfDate;

    @Column(name = "percent_change_vs_average")
    private Integer percentChangeVsAverage;

    @Column(name = "current_rate", precision = 5, scale = 2)
    private BigDecimal currentRate;

    @Column(name = "potential_rate", precision = 5, scale = 2)
    private BigDecimal potentialRate;

    @Column(name = "surplus_amount", precision = 10, scale = 2)
    private BigDecimal surplusAmount;

    @Column(name = "budget_used_percent")
    private Integer budgetUsedPercent;

    @Column(name = "from_category", length = 64)
    private String fromCategory;
}
