# API quota contract checkpoint — 20 October 2026

RELEASE HOLD. Independent follow-up to the cumulative product checkpoint #1442. No production SQL, migrations, API calls, payments or auth experiments.

## Verified defects

1. Actual migration 006 quota SQL checks current usage and then inserts without locking the key. A disposable PostgreSQL BEFORE INSERT advisory barrier forces two calls to finish their count reads before either insert. With monthly quota one, both return true and persist two units. The barrier is fixture-only and removed before proposal testing.
2. API-key authentication accepted truthy malformed quota acknowledgements (objects/strings) and reported false-like malformed values as exhausted quota. Eleven focused tests were added; eight failed before the strict boolean change. Storage uncertainty now returns 503, false retains 429, true alone authorizes. Unknown storage diagnostics are not exposed; no last-used update follows rejected acknowledgement.

## Proposed database correction

Guarded `docs/architecture/proposals/ATOMIC-API-QUOTA.sql` preserves the existing function signature and request-unit/month/minute/Business semantics. It locks the API-key row before reading either window, verifies active key and locks the Business owner's profile, and inserts one usage debit inside the same transaction. Fixed pg_catalog/public search_path, qualified relations and service-role-only EXECUTE remain explicit. It changes neither RLS nor calculator formulas/versions.

Disposable PostgreSQL first proves the legacy race, then applies the proposal only after removing its guard from fixture stdin. Concurrent callers at the monthly boundary and independently at the minute boundary return one true/one false and only one unit. An injected late failure rolls back the debit; explicit retry succeeds. Client roles cannot execute; revoked keys fail closed. Existing ten embed/consent/receipt cases remain passing in the same harness (twelve top-level cases total).

The proposal explicitly requires READ COMMITTED and rejects REPEATABLE READ/SERIALIZABLE before any debit. A row lock alone does not refresh an older transaction snapshot; the additional test was observed failing before this guard. This verifies only cooperating callers of this function in the isolated schema under its enforced isolation contract. Privileged direct usage inserts, quota-setting changes, other data writers, actual production grants/owners/default privileges and full deployed transport require owner review. Quota counts authenticated request attempts, not exactly-once business operations. Lost response retries may consume additional request units. Batch job creation and quota debit remain separate transactions; a durable batch request identity and joint persistence contract remain the next substantial API batch.

## Integration and owner actions

The API acknowledgement correction is independently safe and requires no schema adoption. The locking SQL remains an unapplied proposal using CREATE OR REPLACE for the existing RPC; do not apply it from a draft. Database/security owner must inspect exact deployed function/schema, all writers and lock order, then review intended role ownership, adoption/rollback and contention/performance. Billing/payment/auth-session paths are not changed; this modifies only API-key quota acknowledgement validation.

Focused tests, typecheck, affected lint and webpack build passed locally. Exact-head CI and source/candidate provenance are recorded in the draft PR. An inherited static embed contract failure from #1442 was corrected on that source branch and inherited by rebase before this follow-up commit; source PRs remain draft/unmerged. No certification/publication inference. All missing owner/specialist approvals remain UNKNOWN.
