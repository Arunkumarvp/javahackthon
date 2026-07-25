package com.hackathon.aiguardian.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * RagRetrievalService
 *
 * Purpose: Service interface for Retrieval-Augmented Generation (RAG) knowledge lookup.
 *
 * Responsibilities:
 * - Query Pure Java RAG engine for relevant knowledge base context.
 * - Return top-K matching knowledge chunks to augment LLM prompts.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RagRetrievalService {

    private final JavaRagService javaRagService;

    /**
     * Retrieves relevant knowledge chunks from the Java RAG engine for a given query.
     *
     * @param query The user's query
     * @param topK  Number of knowledge chunks to retrieve
     * @return List of relevant text chunks
     */
    public List<String> retrieve(String query, int topK) {
        try {
            List<JavaRagService.RagChunk> results = javaRagService.search(query, topK);
            log.info("[RAG] Pure Java RAG retrieved {} chunks for query: '{}'", results.size(), query);
            return results.stream()
                .map(JavaRagService.RagChunk::getContent)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("[RAG] Java RAG retrieval exception — proceeding without context. Reason: {}", e.getMessage());
            return List.of();
        }
    }
}
