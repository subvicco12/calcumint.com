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
