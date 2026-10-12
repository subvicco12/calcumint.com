# Batch 8 — cumulative release-readiness review

Review date: 11 October 2026 IST. Current main is `caffafe639350ca0c2c2cf33ae1f099294f5af54`. This branch extends #1378's existing ancestry without recopying source changes and presents one cumulative diff against main. A new commit corrects proven required-input/engine-fallback defects; prior source drafts remain untouched.

## Concrete integration corrections

Cleared required fields in Loan/EMI, SIP, Compound Interest and Break Even still became zero although the six finance interfaces fixed in #1378 correctly rejected blanks. Worse, canonical Loan/EMI rejected a negative extra payment in loanAnalysis and then silently fell back to ordinary loanPayment, leaving a nonnull result/account output for invalid canonical input. SIP reverse mode similarly displayed/exported zero for a missing target or invalid term because its compatibility helper returns zero for invalid values.

The shared finite required-input parser now serves these four interfaces and remains backwards compatible with #1378's finance helper alias. Canonical Loan/EMI fails closed on its own engine errors; ordinary loan-payment retains its separate registered engine. SIP reverse mode validates a finite positive target and the existing certified SIP input schema before calling the unchanged helper. Invalid core/extra/reverse inputs remove derived results/analytics/schedules and disable actual save/export actions. Explicit zero remains valid where existing schemas allow it. Independent Goal Solver target errors expose an accessible error panel while preserving unrelated valid core results and baseline scenarios. There is no formula, rounding, default, entitlement or engine-contract change.

## Source review order and overlap reconciliation

| Draft | Exact source head | Representation in this review |
| --- | --- | --- |
| #1372 | a972c8f411c685486fe5a23143c9b74aa8f1418b | Legacy schedule alignment incorporated in #1376 with provenance |
| #1373 | 3785ee8c6d36463f4cf2d8182a36b73fa4c97566 | Precise accessible analysis incorporated in #1376 |
| #1374 | 0176100548e4d8a1bfd67e4afb6099bc497f9809 | Governed schedules/export incorporated in #1376 |
| #1375 | 8f27b04c547dba14414c89f7f48bd69f889531f1 | Investment projections incorporated in #1376 |
| #1376 | 540d52531a1cbcfc090911d0589585b135f2787b | Main-based consolidation/discovery integration; ancestor |
| #1377 | d38ff4f19460b16ee8052369ce1ca907db4c9374 | Publication identity/shared route readiness; ancestor |
| #1378 | 3ac5dc9a1cf9148e430c99cd188f3f4bc27a2050 | Six finance trust/input readiness; ancestor |

All seven remain open drafts at these heads. The cumulative review proposes replacing separate integration merges; it does not close, merge, approve or change any source PR. Review the represented #1376, then #1377, then #1378 changes and this final correction. Do not independently merge duplicate source changes after accepting a cumulative integration. #861 completion proposal and Mortgage #60 registry/editorial ownership remain separate and unmodified.

## Validation and limits

Five test-first failures reproduced fabricated blank-rate Loan results across three plans, invalid canonical extra-payment fallback and missing SIP reverse target zero. The final focused integration aggregate passes61tests across8files, including all16 candidate UI/registered-engine bindings across plans, six finance golden input/metric/trust regressions, full Reference Six workflows, actual CSV/JSON and save/export invalidation, canonical metadata/detail/discovery/sitemap gates, malformed publication identities and version/certification withdrawal. The ordinary LoanPayment alias remains covered by the registered-output comparison.

Inherited exact-head CI for #1376–#1378 already passed and is reused; final cumulative exact-head CI is recorded in this PR's body. One final local typecheck and affected lint are also recorded there. No local full build or full-suite repeat. Prior scoped real-Chromium responsive/keyboard/accessibility-tree evidence is reused; no claim is made of deployed-route or real screen-reader certification for this review.

## Candidate and approval separation

The inherited anonymous authority snapshot has209 exact published key/slug/version route matches, zero mismatches and exact parity with209 live directory/sitemap paths. Repository counts remain540master IDs,573engines,225code-certified/37reviewed/311draft and225structural route candidates. Sixteen certified structural candidates are absent from published authority. See `UNPUBLISHED-CANDIDATE-READINESS-MATRIX.csv` for every exact ID/version/risk, registered advanced inputs, responsible authority and required evidence. This correction additionally strengthens Loan/EMI, SIP and Compound required-input readiness; the matrix's six migrated finance candidates retain their verified trust behavior.

