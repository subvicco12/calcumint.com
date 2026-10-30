# Exact-head timeout recovery and16-case engineering admission

RELEASE HOLD. This change repairs the documented CI time-budget failure and makes the supplied source/admission evidence reproducible. It implements no calculator contract, adopts no owner policy and clears no authority or applicability blocker.

## Exact-head CI diagnosis

PR1493 remains at `9edc90078d6b356c5c2e5702daa4da68974a062d`. Run41076164193 attempt1 and the single authorized rerun attempt2 both completed CANCELLED. In each case GitHub's failure annotation explicitly says: `The job has exceeded the maximum execution time of 20m0s`. Production build was the cancelled step. No manual cancellation, concurrency supersession or infrastructure failure is established by the inspected evidence.

| Attempt | validate job | Job started | Build started | Build cancelled |
|---|---|---|---|---|
|1|124132802924|14:56:56Z|15:15:36Z|15:16:59Z|
|2|124149002723|15:26:51Z|15:45:39Z|15:47:04Z|

The preceding checks consumed18m40s/18m48s of a shared20-minute job budget before build began. Their passing outcomes do not establish full workflow success. The old exact-head gate remains cancelled; this branch does not relabel it green or request another old-head rerun.

## Related CI repair, with all checks retained

The existing QA steps move unchanged to `checks`, with their existing20-minute timeout. The identical Production build command/environment moves to a fresh `build` job with identical checkout/Node22/install setup and its own20-minute timeout. Checks and build can run in parallel. No assertion, source restriction, security suite, browser journey, unit/certification check or build/typecheck is removed or made optional. Triggers, concurrency, workflow permissions and pinned actions/fixtures remain unchanged.

The existing required job identity `validate` is retained as a final fail-closed aggregate, `needs: [checks, build]`, with `if: always()`. It succeeds only if both results equal `success`. Failure,cancellation,skip,timeout,empty or unknown outcomes fail. The aggregate has a bounded2-minute budget. `ci-at-9edc900.yml` preserves the exact old workflow bytes for reproducible step comparison.

This changes the candidate SHA and needs its own hosted CI result. It is a directly related execution-budget repair, not proof that the cancelled9edc900 gate succeeded. No merges or production actions are performed.

## Supplied source verification

`input/source-resolution-16.zip` SHA256: `d49d5a60737546dc8208ff5d1cbfb68740b3e153da3ca56501a7966f290fc1c3`. ZIP CRC and all53 member hashes pass. The nested original43-case ZIP CRC and36 member hashes also pass.

Exact16 identities/titles match the prior43-case register. Research dispositions are11 SOURCE_RESOLVED_BOUNDED and5 SOURCE_PARTIAL, not whole-product authority acceptance. All13 UK capture-index hashes and4 IRA normalized-markdown hashes verify. Of48 source-capture records,15 same-path supplied files verify by hash/byte length and33 omitted captures cannot be independently verified from this archive. Their recorded hashes are not silently treated as checked. Extraction/structured-response hashes are not publisher original-byte hashes.

Candidate #485 component/native-binding files match their exact Gitblob SHA and SHA256 and current preserved bytes. The13 policy and13 qualified cohorts match the prior register unchanged; original retained qualified requirements remain preserved in the supplied package. No source-research script or publisher formula was executed as application code. `python3 scripts/verify-partial16-source.py --check` reproduces `source-audit.json` exactly, including zero calculator admissions.

## Ten conditional candidates

|ID|Supported bound in this packet|Remaining admission conditions|
|---:|---|---|
|9|Regular single-advance/equal-monthly actuarial APR|Explicit actuarial scope, legally classified amount financed,regular timing,immutable mapping; enclose correct two-decimal output and reject unresolved half ties; no general fee/irregular method approval|
|20|Named LGC61498 transfer-fee component|Choose source/profile and externally establish offer eligibility/timing; no payoff/comparison until compatible agreement,allocation/capitalization/calendar requirements are met|
|23|Named interest-only draw option: supplied accrued interest+fees|Identify applicable lender option and supplied assessed amounts; no HELOC accrual,index/reset,projection or alternative-option inference|
|95|2026 original-owner age75 traditional IRA TableIII exact quotient|Adopt exact numeric-minimum output and verify account/owner/age/table facts; payment quantization and other branches remain unapproved|
|97|Unphased2025 single under50 Roth contribution/qualified distribution|Select exact profile and verify compensation,MAGI,contribution deadline and age/five-taxyear qualification; retain phased/conversion/inherited/excess gaps|
|98|2025 single under50 covered traditional IRA worksheet|Verify separate MAGI/compensation inputs,eligibility and explicit no-Social-Security condition; true/unknown SocialSecurity rejects; preserve ceiling-to-next$10/$200-floor source rules|
|112|FLSA single hourly-rate exact workweek wage estimator|Explicit estimator selection; externally established coverage/nonexempt/minimum-rate facts and no other remuneration; payroll cent-disbursement policy is not inferred|
|132|FY2026 fixed12-month ordinary-company N=A/no-associate estimate|Verify factual eligibility/period/augmented profits,adopt exact computational output,bind reviewed engine; no CT600,collection or short-period authority|
|199|Current-observation unrounded US/USD Etsy scenario or assessed-ledger reconciliation|Choose exact mode/fee coverage and verify account/tax/funding facts; no invented effective dates,provider rounding or credits; historical/billed-exact prediction remains unsupported|
|204|Supplied returns operational scenario/constrained accounting illustration|Adopt mode and period; support consideration/reversal constraints and remeasurement inputs for accounting; no arbitrary-q compliance or calibrated forecast claim|

All10 remain conditional. The packet explicitly records ownerAdopted=false,actual-engine acceptance=false and CI-alone readiness=false. This task's instruction to evaluate prerequisites is not evidence that pending source/profile/qualified facts have been adopted. A clarification about explicit profile choices/applicability evidence remains pending. No mapping/version/implementation approval is invented; proposed source IDs are not runtime aliases. The exact contract/conditions/examples are preserved in `source-audit.json` for review.

The five partial cases19/120/128/129/130 remain blocked for issuer quantization or governing annual tax-stage/rounding/applicability evidence. #527's2024 numeric differential method does not establish Rule1.2 rights,authorized national2026 profile,scoring eligibility,PCC/expected-score data permissions or official index issuance. It is not admitted for implementation. All43 full-product authority blockers,including #485's broad footprint requirements,remain intact.

## Validation and scope limits

53 focused Node tests passed: exact original-step/trigger/concurrency/permission preservation,parsed job dependencies,49 actual aggregate-shell result combinations,archive/audit verification and rejection of altered archive bytes. Source verifier --check passes. Lint:0 errors/28 existing warnings. Typecheck and next build --webpack pass (37 static pages). Independent review found no Critical/Important issues and separately verified the source package,source hash limits,YAML graph,old-step preservation and fail-closed shell. No new calculator formula is admitted,so no actual-engine numerical goldens/browser acceptance are claimed for these10 candidates. Existing calculator/security/browser/certification commands remain required in hosted CI; completed calculator QA was not locally repeated for unchanged code.

All existing files except the directly related CI workflow are byte-preserved,including all540 identities,424acceptance records,14original private DRAFTs,historical versions and the entire #485 native-bound component/evidence. No database,production,payment,certification,publication or merge action occurs. New-head hosted CI is checked once after the separate draft PR,without prolonged polling.
