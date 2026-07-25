package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.SpendingLimitRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * SpendingLimitRepository
 *
 * Purpose: Spring Data JPA repository for SpendingLimitRule persistence.
 */
@Repository
public interface SpendingLimitRepository extends JpaRepository<SpendingLimitRule, Long> {
}
