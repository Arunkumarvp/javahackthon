# AI Financial Guardian — Backend

Spring Boot 3.x REST API backend for the AI Financial Guardian system.

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **OpenRouter API** (LLM brain — OpenAI-compatible, model-agnostic)
- **Spring Data JPA** + **PostgreSQL** (production) / **H2** (demo)
- **Spring Security** — stateless Bearer token auth

## Quick Start

### 1. Supabase PostgreSQL Mode (Production & Cloud DB)

```bash
cd "backend "

# Set Supabase & OpenRouter credentials in environment
export SPRING_PROFILES_ACTIVE=supabase
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=@admin2001@34
export OPENROUTER_API_KEY=sk-or-v1-your-key-here
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Run Spring Boot backend with Supabase profile
/opt/idea-IU-262.8665.258/plugins/maven-plugin/lib/maven3/bin/mvn spring-boot:run
```

### 2. Demo Mode (H2 In-Memory — no setup required)

```bash
cd "backend "

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export OPENROUTER_API_KEY=sk-or-v1-your-key-here

mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

Server starts at: **http://localhost:8080**

## Database (Supabase PostgreSQL Integration)

- **Host**: `db.ksfpletohhmqjdzzuwmv.supabase.co:5432`
- **Database**: `postgres`
- **SSL**: Required (`sslmode=require`)
- **Tables Auto-created**:
  - `users` — User credentials & session tokens
  - `transactions` — Financial transaction history & anomaly flags
  - `payees` — Verification of Payee (VoP) records with masked PII
  - `consent_scopes` — AI permission scopes & lifecycles
  - `pending_actions` — High-risk actions awaiting user authorization
  - `audit_log_entries` — Regulatory compliance audit trail

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive Bearer token |
| POST | `/api/chat` | Bearer | Chat with AI Financial Guardian |
| POST | `/api/actions/confirm` | Bearer | Confirm or cancel pending action |
| GET  | `/api/scope` | Bearer | Get current consent scope |
| POST | `/api/scope/revoke` | Bearer | Emergency scope revocation |
| GET  | `/api/summary` | Bearer | Dashboard financial summary |

## Authentication

All protected endpoints require: `Authorization: Bearer <token>`

Token is returned from `/api/auth/login` and `/api/auth/register`.

## OpenRouter Setup

1. Create account at [openrouter.ai](https://openrouter.ai)
2. Generate API key under Settings → Keys
3. Set `OPENROUTER_API_KEY` in your `.env` file
4. Optionally change `OPENROUTER_MODEL` to any supported model

## Production Setup

```bash
# Set environment variables
export DATABASE_URL=jdbc:postgresql://your-neon-host/aiguardian?sslmode=require
export DATABASE_USERNAME=your-user
export DATABASE_PASSWORD=your-password
export HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
export OPENROUTER_API_KEY=sk-or-v1-...
export APP_URL=https://your-production-domain.com

mvn spring-boot:run
```

## Running Tests

```bash
mvn test
```

## Project Structure

```
src/main/java/com/hackathon/aiguardian/
├── AiGuardianApplication.java   — Entry point
├── config/                      — OpenRouter, DB, Security, RAG
├── controller/                  — Auth, Chat, Action, Transaction, Scope
├── service/                     — OpenRouterService (LLM), Auth, Banking, VoP, PII, Scope, Audit, RAG
├── model/                       — JPA entities
├── repository/                  — Spring Data repositories
├── dto/                         — Request/Response records
└── exception/                   — GlobalExceptionHandler, ScopeDeniedException
```

## Security Architecture

- **PII Masking** — all user messages sanitised before LLM dispatch
- **Confirm-Before-Action** — state-mutating operations require explicit `/api/actions/confirm`
- **Consent Scope** — permission validation on every sensitive operation
- **Audit Trail** — every AI interaction and action persisted to `audit_log_entries`
