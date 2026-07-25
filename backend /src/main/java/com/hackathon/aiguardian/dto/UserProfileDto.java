package com.hackathon.aiguardian.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * UserProfileDto
 *
 * Purpose: Data Transfer Object representing a user's banking customer profile,
 * linked Open Banking account metadata, KYC status, and security guardrail settings.
 */
public record UserProfileDto(

    Long userId,
    String username,
    String email,
    String fullName,
    String phoneNumber,
    String address,
    String kycStatus,            // e.g. "VERIFIED_TIER_2"
    String customerRef,           // e.g. "CUST-8839201"
    
    // Linked Open Banking Account Info
    String linkedBankName,        // e.g. "Banfico Open Bank UK"
    String maskedSortCode,        // e.g. "12-34-**"
    String maskedAccountNumber,   // e.g. "****5678"
    String consentStatus,         // e.g. "ACTIVE"
    String consentExpiresAt,      // e.g. "2026-10-23"
    
    // AI Financial Guardian Guardrail Preferences
    Boolean piiMaskingActive,
    Boolean vopRequired,
    BigDecimal gateThreshold,     // e.g. 100.00
    Boolean mfaEnabled,
    Boolean emailAlertsEnabled

) {}
