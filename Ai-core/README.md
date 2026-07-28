# AI Core — Open Banking AI Guardian Engine

The `Ai-core` directory contains the complete AI logic, prompt templates, tool definitions, knowledge base documents, guardrails, and Java RAG retrieval system.

## Structure
- `prompts/`: System, VoP, insight generation, and RAG answer prompt specifications.
- `rag/`: Embedded Pure Java RAG engine (`JavaRagService`) and Open Banking knowledge base documents.
- `tools/`: Single-source-of-truth tool schemas (`tool_schemas.json`) and tool specifications.
- `guardrails/`: Security guardrail policies (PII masking, injection protection, Confirm-Before-Action gate).
