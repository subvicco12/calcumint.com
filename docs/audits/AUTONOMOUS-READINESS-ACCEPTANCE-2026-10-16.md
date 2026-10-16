# Autonomous engineering — consolidated release acceptance

16 October 2026, Asia/Calcutta. **RELEASE HOLD.** Engineering checks do not grant certification, specialist approval, publication or deployment.

## Pinned baseline (one GitHub verification)

Main: `caffafe639350ca0c2c2cf33ae1f099294f5af54`. All following source PRs were OPEN, DRAFT, and latest check rollups SUCCESS. Their branches remain unchanged.

| PR | Verified head |
|---|---|
| #1397 | d9913f66428c66a1d408c7d60b50f7d2e39238b9 |
| #1398 | 08673b0338805e43e5419ff62a91b4b221c4475e |
| #1399 | f71306e39c6182c057796b1de613edddb1980988 |
| #1400 | f85c064e9aeb6aab0a5f50493688fbb37a1afbfc |
| #1401 | 030b1e81d0799fdad4b45a7081e670e1d1c2b1f6 |
| #1402 | 4b5f00e578ce03f055b54894de8b867a71b7b4e9 |
| #1403 | 769be5b9190f0af3db1e10d6355d2ae89a7010b2 |
| #1404 | d68a1449a84db9788ddc84babfba0ef956fffa37 |

Two independent branches start from #1404; changed implementation files do not overlap. No source PR is modified. Relevant open ownership remains the inherited evidence and framework PRs; no newer separate owner was found for these deltas. Review deltas against #1404 to avoid re-reviewing the cumulative stack.

## Completed engineering

| Lane | Proven defect and correction | Focused evidence |
|---|---|---|
| `harden/evidence-identity-provenance` | Slug fallback or key lookup could label a different candidate key/slug/immutable version as matched because only the DB-to-global-registry tuple was checked. Require both candidate and registry tuple agreement; keep conflicts visible. Reject observations dated after receipt while preserving null/UNKNOWN timestamps. | Four new cases; pre-fix failures observed. Evidence/authority/export 27 tests passed. |
| `fix/account-workspace-recovery` | Optional account loading/failure returned before rendering local scenarios; retries also unmounted captures. Keep the workspace mounted through loading/error/retry/recovery, with guarded account actions separate. | Five new cases across Free/Pro/Business and Pro/Business JSON/CSV retention; pre-fix cross-plan failures observed. Four account/scenario suites, 62 tests passed. |

Invalid current outputs cannot replace valid captures; existing captures remain exportable under unchanged plan entitlements. Authentication/quota failure continues to hide account writes; owner/version resets remain enforced. Existing alerts, pending status and retry control are retained. No new browser/viewport audit or specialist acceptance is claimed.

## Cross-PR compatibility and verification

Temporary local branch `verify/autonomous-readiness-integration` combines the two isolated deltas without conflicts at `83536348ff4cb70b5c85f3cc9d3fd38981d91cd9`. No merge to main or source branch occurred. The tested code tree contains only four changed source/test files over #1404. This ledger is an additional documentation-only change on the evidence branch.

- 183 tests passed across 15 focused files: sanitized import/authority/export, account lifecycle/auth identity/snapshot, scenario workspace/Reference Six integration, snapshot/CSV, launch portfolio/readiness/hardening, certification and rule packs.
- `npm run typecheck`: passed.
- `npm run lint`: passed, 0 errors / 28 inherited warnings.
- `NODE_USE_ENV_PROXY=1 npm run build`: passed (single local run; generated Next configuration changes restored). Production script remains `next build --webpack`; `npm ci` and mandatory workflows are unchanged.
- Final branch SHAs and automatic exact-head CI links/status are reported in their draft PR descriptions; no manual workflow dispatch is required.

## Acceptance counts: facts versus missing authority

