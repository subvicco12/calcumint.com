# Lane A: private calculus result recovery

Baseline: b96b1ac. Related catalog IDs: 246, 247, 248. This is a private presentation successor using the existing revision 2 and revision 3 engines and artifacts. It adds no mathematical engine, mapping, source authority, canonical acceptance, certification or publication permission. RELEASE HOLD remains active.

## Demonstrated defects and resulting behavior

Actual-engine component regressions first failed on the baseline UI: malformed/unsupported imports deleted the current verified result and its export/history actions; editing an expression discarded the only verified artifact. The successor validates imports before committing state. Changed inputs move the latest verified artifact into a clearly labeled previous-result section. Failed evaluations retain it. Users can restore its original inputs, save it to history, or export its original artifact subject to existing plan entitlements. A stale result never appears as the current primary answer or becomes a comparison scenario.

The calculation controls now use a native form. Enter submits from input fields, successful calculation/restoration focuses the announced result, and failures focus an alert. Repeated identical failures use a separate attempt counter so batched React state cannot suppress the focus transition. History/export/import controls remain outside the calculation form; the example button has explicit non-submit type.

Discovery: the existing authenticated loopback developer catalog links `/tests/calculus-recovery-workbench/`. The original source-bound component and original fixture/browser expectations remain byte-for-byte unchanged.

## Verification

- Initial recovery regression: 5 failures reproduced on the original actual-engine component before implementation.
- Repeated-identical-error regression: 8 passed / 1 failed before adding the error-attempt counter.
- Focused final suite: 6 files / 77 tests passed, including 9 recovery component tests and unchanged exact calculus/workflow/history suites.
- ESLint passed for all new presentation/tests and the catalog discovery entry.
- `python3 scripts/reconcile-canonical-calculus.py --check` passed, preserving the original exact source binding, 540 identities, and 43 authority blockers.
- `node tests/calculus-recovery-workbench/browser.mjs` passed 6 trusted-keyboard journeys across 320/1280 widths and Free/Pro/Business, plus revision 2 immutable export and catalog discovery. See adjacent browser receipt. Earlier driver-only failures (missing CR text on Enter and selector quoting) were corrected before the final passing run.

## Limits

This closes private calculus presentation/recovery defects only. Mathematical/operator scope, exact rational resource budgets, analytic binary64 limitations, local-only history, synthetic plans and authority blockers remain as documented by the unchanged engines. It does not establish authenticated account/RLS or production-provider acceptance. Aggregate repository tests, production build and hosted CI are owned by the integrating lane.
