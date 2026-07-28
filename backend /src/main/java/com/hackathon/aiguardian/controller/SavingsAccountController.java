package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.SavingsOfferDto;
import com.hackathon.aiguardian.service.SavingsAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * SavingsAccountController
 *
 * Purpose: REST controller for querying high-interest savings account offers.
 */
@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class SavingsAccountController {

    private final SavingsAccountService savingsAccountService;

    /**
     * Retrieves savings account offers.
     */
    @GetMapping("/savings-offers")
    public ResponseEntity<List<SavingsOfferDto>> getSavingsOffers(
        @RequestParam(required = false) BigDecimal surplusAmount
    ) {
        log.info("[SavingsAccountController] GET /api/accounts/savings-offers surplusAmount={}", surplusAmount);
        return ResponseEntity.ok(savingsAccountService.getSavingsOffers(surplusAmount));
    }
}
