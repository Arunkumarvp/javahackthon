package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.SubscriptionDto;
import com.hackathon.aiguardian.model.SubscriptionEntity;
import com.hackathon.aiguardian.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private SubscriptionEntity mockSub;

    @BeforeEach
    void setUp() {
        mockSub = SubscriptionEntity.builder()
            .id("sub_cinemamax")
            .name("CinemaMax")
            .monthlyCost(new BigDecimal("12.99"))
            .status("UNUSED")
            .lastUsedDate(LocalDate.now().minusDays(60))
            .category("Entertainment")
            .logoEmoji("🎬")
            .build();
    }

    @Test
    @DisplayName("getSubscriptions returns filtered subscriptions")
    void getSubscriptions_Success() {
        when(subscriptionRepository.findByStatusIgnoreCase("unused")).thenReturn(List.of(mockSub));

        List<SubscriptionDto> dtos = subscriptionService.getSubscriptions("unused");

        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getName()).isEqualTo("CinemaMax");
    }

    @Test
    @DisplayName("cancelSubscription updates status to CANCELLED")
    void cancelSubscription_Success() {
        when(subscriptionRepository.findById("sub_cinemamax")).thenReturn(Optional.of(mockSub));
        when(subscriptionRepository.save(any(SubscriptionEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        SubscriptionDto result = subscriptionService.cancelSubscription("sub_cinemamax");

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo("CANCELLED");
    }
}
