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

## Account recovery and governed search integration follow-up

Verified current main and all eleven draft PR heads #1397–#1407 once; every head remained unchanged, DRAFT and latest check rollup SUCCESS. Latest baseline is #1407 `6fdf70f9b325b80222ff4bdf10ec5302c226ef89`; main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Targeted blob comparisons retained #1398 authority validation, #1399 identity proposals, #1400 literal fixtures, #1405 identity/chronology checks, #1406 account controls and historical Slope reader. Planning-coverage assertion changes are the already-reviewed13→2 gap reduction, not lost vectors. No source PR, formula, calculator identity/version or golden fixture was changed.

### Completed independent lanes

- Account-page read recovery: explicit and rejected authentication/data reads are distinct from genuine signed-out/empty states. Unreadable profile data does not claim a Free plan or upsell; preferences do not expose editable replacement defaults on failure; failed history/favorite/project/scenario/subscription sections show recovery links while valid siblings remain usable. Dependent scenario controls stay unavailable until reads succeed. Owner filters and server action gates remain unchanged; legacy history is not recalculated, relabeled as current output or rewritten. Fourteen new server-render regressions, with original failures reproduced.
- Governed search: instance-specific labels and ARIA associations, persistent match-count/truncation announcement, semantic results and Escape recovery; no stale links after supplied items are withdrawn. Ranking and the caller-provided publication-filtered set remain authoritative.
- Reproduced cross-module discovery gap: account history/favorites emitted directory search links but the directory ignored URL search parameters. The discovery lane passes validated query text into search with navigation recovery, without redirecting to an inferred/unapproved calculator identity.

The two branches start at #1407 and touch disjoint implementation modules. A temporary local integration combines their deltas without modifying source branches or merging main. Final tested integration head is `b06b89915ea3f06fd0773d668ffa3386b6da4ff3`. The combined code includes account commit `bdcf7b3bd481cad0ba089cb982d21abcffcc86a3` and discovery commit `ae40adc7c82915cbed0c60b7f784c0f7fa13a379`; source branches are independent. Exact final PR heads and CI links are recorded in the draft PR descriptions; the new consolidated evidence lives in this ledger on the account lane. No extra documentation-only PR is required.

### Validation scope and limits

Focused checks include account read errors/recovery, #1407 persisted-history actions/readers, account identity boundaries, Slope v1/v2/HOLD, search/ranking/directory publication consistency, strict authority evidence, master proposals and certification/rule packs. Final134 tests across18files passed, including26 new cases (14account and12search/directory). Typecheck and final affected lint passed; initial full lint had0errors/28inherited warnings. The first integrated build rejected the directory default-argument signature under generated Next PageProps. Removed the default argument and updated existing direct-call tests (assertions unchanged). Generated-typecheck and17 affected component/directory/public-surface tests then passed. This validates139 unique focused cases across19files (134 initial final-scope cases plus5 existing public-surface cases);26 new cases. The corrected `NODE_USE_ENV_PROXY=1 npm run build` retry passed; build-generated Next configuration was restored. No CI was triggered for the intermediate failure. Initial17-suite/126-test validation and full lint passed before the additional reproduced URL-query fix; final results supersede that intermediate code tree in the PR descriptions. No new browser viewport audit, accessibility certification, mathematical golden record, specialist approval or live-production check is claimed. Responsive styles are retained; semantic wrappers remain compatible with the existing search grid.

### Unchanged external blockers and exact owners

| Requests / state | Required authority / next action |
|---|---|
|836 waiver authority requests UNKNOWN|Owner/admin authorized at the decision time must provide authentic check-specific decisions, rationale and authority references.|
|210 source reviews UNKNOWN|Authorized source reviewer/owner/admin must supply identity/version-specific applicability;22 shared fingerprints do not collapse210 decisions.|
|540 mapping decisions UNKNOWN;12 repository HOLD rows with protected disposition UNKNOWN|Authorized catalog owner and applicable specialist must provide immutable identity/version scope and explicit HOLD decisions; do not infer canonical mappings.|
|38 specialist requests UNKNOWN|Qualified financial/health reviewers and lifecycle authority must provide scoped, commit/version-bound evidence.|
|Mortgage/BMI BLOCKED|Existing financial period/rounding and clinical applicability/classification questions remain unresolved; no financial or medical assumptions selected.|
|Snapshot freshness UNKNOWN|Authorized evidence custodian must supply authentic observation time/current state when required. Historical209 DB-published observations are not fresh deployment proof.|

