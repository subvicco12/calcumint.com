The private workbench now rejects serialized numeric digits that would change before calculation or snapshot verification. This repairs one shared caller defect across 29 existing private supplied profiles; it does not complete or certify 29 canonical calculators.

The affected IDs are 21, 32, 35, 36, 43, 46, 49, 80, 81, 82, 84, 85, 86, 88, 89, 90, 91, 96, 125, 126, 127, 133, 134, 468, 469, 470, 472, 488 and 516. Exact catalog titles and unchanged classifications are in [the bounded evidence packet](cohort-boundary-repair.json).

The governing native blueprint requires typed precision and validation (BP-0137), exact saved calculator identity and revision (BP-0549), reproducible saved inputs/results (BP-0550), and result/scenario/export agreement under the declared rounding policy (BP-0194). These paragraphs are retained in [native-paragraphs.txt](../blueprint-reconciliation/native-paragraphs.txt). Existing engineering profiles and their original restrictions continue to govern the available methods.

Previously, snapshot text containing calculatorVersion `1.0000000000000001` was parsed into revision `1` before verification. The unchanged validator consequently accepted this forged text for all 29 profiles. A fractional outer masterId `81.000000000000001` similarly became `81`. Numeric scenario values such as `9007199254740993`, `0.10000000000000001` and `1e-400` could reach numeric engines after silently becoming different values. Decimal-string profiles already enforce their own schemas; this change does not claim that every profile accepted lossy numeric scenario quantities.

The component reuses the existing strict new-input parser for scenario calculation. A small new serialized snapshot scanner reuses the existing number-token validator before invoking the unchanged replay verifier. It retains the existing 8,000,000-character import limit independently of the 1,000,000-character new-input limit. Canonical legacy JSON snapshots, canonical subnormals such as `5e-324`, quoted exact decimal/rational quantities, and valid snapshots between 2 and 8 MB remain supported. The scanner adds no nesting limit and does not change any engine formula, registry, legacy parsed-object replay API, history format, entitlement, SQL or publication gate.

Verification reproduced 32 failures before the repair, then passed 97 new DOM/numerical regressions, 44 existing workbench regressions and 34 existing parser regressions. All 29 profiles also compare actual-engine mathematical artifacts (input, output, slug and technical revision) across Free, Pro and Business after the new strict input parser, as required by BP-0676. The real Chromium loopback run exercises all 29 actual JSON downloads, rendered-output parity, canonical replay, forged-revision rejection and recovery. The independent numerical fixture `100 × 1.1 + 10 = 120` survives save and restore. The [browser receipt](cohort-browser-report.json) records the bounded checks.

Reproduce from the repository root:

```sh
node_modules/.bin/vitest run --config tests/calculator-sprint-20261108/cohort.vitest.config.ts
node_modules/.bin/vitest run src/components/final-private-workbench.test.tsx src/calculators/final-private-workbench.test.ts src/lib/publication-factory-contracts-input.test.ts
COHORT_BROWSER_REPORT=/tmp/calculator-sprint-cohort-browser-report.json node tests/calculator-sprint-20261108/cohort-browser.mjs
```

The browser runner reuses the existing authenticated loopback preview, the existing bounded CDP browser helper and CHROMIUM_PATH support, and reads the actual bound port. Run preview consumers sequentially: the installed Vite runtime can resolve requested port0 to its default5173. Its receipt defaults to `/tmp`, so repeated verification does not modify tracked evidence. Browser interaction is synthetic local review, not production authentication, account persistence, full Final UI acceptance or live/public acceptance. Existing per-ID authority, jurisdiction, source-version, mathematical completeness and qualified-review gaps remain open; inventory counts remain unchanged.
