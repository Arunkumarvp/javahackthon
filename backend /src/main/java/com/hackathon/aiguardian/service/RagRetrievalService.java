package com.hackathon.aiguardian.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * RagRetrievalService
 *
 * Purpose: HTTP client for the Python FastAPI RAG (Retrieval-Augmented Generation) service.
 *
 * Responsibilities:
 * - Send user queries to the RAG /retrieve endpoint.
 * - Return top-k relevant knowledge chunks to augment the LLM system prompt.
 * - Gracefully degrade if the RAG service is offline — chat continues without context augmentation.
 *
 * Dependencies:
 * - ragRestTemplate (RagClientConfig)
 * - ${rag.service-url} environment variable
 *
 * Design Notes:
 * - Graceful degradation pattern: RAG failure returns an empty list, never blocks the chat pipeline.
 * - Caller (OpenRouterService) simply skips context injection when the list is empty.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RagRetrievalService {

    @Qualifier("ragRestTemplate")
    private final RestTemplate ragRestTemplate;

    @Value("${rag.service-url:http://localhost:8001}")
    private String ragServiceUrl;

    /**
     * Retrieves relevant knowledge chunks from the RAG vector store for a given query.
     *
     * @param query The user's question or intent (PII-masked before calling)
     * @param topK  Number of knowledge chunks to retrieve
     * @return List of relevant text chunks, or empty list on failure (graceful degradation)
     */
    @SuppressWarnings("unchecked")
    public List<String> retrieve(String query, int topK) {
        try {
            Map<String, Object> requestBody = Map.of(
                "query", query,
                "top_k", topK
            );

            Map<String, Object> response = ragRestTemplate.postForObject(
                ragServiceUrl + "/retrieve",
                requestBody,
                Map.class
            );

            if (response != null && response.containsKey("chunks")) {
                List<String> chunks = (List<String>) response.get("chunks");
                log.info("[RAG] Retrieved {} chunks for query (length: {} chars)", chunks.size(), query.length());
                return chunks;
            }

            log.warn("[RAG] Response received but no 'chunks' field found.");
            return List.of();

        } catch (RestClientException ex) {
            // Graceful degradation: RAG unavailability must not block the main chat pipeline
            log.warn("[RAG] RAG service unreachable — proceeding without knowledge context. Reason: {}",
                ex.getMessage());
            return List.of();
        }
    }
}