All1,636 existing decision requests remain UNKNOWN; no new authentic authority artifact was supplied. The12 HOLD requests are separately scoped requests for rows already included among540 mappings. Named reviewers remain UNKNOWN. RELEASE HOLD remains.

Next safe engineering batch: investigate only newly reproduced saved-history/scenario consumer faults or actual accessible navigation problems. Add historical version decoders only from authoritative contracts, never by applying today's engine to old snapshots. Review pinned cumulative source stack, then independent account/search deltas and integrated checks; resolve protected decisions through existing controls before separately authorized release actions.

Original Codex O ZIP unchanged:232,035 bytes, SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`. No production queries/writes, merges, deployments, publication, certification, fabricated approval, RLS/security/CI weakening, package installation or redundant manual workflows occurred. Actual final CI durations belong in the report; billed Codex cost telemetry is unavailable.

## Saved-scenario action compatibility follow-up

Verified main and all thirteen source PR heads #1397–#1409 once: all unchanged, OPEN/DRAFT, latest CI rollups SUCCESS. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Latest source heads are #1408 `8fe0091036dbba45f7e3b8b2b778c98506e812bc` and #1409 `ae40adc7c82915cbed0c60b7f784c0f7fa13a379`. This isolated branch starts at #1408 and retains #1409 via unchanged cherry-pick `878372c`; source branches remain intact. Integration is local only, with no main merge. Relevant scenario PR ownership is the inherited #1407/#1406/#1390–1392 work; no separate newer scenario-action owner was found.

### Reproduced failures and engineering correction

Three remaining actions—project creation, scenario rename and favorite save—ignored failed plan reads and could use stale paid data returned alongside an error. Favorite save also treated unavailable/invalid quota counts as spare capacity. Seven new regression cases failed before changes;27 others passed. These are action boundaries distinct from #1407 history/copy validation and #1408 read-only account rendering.

Shared internal guards now read account entitlements fail closed and validate finite, nonnegative safe-integer saved-item counts. The same guards cover favorite save, history save, project creation, scenario copy and scenario rename. Existing history/copy validation remains in place, including detached snapshots before async work. Missing successful profile rows retain the existing Free fallback; read failures never become plan decisions. Paid unlimited limits remain unchanged, and DB atomic quota/RLS controls remain authoritative.

Scenario rename continues to update only name/timestamp, filtered by authenticated owner and scenario ID; no recorded inputs, outputs, identities or technical versions change. Existing deletion/cleanup access after a downgrade is preserved without adding paid gates. Legacy Slope v1 rise/run output remains immutable and never re-evaluates through current coordinates; no historical decoder, golden vector or formula change was made.

### Validation and provenance

-12new regressions: stale paid profile/error rejection and recovery for3actions; null/negative/fractional/nonfinite favorite quotas; quota error recovery; existing Free/Pro/Business limits; owner-scoped metadata-only rename and downgrade cleanup.
-177 focused tests across16files passed: server action persistence, account section recovery, detached snapshots, scenarios/exports/re-evaluation, auth identity, Slope legacy/version/HOLD, governed discovery integration, certification and rule packs.
-Typecheck passed; full lint passed with0errors/28inherited warnings.
-Single `NODE_USE_ENV_PROXY=1 npm run build` passed; generated Next configuration restored. Mandatory `npm ci`, CI, publication/certification and security workflows are unchanged.
-Final PR head and automatic exact-head check links/status are in the draft PR description. No manual CI dispatch or repeated full suite is required locally.

All test DB calls use synthetic mocks. No production DB query/write, merge, deployment, certification, publication or approval change occurred. The original reviewer ZIP remains232,035bytes with SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`.

### Unchanged blockers and next actions

All836waiver authorities,210source reviews,540mapping decisions,12protected HOLD dispositions and38specialist reviews remain UNKNOWN. No authentic new authority artifact was supplied, so no approval count advanced. The12HOLD requests refer to rows already within540mappings. Mortgage financial-rule and BMI clinical/population/classification decisions remain specialist-blocked. Historical209 DB-published observations are not fresh deployment evidence; observation time remains UNKNOWN. Named authority assignees remain UNKNOWN.

Owners/admins authorized at decision time must authenticate waiver records; authorized source reviewers must bind source applicability per identity/version; the catalog owner and applicable specialists must resolve held mappings and immutable scopes. Qualified financial/clinical reviewers retain Mortgage/BMI decisions. Engineering checks do not replace any of those authorities.

