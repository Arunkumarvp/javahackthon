package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Payee
 *
 * Purpose: JPA entity representing a Verification of Payee (VoP) check record.
 *
 * Responsibilities:
 * - Store the result of a payee name comparison against the Open Banking registry.
 * - Record match status (MATCH | CLOSE_MATCH | NO_MATCH) and confidence score.
 * - Persist masked account details for audit trail without storing sensitive PAN data.
 *
 * Dependencies:
 * - Spring Data JPA
 *
 * Security Considerations:
 * - Account number is stored masked (last 4 digits only).
 * - Sort code is stored masked (**-**-XX format).
 */
@Entity
@Table(name = "payees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provided_name", nullable = false, length = 200)
    private String providedName;

    @Column(name = "registered_name", length = 200)
    private String registeredName;

    /** Masked account number — last 4 digits visible. Example: ****5678 */
    @Column(name = "account_number_masked", length = 20)
    private String accountNumberMasked;

    /** Masked sort code — last 2 digits visible. Example: **-**-56 */
    @Column(name = "sort_code", length = 10)
    private String sortCode;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    /** VoP result: MATCH | CLOSE_MATCH | NO_MATCH */
    @Column(name = "match_status", nullable = false, length = 20)
    private String matchStatus;

    /** Fuzzy name similarity confidence score (0–100). */
    @Column(name = "match_confidence")
    private Integer matchConfidence;

    @Column(name = "verified_at", nullable = false, updatable = false)
    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onVerify() {
        this.verifiedAt = LocalDateTime.now();
    }
}