Specialist approvals, internal HOLD/lifecycle reasons, absent-versus-withheld inventory and unresolved master-ID approvals remain UNKNOWN: the minimal anonymous manifest exposes no reviewer evidence and the four protected SELECT-only probes were denied. The209published count does not assert209specialist sign-offs. Only authorized reviewers can evaluate protected evidence; only owner/admin can perform publication after existing gates pass. No publication transition is executed or approved here.

Loan/EMI, SIP and Compound remain publication-excluded. BMI and Break Even remain draft-gated. Mortgage remains unregistered and owned by #60; its specialist/registry/amortization blockers are not bypassed. Prior three individually verified live200/UI routes and six excluded404 probes remain scoped observations. No deployed revision or production drift cause is asserted.

Remaining release decisions: cumulative code review; finance/YMYL methodology/trust/input review; actual assistive-technology/RSC review; protected approval/lifecycle and master-ID adjudication through existing authorized owners; normal publication/deployment review. The safe next substantial batch is owner-led resolution of the16 protected review blockers and identity decisions, with engineering corrections only for demonstrated issues. No database writes, approvals/certification changes, promotion, merge, deployment, RLS/security weakening, dependency/workflow changes or build configuration changes.

# Batch 14 — cumulative Final Framework release candidate

Review date: 12 October 2026 IST. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. This new main-based review candidate uses #1383's existing ancestry, preserving all source commits and drafts without recopying or closing them. This section supersedes earlier inventory/registration statements for the current candidate; earlier sections remain historical evidence.

## New proven integration corrections

A valid SIP annual return of1000% over one month crashed when Advanced mode synchronously generated an optional1001%/1002% request, including on Free. Loan/Compound whole-array catches silently dropped valid baselines when one generated request failed. Shared per-request registered-engine evaluation now retains valid scenarios/points and explicitly lists unavailable rate identities and reasons. Formula implementations, inherited nonzero-offset clamp behavior and normal-request results are unchanged. The actual valid Compound baseline below−99% is retained instead of incorrectly applying the offset clamp to it.

Ordinary LoanPayment core/account output delegated to LoanPayment v1 while optional comparisons and fallback schedules came from LoanAnalysis. For320000 principal at zero rate over360months, LoanPayment reports0.4 aggregate interest while LoanAnalysis reports0; borrowing its period rows or baseline misrepresented the registered result. Ordinary LoanPayment now uses its exact aggregate engine for comparisons and an aggregate-only adapter with explicit unsupported-schedule disclosure. Canonical LoanAnalysis retains its own extra-payment computation and authoritative amortization checkpoints. No alternate rounded ledger is invented.

Advanced Loan, SIP and Compound history/JSON/CSV payloads preserve all core engine keys and add a version1 `rateAnalysis` sidecar: registered calculator ID/slug/version, result metric key/label, exact available scenario/point data, and unavailable request identities/reasons. It is the same analysis object shown in the panels, with no inferred currency. Existing export/history entitlements and immutable snapshot validation remain authoritative.

## Preserved source review sequence

| Draft | Exact source head | Current candidate |
| --- | --- | --- |
| #1379 | 6060f0451153be75f9af643c30968db3450b0f83 | Cumulative main integration ancestor |
| #1380 | 8b3600c8d79e83326b770dca5bfcb9a07ec07567 | Mortgage aggregate integration ancestor |
| #1381 | abe49dd24ca136bc0074b29106107b67e164e95d | Snapshot/export boundary ancestor |
| #1382 | 19aaedfa4380160e9ad7c863720c572dc8903436 | Structured presentation validation ancestor |
| #1383 | bd01640ad52ff99723f81aa7658a73bd10377304 | Bounded analytical presentation ancestor |

All remain unchanged drafts. This new cumulative main proposal is the preferred single review path; replacing separate integration merges is proposed, not executed. Do not merge duplicate source changes independently after accepting it. No source PR is closed, approved or edited.

