package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class TwilioAlertServiceTest {

    @Mock
    private UserRepository userRepository;

    private TwilioAlertService twilioAlertService;

    @BeforeEach
    void setUp() {
        twilioAlertService = new TwilioAlertService(userRepository);
    }

    @Test
    void testConstructorInjectionAndServiceInitialization() {
        assertNotNull(twilioAlertService);
    }

    @Test
    void testSendBudgetAlert_WithExplicitUserName() {
        boolean result = twilioAlertService.sendBudgetAlert(
            "NIVASGANESAN",
            "Food",
            new BigDecimal("100.00"),
            new BigDecimal("150.00"),
            66.6
        );
        assertTrue(result);
    }
}
