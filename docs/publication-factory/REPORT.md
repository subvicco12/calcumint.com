# Accelerated publication program — parallel engineering delivery

**Publication success metric: 0 newly eligible; 0 newly live approved canonical calculators.** This is substantive software and publication-preparation engineering, not certification or release approval. RELEASE HOLD remains active; the release-wave manifest is empty.

Baseline PR #1516 was fetched and verified at `c1c7371ac4f284ff7b6371a90fb3296c632396f9`, descending from PR #1515 `32c844b09ecc8c13d75968ef0aaa0b5211116786`. CI #41326234672 was initially pending. Offline preparation proceeded separately; application integration began only after exact-head CI completed successfully. The successor branch is `engineering/publication-factory-20261101`; Git and draft-PR delivery metadata identify its final SHA.

## Actual functional progress

The existing schema form and Advanced JSON paths converted numeric text before immutable engine validation. For example, `1e-400` became zero and `100000000000.000001` became `100000000000`, potentially satisfying the schema for a different input than the user supplied. Seventy-six actual application regressions demonstrated silent rounding before integration.

A shared loss-aware new-input boundary now refuses finite-range overflow, nonzero-to-zero underflow and significant decimal changes under the Number decimal round trip. Invalid drafts retain original text. Ordinary values such as `0.1` and normalization such as `1.00`/`1e3` remain valid. Form spellings `.5`, `+1`, `1.`, `01` and `-.5` remain supported at the parser boundary; native HTML may sanitize some spellings before React receives them. A separate actual-control regression reproduced three losses in the old handler, then verified correction/recovery. Genuine zero and existing mathematical domains are unchanged.

This is not arbitrary-precision arithmetic or a proof of the complete binary64 domain. It prevents demonstrable loss before validation. The new parser applies only to new review input. Original history, artifact imports, scenario readers, immutable engines and mathematical versions keep their original readers and outputs. No change is made to already deployed public engines or production data.

The 76-profile cohort is genuinely compatible at the input/workflow boundary. It is **not one mathematical or canonical contract**: exact schema/methodology/source-metadata projections yield 46 technical groups, largest eight. Every ID retains its own versions, restrictions and numerical evidence. No 50–100-member common mathematical contract was manufactured to satisfy a target cohort size. The three separate calculus v3 adapters are excluded from this cohort because the original readiness private-candidate entries do not establish their matching preparation binding.

## Verification and review

- 76 exact immutable private candidates, with 152 existing independent per-ID witnesses reused against actual engines; complete mathematical artifact equality across Free/Pro/Business and original replay.
- 77 cohort UI regression tests, 35 parser/selector tests, six actual numeric-control tests, plus existing form/workflow regressions.
- 152 Chromium journeys at 360/1440 pixels: lossy-input refusal, original-text and stored-history preservation, valid history recovery, actual Blob export matching the independent engine artifact SHA, two-scenario comparison/export/recovery and immutable-version tamper refusal. Labels and horizontal overflow checked. This is local private app acceptance with synthetic plans, not genuine authenticated account storage or production acceptance. Select changes are programmatic DOM events; fields/buttons use browser interactions. Physical devices and empirical assistive technology remain unverified.
- Ten offline preparation mutation tests and eight identity/authority mutation tests. They catch source hash/pointer drift, wrong identities/versions, support-family substitution, missing per-ID requirements, invalid source metadata, risk-dependent QA omissions and deleted qualified obligations.
- Final mandatory unit, security, certification, lint, typecheck and webpack receipts are in `validation.json`. Existing warnings/skips remain explicit.

Three engineering lanes had non-overlapping ownership: input/cohort evidence; publication integrity/gates; identity/authority projections. Root integrated UI, browser, CI and delivery. Independent code review identified invalid empty publisher/date metadata satisfying source preparation; it was fixed and regression-tested. A self-consistent forged engine candidate was also caught during integration review and now must match the source register and private ledger tuple. Neither issue ever conferred publication authority. Code review is not qualified mathematical/canonical approval.

## Reconciliation and exact counts

Authenticated read-only aggregate observation at **2026-11-01 16:44:38 UTC** confirms **209 published catalog records and 209 distinct slugs**. Existing route evidence is reused; no repeated 209-route census or fresh canonical certification is claimed.