| Evidence | Verified engineering/observed state | Authority state |
|---|---|---|
| Master catalog | 540 rows; classifications 245 missing linkage / 174 ambiguous / 121 approval pending | All 540 mapping decision requests remain UNKNOWN; no canonical approvals inferred |
| Registry / golden metadata | Reused 574 definitions / 572 explicit records; no fixture, formula, identity or version edits | Passing arithmetic is not certification; Mortgage and BMI explicit gaps remain specialist-blocked |
| Sanitized DB snapshot | 209 published standard-risk v1 identities, 209 registry matches, 0 registry conflicts; candidate observations on 140 master rows | Historical observation only; observation time UNKNOWN; not 140 approved mappings |
| QA | 3,135 rows: 2,299 passed / 836 waived | 836 waiver authority requests remain UNKNOWN |
| Sources | 210 records / 209 identities / 22 fingerprints | 210 source reviews remain UNKNOWN |
| Reviewer HOLD queue | 12 repository HOLD rows, included within 540 mappings | All 12 protected disposition requests UNKNOWN; no clearance |
| Specialist routing | Existing 38 requests: 23 financial / 15 health | All 38 review decisions remain UNKNOWN |

Combined tests revalidated the actual imported snapshot; unchanged counts are evidence, not approval progress. No new authentic authority artifact was supplied. The prior 1,636 UNKNOWN request total remains unchanged (12 HOLD requests are separately scoped requests for rows already among the 540 mappings).

