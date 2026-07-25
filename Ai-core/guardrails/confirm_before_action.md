# Guardrail: Confirm-Before-Action Protocol

Zero unverified state mutations:
1. When an LLM calls a state-mutating tool (`execute_transfer`, `set_budget_alert`), a `PendingAction` entity is created with status `PENDING`.
2. Action details are returned to the user frontend with a step-up confirmation modal.
3. Execution ONLY occurs when `/api/actions/confirm` receives explicit user consent (`confirmed: true`).
