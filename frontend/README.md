# AI Financial Guardian — Frontend React Application

A "Trust-First" banking interface designed to make AI security, data scope, payee verification, and explicit action confirmation visible and controllable.

---

## 🌟 Key Features

1. **Authentication Screens (`LoginPage.jsx` & `SignupPage.jsx`)**
   - Secure login and registration screens using **username** and **password**.
   - Session persistence and easy logout controls.

2. **Conversational Guardian Chat (`ChatPanel.jsx`)**
   - Real-time interaction stream with thinking indicators ("🔍 Fetching transactions", "🔒 Verifying payee").
   - Tool execution badges showing transparent AI API calls.

3. **Action Confirmation Card (`ConfirmActionModal.jsx`)**
   - Core security gate ensuring AI **never acts silently**.
   - Explicit "Confirm & Execute" vs "Cancel" authorization controls with risk reasoning.

4. **Payee Verification Banner (`ConfirmActionModal.jsx` / `AnomalyFlagCard.jsx`)**
   - Live Verification of Payee (VOP) match status (MATCH, CLOSE_MATCH, NO_MATCH) against Open Banking registries.

5. **Security Scope Panel (`AccessScopeIndicator.jsx`)**
   - Transparent display of active AI data access consents (`[✓] Read Transactions`, `[✓] Read Balances`).
   - One-click emergency **Revoke AI Access** button.

6. **Dashboard Summary (`SummaryPanel.jsx`)**
   - Real-time liquid balance, monthly spending, security flags counter, and recent transaction history.

7. **Compliance Audit Stream (`AuditLogStream.jsx`)**
   - Live audit stream logging every security check, PII masking event, user login, and confirmation for compliance.

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Icons:** `lucide-react`
- **Animations:** Framer Motion & CSS custom keyframes

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation & Run

```bash
# Navigate into the frontend directory
cd frontend

# Install dependencies
npm install

# Start local development server (runs on http://localhost:3000)
npm run dev

# Build production bundle
npm run build
```

---

## 📁 Component Structure

```
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ChatPanel.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── SummaryPanel.jsx
│   │   ├── AccessScopeIndicator.jsx
│   │   ├── ConfirmActionModal.jsx
│   │   ├── AnomalyFlagCard.jsx
│   │   └── AuditLogStream.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── chatService.js
│   ├── hooks/
│   │   └── useChat.js
│   └── styles/
│       └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

<!-- CHECKPOINT id="ckpt_mrz79k6e_ollhkf" time="2026-07-24T17:14:12.710Z" note="auto" fixes=0 questions=0 highlights=0 sections="" -->
