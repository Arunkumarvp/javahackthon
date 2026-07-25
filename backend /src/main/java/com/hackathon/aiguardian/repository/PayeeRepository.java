package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.Payee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * PayeeRepository
 *
 * Purpose: Spring Data JPA repository for Payee VoP verification record persistence.
 *
 * Responsibilities:
 * - Persist payee verification results for audit trail.
 * - Standard CRUD operations via JpaRepository.
 *
 * Dependencies:
 * - Spring Data JPA
 */
@Repository
public interface PayeeRepository extends JpaRepository<Payee, Long> {
}
