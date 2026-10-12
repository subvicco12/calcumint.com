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
