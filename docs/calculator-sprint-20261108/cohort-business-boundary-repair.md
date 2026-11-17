The catalog business review now reuses the reviewed serialized-input boundaries for 36 existing private supplied business profiles. It rejects numeric precision loss before engine schema validation or snapshot replay. This completes one additional bounded caller repair, not 36 full canonical products.

The IDs are 139, 140, 141, 142, 143, 144, 148, 149, 151, 152, 153, 164, 165, 166, 167, 169, 171, 174, 175, 176, 178, 180, 182, 183, 185, 186, 187, 188, 189, 190, 192, 193, 196, 197, 202 and 207. Titles, actual profile IDs, unchanged classifications and source hashes are recorded in [the evidence packet](cohort-business-boundary-repair.json). This cohort is disjoint from the earlier 29-profile workbench repair.

The governing native blueprint requirements remain typed precision and validation (BP-0137), exact saved identity and technical revision (BP-0549), reproducible saved input/result snapshots (BP-0550), result/scenario/export reconciliation (BP-0194), and mathematical parity across plans (BP-0676). The original business profile definitions, dependency runs, source restrictions and applicability limitations remain authoritative for the offered private scopes.

Before repair, all 36 snapshot import paths accepted raw calculatorVersion `1.0000000000000001` because JSON.parse erased the extra digits before the existing replay validator. Raw identity `139.000000000000001` similarly became `139`; fresh money `1e-400` and `0.10000000000000001` changed before validation; integer membership `5.0000000000000001` became the valid integer `5`. The new tests reproduced 40 failures before the component change.

The component now calls the existing strict new-input parser and the already reviewed serialized snapshot scanner. No helper, engine, formula, registry or source qualification changed. The existing 1,000,000-character new-scenario limit and 8,000,000-character snapshot limit remain separate. Canonical snapshots for all 36 profiles, canonical subnormal `5e-324`, and a valid 2.1 MB padded snapshot continue to replay.

Verification passed 116 new business regressions, the unchanged 97 workbench regressions, and 135 existing business engine/component regressions. Each of the 36 new plan tests compares actual engine calculation input, output, slug and revision across Free, Pro and Business after strict parsing. The actual Chromium runner exercises 36 native JSON downloads, checks their output against the rendered result, restores canonical snapshots, rejects forged revisions, and recovers unchanged results. Its [receipt](cohort-business-browser-report.json) records the actual profile identity and technical revision observed in each downloaded artifact. The independent fixture `(100 - 70) / 100 × 100 = 30` survives save and restore.

Reproduce from the repository root:

```sh
node_modules/.bin/vitest run --config tests/calculator-sprint-20261108/cohort.vitest.config.ts
node_modules/.bin/vitest run src/components/catalog-engineering-review.test.tsx src/calculators/business-contracts.test.ts src/calculators/business-contracts-independent.test.ts
COHORT_BUSINESS_BROWSER_REPORT=/tmp/calculator-sprint-cohort-business-browser-report.json node tests/calculator-sprint-20261108/cohort-business-browser.mjs
```

The browser runner reuses the existing authenticated loopback preview, ephemeral ports, bounded CDP helper and CHROMIUM_PATH support. It performs no production writes, external browser requests or account persistence. Full canonical mathematical completeness, source qualification, certification, publication and jurisdiction/applicability acceptance remain unproven; existing inventory classifications are unchanged.
