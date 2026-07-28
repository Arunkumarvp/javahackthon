package com.hackathon.aiguardian.repository;

import com.hackathon.aiguardian.model.RecommendationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * RecommendationRepository
 *
 * Purpose: Spring Data JPA repository for RecommendationEntity persistence.
 */
@Repository
public interface RecommendationRepository extends JpaRepository<RecommendationEntity, String> {

    @Query("SELECT r FROM RecommendationEntity r WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<RecommendationEntity> findWithFilters(@Param("query") String query, Pageable pageable);
}
