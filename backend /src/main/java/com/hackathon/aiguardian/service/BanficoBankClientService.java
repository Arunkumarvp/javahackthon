package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.config.BanficoConfig;
import com.hackathon.aiguardian.dto.ObieModels;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * BanficoBankClientService
 *
 * Purpose: Client service executing HTTP requests against Banfico Mock Bank Open Banking API
 * based on the Hackathon Mock Bank Postman collection (OBIE AISP v4.0).
 */
@Slf4j
@Service
public class BanficoBankClientService {

    private final BanficoConfig banficoConfig;
    private final RestTemplate restTemplate;

    public BanficoBankClientService(BanficoConfig banficoConfig, @Qualifier("banficoRestTemplate") RestTemplate restTemplate) {
        this.banficoConfig = banficoConfig;
        this.restTemplate = restTemplate;
    }

    private String cachedToken;
    private Instant tokenExpiry;

    /**
     * Obtains a valid OAuth2 Bearer token from Keycloak (TOKEN API).
     */
    public synchronized String getAccessToken() {
        if (!banficoConfig.isEnabled()) {
            log.debug("[BanficoClient] Banfico integration disabled.");
            return null;
        }

        if (cachedToken != null && tokenExpiry != null && Instant.now().isBefore(tokenExpiry)) {
            return cachedToken;
        }

        try {
            String tokenUrl = String.format("https://auth.%s/auth/realms/%s/protocol/openid-connect/token",
                banficoConfig.getDomain(), banficoConfig.getTenant());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", banficoConfig.getClientId());
            body.add("client_secret", banficoConfig.getClientSecret());
            body.add("username", banficoConfig.getUsername());
            body.add("password", banficoConfig.getPassword());
            body.add("grant_type", "password");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<ObieModels.TokenResponse> response = restTemplate.postForEntity(
                tokenUrl, request, ObieModels.TokenResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                cachedToken = response.getBody().getAccessToken();
                int expiresIn = response.getBody().getExpiresIn() != null ? response.getBody().getExpiresIn() : 300;
                tokenExpiry = Instant.now().plusSeconds(expiresIn - 30);
                log.info("[BanficoClient] Successfully obtained OAuth2 token from Banfico Keycloak.");
                return cachedToken;
            }
        } catch (Exception e) {
            log.error("[BanficoClient] Failed to obtain OAuth2 token from Banfico: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Resolves the primary AccountId from Banfico.
     */
    public String resolveAccountId() {
        if (banficoConfig.getAccountId() != null && !banficoConfig.getAccountId().isBlank()) {
            return banficoConfig.getAccountId();
        }

        String token = getAccessToken();
        if (token == null) return null;

        try {
            String url = String.format("https://core-api.%s/api/obie-aisp/v4.0/accounts?type=domestic",
                banficoConfig.getDomain());

            HttpHeaders headers = createAuthHeaders(token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<ObieModels.AccountListResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ObieModels.AccountListResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null
                && response.getBody().getData() != null
                && response.getBody().getData().getAccount() != null
                && !response.getBody().getData().getAccount().isEmpty()) {
                
                String accountId = response.getBody().getData().getAccount().get(0).getAccountId();
                log.info("[BanficoClient] Discovered Banfico accountId: {}", accountId);
                return accountId;
            }
        } catch (Exception e) {
            log.error("[BanficoClient] Error listing Banfico accounts: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Fetches current account balance from Banfico (GET Balance By AccountId).
     */
    public BigDecimal fetchBalance(String accountId) {
        String token = getAccessToken();
        if (token == null || accountId == null) return null;

        try {
            String url = String.format("https://core-api.%s/api/obie-aisp/v4.0/accounts/%s/balances",
                banficoConfig.getDomain(), accountId);

            HttpHeaders headers = createAuthHeaders(token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<ObieModels.BalanceListResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ObieModels.BalanceListResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null
                && response.getBody().getData() != null
                && response.getBody().getData().getBalance() != null
                && !response.getBody().getData().getBalance().isEmpty()) {

                String amountStr = response.getBody().getData().getBalance().get(0).getAmount().getAmount();
                return new BigDecimal(amountStr);
            }
        } catch (Exception e) {
            log.error("[BanficoClient] Error fetching balance for accountId {}: {}", accountId, e.getMessage());
        }
        return null;
    }

    /**
     * Fetches transaction history from Banfico (GET Transactions By AccountId).
     */
    public List<ObieModels.TransactionListResponse.TransactionDto> fetchTransactions(String accountId) {
        String token = getAccessToken();
        if (token == null || accountId == null) return Collections.emptyList();

        try {
            String url = String.format("https://core-api.%s/api/obie-aisp/v4.0/accounts/%s/transactions",
                banficoConfig.getDomain(), accountId);

            HttpHeaders headers = createAuthHeaders(token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<ObieModels.TransactionListResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ObieModels.TransactionListResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null
                && response.getBody().getData() != null
                && response.getBody().getData().getTransaction() != null) {

                return response.getBody().getData().getTransaction();
            }
        } catch (Exception e) {
            log.error("[BanficoClient] Error fetching transactions for accountId {}: {}", accountId, e.getMessage());
        }
        return Collections.emptyList();
    }

    /**
     * Posts a executed transfer to Banfico (POST Account Transactions).
     */
    public boolean postTransaction(String accountId, Map<String, Object> details) {
        String token = getAccessToken();
        if (token == null || accountId == null) return false;

        try {
            String url = String.format("https://core-api.%s/api/obie-aisp/v4.0/accounts/%s/transactions",
                banficoConfig.getDomain(), accountId);

            HttpHeaders headers = createAuthHeaders(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("TransactionReference", "Ref " + System.currentTimeMillis());
            payload.put("Amount", Map.of("Amount", String.valueOf(details.getOrDefault("amount", "100.00")), "Currency", "GBP"));
            payload.put("CreditDebitIndicator", "Debit");
            payload.put("Status", "BOOK");
            payload.put("BookingDateTime", DateTimeFormatter.ISO_INSTANT.format(Instant.now()));
            payload.put("TransactionInformation", details.getOrDefault("payee_name", "Transfer"));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("[BanficoClient] Error posting transaction to Banfico: {}", e.getMessage());
            return false;
        }
    }

    private HttpHeaders createAuthHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("accept", "application/json, text/plain, */*");
        return headers;
    }
}
