package com.hackathon.aiguardian.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * PiiMaskingService
 *
 * Purpose: Sanitises user input and AI payloads to remove Personally Identifiable Information (PII)
 *          before any data is forwarded to external LLM services (OpenRouter).
 *
 * Responsibilities:
 * - Detect and mask UK sort codes and IBAN numbers.
 * - Detect and mask PAN (Payment Account Number) card numbers.
 * - Mask UK phone numbers and email addresses.
 * - Provide utility methods for partial masking of individual sensitive fields.
 *
 * Dependencies:
 * - None (pure stateless utility service)
 *
 * Security Considerations:
 * - maskPii() MUST be called BEFORE any LLM API call.
 * - Masking replaces matched values with tokens — original values are NOT retained in memory.
 * - Pattern matching is applied in correct order: IBAN before PAN to avoid partial overwrites.
 */
@Slf4j
@Service
public class PiiMaskingService {

    // UK sort codes: 12-34-56 or 123456
    private static final Pattern SORT_CODE_PATTERN =
        Pattern.compile("\\b(\\d{2}-\\d{2}-\\d{2}|\\d{6})\\b");

    // UK/EU IBAN: GB29NWBK60161331926819
    private static final Pattern IBAN_PATTERN =
        Pattern.compile("\\b[A-Z]{2}\\d{2}[A-Z0-9]{4}\\d{7}([A-Z0-9]?){0,16}\\b");

    // Visa/Mastercard PAN: 16 digits, may include spaces or dashes
    private static final Pattern PAN_PATTERN =
        Pattern.compile("\\b(?:\\d[ -]?){13,19}\\b");

    // UK phone numbers: +44 or 0 prefix
    private static final Pattern PHONE_PATTERN =
        Pattern.compile("\\b(\\+44|0)[\\s-]?\\d{4}[\\s-]?\\d{6}\\b");

    // Email addresses
    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");

    /**
     * Masks all detected PII patterns in the provided text payload.
     * Safe to call on any user-generated content before sending to an LLM.
     *
     * @param payload Raw text that may contain PII
     * @return Sanitised text with PII replaced by recognisable mask tokens
     */
    public String maskPii(String payload) {
        if (payload == null || payload.isBlank()) {
            return payload;
        }

        String masked = payload;

        // Apply IBAN before PAN to prevent IBAN digits being partially matched as PAN
        masked = IBAN_PATTERN.matcher(masked).replaceAll("[IBAN_MASKED]");
        masked = PAN_PATTERN.matcher(masked).replaceAll("[PAN_MASKED]");
        masked = SORT_CODE_PATTERN.matcher(masked).replaceAll("[SORT_CODE_MASKED]");
        masked = PHONE_PATTERN.matcher(masked).replaceAll("[PHONE_MASKED]");
        masked = EMAIL_PATTERN.matcher(masked).replaceAll("[EMAIL_MASKED]");

        if (!masked.equals(payload)) {
            log.info("[PiiMasking] PII detected and masked in payload of length {}", payload.length());
        }

        return masked;
    }

    /**
     * Masks a sort code string, revealing only the last two digits for identification.
     *
     * @param sortCode Raw sort code (e.g. "12-34-56")
     * @return Partially masked sort code (e.g. "**-**-56")
     */
    public String maskSortCode(String sortCode) {
        if (sortCode == null || sortCode.length() < 2) {
            return "[MASKED]";
        }
        return "**-**-" + sortCode.substring(sortCode.length() - 2);
    }

    /**
     * Masks an account number, revealing only the last 4 digits.
     *
     * @param accountNumber Raw account number
     * @return Partially masked account number (e.g. "****5678")
     */
    public String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "[MASKED]";
        }
        return "*".repeat(accountNumber.length() - 4)
            + accountNumber.substring(accountNumber.length() - 4);
    }
}
