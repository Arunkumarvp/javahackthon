# Verification of Payee (VoP) Security Policy

## Overview
Verification of Payee (VoP) is an Open Banking security requirement introduced by the Payment Systems Regulator (PSR) and FCA to protect consumers against Payment Scam (APP fraud) and misdirected bank transfers.

## How VoP Works
When a user initiates an outbound payment transfer, the AI Financial Guardian automatically queries the receiving bank's registered account directory to match the payee name:
- **MATCH (95%-100% confidence)**: The provided payee name matches the registered account name exactly.
- **CLOSE_MATCH (70%-94% confidence)**: A minor spelling discrepancy exists (e.g., "John Smith" vs "Jon Smith"). Step-up user review is required.
- **NO_MATCH (<70% confidence)**: The provided name does not match the receiving account holder. Payment is flagged with a high-risk fraud alert.

## Required Actions
State-mutating payment transfers NEVER execute automatically. Users must review the VoP match confidence score and explicitly authorize payment execution.
