package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction
 *
 * Purpose: JPA entity representing a bank transaction associated with a user account.
 *
 * Responsibilities:
 * - Store transaction metadata: merchant, amount, currency, category, and date.
 * - Track flagged/anomalous status with human-readable reason.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_user_id", columnList = "user_id"),
    @Index(name = "idx_transaction_flagged", columnList = "flagged")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 200)
    private String merchant;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(length = 100)
    private String category;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    /** True if flagged for anomaly detection or manual review. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean flagged = false;

    @Column(name = "flag_reason", length = 500)
    private String flagReason;
}
