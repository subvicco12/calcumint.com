# Durable atomic batch lane acceptance — 20 October 2026

Baseline: #1443 `0a7d9af97da42ab01a18f5ec7aa0bad0015a4474`. RELEASE HOLD. SQL is a guarded proposal outside migrations, executed only in disposable PostgreSQL fixtures.

## Verified engineering

The old route debited quota separately from REST job persistence and had no durable recovery identity. The replacement accepts a stable correlation UUID, verifies credentials without pre-debit, and delegates quota/job/receipt persistence to one transaction. The database generates the job ID and binds key, organization, request payload, immutable version, definition and output. Accepted duplicate POSTs preserve one-unit-per-request metering and return the existing job; authenticated GET recovers without debit or re-execution. Unknown writes are not automatically repeated.

A corrupt receipt payload could initially rebind an unchanged job to different request inputs. A failing synthetic test established the gap; canonical receipt-to-job payload checks now reject both read recovery and duplicate POST. Snapshot corruption, malformed acknowledgements and JSON numeric overflow also fail closed.

## Validation evidence

- `npx vitest run src/app/api/v1/batch/route.test.ts src/lib/api/auth-quota-contract.test.ts`: **27 passed** (14 route, 13 authentication).
- `node tests/api-batch/atomic-postgres.mjs`: **13 passed**, using pinned PostgreSQL 16 on an internal temporary Docker network, no published ports, actual migrations 005/006 over synthetic prerequisites.
- `npm run typecheck`: passed.
- `npx eslint src/app/api/v1/batch/route.ts src/app/api/v1/batch/route.test.ts src/lib/api/auth.ts src/lib/api/auth-quota-contract.test.ts tests/api-batch/atomic-postgres.mjs`: passed.
- `git diff --check`: passed.
- Parent integration owns certification, webpack build and final-head GitHub CI; no claim that those ran in this lane.

PostgreSQL covers concurrent identical/conflicting requests, independent monthly/minute limits, mixed legacy quota writers, no-debit recovery after a lost reply, historical version retention, ownership/scopes/Business boundaries, stale definitions/publication, rollback at job/receipt/usage failures, explicit retries, client role denial, unsupported isolation, corrupt receipts/snapshots and timezone-independent recovery.

## Adoption blockers and decisions

1. Adopt the separate guarded key-lock quota proposal for **all** quota writers. The historical unlocked quota writer does not provide mixed-writer concurrency safety. READ COMMITTED is required; quota session timezone semantics are unchanged.
2. Approve the failed-request policy explicitly: rejected validation, missing probes and uncommitted jobs have no debit, unlike legacy authentication pre-debit. Accepted duplicate POSTs consume one unit, not units per row; exhausted clients use GET. Rejected/probe traffic needs reviewed abuse controls.
3. Review actual schema/migration history, function ownership, grants, RLS, service-role boundaries, retention and receipt data privacy before any migration or joint route/RPC rollout. Existing jobs without receipts are not retroactively idempotent.
4. Verify deployed HTTP/PostgREST transport and external writers separately. Service RPCs trust server-generated deterministic outputs; SQL does not independently execute TypeScript formulas.

No production atomicity or exactly-once delivery guarantee is claimed. No production writes, migrations, formula/identity changes, approvals or publication occurred. Unavailable authority remains UNKNOWN.
