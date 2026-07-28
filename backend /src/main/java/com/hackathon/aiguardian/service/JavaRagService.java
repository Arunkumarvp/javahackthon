package com.hackathon.aiguardian.service;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

/**
 * JavaRagService
 *
 * Purpose: 100% Pure Java RAG Retrieval Engine with Weaviate Vector Database integration.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JavaRagService {

    private final WeaviateRagService weaviateRagService;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RagChunk {
        private String chunkId;
        private String documentName;
        private String content;
        private double score;
    }

    private final List<RagChunk> indexedChunks = new ArrayList<>();

    @PostConstruct
    public void init() {
        log.info("[JavaRagService] Initializing Java RAG Knowledge Index & Weaviate Vector Store...");
        weaviateRagService.ensureSchemaExists();
        loadKnowledgeBase();
    }

    public synchronized void loadKnowledgeBase() {
        indexedChunks.clear();

        List<File> targetDirs = List.of(
            new File("../Ai-core/rag/knowledge_base"),
            new File("Ai-core/rag/knowledge_base"),
            new File("src/main/resources/knowledge_base")
        );

        File kbDir = null;
        for (File dir : targetDirs) {
            if (dir.exists() && dir.isDirectory()) {
                kbDir = dir;
                break;
            }
        }

        if (kbDir != null && kbDir.listFiles() != null) {
            log.info("[JavaRagService] Loading knowledge base from directory: {}", kbDir.getAbsolutePath());
            for (File file : Objects.requireNonNull(kbDir.listFiles())) {
                if (file.isFile() && file.getName().endsWith(".md")) {
                    indexMarkdownFile(file);
                }
            }
        }

        if (indexedChunks.isEmpty()) {
            log.info("[JavaRagService] No external KB files found. Seeding built-in Open Banking & AI Guardian knowledge.");
            seedBuiltInKnowledge();
        }

        // Push indexed chunks to Weaviate Vector Database
        for (RagChunk chunk : indexedChunks) {
            weaviateRagService.indexChunk(chunk.getChunkId(), chunk.getDocumentName(), chunk.getContent());
        }

        log.info("[JavaRagService] Total indexed RAG chunks: {}", indexedChunks.size());
    }

    public synchronized void ingestDocument(String documentName, String content) {
        if (content == null || content.isBlank()) return;
        String[] sections = content.split("\n(?=## )|\n\n+");
        int sectionIdx = 0;
        for (String sec : sections) {
            String trimmed = sec.trim();
            if (trimmed.length() > 20) {
                RagChunk chunk = new RagChunk(
                    documentName + "-" + (++sectionIdx),
                    documentName,
                    trimmed,
                    1.0
                );
                indexedChunks.add(chunk);
                weaviateRagService.indexChunk(chunk.getChunkId(), chunk.getDocumentName(), chunk.getContent());
            }
        }
        log.info("[JavaRagService] Ingested document '{}' into vector store.", documentName);
    }

    /**
     * Searches knowledge base via Weaviate vector search with in-memory fallback.
     */
    public List<RagChunk> search(String query, int topK) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        // Try Weaviate Vector DB query first
        List<RagChunk> vectorResults = weaviateRagService.searchVectorDb(query, topK);
        if (vectorResults != null && !vectorResults.isEmpty()) {
            return vectorResults;
        }

        // Fallback: In-memory term overlap similarity
        Set<String> queryTokens = tokenize(query);
        if (queryTokens.isEmpty()) {
            return Collections.emptyList();
        }

        List<RagChunk> scored = new ArrayList<>();
        for (RagChunk chunk : indexedChunks) {
            double score = computeSimilarity(queryTokens, chunk.getContent());
            if (score > 0.05) {
                scored.add(new RagChunk(chunk.getChunkId(), chunk.getDocumentName(), chunk.getContent(), score));
            }
        }

        return scored.stream()
            .sorted(Comparator.comparingDouble(RagChunk::getScore).reversed())
            .limit(topK)
            .collect(Collectors.toList());
    }

    private void indexMarkdownFile(File file) {
        try {
            String content = Files.readString(file.toPath());
            String[] sections = content.split("\n(?=## )|\n\n+");
            int sectionIdx = 0;
            for (String sec : sections) {
                String trimmed = sec.trim();
                if (trimmed.length() > 30) {
                    indexedChunks.add(new RagChunk(
                        file.getName() + "-" + (++sectionIdx),
                        file.getName(),
                        trimmed,
                        0.0
                    ));
                }
            }
        } catch (Exception e) {
            log.error("[JavaRagService] Error reading markdown file {}: {}", file.getName(), e.getMessage());
        }
    }

    private double computeSimilarity(Set<String> queryTokens, String chunkText) {
        Set<String> chunkTokens = tokenize(chunkText);
        if (chunkTokens.isEmpty()) return 0.0;

        int matchCount = 0;
        for (String qToken : queryTokens) {
            if (chunkTokens.contains(qToken)) {
                matchCount++;
            }
        }

        return (double) matchCount / Math.sqrt(queryTokens.size() * chunkTokens.size());
    }

    private Set<String> tokenize(String text) {
        return Arrays.stream(text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+"))
            .filter(t -> t.length() > 2)
            .filter(t -> !STOP_WORDS.contains(t))
            .collect(Collectors.toSet());
    }

    private static final Set<String> STOP_WORDS = Set.of(
        "the", "and", "is", "for", "that", "this", "with", "you", "are", "have", "was", "not", "but", "what", "how", "can"
    );

    private void seedBuiltInKnowledge() {
        indexedChunks.add(new RagChunk(
            "ob-faq-1", "open_banking_faq.md",
            "Open Banking AISP (Account Information Service Provider) allows authorized applications to read financial balances and transaction history with strict explicit user consent.",
            1.0
        ));
        indexedChunks.add(new RagChunk(
            "vop-faq-1", "banking_glossary.md",
            "Verification of Payee (VoP) is a mandatory security check that verifies the account name registered at the recipient bank before initiating outbound bank transfers.",
            1.0
        ));
        indexedChunks.add(new RagChunk(
            "dispute-1", "transaction_dispute_faq.md",
            "If an unauthorized or suspicious transaction is detected, the AI Financial Guardian flags the transaction and prepares a dispute claim under UK Open Banking rights.",
            1.0
        ));
        indexedChunks.add(new RagChunk(
            "security-1", "security_policy_docs.md",
            "Confirm-Before-Action Gate: Any state-mutating operation (such as initiating bank transfers or changing budget limits) MUST require explicit step-up confirmation from the user.",
            1.0
        ));
    }
}
