package com.hackathon.aiguardian.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * User
 *
 * Purpose: JPA entity representing an authenticated user of the AI Financial Guardian system.
 *
 * Responsibilities:
 * - Store user credentials: username and bcrypt-hashed password.
 * - Hold the session token issued at login for Bearer token authentication.
 * - Track account creation timestamp.
 *
 * Dependencies:
 * - Spring Data JPA
 *
 * Security Considerations:
 * - Password field MUST always contain a bcrypt hash — never plaintext.
 * - sessionToken is a random UUID string — rotated on every login.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    /**
     * BCrypt-hashed password.
     * Never stored in plain text. Never logged.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Session bearer token issued at login.
     * Cleared on logout. Rotated on each login.
     */
    @Column(name = "session_token", unique = true, length = 100)
    private String sessionToken;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
