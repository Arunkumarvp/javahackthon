package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.UserProfileDto;
import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.service.BanficoBankClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * ProfileController
 *
 * Purpose: REST controller exposing endpoints for managing customer banking profiles,
 * linked Open Banking account metadata, and AI Guardian security preferences.
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ProfileController {

    private final BanficoBankClientService banficoClientService;

    /**
     * Retrieves the customer banking profile for the authenticated user.
     *
     * @param user Authenticated user entity
     * @return UserProfileDto with personal, banking, and security settings
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal User user) {
        String username = user != null ? user.getUsername() : "demoUser";
        Long userId = user != null ? user.getId() : 1L;

        log.info("[ProfileController] Profile requested for user: {}", username);

        String accountId = banficoClientService.resolveAccountId();
        String maskedAccount = (accountId != null && accountId.length() >= 4)
            ? "****" + accountId.substring(accountId.length() - 4)
            : "****5678";

        UserProfileDto profile = new UserProfileDto(
            userId,
            username,
            username + "@wealthmanager.co.uk",
            "Alex Morgan",
            "+44 7700 900123",
            "45 Bank Street, London, EC2N 4AG, United Kingdom",
            "VERIFIED_TIER_2",
            "CUST-8839201",
            "Banfico OBIE Bank Sandbox",
            "12-34-**",
            maskedAccount,
            "ACTIVE",
            LocalDate.now().plusDays(89).toString(),
            true,
            true,
            new BigDecimal("100.00"),
            true,
            true
        );

        return ResponseEntity.ok(profile);
    }

    /**
     * Updates customer profile details and security settings.
     *
     * @param updatedProfile Updated profile DTO from frontend
     * @param user Authenticated user entity
     * @return Updated UserProfileDto
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
        @RequestBody UserProfileDto updatedProfile,
        @AuthenticationPrincipal User user
    ) {
        log.info("[ProfileController] Profile update for user: {}", user != null ? user.getUsername() : "demoUser");
        return ResponseEntity.ok(updatedProfile);
    }
}
