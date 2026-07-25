package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.SubscriptionDto;
import com.hackathon.aiguardian.exception.ResourceNotFoundException;
import com.hackathon.aiguardian.model.SubscriptionEntity;
import com.hackathon.aiguardian.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SubscriptionService
 *
 * Purpose: Business logic service for query and cancellation of tracked subscription services.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    /**
     * Retrieves subscriptions filtered by status (unused, active, or all).
     */
    public List<SubscriptionDto> getSubscriptions(String status) {
        log.info("[SubscriptionService] Fetching subscriptions status='{}'", status);

        List<SubscriptionEntity> entities;
        if (status == null || "all".equalsIgnoreCase(status)) {
            entities = subscriptionRepository.findAll();
        } else {
            entities = subscriptionRepository.findByStatusIgnoreCase(status);
        }

        return entities.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * Cancels a subscription by setting status to CANCELLED.
     */
    public SubscriptionDto cancelSubscription(String id) {
        log.info("[SubscriptionService] Cancelling subscription id='{}'", id);

        SubscriptionEntity entity = subscriptionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        entity.setStatus("CANCELLED");
        SubscriptionEntity updated = subscriptionRepository.save(entity);
        return mapToDto(updated);
    }

    private SubscriptionDto mapToDto(SubscriptionEntity entity) {
        String formattedDate = entity.getLastUsedDate() != null
            ? entity.getLastUsedDate().format(DateTimeFormatter.ISO_LOCAL_DATE)
            : "Never";

        return SubscriptionDto.builder()
            .id(entity.getId())
            .name(entity.getName())
            .monthlyCost(entity.getMonthlyCost())
            .status(entity.getStatus())
            .lastUsedDate(formattedDate)
            .category(entity.getCategory())
            .logoEmoji(entity.getLogoEmoji())
            .build();
    }
}
