# Codex I — investment cash-flow golden acceptance

15 October 2026, Asia/Calcutta. **RELEASE HOLD.** Numerical contract checks are not certification, specialist approval, publication or investment advice.

## Pinned baseline and bounded scope

Verified unchanged GitHub draft heads before work: #1397 `d9913f66428c66a1d408c7d60b50f7d2e39238b9`; #1398 `08673b0338805e43e5419ff62a91b4b221c4475e`; #1399 `f71306e39c6182c057796b1de613edddb1980988`; #1400 `f85c064e9aeb6aab0a5f50493688fbb37a1afbfc`; #1401 `030b1e81d0799fdad4b45a7081e670e1d1c2b1f6`. This branch retains #1401 and its validated integration ancestry `7d725c23ef35e09e101b8da997c0b386fd3649ed`. Existing source CI and integration evidence are reused; source drafts are not modified.

Ownership search found existing #1378 finance readiness, #1388 trust integration, #1393 standard-risk goldens and inherited #1401. This delta adds only three explicit golden metadata bindings, a literal fixture module, focused tests, current count assertions and this ledger. No owned UI/readiness work is duplicated. Formula bodies, schemas, examples, source metadata, statuses, technical versions and identities remain unchanged.

## Completed numerical evidence

| Registered v1 identity | New literal vectors | Independently verified scope |
|---|---:|---|
|finance.step-up-sip|10|Annual step boundary months12/13/24/25; zero-rate1200-month ceiling; signed returns; end/beginning deposits; simultaneous growth and month13 step|
|finance.investment-math|8|Nominal compounding; exact Fisher real-return ratio; matching inflation; negative rates; deflation; fractional year;200-year zero-rate boundary|
|finance.swp|10|Beginning/end withdrawals; partial capped final withdrawal; exact/early depletion; no withdrawals; negative return;1200-month zero-rate boundary|

All28 expected outputs are literal data, not calculated by the implementation or generated from an engine run. For two100 deposits at1% monthly return, end timing is100×1.01+100=201; beginning timing is100×1.01²+100×1.01=203.01. Step-up10% at zero return gives12×100+110=1310 at month13 and12×100+12×110+121=2641 at month25.

The combined step/growth boundary uses the independent finite expansion100×sum(1.1^j,j=1..12)+200=2552.2712143931; beginning timing multiplies this by1.1=2807.49833583241. Literal money expectations2552.27/2807.50 and gains1152.27/1407.50 follow existing two-decimal output contracts. These values were derived with exact rational arithmetic independently of the monthly engine loop; fixtures do not recompute expectations. Cases avoid disputed decimal half-ties.

Investment example: nominal1.21 with inflation1.10 gives real ratio1.10;100 over two years yields nominal146.41 and real121, with real annual rate10%. SWP example: end timing(100×1.01−10)×1.01−10=81.91; beginning timing((100−10)×1.01−10)×1.01=81.709→81.71. A beginning withdrawal101 is capped at the100 corpus and depletes before growth; end timing earns1 first and withdraws101. These are existing engine contracts, not new assumptions about an institution.

Fixed reverse/helper checks avoid implementation round-trips: target1310 at13 zero-return step-up months requires initial100;121 discounted at10% over two years returns100 and its CAGR is10%; a zero-return100 corpus over4 months supports25 under either timing. Tests also preserve default timing, nullable depletion month, signs, precision, Free/Pro/Business engine equality, locale/currency independence and invalid input/period/timing boundaries.

## Existing sources versus protected approval

References already registered in these definitions:

- Investor.gov Compound Interest Calculator: https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
- Step-up SIP also references Investor.gov Dollar Cost Averaging: https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging
- Investment Math also references Investor.gov Savings Goal Calculator: https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator

Registered formulas, helper contracts and pre-existing unit tests provide the exact engineering behavior being verified. General source pointers do not certify CalcuMint's exact step timing, Fisher methodology, depletion, rounding or reverse-helper policy. No new external research or source review is claimed. Qualified specialist approval, source-review authenticity/current applicability and protected lifecycle decisions remain UNKNOWN. Inherited code-certified flags are unchanged, not new certifications. No forecasts, recommended rates, medical rules or Mortgage periods are introduced.

## Coverage and remaining13 baseline gaps

The574-definition registry now has10 missing explicit records, down from13 after adding three records/28vectors. Standard-risk missing records remain0. Previous five accumulation and six planning records are unchanged. Their current global count assertions are updated13→10, not loosened or disabled. The new test asserts the exact remaining identity list.

