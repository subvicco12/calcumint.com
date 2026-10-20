# Isolated HTTP batch acceptance — 2026-10-20

RELEASE HOLD. Proposal SQL remains guarded, outside migrations and unapplied outside disposable fixtures. No production credentials, endpoints, payments, migrations or deployment were used.

Run `node tests/api-batch/atomic-postgres.mjs --http` after installing repository dependencies. Without `--http` the existing 13-case native fixture is unchanged. The HTTP option runs those 13 cases, eight PostgREST cases, then two focused route integration cases using `tests/api-batch/vitest.postgres.config.ts`. Do not invoke that config without its fixture-generated environment. PostgreSQL 16 and PostgREST 12.2.3 image digests are pinned in the fixture. Docker uses a unique internal network, synthetic authenticator password and signed synthetic role JWTs, temporary database storage, no published host ports, and unconditional cleanup. HTTP uses an inspected private container address; the network's internal flag and empty port bindings are asserted. Docker inherits the managed environment for image pulls.

Eight real HTTP RPC guarantees:

1. Signed anon/authenticated JWTs cannot execute either privileged RPC or select internal receipts (42501 with 401/403); service role succeeds.
2. PostgreSQL canonicalizes uppercase UUID text. JSONB object ordering, apostrophes and Unicode round-trip; duplicate submissions preserve the original job/output even with newly supplied output. Conflicts return PT409/409 without debit.
3. Malformed UUID returns 22P02; wrong hash or organization returns PT403/403 without writes.
4. Simultaneous identical submissions share one job and debit each accepted POST. Simultaneous distinct jobs at monthly quota one have exactly one success and one PT429/429 with no partial job/debit.
5. Simultaneous conflicting payloads under one identity commit only one receipt/job/debit.
6. A late AFTER INSERT receipt exception returns HTTP failure and rolls back receipt, job and usage; explicit retry succeeds after removing the fault.
7. A receipt trigger pauses after earlier transaction writes; polling pg_stat_activity establishes that barrier before terminating the actual PostgREST database backend. HTTP fails, all writes roll back, and explicit retry succeeds. This is backend interruption, not an assumption that cancelling fetch cancels a database transaction.
8. A successful HTTP acknowledgement is deliberately discarded; read-only HTTP GET RPC recovers original version at exhausted quota after calculator unpublication/version change. Snapshot remains unchanged, another POST returns 429, and absent recovery returns missing.

Two route integration guarantees:

- Actual route handlers, body/ack validation, deterministic calculator engine, supabase-js HTTP serialization, PostgREST and proposed SQL execute together. Valid/invalid/negative rows retain order, uppercase request identity succeeds, duplicate returns the same job, conflict is 409 and GET recovers original output.
- A fixture fetch wrapper first receives and parses the completed PostgREST response, then throws before returning it to the route. POST returns 503 without an automatic resubmit; subsequent route GET recovers and SQL-backed usage inspection finds exactly one debit for that identity.

The route integration substitutes only verified authentication and admin client construction. The client uses real HTTP with a fixture fetch adapter removing Supabase gateway's `/rest/v1` prefix, because bare PostgREST has no gateway. The lost-response injector is entirely test code. This proves engine → route handler → HTTP → SQL, not a deployed Next server, Supabase gateway, production API authentication, TLS, external network fault behavior or production schema/ACL fidelity.

Verified defect: valid uppercase Idempotency-Key UUIDs passed Zod, but PostgreSQL returned canonical lowercase request_id; strict raw-text comparison falsely produced 503 for a committed success/recovery. The focused test first failed with expected 200 / actual 503. Both handlers now normalize validated UUIDs before RPC and acknowledgement correlation; POST and GET regression cases pass. No SQL/policy/formula change was necessary.

Validation:

- `node tests/api-batch/atomic-postgres.mjs --http`: 13 native + 8 HTTP + 2 route integration cases passed.
- `npx vitest run src/app/api/v1/batch/route.test.ts`: 16 passed.
- `npx tsc --noEmit`: passed.
- `npx eslint src/app/api/v1/batch/route.ts src/app/api/v1/batch/route.test.ts tests/api-batch`: passed.

Remaining unknowns include production role ownership/default privileges/RLS/schema history, all external quota writers, builder definition immutability outside the RPC, retention/deletion and receipt privacy, deployed gateway/auth fidelity, performance, and adoption approvals. All-writer key locking and READ COMMITTED remain required. GET missing is only an observation at its read snapshot; it cannot prove an in-flight POST will never commit. Accepted duplicate POST retains one request unit per request; GET recovery is read-only. No exactly-once network claim or release authorization follows from these tests.
