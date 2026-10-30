# Batch09 independent engineering review

Reviewed the additive Batch09 working-tree changes against baseline `bd0433f970819ed113553a5e71b6827d838f662b`: all 51 remaining private contract implementations, strict inputs/outputs, engine/helper and source bindings, exports/replay, 540-row reconciliation, private UI/history/scenarios, browser harness and additive CI step. RELEASE HOLD remains active.

## Findings and disposition

No outstanding Critical or Important findings in the inspected code. Ready for code freeze and the implementer's browser/full verification campaigns, subject to preserving the reviewed bytes and regenerating machine artifacts after any further source change.

One Important numerical-range defect was independently demonstrated RED: positive electricity cost (#477), dividend yield (#74) and commission (#119) inputs could disappear to reported zero through binary underflow. Three saved independent regressions failed before the fix. The implementer added wrapper preflight checks using existing finite multiply/divide helpers, including related raw percentage/tip/discount paths. The regressions now pass, genuine zeros remain valid, and original engines and intentional display rounding are unchanged. Additional author regressions reject raw CAGR/Fisher cancellation while preserving actual equality.

An intermediate manifest freshness check failed after source edits. The implementer regenerated the artifacts; the final independent `--check` succeeded for manifest JSON, discovery JSON and CSV.

## Numerical and contract review

`src/calculators/remaining-contracts-independent.test.ts` contains 68 tests, including individually derived literal actual-engine witnesses for every one of the 51 selected identities. Coverage includes nonzero effective versus nominal monthly returns, end/beginning contribution timing, Fisher inflation adjustment, negative returns and cashflows, weighted DCA, ROI costs/income, caller-bracketed multiple periodic roots, bond present value, signed income gaps, discounts, supplied salary hours, EV/fuel comparisons, cash-only ownership accounting, nonzero-altitude pressure and supplied gross MET arithmetic.

The calendar contract explicitly counts both selected first and target payment dates, permits one aligned payment, restores the original day after short months or follows caller-selected month end, and validates Gregorian/leap dates. Its first payment follows one modeled interest period; it does not infer origination dates, business days or daily accrual. Independent nonzero-interest and leap/EOM witnesses pass.

Bond yield uses caller-supplied equally spaced cashflows and a selected sign-changing bracket. Tests confirm distinct roots can be selected; no coupon, accrued-interest, day-count, uniqueness or annualization rule is inferred. TCO uses explicit cash-purchase scope, disjoint operating costs and resale once; financing is excluded. Retirement, accounting, clinical and physical calculations retain supplied-input and source-applicability limitations rather than claiming full original products.

Strict named scenario inputs and detail/output schemas reject undeclared fields. Actual dependency/helper traces are retained. Exported envelopes are deeply copied/frozen and replay recomputes the entire selected identity, methodology, source binding, dependencies, inputs and outputs. `sourceVersion: 1` is explicitly the private helper binding format, not a publisher or external normative version. Source snapshot tree binding matches the prior inspected Batch08 manifest, and all three helper-file SHA256 values match current preserved bytes.

## Verification performed

- Final selected independent/author contract, inventory and UI suites: 135 tests passed across four files.
- Independent numerical test file lint: passed.
- Final offline machine-artifact `--check`: passed.
- Inventory: 540 authoritative identities and 574 registered definitions; 305 registered-backed, 192 bounded private scopes, zero component-only, 43 contract-blocked, zero currently proven missing engines. Canonical mappings approved remain zero. Publication/protected certification remain UNKNOWN.
- All 43 blocked identities remain blocked, including #9, #19/#20, #198/#199 and #442. New private definitions do not add public registry aliases or rewrite existing engines/history.
- Read-only UI/harness inspection confirms labeled controls, stale-result/export clearing, detached tab-local history, verified restore/import, protected fixture/module/manifest probes and a 51 × 3 plans × 2 widths browser matrix with real downloads and replay. The browser campaign and full checks had not been independently executed in this review; the implementer will run them after freeze.

## Limits

This is independent supplied-contract engineering review, not canonical product completion, fresh external-source research, normative applicability acceptance, clinical/tax/provider approval, subscription-provider acceptance, certification or publication authority. Baseline CI terminal success is attributed to the user-supplied result. No prior broad QA, production connection, deployment, payment or lifecycle action was repeated or authorized. RELEASE HOLD remains in effect.
