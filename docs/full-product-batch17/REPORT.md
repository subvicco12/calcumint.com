# Batch 17 — three independent software tasks

Verified starting candidate: draft PR 1506, exact fetched head `36a90997d0c64f06ce6a7a86caa68ca177119eb5`; hosted CI 41236251352 completed SUCCESS. Cumulative ancestry and a clean checkout were verified. The task identities and acceptance scope come directly from the unchanged `docs/full-product-batch16/remaining-work-queue.json`, whose original bytes and SHA 256 are retained in task-closure.json. No 540-ID inventory or broad source research was repeated.

All three commissioned independent tasks are complete in their software scope:

| Exact task ID | Functionality and primary files | Verified evidence |
| --- | --- | --- |
| BUS-ISSUANCE | `tests/batch17-issuance/`: guarded atomic invitation reservation SQL, genuine concurrency/authorization tests, outside-source artifact recording and strict source/model receipt verification |10 genuine groups; synchronized last-seat and duplicate-request controls; quota 5→6 mutation failed as expected; fresh positive receipt and 10 malformed/omitted/escaping-binding regressions |
| DB-FULL-CAPTURE-TOOLING | `tests/batch17-capture/`: repeatable READ ONLY catalog export, strict compare/reconcile/observed-ledger attachment CLI, omission and compatibility checks |41 public+27 auth relations; real index, column ACL, PG 17 membership SET, schema USAGE and sequence USAGE drift detected; unsupported view rejected; unknown ledgers block equality |
| AUTH-EXPIRY-BOUNDARY | `tests/batch17-expiry/` and optional test-only configuration in `tests/gotrue-runtime/fixture.mjs`: genuine short-lifetime token persistence/replay, natural expiry/refresh recovery, cancellation/deadline transport |3 genuine groups;15-second actual issued JWTs; official 30-second PostgREST skew; rejection byexp+35 seconds;10 early configuration negatives and 7 request/cancellation tests |

## Issuance: prepared and tested, not activated

The new reservation RPC retains the existing caller's Business plan, owner/admin membership, normalized email, allowed non-owner roles, hashed token and five occupied seats (members plus live unaccepted invitations). The organization row is locked before counting. Trusted database time after the lock governs both pending-count evaluation and exactly 604800 seconds of invitation lifetime; untrusted callers cannot forge the clock or expiry to bypass quota.

Concurrent distinct last-seat requests admit one; duplicate requests retain existing rejection behavior rather than inventing idempotency. Acceptance converts a reservation to membership without freeing occupied capacity; expired/accepted invitations do not count as live pending rows. Direct authenticated insertion remains a demonstrated bypass and is explicitly outside the participating protocol. Writer inventory and unresolved existing-member/owner behavior are preserved.

Both Batch 16 and new SQL guards are proved to reject unchanged execution. Only in-memory copies run inside isolated disposable models. Nothing is installed in the active application, migration sequence or production. Authentic schema/data compatibility, every writer, policy and adoption gates remain conditional blockers.

## Full capture: complete tooling, unavailable authentic comparison

The declared PostgreSQL 17 catalog export covers 630 columns,234 indexes,435 triggers,92 functions,321 constraints,86 policies,8 sequences,9 types,20 roles and 75 observed auth migration versions in the reviewed model. It includes schema/column/sequence/effective grants, default privileges and PostgreSQL 17 membership grantor/INHERIT/SET options. Independent review caught and corrected two omissions that could hide permission drift: column-only grants and membership SET/inheritance flags.

Missing, duplicated, incompatible or unsupported metadata fails closed. Missing repository migration/effect history remains UNKNOWN, never synthesized from filenames or source execution; duplicate migration prefixes keep their exact file identities. Reconciliation can identify catalog differences while withholding complete equality. Complete structural equality still does not authenticate capture provenance or authorize adoption. No hosted connection was guessed or queried; genuine production drift remains UNKNOWN.

## Expiry: actual clock behavior, unchanged production policy

The initial expectation of rejection atexp+2 seconds failed and remains in the historical failure record. Targeted verification of the pinned official PostgREST 12.2.3 source established its 30-second allowed skew and default disabled JWT cache. The final campaign replays exact privately persisted, genuinely issued JWT bytes and observes actual rejection withinexp+35 seconds. No user JWT, server clock or production policy is forged or changed.

The integrated run took 49.596 seconds, including 43.917 seconds of measured natural waiting. Real refresh rotates tokens and restores owned access. Logout removes its session and denies refresh while immediate pre-expiry access still works; immediate access revocation is not claimed. Campaign-only SDK/raw request transport bounds headers and response bodies by remaining budget, preserving caller cancellation. Its 120-second observation/request budget is distinct from fixture readiness/cleanup and the CI step's five-minute outer timeout. Absent optional TTL configuration preserves previous fixture defaults.

## Validation and review

Final integrated validation passed:

- 6,603 unit/numerical tests;4 existing skips;45 launch and 15 certification guards.
- 2,456 combined historical/CI/schema/configuration/cancellation/receipt guards;33 focused task tests;3 installed-SDK transport checks.
- Fresh genuine issuance 10, full catalog mutation campaign, and expiry 3; source-bound integrated receipts are separate from preserved earlier records.
- Default-lifetime genuine full-model 29 and native Next account 10 regressions passed after the shared fixture change, including tenant boundaries, native login, SSR-cookie reload and sign-out.
- Lint:0 errors/28 existing warnings; typecheck and `next build --webpack` passed. Subsequent verifier-only hardening and CI ordering were checked against the unchanged genuine receipt and adversarial CLI cases; no runtime driver, SQL, app or mathematical engine changed afterward.

Independent review resolved capture ACL/membership omissions, SDK request-budget wording/transport and source-receipt omission issues. No unresolved Critical/Important finding remains. CI requires the exact three task campaigns and receipt checks, generates genuine evidence before verifier adversarial tests, stores artifacts outside source, and retains all original jobs,20-minute budgets and the strict aggregate. No competing production builds or browser/Docker network transitions occurred.

## Time, remaining work and preservation

Measured execution from 20:22:48 UTC through the 20:58:55.449844 UTC validated-evidence checkpoint was 2167.450 seconds: **0.6021 wall-clock hours**. This includes parallel coding, tests, waits and coordination, not human-equivalent or billing-grade labor. Per-lane measured lower bounds, untimed preliminary work and overlap are explicitly recorded in execution-time.json; they must not be added to parent elapsed time. Final PR/CI delivery overhead is recorded separately. The 12–20 hour queue estimate was a budget, not hours claimed as consumed.

The commissioned independent queue now has **0 remaining tasks /0 remaining hours**. The preserved conditional queue remains **14–26 engineering hours** after authentic schema/writer/owner/session-policy inputs. Unapproved 497-product canonical scope and 43 external authority decisions still prevent an honest total Final Product estimate.

All 540 identities,424 acceptance records,14 original DRAFTs,43 authority blockers, historical engines/source evidence and mathematical parity are preserved.1,101 protected files and all 23 Batch 16 historical artifacts are byte-identical. No new calculator wrappers, mathematical versions, canonical acceptance promotions, certification or publication.

See task-closure.json, validation.json, preservation.json and remaining-work-queue.json for exact source-bound dispositions. The delivered SHA/PR and one exact-head hosted CI observation are recorded in the final delivery response/Git HEAD. RELEASE HOLD remains active. No merge, deployment, production database write, payment activation, certification or publication occurred.
