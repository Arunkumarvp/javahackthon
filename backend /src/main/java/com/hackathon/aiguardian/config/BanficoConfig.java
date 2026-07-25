package com.hackathon.aiguardian.config;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * BanficoConfig
 *
 * Purpose: Configuration bean holding properties for Banfico Mock Bank Open Banking API.
 */
@Slf4j
@Getter
@Setter
@Configuration
public class BanficoConfig {

    @Value("${banfico.domain:obiebank-sbx.banfico.io}")
    private String domain;

    @Value("${banfico.tenant:provider}")
    private String tenant;

    @Value("${banfico.client-id:corebank-spa}")
    private String clientId;

    @Value("${banfico.client-secret:corebank-spa-password}")
    private String clientSecret;

    @Value("${banfico.username:}")
    private String username;

    @Value("${banfico.password:}")
    private String password;

    @Value("${banfico.account-id:}")
    private String accountId;

    @Value("${banfico.enabled:false}")
    private boolean enabled;

    @Bean(name = "banficoRestTemplate")
    public RestTemplate banficoRestTemplate() {
        return new RestTemplate();
    }
}
