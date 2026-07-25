package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.ChatResponse;
import com.hackathon.aiguardian.model.Payee;
import com.hackathon.aiguardian.repository.PayeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PayeeVerificationService
 *
 * Purpose: Implements Verification of Payee (VoP) checking — a key Open Banking security control.
 *
 * Responsibilities:
 * - Compare user-provided payee name against the registered bank account name.
 * - Compute a fuzzy string match confidence score using Levenshtein distance.
 * - Return structured MATCH | CLOSE_MATCH | NO_MATCH result with confidence and notes.
 * - Persist verification records (with masked PII) for audit trail.
 *
 * Dependencies:
 * - PayeeRepository
 * - PiiMaskingService (for account masking before persistence)
 *
 * Security Considerations:
 * - Account numbers and sort codes are masked before storage — only last 4/2 digits persisted.
 * - Verification results are always logged, even for MATCH status.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PayeeVerificationService {

    private final PayeeRepository payeeRepository;
    private final PiiMaskingService piiMaskingService;

    private static final int EXACT_MATCH_THRESHOLD  = 95;
    private static final int CLOSE_MATCH_THRESHOLD  = 70;

    /**
     * Runs a Verification of Payee (VoP) check by comparing provided and registered names.
     * Uses normalised string similarity (Levenshtein distance ratio) for fuzzy matching.
     *
     * @param providedName   Payee name as entered by the user
     * @param registeredName Name held by the receiving bank
     * @param accountNumber  Target account number (masked before storage)
     * @param sortCode       Target sort code (masked before storage)
     * @param bankName       Target bank name
     * @return PayeeVerificationDto with match status, confidence, and explanatory notes
     */
    @Transactional
    public ChatResponse.PayeeVerificationDto verifyPayee(
        String providedName,
        String registeredName,
        String accountNumber,
        String sortCode,
        String bankName
    ) {
        int confidence = calculateSimilarityScore(
            normalise(providedName),
            normalise(registeredName)
        );
        String matchStatus = resolveMatchStatus(confidence);

        // Persist with masked sensitive data for audit trail
        Payee payee = Payee.builder()
            .providedName(providedName)
            .registeredName(registeredName)
            .accountNumberMasked(piiMaskingService.maskAccountNumber(accountNumber))
            .sortCode(piiMaskingService.maskSortCode(sortCode))
            .bankName(bankName)
            .matchStatus(matchStatus)
            .matchConfidence(confidence)
            .build();

        payeeRepository.save(payee);

        String notes = buildNotes(matchStatus, confidence);
        log.info("[PayeeVerification] Status: {} | Confidence: {}% | Bank: {}",
            matchStatus, confidence, bankName);

        return new ChatResponse.PayeeVerificationDto(
            matchStatus,
            providedName,
            registeredName,
            confidence,
            notes
        );
    }

    /**
     * Calculates a fuzzy similarity score between two normalised name strings.
     * Uses Levenshtein distance ratio: score = (1 - distance/maxLength) * 100
     *
     * @param name1 First normalised name
     * @param name2 Second normalised name
     * @return Similarity percentage 0–100
     */
    int calculateSimilarityScore(String name1, String name2) {
        if (name1.equals(name2)) return 100;
        if (name1.isEmpty() || name2.isEmpty()) return 0;

        int distance = levenshteinDistance(name1, name2);
        int maxLength = Math.max(name1.length(), name2.length());
        return (int) Math.round((1.0 - (double) distance / maxLength) * 100);
    }

    private String resolveMatchStatus(int confidence) {
        if (confidence >= EXACT_MATCH_THRESHOLD) return "MATCH";
        if (confidence >= CLOSE_MATCH_THRESHOLD) return "CLOSE_MATCH";
        return "NO_MATCH";
    }

    private String normalise(String name) {
        if (name == null) return "";
        return name.trim()
            .toLowerCase()
            .replaceAll("[^a-z0-9 ]", "")
            .replaceAll("\\s+", " ");
    }

    private String buildNotes(String status, int confidence) {
        return switch (status) {
            case "MATCH"       ->
                "Payee name matches the registered account holder.";
            case "CLOSE_MATCH" ->
                String.format("Close match detected (%d%% confidence). " +
                    "Registered name may include additional initials or formatting differences. " +
                    "Proceed with caution.", confidence);
            case "NO_MATCH"    ->
                String.format("Payee name does NOT match the registered account holder (%d%% confidence). " +
                    "This may indicate a misdirected payment or fraud attempt.", confidence);
            default -> "Verification result inconclusive.";
        };
    }

    /**
     * Computes Levenshtein edit distance between two strings.
     * Standard dynamic programming implementation — O(m*n) time, O(m*n) space.
     */
    private int levenshteinDistance(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                dp[i][j] = s1.charAt(i - 1) == s2.charAt(j - 1)
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1],
                          Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[m][n];
    }
}
