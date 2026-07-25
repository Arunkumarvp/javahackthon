package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.PendingAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PendingActionRepository
 *
 * Purpose: Spring Data JPA repository for PendingAction entity persistence — core of the confirm gate.
 *
 * Responsibilities:
 * - Look up specific pending actions by their unique actionId.
 * - Retrieve all actions for a session filtered by status.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface PendingActionRepository extends JpaRepository<PendingAction, Long> {

    /**
     * Finds a pending action by its unique action identifier.
     * Used by ActionController to resolve confirm/cancel requests.
     *
     * @param actionId The unique action ID string
     * @return Optional PendingAction
     */
    Optional<PendingAction> findByActionId(String actionId);

    /**
     * Finds all actions for a session with a specific status.
     *
     * @param sessionId Session identifier
     * @param status    Action status: PENDING | EXECUTED | CANCELLED
     * @return List of matching PendingAction entities
     */
    List<PendingAction> findBySessionIdAndStatus(String sessionId, String status);
}
