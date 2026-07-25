# folder-tree.md

### AI Financial Guardian — Complete Software Architecture & Folder Structure

This is the final, authoritative folder structure for the project. All team members and any AI coding assistant should build against this exact layout — no ad-hoc top-level folders, no restructuring mid-hackathon.

---

## Root Layout

```
.
├── ai-core/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 1. ai-core/ — AI logic, prompts, tools, RAG, guardrails

```
ai-core/
├── prompts/
│   ├── system_prompt.md
│   ├── payee_verification_prompt.md
│   ├── insight_generation_prompt.md
│   └── rag_answer_prompt.md
│
├── rag/
│   ├── knowledge_base/
│   │   ├── banking_glossary.md
│   │   ├── open_banking_faq.md
│   │   ├── transaction_dispute_faq.md
│   │   └── security_policy_docs.md
│   ├── embeddings/
│   │   └── vector_store/            # gitignored — regenerated via ingest.py
│   ├── ingest.java                    # chunk + embed knowledge_base docs
│   ├── retriever.java                 # query vector store, return top-k chunks
│   ├── service.java                   # FastAPI app exposing /retrieve endpoint
│   ├── requirements.txt
│   └── README.md
│
├── tools/
│   ├── tool_schemas.json            # single source of truth for Claude tool-calling
│   ├── get_transactions.md
│   ├── get_balance.md
│   ├── flag_transaction.md
│   ├── set_budget_alert.md
│   ├── check_payee_match.md
│   └── rag_lookup.md
│
├── guardrails/
│   ├── pii_masking.md
│   ├── injection_sanitization.md
│   └── confirm_before_action.md
│
└── README.md
```

---

## 2. backend/ — Spring Boot application

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/hackathon/aiguardian/
│   │   │   ├── AiGuardianApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── ClaudeApiConfig.java
│   │   │   │   ├── DatabaseConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── RagClientConfig.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── ChatController.java
│   │   │   │   ├── TransactionController.java
│   │   │   │   ├── ActionController.java
│   │   │   │   └── ScopeController.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── ClaudeToolService.java
│   │   │   │   ├── RagRetrievalService.java
│   │   │   │   ├── BankingApiService.java
│   │   │   │   ├── PayeeVerificationService.java
│   │   │   │   ├── PiiMaskingService.java
│   │   │   │   ├── ConsentScopeService.java
│   │   │   │   └── AuditLogService.java
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── Transaction.java
│   │   │   │   ├── Payee.java
│   │   │   │   ├── ConsentScope.java
│   │   │   │   ├── PendingAction.java
│   │   │   │   └── AuditLogEntry.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── TransactionRepository.java
│   │   │   │   ├── PendingActionRepository.java
│   │   │   │   └── AuditLogRepository.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── ChatRequest.java
│   │   │   │   ├── ChatResponse.java
│   │   │   │   └── ActionConfirmationRequest.java
│   │   │   │
│   │   │   └── exception/
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── ScopeDeniedException.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-demo.yml
│   │
│   └── test/
│       └── java/com/hackathon/aiguardian/
│           ├── service/
│           │   ├── PayeeVerificationServiceTest.java
│           │   └── ConsentScopeServiceTest.java
│           └── controller/
│               └── ActionControllerTest.java
│
├── pom.xml
└── README.md
```

---

## 3. frontend/ — React application

```
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── components/
│   │   ├── ChatPanel.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── SummaryPanel.jsx
│   │   ├── AccessScopeIndicator.jsx
│   │   ├── ConfirmActionModal.jsx
│   │   └── AnomalyFlagCard.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── chatService.js
│   │
│   ├── hooks/
│   │   └── useChat.js
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   └── assets/
│
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 4. docs/ — Presentation & submission artifacts

```
docs/
├── architecture_diagram.png
├── demo_script.md
├── rag_architecture.md
└── evaluation_mapping.md
```

---

## Design Principles Behind This Structure

1. **Separation of AI logic from application logic.** `ai-core/` holds prompts, tool schemas, and RAG independently of `backend/` — either can change without touching the other. This is what lets you iterate on a prompt at 2am without redeploying Java.

2. **One direction of dependency.** `frontend → backend → ai-core/RAG service → Claude API / Banking API`. Nothing calls backward. Controllers never contain logic; services never touch the database directly (repositories do); nothing but `PiiMaskingService` constructs LLM payloads.

3. **Security artifacts are first-class, not buried.** `guardrails/` sits at the same level as `prompts/` and `tools/` — a judge or reviewer opening the repo sees your security thinking immediately, not three folders deep.

4. **Everything a judge needs to evaluate is at the top level or one level down.** `README.md`, `docs/evaluation_mapping.md`, and `docker-compose.yml` are all reachable without exploring the whole tree.

5. **Nothing environment-specific is committed.** `.env.example` only, `vector_store/` gitignored, secrets always via environment variables.

---

## Setup Order (build this structure in this sequence)

1. Root files (`.gitignore`, `.env.example`, `README.md`) — 5 minutes, do this first
2. `backend/` skeleton with `pom.xml` and empty package structure
3. `ai-core/tools/tool_schemas.json` — define your tools before writing the service that uses them
4. `ai-core/prompts/system_prompt.md` — draft even a rough version early; you'll iterate on it all day
5. `frontend/` skeleton via Vite scaffold
6. `ai-core/rag/` — build this last; it's the most skippable if time runs short

<!-- CHECKPOINT id="ckpt_mrz6wp7s_5jneyr" time="2026-07-24T17:04:12.712Z" note="auto" fixes=0 questions=0 highlights=0 sections="" -->