## Integrated evidence and boundaries

104 focused tests across21files pass, including actual Reference Six core/trust across Free/Pro/Business, canonical Loan extra-payment ledger, SIP forward/reverse, Compound projections, Mortgage aggregate analysis applicability, BMI/BreakEven exclusion, ordinary Loan alias engine identity, invalid-input/account recovery, original analytical helpers, and canonical publication/discovery/version gates. Four actual registered-context download fixtures (ordinary/canonical Loan, SIP, Compound) exercise JSON/CSV on both paid plans with mocked auth/persistence and no writes. Earlier exact-head source CI is reused; the new candidate's final-head CI is recorded in its PR body.

Actual Chromium checks the three changed interactive routes at320and1280pixels, keyboard Advanced controls, upper-rate unavailable feedback, opened trust/schedule disclosures, actual account UI and no overflow/page exceptions. Only plan and Supabase auth/read query boundaries are mocked. This is not deployed-route or real screen-reader certification. One final local typecheck/affected lint is recorded in the PR; no local full build or installation.

Current reused counts:540master IDs;574registered engines;226source-code certified candidates after the Mortgage proposal;209previously verified anonymous published identity/slug/version matches. Sixteen code-certified candidates remain absent from that publication authority; their actionable owner/evidence matrix remains `UNPUBLISHED-CANDIDATE-READINESS-MATRIX.csv`. Protected specialist approval/HOLD evidence remains UNKNOWN. These numbers do not imply226specialist sign-offs or a fresh database/live audit.

Mortgage is registered in the proposed ancestry but remains absent from reused published authority; aggregate source certification is not publication approval. Period outputs remain BLOCKED on financial recurrence/rounding/final-payment/reconciliation decisions in `MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md`. BMI and BreakEven remain draft-gated. No publication/certification promotion, DB write, approval, merge, deployment, security/RLS weakening or financial formula change occurs.

Remaining release work: framework/accessibility and finance/YMYL review of this cumulative candidate, actual assistive-technology/RSC verification, and authorized owner review of protected specialist/HOLD/master-identity evidence. Specialist decisions must precede any future Mortgage period engineering or publication. Billed Codex usage is unavailable; measured automatic Actions runtime is reported in the PR.

# Batch 15 — accessible shared result data and keyboard schedules

Review date: 12 October 2026 IST. New cumulative main review uses unchanged #1384 ancestry (`a908d9c65406784f6344c6c8de9f69257f299d99`); main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Earlier source drafts remain unchanged; this proposal replaces separate integration merges only after authorized review, without closing or merging any PR.

## Proven shared accessibility corrections

The compatibility renderer exposed trend child values through a generic role=img, hiding their individual screen-reader semantics. Its separate progress scale clamped negative results to zero and omitted exact value text. Both result renderers now share a signed meter and complete semantic series-data table, with25-row chart/table paging, full-data domain, raw signs/units and exact position identities. The shared component receives only the first series already validated by the existing result inspector. Empty point arrays produce no numerical artifact. Existing first-series and declared free-visualization policies remain authoritative; no formula, currency inference or new paid chart capability is added.

Essential Free chart data is accessible in the same chart/table view (for example SIP). It is not the separate multi-column paid period schedule. Compound's existing Free composition policy continues to suppress its trend. Detailed schedule/export entitlements remain unchanged. Complete raw account JSON/CSV arrays remain unchanged by visible pages.

Legacy schedule tables now expose focusable labelled horizontal-scroll regions with visible focus outlines and explicit column/period-row header scopes. Column-alignment algorithms and declared metadata/terminal checks are unchanged. Chromium also exposed compatibility disclosure min-content expansion to2528pixels at a320pixel viewport; scoped min-width containment fixes page overflow and enables native keyboard scrolling. Compatibility headline announcements now expose an atomic polite status.

## Evidence and matrix reconciliation

112focused tests across19files pass: both renderers' zero/negative/tiny signed data, exact fractional positions, paging/recovery, malformed-data containment, complete raw JSON/CSV downloads on Pro/Business, Reference Six core/trust/plan integration, canonical/sampled schedules and unchanged publication/version gates. Static assertions now require shared growth-line wiring/value text and scoped keyboard/header semantics. DOM fixtures explicitly distinguish rowheaders from cells, primary status from pager status, and chart data from paid schedules; numerical/order/export assertions remain intact.

