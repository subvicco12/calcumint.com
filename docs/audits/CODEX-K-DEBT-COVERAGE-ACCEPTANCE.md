# Codex K — remaining debt golden coverage

16 October 2026, Asia/Calcutta. **RELEASE HOLD.** Passing arithmetic tests do not constitute financial specialist approval, certification, publication or repayment advice.

## Verified baseline and scope

Pinned draft heads checked before work: #1397 `d9913f66428c66a1d408c7d60b50f7d2e39238b9`; #1398 `08673b0338805e43e5419ff62a91b4b221c4475e`; #1399 `f71306e39c6182c057796b1de613edddb1980988`; #1400 `f85c064e9aeb6aab0a5f50493688fbb37a1afbfc`; #1401 `030b1e81d0799fdad4b45a7081e670e1d1c2b1f6`; #1402 `4b5f00e578ce03f055b54894de8b867a71b7b4e9`; #1403 `769be5b9190f0af3db1e10d6355d2ae89a7010b2`. Source drafts are unchanged. This branch retains the existing cumulative integration and passing numerical/authority evidence. Relevant open-PR search for prepayment/refinance/debt/credit payoff found no separate open matching work. No duplicate external research or production audit was performed.

Authority remains the1 October2026 Final Blueprint,540-row master catalog, registered deterministic contracts and protected lifecycle decisions. This batch adds only five golden bindings, a literal fixture module, focused tests, exact current coverage assertions and this ledger. Formula bodies, input schemas, source metadata, examples, identities, versions and lifecycle flags remain unchanged.

## Five records /34 independent literal vectors

| Version1 identity | Vectors | Independently verified contract | Status/source limit |
|---|---:|---|---|
|finance.loan-analysis|6|Short schedules, zero/positive rate, extra payments, capped final payment and interest/month savings|Inherited code-certified flag unchanged; financial acceptance UNKNOWN|
|finance.loan-prepayment|6|Remaining balance, partial/full capped lump sum, applicable fee only for positive prepayment, signed net savings|DRAFT/empty source list unchanged|
|finance.loan-refinance|6|Payment changes, fee-adjusted lifetime savings, zero/positive/null cash-flow break-even|DRAFT/empty source list unchanged|
|finance.debt-payoff|8|Snowball/avalanche priority, stable ties, preserved original budget, minimum-payment rollover and trimmed unique names|DRAFT/empty source list unchanged|
|finance.credit-card-payoff|8|Nominal APR/12 model, extra payment, capped final amount, two-period interest, supported2400-month horizon|DRAFT/empty source list unchanged|

Expected values are literal independent derivations, never computed using the engine under test or a duplicate wrapper. Fixtures avoid disputed half-cent ties. Representative derivations:

- Loan Analysis201 at1% monthly overtwo periods:201+2.01−102.01=101, then101+1.01−102.01=0. With extra100, first payment202.01 leaves1, then final1.01 pays the remainder: total203.02, interest2.02, saving1 interest. A zero-rate100 balance with25 scheduled plus100 extra pays only100; requested125 remains a separate reported amount by the existing contract.
- Prepayment after one zero-rate25 payment on100 leaves75. A25 lump sum leaves50 and saves one month; fee2 gives net−2 despite zero interest saved. A100 lump is capped at75. With no lump sum, the explicit fee is ignored. On201 at1% monthly, prepaying100 leaves101, whose remaining interest1.01 is2.01 less than baseline3.02; fee0.5 yields1.51 net. These are registered generic rules, not lender policy.
- Refinance zero-rate1000 fromten to twenty months changes payment100→50. Costs75 give ceil(75/50)=2 cash-flow break-even months while lifetime net savings are−75. This intentionally demonstrates that cash-flow break-even is not an economic benefit or recommendation. Equal/higher payments retain null break-even; lower payment with zero costs gives0.
- Avalanche versus snowball: balances A100 at1% monthly and B50 at0%, no minimums, extra151. After interest, due amounts101/50 are both paid in one month; avalanche orderA,B and snowball orderB,A. With zero-rate A100/B50, minimums10/10 and extra30, original budget50 is preserved; B pays off in month2 and A in month3, total150. Identical-rate/balance ties retain input order.
- Credit201 at1% monthly with payment102.01 has interest2.01+1.01=3.02 and total204.02. Credit100 at0% with payment30 uses30+30+30+10, not120. Requesting200 at1% still pays only101. Zero-APR2400 with payment1 reaches the existing2400-month horizon exactly.

The43 new tests cover literal direct/common-engine outputs, Free/Pro/Business mathematical parity, locale/currency independence, schema rejection, invalid-input recovery, duplicate names, unsupported strategies, non-amortizing budgets, schedule terminal balance, accepted1200-month Loan Analysis boundary and rejected debt1201/credit2401 horizons. No new threshold or rounding rule is selected.

## Existing sources and missing authority

Loan Analysis already cites registered source references; the other four definitions retain empty source lists. Their explicit `formulas`, `paymentForLoan`, `remainingLoanBalance`, payoff loops and existing unit tests define the engineering behavior checked here. No newly researched external source or authenticated specialist review is claimed. Generic code contracts cannot establish institution-specific fees, legal APR/billing conventions, permitted debt strategy, advice suitability or an approved exact rounding policy.

Applicable specialist review for all24 baseline nonstandard identities remains UNKNOWN. Passing source-free draft arithmetic does not fill a source-methodology review or authorize certification. Loan Analysis code status is inherited, not a new certification.

## All seven baseline gaps and remaining work

