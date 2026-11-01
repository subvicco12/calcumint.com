# First six calculator publication closure

**Success measure: 0 of 6 demonstrated to meet every publication prerequisite.** No canonical acceptance, certification or publication was granted or inferred. RELEASE HOLD remains active.

Baseline PR #1515 was fetched and verified at `32c844b09ecc8c13d75968ef0aaa0b5211116786`, with parent `5450378577fd8a5919e439a0d02044ac11dbfcd6`. Exact-head CI #41318109963 completed successfully. Work proceeds on the isolated `engineering/six-publication-closure-20261101` branch. The resulting delivery SHA is recorded by Git and the draft successor PR, avoiding a self-referential report hash.

## Substantive software corrections

Four actual-component failures were reproduced before implementation. Binary64 underflow allowed misleading zero results to reach the result renderer and account capture: positive rectangular-prism dimensions (`1e-200` each), distinct statistical values (`1e-200, 2e-200`), and nonhorizontal coordinates (`x2=1e100, y2=1e-300`, origin first point). The caller now refuses these new result/capture attempts with an accessible numeric-precision explanation. Valid input recovery restores normal results. Constant datasets and horizontal slopes retain genuine zero results.

This is a bounded caller safeguard, not an engine repair or full-domain proof. Exact historical engine definitions, versions and original outputs remain byte-identical. Previously recorded underflow artifacts still receive their original exact forward-engine replay; no saved history is rewritten. Nonzero rounding errors, input text that already rounded before engine evaluation, and other unproved domain behavior remain outside this correction.

Seven focused UI tests pass (four underflow refusals plus genuine-zero cases). Eight Chromium journeys exercise the four denials at 360/1440 pixels, all four actual save/export controls disabled, recovery and no persistence writes. Twelve separate actual-source browser journeys verify all six calculators' valid workflows, scenario capture/export/recovery, labels, keyboard and responsive behavior. Browser transport is synthetic and headless widths are emulated: no genuine authenticated production persistence, physical-device or empirical screen-reader acceptance is asserted.

## Exact proposed review targets and eligibility

| ID | Engine | Version | Eligibility | Exact remaining scope decision |
|---|---|---|---|---|
|276|geometry.slope|2|BLOCKED|Approve coordinate-point canonical scope/category and version mapping; retain historical rise/run v1.|
|283|statistics.variance|1|BLOCKED|Approve unweighted population/sample dataset, units, precision and output requirements.|
|282|statistics.standard-deviation|1|BLOCKED|Approve dataset, units, precision, denominator/sample-size policy and analysis scope.|
|275|geometry.volume|1|BLOCKED|Decide whether rectangular prism alone satisfies Volume; additional solids/unit controls/reverse targets are unspecified.|
|251|advanced-math.function-plotter-2d|1|BLOCKED|Define the canonical distinction from Graphing and required controls/outputs.|
|235|advanced-math.graphing|1|BLOCKED|Approve restricted expression parser, 81-position sampling and exact Graphing feature boundary.|

The original Blueprint is reconciled by exact references retained in prior packets and the current QA submission. It supplies common architecture and reconciliation requirements, not a complete per-ID mathematical feature list. Optional schedule, reverse and sensitivity fields are not invented as mandatory features or silently waived. Exact per-ID applicability/nonapplicability decisions remain pending. Candidate URLs, native engine/version bindings, numerical evidence, competence requests and all original canonical requirements are in `qa-evidence-six.json`.

## Version-specific QA and sources

`numerical.json` contains 48 additional actual-engine numerical/rejection observations across all six, with independent expected values, sample/population and finite-domain boundaries, exact snapshot/scenario replay, immutable version refusal and tamper rejection. The four legacy precision-loss witnesses explicitly separate preserved historical replay from refusal of new caller capture. Existing Free/Pro/Business artifact-parity checks and Slope v1 compatibility tests are reused and rerun where relevant. No test count is represented as canonical acceptance.

`qa-evidence-six.json` binds current source bytes and versions to **90 pending QA requests**. Software observations are evidence submissions only; every request retains `status: pending`, null reviewer and null decision evidence. Complete decisions on formula, sources, methodology, canonical optional-feature applicability, real persistence, performance, SEO/lifecycle and assistive-technology acceptance are still absent. No passes, waivers, approvals or reviewer identities were generated.

The separate Work decision package described by the owner as containing nine references was not located in repository files, attached files or connected Pages searches. Its nine identities/bytes were not recreated or inferred. This remains a precise missing-input blocker; the prior 90 requests and six packets were reused.

Four already-cited official OpenStax pages were retrieved, without broad new research. `sources.json` records publisher/title/publication metadata, requested/returned URLs, retrieval identifiers, extraction hashes and original-byte limitations. Slope and dispersion pages expose old-edition identity with second-edition citation metadata: governing revision remains unresolved. Original publisher HTTP bytes and an approved governing revision are not claimed from provider-extracted Markdown. Mathematical explanatory references do not authenticate parser syntax, sample count, numeric caps, canonical product scope, source approval or content-use permission. Full retrieval receipts remain outside the repository; no textbook republication is included.

Competence requests are explicit per ID: coordinate geometry/IEEE-754/versioning; solid geometry/dimensional analysis/precision; descriptive statistics/denominators/stability/units; or real-function parsing/sampling/discontinuities/accessible plotting. No named reviewer or competence evidence is available. These are proposed review expertise requirements, not invented specialist approvals or a claim that standard risk automatically requires an assigned YMYL reviewer.

## Lifecycle, preservation and remaining work

The six version-bound draft-preparation templates and prior negative-only PostgreSQL 17.6/GoTrue/PostgREST preflight are reused by exact hash. The fixture had six drafts, 90 pending checks, no source approvals/reviewers/decisions and six refusing gates. UUID-only hosted gate version matching remains an orchestration condition. Guarded publication corrections remain inactive. Earlier hosted absence observations retain their timestamps; no new production state or positive eligibility is inferred.

All 540 identities, 424 acceptance records, 14 original private DRAFTs, 43 authority blockers, 194 protected source hashes and immutable historical engines remain preserved. The 540-row register is unchanged; there is no acceptance promotion.

Next actions: supply the exact Work package; resolve the six scope choices; settle publisher revisions/applicability; provide competent review and QA decisions; complete genuine account/persistence, assistive-device and production-route evidence where required; satisfy guarded adoption and separate release authorization. Their externally controlled duration prevents a defensible all-six or all-540 publication date. No production SQL, lifecycle writes, certification promotion, merge, deployment or publication occurred.
