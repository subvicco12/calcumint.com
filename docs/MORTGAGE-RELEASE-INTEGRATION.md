# Mortgage release integration — Batch 9

Evidence date: 11 October 2026, IST. Review dependency: cumulative draft #1379 at `6060f0451153be75f9af643c30968db3450b0f83`; main baseline `caffafe639350ca0c2c2cf33ae1f099294f5af54`.

## Source and integration order

This proposal follows #1379. It preserves #60 head `8eedfcc842bca15429e1578854c198f6899e7cb6` through four cherry-picked commits with source provenance. The old registry-array conflict was resolved by adding only Mortgage to the current registry, preserving existing definitions. Neither source PR is edited, closed, merged or approved. Prefer review of #1379 followed by this incremental proposal; #60 is an alternative source proposal, not a second integration step.

The governing 1 October blueprint's shared pipeline/reconciliation, cross-plan, Reference Six and definition-of-done requirements (§3, §5, §9, §21, §24) guide this bounded integration. Existing source #60 supplies the Mortgage identity, version, editorial assumptions and CFPB references. This is not comprehensive blueprint completion or financial specialist approval.

## Completed engineering

- Registered `finance.mortgage`, slug `mortgage-payment`, version 1 with canonical `loans-mortgages` content. The source proposal's inherited code review status is preserved; no status is upgraded by this batch.
- Preserved exact delegated loan-payment outputs: two-decimal monthly payment, total calculated from that rounded payment, and existing total-interest rounding. No LoanAnalysis substitution or formula change.
- Required property price, down payment, rate and term no longer coerce blanks to zero. Negative down payments fail closed; nonpositive derived principal fails the existing engine schema without silent clamping. Explicit zero down payment/rate remain supported.
- Invalid core inputs remove result/analysis and disable real save/CSV/JSON actions. Invalid reverse targets receive an accessible error while retaining a valid core result. Mortgage account payloads use the registered slug/version and raw engine input/output.
- Shared trust includes both source references and explicit exclusion of property taxes, homeowners insurance, mortgage insurance, association fees and closing costs. No currency is inferred.
- All-six integrated workflows exercise actual guarded downloads and cross-plan core parity. Mortgage exports reconcile each aggregate field to the delegated engine.
- Canonical route readiness requires independent publication evidence matching ID, slug and immutable version. Absent or mismatched manifest fixtures remain blocked.

## Verification and limits

Focused unique aggregate: 111 tests across 20 files. One existing adapter fixture required migration from loan-only references to exact Mortgage references, while retaining inherited references. No local full build. Final typecheck/lint and exact-head CI are reported in the draft PR.

Actual Chromium at 320 and 1280 pixels: advanced scenario/sensitivity tables and both trust disclosures open; document width equals viewport; clearing down payment announces an alert and removes the result. Harness renders the actual component/CSS, with plan/account fixtures; it does not validate deployed routing, real account persistence or assistive-technology specialist acceptance. An initial harness omitted component CSS; its overflow result was discarded after correcting the harness, with no product CSS change.

## Approval and release blockers

| Evidence | State / next responsible authority |
|---|---|
| Registered engines / source code-certified candidates | 574 / 226; source addition only, not DB approval |
| Prior authoritative anonymous published manifest | 209; reused Batch 6 evidence, no new approval or DB write |
| Mortgage specialist review, HOLD/lifecycle evidence | UNKNOWN: protected evidence inaccessible anonymously; financial specialist/reviewer must assess source model and rounding, owner/admin must retain normal approval gates |
| Mortgage production publication | Prior observed manifest absent and live path 404; new local registration does not publish or establish deployed revision |
| Mortgage amortization schedule / period chart | BLOCKED: source engine exposes aggregate outputs only. A governed Mortgage period contract with payment/principal/interest/balance rounding and terminal semantics is required; do not borrow LoanAnalysis rows |
| Ownership-cost totals / currency context | Unsupported by source core; separate authoritative model/context required |
| BMI / Break-even | Existing draft restrictions preserved; specialist and publication gates remain required |
| Sixteen unpublished candidate review matrix | Reuse `UNPUBLISHED-CANDIDATE-READINESS-MATRIX.csv`; no approvals or HOLD conclusions inferred |

Safe release sequence remains specialist/source review → immutable identity/version and governed content review → owner/admin approval through existing publication authority → authorized deployment → live canonical route/accessibility verification. This batch performs none of those approval, publication or deployment actions.

## Batch 10 — supported aggregate analysis/export integration

Evidence date: 11 October 2026, IST. Continue the same draft #1380 from `80eee2bf44bb5fcaa142c8b894fbc796ccb80865`; #1379 and main remain unchanged. Scoped ownership review found #60 as the source implementation and existing Mortgage test guards; no other production Mortgage analysis/context adapter proposal was identified.

A verified boundary defect was fixed: at the source schema's valid annual rate of 1000%, one generated comparison exceeded the supported range and previously removed the entire advanced series. The new Mortgage-specific adapter evaluates the registered v1 aggregate engine independently at each requested rate. It retains every request with an explicit available/unavailable state, preserves the valid baseline and supported chart points, and neither clamps rates nor fabricates results for invalid requests. Accessible text identifies unavailable scenario/sensitivity rates and reasons. Aggregate rate-comparison totals remain separate from a payment-period chart.

Account/save/JSON/CSV payloads retain all original engine output keys unchanged and add explicitly versioned sidecars: `mortgageContext` contains entered property price/down payment and principal-and-interest-only scope; `rateAnalysis` contains kind, engine identity/version, requested inputs, baseline identity, exact available aggregates and unavailable reasons. Simple mode excludes analytical sidecars. Existing account/export entitlements and serialized history interfaces are unchanged; no real save or DB write was exercised. Invalid core inputs still clear the entire account output. Nonpositive reverse targets fail visibly instead of displaying the existing helper’s fallback zero, while valid core results remain intact. Free/Pro/Business use identical mathematical data, with paid analytical presentations and downloads controlled by existing policies.

Verification: 164 focused tests in 40 affected files pass, including Mortgage/Reference Six guards, zero/1000% boundaries, delegated goldens, actual JSON/CSV equality, meter raw-value parity, context/state transitions, finite rejection, formula-safe CSV, and publication protection. Actual Chromium at 320/1280 pixels with the 1000% boundary: three tables and four disclosures open; no page overflow; keyboard disclosure operation and invalid-input alert/result removal verified. Harness plan/account mocks and lack of real assistive-technology/deployed-route validation remain explicit limitations. Final once-only typecheck/lint and mandatory exact-head CI results are recorded in the draft body.

The requested Mortgage amortization schedule and period chart remain **BLOCKED**, not completed. No supplied Mortgage definition exposes period rows, source #60 has no GitHub review approvals, and protected specialist/HOLD evidence remains UNKNOWN. Required decision: a financial specialist must supply/review an immutable Mortgage period contract defining per-period principal/interest/payment/balance rounding, final-payment adjustment, terminal reconciliation to existing aggregate outputs, and complete/sampled/date/period semantics, with golden vectors. Owner/admin must then apply existing certification/publication/version gates through an authorized release process. LoanAnalysis periods must not be substituted for the Mortgage aggregate rounding contract.

Registry counts remain 574 engines / 226 source code-certified candidates; the prior authoritative published count remains 209 (reused evidence). No new publication, approval, certification, RLS, formula, currency, dependency or workflow change, and no deployment/merge occurred. Next substantial batch depends on the governed period contract; supported aggregate analysis/export engineering is ready for review independently.
