# Guardrail: Prompt Injection Sanitization

Prevents malicious user prompts from overriding system instructions or bypassing payment confirmation gates.

## Directives
- User inputs are treated as untrusted text strings inside user role blocks.
- Tool schemas remain fixed and enforced at the API gateway layer.