| Baseline identity | Current record state | Remaining requirement |
|---|---|---|
|finance.loan-analysis|6 vectors added|Qualified financial review of exact schedule/rounding/terminal scope, source evidence and engine SHA|
|finance.loan-prepayment|6 vectors added|Source and specialist acceptance of generic prepayment/fee/time-saving methodology|
|finance.loan-refinance|6 vectors added|Source and specialist acceptance of fee exclusions, term changes and cash-flow break-even meaning|
|finance.debt-payoff|8 vectors added|Source and specialist review of interest, minimum-payment ordering, strategy, cutoff and horizon semantics|
|finance.credit-card-payoff|8 vectors added|Source and specialist review of monthly APR approximation, payment/interest timing and horizon; no issuer rules inferred|
|finance.mortgage|Explicit record missing; financial rule decisions BLOCKED|Existing Mortgage specialist package: aggregate versus period rounding, final payment, terminal balance, tiny-rate/rounded-zero boundaries, accepted vectors and exact version/SHA|
|health.bmi|Explicit record missing; specialist-dependent judgments BLOCKED|Registered metric formula and WHO reference exist, but full output includes classification after rounding; population applicability and qualified review remain UNKNOWN. No threshold/interpretation approval inferred|

Runtime registry574; missing explicit records7→2; standard-risk missing0. The new and existing exact missing-identity assertions agree on Mortgage and BMI. Prior golden vectors are unchanged. Current aggregate count assertions move7→2, not to a weakened range. Mortgage's calculator-scoped undefined golden metadata remains intact; no Loan Payment/Analysis fixture is inherited or used to claim Mortgage coverage.

## Reused acceptance facts and owner actions

540 master rows;574 registry definitions;209 imported published standard-risk v1 identities/209 exact registry matches;3135 QA records(2299 passed/836 waived);210 source records with22 distinct source hashes. Mapping queue283 proposed/245 UNKNOWN/12 HOLD; zero approved canonical mappings verified. Existing245 missing linkage/174 ambiguous/121 pending classifications, six explicit/six candidate-linked HOLDs and historical Slopev1/draftv2 remain unchanged. Observation timestamp remains UNKNOWN. This task supplies no fresh live production evidence.

|Priority/state|Exact next action|Decision authority; named assignment|
|---|---|---|
|P0 UNKNOWN/BLOCKED|Authenticate836 check-specific historical waiver decisions and rationale, role-at-decision, exact identity/version/base-digest references; use existing strict supplemental importer|Owner/admin at decision; assignee UNKNOWN|
|P0 UNKNOWN/BLOCKED|Supply210 identity-bound source review artifacts and source applicability; shared source hash is not reviewer authority|Authorized source reviewer/owner/admin; assignee UNKNOWN|
|P0 UNKNOWN/HOLD|Review540 mapping scopes and12 held queue rows; supply source-backed immutable identity/version decisions, not title guesses|Authorized catalog decision owner and applicable specialist; assignee UNKNOWN|
|P0 SPECIALIST BLOCKED|Answer Mortgage financial rules and golden acceptance questions in existing specialist package without borrowing Loan Analysis as Mortgage authority|Qualified financial specialist and governed certification authority; assignee UNKNOWN|
|P0 SPECIALIST BLOCKED|WHO source pointer and metric formula are available; supply authenticated population applicability and review of classification-after-rounding before clinical assumptions/thresholds or release decisions|Qualified health specialist and governed certification authority; assignee UNKNOWN|
|P0 UNKNOWN|Exact reviewed engine SHA/version, source/rule-pack applicability, specialist scope, certification and publication decisions remain independent of QA/code flags|Applicable specialist and authorized lifecycle owner/admin; assignee UNKNOWN|
|P1 UNKNOWN|Source-methodology records for four new draft debt calculators plus prior source-free planning/comparison/affordability drafts|Source reviewer and qualified financial specialist; assignee UNKNOWN|
|P1 UNKNOWN|Authenticated export observation time and current protected lifecycle evidence through authorized read-only workflow|Authorized evidence custodian; assignee UNKNOWN|

Reuse previous owner packages in `docs/audits/CODEX-H-BLOCKER-REDUCTION-ACCEPTANCE.md`, `CODEX-I-INVESTMENT-GOLDEN-ACCEPTANCE.md`, `CODEX-J-DEBT-GOLDEN-ACCEPTANCE.md`; Mortgage review questions/vectors in `docs/MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md` and `docs/MORTGAGE-SPECIALIST-REVIEW-VECTORS.json`. Those are evidence/questions, not approvals.

Smallest next batches: (1) authorized financial/source review of the new five-record cohort with exact code/source/rounding decisions; (2) Mortgage decision-bound aggregate/period fixtures only after authoritative scope is supplied; (3) BMI arithmetic-only evidence from its registered metric formula can be separated from the full classified result; qualified applicability/classification decisions remain blocked. Continue offline importer/acceptance work only for demonstrated defects; do not create artificial approval evidence or documentation-only churn.

## Verification and review sequence

The new suite was observed failing without bindings, then passed43 tests with34 literals. Expanded focused checks passed266 tests across14 files; certification/rule-pack checks passed15 tests. Typecheck passed; full lint passed with0 errors/28 inherited warnings. `NODE_USE_ENV_PROXY=1 npm run build` passed35.41s with unchanged `next build --webpack` and generated configuration restored. Final exact-head automatic CI links/results are in the draft PR. No test or metadata binding performs certification.

Review pinned source stack→this cumulative engineering delta→authenticated source/authority and qualified specialist decisions through existing controls. No production queries/writes, privileged credentials, merges, deployments, certification, publication, invented approvals, formula/schema/version changes or weakened CI/RLS/security. **RELEASE HOLD.**
