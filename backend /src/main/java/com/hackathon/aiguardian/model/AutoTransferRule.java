package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * AutoTransferRule
 *
 * Purpose: JPA entity storing automated surplus transfer rules.
 *
 * Responsibilities:
 * - Persists source category, monthly amount, frequency, and creation timestamp.
 *
 * Dependencies:
 * - AutoTransferRuleRepository
 */
@Entity
@Table(name = "auto_transfer_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoTransferRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_category", length = 64, nullable = false)
    private String fromCategory;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "frequency", length = 32, nullable = false)
    private String frequency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
