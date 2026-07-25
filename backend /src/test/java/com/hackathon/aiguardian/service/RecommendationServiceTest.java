package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.*;
import com.hackathon.aiguardian.model.RecommendationEntity;
import com.hackathon.aiguardian.model.SpendingLimitRule;
import com.hackathon.aiguardian.repository.RecommendationRepository;
import com.hackathon.aiguardian.repository.SpendingLimitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private SpendingLimitRepository spendingLimitRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private RecommendationEntity mockEntity;

    @BeforeEach
    void setUp() {
        mockEntity = RecommendationEntity.builder()
            .id("rec_food_delivery")
            .type("SPENDING_ALERT")
            .title("Reduce Food Delivery Spending")
            .category("Food & Dining")
            .description("You spent 22% more on food delivery.")
            .badge("Spending Alert")
            .badgeStyle("alert")
            .expectedBenefit("Potential savings: £45/month")
            .actionText("Set Limit")
            .applied(false)
            .potentialSavings(new BigDecimal("45.00"))
            .priority(1)
            .asOfDate(LocalDate.now())
            .build();
    }

    @Test
    @DisplayName("getRecommendations returns paginated DTO list")
    void getRecommendations_Success() {
        Page<RecommendationEntity> page = new PageImpl<>(List.of(mockEntity));
        when(recommendationRepository.findWithFilters(eq("food"), any(Pageable.class))).thenReturn(page);

        RecommendationsPageDto result = recommendationService.getRecommendations("food", "priority", "asc", "2026-01", 0, 10);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Reduce Food Delivery Spending");
    }

    @Test
    @DisplayName("getRecommendationById returns recommendation detail")
    void getRecommendationById_Success() {
        when(recommendationRepository.findById("rec_food_delivery")).thenReturn(Optional.of(mockEntity));

        RecommendationDto dto = recommendationService.getRecommendationById("rec_food_delivery");

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo("rec_food_delivery");
    }

    @Test
    @DisplayName("setSpendingLimit persists limit rule and marks recommendation applied")
    void setSpendingLimit_Success() {
        when(recommendationRepository.findById("rec_food_delivery")).thenReturn(Optional.of(mockEntity));
        when(spendingLimitRepository.save(any(SpendingLimitRule.class))).thenAnswer(inv -> inv.getArgument(0));

        SpendingLimitRequest request = new SpendingLimitRequest("Food & Dining", new BigDecimal("150.00"));
        SpendingLimitRule rule = recommendationService.setSpendingLimit("rec_food_delivery", request);

        assertThat(rule).isNotNull();
        assertThat(rule.getMonthlyLimit()).isEqualTo(new BigDecimal("150.00"));
        verify(recommendationRepository, times(1)).save(mockEntity);
        assertThat(mockEntity.getApplied()).isTrue();
    }
}
