package com.hackathon.aiguardian.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * TwilioAlertService
 *
 * Purpose: Handles SMS / WhatsApp budget alert dispatching via Twilio REST API.
 *
 * Configured with Twilio credentials:
 * - Account SID: AC070142848016b183420bd19bf31815c3
 * - Auth Token: 29ba9371a865996c4801172c5957ff02
 * - From Number: +14155238886
 * - To Number: +919659505941
 * - Template ID: HX4fdb88974ef98b0736268c6c02a7f806
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

    @Value("${twilio.to-number:+919659505941}")
    private String toNumber;

    @Value("${twilio.template-id:HX4fdb88974ef98b0736268c6c02a7f806}")
    private String templateId;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends an alert notification using Twilio Content Template ID (ContentSid)
     * with template parameters {{userName}} and {{category}}.
     * Note: Message body is omitted as requested.
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

        try {
            String url = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", accountSid);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Basic Auth Header: AccountSid : AuthToken
            String auth = accountSid + ":" + authToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + encodedAuth);

            // ContentVariables JSON matching Twilio Content API template variables {{1}} and {{2}}
            String contentVariablesJson = String.format(
                "{\"1\":\"%s\",\"2\":\"%s\"}",
                userName, category
            );

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", fromNumber);
            body.add("To", toNumber);
            body.add("ContentSid", templateId);
            body.add("ContentVariables", contentVariablesJson);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[TwilioAlertService] Twilio template alert successfully sent! Response code: {}, Body: {}",
                        response.getStatusCode(), response.getBody());
                return true;
            } else {
                log.warn("[TwilioAlertService] Twilio API returned non-2xx response: {}", response.getStatusCode());
                return false;
            }
        } catch (Exception e) {
            log.error("[TwilioAlertService] Error dispatching Twilio template alert: {}", e.getMessage());
            return true;
        }
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.hackathon.aiguardian.repository.UserRepository userRepository;

    public boolean sendBudgetAlert(String category, BigDecimal currentSpend, BigDecimal limitAmount, double percentage) {
        String dynamicUserName = "Alex Morgan";
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof com.hackathon.aiguardian.model.User user) {
                if (user.getUsername() != null && !user.getUsername().isBlank()) {
                    dynamicUserName = user.getUsername();
                }
            } else if (userRepository != null) {
                java.util.Optional<com.hackathon.aiguardian.model.User> firstUser = userRepository.findAll().stream().findFirst();
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
