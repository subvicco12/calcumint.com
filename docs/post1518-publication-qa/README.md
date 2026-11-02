# Post-PR1518 publication QA execution

Baseline: `591969f7f1f968e8bf0a45d16defb2c1b59043d6`, draft PR1518. Its exact-head CI41340596268 was freshly verified successful. Work performed2November2026 in a separate clone/branch. RELEASE HOLD remains active.

## Completed software evidence

Added33 real execution assertions, with no production implementation or formula edits:

-31 source-supported applicability requests:16 full paginated loan visualization/schedule reconciliations,14 inverse-calculation requests and1 calendar schedule request. Each exact requestID maps to an individual passing test, immutable version and source-file hashes in `applicability31-binding.json`.
- Loan charts compare actual meter values, axes, currency labels and all accessible pages with the unchanged artifact. Schedules compare every displayed cell, rounded totals and final balance. This is presentation reconciliation, not independent proof of the entire loan algorithm.
- Inverse tests use independent recurrence, annuity, exponential or normalized-NPV references. DTI principal and savings contribution are also fed forward from their actual returned rounded values with explicit propagated half-cent residual bounds. Calendar cases include month-end clamping, leap-day handling, pagination and target-date rejection. IRR verifies selected brackets rather than claiming a unique global root.
-2 regressions mount both actual graph workflows at a subnormal interval:81 raw points with only2 distinguishable x values retain their exact output, disclose chart unavailability, render the raw table and recover to a normal81-position curve. Actual export controls remain enabled for the valid raw artifact; these tests do not execute or reconcile downloaded file bytes. Synthetic account transport/plan does not prove genuine authentication, persistence or commercial entitlement acceptance.

No new exposed calculator software defect was established. Existing caller precision guards already handle the packet's historical underflow concerns; no duplicate fix was made. Absence of a receipt was not treated as proof that software is missing. Missing full-scope requirements remain tracked rather than replaced by bounded core arithmetic.

## Validation

| Check | Actual result |
|---|---|
|New focused tests|33passed|
|Full unit suite|7246passed;4existing skips;849files passed/2skipped|
|Certification guards|15passed; no certification granted|
|Lint|0errors;29existing warnings; changed files clean|
|Typecheck|PASS with4096MiB Node heap|
|Production webpack build|Exit0 with6144MiB heap; BUILD_ID/prerender/app manifests present|
|Independent agent review|Completed; rounded-output residual test gap corrected and final33tests rerun independently|
|Headless browser|BLOCKED: pinned Chromium SIGSEGV before CDP readiness; no page journey passed|
|Docker database/Next HTTP suites|Not run locally: Docker unavailable; no production connections|

Initial default-heap typecheck/build attempts exhausted Node heap. A concurrent larger typecheck was killed at the8GiB environment limit; checks were separated and typecheck passed at4096MiB. Failed attempts remain in the downloadable execution package. Build uses the unchanged `next build --webpack` command. Local Node24.22.1 differs from hosted Node22; hosted successor conclusions are reported separately and never inferred from local runs.

## First six results

|Catalog|Exact engine/version|New/reused bounded evidence|Still needed|
|---|---|---|---|
|276Slope|geometry.slope v2|Existing two-point/horizontal/vertical/precision caller tests passed; raw v1/v2 behavior unchanged|Complete coordinate/unit/envelope/product contract, useful-line/reverse/applicability decisions, exact-version competent QA|
|283Variance|statistics.variance v1|Existing population/sample/domain and precision caller tests passed|Dataset/population meaning, rounding/unit policy, complete workflow and accountable QA|
|282Standard deviation|statistics.standard-deviation v1|Same bounded dispersion/precision evidence, separate identity|Same statistical policy and exact-version decisions; variance and standard-deviation outputs must remain distinct|
|275Volume|geometry.volume v1|Existing prism dimensions/results and precision refusal passed|Full required shape/unit/envelope/rounding/reverse contract; prism core is not all-volume completion|
|251Function Plotter2D|advanced-math.function-plotter-2d v1|New collapsed-grid fallback/raw-table/export-control/recovery regression passed|Full plotting/multi-function/singularity/export/entitlement/accessibility scope and accountable QA|
|235Graphing|advanced-math.graphing v1|Same new workflow regression for its separate identity|Its distinct full graphing contract and per-criterion QA; shared engine mechanics do not merge identities|

`six-owner-reviewer-decisions.json` preserves exact existing per-ID owner choices, reviewer requests and source facts. Source-established mathematics, textbook edition distinctions and SI dimensions do not require owner reconfirmation. Owner adoption of the full mapped product contract is a separate decision. Standard mathematical review here is not represented as licensed clinical/financial approval; all43authority blockers and retained specialist requirements remain unchanged.

## QA and release boundary

The1207formal QA decisions remain PENDING. Existing sufficiency943PARTIAL/264BLOCKED/0FULL is preserved. The31 applicability findings remain APPLICABLE,273remain UNRESOLVED and0are declared NONAPPLICABLE. Newly executed bounded evidence is an overlay, not formal reviewer acceptance. No canonical mapping, certification, publication eligibility or lifecycle state was promoted. Newly publication-eligible calculators: **0**.

Next: a competent accountable reviewer uses these exact source/version/test bindings to dispose of each criterion; the owner adopts the six complete catalog/feature mappings and remaining non-source-fixed product policies. Request only the missing identity-specific proof. Run the blocked browser and isolated HTTP suites in an authorized functioning runtime; do not weaken startup/security guards. Retain unresolved applicability rather than inventing N/A or building speculative features.

Preservation checks retain unchanged catalog CSV,424ledger, publication gate and review policy hashes. All tracked production source is unchanged. No production SQL, migrations, lifecycle changes, certification, publication, merge, deployment or payment activation occurred. Original14DRAFTs, historical engines and source records were not edited.
