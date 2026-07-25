package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TransactionRepository
 *
 * Purpose: Spring Data JPA repository for Transaction entity persistence operations.
 *
 * Responsibilities:
 * - Retrieve transactions by user ID, ordered by date.
 * - Query flagged/anomalous transactions for the security summary panel.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Finds all transactions for a specific user, ordered by date descending (most recent first).
     *
     * @param userId User's database ID
     * @return List of transactions
     */
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    /**
     * Finds only flagged/anomalous transactions for a user.
     *
     * @param userId User's database ID
     * @return List of flagged transactions
     */
    List<Transaction> findByUserIdAndFlaggedTrue(Long userId);
}
