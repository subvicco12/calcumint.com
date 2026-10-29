# Batch05 private financial contract integration

Baseline PR1487 b983595a878353ad9afc5798bd003246be5c71a7. RELEASE HOLD. Mission authorizes continued engineering without another design-approval stop. Preserve all prior files except the additive CI browser step.

## Selection and design

Verified the original50-case archive and all42 source-observation hashes. The largest coherent group selected for new integration is nine financing/property contracts:21,32,36,43,46,49,468,470,472. They share dated finite cashflow mathematics and supplied financing inputs. The adjacent retirement group has nine general supplied-value candidates80,81,84,85,86,88,89,90,91 minus already implemented projections; institutional96/97/98 and rule-driven tax/payroll cases cannot be joined without additional policy. Marketplace198/199 remain excluded. This is a grouping of private contracts, not full original product acceptance. contract-assessment.json preserves all50 source references and original gaps.

Alternatives: relabel generic ledgers (insufficient product functionality); replace historical definitions (breaks preservation); add explicit private product contracts that reuse the immutable ledger engine (selected). Each product derives its own disjoint cashflows from named fields, reconciles debt and assets, and provides a full trace, methodology, validation, closed immutable export/replay and private browser review.

Common units are supplied currency and exact period. Financing uses caller-supplied fractional rate and requested end-period payment per step, interest before payment, payment capped at due balance; missed principal amortization remains visible. No APR conversion, inferred amortization term, daily interest or invoice rounding. 0..600 periods; <=20 consolidated existing debts; monetary inputs0..1e12 and rates0..1. Finite arithmetic and underflow checks reuse existing helpers. Same engine and precision for Free/Pro/Business.

Purchase contracts: price minus opening loan is initial equity; upfront costs paid once; period running costs plus actual payments; exit gross value minus selling cost minus terminal debt. Sales costs are separate horizon flows, not also netted from value. Rental contracts distinguish collected rent, NOI, debt service, capex and unspent ring-fenced reserves. Reserves remain an asset and return exactly once at exit. No tax/depreciation claim. ROI reports explicit total owner contributions/distributions, including interim/exit deficits; zero denominator yields null. Affordability is comparison with supplied cash/period budgets, not lender eligibility. Lease inputs are already disclosed payments/end charges; no money factor or schedule inferred.

## Tasks and interfaces

- [x] Add literal actual-engine goldens for all nine named contracts, financing traces, negative amortization, terminal debt, cashflow timing, cost duplication, reserve return, zero denominator and validation failures. First run must fail before new module exists.
- [x] Implement `financial-contracts.ts`: `financialContracts` definitions, `financialExamples`, `exportFinancialContract(id,input,plan)`, `importFinancialContract(raw)`. Reuse private supplied-ledger dependency and original observation hash bindings. Immutable snapshots pin definition/dependency versions and observations; recompute every value and reject unknown fields.
- [x] Add isolated `FinancialContractReview` UI and private authenticated browser fixture: all nine × three plans × two widths; labeled JSON input, full method and result, stale-result clearing, recovery, detached history and real downloads replayed through engine. No public route or registry imports.
- [x] Run focused and full unit tests, actual new browser acceptance and existing native Next runtime/security/transport regression, launch/certification guards, full lint/typecheck/webpack build; verify all protected counts/hashes and baseline preservation.
- [x] Independent review and regression fixes; prepare verified commit and separate draft-PR delivery. Integration policy: push this engineering branch, draft against Batch04 and check new CI once; no waiting for completion.

Review focus: financing payments below interest; capped final payments; terminal principal once; negative sale equity; NOI excludes financing/capex/reserves; reserves returned once; ROI denominator includes injected cash; matched period lengths; supplied-budget outcomes not underwriting; replay sources/versions/unknown fields; browser stale exports and history detachment.
