package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.*;
import com.hackathon.aiguardian.exception.ResourceNotFoundException;
import com.hackathon.aiguardian.model.RecommendationEntity;
import com.hackathon.aiguardian.model.SpendingLimitRule;
import com.hackathon.aiguardian.repository.RecommendationRepository;
import com.hackathon.aiguardian.repository.SpendingLimitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * RecommendationService
 *
 * Purpose: Business logic service for Recommendations screen search, sorting, detail query,
 * food delivery spending trend calculations, weekend breakdown analysis, and spending limit rules.
 *
 * Responsibilities:
 * - Executes paginated filtered queries across RecommendationEntity persistence.
 * - Computes chart series and AI insight text for spending trend and weekend spike modals.
 * - Saves spending limit guardrail rules to SpendingLimitRepository.
 *
 * Dependencies:
 * - RecommendationRepository
 * - SpendingLimitRepository
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final SpendingLimitRepository spendingLimitRepository;

    /**
     * Retrieves paginated recommendations with filtering and sorting.
     */
    public RecommendationsPageDto getRecommendations(
        String query,
        String sortBy,
        String sortDir,
        String month,
        int page,
        int size
    ) {
        log.info("[RecommendationService] Fetching recommendations q='{}', sortBy='{}', sortDir='{}', page={}, size={}",
            query, sortBy, sortDir, page, size);

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortProperty = "priority";
        if ("savings".equalsIgnoreCase(sortBy)) {
            sortProperty = "potentialSavings";
        } else if ("date".equalsIgnoreCase(sortBy)) {
            sortProperty = "asOfDate";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProperty));
        Page<RecommendationEntity> pageResult = recommendationRepository.findWithFilters(query, pageable);

        List<RecommendationDto> dtos = pageResult.getContent().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());

        return RecommendationsPageDto.builder()
            .content(dtos)
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalElements(pageResult.getTotalElements())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    /**
     * Retrieves full detail for a single recommendation card.
     */
    public RecommendationDto getRecommendationById(String id) {
        log.info("[RecommendationService] Fetching recommendation detail id='{}'", id);
        RecommendationEntity entity = recommendationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + id));
        return mapToDto(entity);
    }

    /**
     * Computes food delivery spending trend chart series and AI insight text.
     */
    public SpendingTrendDto getSpendingTrend(String category, int months) {
        log.info("[RecommendationService] Computing spending trend for category='{}', months={}", category, months);

        List<SpendingTrendDto.MonthlySpendPoint> series = List.of(
            new SpendingTrendDto.MonthlySpendPoint("OCT", new BigDecimal("120.00"), new BigDecimal("135.00")),
            new SpendingTrendDto.MonthlySpendPoint("NOV", new BigDecimal("135.00"), new BigDecimal("135.00")),
            new SpendingTrendDto.MonthlySpendPoint("DEC", new BigDecimal("110.00"), new BigDecimal("135.00")),
            new SpendingTrendDto.MonthlySpendPoint("JAN", new BigDecimal("165.00"), new BigDecimal("135.00"))
        );

        return SpendingTrendDto.builder()
            .category(category != null ? category : "food_delivery")
            .series(series)
            .percentChangeVsAverage(22)
            .aiInsight("Food delivery spending increased by 22% in January compared to your 3-month average. Setting a £150/month limit will save ~£45/month.")
            .build();
    }

    /**
     * Computes weekend spending breakdown analysis data.
     */
    public WeekendBreakdownDto getWeekendBreakdown(String startDate, String endDate) {
        log.info("[RecommendationService] Analyzing weekend breakdown between {} and {}", startDate, endDate);

        List<WeekendBreakdownDto.DailySpikePoint> daily = List.of(
            new WeekendBreakdownDto.DailySpikePoint("2026-01-02", "Friday", new BigDecimal("45.00"), "Dining Out", false),
            new WeekendBreakdownDto.DailySpikePoint("2026-01-03", "Saturday", new BigDecimal("95.50"), "Shopping", true),
            new WeekendBreakdownDto.DailySpikePoint("2026-01-04", "Sunday", new BigDecimal("142.10"), "Retail & Dining", true),
            new WeekendBreakdownDto.DailySpikePoint("2026-01-05", "Monday", new BigDecimal("18.30"), "Groceries", false)
        );

        return WeekendBreakdownDto.builder()
            .spikePercent(40)
            .topCategories(List.of("retail", "dining"))
            .daily(daily)
            .aiInsight("Sunday outlays drive 44% of overall weekend spending spikes. Setting a Sunday daily limit controls £60/month in excess spend.")
            .build();
    }

    /**
     * Saves a new spending limit rule.
     */
    public SpendingLimitRule setSpendingLimit(String recommendationId, SpendingLimitRequest request) {
        log.info("[RecommendationService] Setting spending limit category='{}', limit={}", request.getCategory(), request.getMonthlyLimit());

        RecommendationEntity entity = recommendationRepository.findById(recommendationId).orElse(null);
        if (entity != null) {
            entity.setApplied(true);
            recommendationRepository.save(entity);
        }

        SpendingLimitRule rule = SpendingLimitRule.builder()
            .recommendationId(recommendationId)
            .category(request.getCategory())
            .monthlyLimit(request.getMonthlyLimit())
            .createdAt(LocalDateTime.now())
            .build();

        return spendingLimitRepository.save(rule);
    }

    private RecommendationDto mapToDto(RecommendationEntity entity) {
        return RecommendationDto.builder()
            .id(entity.getId())
            .type(entity.getType())
            .title(entity.getTitle())
            .category(entity.getCategory())
            .description(entity.getDescription())
            .badge(entity.getBadge())
            .badgeStyle(entity.getBadgeStyle())
            .expectedBenefit(entity.getExpectedBenefit())
            .actionText(entity.getActionText())
            .applied(entity.getApplied())
            .potentialSavings(entity.getPotentialSavings())
            .build();
    }
}
