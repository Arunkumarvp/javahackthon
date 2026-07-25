package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.AutoTransferRequest;
import com.hackathon.aiguardian.model.AutoTransferRule;
import com.hackathon.aiguardian.service.AutoTransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AutoTransferController
 *
 * Purpose: REST controller for creating automated surplus transfer rules.
 */
@Slf4j
@RestController
@RequestMapping("/api/auto-transfers")
@RequiredArgsConstructor
public class AutoTransferController {

    private final AutoTransferService autoTransferService;

    /**
     * Creates an automated surplus transfer rule.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAutoTransfer(
        @Valid @RequestBody AutoTransferRequest request
    ) {
        log.info("[AutoTransferController] POST /api/auto-transfers fromCategory='{}', amount={}",
            request.getFromCategory(), request.getAmount());

        AutoTransferRule rule = autoTransferService.createAutoTransfer(request);

        return ResponseEntity.ok(Map.of(
            "id", rule.getId(),
            "fromCategory", rule.getFromCategory(),
            "amount", rule.getAmount(),
            "frequency", rule.getFrequency(),
            "status", "ACTIVE",
            "message", "Auto-transfer rule created successfully!"
        ));
    }
}
