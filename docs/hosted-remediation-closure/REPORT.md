# Parallel hosted remediation closure

Baseline PR #1508: `782ab2e01157ac60ef572af6769ab01e82cb0312`, including authenticated reconciliation `1a0b2265e9658a48227549efdac7f2d180d6b4dd` and PR1507 `cab705d4f13e17a5ec0bb3450df704c9c226e817`. Exact remote PR1508 head verified; CI #41271308422 completed SUCCESS. Isolated successor branch: `engineering/hosted-remediation-closure-20261101`. This report concerns software and nonproduction evidence, not canonical acceptance.

## Completed executable work

### Publication correction and final-row validation

Eight new pinned PostgreSQL17.6 checks reuse the unchanged exact-hash date repair. They test hostile and cosmetic predecessor drift, reapplication rejection and transaction rollback on deliberately incorrect result hash. Captured lifecycle/role gates are exercised on synthetic rows only.

A demonstrated additional defect: the captured BEFORE UPDATE trigger asks the predicate to read the old persisted row. The first invalid metadata update to an otherwise valid synthetic published row succeeds; the following sensitive update is denied. The additive **guarded, unactivated** `review-only-deferred-gate.sql` validates the final persisted row after UPDATE. It checks the exact existing lifecycle function, corrected predicate and trigger definition/enablement, and requires successor objects absent. Immediate and deferred COMMIT tests reject invalid final rows and roll back their synthetic audit; valid scheduling remains possible. Original functions and date-repair source hashes are untouched.

This proposal covers UPDATE only. Direct INSERT lifecycle handling, dependency-mutation integration, real catalog evidence, ownership/privilege review and activation remain blocked or unverified. It is not complete publication acceptance. See [publication.md](publication.md).

### Invitation, membership and privileged writers

Eleven new genuine local GoTrue/PostgREST checks characterize captured behavior beyond the previous twelve checks. Verified lock barriers demonstrate acceptance surviving concurrent invitation deletion, accepting after actual wall-clock expiry during a blocked membership write, overbooking after a concurrent privileged membership insertion, and full rollback on concurrent auth-user deletion. Other cases prove admin owner-role demotion, member identity rewrite, owner foreign-key change and service-role REST quota bypass; a cross-tenant membership move is denied.

These are persisted-state observations in a disposable scoped fixture, not approved policies or production incidents. They show why an acceptance-only lock or issuance-only RPC cannot claim a shared invariant. Existing guarded invitation successors remain unchanged and unactivated. See [invitations.md](invitations.md).

### Authenticated account and least-privilege compatibility

Nine new genuine local auth/REST checks reproduce the missing country column and anonymous TRUNCATE capability on the captured scoped baseline. Disposable application of unchanged009 plus an in-memory unguarded copy of the existing038 review draft restores the exact application country-preference read/upsert payload, owner profile/billing reads and tenant isolation. It denies anonymous TRUNCATE, account plan escalation and billing writes while preserving service-role visibility and grants. Synthetic inherited UPDATE capability forces the candidate to fail and roll back earlier revokes. Reapplication is idempotent.

The runner now has a committed sanitized four-table fixture, hash-bound to the capture. CI runs without private files; optional full-source verification checks both the full hash and exact selected rows. PostgREST schema reload after009 is observed with bounded read-only readiness before traffic resumes. Display-name UPDATE, billing SELECT disposition, legacy data and activation approval remain unresolved. See [compatibility.md](compatibility.md).

### Missing atomic admin migrations032–035

Ten new genuine local auth/REST checks reconstruct six captured admin tables with indexes, foreign keys, constraint triggers, policies and effective permissions. All five absent signatures are reproduced, then unchanged source-hashed migrations032–035 are installed only inside an explicitly unguarded disposable in-memory transaction. No new active migration or RPC is added to the repository.

The tests verify authenticated role denial, draft+15 pending QA+audit creation, reviewer decisions and target assignment behind self-row RLS, denied certification with no side effect, one-winner expected-state lifecycle updates, and complete late-audit rollback separately for all four RPCs. The expected-state race checks one winner and one audit; it does not force overlapping row-lock contention. Optional full private descriptor comparison passed before SQL. Setup batches statements without changing their ordering/dependency requirements. See [admin.md](admin.md).

## Integrated verification

- New runtime checks: **38** (publication8, invitations11, account compatibility9, admin10).
- Full unit suite: **6,603 passed, four skipped**; 832 files passed/two skipped.
- Focused capture, privilege, workflow and transport guards: **27 passed**.
- Real isolated PostgREST HTTP security regression: **eight checks passed**.
- Certification: **15 passed**; launch: **45 passed**.
- Both immutable canonical-validation source-binding guards passed.
- Full lint, typecheck and `next build --webpack` passed; final lint counts and exact receipts are in [validation.json](validation.json).

The four new acceptance commands run sequentially in one bounded CI step with sanitized committed fixtures. Existing tests, build, certification, source guards, exact-head audit and aggregate job requirements remain mandatory. No competing production build was run. UI/browser campaigns were not repeated because no application UI, calculator engine or browser workflow changed; authenticated HTTP workflows were exercised directly.

Independent review verified guards, source bindings and fixture behavior. It caught a required-private-file CI dependency; this was fixed with a sanitized hash-bound fallback and an actual no-private-input runtime campaign. It also prompted optional exact private-source comparison for admin. A root fixture setup failure exposed dependency ordering and constraint-trigger catalog distinctions; those were corrected without weakening assertions. Original reports and protected historical evidence are unchanged.

## Remaining decisions and limits

[blockers.md](blockers.md) separates software coverage limits from owner, participating-writer, legacy-data and deployment requirements. No real qualified reviewer, canonical calculator, publication or hosted production equivalence is accepted by these tests. Exact delivery SHA and the one bounded successor hosted-CI observation are reported with the draft PR; baseline success is not successor success.

Calculator IDs changed: **none**. All 540 identities, 424 acceptance records, 14 original DRAFTs, 43 authority blockers, immutable engines and historical source hashes remain intact. No production query or write was needed for this continuation. No SQL activation, active migration, billing activation, merge, deployment, certification or publication occurred. **RELEASE HOLD remains active.**
