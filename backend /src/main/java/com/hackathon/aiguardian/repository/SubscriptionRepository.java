package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * SubscriptionRepository
 *
 * Purpose: Spring Data JPA repository for SubscriptionEntity persistence.
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, String> {

    List<SubscriptionEntity> findByStatusIgnoreCase(String status);
}
