# Six standard calculators — independent provenance and catalog identity decision packet

Status: **HOLD for all six**. This is an evidence and proposed-decision packet, not a certification, master-catalog amendment, publication approval, or deployment authorization.

## Provenance layers and limitations

1. **Master identity**: Master Catalog IDs, names and domains below come from the CalcuMint Master Calculator Catalog 2026, Master Catalog sheet, as recorded in the repository's reviewed identity ledger. All six have portfolio status Planned.
2. **Implementation**: Registry IDs, slugs, categories, formulas and fixtures come from current source definitions and repository regression evidence. An implementation matching a textbook example is not an independent audit of the whole engine.
3. **External mathematical reference**: OpenStax textbook sections below are independent explanatory references for standard mathematical concepts, not CalcuMint-specific certification or evidence of catalog intent. Exact applicability, attribution and link reachability must be rechecked by the approving reviewer. They do not establish parser syntax, point count, error-handling policy or data publication authority.
4. **Operational evidence**: CI #38287330926 and offline evidence #38287330914 succeeded on exact commit `024351a81c04b27e8d1cfd904b091eb073dd9b17`. Subsequent commits require their own checks.

| Master ID / domain | Registry ID / slug | Independently reviewable mathematical reference | Proposed identity disposition | Approval |
| --- | --- | --- | --- | --- |
| 235 / Advanced Math & Graphing | `advanced-math.graphing` / `graphing-calculator` | [OpenStax College Algebra 2e §5.1](https://openstax.org/books/college-algebra-2e/pages/5-1-quadratic-functions), parabola `y=x²` | Candidate title/domain alignment; validate master input/output scope, restricted parser and 81-sample policy | HOLD |
| 251 / Advanced Math & Graphing | `advanced-math.function-plotter-2d` / `function-plotter-2d` | [OpenStax College Algebra 2e §5.1](https://openstax.org/books/college-algebra-2e/pages/5-1-quadratic-functions), parabola `y=x²` | Candidate title/domain alignment; distinguish 2D plotter feature contract from Graphing despite shared implementation | HOLD |
| 275 / Geometry | `geometry.volume` / `volume-calculator` | [OpenStax Prealgebra 2e §9.6](https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area), rectangular-prism `V=lwh` | Candidate title/domain alignment; confirm whether master requires additional solids beyond current rectangular prism | HOLD |
| 276 / Geometry | active `launch-slope-calculator` / `slope-calculator` (Math); inactive `geometry.slope` (Geometry) same slug | [OpenStax College Algebra §4.1](https://openstax.org/books/college-algebra/pages/4-1-linear-functions), slope as rise/run or coordinate differences | **Ambiguous**: owner/reviewer must choose rise/run versus coordinate-point contract. Do not register inactive definition under colliding slug | HOLD |
| 282 / Statistics & Probability | `statistics.standard-deviation` / `standard-deviation-calculator` | [OpenStax Introductory Statistics §2.7](https://openstax.org/books/introductory-statistics/pages/2-7-measures-of-the-spread-of-the-data), population and sample standard deviation | Candidate title/domain alignment; confirm sample/population UX and precision contract | HOLD |
| 283 / Statistics & Probability | `statistics.variance` / `variance-calculator` | [OpenStax Introductory Statistics §2.7](https://openstax.org/books/introductory-statistics/pages/2-7-measures-of-the-spread-of-the-data), population and sample variance | Candidate title/domain alignment; confirm sample/population UX and precision contract | HOLD |

## Engineering evidence

- Graphing and plotter: `src/calculators/advanced-math/catalog-batch-10.ts`, `src/calculators/advanced-math/expression-engine.ts`, `src/calculators/six-standard-boundary-regression.test.ts`, and `src/calculators/advanced-math/expression-engine.test.ts`.
- Volume and inactive coordinate Slope: `src/calculators/geometry/catalog-completion.ts`.
- Active rise/run Slope: `src/calculators/launch-portfolio.ts`; registry inclusion in `src/calculators/registry.ts`.
- Dispersion: `src/calculators/statistics/catalog-batch-1.ts`; sample-mode regression in `src/calculators/six-standard-boundary-regression.test.ts`.
- Catalog conflict disposition: `data/catalog/evidence/slope-identity-disposition-2026-10-12.md`.

## Required decision and release gates

For each Master ID, obtain an explicit reviewer-recorded decision on exact input/output scope, calculator identity, intended category, formula provenance, supported edge cases and any UI requirements. For Slope specifically, approve one authoritative contract and a no-collision slug migration plan if the coordinate implementation is chosen. Record reviewer, date, exact registry commit and rationale in the identity ledger before changing identity status. Revalidate CI and certification gates on the resulting exact head; independently complete authoritative database lifecycle and publication approval. A `reviewStatus:"certified"` code flag does **not** confer production publication authority.

**No automatic approval** is inferred from these sources, tests, CI or this packet. All six remain HOLD.
