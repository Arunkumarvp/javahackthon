package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * RecommendationsPageDto
 *
 * Purpose: Paginated container DTO for recommendations list endpoints.
 *
 * Responsibilities:
 * - Transfers list of RecommendationDto items along with pagination metadata (page, size, totalElements, totalPages).
 *
 * Dependencies:
 * - RecommendationService
 * - RecommendationsController
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationsPageDto {

    private List<RecommendationDto> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
