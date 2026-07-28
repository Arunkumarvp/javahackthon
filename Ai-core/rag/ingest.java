package com.hackathon.aiguardian.rag;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

/**
 * Java RAG Knowledge Base Ingestion Utility.
 */
public class Ingest {

    public static List<String> chunkDocument(File file) throws Exception {
        String content = Files.readString(file.toPath());
        String[] sections = content.split("\n(?=## )|\n\n+");
        List<String> chunks = new ArrayList<>();
        for (String sec : sections) {
            String trimmed = sec.trim();
            if (!trimmed.isEmpty()) {
                chunks.add(trimmed);
            }
        }
        return chunks;
    }
}