Review the inherited cumulative stack, then this action-boundary delta and its exact-head checks. Next engineering batches should address only reproduced persisted-scenario consumer failures or authoritative historical-contract gaps. Do not add generic version migrations, new derived financial/medical rules, approval-shaped evidence or tests duplicating existing vectors. No further demonstrated history-schema defect was found in this bounded pass. **RELEASE HOLD remains.**

## Same-account entitlement recovery follow-up

Verified main and all fourteen source PR heads #1397–#1410 once: unchanged, OPEN/DRAFT and latest CI SUCCESS. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`; cumulative base #1410 is `7173ff776cec01f644397dfe1bf4ff3c1337909a`, retaining prior evidence, history, account recovery and governed discovery work. Relevant older entitlement PRs concern renderer/schedule alignment rather than this hook; no separate newer owner was found. Source PRs remain unchanged.

### Reproduced defect and compatibility decision

`useCalculatorPlan` ignored every auth event for an unchanged user ID. This retained stale paid presentation after same-account sign-in/user-update and prevented recovery from failed profile reads on those events. Seven regressions failed before implementation; the existing three tests and new initial-auth recovery test passed. Same-user TOKEN_REFRESHED intentionally has an existing no-reload contract and is preserved unchanged, not silently broadened into polling.

Same-account SIGNED_IN and USER_UPDATED now invalidate cached capabilities, fall back to Free while revalidating and read the actual profile in a microtask after the auth callback returns. Events do not supply a trusted plan themselves. Existing revision/unmount guards discard earlier same-user/prior-user responses and prevent a pending read restoring paid state after logout. No new auth provider, polling loop, realtime service, server authorization, cache store or dependency is introduced.

### Verified consumer behavior

Nine new tests cover same-account downgrade, failed read recovery to Pro/Business, overlapping-event races, logout, rejected reads/retry, initial authentication failure and actual scenario capture/export through downgrade/recovery. The scenario integration retains an exact captured mathematical payload and JSON/CSV across same-owner recovery while Free/pending capabilities expose no paid exports. Account/version changes still clear private captures through the existing AccountActionsSession key; no owner boundary was weakened. Routine token refresh continues not to reload. This is event-driven presentation freshness, not continuous billing synchronization; authoritative server plan reads and RLS remain required.

183 focused tests across16files passed: hook, scenario workspace, entitlement presentation, account identity/lifecycle/snapshot, persisted actions/readers, snapshot/scenario exports/re-evaluation, Slope v1/v2/HOLD, certification and rule packs. Typecheck passed. Full lint passed with0errors/28inherited warnings. Single `NODE_USE_ENV_PROXY=1 npm run build` passed; generated Next configuration restored. No formula, calculator identity/version, golden vector, legacy decoder or stored history change was made. New test data are synthetic and no production query/write was executed.

### Acceptance and remaining limits

All836waiver authorities,210source reviews,540mapping decisions,12protected HOLD dispositions and38specialist requests remain UNKNOWN. No new authentic authority evidence was supplied and no approval count advanced. The12HOLD disposition requests refer to rows already among540mappings. Mortgage/BMI and all existing specialist-dependent financial/clinical decisions remain blocked. Historical209DB publication observations are not fresh deployment proof; observation time remains UNKNOWN. Named authorized reviewers remain UNKNOWN.

Authorized owner/admin waiver records, identity-bound source applicability, catalog/HOLD decisions and qualified specialist evidence remain separate release prerequisites. These UI checks grant no certification or publication. No RLS/security/CI, entitlement mathematics or source requirements changed. `npm ci` and production `next build --webpack` remain unchanged.

Review the pinned source stack then this isolated hook delta. Exact final head and automatic CI links/outcomes are in the draft PR description; no manual CI dispatch is needed. Next bounded engineering work should investigate demonstrated event/consumer recovery faults, not invent historical contracts or automatic billing freshness policies. Add further event triggers only with a reproduced requirement; no new decoder is justified by this pass.

