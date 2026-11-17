# Geometry engineering evidence — HOLD

Baseline: eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8. These changes supply private capture, inverse replay, and explicit graph samples. They do not establish full product scope, canonical acceptance, certification, release eligibility, adoption, or production authorization. All twelve canonical dispositions remain PARTIALLY_IMPLEMENTED. No historical engine, shared registry, or UI is modified in this lane.

The exact catalog identities below were checked in `docs/calculator-first/authority-catalog.json` and `docs/milestone60-20261113/requirements-540.json`; none belongs to the baseline scoped-complete geometry cohort in `completion/math-next.ts`.

| ID | Exact source binding | Existing gap addressed | Remaining scope constraint |
| --- | --- | --- | --- |
| 254 | `advanced-math/catalog-batch-8.ts`: advanced-math.root-finder v1 | Immutable bracketed root capture, coefficient-d inverse with replay, graph gaps | Degree <=3 sign-changing polynomial bracket only; inverse may select another bracketed root and is then refused; no full arbitrary-function root finder |
| 257 | `geometry/catalog-completion.ts`: geometry.triangle v1 | SSS capture; solve side a from perimeter; replay and graph | SSS only; reverse area/angles and other triangle specification modes absent |
| 258 | same: geometry.right-triangle v1 | Leg capture; solve leg a from area | Positive perpendicular legs only; no all-mode right-triangle solver |
| 268 | `launch-portfolio.ts`: launch-polygon-area-calculator v1 | Regular polygon capture, side from area | Regular polygons only; arbitrary coordinate polygons absent |
| 272 | same: launch-cone-volume-calculator v1 | Cone volume capture, height from volume | Right circular cone, compatible units; zero radius inverse nonunique |
| 274 | `geometry/catalog-completion.ts`: geometry.surface-area v1 | Prism surface capture, height from surface area | Rectangular prisms only; general surface-area selector absent |
| 275 | same: geometry.volume v1 | Prism volume capture, height from volume | Rectangular prisms only; general volume selector absent |
| 276 | same: geometry.slope v2 | Exact coordinate schema capture; y2 from target slope | Vertical lines refused; historical rise/run v1 not rebound |
| 277 | same: geometry.distance v2 | Coordinate Euclidean-distance capture; y2 upper branch inverse | This definition is not in geometryCompletionDefinitions; launch distance is speed×time, so registered=false; private only until explicit identity integration |
| 278 | `launch-portfolio.ts`: launch-pythagorean-theorem-calculator v1 | Hypotenuse capture, leg a from hypotenuse | Nonnegative legs, fixed leg b; does not expose every solve mode |
| 279 | same: launch-degrees-to-radians-calculator v1 | Signed conversion capture and inverse | Binary64 angles, no periodic reduction |
| 280 | same: launch-radians-to-degrees-calculator v1 | Signed conversion capture and inverse | Binary64 angles, no periodic reduction |

Source paths in the table are relative to `src/calculators/`. Engine formula/source metadata are preserved as provenance, not upgraded into independent authority. The catalog's pro differentiation mentions reverse solve, graphing, and exports; this lane adds explicit inverse and graph paths to previously mature forward engines. Shared account/export integration belongs to the root lane.

The private adapter bounds nonzero input magnitudes to [1e-50,1e50], validates exact keys and historical schemas, rejects unresolved positive triangle geometry, rejects a root result whose bisection interval remains unconverged, and deeply freezes snapshot data. Bounds are disclosed numerical limitations; they are not a substitute for the full catalog scope. Degenerate inverse targets and replay mismatches are refused. The distance inverse explicitly selects y2 >= y1; zero horizontal separation still admits this documented branch. Graphs evaluate at most 101 supplied samples; refusals are explicit gaps.

Integration API: `geometryNext100Contracts`, `GeometryNext100Id`, `geometryNext100CaptureRevision`, `calculateGeometryNext100(id,input)`, `reverseGeometryNext100(id,input,target)`, `graphGeometryNext100(id,input,samples)`. Capture returns `snapshot`, `steps:[{expression,value}]`, `unit`, plus explicit scope and primary value. Reverse returns `solveFor,value,input,replay`. Root owns registry and workbench integration. All contracts have source defaults; distance advertises registered=false.

Validation: the focused Vitest file contains independent decimal witnesses, five exact Pythagorean integer families, Heron triangle (13,14,15) area 84, bigint prism product, signed coordinate/angle behavior, inverse replay, branch rejection, invalid domains, immutable nested arrays, strict keys, graph gaps, and a cube-root-of-two bisection witness. Tests show bounded engineering behavior, not canonical completion.

Recorded checks: focused Vitest 15/15 passed; repository `tsc --noEmit --pretty false` exited 0 after the final packet/default changes. No builds run. `authenticated-cases.json` supplies exact identity/version, input strings, primary scalar key and expected value for root-owned browser/authenticated workflow checks; those checks have not been run in this lane. `reused-source-witnesses.json` preserves existing independently derived literal vectors and original source metadata for 268/272/278/279/280. It is numerical corroboration, not new authority. The OpenStax/NIST capture paths mentioned by the earlier geometry review are absent from this checkout and inspected artifact tree, so their bodies were not re-read and no fresh source verification is claimed. Genuine publisher applicability, full-scope decisions, and root-owned product/auth/export acceptance remain blockers.
