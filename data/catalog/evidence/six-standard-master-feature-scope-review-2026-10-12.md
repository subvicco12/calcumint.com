# Six calculator Master Catalog scope review — 2026-10-12

**Source of authority:** supplied `CalcuMint_Master_Calculator_Catalog_2026 (1).xlsx`, worksheet `Master Catalog`, IDs 235, 251, 275, 276, 282, 283. This document records source-derived fields separately from engineering inferences. **All six remain HOLD; no approval or publication authorization.**

## Exact master-row scope

| ID | Master calculator / domain | Family; level | Free visualization | Pro differentiation | Certification / status |
| --- | --- | --- | --- | --- | --- |
| 235 | Graphing Calculator / Advanced Math & Graphing | Math / solver; B — Analytical | Steps/graph when useful | Advanced steps; reverse solve; graphing; exports | Required before publish; Planned |
| 251 | 2D Function Plotter / Advanced Math & Graphing | Math / solver; A — Essential | Steps/graph when useful | Advanced steps; reverse solve; graphing; exports | Required before publish; Planned |
| 275 | Volume Calculator / Geometry | Math / solver; A — Essential | Steps/graph when useful | Advanced steps; reverse solve; graphing; exports | Required before publish; Planned |
| 276 | Slope Calculator / Geometry | Math / solver; A — Essential | Steps/graph when useful | Advanced steps; reverse solve; graphing; exports | Required before publish; Planned |
| 282 | Standard Deviation Calculator / Statistics & Probability | Distribution / statistics; B — Analytical | Distribution/summary visual | Detailed dataset outputs; advanced statistics; exports | Required before publish; Planned |
| 283 | Variance Calculator / Statistics & Probability | Distribution / statistics; B — Analytical | Distribution/summary visual | Detailed dataset outputs; advanced statistics; exports | Required before publish; Planned |

All six rows also specify `Full certified core calculation` as Free Core, `Pro analytics + team/client/embed/API/automation` as Business differentiation, and `Formula verified after certification` as customer trust label.

## Source-derived limitations versus engineering inference

The master rows **do not specify** a canonical engine ID, public slug, exact graph parser grammar, 81-point sampling count, number of supported 3D solids, choice between rise/run and two-coordinate-point slope inputs, sample/population defaults, numerical tolerance, or explicit approval of the current registry definitions. Do not infer these from shared title or domain.

Engineering candidates are described in `six-standard-source-provenance-and-identity-decision-2026-10-12.md`. The two graphing candidates share an engine but differ in master presentation level. The two statistics candidates require a distribution/summary visual, which is not established by numeric engine tests. Volume's master row does not limit the product to rectangular prisms. Slope's master Geometry domain conflicts with the active Math rise/run implementation, while the unregistered Geometry coordinate implementation has the same slug.

## Decision requests (not decisions)

1. **235 and 251:** confirm distinct UX/presentation contracts (B Analytical versus A Essential), expected graph visualization, supported expression syntax and graphing policy.
2. **275:** confirm required shapes, units, result labels, and visualization.
3. **276:** choose the intended slope input/output contract; explicitly resolve category and public slug without registering a duplicate.
4. **282 and 283:** confirm population/sample behavior, visual summary, precision and dataset limits.
5. **All six:** approve authoritative identity mapping against exact master ID and code SHA; independently review applicable mathematical references, feature scope, certification and database publication lifecycle.

The current code-level `reviewStatus:"certified"` is not a substitute for master-required certification or authoritative production database publication. Preserve Free/Pro/Business mathematical accuracy parity.
