package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.dto.AutoTransferRequest;
import com.hackathon.aiguardian.model.AutoTransferRule;
import com.hackathon.aiguardian.repository.AutoTransferRuleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutoTransferServiceTest {

    @Mock
    private AutoTransferRuleRepository repository;

    @InjectMocks
    private AutoTransferService service;

    @Test
    @DisplayName("createAutoTransfer persists transfer rule")
    void createAutoTransfer_Success() {
        when(repository.save(any(AutoTransferRule.class))).thenAnswer(inv -> inv.getArgument(0));

        AutoTransferRequest request = new AutoTransferRequest("transport", new BigDecimal("150.00"), "MONTHLY");
        AutoTransferRule rule = service.createAutoTransfer(request);

        assertThat(rule).isNotNull();
        assertThat(rule.getFromCategory()).isEqualTo("transport");
        assertThat(rule.getAmount()).isEqualTo(new BigDecimal("150.00"));
    }
}