The original Codex O ZIP was neither regenerated nor edited: 232,035 bytes, SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`. No raw private reviewer material is committed.

## Prioritized blockers, owners and next actions

| Priority | Blocker / owner role (named assignee UNKNOWN) | Exact next action |
|---|---|---|
| P0 | Waiver authority; owner/admin authorized at decision time | Supply authentic check-scoped decisions, rationale and role-at-decision records; validate through existing strict supplement importer without treating hashes as authentication. |
| P0 | Source applicability; authorized source reviewer/owner/admin | Supply authentic review artifacts for 210 identity-bound records; reuse collection of 22 source originals but never collapse applicability decisions. |
| P0 | Identity scope and 12 HOLDs; authorized catalog owner and applicable specialist | Resolve immutable identity/version scopes through protected decisions; preserve historical Slope and other held aliases. |
| P0 | Mortgage; qualified financial specialist and lifecycle authority | Decide aggregate versus period rounding, final payment/residuals, terminal reconciliation, numeric boundaries, exclusions and accepted version/commit-bound vectors. Existing package remains authoritative questions, not financial approval. |
| P0 | BMI; qualified health specialist and lifecycle authority | Decide population/applicability, classification using raw versus displayed rounded BMI, threshold/tie vectors, exclusions and trust text. No clinical rule invented. |
| P1 | Snapshot freshness; authorized evidence custodian | Provide authenticated read-only observation timestamp and current protected status if live launch evidence is required; do not interpret null as fresh. |
| P1 | Remaining specialist/source methodology decisions | Review the existing 38-request cohort with exact engine/dependency/source binding. No blanket owner approval substitutes for specialist evidence. |

## Review and next engineering order

Review pinned inherited stack, then independent evidence identity/chronology and account recovery deltas (either order; disjoint files), then this combined verification evidence. Before any release, complete authorized identity/HOLD, specialist, certification and publication decisions through existing controls, followed by separately authorized deployment validation. No release action is authorized by this ledger.

Next safe engineering batches: investigate actual source and persisted-history schema-drift/recovery defects with bounded repros; extend exact identity/version conflict tests only for newly demonstrated adapter/export defects. Reuse existing goldens and owner packets. Mortgage period implementation and BMI classification changes stay blocked. Avoid creating more approval-shaped artifacts or re-running catalog-wide audits in place of authority evidence.

No production DB calls/writes, approvals, merges, deployments, publication promotions, certification, RLS/security/CI weakening or subscription mathematical changes occurred. Two automatic PR validations are expected (one per independent branch); no performance-only runs. Codex billed-token/cost telemetry unavailable; actual CI run durations belong in the final report, not estimates.

## History compatibility follow-up — 16 October 2026

Verified main and #1397–#1406 heads once: all ten drafts remain unchanged, OPEN/DRAFT, latest rollups SUCCESS. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Additional pinned heads: #1405 `14a8decabb6c1039184d7ffb5038862614ed60f3`; #1406 `e1c19ffc10b808a8099aa0fa879122a924be4de7`. This branch starts at #1405 and cherry-picks #1406 unchanged as `b0086cc` before the new history delta; original branches remain intact. The earlier acceptance sections above remain historical evidence, not an assertion that this follow-up is disjoint from the prior framework branch.

### Reproduced defects and correction

The server `saveProjectScenario` action copied raw persisted JSON and ignored project/history query errors, bypassing the isolated Slope historical reader. `saveCalculationHistory` copied mutable caller data after authentication and accepted malformed/nonfinite snapshots; Free quota errors or null counts fell through as zero. Authentication errors with a returned user were also ignored. The new action suite reproduced 17 failures / 5 passes before implementation; no production queries were executed.

A shared read-only persisted snapshot boundary now validates required fields, immutable numeric version, finite detached JSON, and recognized Slope shapes. History saves capture before their first await. Scenario copies read only owner-filtered history/project rows, reject read errors, then copy validated immutable recorded input/output. No current engine is executed and stored records are never updated or repaired. Profile/quota read failures remain failures rather than defaults; successful later calls recover normally. RLS and the existing atomic DB quota controls remain unchanged.

### Compatibility decisions (engineering, not identity approval)

- Slope v1: keep `rise`/`run` and recorded `{result}` exactly, including finite outputs that differ from today's computation. No derived coordinates, version upgrade, ratio recalculation or alias promotion.
- Slope v2: keep coordinate fields and full stored output under the existing strict versioned reader. Reject cross-version shapes and unknown Slope versions because no authoritative decoder exists. Invalid original records remain untouched; rejection only prevents another invalid save/copy.
- Other calculators: preserve finite complete JSON at recorded positive safe-integer versions, even when the definition is retired or the current registry differs. Do not invent historical schemas or claim mathematical reconciliation merely from shape validation.
- Source metadata and creation/id fields remain on their original DB rows; the snapshot contains only the established calculator identity and input/output contract. No schema migration or history rewrite.
- Free retains history quota and no paid saved scenarios. Pro/Business retain scenario capability; identical recorded numeric values are preserved across all plans.
- Existing Slope registry/HOLD, draft status, re-evaluation ineligibility, Mortgage/BMI and other protected decisions are unchanged.

### Verified checks and remaining work

- 159 focused tests across 16 files passed: new persisted reader/action suites, existing snapshot/persistence/scenario tests, Slope version/legacy/HOLD suites, account lifecycle/owner/snapshot suites, certification and rule packs. 29 new regressions; existing golden vectors unchanged.
- Typecheck passed; full lint passed with 0 errors / 28 inherited warnings.
- `NODE_USE_ENV_PROXY=1 npm run build` passed (single local build; generated Next configuration restored); production command remains `next build --webpack`.
- Automatic exact-head CI and final SHA are recorded in the draft PR description without changing code to embed its own SHA.

All DB interactions in action tests use synthetic in-memory mocks; no real DB calls or writes occurred. Existing code-certified, DB-published, specialist-approved and deployed states remain distinct. The prior 209 historical DB observations, 836 waiver authorities, 210 source reviews, 540 mapping decisions, 12 HOLD dispositions and 38 specialist requests are unchanged. All corresponding decision requests remain UNKNOWN; RELEASE HOLD remains. The Codex O ZIP remains unchanged, SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`.

Next actions: authenticated owner evidence for held identities and waiver/source decisions; qualified financial/clinical decisions for Mortgage/BMI; additional historical schemas only when authoritative version contracts are supplied. Engineering follow-up should target demonstrated consumers/read failures rather than guessing historical output semantics. Named authority assignees remain UNKNOWN. No merges, deployment, publication, certification, production writes or governance weakening occurred.
