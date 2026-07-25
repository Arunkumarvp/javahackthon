# FRONTEND ENGINEER GAMEPLAN: AI Financial Guardian

**Role:** Frontend React Engineer  
**Focus:** React UI, Conversational Chat, Security Visualizations, Dashboard  
**Goal:** Build a "Trust-First" banking interface that makes security and consent visible

---

## 1. CORE MISSION

Build a **secure financial cockpit** where:

- Every AI action requires **explicit confirmation**
- Every data access is **visibly scoped** and revocable
- Every risk/verification result is **clearly explained**

---

## 2. TECH STACK

- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **State:** Zustand (or Context)
- **HTTP:** `fetch` or `axios`
- **Animations:** `framer-motion` (sparingly)

**Optional:** `@tanstack/react-query`, component library in `components/ui`

---

## 3. 6 CORE COMPONENTS

### A. `ChatInterface`

**Purpose:** Primary interaction surface

**Key behaviors:**

- Message list with user/AI bubbles
- Thinking states: "🔍 Fetching transactions", "🔒 Verifying payee"
- Auto-scroll to bottom
- Typing indicator

**Message shape:**

```ts
type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    actionId?: string;
    toolCalls?: string[];
    securityFlags?: string[];
  };
};
```

---

### B. `ActionConfirmationCard` (Security Hero)

**Purpose:** Make "AI cannot act silently" visible

**UI structure:**

- Prominent card in chat
- Header: "⚠️ Action requires your confirmation"
- Body: Action type, details, reasoning
- Buttons: "Confirm & Execute" (green), "Cancel" (red)
- Expander: "Why is this needed?"

**Why wins:** Judges see confirm-before-execute gate

---

### C. `SecurityScopePanel` (Pitch Winner)

**Purpose:** Show AI's data access and consent

**UI elements:**

- Title: "AI Access Scope"
- Permission list with badges:
  - `[✓] Read Transactions (last 90 days)`
  - `[✓] Read Balances`
  - `[ ] Send Money`
- Metadata: Granted/Expires timestamps
- Button: "Revoke AI Access"

**Pro move:** Inline warning when AI requests out-of-scope data

---

### D. `DashboardSummary`

**Purpose:** At-glance financial + security view

**Sections:**

1. **Balance Card** - Amount + trend indicator
2. **Recent Transactions** - 3 items with flag badges
3. **Security Flags** - Counter with expandable details

Updates when AI fetches data or raises flags

---

### E. `AuditLogStream` (Compliance Flex)

**Purpose:** Show everything is logged

**UI:**

- Collapsible bottom panel
- Live entries: timestamps + events
- Examples: "PII masked", "AI requested transaction history"

**Data shape:**

```ts
type AuditEntry = {
  timestamp: string;
  event: string;
  details?: string;
};
```

---

### F. `PayeeVerificationBanner` (Trust Spotlight)

**Purpose:** Make Verification of Payee results visible

**UI variants:**

- **Match (green):** ✅ Payee verified
- **Close Match (amber):** ⚠️ Close match - show differences
- **No Match (red):** 🚫 No match - strong warning

Always show Confirm/Cancel options

---

## 4. API CONTRACT

### Endpoint 1: Send Message

`POST /api/chat`

**Request:**

```json
{
  "sessionId": "user-123",
  "message": "Pay John Smith, sort 12-34-56, acc 12345678",
  "context": { "scopeId": "scope-abc123" }
}
```

**Response (with pending action):**

```json
{
  "messageId": "msg-988",
  "aiResponse": "Close match: 'John A. Smith' vs 'John Smith'.",
  "toolCalls": ["verify_payee"],
  "pendingAction": {
    "actionId": "pay-456",
    "type": "payment",
    "details": {
      "payeeName": "John Smith",
      "amount": 200.0,
      "currency": "GBP",
      "sortCode": "12-34-56",
      "accountNumber": "12345678"
    },
    "reasoning": "Matches usual pattern, but name is close match."
  },
  "securityFlags": ["payee_close_match"],
  "dashboardUpdate": { "flagsCount": 1 }
}
```

### Endpoint 2: Confirm Action

`POST /api/actions/confirm`

**Request:**

```json
{
  "sessionId": "user-123",
  "actionId": "pay-456",
  "confirmed": true
}
```

**Response:**

```json
{
  "status": "executed",
  "auditEntry": {
    "timestamp": "2026-07-24T20:47:20Z",
    "event": "User confirmed payment action pay-456"
  }
}
```

### Endpoint 3: Get Scope

`GET /api/scope?sessionId=user-123`

**Response:**

```json
{
  "scopeId": "scope-abc123",
  "permissions": ["read_transactions_90d", "read_balance"],
  "denied": ["send_money", "view_full_account_numbers"],
  "grantedAt": "2026-07-24T20:45:00Z",
  "expiresAt": "2026-07-25T18:00:00Z"
}
```

---

## 5. TIMELINE (24h)

- **Hr 0-2:** Initialize Vite + Tailwind, layout, API contracts
- **Hr 2-6:** `ChatInterface` with mocked responses, `ActionConfirmationCard`
- **Hr 6-10:** `SecurityScopePanel`, `DashboardSummary`, real API integration
- **Hr 10-14:** `PayeeVerificationBanner`, `AuditLogStream`
- **Hr 14-18:** Polish animations, demo flow
- **Hr 18-22:** README, screenshots, rehearsal
- **Last 2h:** Bug fixes only

---

## 6. DEMO POINTS

- "You can see exactly what the AI is allowed to access" → `SecurityScopePanel`
- "The AI never executes silently" → `ActionConfirmationCard`
- "Payee verification is built in" → `PayeeVerificationBanner`
- "Everything is logged for compliance" → `AuditLogStream`

---

## 7. FILE STRUCTURE

```
src/
  components/
    chat/
      ChatInterface.tsx
      MessageBubble.tsx
      ActionConfirmationCard.tsx
      PayeeVerificationBanner.tsx
    dashboard/
      DashboardSummary.tsx
      BalanceCard.tsx
      RecentTransactions.tsx
      SecurityFlags.tsx
    security/
      SecurityScopePanel.tsx
      AuditLogStream.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
  hooks/
    useChat.ts
    useScope.ts
    useAudit.ts
  api/
    chat.ts
    actions.ts
    scope.ts
    audit.ts
  types/
    index.ts
  App.tsx
  main.tsx
```

---

## 8. CHECKLIST

- [ ] Vite + React + Tailwind running
- [ ] `ChatInterface` with mocked messages + auto-scroll
- [ ] `ActionConfirmationCard` wired to confirm/cancel
- [ ] `SecurityScopePanel` with permissions + revoke
- [ ] `DashboardSummary` with balance, transactions, flags
- [ ] `PayeeVerificationBanner` handles Match/Close/No Match
- [ ] `AuditLogStream` shows live entries
- [ ] All components wired to real backend
- [ ] Demo flow rehearsed
- [ ] README with frontend instructions + screenshots
