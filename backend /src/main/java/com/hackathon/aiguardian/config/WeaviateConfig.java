package com.hackathon.aiguardian.config;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * WeaviateConfig
 *
 * Purpose: Configuration bean holding properties for Weaviate Vector Database connection.
 */
@Slf4j
@Getter
@Setter
@Configuration
public class WeaviateConfig {

    @Value("${weaviate.url:http://localhost:8085}")
    private String url;

    @Value("${weaviate.class-name:KnowledgeChunk}")
    private String className;

    @Value("${weaviate.enabled:true}")
    private boolean enabled;

    @Bean(name = "weaviateRestTemplate")
    public RestTemplate weaviateRestTemplate() {
        return new RestTemplate();
    }
}