|Baseline gap|After this batch|Smallest next action|
|---|---|---|
|finance.step-up-sip|Explicit record added|Obtain applicable source-methodology and financial specialist review|
|finance.investment-math|Explicit record added|Obtain applicable source-methodology and financial specialist review|
|finance.swp|Explicit record added|Obtain applicable source-methodology and financial specialist review|
|finance.loan-payment|Missing|Next debt-aggregate batch: hand-derived payment/total vectors under existing contract; no inferred period policy|
|finance.loan-comparison|Missing|Same debt batch: independently compare existing aggregate contracts and terms|
|finance.loan-affordability|Missing|Same debt batch: independently solve inverse payment boundary under registered contract|
|finance.loan-analysis|Missing|Reconcile authoritative periods, totals and boundaries without borrowing Mortgage rules|
|finance.loan-refinance|Missing|Verify registered fees/term and break-even meanings before literal vectors|
|finance.loan-prepayment|Missing|Verify actual payment/timing/terminal contract; no invented lender convention|
|finance.debt-payoff|Missing|Inspect strategy/order and terminal payment semantics before source-backed fixtures|
|finance.credit-card-payoff|Missing|Inspect issuer-neutral registered assumptions; no inferred minimum-payment policy|
|finance.mortgage|Missing; period decisions BLOCKED|Use existing financial specialist package; do not invent amortization/final-payment rounding|
|health.bmi|Missing; clinical judgment blocked|Arithmetic verification can be assessed independently; clinical thresholds/populations require appropriate review|

All applicable specialist approvals for the24 baseline nonstandard calculators remain UNKNOWN. Passing golden records measure bounded engineering evidence, not exhaustive mathematical correctness at all extremes or release eligibility.

## Acceptance and prioritized owner decisions

Reused evidence quantities remain:540 master rows,574 registry definitions,209 imported published standard-risk v1 identities/209 exact registry matches,3135 QA records(2299 passed/836 waived),210 source records/22 distinct source hashes,283 proposed mapping rows/245 UNKNOWN/12 reviewer-queue HOLDs. Canonical approved mappings verified0. Base245 missing linkage/174 ambiguous/121 pending classifications remain unchanged. The six explicit plus six candidate-linked HOLDs, Slope historicalv1/draftv2 and all release controls remain intact. No fresh live production observation is asserted.

|Priority/state|Required evidence and next owner action|Decision authority; assignment|
|---|---|---|
|P0 UNKNOWN/BLOCKED|Authenticate836 check-specific historical waiver decisions with role-at-decision, rationale and identity/version/base-digest binding; use existing strict supplemental validator, never synthetic production claims|Owner/admin at decision; actual assignee UNKNOWN|
|P0 UNKNOWN/BLOCKED|Provide210 identity-scoped source reviews and current source applicability; repeated source hashes cannot approve unrelated identities|Authorized source reviewer/owner/admin; assignee UNKNOWN|
|P0 UNKNOWN/HOLD|Decide540 master scopes/mappings from existing queue, including12 held rows; provide actual scoped mapping and immutable version decisions|Authorized catalog decision owner and applicable specialist; assignee UNKNOWN|
|P0 SPECIALIST BLOCKED|Resolve Mortgage aggregate versus period rounding, final payment, terminal reconciliation, tiny-rate/rounded-zero behavior and exact accepted vectors; existing package and JSON are evidence/questions, not approval|Qualified financial specialist plus governed certification authority; assignee UNKNOWN|
|P0 UNKNOWN|Supply exact reviewed engine commit/version, source/rule-pack applicability, specialist scope, certification and publication decisions separately|Applicable specialist and authorized lifecycle decision owner; assignee UNKNOWN|
|P1 UNKNOWN|The six #1401 planning calculators still have empty source lists; obtain source-methodology records rather than substituting numerical tests|Source reviewer and qualified financial specialist; assignee UNKNOWN|
|P1 ENGINEERING REMAINS|Next coherent three-calculator debt-aggregate batch: Loan Payment, Loan Comparison, Loan Affordability if contracts support literal derivations; keep Mortgage period choices blocked|Engineering for fixtures; qualified specialist for acceptance|
|P1 UNKNOWN|Export observation time remains null; request sanitized authenticated freshness evidence through authorized read-only workflow, not new production credentials for unit development|Authorized evidence custodian; assignee UNKNOWN|

Full previous owner package: `docs/audits/CODEX-H-BLOCKER-REDUCTION-ACCEPTANCE.md`. Mortgage evidence: `docs/MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md` and `docs/MORTGAGE-SPECIALIST-REVIEW-VECTORS.json`. Those historical snapshots remain unchanged. No actual protected decision was supplied, inferred or entered by this batch.

## Verification and review order

New tests were observed failing without the three bindings, then passed37 tests with28 literals. Expanded focused checks passed169 tests across10 files; certification/rule-pack checks passed15 tests. Typecheck passed. Full lint passed with0 errors and28 inherited warnings. `NODE_USE_ENV_PROXY=1 npm run build` passed in60.19s with unchanged `next build --webpack`; generated config was restored. Final-head automatic CI is linked from the draft PR. No check itself performs certification.

Review pinned#1397→#1398/#1399/#1400→#1401→this cumulative engineering delta. Independent specialist/source/mapping decisions must follow existing controls before any authorized lifecycle action. RELEASE HOLD. No production writes, privileged credentials, merges, deployments, publication, certification, formula/version/identity changes, fabricated evidence or weakened CI/RLS/security gates.
