package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * SubscriptionEntity
 *
 * Purpose: JPA entity representing a tracked recurring subscription service.
 *
 * Responsibilities:
 * - Stores subscription cost, category, status (UNUSED, ACTIVE, CANCELLED), and usage date.
 * - Supports status filter for Review Subscriptions action modal.
 *
 * Dependencies:
 * - SubscriptionRepository
 * - RecommendationDataSeeder
 */
@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "name", length = 256, nullable = false)
    private String name;

    @Column(name = "monthly_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal monthlyCost;

    @Column(name = "status", length = 32, nullable = false)
    private String status;

    @Column(name = "last_used_date")
    private LocalDate lastUsedDate;

    @Column(name = "category", length = 64)
    private String category;

    @Column(name = "logo_emoji", length = 16)
    private String logoEmoji;
}
