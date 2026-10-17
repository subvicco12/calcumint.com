# Codex J — debt aggregate golden acceptance

16 October 2026, Asia/Calcutta. **RELEASE HOLD.** Engineering arithmetic evidence is separate from financial specialist approval, certification, publication and lending decisions.

## Baseline and scope

Verified unchanged draft heads: #1397 `d9913f66428c66a1d408c7d60b50f7d2e39238b9`; #1398 `08673b0338805e43e5419ff62a91b4b221c4475e`; #1399 `f71306e39c6182c057796b1de613edddb1980988`; #1400 `f85c064e9aeb6aab0a5f50493688fbb37a1afbfc`; #1401 `030b1e81d0799fdad4b45a7081e670e1d1c2b1f6`; #1402 `4b5f00e578ce03f055b54894de8b867a71b7b4e9`. Source drafts are not modified. This branch retains the passing cumulative integration and previous numerical/evidence work. No repeated research or live DB queries were performed.

Open ownership search identified #1230 Loan Payment nonfinite-output hardening and #1370 direct-input/rounding hardening. This batch does not duplicate their engineering changes or alter calculation bodies. Other inherited renderer/scenario/Mortgage PRs remain unchanged. Blueprint remains the1 October2026 governing architecture; code/runtime evidence and protected decisions remain separate authorities.

## Three explicit records /24 literal vectors

| Version1 identity | Added vectors | Engineering contract covered | Approval/source state |
|---|---:|---|---|
|finance.loan-payment|8|Zero/positive rates; one/two periods; payment-first monetary rounding;1200-month term;1000% annual-rate schema ceiling; small monetary principal|Inherited code-certified flag preserved; financial acceptance not granted|
|finance.loan-comparison|8|Equal and differing terms/principals/rates; upfront fees; signed A−B differences; winner labels and ties after rounded summaries|DRAFT and empty source list preserved; source/specialist evidence UNKNOWN|
|finance.loan-affordability|8|User-selected DTI capacity; existing debt; zero/clamped capacity; down payment; inverse annuity; decimal budgets;100% DTI/1200-month schema boundaries|DRAFT and empty source list preserved; no underwriting policy inferred|

24 expected outputs are hand-derived literals, not generated from the engine or compared only with a wrapper. Examples:

- For principal201 and monthly rate1%, payment102.01 follows201×.01/(1−1.01^−2). Independent periods:201+2.01−102.01=101, then101+1.01−102.01=0. Totals204.02 paid and3.02 interest. The test checks existing LoanAnalysis rows against those literals; it neither registers a LoanAnalysis golden record nor defines Mortgage periods.
- For principal1000 and monthly10% overtwo periods, payment12100/21=576.190476…; Loan Payment rounds to576.19, multiplies bytwo for1152.38 and reports152.38 interest.
- The registered Loan Payment zero-rate100/3 model reports33.33 monthly,99.99 total and−0.01 aggregate interest. Loan Comparison uses unrounded100/3 for its totals and reports33.33 monthly,100 total and0 interest. These distinct behaviors are explicitly preserved, not unified, clamped or represented as an approved financial rounding policy.
- Loan Comparison's100 principal at10% monthly overtwo periods has unrounded payment1210/21 and interest320/21=15.238095…→15.24; total115.24. Fees can make the lower-payment loan cost more. A0.004 upfront fee is below a half-cent and rounds tozero in the existing summary; ties are tested using that existing behavior, not a new tolerance.
- Available payment100 at1% monthly overtwo periods yields principal2010000/10201=197.039505…→197.04. A user-selected20% target on1000 income with50 existing debt gives150 available,1500 principal overten zero-rate months, and1600 purchase output with100 down. No chosen DTI is recommended or approved.

The zero-capacity Affordability case with100 down still reports modeled purchase output100 and modeled loan principal0; this is existing arithmetic, not evidence of lending eligibility. Cases avoid disputed half-cent ties. Sources, examples, formulas, schemas and all technical versions remain unchanged.

## Scoped evidence inheritance correction

Mortgage spreads the Loan Payment definition. Initially adding Loan Payment fixtures silently populated Mortgage's `goldenTests`, falsely changing missing-record count10→6. The new exact identity-list assertion detected this. Mortgage now explicitly leaves `goldenTests` undefined so evidence remains calculator-scoped. Its engine function, schema, immutable identity/version, sources, status, output behavior and all specialist/period restrictions are unchanged. Regression tests assert this scoping and shared engine/schema identity. Missing records correctly change10→7, not6. No Mortgage gap is claimed closed.

This metadata correction does not choose any financial rule, alter certification or clear a protected HOLD. Source PRs are unchanged.

## Source and authority evidence

Loan Payment already references CFPB: https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/

The three registered formula contracts and `paymentForLoan`/`maxPrincipalForPayment` helpers define the arithmetic being tested. The CFPB pointer does not approve the exact CalcuMint rounding, tolerance, financial domain or Mortgage policy. Comparison and Affordability still have no registered external sources; their formula-contract fixtures close record-presence gaps only. No new externally researched or specialist-approved methodology is claimed. Existing source/specialist decisions remain UNKNOWN.

## Analysis of all10 baseline gaps

