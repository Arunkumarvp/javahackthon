package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * AuditLogEntry
 *
 * Purpose: JPA entity representing an immutable audit trail record for all AI interactions
 *          and financial action lifecycle events in the AI Financial Guardian.
 *
 * Responsibilities:
 * - Record every AI interaction, action confirmation, scope change, and security event.
 * - Store event severity for compliance filtering: INFO | WARNING | ERROR | SECURITY.
 * - Provide a chronological, tamper-evident audit trail for regulatory compliance.
 *
 * Dependencies:
 * - Spring Data JPA
 *
 * Design Notes:
 * - Entries are append-only by convention — no update operations should be performed.
 * - timestamp is set at persistence time via @PrePersist, not client-supplied.
 */
@Entity
@Table(name = "audit_log_entries", indexes = {
    @Index(name = "idx_audit_session_id", columnList = "session_id"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String event;

    /** Event severity: INFO | WARNING | ERROR | SECURITY */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String severity = "INFO";

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onPersist() {
        // Always set server-side — client cannot inject timestamp
        this.timestamp = LocalDateTime.now();
    }
}
