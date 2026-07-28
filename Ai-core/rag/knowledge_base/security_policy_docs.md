# AI Financial Guardian Security Policy

## Confirm-Before-Action Gate
State-mutating operations (`execute_transfer`, `set_budget_alert`) MUST create a `PendingAction` in the backend database. No payment transfer can be completed until the user clicks 'Confirm' or provides MFA authorization.

## PII Sanitization Policy
All outgoing prompts to external LLM APIs are automatically scrubbed for sensitive numbers (IBANs, credit card PANs, sort codes, phone numbers, email addresses) by `PiiMaskingService`.
