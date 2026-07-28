package com.hackathon.aiguardian;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * AiGuardianApplication
 *
 * Purpose: Spring Boot application entry point for the AI Financial Guardian system.
 *
 * Responsibilities:
 * - Bootstrap the Spring ApplicationContext and all auto-configurations.
 * - Log a structured startup banner for observability.
 *
 * Dependencies:
 * - Spring Boot Auto-configuration
 */
@Slf4j
@EnableScheduling
@SpringBootApplication
public class AiGuardianApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiGuardianApplication.class, args);
    }

    /**
     * Logs a structured startup confirmation once the application is fully initialised
     * and ready to accept requests.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("╔══════════════════════════════════════════════════════╗");
        log.info("║       AI Financial Guardian Backend — STARTED        ║");
        log.info("║  LLM Brain   : OpenRouter API                        ║");
        log.info("║  Confirm Gate: ACTIVE — no bypass permitted          ║");
        log.info("║  PII Masking : ACTIVE — all LLM payloads sanitised   ║");
        log.info("║  Audit Log   : ACTIVE — all interactions recorded    ║");
        log.info("╚══════════════════════════════════════════════════════╝");
    }
}
