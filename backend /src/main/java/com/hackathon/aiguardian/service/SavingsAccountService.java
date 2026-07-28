package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.SavingsOfferDto;
import com.hackathon.aiguardian.model.SavingsAccountOffer;
import com.hackathon.aiguardian.repository.SavingsAccountOfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SavingsAccountService
 *
 * Purpose: Business logic service for querying high-interest savings account offers.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SavingsAccountService {

    private final SavingsAccountOfferRepository savingsAccountOfferRepository;

    /**
     * Retrieves savings account offers matching or available for the user's surplus amount.
     */
    public List<SavingsOfferDto> getSavingsOffers(BigDecimal surplusAmount) {
        log.info("[SavingsAccountService] Fetching savings offers surplusAmount={}", surplusAmount);

        List<SavingsAccountOffer> offers = savingsAccountOfferRepository.findAll();

        return offers.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    private SavingsOfferDto mapToDto(SavingsAccountOffer offer) {
        return SavingsOfferDto.builder()
            .id(offer.getId())
            .provider(offer.getProvider())
            .rate(offer.getRate())
            .type(offer.getType())
            .minDeposit(offer.getMinDeposit())
            .term(offer.getTerm())
            .badge(offer.getBadge())
            .build();
    }
}
