package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.SavingsOfferDto;
import com.hackathon.aiguardian.model.SavingsAccountOffer;
import com.hackathon.aiguardian.repository.SavingsAccountOfferRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavingsAccountServiceTest {

    @Mock
    private SavingsAccountOfferRepository repository;

    @InjectMocks
    private SavingsAccountService service;

    @Test
    @DisplayName("getSavingsOffers returns available account offers")
    void getSavingsOffers_Success() {
        SavingsAccountOffer offer = SavingsAccountOffer.builder()
            .id("offer_marcus")
            .provider("Marcus")
            .rate(new BigDecimal("4.85"))
            .type("FIXED")
            .minDeposit(new BigDecimal("500.00"))
            .build();

        when(repository.findAll()).thenReturn(List.of(offer));

        List<SavingsOfferDto> dtos = service.getSavingsOffers(new BigDecimal("2000.00"));

        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getProvider()).isEqualTo("Marcus");
    }
}
