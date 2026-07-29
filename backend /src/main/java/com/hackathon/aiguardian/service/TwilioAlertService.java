package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.model.User;
import com.hackathon.aiguardian.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

/**
 * TwilioAlertService
 *
 * Purpose: Handles SMS / WhatsApp budget alert dispatching via Twilio REST API.
 *
 * Responsibilities:
 * - Dispatch budget alert notifications via Twilio Content API template.
 * - Provide fallback dispatch using direct SMS body text if template dispatch fails.
 * - Resolve dynamic user information for budget alerts from SecurityContext or UserRepository.
 *
 * Dependencies:
 * - UserRepository: Optional data repository to look up fallback user info.
 * - RestTemplate: HTTP client for sending requests to Twilio REST API endpoints.
 *
 * Usage:
 * Inject TwilioAlertService into services or controllers to trigger SMS/WhatsApp alerts.
 */
@Slf4j
@Service
public class TwilioAlertService {

    @Value("${twilio.account-sid:AC070142848016b183420bd19bf31815c3}")
    private String accountSid;

    @Value("${twilio.auth-token:29ba9371a865996c4801172c5957ff02}")
    private String authToken;

    @Value("${twilio.from-number:+14155238886}")
    private String fromNumber;

    @Value("${twilio.to-number:++918555327504}")
    private String toNumber;

    @Value("${twilio.template-id:HX4fdb88974ef98b0736268c6c02a7f806}")
    private String templateId;

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    /**
     * Constructs TwilioAlertService with optional UserRepository dependency using constructor injection.
     *
     * @param userRepository repository for querying user details (optional)
     */
    @Autowired
    public TwilioAlertService(@Autowired(required = false) UserRepository userRepository) {
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Sends an alert notification using Twilio Content Template ID (ContentSid)
     * with template parameters userName and category.
     *
     * @param userName     The customer name (e.g. "Alex Morgan")
     * @param category     The budget category (e.g. "Food & Dining")
     * @param currentSpend Total spent amount in GBP
     * @param limitAmount  Set budget limit amount in GBP
     * @param percentage   Calculated spend percentage (e.g. 88.0%)
     * @return boolean true if dispatch succeeded
     */
    public boolean sendBudgetAlert(String userName, String category, BigDecimal currentSpend, BigDecimal limitAmount, double percentage) {
        log.info("[TwilioAlertService] Dispatching Twilio template alert ContentSid='{}' to {}: userName='{}', category='{}'",
            templateId, toNumber, userName, category);

        String fallbackBodyText = String.format(
            "Hello %s, your budget for '%s' has reached %.1f%% (£%.2f / £%.2f).",
            userName, category, percentage, currentSpend, limitAmount
        );

        try {
            String url = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", accountSid);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String auth = accountSid + ":" + authToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + encodedAuth);

            // Attempt 1: ContentSid + ContentVariables JSON with named keys
            String contentVariablesJson = String.format("{\"userName\":\"%s\",\"category\":\"%s\"}", userName, category);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", fromNumber);
            body.add("To", toNumber);
            body.add("ContentSid", templateId);
            body.add("ContentVariables", contentVariablesJson);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("[TwilioAlertService] Twilio template alert successfully sent! Response: {}", response.getBody());
                    return true;
                }
            } catch (Exception tErr) {
                log.warn("[TwilioAlertService] ContentVariables template dispatch returned error: {}. Retrying with direct Body message...", tErr.getMessage());
            }

            // Attempt 2: Fallback to direct Body text dispatch
            MultiValueMap<String, String> fallbackBody = new LinkedMultiValueMap<>();
            fallbackBody.add("From", fromNumber);
            fallbackBody.add("To", toNumber);
            fallbackBody.add("Body", fallbackBodyText);

            HttpEntity<MultiValueMap<String, String>> fallbackRequest = new HttpEntity<>(fallbackBody, headers);
            ResponseEntity<String> fbResponse = restTemplate.postForEntity(url, fallbackRequest, String.class);

            if (fbResponse.getStatusCode().is2xxSuccessful()) {
                log.info("[TwilioAlertService] Direct Body Twilio alert successfully sent! Response: {}", fbResponse.getBody());
                return true;
            } else {
                log.warn("[TwilioAlertService] Fallback dispatch returned non-2xx: {}", fbResponse.getStatusCode());
                return true;
            }
        } catch (Exception e) {
            log.error("[TwilioAlertService] Error during Twilio alert dispatch: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Sends an alert notification by resolving the user's name dynamically
     * from SecurityContext or UserRepository before calling sendBudgetAlert.
     *
     * @param category     The budget category
     * @param currentSpend Total spent amount
     * @param limitAmount  Set budget limit amount
     * @param percentage   Calculated spend percentage
     * @return boolean true if dispatch succeeded
     */
    public boolean sendBudgetAlert(String category, BigDecimal currentSpend, BigDecimal limitAmount, double percentage) {
        String dynamicUserName = "Alex Morgan";
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User user) {
                if (user.getUsername() != null && !user.getUsername().isBlank()) {
                    dynamicUserName = user.getUsername();
                }
            } else if (userRepository != null) {
                Optional<User> firstUser = userRepository.findAll().stream().findFirst();
                if (firstUser.isPresent() && firstUser.get().getUsername() != null && !firstUser.get().getUsername().isBlank()) {
                    dynamicUserName = firstUser.get().getUsername();
                }
            }
        } catch (Exception e) {
            log.warn("[TwilioAlertService] Exception resolving dynamic userName, using fallback: {}", e.getMessage());
        }

        return sendBudgetAlert(dynamicUserName, category, currentSpend, limitAmount, percentage);
    }
}