| Identity | Current state | Smallest safe next action |
|---|---|---|
|finance.loan-payment|8 literals added|Financial reviewer must accept exact aggregate rounding/source scope and reviewed engine version; separate direct-call hardening ownership remains#1230/#1370|
|finance.loan-comparison|8 literals added|Source/specialist review of unrounded total model, fees, tie labels and comparison scope|
|finance.loan-affordability|8 literals added|Source/specialist review; user DTI is an input, not an underwriting recommendation|
|finance.loan-analysis|Explicit record missing|Next coherent batch: independent short schedules, principal/interest sums, extra-payment and terminal boundaries under existing contract|
|finance.loan-prepayment|Explicit record missing|Same next batch if timing/payoff contract supports literal independent derivations; invent no lender convention|
|finance.loan-refinance|Explicit record missing|Same next batch if fee/term/break-even definitions are explicit; independently verify comparison outputs|
|finance.debt-payoff|Explicit record missing|Inspect strategy, ordering and partial/final-payment contracts before literal vectors|
|finance.credit-card-payoff|Explicit record missing|Inspect registered payment model; no invented issuer/minimum-payment policy|
|finance.mortgage|Missing; period-rule decisions BLOCKED|Existing specialist package governs unresolved rounding, final payment and reconciliation questions; no borrowed LoanAnalysis schedule|
|health.bmi|Missing; clinical judgments BLOCKED|Independent arithmetic may be reviewed separately; thresholds, populations and interpretation require appropriate specialist evidence|

Runtime registry574, missing explicit records7, standard-risk missing0. Prior golden vectors are unchanged. Previous global metrics move10→7; exact missing-identity assertions are updated, not loosened or disabled. Applicable specialist decisions for the24 baseline nonstandard calculators remain UNKNOWN; arithmetic tests are bounded evidence, not exhaustive correctness or approval.

## Acceptance counts and protected dependencies

Reused evidence remains540 master rows,574 registry definitions,209 imported published standard-risk v1 records/209 exact registry identity matches,3135 QA records(2299 passed/836 waived),210 source records with22 distinct source hashes. Mapping queue:283 proposed/245 UNKNOWN/12 HOLD, zero canonical approved mappings verified. Base245 missing linkage/174 ambiguous/121 pending classifications unchanged. Six explicit and six candidate-linked HOLDs and Slope historicalv1/draftv2 restrictions remain intact. Export observation timestamp remains UNKNOWN; no fresh production claim is made.

|Priority/state|Required decision/evidence|Authorized role; named assignment|
|---|---|---|
|P0 UNKNOWN/BLOCKED|836 check-specific waiver decisions: authenticate historical role, rationale, identity/version and artifact/base-digest binding through existing strict supplemental validator|Owner/admin at decision; actual assignee UNKNOWN|
|P0 UNKNOWN/BLOCKED|210 identity-bound source review artifacts, reviewer authority and source applicability; repeated source hashes do not confer review|Authorized source reviewer/owner/admin; actual assignee UNKNOWN|
|P0 UNKNOWN/HOLD|540 mapping decisions with scoped contract evidence and immutable versions, including12 held rows; no title-based approval|Authorized catalog decision owner and relevant specialist; assignee UNKNOWN|
|P0 SPECIALIST BLOCKED|Mortgage aggregate/payment/period rounding, terminal balance/final payment, tiny-rate/rounded-zero domain and accepted golden vectors tied to exact engine SHA/version|Qualified financial specialist and governed certification authority; assignee UNKNOWN|
|P0 UNKNOWN|Source/rule-pack scope, specialist evidence, exact certification and publication decisions remain separate from code flags, QA passes and public DB observations|Applicable specialist and authorized lifecycle decision owner; assignee UNKNOWN|
|P1 ENGINEERING REMAINS|Next three-contract batch Loan Analysis/Prepayment/Refinance, conditioned on independently supported deterministic semantics|Engineering for fixtures, financial specialist for protected judgments|
|P1 UNKNOWN|Source methodology for two new draft records plus six planning records whose source lists remain empty; passing arithmetic cannot substitute|Source reviewer and qualified financial specialist; assignee UNKNOWN|
|P1 UNKNOWN|Authenticated export observation time and protected lifecycle freshness through authorized read-only workflow|Authorized evidence custodian; assignee UNKNOWN|

Reuse `docs/audits/CODEX-H-BLOCKER-REDUCTION-ACCEPTANCE.md`, `CODEX-I-INVESTMENT-GOLDEN-ACCEPTANCE.md`, `docs/MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md` and `docs/MORTGAGE-SPECIALIST-REVIEW-VECTORS.json`; historical evidence is not silently rewritten as current approval.

## Verification

The new suite was observed failing without bindings; all24 literals then passed. The exact remaining-list regression caught Mortgage's inherited fixtures and passed after the calculator-scoping guard. Focused result:183 tests across10files, including32 new tests, prior golden batches, source/evidence import boundaries, debt contracts, Reference Six and schedule policy. Certification/rule-pack checks:15 passed. Typecheck passed. Full lint passed with0 errors and28 inherited warnings. `NODE_USE_ENV_PROXY=1 npm run build` passed in35.96s with unchanged `next build --webpack`; generated configuration restored. Final exact-head automatic CI links/results are in the draft PR. No repeated full local suite or extra workflow dispatch is required.

Review pinned source stack→this cumulative delta→authentic authority/source/mapping/specialist decisions through existing controls. No production writes, approvals, merges, deployments, certification, publication, formula/schema/version changes, fabricated evidence or weakened CI/RLS/security. **RELEASE HOLD.**
