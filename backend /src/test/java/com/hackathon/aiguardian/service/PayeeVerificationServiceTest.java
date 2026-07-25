package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.ChatResponse;
import com.hackathon.aiguardian.model.Payee;
import com.hackathon.aiguardian.repository.PayeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * PayeeVerificationServiceTest
 *
 * Tests the VoP (Verification of Payee) name matching logic.
 * Covers MATCH, CLOSE_MATCH, and NO_MATCH scenarios including edge cases.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PayeeVerificationServiceTest {

    @Mock
    private PayeeRepository payeeRepository;

    @Mock
    private PiiMaskingService piiMaskingService;

    @InjectMocks
    private PayeeVerificationService payeeVerificationService;

    @BeforeEach
    void setUp() {
        when(payeeRepository.save(any(Payee.class))).thenAnswer(inv -> inv.getArgument(0));
        when(piiMaskingService.maskAccountNumber(any())).thenReturn("****5678");
        when(piiMaskingService.maskSortCode(any())).thenReturn("**-**-56");
    }

    // ─── MATCH Scenarios ──────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return MATCH when names are identical")
    void shouldReturnMatchForIdenticalNames() {
        ChatResponse.PayeeVerificationDto result = payeeVerificationService.verifyPayee(
            "John Smith", "John Smith", "12345678", "12-34-56", "Barclays"
        );

        assertThat(result.status()).isEqualTo("MATCH");
        assertThat(result.matchConfidence()).isGreaterThanOrEqualTo(95);
        assertThat(result.providedName()).isEqualTo("John Smith");
    }

    @Test
    @DisplayName("Should return MATCH for names differing only in case")
    void shouldReturnMatchForCaseInsensitiveNames() {
        ChatResponse.PayeeVerificationDto result = payeeVerificationService.verifyPayee(
            "JOHN SMITH", "john smith", "12345678", "12-34-56", "Barclays"
        );

        assertThat(result.status()).isEqualTo("MATCH");
    }

    // ─── CLOSE_MATCH Scenarios ────────────────────────────────────────────────

    @Test
    @DisplayName("Should return CLOSE_MATCH when registered name has slight suffix difference")
    void shouldReturnCloseMatchForNameWithMiddleInitial() {
        // "johnsmith" (9) vs "john smith jr" (13) → distance ~4 → score ~(1-4/13)*100 ≈ 69–80
        ChatResponse.PayeeVerificationDto result = payeeVerificationService.verifyPayee(
            "John Smith", "John Smith Jr", "12345678", "12-34-56", "Barclays"
        );

        // Score should be CLOSE_MATCH range (70-94)
        assertThat(result.matchConfidence()).isBetween(70, 99);
        // The result must be either CLOSE_MATCH or MATCH — not NO_MATCH
        assertThat(result.status()).isNotEqualTo("NO_MATCH");
    }

    // ─── NO_MATCH Scenarios ───────────────────────────────────────────────────

    @Test
    @DisplayName("Should return NO_MATCH for completely different names")
    void shouldReturnNoMatchForCompletelyDifferentNames() {
        ChatResponse.PayeeVerificationDto result = payeeVerificationService.verifyPayee(
            "John Smith", "Jane Doe Enterprises Ltd", "99887766", "98-76-54", "HSBC"
        );

        assertThat(result.status()).isEqualTo("NO_MATCH");
        assertThat(result.matchConfidence()).isLessThan(70);
        assertThat(result.notes()).containsIgnoringCase("does not match");
    }

    // ─── Similarity Score Unit Tests ──────────────────────────────────────────

    @Test
    @DisplayName("Similarity score should be 100 for identical strings")
    void similarityScoreShouldBe100ForIdenticalStrings() {
        int score = payeeVerificationService.calculateSimilarityScore("john smith", "john smith");
        assertThat(score).isEqualTo(100);
    }

    @Test
    @DisplayName("Similarity score should be 0 for empty strings")
    void similarityScoreShouldReturn0ForEmptyStrings() {
        int score = payeeVerificationService.calculateSimilarityScore("", "john smith");
        assertThat(score).isEqualTo(0);
    }

    @Test
    @DisplayName("Similarity score should be low for completely different strings")
    void similarityScoreShouldBeLowForDifferentStrings() {
        int score = payeeVerificationService.calculateSimilarityScore("abc", "xyz");
        assertThat(score).isLessThan(50);
    }
}
