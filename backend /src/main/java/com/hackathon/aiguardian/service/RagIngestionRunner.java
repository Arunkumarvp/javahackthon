package com.hackathon.aiguardian.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * RagIngestionRunner
 *
 * Purpose: Startup component that ingests knowledge base markdown documents from /resources/knowledge/
 * into the Java/Weaviate vector store idempotently.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RagIngestionRunner {

    private final JavaRagService javaRagService;

    @PostConstruct
    public void initKnowledgeBase() {
        log.info("[RAG Ingestion] Loading policy reference documents into Vector Store...");

        List<String> docs = List.of(
            "verification-of-payee-policy.md",
            "foreign-transaction-fee-policy.md",
            "open-banking-consent-policy.md"
        );

        for (String docName : docs) {
            try (InputStream is = getClass().getResourceAsStream("/knowledge/" + docName)) {
                if (is != null) {
                    String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    javaRagService.ingestDocument(docName, content);
                    log.info("[RAG Ingestion] Successfully ingested policy document: {}", docName);
                } else {
                    log.warn("[RAG Ingestion] Document not found: {}", docName);
                }
            } catch (Exception ex) {
                log.error("[RAG Ingestion] Failed to load {}: {}", docName, ex.getMessage());
            }
        }
    }
}
