package com.hackathon.aiguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * SavingsOfferDto
 *
 * Purpose: DTO representing a high-interest savings account offer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingsOfferDto {

    private String id;
    private String provider;
    private BigDecimal rate;
    private String type;
    private BigDecimal minDeposit;
    private String term;
    private String badge;
}
