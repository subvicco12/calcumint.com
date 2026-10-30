# Batch08 independent engineering review

Baseline inspected: `5a6f2311bde292ac0c3799c01eb3bb316522f426`. Review covers the current additive Batch08 component contracts, independent/author tests, reconciliation changes and generated artifacts, private discovery/UI/history/import/export, browser harness and additive CI step. RELEASE HOLD remains active.

## Findings

No outstanding Critical or Important findings in the inspected changes.

An Important immutable-export defect was independently reproduced RED: the initial export exposed mutable methodology/dependency metadata and shared source/formula references. The implementer corrected it with a detached deeply frozen complete envelope. The independent regression now passes. No historical engine was edited or frozen by this fix.

Two minor presentation observations remain at review time:

- The UI renders null as `Undefined for zero base`. ID33 also returns null when monthly savings are zero or negative, without requiring a zero base. Use a neutral undefined-result label or explain the absence of positive monthly savings.
- The browser report limitation says `Free/Pro/Component`; its actual matrix correctly selects Free/Pro/Business.

## Independent numerical evidence

`src/calculators/component-contracts-independent.test.ts` contains 34 tests, including separately derived actual-engine witnesses for every one of the 25 selected identities and six direct underlying-engine witnesses. Examples include nonzero nominal monthly interest, final partial payment caps, inverse principal/DTI, refinance lifetime savings versus cashflow break-even, snowball versus avalanche budget rollover, supplied down payment, pound-to-gram mass and US volume conversion. Negative/boundary checks cover subclosure principals, nonrepresentable small rates, nonamortizing payments, zero income, undeclared strategy, missing calendar scope and replay identity forgery.

The new contracts retain existing monthly interest order, rounding, closure thresholds and horizons. Conversion units are explicitly named; mass is not force, and kitchen volume does not imply ingredient density. ID25 remains component-only. Strict inputs and closed output schemas reject undeclared fields; whole-envelope recomputation binds selected private identity, methodology, dependency version, input and output. Exported snapshots detach and freeze calculation and metadata.

## Verification performed

- Focused component, independent component, inventory and UI suites: 72 tests passed.
- Independent test file lint: passed.
- Offline manifest generator `--check`: passed, reproducing manifest JSON, discovery JSON and CSV exactly.
- Counts: 540 authoritative identities, 574 registry definitions; 305 registered-backed, 141 bounded private, 51 component-only, 43 contract-blocked, zero currently proven missing engines. Canonical mappings approved remain zero; current publication/protected certification remain UNKNOWN.
- Read-only UI/harness inspection confirms stale calculation invalidation, detached tab-local history, verified snapshot restoration, labeled controls, private authenticated fixture checks and a planned 25 × 3 plans × 2 widths browser matrix. The actual browser campaign was running during this review and was not independently rerun.

## Limits

This is repository engineering and supplied-contract review, not canonical product acceptance, fresh external-source applicability verification, specialist approval, provider/subscription acceptance, certification or publication authorization. Baseline CI success is explicitly attributed to the user-supplied terminal result in the generated manifest. Broad prior QA and current hosted CI were not repeated. No public registry alias, production route, account write or lifecycle authorization is introduced by the inspected changes.

Author follow-up: both wording observations were corrected. Refinance null state has a dedicated RED→GREEN UI regression; browser limitations name Free/Pro/Business. Closed complete output schemas are also included in the new manifest.

Author final boundary follow-up: a separate literal RED→GREEN test rejects high-rate/long-term annuity denominators rounded to one, incomplete schedules and zero-displayed-payment schedules. This adds private rejection guards while preserving historical source bytes. Final focused run:78 tests passed.
