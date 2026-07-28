# Java & Weaviate RAG (Retrieval-Augmented Generation) Engine

This directory contains the RAG knowledge base and driver specifications for Weaviate Vector Database integration.

## Architecture
- `knowledge_base/`: Markdown knowledge documents covering Open Banking FAQs, glossary terms, transaction dispute policies, and security rules.
- `ingest.java`: Document chunking and section extraction engine.
- `retriever.java`: Term frequency relevance scoring and top-K chunk retrieval.
- `WeaviateRagService.java`: Direct REST client interfacing with Weaviate (`/v1/schema`, `/v1/objects`, `/v1/graphql`).
- `JavaRagService.java`: Primary Spring RAG service orchestrating Weaviate vector search with zero-latency in-memory fallback.

## Docker Deployment
```bash
docker compose up -d weaviate
```
- Endpoint: `http://localhost:8085`
- Schema Class: `KnowledgeChunk`
