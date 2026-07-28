package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.AutoTransferRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * AutoTransferRuleRepository
 *
 * Purpose: Spring Data JPA repository for AutoTransferRule persistence.
 */
@Repository
public interface AutoTransferRuleRepository extends JpaRepository<AutoTransferRule, Long> {
}
