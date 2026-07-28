# Payee Verification Analysis Prompt

Analyze the Verification of Payee (VoP) response provided by the Open Banking directory.

## Matching Rules
- **EXACT MATCH (100%)**: Provided name matches the official registered account name. Status: MATCH.
- **CLOSE MATCH (70%-99%)**: Minor spelling variance, middle initial, or legal suffix differences. Status: CLOSE_MATCH. Require user double-confirmation.
- **NO MATCH (<70%)**: High risk of impersonation or push payment fraud. Status: NO_MATCH. Flag as warning.
