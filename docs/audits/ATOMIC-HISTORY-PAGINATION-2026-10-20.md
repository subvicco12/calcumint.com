# Atomic history quota and private pagination acceptance

RELEASE HOLD. Baseline cumulative draft #1457 `19ed078422d5057e5ff24b42213f37f068bbbb3f`. Source PRs unchanged. No production access, SQL application, certification or publication occurred.

## Writer inventory and contract

| Writer | Application path | Proposed storage protection |
| --- | --- | --- |
| Shared calculator browser save | `src/components/calculator-account-actions.tsx` | Owner-bound `save_calculation_history_atomic`; capture UUID retained across uncertain retries |
| Generic server history save | `src/app/account/actions.ts` | Same RPC; caller can supply durable UUID; omitted UUID is generated for that invocation only |
| Fourteen private DRAFT saves | `src/app/account/drafts/actions.ts` | Same RPC; strict v1 snapshot validation; exact owned retry reconciliation |
| History-to-project scenario copy | `src/app/account/actions.ts` | `save_project_scenario_atomic`; immutable owned source copied within transaction; form UUID retained across retries |
| Scenario rename | Existing owner-filtered REST update | Proposed trigger permits name/updated_at only, locks current plan |
| Project creation/update | Existing owner-filtered REST path | Proposed trigger locks current profile and requires Pro/Business; no invented numeric quota |
| Legacy direct history/scenario inserts | No identified application save bypass remains | Proposed triggers enforce snapshot/owner/plan policy, including legacy direct inserts |

Deletes remain owner/RLS-controlled and allow cleanup after downgrade. Local synthetic capture/scenario storage is not authenticated database persistence. Favorites, API jobs, custom-calculator runs and billing records are separate policies, not claimed atomic here.

`src/lib/account-persistence.ts` provides the shared RPC orchestration. No count→insert or REST entitlement fallback exists. Expected owner must equal JWT `auth.uid()` inside both RPCs, so account changes between authentication and dispatch cannot redirect a capture. The guarded SQL proposal is `docs/architecture/proposals/ATOMIC-ACCOUNT-HISTORY.sql`; it intentionally aborts even when a SQL client continues after errors. Only the disposable fixture removes its guard.

## Verified disposable guarantees

Free history limit is the existing 20; Pro/Business remain unlimited. Projects/scenarios remain paid capabilities. Profile-row locking serializes every proposed writer against plan changes. A profile row-version update makes stale repeatable-read writers abort rather than count an obsolete snapshot. Exact same-owner UUID/payload replay consumes no extra quota, including after downgrade below an existing count. Conflicting payloads and foreign UUIDs fail closed. History updates and scenario snapshot mutation are denied; scenario names remain editable. Copy/insert failure rolls back the transaction.

This is retained-row idempotency, not global exactly-once delivery. Deleting a request row removes replay memory; changing a capture requires a new UUID. Concurrent cross-owner *legacy direct* inserts with the same previously absent UUID can produce native PK23505 for the loser; RPC callers receive generic rejection. No payload exposure was observed.

## Private pagination and experience

`src/lib/draft-history-pagination.ts` and `loadDraftHistoryPage` use owner-filtered `(created_at DESC, id DESC)` keyset pagination, bounded 20/50 page sizes and limit+1 continuation. DRAFT slugs are filtered before limiting. Cursor schema binds owner, source and page size; timestamps preserve PostgreSQL microseconds. Cursors are validated navigation hints, not authorization. Selected owned records outside the first page remain reopenable.

`/account/drafts`, `authenticated-draft-workspace.tsx` and `draft-calculator-preview.tsx` support separate history/scenario continuation, source+UUID deduplication, accessible loading/error status, retry focus and suppression of stale owner/plan responses. Existing captures/selections survive pagination failures. Ordering is deterministic, but concurrent deletion/insertion is not a frozen snapshot.

All 14 v1 drafts covered: **205, 206, 232, 233, 435, 441, 481, 484, 487, 498, 517, 518, 529, 531**. They remain unregistered, uncertified and unpublished; private active-reviewer authorization and public-surface exclusion are retained. Engines, versions and plan mathematical accuracy are unchanged.

## Validation

- 389 focused unit/integration/certification tests across 20 files passed.
- Disposable pinned PostgreSQL: 46 assertions in four PASS groups, actual repository 001/010/029/033 migrations with synthetic auth/platform grants. Covers mixed RPC/direct quota concurrency, paid limits, exact/conflicting retry, owner binding, malformed snapshots, rollback, stale isolation, downgrade ordering and scenario immutability.
- Browser: five pagination groups at 320px/1280px, 126 records per source across all 14 calculators, keyboard/focus/retry and stale owner/plan cases. Evidence: `/workspace/review-artifacts/atomic-history-pagination-2026-10-20/browser/` (workspace artifact, not a public link).
- Typecheck, affected lint and one local `next build --webpack` passed. Path-scoped PostgreSQL CI now runs legacy evidence and the new atomic fixture; mandatory CI remains enabled.
- Existing mathematical/parity and public exclusion regressions reused; passing checks do not confer certification. Physical Android/TalkBack remain UNVERIFIED.

## Blockers and ordered next actions

1. Database/security owner reviews definer ownership, EXECUTE grants, public-schema CREATE privileges, actual RLS/constraints, maintenance/service writers and interactions of the profile row-version update with deployed billing/profile triggers. Repository fixtures do not establish production equivalence.
2. Prepare a separately authorized migration/rollback plan after review. This proposal is not a migration and must not be deployed as-is. No production adoption or schema change is authorized here.
3. Until matching RPC adoption, **all new application history/scenario saves fail closed**, across every plan. Owned reads/reopen/pagination remain available. Deploying only the application change would therefore block saves; do not deploy independently of the reviewed contract.
4. Validate real HTTP/PostgREST transport, cookie/auth transitions and interruption recovery in an authorized non-production environment. Synthetic SQL does not prove deployed behavior. Preserve physical-device checks separately.
5. Rollback planning must retain immutable rows and request IDs, stop new writers before contract changes and never restore unsafe count→insert fallbacks. Owners must decide receipt retention/tombstones if stronger post-deletion replay guarantees are required.

No new engine, mapping, registration, certification or publication. All 836 waiver authorities, 210 source reviews, 540 mapping decisions, 12 HOLD dispositions and 38 specialist reviews remain UNKNOWN absent authentic evidence. Mortgage/BMI/SIP v2 specialist/version gates remain blocked.

Initial exact-head CI passed all five storage/evidence jobs but found one obsolete source-text regression expecting the removed inline scenario REST payload. The correction asserts owned, version-bound source copying in the RPC proposal and prohibits restoring a REST insert fallback. Three legacy snapshot-contract tests are included in the 389-test focused total; application/SQL behavior did not change. Final-head CI is rerun automatically for this demonstrated failure.
