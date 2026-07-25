package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ConsentScope
 *
 * Purpose: JPA entity representing the AI data access consent scope for a user session.
 *
 * Responsibilities:
 * - Track granted and denied permission IDs for an AI session.
 * - Store scope lifecycle status: ACTIVE | REVOKED.
 * - Record grant timestamp and expiry for time-limited consent windows.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Entity
@Table(name = "consent_scopes", indexes = {
    @Index(name = "idx_consent_session_status", columnList = "session_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsentScope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    /** Comma-separated list of granted permission IDs. */
    @Column(name = "granted_permissions", columnDefinition = "TEXT")
    private String grantedPermissions;

    /** Comma-separated list of denied permission IDs. */
    @Column(name = "denied_permissions", columnDefinition = "TEXT")
    private String deniedPermissions;

    /** Scope lifecycle: ACTIVE | REVOKED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "granted_at")
    private LocalDateTime grantedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.grantedAt = LocalDateTime.now();
        if (this.expiresAt == null) {
            // Default 48-hour consent window
            this.expiresAt = LocalDateTime.now().plusHours(48);
        }
    }
}
