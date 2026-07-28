package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.*;
import com.hackathon.aiguardian.model.SpendingLimitRule;
import com.hackathon.aiguardian.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * RecommendationsController
 *
 * Purpose: REST controller delivering dynamic personalized AI financial optimization recommendations,
 * card details, spending trends, weekend breakdowns, and spending limit actions.
 *
 * Responsibilities:
 * - GET /api/recommendations (supports search `q`, `sortBy`, `sortDir`, `month`, `page`, `size`)
 * - GET /api/recommendations/spending-trend
 * - GET /api/recommendations/weekend-spike/breakdown
 * - GET /api/recommendations/{id}
 * - POST /api/recommendations/{id}/spending-limit
 * - POST /api/recommendations/{id}/apply
 *
 * Dependencies:
 * - RecommendationService
 */
@Slf4j
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationsController {

    private final RecommendationService recommendationService;

    /**
     * Retrieves paginated, filtered recommendations.
     */
    @GetMapping
    public ResponseEntity<RecommendationsPageDto> getRecommendations(
        @RequestParam(required = false, defaultValue = "") String q,
        @RequestParam(required = false, defaultValue = "priority") String sortBy,
        @RequestParam(required = false, defaultValue = "asc") String sortDir,
        @RequestParam(required = false) String month,
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "10") int size
    ) {
        log.info("[RecommendationsController] GET /api/recommendations q='{}', sortBy='{}', sortDir='{}', page={}",
            q, sortBy, sortDir, page);
        RecommendationsPageDto pageDto = recommendationService.getRecommendations(q, sortBy, sortDir, month, page, size);
        return ResponseEntity.ok(pageDto);
    }

    /**
     * Retrieves spending trend chart series and AI insight text.
     */
    @GetMapping("/spending-trend")
    public ResponseEntity<SpendingTrendDto> getSpendingTrend(
        @RequestParam(required = false, defaultValue = "food_delivery") String category,
        @RequestParam(required = false, defaultValue = "4") int months
    ) {
        log.info("[RecommendationsController] GET /api/recommendations/spending-trend category='{}', months={}", category, months);
        return ResponseEntity.ok(recommendationService.getSpendingTrend(category, months));
    }

    /**
     * Retrieves weekend spending spike breakdown.
     */
    @GetMapping("/weekend-spike/breakdown")
    public ResponseEntity<WeekendBreakdownDto> getWeekendBreakdown(
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate
    ) {
        log.info("[RecommendationsController] GET /api/recommendations/weekend-spike/breakdown");
        return ResponseEntity.ok(recommendationService.getWeekendBreakdown(startDate, endDate));
    }

    /**
     * Retrieves full detail for a single recommendation by ID.
     */
    @GetMapping("/{id:[a-zA-Z0-9_\\-]+}")
    public ResponseEntity<RecommendationDto> getRecommendationById(@PathVariable String id) {
        log.info("[RecommendationsController] GET /api/recommendations/{}", id);
        return ResponseEntity.ok(recommendationService.getRecommendationById(id));
    }

    /**
     * Posts a new spending limit rule for a recommendation.
     */
    @PostMapping("/{id:[a-zA-Z0-9_\\-]+}/spending-limit")
    public ResponseEntity<Map<String, Object>> setSpendingLimit(
        @PathVariable String id,
        @Valid @RequestBody SpendingLimitRequest request
    ) {
        log.info("[RecommendationsController] POST /api/recommendations/{}/spending-limit category='{}', limit={}",
            id, request.getCategory(), request.getMonthlyLimit());

        SpendingLimitRule rule = recommendationService.setSpendingLimit(id, request);
        return ResponseEntity.ok(Map.of(
            "id", rule.getId(),
            "recommendationId", id,
            "category", rule.getCategory(),
            "monthlyLimit", rule.getMonthlyLimit(),
            "status", "ACTIVE",
            "message", "Spending limit rule set successfully! AI Guardian automation active."
        ));
    }

    /**
     * Applies a recommendation action.
     */
    @PostMapping("/{id:[a-zA-Z0-9_\\-]+}/apply")
    public ResponseEntity<Map<String, Object>> applyRecommendation(@PathVariable String id) {
        log.info("[RecommendationsController] POST /api/recommendations/{}/apply", id);
        return ResponseEntity.ok(Map.of(
            "id", id,
            "status", "APPLIED",
            "message", "Recommendation successfully applied!"
        ));
    }
}
