package com.hackathon.aiguardian.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * OpenRouterConfig
 *
 * Purpose: Configures the RestTemplate bean used to communicate with the OpenRouter LLM API.
 *
 * Responsibilities:
 * - Create a RestTemplate with required OpenRouter headers pre-attached via interceptors.
 * - Inject Authorization (Bearer), HTTP-Referer, and X-Title headers on every request.
 * - Centralise all OpenRouter connection concerns in one place.
 *
 * Dependencies:
 * - Environment variables: OPENROUTER_API_KEY, APP_URL
 *
 * Security Considerations:
 * - API key is never logged — only presence is confirmed at startup.
 * - Header interceptors apply to every outbound request automatically.
 */
@Slf4j
@Configuration
public class OpenRouterConfig {

    @Value("${openrouter.api-key}")
    private String apiKey;

    @Value("${openrouter.app-url:http://localhost:8080}")
    private String appUrl;

    /**
     * Creates a RestTemplate bean pre-configured with all OpenRouter-required headers.
     * The HTTP-Referer header is mandated by OpenRouter's API policy.
     *
     * @return RestTemplate configured for OpenRouter API calls
     */
    @Bean(name = "openRouterRestTemplate")
    public RestTemplate openRouterRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Attach mandatory OpenRouter headers to every outbound request
        ClientHttpRequestInterceptor headerInterceptor = (request, body, execution) -> {
            request.getHeaders().set("Authorization", "Bearer " + apiKey);
            request.getHeaders().set("HTTP-Referer", appUrl);
            request.getHeaders().set("X-Title", "AI Financial Guardian");
            request.getHeaders().set("Content-Type", "application/json");
            return execution.execute(request, body);
        };

        restTemplate.setInterceptors(List.of(headerInterceptor));
        log.info("[OpenRouterConfig] RestTemplate initialised. API key present: {}, App-URL: {}",
            !apiKey.isBlank(), appUrl);
        return restTemplate;
    }
}
