package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.model.SpendingLimitRule;
import com.hackathon.aiguardian.model.Transaction;
import com.hackathon.aiguardian.repository.SpendingLimitRepository;
import com.hackathon.aiguardian.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetAlertSchedulerServiceTest {

    @Mock
    private SpendingLimitRepository spendingLimitRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TwilioAlertService twilioAlertService;

    @InjectMocks
    private BudgetAlertSchedulerService schedulerService;

    @Test
    void testEvaluateAndSendAlerts_TriggersTwilioWhenSpentOver80Percent() {
        SpendingLimitRule rule = SpendingLimitRule.builder()
            .id(1L)
            .category("Food & Dining")
            .monthlyLimit(new BigDecimal("150.00"))
            .createdAt(LocalDateTime.now())
            .build();

        Transaction tx = Transaction.builder()
            .id(101L)
            .userId(1L)
            .category("Food & Dining")
            .amount(new BigDecimal("132.50"))
            .build();

        when(spendingLimitRepository.findAll()).thenReturn(List.of(rule));
        when(transactionRepository.findByUserIdOrderByTransactionDateDesc(1L)).thenReturn(List.of(tx));
        when(twilioAlertService.sendBudgetAlert(eq("Food & Dining"), any(), any(), anyDouble())).thenReturn(true);

        List<Map<String, Object>> results = schedulerService.evaluateAndSendAlerts();

        assertNotNull(results);
        assertEquals(1, results.size());
        Map<String, Object> eval = results.get(0);
        assertEquals("Food & Dining", eval.get("category"));
        assertTrue((Boolean) eval.get("threshold80Reached"));

        verify(twilioAlertService, times(1)).sendBudgetAlert(eq("Food & Dining"), any(), eq(new BigDecimal("150.00")), doubleThat(p -> p >= 80.0));
    }
}
