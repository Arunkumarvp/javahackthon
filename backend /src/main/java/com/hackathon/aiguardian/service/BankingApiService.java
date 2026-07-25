package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.SummaryResponse;
import com.hackathon.aiguardian.model.Transaction;
import com.hackathon.aiguardian.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BankingApiService
 *
 * Purpose: Simulates Open Banking API calls for the demo environment.
 *          Structured for real Open Banking API integration in production.
 *
 * Responsibilities:
 * - Return account balance data (mock values; replace with real Open Banking /balances call).
 * - Retrieve and seed transaction history for dashboard display.
 * - Simulate payment execution after the Confirm-Before-Action gate has been passed.
 *
 * Dependencies:
 * - TransactionRepository
 *
 * Design Notes:
 * - Demo data is seeded lazily on first request if the database is empty.
 * - All methods are structured as real API clients would be — easy to replace mock logic
 *   with HTTP calls to a real Open Banking provider.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BankingApiService {

    private final TransactionRepository transactionRepository;

    private static final DateTimeFormatter DISPLAY_FORMATTER =
        DateTimeFormatter.ofPattern("dd MMM, HH:mm");

    /**
     * Returns the current account balance for a user.
     * In production: calls Open Banking /accounts/{accountId}/balances endpoint.
     *
     * @param userId User's database ID
     * @return Account balance as BigDecimal in GBP
     */
    public BigDecimal getBalance(Long userId) {
        log.info("[BankingAPI] Fetching balance for userId: {}", userId);
        // Demo: returns fixed balance. Replace with real Open Banking call.
        return new BigDecimal("14850.40");
    }

    /**
     * Retrieves the financial dashboard summary for a user.
     * Seeds demo transactions on first call if the user has no transactions.
     *
     * @param userId User's database ID
     * @return SummaryResponse DTO with balance, spending, and recent transactions
     */
    @Transactional
    public SummaryResponse getDashboardSummary(Long userId) {
        List<Transaction> transactions = transactionRepository
            .findByUserIdOrderByTransactionDateDesc(userId);

        // Lazy-seed demo data if no transactions exist for this user
        if (transactions.isEmpty()) {
            transactions = seedDemoTransactions(userId);
        }

        long flagCount = transactions.stream()
            .filter(Transaction::getFlagged)
            .count();

        List<SummaryResponse.TransactionSummaryDto> recentTransactions = transactions.stream()
            .limit(10)
            .map(this::mapToTransactionSummary)
            .collect(Collectors.toList());

        return new SummaryResponse(
            new BigDecimal("14850.40"),
            "GBP",
            new BigDecimal("2340.10"),
            (int) flagCount,
            recentTransactions
        );
    }

    /**
     * Simulates executing a confirmed payment transfer.
     * In production: calls Open Banking /payments or /domestic-payment-consents endpoint.
     *
     * @param actionDetails Map containing payee and transfer details from the PendingAction
     * @return Execution confirmation message
     */
    public String executeTransfer(Map<String, Object> actionDetails) {
        log.info("[BankingAPI] Executing simulated transfer: payee='{}', amount='{}'",
            actionDetails.get("payee_name"), actionDetails.get("amount"));
        // Demo: logs and returns success. Replace with real Open Banking payment call.
        return "Transaction executed successfully via Open Banking Gateway.";
    }

    private SummaryResponse.TransactionSummaryDto mapToTransactionSummary(Transaction tx) {
        String dateDisplay = tx.getTransactionDate() != null
            ? tx.getTransactionDate().format(DISPLAY_FORMATTER)
            : "Unknown";

        return new SummaryResponse.TransactionSummaryDto(
            "tx-" + tx.getId(),
            tx.getMerchant(),
            tx.getAmount(),
            dateDisplay,
            tx.getCategory(),
            tx.getFlagged(),
            tx.getFlagReason()
        );
    }

    /**
     * Seeds representative demo transactions for a new user.
     * Includes one flagged transaction to demonstrate the anomaly detection feature.
     */
    private List<Transaction> seedDemoTransactions(Long userId) {
        log.info("[BankingAPI] Seeding demo transactions for userId: {}", userId);

        List<Transaction> demoData = List.of(
            buildTransaction(userId, "Amazon UK",        "45.99",  "Shopping",      0, false, null),
            buildTransaction(userId, "CryptoExchange Ltd","1250.00","Transfer",      1, true,  "Unusual high-value transfer to crypto exchange"),
            buildTransaction(userId, "Sainsbury's",       "68.40",  "Groceries",     2, false, null),
            buildTransaction(userId, "Netflix UK",        "15.99",  "Subscriptions", 3, false, null),
            buildTransaction(userId, "TfL Contactless",   "3.40",   "Transport",     4, false, null),
            buildTransaction(userId, "Boots Pharmacy",    "24.50",  "Health",        5, false, null)
        );

        return transactionRepository.saveAll(demoData);
    }

    private Transaction buildTransaction(Long userId, String merchant, String amount,
                                         String category, int daysAgo,
                                         boolean flagged, String flagReason) {
        return Transaction.builder()
            .userId(userId)
            .merchant(merchant)
            .amount(new BigDecimal(amount))
            .currency("GBP")
            .category(category)
            .transactionDate(LocalDateTime.now().minusDays(daysAgo))
            .flagged(flagged)
            .flagReason(flagReason)
            .build();
    }
}
