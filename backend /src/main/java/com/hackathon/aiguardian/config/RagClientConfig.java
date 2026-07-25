package com.hackathon.aiguardian.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * RagClientConfig
 *
 * Purpose: Configures the RestTemplate bean used to call the Python FastAPI RAG retrieval service.
 *
 * Responsibilities:
 * - Create a dedicated, isolated RestTemplate for RAG HTTP calls.
 * - Separate RAG client from the OpenRouter client to maintain clean service boundaries.
 * - Log RAG service URL at startup for observability.
 *
 * Dependencies:
 * - Environment variable: RAG_SERVICE_URL (defaults to http://localhost:8001)
 *
 * Design Notes:
 * - RagRetrievalService uses graceful degradation: if RAG service is unreachable,
 *   the chat pipeline continues without context augmentation rather than failing.
 */
@Slf4j
@Configuration
public class RagClientConfig {

    @Value("${rag.service-url:http://localhost:8001}")
    private String ragServiceUrl;

    /**
     * Creates a RestTemplate bean dedicated to RAG service communication.
     *
     * @return RestTemplate for RAG /retrieve endpoint calls
     */
    @Bean(name = "ragRestTemplate")
    public RestTemplate ragRestTemplate() {
        log.info("[RagClientConfig] RAG service configured at: {}", ragServiceUrl);
        return new RestTemplate();
    }
}
