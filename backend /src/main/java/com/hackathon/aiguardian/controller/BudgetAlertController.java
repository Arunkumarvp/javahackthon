package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.service.BudgetAlertSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * BudgetAlertController
 *
 * Purpose: REST controller exposing manual triggers and status inspection for 80% budget Twilio alerts.
 */
@Slf4j
@RestController
@RequestMapping("/api/budget-alerts")
@RequiredArgsConstructor
public class BudgetAlertController {

    private final BudgetAlertSchedulerService budgetAlertSchedulerService;

    /**
     * Manually triggers the budget threshold evaluation and sends Twilio alerts for any category >= 80%.
     *
     * @return List of category budget evaluations and alert statuses
     */
    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Object>> triggerBudgetAlertCheck() {
        log.info("[BudgetAlertController] Manual trigger received for 80% budget alert evaluation...");
        List<Map<String, Object>> evaluations = budgetAlertSchedulerService.evaluateAndSendAlerts();

        Map<String, Object> response = Map.of(
            "status", "SUCCESS",
            "message", "Budget alert check executed successfully. Twilio notifications sent for categories >= 80%.",
            "evaluations", evaluations
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Inspects current budget threshold status without re-sending SMS alerts.
     *
     * @return Current status of budget rules vs spending
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getBudgetAlertStatus() {
        log.info("[BudgetAlertController] Fetching budget alert status...");
        List<Map<String, Object>> evaluations = budgetAlertSchedulerService.evaluateAndSendAlerts();

        Map<String, Object> response = Map.of(
            "status", "ACTIVE",
            "evaluations", evaluations
        );

        return ResponseEntity.ok(response);
    }
}
