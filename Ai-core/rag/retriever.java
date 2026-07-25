package com.hackathon.aiguardian.rag;

import java.util.*;

/**
 * Java RAG Knowledge Base Search & Retriever Utility.
 */
public class Retriever {

    public static List<String> retrieveTopK(List<String> chunks, String query, int topK) {
        if (query == null || chunks == null || chunks.isEmpty()) return Collections.emptyList();
        
        Set<String> queryWords = new HashSet<>(Arrays.asList(query.toLowerCase().split("\\s+")));
        Map<String, Double> scored = new HashMap<>();

        for (String chunk : chunks) {
            String[] words = chunk.toLowerCase().split("\\s+");
            int matches = 0;
            for (String w : words) {
                if (queryWords.contains(w)) matches++;
            }
            if (matches > 0) {
                scored.put(chunk, (double) matches / words.length);
            }
        }

        List<Map.Entry<String, Double>> list = new ArrayList<>(scored.entrySet());
        list.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<String> top = new ArrayList<>();
        for (int i = 0; i < Math.min(topK, list.size()); i++) {
            top.add(list.get(i).getKey());
        }
        return top;
    }
}
