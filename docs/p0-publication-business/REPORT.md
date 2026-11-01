# P0 publication and Business integrity closure

Candidate: PR1509 `e5c109887f2e146ea1d1ca08a595132e726aaf69`. Exact remote head and ancestry through PR1508 verified. **Baseline CI41273838660 failed** in the new account compatibility step; checks/build/source-acceptance succeeded and aggregate validation correctly failed. Work proceeded on isolated failed-CI repair branch `engineering/p0-publication-business-20261101`, without modifying application code or treating the baseline as green.

The handoff ZIP passes CRC validation and contains only a byte-identical copy of the committed Batch19 report. ZIP SHA-256: `2da4458ef26b3dcd1f2fedddf5828c3887d884bbf0a7680b5a20d6ffca756101`. It supplies no new owner policy or authority approval. [input-and-baseline.json](input-and-baseline.json) records provenance.

## Demonstrated defects and prepared corrections

1. **False schema-cache readiness:** SQL SELECT can see009's newly added country column while PostgREST's mutation parser retains old cached columns. Hosted CI then failed PGRST204 on upsert. The repair waits for that exact column in authenticated cached OpenAPI, with one total deadline/abort, immediate authorization failure, and no write retry masking. The real fixture reproduces successful SELECT plus stale OpenAPI before NOTIFY, then completes all ten account compatibility checks. Four focused readiness cases also pass.
2. **Publication INSERT:** an actual isolated owner JWT inserted published state without evidence. A guarded additive trigger requires initial draft, preserving the captured transition/role/QA path.
3. **QA reparent:** the captured deferred validator checked only the NEW parent. A guarded OLD-parent check rejects invalidation of the published OLD parent. A separate concurrent promotion/reparent failure required shared OLD/NEW parent-row fences before every QA mutation, in stable order.
4. **Reviewer authority removal and races:** deletion and privileged identity rewrite could invalidate an already published reference; check-only guards also allowed removal/demotion to race certification. Guarded authority checks and a final-row reviewer FOR SHARE lock now coordinate DELETE, active/role/user_id UPDATE and critical parent transitions. Both commit orders are verified through actual database lock observations.
5. **Stale standard-risk snapshots:** limiting isolation enforcement to YMYL allowed standard-risk certification from obsolete QA under REPEATABLE READ. Final certified/published UPDATE now requires READ COMMITTED for every risk class. Positive supported-isolation behavior remains tested.
6. **Business stale redemption/expiry/audit:** the narrow guarded acceptance successor locks the organization, re-reads and locks the same invitation identity/token, checks revocation/acceptance and wall-clock expiry after lock waits, and writes membership, acceptance and audit atomically. Duplicate redemption cannot append a second audit. READ COMMITTED is required before reads/writes. Exact captured function SHA-256 and scoped schema signatures reject incompatible predecessors.

All SQL corrections are **review-only, guarded and outside active migrations**. “Fixed” above means implemented and verified in disposable fixtures, never production activation. Original captured SQL, prior guarded proposals, engines and historical evidence remain unchanged.

## Coverage and current evidence

- Publication: **40** PostgreSQL17.6/GoTrue checks, including direct INSERT, rule metadata/risk, QA INSERT/UPDATE/DELETE/reparent, source insertion/label update/reparent/deletion, reviewer authority fields, rollback, deferred COMMIT, isolation and observed concurrency. [Mutation matrix](publication-matrix.json), [detailed report](publication-report.md).
- Business: **eight** new safeguard checks; prior writer characterization reused. Actual repository callers, SQL/trigger writers, captured policies/grants and privileged capabilities are enumerated in the [writer/concurrency matrix](business-matrix.json). [Detailed report](business-report.md).
- Repaired account compatibility: **ten** real isolated auth/REST checks; readiness helper: **four** cases, included in the 31 focused guard cases.
- Full regression: **6,603 unit tests passed, four skipped**; certification 15 and launch 45 passed; typecheck and `next build --webpack` passed; both protected source-binding revisions passed. Final lint counts, exact source/receipt/log hashes and independent review are in [validation.json](validation.json).

The final CI-equivalent commands run without private files and use committed sanitized fixtures. Existing CI requirements and exact-head aggregate checks remain intact; the new P0 step is bounded to five minutes. No repeated broad inventory/source research or browser campaign was needed: no application UI or calculator engine changed. The successor hosted CI observation is made once after commit/PR and must not be inferred successful from local tests.

Independent review identified the standard-risk isolation gap and required it to be reproduced and corrected. Review also verified that parent fences need not be added speculatively to source writes: captured source/counter logic passes the tested deletion schedules. The tested reviewer races and QA/promotion races use persistent sessions and observed database blocking, not timing-only assumptions. Simultaneous independent invalid writes are not misrepresented as a serialization proof.

## Remaining gates

Business **global** capacity remains blocked: direct issuance, membership mutation and privileged/service/provider writers do not all acquire the organization fence. Existing-owner/member upsert behavior is retained without approval. Owner references, multiple-owner/demotion policy, identity mutation authority, provider delivery, plan-change semantics and participating external writers still need decisions. The new acceptance RPC is not a global shared-writer guarantee.

Publication evidence is technical and scoped. Real source semantics, identity/risk mapping, rule-pack applicability, qualified reviewer authority, authentic hosted data compatibility and activation approval remain blocked. Privileged DDL/trigger bypass and arbitrary untested writer schedules are excluded. Multi-row deadlocks can abort a writer; rollout/retry acceptance remains required. See [blockers.md](blockers.md).

Calculator IDs changed: **none**. Preserve 540 identities, 424 acceptance records, 14 original DRAFTs, 43 authority blockers and immutable historical engines/source hashes. No production query/write, SQL activation, migration, merge, deployment, payment activation, certification or public publication occurred. **RELEASE HOLD remains active.** Exact delivered SHA and bounded CI disposition accompany the draft PR.
