package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.model.AuditLogEntry;
import com.hackathon.aiguardian.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AuditLogService
 *
 * Purpose: Manages creation and retrieval of the compliance audit trail for all AI interactions
 *          and financial action lifecycle events.
 *
 * Responsibilities:
 * - Persist audit events with appropriate severity levels (INFO, WARNING, ERROR, SECURITY).
 * - Retrieve session-scoped audit entries for per-session review.
 * - Retrieve the 20 most recent global entries for the live audit stream widget.
 *
 * Dependencies:
 * - AuditLogRepository
 *
 * Design Principles:
 * - Single Responsibility: only handles audit persistence and retrieval.
 * - All other services call this service — it never calls them back.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Records an INFO-level audit event for routine operations.
     *
     * @param sessionId Session identifier
     * @param event     Human-readable event description
     * @return The persisted AuditLogEntry
     */
    @Transactional
    public AuditLogEntry logInfo(String sessionId, String event) {
        return persistLog(sessionId, event, "INFO");
    }

    /**
     * Records a WARNING-level audit event for notable but non-critical events.
     *
     * @param sessionId Session identifier
     * @param event     Human-readable event description
     * @return The persisted AuditLogEntry
     */
    @Transactional
    public AuditLogEntry logWarning(String sessionId, String event) {
        return persistLog(sessionId, event, "WARNING");
    }

    /**
     * Records a SECURITY-level audit event for scope violations and security decisions.
     *
     * @param sessionId Session identifier
     * @param event     Human-readable event description
     * @return The persisted AuditLogEntry
     */
    @Transactional
    public AuditLogEntry logSecurity(String sessionId, String event) {
        return persistLog(sessionId, event, "SECURITY");
    }

    /**
     * Records an ERROR-level audit event for service failures.
     *
     * @param sessionId Session identifier
     * @param event     Human-readable event description
     * @return The persisted AuditLogEntry
     */
    @Transactional
    public AuditLogEntry logError(String sessionId, String event) {
        return persistLog(sessionId, event, "ERROR");
    }

    /**
     * Retrieves all audit entries for a session, most recent first.
     *
     * @param sessionId Session identifier
     * @return Ordered list of AuditLogEntry records
     */
    @Transactional(readOnly = true)
    public List<AuditLogEntry> getSessionAuditLog(String sessionId) {
        return auditLogRepository.findBySessionIdOrderByTimestampDesc(sessionId);
    }

    /**
     * Retrieves the 20 most recent audit entries across all sessions.
     * Used by the frontend live audit stream widget.
     *
     * @return List of recent AuditLogEntry records
     */
    @Transactional(readOnly = true)
    public List<AuditLogEntry> getRecentAuditLog() {
        return auditLogRepository.findTop20ByOrderByTimestampDesc();
    }

    private AuditLogEntry persistLog(String sessionId, String event, String severity) {
        AuditLogEntry entry = AuditLogEntry.builder()
            .sessionId(sessionId)
            .event(event)
            .severity(severity)
            .build();

        AuditLogEntry saved = auditLogRepository.save(entry);
        log.info("[AuditLog][{}] {} — {}", severity, sessionId, event);
        return saved;
    }
}
