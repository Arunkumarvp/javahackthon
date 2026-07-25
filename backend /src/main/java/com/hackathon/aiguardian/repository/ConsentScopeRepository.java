package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.ConsentScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ConsentScopeRepository
 *
 * Purpose: Spring Data JPA repository for ConsentScope entity persistence operations.
 *
 * Responsibilities:
 * - Retrieve the active consent scope for a given session.
 * - Support scope revocation and session-scoped queries.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface ConsentScopeRepository extends JpaRepository<ConsentScope, Long> {

    /**
     * Finds the active consent scope for a session.
     * Used by ConsentScopeService to validate permissions and by revokeScope.
     *
     * @param sessionId Session identifier
     * @param status    Scope status to filter by (e.g. "ACTIVE")
     * @return Optional ConsentScope
     */
    Optional<ConsentScope> findBySessionIdAndStatus(String sessionId, String status);
}
