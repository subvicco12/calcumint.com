# Parallel calculator factory — execution wave 1

RELEASE HOLD ACTIVE. Existing cumulative draft PR #1538; preserved baseline `9ad7e75641322696f75a018e53513c8158c39870` passed CI `43151522026`. No production operations, certification or publication occurred.

## Actual product changes

Six isolated delegated lanes executed: mathematical contracts, conversions, physics, shared delivery, source admission, and cohort/account acceptance. The root integrated their commits in one worktree and ran one production build at a time. There were no cherry-pick conflicts. Peak simultaneous workers and worker-hours were not instrumented; six participating lanes must not be presented as a measured utilization or worker-day rate.

The factory now has **27 explicit bounded contracts**:

- Mathematics: **208, 209, 210, 211, 212, 215, 216, 218, 219, 220**.
- Conversions: **423, 424, 425, 427, 428, 430, 431, 432, 433, 434, 438, 440**.
- Physics: **322, 323, 324, 325, 327**.

Original generated packets remain immutable; the current numerical-boundary successor is separate. The machine-readable [contracts](contracts-normal-output-v2.json) and [evidence](evidence-normal-output-v2.json) execute actual engines rather than duplicate formulas. [Remaining work](remaining-work.json) references the existing 540-row ledger by hash; no new catalog inventory was generated.

The private `/admin/calculator-factory` page checks actual session identity, active platform-review authority and current account entitlements before rendering. It connects the shared Final result renderer, exact raw input, numerical refusal, A/B/C local comparisons, bounded row recovery, JSON/CSV export text and source/version-pinned replay. Registered contracts use the existing authenticated atomic history server action with expected-owner checking. Local plan props are not server authorization.

The new `/api/v1/calculator-factory/calculate` composes existing governed Business authorization/quota enforcement and the actual publication manifest reader with exact registered engine/slug/version checks. It creates no approval or lifecycle transition. Experimental profiles are refused. Request parsing retains the 8 KiB limit and rejects serialized identity digits that ordinary JSON parsing would erase.

Three physics contracts retain their original v1 engine objects. #323/#324 have **distinct, unregistered private scaled-arithmetic identities**, numeric private version 1 and explicit revision/lineage; they do not impersonate historical v1 engines. Their save/API adoption remains blocked. Existing formula constants and historical engines were not changed. Full mathematical-domain and physical-applicability acceptance remain unproven.

## Defects found and corrected

- Added missing physics input controls; the previous descriptor had no usable fields.
- Separated private arithmetic identity and revision from historical registered identities.
- Made malformed conversion `safeParse` refuse input without throwing from its refinement.
- Preserved percentage and target-unit presentation, including case-sensitive frequency symbols through the existing presentation helper.
- Rejected fractional identity/version digits lost by ordinary JSON parsing before publication lookup.
- Wrapped long review tokens and scenario output after a real 375 px browser overflow failure.
- Refused mathematically nonzero results lost to zero and subnormal outputs in new math captures. Five literal probes reproduced the defect; independent historical replay checks preserve the original registered v1 snapshots. This is a pinned capture revision, not a historical formula rewrite.
- Added the missing policy-module declaration after final typecheck detected it.
- Replaced a stale 67-case source-consumer count with the original cases plus every independently pinned factory path and its authority case. The mandatory consumer now genuinely runs its expanded 91-case suite.

## Evidence and limits

[Account receipt](account-receipt.json): **22 identities × Free/Pro/Business = 66 genuine isolated GoTrue/PostgREST/PostgreSQL observations**. The actual history/scenario RPCs cover retries/conflicts, foreign-owner RLS denial, paid persistence, Free scenario denial and identical mathematics. Independent source/producer-hash verification passed. This is direct RPC acceptance, not an authenticated browser/server-action journey or production-equivalence claim.

[Browser receipt](browser-receipt.json): **16 checks and 95 imported-source hashes**, covering actual portal/renderer/workbench behavior, recovery, frequency symbols, five physics controls, private save omission and mobile scenario layout. The owner and save transport are synthetic; this is not genuine authentication evidence. The earlier failed mobile receipt is retained in the external evidence archive.

Source admission preserves historical captures and binds each finite source stage to actual Git predecessor/successor objects, raw commit ancestry, source blobs, current tree equality and independently pinned authority. **100 source guards and all 6 actual source-consumer tests passed**. Historical capture sets, mathematical engine bytes and the original assertions/budgets remain protected. Independent AI code review found no remaining important defect; it supplies no competent-review signature or certification.

The first concurrent full run had **7 failures and one worker-RPC timeout**, retained without claiming qualification. It exposed the stale case-count contract and resource-sensitive 5/45-second checks. A controlled prior-runtime full run passed 9,349 tests with four existing skips. The final capture-successor run uses one outer worker, with every test/assertion and timeout unchanged. The final run passed **9,357 tests**, with four existing skips, in 1,080.27 seconds. Final lint (zero errors), typecheck and `next build --webpack` passed. Exact final results are in [validation.json](validation.json); the eventual exact-head hosted receipt is supplied separately, avoiding a self-referential commit.

## Counts and next critical path

**New confirmed full engineering completions: 0. Existing confirmed scoped overlay: 20. New canonical acceptances, certifications and publication eligibility: 0.** Passing factory adapters do not discharge individual full contracts.

Canonical disposition remains **0 complete/certified + 2 review-pending + 495 partial + 43 identity/scope-blocked = 540**. The existing 20 technology completions (#368–387, #383 at v2) are a separate scoped overlay. All 424 acceptance records, 14 original DRAFTs, historical engines and 43 blockers remain protected.

Shared implementation/evidence still needed includes applicable genuine team/workspace delivery, native PDF/download completion, persisted scenario comparison UI and recovery, genuine new-API authorization/quota/revocation acceptance, and applicable embed/server-batch/webhook delivery. Charts, goal solving, additional modes, source applicability and full canonical scope require individual determinations; no blanket N/A was invented. New numerical tests and bounded arithmetic do not replace those decisions.

#440 remains dependent on actual authorized competent reviewer appointment and exact-version decisions; no fresh appointment investigation was performed. The six held publication RPCs remain unactivated. Real writer/DDL-freeze, backup/restoration, credential-custody, deployment and release attestations remain external. See the [unsigned reviewer queue](review-queue.json), [blockers](blockers.md) and the retained operator/reviewer packets they reference.

No full-catalog completion date can be inferred from this wave: it produced zero newly confirmed full engineering completions and did not measure worker-hours. Measured automated-check runtimes support validation scheduling, not a four-day product promise. First publication requires competent decisions, accountable operational qualification and separately authorized adoption/release. Engineering can continue independently through the bounded shared gaps above.
