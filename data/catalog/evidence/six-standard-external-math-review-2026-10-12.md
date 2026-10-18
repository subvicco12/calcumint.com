# Six standard-risk calculator external review — 2026-10-12

Evidence only. All six remain on HOLD; this file does not grant certification, catalog mapping, database publication, or release authority.

Governing master workbook: CalcuMint Master Calculator Catalog 2026, Master Catalog sheet. All six rows have Portfolio Status **Planned**. Repository fixture evidence: workflow 38282385458, commit b3e04ec6101d567139d2604c74422540b018f1b8. CI for that commit succeeded (38282385469).

| Master ID | Registry slug | External mathematical comparison | Catalog identity | Decision |
| --- | --- | --- | --- | --- |
| 235 | graphing-calculator | y=x² gives (-5,25),(0,0),(5,25); 81-point policy not independently established | Same title/domain, mapping unapproved | HOLD |
| 251 | function-plotter-2d | Same parabola checkpoint comparison; parser restrictions unreviewed | Same title/domain, mapping unapproved | HOLD |
| 275 | volume-calculator | 2×3×4 gives volume 24 and surface area 52; metadata omits V=lwh | Same title/domain, mapping unapproved | HOLD |
| 276 | slope-calculator | rise 6/run 3 gives 2; no dedicated golden fixture | Registry math vs master Geometry mismatch | HOLD |
| 282 | standard-deviation-calculator | population [1,2,3]: √(2/3) ≈ 0.816496580927726; sample case untested | Same title/domain, mapping unapproved | HOLD |
| 283 | variance-calculator | population [1,2,3]: 2/3; sample case untested | Same title/domain, mapping unapproved | HOLD |

External mathematical references (not proof of identity or approval):
- Quadratic functions: https://openstax.org/books/college-algebra-2e/pages/5-1-quadratic-functions
- Rectangular solids: https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area
- Population/sample variance and standard deviation: https://openstax.org/books/introductory-statistics/pages/2-7-measures-of-the-spread-of-the-data
- Slope rise/run: https://openstax.org/books/college-algebra/pages/4-1-linear-functions

Review required before any identity approval: source-backed mapping to each exact master row, plus explicit Slope category/domain decision. Engineering follow-ups: volume formula metadata; slope golden fixture; sample-mode and invalid-domain tests; graphing parser and sampling coverage. Do not silently update registry categories or publication lifecycle.

## Engineering evidence addendum — 2026-10-12

The original table above is a historical snapshot and its gaps have been partially addressed without changing the HOLD decisions:

- `geometry.volume`: rectangular-prism formula metadata now explicitly includes `V=lwh` alongside surface area; commit `edae1a460441d49d34adbeb6793c9d747e6c6cde`.
- `launch-slope-calculator`: two golden fixtures now cover positive and negative slopes; commit `7809f1f478e1da2d110717a93ff09eae051125bb`.
- `statistics.standard-deviation` and `statistics.variance`: sample [1,2,3] is asserted to give sample variance 1 and standard deviation 1, and singleton samples are rejected; commit `5507b6276de21de34bd024ba6cdc022c7f986454`.
- `advanced-math.graphing` and `advanced-math.function-plotter-2d`: endpoint/midpoint 81-point checks, malformed parser input, invalid domain, and insufficient finite samples are covered; commit `5507b6276de21de34bd024ba6cdc022c7f986454`. Expression-engine hostile-syntax and numeric boundary tests added in `024351a81c04b27e8d1cfd904b091eb073dd9b17`.
- Slope collision analysis: the active registry maps `slope-calculator` to `launch-slope-calculator` (Math, rise/run); an unregistered `geometry.slope` definition uses the same slug with a coordinate-point contract. See `slope-identity-disposition-2026-10-12.md`. No duplicate active slug was introduced.
- Validation: full CI run `38287330926` **SUCCESS**; offline reconciliation run `38287330914` **SUCCESS** on commit `024351a81c04b27e8d1cfd904b091eb073dd9b17`. CI includes production build; no deployment occurred.

**Unresolved for all six:** exact Master Catalog identity approval and authoritative external-source provenance in each calculator's source metadata. The external textbook links above support selected mathematical formulas, not parser policy, complete engine correctness, or catalog identity. Master workbook status remains Planned; publication and mapping decisions remain HOLD. No YMYL or other certification gates are waived.
