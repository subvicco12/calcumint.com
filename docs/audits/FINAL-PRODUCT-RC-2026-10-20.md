# Final-product integration candidate — 20 October 2026

**RELEASE HOLD.** This is engineering acceptance, not authorization to merge, migrate, deploy, certify or publish. No production mutations, live authentication/payment experiments or source PR edits were performed.

## Provenance and consolidation

Verified main: `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Candidate base: #1460, `8956ac526450ba66eed536fcf74055403164221d`. New branch: `integration/final-product-rc-20261020`.

[Exact source heads and CI snapshot](final-product-rc-2026-10-20/pr-consolidation.json) records all 20 OPEN draft PRs #1441–#1460, each successful at the single refresh. Nineteen heads are literal ancestors. #1450's two divergent commits have incorporated patch equivalents; its four changed files are blob-identical and a clean merge-tree produces the existing baseline tree. No cherry-pick, source rewrite or conflict resolution was necessary. Retain every source draft until independent integration acceptance; eventual closure is an owner action.

The baseline contains 356 commit objects beyond main, including 352 distinct nonempty patch IDs and no duplicate patch groups. The source union contains 358 objects: the two additional #1450 objects are equivalent behavior, not missing functionality. These counts are not calculator or approval counts.

## Verified engineering correction

Clearing BMI weight or height correctly removed the result but rendered an unannounced plain error. Six failing regressions (two fields × three plans) and browser screenshots reproduced the accessibility defect. Reusing `CalculatorInputError` supplies the existing accessible alert, preserves input/recovery behavior and restores the result when valid. No formula, unit, classification threshold, historical version or publication gate changed.

The new Reference Six harness renders actual `CalculatorInteractive`, registered engines and actual plan resolution. Only browser transport and Next links use synthetic adapters. It runs through the existing Basic-auth loopback-only, read-only preview server, with fixture selection explicitly allowlisted. Production credentials are not injected. This is a test harness, not a deployed private/public calculator route.

## Acceptance matrix

| Area | Status | Evidence and boundary |
| --- | --- | --- |
| Source consolidation | VERIFIED | All 20 source heads incorporated literally or equivalently; no missing unique behavior |
| Mathematical/version regression | VERIFIED | 1,236 tests in 39 files; independent goldens, all 14 DRAFT contracts, Slope history and SIP v2 candidate/projection compatibility |
| Reference Six/discovery | VERIFIED | 125 tests in 24 files; actual directory/search/sitemap/canonical gates, engine/UI parity, analytics and schedule boundaries |
| Private DRAFT experience | VERIFIED synthetic | 116 tests in five files; three browser runs, 86 grouped checks, 86 downloaded files (43 JSON/43 CSV), 287 guarded requests, no disallowed requests |
| DRAFT responsive/keyboard/recovery | VERIFIED synthetic | Chromium 154 at 320/1280; pagination/retry/account switching; physical Android/TalkBack UNVERIFIED |
| Authenticated persistence/RLS | PARTIAL | Synthetic owner-bound flows and existing disposable PostgreSQL/HTTP evidence; deployed RPCs and real auth/cookies UNKNOWN |
| Database fresh install | BLOCKED raw / VERIFIED candidate fixture | Unchanged 011 fails PG42601; explicit additive replacement fixture passes; no historical SQL rewritten |
| Production-shaped upgrade | PARTIAL | Disposable 41-file fixture passes, omitting 009 and repairing 011 only in memory; authoritative production equivalence UNKNOWN |
| Combined billing/history/scenario/API/embed/membership | VERIFIED isolated | Reuse #1460's 11 combined cases plus existing HTTP/native suites; no production atomicity claim |
| Public visibility | UNKNOWN current | Historical 209 DB-published identities are not current deployment visibility or approval evidence |
| Specialist and owner approvals | BLOCKED/UNKNOWN | Remain unchanged; passing tests do not certify or authorize publication |

Counts above describe separate, potentially overlapping test runs and must not be summed as unique tests. Raw screenshots/downloads stay in `/workspace/review-artifacts/final-product-rc-2026-10-20`; sanitized summaries are committed beside this report. The baseline tests were run on the unchanged #1460 implementation; the new error and harness receive focused/final-head validation separately.

## Reference Six disposition

| Calculator | Engineering evidence | Remaining release restriction |
| --- | --- | --- |
| Loan/EMI | Engine/renderer, modes, analytical panels, authoritative schedule, JSON/CSV parity | Financial review/publication authority not inferred |
| SIP | Registered v1 unchanged; forward/reverse and candidate v2 version regressions | v2 remains unregistered/unpublished; numerical-policy/specialist/certification decisions required |
| Compound Interest | Engine/renderer, contributions, governed periods and terminal reconciliation | Financial specialist/publication decisions remain separate |
| Mortgage | Aggregate payment/balance outputs, exclusions, validation, plan/export parity | Period rounding, final payment and reconciliation require specialist decisions; no fabricated schedule |
| BMI | Deterministic current output, new accessible invalid-input recovery | Clinical population/methodology and golden/certification gate remain blocked |
| Break-even | Deterministic units, analytical parity and validation | Existing DRAFT/publication and specialist gates unchanged |

## Calculator and approval accounting

540 catalog rows and 574 registry definitions remain unchanged. The 14 owner-authorized engines remain unregistered, uncertified, unpublished DRAFTs: **205, 206, 232, 233, 435, 441, 481, 484, 487, 498, 517, 518, 529, 531**. No new engine, canonical mapping, certification or publication is claimed. Public discovery tests include forged-manifest exclusion for all 14. Private save/reopen preserves owner/version binding and immutable snapshots; synthetic success is not deployed persistence evidence.

836 waiver authorities, 210 source reviews, 540 mapping decisions, 12 HOLD dispositions and 38 specialist reviews remain UNKNOWN unless independently supported by authentic authorized evidence. Existing evidence worksheets are requests, not approval records. Do not regenerate the reviewer ZIP or overwrite historical evidence.

## Ordered release prerequisites and owner actions

1. Review this candidate and preserve source drafts until acceptance. Obtain independent security/accessibility and affected YMYL reviews; collect real Android/TalkBack evidence separately.
2. Obtain the protected read-only production catalog/ledger/function/grant fingerprints using the existing owner query. Resolve 029 and deployed 009/011/013 discrepancies; do not infer deployed function bodies from matching names.
3. Approve an exact filename/checksum migration manifest, duplicate-prefix ordering, reserved repair version and rollback plan. See [database contract](final-product-rc-2026-10-20/database-contract.md) and [existing migration report](MIGRATION-RELEASE-CONTRACT-2026-10-20.md). No SQL application is authorized here.
4. Review billing identity/fencing, history/scenario request retention and quota, API batch/quota and embed consent dependencies together. Enforce fail-closed writers until matching RPC bodies/grants are adopted. No global exactly-once guarantee.
5. Approve Mortgage financial rules and BMI clinical scope; collect individual source/waiver/mapping/HOLD/specialist decisions bound to immutable identity/version/provenance. UNKNOWN cannot become approved from CI.
6. Only after separate authorization: staged schema adoption, staging/sandbox provider/session tests, application rollout, read-only post-rollout checks and independent publication decisions. This task performs none of these steps.

## Highest-value next engineering

Use owner-supplied protected fingerprints to replace the production-shaped fixture's UNKNOWN assumptions with an exact additive upgrade manifest and rehearsed rollback. Continue browser/assistive-technology acceptance against an authorized isolated environment; do not create more calculator features or repeat catalog research to bypass these release gates.

Final head and GitHub check outcomes are recorded by the draft PR's immutable commit/check associations. Local typecheck, affected lint, webpack build and new browser results are recorded in the final validation section after execution; the existing production build remains `next build --webpack`.

## Candidate validation

- New BMI/error combined integration: **20 passed / two files**, including six new red→green cases.
- Private reference-fixture server and existing preview security: **13 passed**; unauthenticated access, foreign origins, writes and sensitive paths denied.
- Launch readiness: **45 passed / three files**. Mathematical/version suite already includes certification/rule-pack coverage.
- Typecheck and affected ESLint: **PASS**. One local production webpack build: **PASS**. Next-generated TypeScript configuration changes are excluded from this candidate.
- Real Reference Six browser: **36/36 journeys**, **zero issues**, **32 financial download files**, 320/1280 viewports across Free/Pro/Business. Actual engine scenario rows, terminal schedules, input recovery, SIP reverse mode and account-action retry/focus are exercised. No physical Android/TalkBack, live provider or real authentication claim.

The CI workflow retains npm ci, full unit/launch/certification checks and `next build --webpack`, adding synthetic Reference Six browser acceptance using installed runner Chromium/Chrome. It does not disable or replace any security/database check. See the final commit's check runs for exact-head results and runtime; historical source CI is not substituted for them.