Actual Chromium at320and1280pixels verifies both renderer surfaces: keyboard pager, ArrowRight native schedule scrolling, visible2pixel focus outline, semantic chart meters/table in its accessibility snapshot, bounded25meters and no page overflow. Components and repository CSS are real; this synthetic boundary smoke is not a deployed route or real screen-reader certification. Existing actual Reference Six and all16 candidate interface tests run across Free/Pro/Business. No database writes occur in mocked account/download tests.

All16 original candidate matrix rows were checked against current registered IDs/slugs/versions/risk/source counts/code statuses. Matrix publication absence is explicitly historical Batch6 evidence reused12October, not refreshed. Protected specialist approval/HOLD evidence remains UNKNOWN. Later engineering scopes for Loan/SIP/Compound are reconciled in the matrix. Current574registered engines/226source-code certified candidates include proposed Mortgage registration separately from the original16cohort; the dated209published baseline must not be subtracted to infer a freshly observed17candidate cohort. Candidate completion documentation now supersedes its historical unregistered-Mortgage statements while retaining their dated context.

Final local typecheck/affected lint and exact-head mandatory CI evidence are recorded in the new draft PR. No local full build, dependency installation or additional workflow dispatch. Billing telemetry remains unavailable; measured Actions runtime is reported separately.

## Release blockers unchanged

Framework/accessibility owner review and actual assistive-technology/RSC verification remain required. Finance/YMYL and protected owner-led specialist/HOLD/master-identity review remain separate. Code evidence does not grant or waive approval. Mortgage period outputs remain BLOCKED on the existing financial specialist package decisions. BMI/BreakEven remain draft-gated. No certification/publication promotion, database write, formula/security/RLS change, approval, merge or deployment is performed.

# Batch 16 — reliable shared account actions and reviewer decision worksheets

Review date: 12 October 2026 IST. This cumulative main review follows unchanged #1385 (`9e19a94959ec2a532079e5730befd6bc2c542c1d`) with all previous source ancestry retained. Main baseline remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. No source PR is edited, closed, approved or merged.

## Proven shared operation defects corrected

Save/favorite actions previously remained enabled across authentication and database-request awaits, allowing duplicate requests and conflicting favorite state/count updates. Rejected authentication/read/action promises were uncaught, with account controls remaining blank or no recoverable feedback. Favorite/save completions could also announce/update the current interface after calculator slug or version changed.

The shared account interface now has immediate per-action exclusion, disabled/busy controls, explicit pending/success/error feedback, caught read/action failures and a keyboard-operable read retry. Retry itself is excluded while its read is pending. Failed or unavailable quota counts remain unknown rather than being silently treated as zero. Existing Free limits, paid export entitlements, database favorite-by-slug contract and RLS remain unchanged.

A session boundary keyed by calculator slug/version prevents old completions from mutating a new interface. An already requested save still uses its captured validated immutable snapshot and may complete after input/identity changes; it is not silently cancelled or relabelled as the new calculation. Mounted-state cleanup suppresses obsolete UI updates. No engine input/output, formula, version, raw snapshot/export representation or financial rule changes.

## Focused verification

84 tests across10files pass, including11 test-first lifecycle regressions; all existing immutable snapshot/raw-download tests; actual registered account/export integration; required-input recovery; Reference Six-related schedule/rate context; and unchanged publication/version gates. Deferred mocked auth/read/write requests verify duplicate exclusion, failures/retry, null quota reads, unchanged Free limits, version/slug isolation and captured old save identity. All database boundaries are mocked; no real writes or permission probes occur.

Installed Chromium at320/1280pixels on Free/Pro/Business verifies keyboard Save/Retry, pending/busy state, one mocked request despite repeated activation, read recovery, export entitlement policy, no page overflow and no page exceptions. Actual shared account/result components and repository CSS are bundled; only auth/plan/read/write boundaries are mocked. This is not deployed-route or real screen-reader certification. Local typecheck/affected lint and exact-head mandatory CI evidence are recorded in the draft PR. No full local build or installation.

