package com.hackathon.aiguardian.controller;

import com.hackathon.aiguardian.dto.ObieModels;
import com.hackathon.aiguardian.service.BanficoBankClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * ObieAispController
 *
 * Purpose: Exposes Open Banking OBIE AISP v4.0 endpoints matching the Postman collection
 * (Hackathon Mock Bank Final.postman_collection(1).json).
 *
 * Endpoints implemented:
 * 1. POST /auth/realms/{tenant}/protocol/openid-connect/token (Token API)
 * 2. POST /api/obie-aisp/v4.0/accounts (Create Account)
 * 3. GET /api/obie-aisp/v4.0/accounts (Get Accounts)
 * 4. GET /api/obie-aisp/v4.0/accounts/{accountId} (Get Account By AccountId)
 * 5. GET /api/obie-aisp/v4.0/accounts/{accountId}/balances (Get Balance By AccountId)
 * 6. POST /api/obie-aisp/v4.0/accounts/{accountId}/transactions (Post Account Transactions)
 * 7. GET /api/obie-aisp/v4.0/accounts/{accountId}/transactions (Get Transactions By AccountId)
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ObieAispController {

    private final BanficoBankClientService banficoClientService;

    /**
     * 1. TOKEN API (POST https://auth.{{domain}}/auth/realms/{{tenant}}/protocol/openid-connect/token)
     */
    @PostMapping(value = "/auth/realms/{tenant}/protocol/openid-connect/token",
                 consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Map<String, Object>> getAccessToken(
        @PathVariable("tenant") String tenant,
        @RequestParam(name = "client_id", required = false) String clientId,
        @RequestParam(name = "client_secret", required = false) String clientSecret,
        @RequestParam(name = "username", required = false) String username,
        @RequestParam(name = "password", required = false) String password,
        @RequestParam(name = "grant_type", defaultValue = "password") String grantType
    ) {
        log.info("[OBIE AISP] TOKEN API requested for tenant='{}', clientId='{}'", tenant, clientId);
        
        String liveToken = banficoClientService.getAccessToken();
        String token = (liveToken != null) ? liveToken : "mock_access_token_" + UUID.randomUUID();

        Map<String, Object> tokenResponse = new HashMap<>();
        tokenResponse.put("access_token", token);
        tokenResponse.put("expires_in", 3600);
        tokenResponse.put("refresh_token", "mock_refresh_token_" + UUID.randomUUID());
        tokenResponse.put("token_type", "Bearer");
        tokenResponse.put("scope", "accounts balances transactions");

        return ResponseEntity.ok(tokenResponse);
    }

    /**
     * 2. POST Accounts (POST /api/obie-aisp/v4.0/accounts)
     */
    @PostMapping("/api/obie-aisp/v4.0/accounts")
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody(required = false) Map<String, Object> accountBody) {
        log.info("[OBIE AISP] POST Accounts requested: {}", accountBody);

        String accountId = "ACC-" + System.currentTimeMillis();
        String nickname = (accountBody != null && accountBody.containsKey("Nickname"))
            ? (String) accountBody.get("Nickname") : "Everyday Spend";

        Map<String, Object> accountData = new HashMap<>();
        accountData.put("AccountId", accountId);
        accountData.put("Currency", "GBP");
        accountData.put("AccountType", "Personal");
        accountData.put("AccountSubType", "CurrentAccount");
        accountData.put("Nickname", nickname);
        accountData.put("Status", "Enabled");
        accountData.put("OpeningDate", new Date().toString());

        Map<String, Object> response = Map.of(
            "Data", Map.of("Account", List.of(accountData)),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 3. GET Accounts (GET /api/obie-aisp/v4.0/accounts?type=domestic)
     */
    @GetMapping("/api/obie-aisp/v4.0/accounts")
    public ResponseEntity<Map<String, Object>> getAccounts(@RequestParam(name = "type", defaultValue = "domestic") String type) {
        log.info("[OBIE AISP] GET Accounts requested: type={}", type);

        List<Map<String, Object>> accounts = List.of(
            Map.of(
                "AccountId", "acc-barclays-892",
                "Currency", "GBP",
                "AccountType", "Personal",
                "AccountSubType", "CurrentAccount",
                "Nickname", "Barclays Everyday Spend",
                "Status", "Enabled"
            ),
            Map.of(
                "AccountId", "acc-monzo-104",
                "Currency", "GBP",
                "AccountType", "Personal",
                "AccountSubType", "SavingsAccount",
                "Nickname", "Monzo Holiday Saver",
                "Status", "Enabled"
            ),
            Map.of(
                "AccountId", "acc-vanguard-321",
                "Currency", "GBP",
                "AccountType", "Investment",
                "AccountSubType", "StocksAndSharesISA",
                "Nickname", "Vanguard ISA",
                "Status", "Enabled"
            )
        );

        Map<String, Object> response = Map.of(
            "Data", Map.of("Account", accounts),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 4. GET Account By AccountId (GET /api/obie-aisp/v4.0/accounts/{accountId})
     */
    @GetMapping("/api/obie-aisp/v4.0/accounts/{accountId}")
    public ResponseEntity<Map<String, Object>> getAccountById(@PathVariable("accountId") String accountId) {
        log.info("[OBIE AISP] GET Account By AccountId requested: {}", accountId);

        Map<String, Object> account = Map.of(
            "AccountId", accountId,
            "Currency", "GBP",
            "AccountType", "Personal",
            "AccountSubType", "CurrentAccount",
            "Nickname", "Primary Current Account",
            "Status", "Enabled"
        );

        Map<String, Object> response = Map.of(
            "Data", Map.of("Account", List.of(account)),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 5. GET Balance By AccountId (GET /api/obie-aisp/v4.0/accounts/{accountId}/balances)
     */
    @GetMapping("/api/obie-aisp/v4.0/accounts/{accountId}/balances")
    public ResponseEntity<Map<String, Object>> getBalanceByAccountId(@PathVariable("accountId") String accountId) {
        log.info("[OBIE AISP] GET Balance By AccountId requested: {}", accountId);

        Map<String, Object> balanceObj = Map.of(
            "AccountId", accountId,
            "Amount", Map.of("Amount", "14850.40", "Currency", "GBP"),
            "CreditDebitIndicator", "Credit",
            "Type", "InterimAvailable",
            "DateTime", new Date().toString()
        );

        Map<String, Object> response = Map.of(
            "Data", Map.of("Balance", List.of(balanceObj)),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 6. POST Account Transactions (POST /api/obie-aisp/v4.0/accounts/{accountId}/transactions)
     */
    @PostMapping("/api/obie-aisp/v4.0/accounts/{accountId}/transactions")
    public ResponseEntity<Map<String, Object>> postTransaction(
        @PathVariable("accountId") String accountId,
        @RequestBody(required = false) Map<String, Object> payload
    ) {
        log.info("[OBIE AISP] POST Account Transactions requested for accountId {}: {}", accountId, payload);

        boolean postedToBanfico = banficoClientService.postTransaction(accountId, payload != null ? payload : Map.of());

        Map<String, Object> transactionObj = Map.of(
            "AccountId", accountId,
            "TransactionId", "TX-" + System.currentTimeMillis(),
            "TransactionReference", payload != null ? payload.getOrDefault("TransactionReference", "Ref " + System.currentTimeMillis()) : "Ref",
            "Amount", Map.of("Amount", "150.00", "Currency", "GBP"),
            "CreditDebitIndicator", "Debit",
            "Status", "BOOK",
            "BookingDateTime", new Date().toString(),
            "BanficoPosted", postedToBanfico
        );

        Map<String, Object> response = Map.of(
            "Data", Map.of("Transaction", List.of(transactionObj)),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 7. GET Transactions By AccountId (GET /api/obie-aisp/v4.0/accounts/{accountId}/transactions)
     */
    @GetMapping("/api/obie-aisp/v4.0/accounts/{accountId}/transactions")
    public ResponseEntity<Map<String, Object>> getTransactionsByAccountId(@PathVariable("accountId") String accountId) {
        log.info("[OBIE AISP] GET Transactions By AccountId requested: {}", accountId);

        List<Map<String, Object>> txList = List.of(
            Map.of(
                "AccountId", accountId,
                "TransactionId", "tx-201",
                "TransactionReference", "Ref 89201",
                "Amount", Map.of("Amount", "45.99", "Currency", "GBP"),
                "CreditDebitIndicator", "Debit",
                "Status", "BOOK",
                "BookingDateTime", new Date().toString(),
                "TransactionInformation", "Amazon UK"
            ),
            Map.of(
                "AccountId", accountId,
                "TransactionId", "tx-202",
                "TransactionReference", "Ref 89202",
                "Amount", Map.of("Amount", "1250.00", "Currency", "GBP"),
                "CreditDebitIndicator", "Debit",
                "Status", "BOOK",
                "BookingDateTime", new Date().toString(),
                "TransactionInformation", "CryptoExchange Ltd"
            )
        );

        Map<String, Object> response = Map.of(
            "Data", Map.of("Transaction", txList),
            "Meta", Map.of("TotalPages", 1)
        );

        return ResponseEntity.ok(response);
    }
}