The 136 legacy titled live associations are reconciled against their existing exact registry/hosted/version/URL evidence. They remain observations, not approved canonical bindings. The 14 ambiguous IDs remain unresolved: 222/308 Power, 277/511 Distance, 367/483 Battery Storage, 380/482 Battery Runtime, 403/525 One Rep Max, 490/538 Wind Chill, 492/540 Dew Point. IDs 377/510 preserve the distinction between a published candidate and an additional unpublished alternative.

All 43 original authority cases and the additional eleven retained qualified-review requirements remain intact. Full original packets are projected with their original source pointers and current/deferred prerequisites; no broad research, new source captures or resurrected superseded requirements were introduced. Qualified obligations outside the additional eleven are explicitly preserved.

Existing 540-ID dispositions remain: 136 observed legacy LIVE_VERIFIED associations, 335 engineering blocked, 12 certification blocked, 43 authority blocked and 14 unknown. **Established approved canonical live bindings: 0.** This does not claim that the 136 observed products are mathematically wrong; their required approvals are not established by these artifacts.

## Publication factory and blockers

The reusable offline validator joins all 540 identities and 14,293 retained requirements, resolves actual own-property JSON pointers, checks trusted byte hashes, exact candidate tuples and complete per-ID requirement sets. Family/component material cannot substitute for an identity decision. Source metadata must be usable; risk-specific QA requires the 15 core checks, YMYL review for financial/health/tax and rule-pack validation when explicitly required. Unknown risk or rule-pack applicability stays blocked.

The 76 proposed packets contain **1,207 pending core/risk QA submissions**, not hosted rows or decisions. Unknown rule-pack applicability may add further checks. All reviewer identities/approvals remain null. Raw prior source metadata and per-ID qualified restrictions are retained, with references to the original requirement ledger rather than duplicating or modifying it. Each current preparation decision still has missing source and QA-applicability preparation, plus unestablished authenticated authority. Canonical scope, source revision/applicability, competent reviewer and complete QA/lifecycle decisions remain required; zero eligibility is inferred from passing software.

The existing genuine PostgreSQL 17.6/GoTrue/PostgREST hosted-shaped negative-only preflight is reused by exact receipt/source hash. It concerns six proposed standard templates and demonstrates gate refusal, hash/version orchestration and guarded recovery behavior. It is not represented as database acceptance for all 76 private profiles. No private profile was inserted as a supposedly approved canonical hosted identity. Original guarded SQL successors remain inactive. Future release preparation requires reviewed exact tuples, predecessor/postimage hashes, authorized rollback and post-release URL/engine/lifecycle verification; a route alone never establishes live canonical acceptance.

A new required parallel CI job runs cohort/pointer/mutation checks and the scoped browser campaign. Every previous required job remains required. This avoids extending the already large sequential full-product job or competing production builds.

See `preparation.json` for per-ID blockers and the empty wave; `cohort-76.json` for exact profiles, risk and pending submissions; `identity-reconciliation.json` for 136/14 dispositions; `authority-action-packets.json` for retained 43-case actions; `browser.json` and `contracts-evidence.json` for bounded execution evidence.

## Remaining effort

Completed scope is the shared input-loss correction and reusable exact per-ID preparation, not completion of 76 canonical products. The next independently executable software tranche is a version-safe registered-caller input-loss audit/successor for one compatible 50–100-interface group; budget **8–16 engineering hours**, including preservation of current source-bound revisions and focused/browser regression. This is a task estimate, not an estimate for every remaining calculator.

Full scope, source/provider/jurisdiction, qualified-review and QA decisions remain externally controlled. Exact unresolved per-ID requirements are linked, not guessed. There is no defensible aggregate all-540 publication date or remaining-hour total until those requirements and decisions are available. The existing release hold also prohibits publication; no number of tests bypasses it.

All 540 identities, 424 acceptance records, original 14 private DRAFTs, 43 authority blockers, immutable historical engines and 194 protected source hashes are preserved. No production SQL, lifecycle writes, certification promotion, merge, deployment, publication or payment activation occurred.
