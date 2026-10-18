# Embed lead + consent atomicity — draft engineering assessment (2026-10-14)

Status: **HOLD — design only, no migration or production database changes**.

## Verified repository facts

- `supabase/migrations/005_b7_delivery.sql` defines `public.embed_leads` with UUID primary key and `public.lead_consents` with `lead_id` foreign key referencing the lead, `on delete cascade`. Consent has no declared uniqueness constraint on `lead_id` in the inspected table definition.
- `src/app/api/embed/[key]/leads/route.ts` inserts the lead first, then inserts consent, then writes a best-effort analytics event. It returns HTTP 500 if consent insert fails, but **does not roll back the already-inserted lead**.
- Mocked API tests cover failure reporting, not transactional guarantees. Client-submitted calculation input/output and source URL are untrusted.
- The route validates a signed, time-limited embed session and checks active embed configuration and published calculator/version before writes.

## Recommended implementation (requires separate approval/review)

1. Implement a **single database transaction** via a narrowly scoped PostgreSQL function/RPC that inserts the lead and its consent together. On any exception, the transaction rolls back both. Do not emulate transactions with a compensating delete from the API.
2. Resolve embed key, active status, organization/calculator linkage, published version, and lead-capture enabled **inside the transaction** to reduce time-of-check/time-of-use races. The API must continue validating the signed session and strict request schema before invoking the RPC. Define a typed claim-to-row binding contract; never trust organization or calculator identifiers supplied in the request body.
3. Specify `SECURITY INVOKER` vs `SECURITY DEFINER` only after reviewing existing production RLS, role grants and function ownership. If definer is necessary, set a fixed `search_path`, fully qualify objects, minimize EXECUTE grants and enforce tenant/publication predicates inside the function. No broad anonymous EXECUTE grant.
4. Define an idempotency key and appropriate uniqueness semantics for retries. Decide whether duplicate consent rows are permitted for distinct submissions; do not add `unique(lead_id)` without reviewing consent history requirements.
5. Keep analytics outside the required transaction only if intentionally best-effort; document how analytics failure is observed and retried. Never report a lead as successfully captured without durable consent evidence.
6. Test rollback on consent failure, concurrent revocation, stale version, cross-organization identifiers, duplicate requests, malformed payloads and unauthorized roles in a **disposable local database** before any migration is considered.
7. Inventory deployed schema and permissions read-only, then prepare a reviewed migration with rollback plan and explicit deployment authorization. This document does not authorize executing SQL.

## Release blockers

- No atomic lead/consent transaction in the current implementation.
- Production embed signing secret provisioning unverified.
- Real-browser iframe lifecycle/E2E tests and rate-limiting review remain outstanding.
- All calculator certification/publication gates and production protections remain unchanged.

**Release remains HOLD.**
