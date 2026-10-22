# Authenticated DRAFT persistence — 20 October 2026

RELEASE HOLD. Baseline draft #1456 `24035c468f42ae55cd3a71bf37e1b634fc7c0217` and its six passing workflows were verified once. Source #1441–#1456 ancestry is retained. No engines, immutable technical versions, public registry entries, certifications, publications, migrations or production data change.

## Paths and coverage

Private `/account/drafts` → `src/components/authenticated-draft-workspace.tsx` → existing `DraftCalculatorPreview`, Final renderer and scenario/export components. Server actions are `src/app/account/drafts/actions.ts`; role checks are `src/lib/draft-account-access.ts`; version-bound decoding is `src/lib/draft-persistence-contract.ts`, reusing the existing private snapshot validator. Existing account history/scenario links point known DRAFT captures into this private workspace, with source-aware record selection and explicit reopen.

All14 master IDs: **205,206,232,233,435,441,481,484,487,498,517,518,529,531**. Fourteen owner-authorized DRAFT definitions remain unregistered, uncertified and unpublished; master540/registry574 counts are unchanged. No new engines or mathematical golden vectors are claimed.

## Existing infrastructure, not another store

History uses existing `calculation_history`; project scenarios use existing `saved_scenarios` and existing account project/copy actions. No new table, RPC, migration or privileged client is introduced. Existing generic account quota/entitlement helpers moved without behavioral change into `src/lib/account-persistence.ts` and are reused. The new client adapter binds every action to the server-rendered owner; it does not trust synthetic plan controls. Authenticated mode hides local-storage retention and the synthetic plan selector.

Every private server call verifies `auth.getUser()` without an auth error, active `platform_admins` role owner/admin/reviewer, and expected owner where supplied. Every history/scenario query includes `user_id`; database RLS remains active. Missing configuration, profile/role/data failures and invalid metadata fail closed. The page renders no workspace when authorization/data cannot be verified, is force-dynamic and noindex/nofollow, and is wrapped in the existing cross-tab/session account boundary. That boundary is a visibility/recovery guard, not authorization. No public discovery/sitemap/related/manifest enrollment occurs.

## Version, retry and ownership guarantees

- A copied, frozen capture binds canonical DRAFT slug/master ID and v1 input/output contract. Invalid/missing fields, nonfinite results, wrong identities, unsupported versions and mismatched deterministic outputs reject. Validation never upgrades or overwrites stored history. Numeric JSON signed zero follows existing protocol semantics (`-0`→`0`); decimal/integer strings retain exact text.
- Saving appends an existing history row with a stable UUID request identity. An exact own capture at that UUID reconciles before quota checks and after a concurrent23505 winner. A conflicting capture or foreign UUID fails with a generic unavailable error; reads never return foreign payloads. No upsert/update overwrites history.
- Account access and current entitlements are checked again before insertion through the fresh client. UI pending locks prevent overlapping local submissions. Failures preserve current inputs/capture and retry UUID, make no automatic retry, and do not claim success after an uncertain response. Old account/calculator/edit/plan responses cannot replace current UI state.
- History and scenario tables have independent ID namespaces: UI references use **source+UUID**, including deep links. Equal UUIDs cannot select the wrong stored source. Reopening verifies the stored v1 capture and preserves its saved output; edits create a new current calculation rather than mutating it. Scenario rename/copy retains snapshots through existing actions.
- These are application/request-scoped protections. Checks are not a transactional role/session/plan revocation fence. UUID uniqueness is not global exactly-once delivery, does not deduplicate different UUIDs, and is not a permanent tombstone after deletion. Existing owner-editable scenario storage is not made globally immutable by these application readers; no new DB constraints are claimed.

## Free quota blocker

Existing history quota enforcement is count→insert, with no shared atomic reservation. Disposable PostgreSQL reproduces two Free transactions each seeing19 and producing21 rows. Therefore **new private Free saves fail closed**, while existing owned captures and exact retries remain readable/reconcilable. Paid Pro/Business history is unlimited under existing entitlements and supports saving all14. Free calculations retain identical mathematics and existing analytical entitlements. No upgrade is represented as a numerical accuracy improvement.

The legacy generic history writer's quota behavior remains unchanged; this patch does not claim a global quota repair or prevent all direct owner-authenticated JSON writes permitted by existing RLS. Closing that gap requires an authoritative atomic quota/insert contract across all writers, separately reviewed and tested. No schema change is applied or hidden here.

## Acceptance matrix

| Area | Status | Evidence / remaining boundary |
| --- | --- | --- |
| Private reviewer authorization, owner filters, strict v1 contracts | VERIFIED offline | Real action/guard/contract tests, including all14 and stale-role/session/plan/metadata failures. |
| Paid authenticated save; all-plan owned history/scenario reopen | VERIFIED isolated | Real server-action code over synthetic clients plus native PostgreSQL owner RLS/PK behavior. No live accounts. |
| New private Free saves | BLOCKED | Reproduced non-atomic quota; fail closed, preserve input/capture and reads. |
| Retry collisions, response-loss recovery, rollback, concurrent rename/read | VERIFIED disposable |129 assertions using actual migrations001/010/029/033, pinned PostgreSQL, modeled auth.uid/platform grants, internal network/tmpfs/no host ports. Response-loss case discards a committed response; it is not a process-kill/network transport test. |
| Browser UI | VERIFIED synthetic |32 Chromium/CDP checks,28 save/reopen cases (14×320/1280),28 JSON+28 CSV downloads, owner switching, uncertain retries, keyboard/error focus and overflow. Test-only in-memory transport is not a production persistence layer. |
| Live auth, real Next server-action/PostgREST transport, production grants/schema equivalence | UNKNOWN | No production/staging authentication or DB requests. SQL and mocked boundaries do not prove end-to-end deployed behavior. |
| Physical Android/TalkBack/password managers | UNKNOWN / UNVERIFIED | Browser emulation only. |
| Certification/publication/specialist authority | NOT GRANTED | All missing authority remains UNKNOWN; HOLD gates unchanged. |

247 focused tests across14 files include108 new cases. Typecheck/affected lint and a local webpack build are recorded with the draft PR; final-head mandatory CI rebuilds final integrated source. No unchanged full local suite is repeated. Existing publication-exclusion and Slope v1 compatibility regressions remain included. The path-scoped PostgreSQL workflow now watches the new account/adapter files.

## Reviewer workflow and next batch

An already authorized active reviewer signs in through the existing account infrastructure, opens `/account/drafts`, calculates, and saves with Pro/Business. Existing account history/project-scenario links select the corresponding private record; reopen is explicit and never automatically replaces a working draft. The recent lists are capped at100 rows per source. Unsupported/corrupt records remain stored and report failure; they are not silently migrated. Do not connect local tests to production credentials.

Review source #1456 → this cumulative private persistence batch → exact-head CI → authorized non-production end-to-end auth/transport and physical accessibility review when available. Next substantial engineering: design/test a guarded atomic history quota+insert proposal across all writers and durable retry semantics, without applying migrations; extend private history pagination and server-backed scenario workspace operations as independent work. All836 waiver authorities,210 source reviews,540 mapping decisions,12 HOLD dispositions and38 specialist reviews stay UNKNOWN. Mortgage/BMI/SIPv2 and identity/scope blockers remain unchanged.