## Individual reviewer evidence remains separate

The original16-row matrix now contains individual review questions, required financial/YMYL versus domain/framework/accessibility roles and explicit decision-evidence state. Registered identity/version/source/code evidence from Batch15 is reused; historical Batch6 publication absence is not refreshed. Actual protected specialist approval/HOLD/lifecycle remains UNKNOWN. An authorized reviewer must supply the real decision/source/QA record; owner/admin alone may consider publication after existing gates pass.

The Mortgage package adds a response worksheet tied to existing golden/boundary observations. Its questions do not adopt financial rules, change vector outputs or infer approval. Period recurrence, rounding, final-payment/residual and terminal/summation decisions remain unresolved and Mortgage period output remains BLOCKED. The original16 cohort is distinct from proposed Mortgage registration; dated209published evidence must not be subtracted from current574engine/226code-candidate counts to infer a fresh unpublished inventory.

Next critical work: authorized framework/accessibility review and assistive-technology/RSC verification, then owner-led protected review/HOLD/master-identity adjudication and financial specialist responses. Certification/publication/production approval remains separate. No database writes, approvals, certification or publication promotion, formula/RLS/security weakening, merge or deployment. Billed Codex telemetry is unavailable; measured automatic Actions runtime is reported in the PR.

# Batch 17 — truthful overview/reference visuals and final review packet

Review date: 12 October 2026 IST. This cumulative main candidate retains unchanged #1386 (`a4ae8b833c7f4e27f64cfba66657ddb4e6037d15`) and all earlier source commits. Main baseline remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. The consolidated reviewer packet is `FINAL-FRAMEWORK-REVIEW-PACKET.md`; exact candidate head/mandatory CI is recorded in its draft PR body. No source PR is edited, approved, closed or merged.

## Proven reconciliation corrections

Supported negative-rate Compound and SIP engine outputs can contain negative totalInterest/estimatedGain. Their adapters clamped those authoritative values to zero in overview data. The compatibility renderer also clamped negative overview/range visual values, fabricated a zero marker for a valid textual primary result, and multiplied finite range values by1.25, potentially producing Infinity.

Only the two presentation clamps are removed; certified formulas, rounding, defaults and raw account/export schemas remain unchanged. Both renderers now consume shared signed overview and declared-reference panels after existing structured-result inspection. Overview uses bounded25-row chart/table pages and a finite iterative raw-value domain, without sums, percentages, normalization or inferred currency. Range domains include the numeric actual value and declared finite bounds without multiplication or new financial thresholds. Textual results retain core/classification/trust and explicitly lack a numeric marker. Missing classification displays an em dash instead of inferring one from the reference label. Declared bounds remain exact strings.

Existing first-series/free-visualization/plan policies remain authoritative. SIP's existing growth visualization policy continues to hide overview in its actual route; its adapter data is nevertheless truthful for supported consumers. Compound's actual negative-rate overview now matches registered interest and raw exports on all plans. Paid schedule/export gates are unchanged. Browser extreme finite headline testing exposed5992pixel overflow at320pixels; scoped result-box/hero wrapping fixes containment while retaining the full unchanged value text, without ellipsis or rounding.

## Evidence

93 focused tests across14files pass: direct certified negative-rate outputs, both renderer surfaces across Free/Pro/Business, bounded51-row paging, zero/signed/tiny/extreme domains, textual-marker unavailability, absent classification, exact headline text, actual SIP/Compound JSON/CSV raw projection parity, Reference Six core/trust/analytics/schedule policy, positive adapter authority and unchanged publication/version gates. An initially unbounded oversized pre-fix DOM fixture was stopped; the reproduction and final paging case use51rows, not a performance benchmark.

Chromium at320/1280pixels across all three plans verifies both renderer surfaces, signed raw meter/value text, finite extreme range domain, keyboard overview paging, semantic data tables in its accessibility snapshot, textual-marker unavailability and no page overflow. Components/CSS are real; the synthetic visual-boundary smoke is not deployed-route or real screen-reader certification. Account download tests mock auth/persistence and perform no real DB writes.

