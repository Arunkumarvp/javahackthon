package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * SavingsAccountOffer
 *
 * Purpose: JPA entity representing high-interest savings account provider offers.
 *
 * Responsibilities:
 * - Persists savings rate (AER), account type, minimum deposit, and product badges.
 *
 * Dependencies:
 * - SavingsAccountOfferRepository
 */
@Entity
@Table(name = "savings_account_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsAccountOffer {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "provider", length = 128, nullable = false)
    private String provider;

    @Column(name = "rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal rate;

    @Column(name = "type", length = 32, nullable = false)
    private String type;

    @Column(name = "min_deposit", precision = 10, scale = 2, nullable = false)
    private BigDecimal minDeposit;

    @Column(name = "term", length = 64)
    private String term;

    @Column(name = "badge", length = 64)
    private String badge;
}
