package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * SpendingLimitRule
 *
 * Purpose: JPA entity storing spending limit guardrail rules created from recommendation actions.
 *
 * Responsibilities:
 * - Persists target category, monthly limit amount, and creation timestamp.
 *
 * Dependencies:
 * - SpendingLimitRepository
 */
@Entity
@Table(name = "spending_limit_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpendingLimitRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_id", length = 64)
    private String recommendationId;

    @Column(name = "category", length = 64, nullable = false)
    private String category;

    @Column(name = "monthly_limit", precision = 10, scale = 2, nullable = false)
    private BigDecimal monthlyLimit;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
