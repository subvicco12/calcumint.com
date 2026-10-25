# Ninety catalog scope/model/policy decisions

Baseline: frozen reviewed draft PR #1478, `3aaca30a04b922ae4acb6bcbf2976b7835b8eea8`. Separate evidence branch: `evidence/catalog-policy-decisions-20261025`. No product behavior, registry, prior manifest, ledger, certification, lifecycle or frozen-PR change.

`decision-register.json` is the single authoritative artifact for this task: exactly the 90 `SCOPE_DECISION_REQUIRED` IDs from the prior 540-row manifest. Each row retains the exact prior finding, title/domain, source-record pointer/digest and repository-file hashes; adds an ID-specific recommended formula/domain, controlling authority, status, unresolved choices, evidence limitations, next action and conditional implementation-gap state. Recommendations are proposals unless specifically labeled as an engineering-only conclusion. No owner approval or specialist signature exists in this package.

| Classification | Count | Meaning |
| --- | ---: | --- |
| Engineering-resolvable | 1 | #507: an existing bounded supplied-total aggregation kernel was overlooked in the prior finding |
| Owner-selectable | 19 | Product scope can be selected by the owner; no selection made here and no specialist/publication gates waived |
| Specialist-required | 70 | Normative domain/model/rule approval is needed; grouped by qualified review discipline in the JSON |

**One engineering scope question resolved; 89 authority-bound scope decisions remain. All 90 canonical catalog mapping approvals remain UNKNOWN.** This is not 90 completed calculators or publication approval.

## Concrete engineering correction: #507 Travel Budget

The prior record says no expense aggregation contract exists. `src/calculators/travel/catalog-batch-2.ts:3` defines the registered `travel.trip-cost` / `trip-cost-calculator` v1, imported through `travelEverydayBatch2Definitions` in the registry. Its exact schema is four supplied finite nonnegative totals, each at most 1e12: `transportCost`, `lodgingCost`, `foodCost`, `otherCost`. It adds these to `value` and a deterministic step string. The existing independently literal example is 300+500+200+100=1100.

This establishes a narrow existing-engine reuse proposal: one whole trip, supplied cost totals in one currency; activities can be supplied inside `otherCost`. It does not implement daily destination pricing, per-day itinerary assumptions, FX, category estimation or a new enriched output breakdown. The review snapshot retains the four input components alongside the total; owner mapping approval is still required. The registered definition itself remains DRAFT and explicitly requires independent source/formula review before certification/publication. No new engine, binding or public route was added.

## Owner selection packet

IDs **44, 109, 145, 156, 157, 158, 159, 160, 161, 177, 181, 194, 195, 200, 201, 203, 467, 471, 512** have separate proposed narrow profiles and specific remaining choices in their rows. Common safeguards: supplied costs/rates/volumes, explicit periods/units/bases, no inferred taxes, provider fees, demand elasticity, safe thresholds or market predictions. Selection of one profile is a scope decision, not a certification or release signature. #512 does not supersede rejected currency mapping #442.

## Qualified reviewer packets

The machine-readable `specialistReviewGroups` lists exact IDs by discipline: credit/property/consumer finance; retirement/withdrawal and numerical modeling; tax/payroll/property tax and inverse discontinuity handling; provider fees/accounting; obstetric, renal, sleep and exercise clinical review; environmental accounting; heat/energy engineering; food safety/thermal validation; institutional grading; sports performance/numerical methods and governing handicap rules. A specialist must approve the selected source version and applicability, not merely sign this register. The owner must also choose the intended product scope.

The original financial records often contain only generic repository inspection evidence; many nonfinancial records supply required signatures and negative findings without a normative external method. Their source paths support the existing-code finding, not authority for a financial, clinical or regulatory rule. Where no selected authoritative method is available, the recommendation explicitly requires one. No jurisdiction/year/rate/table, clinical equation, prediction coefficient or platform fee schedule was invented.

## Governing authority and source limitation

The full project-attached Master Blueprint is unavailable in this checkout. This package uses the recorded Blueprint requirements in the unchanged 424-record acceptance ledger: architecture/catalog/mathematical/database authority separation, rule-pack sources/effective dates, explicit conflict reconciliation, equal-plan mathematics, immutable histories and specialist/publication gates. The original Blueprint digest is recorded as historical provenance from `docs/audits/MASTER-PRODUCT-COMPLETION-2026-10-20.md`; it was not independently reverified against the unavailable original attachment. No unobserved Blueprint clause is used to select a model or claim approval.

## Gaps and shortest publication path

**Zero newly demonstrated missing engine contracts follow from approved scope decisions in this batch.** The only resolved engineering profile already has an engine. The other 89 recommendations are not approved contracts; they cannot be counted as 89 missing engines or as implemented features. After authentic scope approval, compare the selected complete input/output contract with existing kernels and implement only proven gaps in private branches.

1. Review the bounded #507 reuse proposal, record actual owner mapping selection and obtain normal independent source/certification evidence.
2. Owner selects the 19 product profiles by ID, without treating the proposal text as preapproval.
3. Qualified reviewers settle the 70 domain/rule cases using actual source revisions and applicability evidence; finance/numerical, clinical and other packets can proceed independently.
4. Implement and test only gaps demonstrated against those approved contracts; preserve the single deterministic engine across plans and immutable historical versions.
5. Reconcile identity approval, specialist/certification and authoritative database lifecycle evidence separately. Any later production/publication operation requires separate authorization; RELEASE HOLD remains active.

Rejected unsupported mappings **#9 APR** (nominal/EAR is not regulatory APR) and **#442 Currency Converter** (physical-unit conversion is not FX) are retained verbatim as parsed records. The prior 540-row manifest, 574 public-registry definitions, original 14 private DRAFTs and all 424 ledger identities/statuses remain unchanged.

## Verification

Run `python scripts/verify-catalog-policy-register.py` from repository root. It checks the exact 90-ID set, authoritative catalog titles/domains, original records/digests, every cited file hash, authority/status consistency, no invented approvals/signatures, zero publication authorizations, preserved rejected mappings and reviewer grouping integrity.

Fresh results: register validation passed; seven negative probes rejected duplicate IDs, invented owner approval, invented specialist signature, publication promotion, lost rejected mapping, stale source hash and invented missing-engine count. Five focused existing tests passed across travel batch 2 and catalog contract reconciliation. No runtime source changed, so full application audits/build/hosted CI were not repeated for this offline evidence-only package. PR #1478's hosted CI remains historical baseline evidence, not a claimed new run for this branch.
