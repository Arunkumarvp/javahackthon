package com.hackathon.aiguardian.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * SpendingLimitRequest
 *
 * Purpose: Request payload DTO for creating a spending limit rule from a recommendation card.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpendingLimitRequest {

    @NotBlank(message = "category must not be blank")
    private String category;

    @NotNull(message = "monthlyLimit is required")
    @DecimalMin(value = "0.01", message = "monthlyLimit must be greater than 0")
    private BigDecimal monthlyLimit;
}
