package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.SubscriptionDto;
import com.hackathon.aiguardian.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SubscriptionController
 *
 * Purpose: REST controller for managing tracked recurring subscriptions.
 */
@Slf4j
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * Retrieves subscriptions filtered by status (`unused`, `active`, or `all`).
     */
    @GetMapping
    public ResponseEntity<List<SubscriptionDto>> getSubscriptions(
        @RequestParam(required = false, defaultValue = "unused") String status
    ) {
        log.info("[SubscriptionController] GET /api/subscriptions status='{}'", status);
        return ResponseEntity.ok(subscriptionService.getSubscriptions(status));
    }

    /**
     * Cancels a subscription.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelSubscription(@PathVariable String id) {
        log.info("[SubscriptionController] POST /api/subscriptions/{}/cancel", id);
        SubscriptionDto updated = subscriptionService.cancelSubscription(id);
        return ResponseEntity.ok(Map.of(
            "id", updated.getId(),
            "status", updated.getStatus(),
            "message", "Subscription " + updated.getName() + " cancelled successfully!"
        ));
    }
}
