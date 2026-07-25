package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.AutoTransferRequest;
import com.hackathon.aiguardian.model.AutoTransferRule;
import com.hackathon.aiguardian.repository.AutoTransferRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * AutoTransferService
 *
 * Purpose: Business logic service for persisting automated surplus transfer rules.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AutoTransferService {

    private final AutoTransferRuleRepository autoTransferRuleRepository;

    /**
     * Creates and persists a new auto-transfer rule.
     */
    public AutoTransferRule createAutoTransfer(AutoTransferRequest request) {
        log.info("[AutoTransferService] Creating auto-transfer rule fromCategory='{}', amount={}, frequency='{}'",
            request.getFromCategory(), request.getAmount(), request.getFrequency());

        AutoTransferRule rule = AutoTransferRule.builder()
            .fromCategory(request.getFromCategory())
            .amount(request.getAmount())
            .frequency(request.getFrequency())
            .createdAt(LocalDateTime.now())
            .build();

        return autoTransferRuleRepository.save(rule);
    }
}
