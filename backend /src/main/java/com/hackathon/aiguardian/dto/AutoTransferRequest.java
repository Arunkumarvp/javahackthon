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
 * AutoTransferRequest
 *
 * Purpose: Request payload DTO for creating an automated surplus transfer rule.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutoTransferRequest {

    @NotBlank(message = "fromCategory must not be blank")
    private String fromCategory;

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.01", message = "amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "frequency must not be blank")
    private String frequency;
}