Only SIP/Compound engineering questions in the original16 matrix change; identity/version/source/code, historical Batch6 publication evidence and protected approval/HOLD UNKNOWN remain unchanged. No registry inventory or publication reread is performed. Mortgage worksheet/vector questions remain unresolved, with period output BLOCKED. Registered574/code-candidate226 counts and dated209published evidence are distinct and do not imply new approval or current unpublished counts.

## Release prerequisites remain separate

The final packet supplies exact source review order, framework/accessibility and financial/YMYL/domain responsibilities, authorized protected evidence adjudication and nonexecuted deployment prerequisites. Actual assistive-technology/RSC validation and owner/admin release decisions remain required; code evidence cannot waive specialist/HOLD or publication ID/version gates. BMI/BreakEven remain draft-gated. No formula, certification/publication promotion, RLS/security change, database write, approval, merge or deployment. Final local typecheck/affected lint and exact-head CI/Actions runtime are reported in the PR. No local full build/install; billed telemetry remains unavailable.

# Batch 18 — registered trust metadata for lifecycle-blocked generic value interfaces

Review date: 12 October 2026 IST. This cumulative main proposal retains unchanged #1387 (`047f0e851668169c2e8ec060b606fbf1f0e01036`) and earlier provenance; main baseline remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. The existing review packet now includes that source head and this local readiness increment. No source PR is edited, closed, approved or merged.

## Proven omission and bounded engineering result

Generic TechnologyTool, HealthTool and nonmigrated EngineeringTool rendered result/methodology prose without the registered definition's source citations or exact formula text. A shared presentation-only adapter now retains caller labels/units/value/prose/warnings and appends existing registered formula descriptions/expressions, with unmodified source metadata. Missing source/formula metadata stays absent instead of being invented; existing methodology survives. Both medical cautions remain verbatim. Engineering account identity uses the actual registered version instead of a literal1. No formula, numeric coercion, input/default, output/schema, clinical rule or paid feature changes.

The exact changed cohort is51 generic interfaces:20 Technology,14 Health and17 Engineering fallbacks. Already migrated engineering paths and the six newer Technology definitions are excluded. Existing lifecycle guards prove37 code-reviewed definitions and14 Health drafts; these are not51 certified/published calculators. The four compatibility callers remain unchanged and lifecycle-blocked. This source visibility improves local engineering readiness without certification, publication or specialist approval.

## Evidence

75 focused tests across10files pass: test-first missing-source workflows; actual registered output/version/formula/source mapping for all51 changed paths; representative bandwidth/BMR/asphalt core/trust and invalid-input recovery; exact raw JSON/CSV through actual account actions on paid plans with Free export gates; zero/signed/tiny/extreme pure adapter preservation and honest absent metadata; legacy lifecycle/inventory boundaries; Reference Six integration; existing snapshots and publication/version protections. One export fixture initially used60seconds while the UI default is10; its expected input/output was corrected without changing production defaults. Account auth/persistence/download boundaries are mocked; no real database writes occur.

Chromium checks bandwidth/BMR/asphalt at320pixels (Free) and1280pixels (Business): keyboard methodology/Sources disclosures, trust in accessibility snapshots, cleared-input recovery, clinical caution and no overflow/page errors. Actual components/CSS/account UI are used; plan/auth/read boundaries are mocked. Pro export/core behavior is covered by DOM integration. This is not deployed-route or actual screen-reader certification.

Original16 candidate matrix/checklists, Mortgage worksheet/vector questions and period BLOCKED state remain unchanged. Existing registry counts and dated209anonymous publication observations are reused, not refreshed; protected specialist/HOLD/deployed evidence remains UNKNOWN. No broader registry or publication audit occurs.

## Required review remains separate

Applicable domain/clinical-YMYL and framework/accessibility owners must review sources, methodology and UI evidence; actual assistive-technology/RSC checks remain separate. Code-reviewed/draft status is not specialist approval or route readiness. The review packet retains protected owner adjudication and normal immutable-version/certification/RLS/publication/deployment prerequisites without executing them. No certification/publication promotion, database write, approval, formula/security change, merge or deployment. Final local typecheck/affected lint and exact-head mandatory CI/Actions runtime are recorded in the draft PR. No local full build/install; billed telemetry is unavailable.
