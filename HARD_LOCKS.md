# Hard Locks & System Guarantees

This project enforces the following non-negotiable hard locks at the code and database level:

- No demo mode or seed data allowed
- No deletes or updates allowed on EvidenceNode or ImmutableEventLedger (append-only)
- Employees and Users are strictly separate entities
- All evidence and ledger entries are immutable and audit-defensible

See prisma/middleware/hardLocks.ts for enforcement logic.

Any violation of these rules will throw an error and block execution.
