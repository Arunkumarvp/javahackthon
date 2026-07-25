package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.config.WeaviateConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * WeaviateRagService
 *
 * Purpose: Direct REST client for Weaviate Vector Database (`/v1/schema`, `/v1/objects`, `/v1/graphql`).
 */
@Slf4j
@Service
public class WeaviateRagService {

    private final WeaviateConfig weaviateConfig;
    private final RestTemplate restTemplate;

    public WeaviateRagService(WeaviateConfig weaviateConfig, @Qualifier("weaviateRestTemplate") RestTemplate restTemplate) {
        this.weaviateConfig = weaviateConfig;
        this.restTemplate = restTemplate;
    }

    /**
     * Initializes the Weaviate schema class if not already created.
     */
    public void ensureSchemaExists() {
        if (!weaviateConfig.isEnabled()) return;

        try {
            String url = weaviateConfig.getUrl() + "/v1/schema";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> schemaClass = Map.of(
                "class", weaviateConfig.getClassName(),
                "description", "Knowledge base chunks for AI Guardian RAG",
                "vectorizer", "none",
                "properties", List.of(
                    Map.of("name", "chunkId", "dataType", List.of("text")),
                    Map.of("name", "documentName", "dataType", List.of("text")),
                    Map.of("name", "content", "dataType", List.of("text"))
                )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(schemaClass, headers);
            restTemplate.postForEntity(url, request, String.class);
            log.info("[Weaviate] Schema class '{}' initialized successfully.", weaviateConfig.getClassName());
        } catch (Exception e) {
            log.debug("[Weaviate] Schema initialization note (class may already exist or DB offline): {}", e.getMessage());
        }
    }

    /**
     * Indexes a knowledge chunk into Weaviate vector store.
     */
    public boolean indexChunk(String chunkId, String documentName, String content) {
        if (!weaviateConfig.isEnabled()) return false;

        try {
            String url = weaviateConfig.getUrl() + "/v1/objects";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = Map.of(
                "class", weaviateConfig.getClassName(),
                "properties", Map.of(
                    "chunkId", chunkId,
                    "documentName", documentName,
                    "content", content
                )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.trace("[Weaviate] Chunk indexing failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Executes GraphQL query against Weaviate vector database.
     */
    @SuppressWarnings("unchecked")
    public List<JavaRagService.RagChunk> searchVectorDb(String query, int topK) {
        if (!weaviateConfig.isEnabled()) return null;

        try {
            String url = weaviateConfig.getUrl() + "/v1/graphql";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String gqlQuery = String.format(
                "{ Get { %s(limit: %d) { chunkId documentName content } } }",
                weaviateConfig.getClassName(), topK
            );

            Map<String, Object> body = Map.of("query", gqlQuery);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map data = (Map) response.getBody().get("data");
                if (data != null) {
                    Map get = (Map) data.get("Get");
                    if (get != null && get.containsKey(weaviateConfig.getClassName())) {
                        List<Map<String, Object>> list = (List<Map<String, Object>>) get.get(weaviateConfig.getClassName());
                        List<JavaRagService.RagChunk> results = new ArrayList<>();
                        for (Map<String, Object> item : list) {
                            results.add(new JavaRagService.RagChunk(
                                String.valueOf(item.get("chunkId")),
                                String.valueOf(item.get("documentName")),
                                String.valueOf(item.get("content")),
                                1.0
                            ));
                        }
                        if (!results.isEmpty()) {
                            log.info("[Weaviate] Retrieved {} chunks from Weaviate Vector DB", results.size());
                            return results;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.debug("[Weaviate] Vector query offline/fallback: {}", e.getMessage());
        }
        return null;
    }
}
