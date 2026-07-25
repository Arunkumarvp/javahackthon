package com.hackathon.aiguardian.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * DatabaseConfig
 *
 * Purpose: JPA and transaction management configuration for the AI Financial Guardian persistence layer.
 *
 * Responsibilities:
 * - Enable JPA repository scanning for the repository package.
 * - Enable entity scanning for the model package.
 * - Enable declarative (@Transactional) transaction management.
 *
 * Dependencies:
 * - Spring Data JPA
 * - application.yml datasource configuration (all connection secrets via environment variables)
 *
 * Design Notes:
 * - Datasource URL, credentials and pool settings are fully externalised to application.yml.
 * - Supports both PostgreSQL (production) and H2 (demo/test) via Spring profiles.
 */
@Slf4j
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.hackathon.aiguardian.repository")
@EntityScan(basePackages = "com.hackathon.aiguardian.model")
public class DatabaseConfig {
    // All datasource connection details are externalized to application.yml.
    // Secrets are resolved from environment variables — never committed to source control.
}
