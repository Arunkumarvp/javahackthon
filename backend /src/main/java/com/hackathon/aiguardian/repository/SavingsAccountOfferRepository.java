package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.SavingsAccountOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * SavingsAccountOfferRepository
 *
 * Purpose: Spring Data JPA repository for SavingsAccountOffer persistence.
 */
@Repository
public interface SavingsAccountOfferRepository extends JpaRepository<SavingsAccountOffer, String> {
}
