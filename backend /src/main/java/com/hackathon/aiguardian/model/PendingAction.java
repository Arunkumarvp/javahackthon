package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * PendingAction
 *
 * Purpose: JPA entity representing a high-risk AI-proposed action awaiting explicit user confirmation.
 *          This entity is the backbone of the Confirm-Before-Action gate.
 *
 * Responsibilities:
 * - Persist proposed financial actions (e.g. transfers) before any execution occurs.
 * - Store action details and payee verification results as serialised JSON.
 * - Track the action lifecycle: PENDING → EXECUTED | CANCELLED.
 * - Record resolution timestamp for audit compliance.
 *
 * Dependencies:
 * - Spring Data JPA
 *
 * Design Notes:
 * - No action can transition from PENDING to EXECUTED without going through ActionController.
 * - detailsJson and payeeVerificationJson are stored as TEXT to avoid schema coupling.
 */
@Entity
@Table(name = "pending_actions", indexes = {
    @Index(name = "idx_pending_action_id", columnList = "action_id"),
    @Index(name = "idx_pending_session_status", columnList = "session_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "action_id", unique = true, nullable = false, length = 100)
    private String actionId;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    /** Tool type that generated this action, e.g. "execute_transfer", "set_budget_alert" */
    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 200)
    private String title;

    /** Serialised JSON: transfer details, amounts, payee info. */
    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    /** Serialised JSON: VoP payee verification result. */
    @Column(name = "payee_verification_json", columnDefinition = "TEXT")
    private String payeeVerificationJson;

    /** LLM reasoning text provided for this action. */
    @Column(columnDefinition = "TEXT")
    private String reasoning;

    /** Lifecycle state: PENDING | EXECUTED | CANCELLED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
