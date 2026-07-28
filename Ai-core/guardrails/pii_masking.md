# Guardrail: PII Masking Specification

All text payloads submitted to external LLMs are sanitized by `PiiMaskingService`:
- IBAN -> `[IBAN_MASKED]`
- Credit / Debit PAN -> `[PAN_MASKED]`
- UK Sort Code -> `[SORT_CODE_MASKED]`
- Phone Number -> `[PHONE_MASKED]`
- Email -> `[EMAIL_MASKED]`
