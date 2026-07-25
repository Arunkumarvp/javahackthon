package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.RecommendationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * RecommendationsController
 *
 * Purpose: REST controller delivering dynamic personalized AI financial optimization recommendations
 * and handling one-click action execution.
 */
@Slf4j
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationsController {

    /**
     * Retrieves active personalized financial recommendations.
     *
     * @return List of RecommendationDto
     */
    @GetMapping
    public ResponseEntity<List<RecommendationDto>> getRecommendations() {
        log.info("[RecommendationsController] Fetching personalized financial recommendations");

        List<RecommendationDto> recommendations = List.of(
            new RecommendationDto(
                "rec-1",
                "Reduce Food Delivery Spending",
                "Food & Dining",
                "You spent 22% more on food delivery this month than your three-month average. Cutting back to your average could save you significantly.",
                "Spending Alert",
                "alert",
                "Potential savings: £45/month",
                "Set Limit",
                false,
                new BigDecimal("45.00")
            ),
            new RecommendationDto(
                "rec-2",
                "Potential Subscription Savings",
                "Subscriptions",
                "We noticed you haven't used your 'CinemaMax' subscription in over 60 days.",
                "SAVINGS",
                "success",
                "Save £12.99/month",
                "Cancel Subscription",
                false,
                new BigDecimal("12.99")
            ),
            new RecommendationDto(
                "rec-3",
                "High-Interest Savings Opportunity",
                "Savings",
                "Your surplus cash in 'Current Account' is earning 0.1%. Moving £2,000 to a fixed saver could yield more.",
                "OPPORTUNITY",
                "info",
                "Potential: 4.5% AER (£90/year)",
                "Explore Accounts",
                false,
                new BigDecimal("90.00")
            ),
            new RecommendationDto(
                "rec-4",
                "Recurring Weekend Spike",
                "Behavioral Alert",
                "Your spending consistently spikes by 40% on Sundays, primarily on retail and dining.",
                "RECURRING",
                "alert",
                "Potential control: £60/month",
                "Set Weekend Limit",
                false,
                new BigDecimal("60.00")
            ),
            new RecommendationDto(
                "rec-5",
                "Reallocate Surplus to Savings",
                "Budget Automation",
                "You are consistently £150 under budget in your 'Transport' category. Consider automating this to savings.",
                "AUTOMATION",
                "success",
                "Auto-Save: £150/month",
                "Create Auto-Transfer",
                false,
                new BigDecimal("150.00")
            )
        );

        return ResponseEntity.ok(recommendations);
    }

    /**
     * Executes or confirms a specific financial recommendation.
     *
     * @param id Target recommendation ID
     * @return Execution status payload
     */
    @PostMapping("/{id}/apply")
    public ResponseEntity<Map<String, Object>> applyRecommendation(@PathVariable String id) {
        log.info("[RecommendationsController] Applying recommendation ID: {}", id);

        return ResponseEntity.ok(Map.of(
            "id", id,
            "status", "APPLIED",
            "message", "Recommendation successfully applied! AI Guardian automation active."
        ));
    }
}
