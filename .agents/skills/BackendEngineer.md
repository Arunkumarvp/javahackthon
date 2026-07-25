# AI Financial Guardian: Backend Conventions

## 1. Scope

`backend/`: Controllers, Services, Repositories, Models, DTOs, Configs, Banking API, Claude API, RAG integration.

## 2. Fixed Tech Stack

- **Runtime:** Java 17+ | Spring Boot 3.x | Maven
- **Database:** PostgreSQL (Neon/Supabase) + Spring Data JPA
- **AI Integration:** Claude API (`claude-3-5-sonnet-20240620`, tool calling)
- **RAG:** HTTP calls to Python FastAPI service

## 3. Package Structure & Flow

```

com.hackathon.aiguardian
├── config | controller | service | model | repository | dto

```

> **Flow Rule:** Controller → Service → Repository. Direct cross-repository calls are prohibited.

## 4. Mandatory Core Rules

1. **Confirm-Before-Action:** State changes require creating a `PendingAction`, returning it for user confirmation, and executing strictly via `/confirm`.
2. **PII Masking:** Route all Claude payload data through `PiiMaskingService`.
3. **Audit Logging:** Log every AI interaction via `AuditLogService`.
4. **Consent Scope:** Validate `ConsentScopeService` prior to executing sensitive operations.
5. **Tool Schemas:** Load dynamically from `ai-core/tools/tool_schemas.json`.

## 5. Standard Naming

- **Classes:** `TransactionService`, `PayeeVerificationService`
- **Endpoints:** `/api/transactions`, `/api/actions/confirm`
- **DTOs:** `ChatRequest`, `ActionConfirmationResponse`

## 6. Error Handling & Config

- Single `@ControllerAdvice` for global exceptions.
- JSON error format: `{"error": "SCOPE_DENIED", "message": "..."}`.
- Graceful degradation for external service failures.
- Environment variables for secrets (`${CLAUDE_API_KEY}`).
- Profile: `application-demo.yml`. Maintain `.env.example`.

## 7. Anti-Patterns & DOD

- **Prohibited:** Custom JWT/OAuth, Message Queues, extra microservices.
- **Testing:** Minimal test focus (confirm gates & payee verification only).
- **Definition of Done (DoD):** Feature complete when the confirm gate and security rules execute end-to-end without bypass.

```

```

<!-- CHECKPOINT id="ckpt_mrz5u4bq_z8yb6w" time="2026-07-24T16:34:12.710Z" note="auto" fixes=0 questions=0 highlights=0 sections="" -->
