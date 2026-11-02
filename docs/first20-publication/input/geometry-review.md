# Bounded geometry review — PR 1520

Baseline `af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5`. Twenty selected exact candidates in IDs 255–280. No canonical approval, certification or publication is inferred.

One demonstrated software gap: **268 Polygon Area** accepts `sides=3, side=1e154`, but the current multiplication order produces Infinity and the wrapper throws even though the mathematical result is finite (approximately `4.330127018922195e307`). Reproduced using the pinned expression in Node; no end-to-end application execution.

All candidates remain full-scope-unapproved with QA/source gaps. Existing live/“certified” metadata cannot clear those blockers. Missing alternate modes, unit selectors, extra outputs or positive-only dimensions are scope questions until requirements establish them.

## Observed contracts

Every engine is v1 with required finite numeric fields and `{result}` output. Dimension fields allow zero unless noted. Bottom helpers apply field constraints and reject nonfinite outputs; geometry has no extra cross-field refinement. No explicit rounding is applied.

| ID | Candidate | Formula | Inputs | Scope note |
|---|---|---|---|---|
| 255 | Hypotenuse Calculator | √(a² + b²) | a ≥0, b ≥0 | Right-triangle hypotenuse only; Math.hypot avoids naive squaring overflow. |
| 256 | Triangle Area Calculator | base × height / 2 | base ≥0, height ≥0 | Base and perpendicular height only; retries multiplication after halving base if direct result nonfinite. |
| 259 | Rectangle Area Calculator | length × width | length ≥0, width ≥0 | Length × width only. |
| 260 | Rectangle Perimeter Calculator | 2(length + width) | length ≥0, width ≥0 | Perimeter from length and width only. |
| 261 | Square Area Calculator | side² | side ≥0 | Side squared only. |
| 262 | Square Perimeter Calculator | 4 × side | side ≥0 | Four times side only. |
| 263 | Circle Area Calculator | πr² | radius ≥0 | Radius-to-area only; Math.PI precision. |
| 264 | Circle Circumference Calculator | 2πr | radius ≥0 | Radius-to-circumference only; Math.PI precision. |
| 265 | Circle Diameter Calculator | 2r | radius ≥0 | Radius-to-diameter only. |
| 266 | Parallelogram Area Calculator | base × height | base ≥0, height ≥0 | Base × perpendicular height only. |
| 267 | Trapezoid Area Calculator | (a + b) × h / 2 | a ≥0, b ≥0, height ≥0 | Both parallel sides and perpendicular height; fallback averages sides before multiplying when direct result nonfinite. |
| 268 | Polygon Area Calculator | n × s² / (4 × tan(π/n)) | sides integer ≥3, side ≥1e-09 | Regular polygon only; integer side count >=3; side >=1e-9; no arbitrary vertices or irregular polygon inference. Demonstrated finite-result false overflow. |
| 269 | Sphere Volume Calculator | 4πr³ / 3 | radius ≥0 | Sphere radius only; fallback recomputes cubic product if direct result is nonfinite or nonzero radius loses result to zero. |
| 270 | Sphere Surface Area Calculator | 4πr² | radius ≥0 | Sphere radius-to-total-surface-area only. |
| 271 | Cylinder Volume Calculator | πr²h | radius ≥0, height ≥0 | Cylinder radius and height; overflow/zero-loss fallback and zero-factor handling present. |
| 272 | Cone Volume Calculator | πr²h / 3 | radius ≥0, height ≥0 | Cone radius and perpendicular height; overflow/zero-loss fallback and zero-factor handling present. |
| 273 | Rectangular Prism Volume Calculator | length × width × height | length ≥0, width ≥0, height ≥0 | Three dimensions; fallback sorts factors after nonfinite or lost-zero direct result. |
| 278 | Pythagorean Theorem Calculator | c = √(a² + b²) | a ≥0, b ≥0 | Hypotenuse from two perpendicular legs only; no solve-for-any-side mode. |
| 279 | Degrees to Radians Calculator | degrees × π / 180 | degrees signed finite | Signed finite degrees to radians; overflow fallback divides before multiplying. |
| 280 | Radians to Degrees Calculator | radians × 180 / π | radians signed finite | Signed finite radians to degrees; overflow fallback divides before multiplying. |

## Conditional simplicity ranking

265, 262, 261, 259, 260, 266, 256, 255, 278, 264, 263, 270, 279, 280, 267, 273, 269, 271, 272, 268.

Starts with circle diameter, square perimeter, square area and rectangle area because their observed contracts have one/two inputs and direct arithmetic. Ends with regular polygon because its constraints/transcendental evaluation and demonstrated overflow require more work. This is an engineering estimate conditional on narrow observed scope approval.

## Shared blockers and source limits

- Exact candidate binding is not approved canonical ID/version association.
- Complete canonical feature/input/output/domain requirements and full Blueprint reconciliation remain unapproved.
- Zero/degenerate-dimension policy, compatible units and displayed result units, finite-range behavior, precision/rounding and alternate modes require explicit approved contract decisions.
- Runtime source is generic CalcuMint deterministic formula review; publisher/body/edition applicability and qualified review are not established by metadata.
- Independent numerical full-domain and browser acceptance remain unestablished; supplied readiness also leaves accessibility, performance, plan parity, authenticated history/scenarios/export and replay/tamper expectations unresolved.
- Live legacy route, published lifecycle, and certified codeReviewStatus do not establish full contract readiness.

Existing OpenStax Prealgebra 2e §9.6 capture supports rectangular solids, spheres, cylinders and cones as formula background for 269–273; it does not establish CalcuMint applicability, precision or canonical scope. Its extracted mathematical numerals sometimes repeat, so independent vectors must not copy malformed extraction. Existing NIST DLMF §4.14 is trigonometric background only; no direct polygon-area or all-geometry source coverage is claimed. No fresh full-cohort browsing was performed.

## Precise work

For launch-polygon-area-calculator v1, add independent high-magnitude finite-result regression for sides=3, side=1e154; implement overflow-safe factor ordering/scaling for declared regular-polygon formula while retaining rejection of truly unrepresentable results and ordinary-case precision. Inspect underflow and large-side-count boundaries narrowly. Preserve existing version/history policy; approve any required version change separately.

**After canonical identity/version and scope decision:** For each candidate, record approved exact fields, shape assumptions, degenerate-zero policy, compatible input units/result dimensions, range/precision/rounding, explicit error behavior, and required output keys; decide radius/diameter, arbitrary triangle/polygon, solve-for-missing-side or unit conversion modes before implementation tasks. Do not classify these absent modes as defects without the decision.

**After approved contract/source applicability:** Bind precise publisher/section/edition evidence, independent normal/boundary/error vectors and required browser acceptance to each approved version; implement only approved deltas. Use shared geometry harness where appropriate, but do not let a shared harness certify individual contracts.

Default examples derive expected values from the implementation; the imported independent golden corpus was not inspected in this bounded review. Full QA coverage therefore remains unestablished. See JSON for per-ID schemas, formulas and source paths.

## Narrow cylinder/cone follow-up

Exact complete pinned expressions were reproduced in Node. Cylinder 271 with radius `1e154`, height `1e-10` returns finite `3.141592653589793e298`; cone 272 with the same inputs returns finite `1.0471975511965978e298`; cone with radius `1e154`, height `1` returns finite `1.0471975511965977e308`. Their existing fallback branches recover these results after direct intermediate overflow. These witnesses demonstrate no software gap and justify no fix task. This remains bounded literal reproduction, not a full numerical audit.