Original Codex O ZIP preserved:232,035bytes, SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`. No production writes, merges, deployments, approvals, certification or publication. **RELEASE HOLD remains.**

## Account quota and download recovery — 17 October 2026 (Asia/Calcutta)

Verified current main and all fifteen draft heads #1397–#1411 once: unchanged,OPEN/DRAFT,latest CI SUCCESS. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Latest cumulative base #1411 is `45964c2e253b1de3ed1aba03465fc964a92dd2f5`; this explicitly reuses its completed entitlement recovery rather than duplicating it. Relevant quota-title ownership search found no separate open quota PR. Source PRs remain unchanged.

### Batch1 — fresh client save quotas

CalculatorAccountActions enforced page-load counts indefinitely. With capacity freed in another tab, valid Free saves could remain blocked; newly consumed capacity and unreadable later counts were also ignored. Fourteen lifecycle and two owner-boundary tests failed before correction. A fresh, owner-filtered count now precedes Free history saves/favorite additions; invalid/unavailable counts fail closed. Account identity is checked again after the new asynchronous boundary so a prior-owner request cannot mutate after a switch. Removed unused cached counts; initial account-read validation, request exclusion, exact snapshot payloads, limits and paid unlimited behavior are preserved. Database atomic quota/RLS enforcement remains authoritative; the UI preflight is not race-proof authorization. Eighteen new regressions, including cross-tab capacity changes, corrupt counts, retry, unlimited plans and owner-switch during pending read.

### Batch2 — recoverable file exports

Calculation JSON download errors escaped the handler; CSV download errors incorrectly blamed valid result data. A failed anchor click also leaked its object URL. Eight format/plan/API failure tests and two scenario URL-cleanup tests failed before correction. Calculation JSON/CSV now report a recoverable download error, clear that error on a later successful request, and release created URLs in finally. Scenario exports share the cleanup helper and retain captured evidence for retry. Ten new regressions across Pro/Business verify URL creation/click failures, cleanup, unchanged exact output and scenario retention. These are synthetic browser-API failure tests in DOM; no real browser download/mobile-device certification or workspace artifact-transfer capability is claimed.

### Integration and verification

The independent branches start at #1411. They overlap CalculatorAccountActions and append tests to the same lifecycle suite. Implementation hunks apply cleanly; appended tests were explicitly consolidated rather than selecting one side. Temporary integration `176535e21827d6c770a83deea8d0657325b8a5b4` retains quota implementation `cc24aab290f8a54b67e5ba20c02deb4aee3cee9a` and export implementation `988c4aecfe9c064f5bee24ae556bd28bc820db89` plus both regression sets. Future authorized integration must preserve both append-only test contributions; source branches are not rewritten or merged here.

211 tests passed across16focused files, including28new cases, hook/scenario/entitlement state, account snapshots and owner recovery, persisted history, Slope v1/v2/HOLD, certification and rule packs. Typecheck passed; full lint passed with0errors/28inherited warnings. Single integrated `NODE_USE_ENV_PROXY=1 npm run build` passed; generated Next configuration restored. `npm ci`, mandatory CI and production build command remain unchanged. Final source PR SHAs and automatic exact-head results are recorded in their descriptions without pushing the temporary integration candidate or dispatching redundant workflows. Codex billed usage is unavailable; observed Actions runtime is reported as runtime only.

No formula, golden vector, calculator identity/version, historical decoder, stored snapshot or source/trust metadata change occurred. Client mutation and export tests use synthetic data/mocks; no production DB calls or writes. No public sharing, merge, deployment, certification or publication. Original reviewer ZIP unchanged:232,035bytes,SHA-256 `eb91318776461ab0c8be27f5b75d21f0290c45b1c24ef2e49fdc66cbfaa08950`.

### Unchanged blockers and next actions

All836waiver authorities,210source reviews,540mapping decisions,12HOLD dispositions and38specialist requests remain UNKNOWN; no authentic authority artifact was supplied. The12HOLD requests refer to rows already within540mappings. Qualified Mortgage financial/rounding and BMI clinical/population decisions remain blocked. Snapshot freshness and named reviewer assignments remain UNKNOWN. Existing209DB-published observations are historical, not fresh release/deployment authorization.

Authorized owner/admin waiver records, identity/version-bound source applicability, catalog/HOLD decisions and applicable financial/health specialist evidence remain external release prerequisites. Passing UI/engineering checks do not satisfy them. Slope v1 recorded rise/run values remain immutable; scenario re-evaluation eligibility and publication gates remain unchanged.

Next safe batch: bounded real-browser keyboard/mobile download and multi-tab recovery verification when available, acting only on reproduced platform failures. Retain atomic DB protections and authoritative historical decoders; do not add speculative versions or billing triggers. **RELEASE HOLD remains.**
