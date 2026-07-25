package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * AuditLogRepository
 *
 * Purpose: Spring Data JPA repository for AuditLogEntry persistence operations.
 *
 * Responsibilities:
 * - Persist audit events for compliance and observability.
 * - Retrieve chronological audit log entries per session.
 * - Retrieve the most recent global entries for the live audit stream.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {

    /**
     * Retrieves all audit entries for a session, most recent first.
     *
     * @param sessionId Session identifier
     * @return List of AuditLogEntry ordered by timestamp descending
     */
    List<AuditLogEntry> findBySessionIdOrderByTimestampDesc(String sessionId);

    /**
     * Retrieves the 20 most recent audit entries across all sessions.
     * Used by the frontend live audit stream widget.
     *
     * @return List of most recent AuditLogEntry records
     */
    List<AuditLogEntry> findTop20ByOrderByTimestampDesc();
}
