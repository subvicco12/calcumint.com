# 276 — Slope: complete proposed contract

Baseline `geometry.slope@2`, slug `slope-calculator`; PR1519 `7cdffeed3d5a8789689aa5495277e28b780227dc`. Proposal draft-20261102.1. **PENDING, not canonical approval. RELEASE HOLD.**

This document includes the complete domain proposal and shared full-product requirements. Input source facts are not approval questions. Existing historical versions remain immutable; any material expanded implementation requires a controlled successor technical revision.

# 276 — Slope Calculator: proposed complete contract

Status: **PROPOSED_COMPLETE_PRODUCT_CONTRACT_OWNER_PENDING**. No approval, certification or publication. Candidate `geometry.slope@2`; commit `7cdffeed3d5a8789689aa5495277e28b780227dc`; engine blob `806c3f2358e3fdd556d3f286cf8ae5ae109a3deb`. The complete proposed behavior requires a controlled new immutable technical revision; existing revision snapshots remain unchanged.

## Scope and authority

{
  "authority": "RECOMMENDATION bounded complete product proposal",
  "supportedModes": [
    "two_points (Simple default)",
    "rise_run (explicit new calculation mode, never historical v1 migration)",
    "point_slope",
    "slope_intercept",
    "general_line Ax+By=C"
  ],
  "notClaimed": "No multi-point regression, derivative of nonlinear function, land surveying/design compliance or arbitrary expression solver. These are separate tools; proposed scope choice is pending, and mandatory Blueprint analytics/workflows are retained."
}

Authority separates Blueprint mandates, mathematical source facts and product recommendations. Current code status is bounded evidence, not acceptance. All common workflows remain mandatory for this ID.

## sources

```json
[
  {
    "sourceId": "openstax-slope",
    "url": "https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line",
    "publisher": "OpenStax / Rice University",
    "editionRevision": "Elementary Algebra 2e; publication 2020-04-22; fetched page copyright 2026-06-29",
    "retrievedDate": "2026-11-01",
    "clause": "Elementary Algebra 2e §4.4: Find the Slope of Horizontal and Vertical Lines; Use the Slope Formula to find the Slope of a Line between Two Points",
    "establishes": "Two-point/rise-run slope and undefined vertical-line mathematics only",
    "operativePeriod": "Educational mathematical reference; no jurisdictional operative period imposed",
    "evidence": "first-six-20261101/geometry-evidence/openstax-slope.json",
    "coverage": "Full section returned, not search excerpt",
    "contentSha256": "d069edecdff59b68fb6ea88b4343e5342b0e09b42e669191575795318ddbb4d1",
    "hashScope": "Exact saved retrieval JSON bytes, not immutable publisher edition identifier",
    "localCitation": "/workspace/scratch/3ec853bd6442/first-six-closure/input/completed-research/qa-adjudication-1518/input1517/first-six-20261101/geometry-evidence/openstax-slope.json",
    "sourceReadable": true
  },
  {
    "sourceId": "bipm-full",
    "url": "https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-EN.pdf/2d2b50bf-f2b4-9661-f402-5f9d66e4b507?version=7.0&t=1780410776583&download=true",
    "publisher": "BIPM",
    "editionRevision": "9th edition v4.01 June 2026",
    "retrievedDate": "2026-11-01",
    "clause": "SI Brochure 9th edition v4.01 June 2026, §2.3.4 Derived units and §5.4.1 Quantity calculus",
    "establishes": "Coherent area/volume dimensions and quantity-value conventions; no mandate for this product unit selector",
    "operativePeriod": "Publisher current linked 2026 revision; not a local regulatory adoption determination",
    "evidence": "first-six-20261101/geometry-evidence/bipm-full.json",
    "coverage": "Entire English PDF parsed, 102/102 pages; parsed text retained, publisher PDF binary not retained",
    "contentSha256": "955028a44a01883bce2a91e6ba60480ee7a8722097c8025cfb83a7a09ab3ef59",
    "hashScope": "Exact saved retrieval JSON bytes, not immutable publisher edition identifier",
    "localCitation": "/workspace/scratch/3ec853bd6442/first-six-closure/input/completed-research/qa-adjudication-1518/input1517/first-six-20261101/geometry-evidence/bipm-full.json",
    "sourceReadable": true
  }
]
```

## inputContract

```json
{
  "authority": "RECOMMENDATION",
  "grammar": "Accept JSON finite real Number or UI decimal string matching [+-]?(digits(.digits*)?|.digits)([eE][+-]?digits)? after surrounding whitespace removal. Require at least one digit, reject empty, hexadecimal, separators, NaN/Infinity, booleans, null, objects, arrays, complex values and trailing junk. Locale input adapters must normalize explicitly and preserve original text.",
  "record": "Store original exact text, locale, normalized decimal text, unit IDs, mode, target, normalized binary64 values, field roles, input parser/version and source SHA. JSON number inputs retain the supplied lexical form when transport supports it; if not, mark lexical form unavailable and retain canonical roundtrip. Never invent exact text.",
  "classification": "Determine exact zero/equality/sign from normalized decimal rational values before lossy Number conversion. A nonzero real rounding to binary64 zero is numeric_out_of_envelope, never a geometric zero. Distinct decimal coordinates collapsing to equal Number are precision_required, never coincident.",
  "validation": "Unknown fields/modes/unit IDs rejected; missing input errors are field-specific. Hidden stale fields do not become active operands. Range failure is distinct from no mathematical solution."
}
```

## numericPolicy

```json
{
  "authority": "RECOMMENDATION",
  "notSourceMandated": true,
  "implementation": "Pure deterministic binary64 inside the explicitly tested envelope below; preflight exact decimal sign/equality/range checks are validation, not independent UI formula execution. Outside envelope return numeric_out_of_envelope or precision_required with preserved inputs, never clamp or silently change shape/classification. No promise current engine meets this policy.",
  "oracle": "Independent 100 decimal digit arithmetic from exact normalized decimal operands and independently defined high precision pi; oracle must not call production engine, use Math.PI as truth, or derive expected values by serializing actual outputs. Check conditioning, cancellation, scaled formulations, boundary neighbors and reverse-forward residuals.",
  "tolerance": "Proposed forward nonzero result relative error <=1e-11 against exact-decimal high precision oracle; exact zero/classification must match exactly. Inverse forward residual <=1e-11*abs(target), and inverse domain/uniqueness must hold; do not substitute a residual for parameter error when ill-conditioned. Expanded labels expose approximate binary64 digits, not an accuracy guarantee.",
  "display": "Proposed default 12 significant digits; expanded 15; decimal round-half-even formatting from canonical raw number; switch to scientific notation for nonzero abs<1e-6 or >=1e12. Carry unit and approximation marker. Display values never feed compute. These are product recommendations, not source-fixed digits.",
  "replay": "Preserve immutable result snapshots. Raw numeric serialization uses canonical max-roundtrip17digits (unique shortest roundtrip up to17 accepted if canonical spec fixed), sign of zero metadata, original exact inputs/unit IDs/mode and engine technical revision, sourceSHA, schema/parser/formatter versions. Never recompute a historical saved result to improve formatting. Full proposal requires controlled new technical revision; do not mutate geometry.slope@2 or geometry.volume@1 behavior.",
  "envelope": {
    "coordinatesAndCoefficients": "Normalized values abs<=1e12; nonzero abs>=1e-12; <=15 significant decimal digits. Coordinate deltas and generated point/intercept values satisfy these bounds where emitted. Slope/ratio abs<=1e24 and nonzero abs>=1e-24; all values finite normal binary64.",
    "conditioning": "For nonzero dx/dy require max(abs(endpoint axis values))/abs(delta)<=1e3; exact horizontal dy=0 and exact vertical dx=0 classified before this condition. General-line coefficients normalized by max(abs(A),abs(B)) before operations; nonzero coefficient ratios <=1e12. Reject computed intercept with cancellation ratio >1e3 as precision_required while preserving valid slope/point-slope result.",
    "boundary": "Outside proposed envelope is precision_required/numeric_out_of_envelope, not a false horizontal/vertical line. Proposed explicit envelope is a prospective policy choice; current v2 supports wider ±1e100 and must remain replayable."
  },
  "baselineDisplayEvidence": "input/packets/276.json boundedImplementation.displayFormatting: current renderer8 significant digits for abs<.01, else2 decimal places; git blobced3c075199b6e166661195afad525b8a2ebc174. Proposed12/15 formatting is a deliberate controlled display policy change, not current implementation."
}
```

## modeContracts

```json
[
  {
    "mode": "two_points",
    "inputs": "x1,y1,x2,y2 with x-axis and y-axis unit IDs",
    "equations": "dx=x2−x1; dy=y2−y1; if dx!=0 m=dy/dx; point-slope y−y1=m(x−x1); b=y1−m*x1; general line dy*x−dx*y=dy*x1−dx*y1",
    "domain": "If dx=0,dy!=0 vertical x=x1, slope undefined; if dx=dy=0 coincident/indeterminate, infinitely many lines through the point. Horizontal dy=0,dx!=0 m=0,y=y1. Neither vertical nor coincident is emitted as numeric Infinity/NaN.",
    "outputs": "m or typed status; dx,dy; direction; point-slope representation preferred; intercept b if numerically supported; general line for all unique lines; graph model plus exact selected endpoints",
    "authority": "SOURCE OpenStax §4.4 slope and horizontal/vertical; RECOMMENDATION line forms/classification schema"
  },
  {
    "mode": "rise_run",
    "inputs": "rise,run with y-axis/x-axis unit IDs; optional explicitly entered anchor x0,y0, otherwise no absolute line location",
    "equations": "m=rise/run; with anchor y−y0=m(x−x0)",
    "domain": "run=0,rise!=0 undefined vertical direction; rise=run=0 indeterminate direction; no anchor means slope/direction triangle only and no invented intercept",
    "authority": "SOURCE OpenStax §4.4; RECOMMENDATION mode/anchor workflow"
  },
  {
    "mode": "point_slope",
    "inputs": "x0,y0,m or explicit vertical orientation; finite m and matching ratio unit",
    "equations": "y−y0=m(x−x0); b=y0−m*x0; vertical x=x0",
    "domain": "A finite m defines a unique nonvertical line; vertical orientation has no finite m field. Reject contradictory active m/orientation.",
    "authority": "SOURCE §4.4 point-and-slope graphing; RECOMMENDATION explicit vertical UI"
  },
  {
    "mode": "slope_intercept",
    "inputs": "m,b; ratio unit and y-axis unit",
    "equations": "y=m*x+b",
    "domain": "Every finite m,b yields unique nonvertical line; vertical entered through general_line/point_slope, not Infinity.",
    "authority": "RECOMMENDATION algebraic representation derived from source slope"
  },
  {
    "mode": "general_line",
    "inputs": "A,B,C; coefficient numerical units defined against displayed x/y units so A*x and B*y carry same equation unit",
    "equations": "A*x+B*y=C; B!=0 ⇒ m=−A/B,b=C/B; B=0,A!=0 ⇒ x=C/A",
    "domain": "A=B=0,C=0 means all-plane identity, no unique line; A=B=0,C!=0 means empty solution set/no line. A=0,B!=0 horizontal. Classify exact zeros; do not epsilon-collapse nearzero coefficients.",
    "authority": "RECOMMENDATION algebraic extension, source applicability proof needed"
  }
]
```

## inverseTargets

```json
[
  {
    "target": "y2",
    "given": "x1,y1,x2,m",
    "formula": "y2=y1+m*(x2−x1)",
    "solutionSet": "Unique if x2!=x1. x2=x1 with finite target m yields no admissible two-point slope solution; do not accept a coincident point even though the cross-multiplied equation is zero."
  },
  {
    "target": "y1",
    "given": "x1,x2,y2,m",
    "formula": "y1=y2−m*(x2−x1)",
    "solutionSet": "Unique if x2!=x1; otherwise no admissible two-point slope solution."
  },
  {
    "target": "x2",
    "given": "x1,y1,y2,m",
    "formula": "x2=x1+(y2−y1)/m",
    "solutionSet": "m!=0 and dy!=0 unique; m!=0,dy=0 gives coincident x2=x1 and no admissible solution. m=0,dy!=0 no solution; m=0,dy=0 infinitely many x2≠x1 within envelope."
  },
  {
    "target": "x1",
    "given": "y1,x2,y2,m",
    "formula": "x1=x2−(y2−y1)/m",
    "solutionSet": "Same uniqueness/no-solution/infinite branches as x2, excluding x1=x2."
  },
  {
    "target": "rise",
    "given": "run,m",
    "formula": "rise=m*run",
    "solutionSet": "Unique only run!=0; run=0 gives no finite-slope directional solution."
  },
  {
    "target": "run",
    "given": "rise,m",
    "formula": "run=rise/m",
    "solutionSet": "m!=0,rise!=0 unique; m!=0,rise=0 no admissible nonzero run; m=0,rise!=0 no solution; m=rise=0 infinitely many run!=0."
  },
  {
    "target": "line_y",
    "given": "unique line and x",
    "formula": "point form y=y0+m*(x−x0), or (C−A*x)/B",
    "solutionSet": "Nonvertical unique y. Vertical x!=x0 no solution; x=x0 infinitely many y, bounded by declared graph/input envelope."
  },
  {
    "target": "line_x",
    "given": "unique line and y",
    "formula": "x=x0+(y−y0)/m or (C−B*y)/A",
    "solutionSet": "Nonhorizontal unique x. Horizontal y!=b no solution; y=b infinitely many x. Vertical unique x for all y."
  },
  {
    "target": "intercept_b",
    "given": "x0,y0,m",
    "formula": "b=y0−m*x0",
    "solutionSet": "Unique finite result when within numeric envelope; line remains valid if intercept requires wider precision."
  }
]
```

## inverseRules

```json
"One selected unknown only; all other required operands fixed. Return status unique/no_solution/infinitely_many/invalid_input/precision_required distinctly, never choose an arbitrary member of an infinite solution set. Verify unique two-point target by forward slope and all line targets by line residual plus domain exclusion. Analytic rearrangements are proposal, not currently implemented."
```

## acceptanceFixtureNotation

```json
"π expressions in expected values and inverse-target fixture inputs denote exact highprecision mathematical fixture notation. They are instantiated as highprecision oracle targets/normalized finite decimal transport values before execution; production UI grammar does not accept pi expressions in numeric fields. Expected tolerance references the exact decimal actually submitted. Every shape inverse target needs a generated positive-domain case in addition to listed worked examples."
```

## units

```json
{
  "authority": "SOURCE BIPM quantity calculus; RECOMMENDATION selectors",
  "axisUnits": [
    "unitless",
    "m",
    "cm",
    "mm",
    "km",
    "in",
    "ft",
    "s",
    "min",
    "h"
  ],
  "conversion": "Within each axis require one compatible dimension; normalize x1/x2 to selected x unit and y1/y2 to selected y unit before deltas. New full engine permits explicit per-coordinate unit conversion with recorded exact factor. in=0.0254m, ft=0.3048m; min=60s,h=3600s; metric powers exact. Conversion registry requires retained standard/reference adoption before release; BIPM source is not credited for all non-SI factors.",
  "slope": "Report y-unit/x-unit; only cancel dimensions/units after explicit normalization. x=m,y=cm ⇒ 100cm/m equals1m/m; preserve requested output ratio and converted dimensionless value as distinct labels. If x=time,y=length show velocity-like unit without angle/grade.",
  "angleGrade": "Proposed optional derived angle atan(m_normalized) in deg/rad and grade100*m_normalized percent only when both axes same physical dimension and normalized same unit. orientation angle in (−90°,90°), vertical ±90° orientation convention explicitly separate from undefined slope. This optional feature is RECOMMENDATION/PROOF_MISSING; never attach angle to m/s.",
  "axisScaling": "Graph displays actual axis units and aspect ratio; a visually steep line does not substitute for numeric slope."
}
```

## graphContract

```json
{
  "free": "Unique line clipped analytically to explicit finite viewport [xmin,xmax]×[ymin,ymax], including horizontal/vertical; selected endpoints marked, rise/run triangle when both deltas defined. Different endpoints order preserves same line. Coincident input shows one point and explains nonuniqueness; no invented line. Rise/run without anchor shows only local triangle.",
  "pro": "Pan/zoom/manual viewport, intercept toggles, exact engine-returned line sample table and comparison overlays. Viewport is presentation input and does not change authoritative slope.",
  "algorithm": "Certified geometry engine returns viewport intersection points and model coefficients/anchor, renderer draws those segments. Evaluate clipped endpoints in stable point form and validate residual. No 81-point function-grid inference or discontinuity heuristic required for a straight line. Offscreen endpoints remain in text table; no false empty-domain claim.",
  "accessibility": "Text states equation, slope status, points/deltas and viewport; coordinate table keyboard accessible; line/point/triangle distinguished by labels/style not only color.",
  "reconciliation": "Line passes supplied points to certified residual; graph dy/dx equals headline within numeric policy. Vertical graph remains a line while primaryResult is undefined slope."
}
```

## sensitivityContract

```json
{
  "variables": "two_points: x1,y1,x2,y2; rise_run: rise,run; point_slope: m,x0,y0; slope_intercept: m,b; general_line: A,B,C. Sweep one active variable with all others held fixed.",
  "output": "two_points/rise_run return slope/status; other line modes select slope or evaluated y at explicit probe x. Anchor/intercept sweep with fixed m correctly yields constant slope and changed line location; explain this.",
  "singularities": "When varying x hits x1 or general B hits zero, preserve undefined/indeterminate statuses and break chart segments. Coincident points never plotted as zero slope. No bridge through singularity.",
  "optionalDerivative": "Analytic sensitivities dm/dy2=1/dx,dm/dy1=−1/dx,dm/dx2=−dy/dx²,dm/dx1=dy/dx² may be shown only as independently certified metadata; required analysis uses forward engine sweeps."
}
```

## history

```json
"geometry.slope@1 is historical rise/run identity, not geometry.slope@2 coordinate input. Replay recorded snapshots strictly. No fabricated coordinates, implicit anchor, automatic upgrade, or recomputation with new line/unit model. New proposed modes require reviewed immutable revision and explicit user new calculation; a migration is separate review."
```

## structuredResult

```json
{
  "authority": "BLUEPRINT P179–211; RECOMMENDATION field details",
  "fields": [
    "identity{masterId,engineId,technicalRevision,sourceSHA,contractRevision}",
    "status: success|undefined_slope|indeterminate|no_solution|infinitely_many|invalid_input|precision_required|numeric_out_of_envelope",
    "primaryResult typed numeric quantity or classification, never NaN/Infinity",
    "metrics with IDs, dimensions/unit IDs and raw/display separation",
    "series/geometry model and domain clipping metadata",
    "detailedTable rows from certified engine output; no artificial time schedule",
    "reverseTargets with target dimension, fixed inputs, solution set and residual",
    "scenarioVariables and sensitivityVariables with domains and unit semantics",
    "assumptions, warnings, methodology, source clauses, reviewer metadata and contextual journey"
  ]
}
```

## fullWorkflowContract

```json
{
  "authority": "BLUEPRINT P286–405,406–591,697–734 and catalog row in input packet",
  "mandatory": true,
  "commonRootIntegration": "Consume root shared workflow contracts without reimplementing account, billing, entitlement, API or rendering infrastructure. Every workflow listed remains acceptance-required for this ID.",
  "free": "All accuracy-required parameters, shape/mode selectors, unit conversion, forward core, basic steps, useful basic visualization, classification/warnings and methodology. Proposed selected basic inverse: one endpoint y for Slope; rectangular-prism height for Volume. Locked previews must not hide required inputs or correctness.",
  "pro": "All declared reverse targets; advanced derivation/verification steps; chart controls and detailed tables; complete scenarios A/B/C; certified-engine sensitivity; expanded saved history/projects; CSV/JSON/PDF exports; grounded explanations. Quantitative limits follow root owner choice, not a new geometry-specific limit.",
  "business": "Pro plus team/client/project workspace ownership and roles; shared scenarios/templates; deterministic builder exposing only adopted modes and validation; branding/embed preserving trust; authenticated scoped API; bounded batch; signed retry-safe idempotent webhooks; quotas/metering/audit; optional transparent lead capture. No alternate formulas or extra accuracy.",
  "parity": "Same normalized accuracy-required input, engine/source revision and mode => identical raw authoritative result/warnings across Free/Pro/Business, web/API/embed/batch. Central server entitlement enforcement for protected actions; client plan state is never authority.",
  "persistence": "Retain exact identity, inputs, units/mode, assumptions and result snapshot; ACL ownership and RLS proof; history cannot silently change revisions. Scenarios preserve complete input sets and baseline; source changes create new runs.",
  "exports": "CSV typed columns and units plus formula/revision/source/assumption manifest; JSON lossless raw replay envelope; PDF same displayed values, graph/table descriptions and methodology. Verify owned record, plan and workspace on server; escape CSV formula-leading cells safely without altering raw JSON.",
  "ux": "Simple mode defaults shown visibly; Advanced exposes representations/analysis. Hero precedes explanations and upgrade prompts. Responsive portrait/landscape/desktop with no page overflow; labels, keyboard controls, focus/error announcements, semantic table and textual chart alternative, contrast and reduced motion.",
  "performance": "Proposed geometry domain budget: <=50ms p95 compute for single case and <=200ms p95 101-point sweep on declared reference device; measured cold/warm fixture with hardware recorded. Root owns page/network budgets and lazy loading; no claim these are tested.",
  "seoAndJourneys": "Canonical existing slug across plans; unique worked example/source/assumptions and meaningful related tools; discovery/indexability/trust badge gated by authoritative published lifecycle, never code reviewStatus.",
  "AI": "Only explain retained structured result and methodology; no competing numeric results. Required assumptions and safety interpretation free.",
  "release": "All15 base QA criteria in input/lifecycle-publication-prerequisites.json plus conditional applicability; exact identity/source-bound competent reviewer disposition; separate certification and publication. No default N/A for missing analytics/table/visualization."
}
```

## Feature trace and implementation status

| Feature | Authority | Current status | Proposed acceptance requirement | Bounded evidence |
|---|---|---|---|---|
| S276-FWD Coordinate forward slope | SOURCE OpenStax §4.4; BLUEPRINT core | PARTIAL | Source-fixed formula/deltas preserved; new typed vertical/coincident outcomes and precision guard without modifying immutable v2. | code/fetched-1.txt → src/calculators/geometry/catalog-completion.ts slopeCalculator@2 computes finite nonvertical slope; schema x1!==x2 rejects both vertical and coincident. Golden cases +2/−2 only. |
| S276-LINES All proposed representations | RECOMMENDATION, BLUEPRINT solver/graphing scope | MISSING | Implement five modeContracts and nine inverseTargets, explicit line equation and intercept domain semantics. | code/fetched-1.txt → src/calculators/geometry/catalog-completion.ts slopeCalculator has only x1,y1,x2,y2; no mode/line/inverse fields. |
| S276-UNITS Axis units and conditional angle/grade | SOURCE BIPM; RECOMMENDATION product units | MISSING | Implement units contract and do not assume unitless axes; angle/grade optional certified derivative only for normalized equal dimensions. | code/fetched-1.txt → src/calculators/geometry/catalog-completion.ts CoordinateOutput has no units; adapter  slopeWorkflowResult omits units. |
| S276-GRAPH Complete straight-line graph | BLUEPRINT P292, catalog graphing; SOURCE §4.4 graph a line | PARTIAL | Implement graphContract, including vertical/horizontal/coincident and clipped infinite line semantics. | code/fetched-3.txt → src/lib/batch21-six-calculators.ts slopeWorkflowResult emits selected-coordinates exactly two endpoints only; retained packet geometryCorePresentation supportedVisualizations=[]; no infinite-line engine. |
| S276-NUMERIC Certified numeric envelope | RECOMMENDATION; BLUEPRINT explicit precision | PROOF_MISSING | Adopt stated envelope/tolerance/oracle guard; preserve old wide-domain snapshots. | code/fetched-1.txt → src/calculators/geometry/catalog-completion.ts finite±1e100, no conditioning or nonzero underflow guard; input/packets/276.json numeric limitations. |
| S276-LEGACY Historical slope v1 isolation | BLUEPRINT immutability; packet history rule | PARTIAL | Preserve strict recorded-output v1 replay, no automatic coordinate migration. | input/packets/276-geometry-review.md historical rise/runv1 rule; adapter  sixScenarioMetadata only admits slope version2; complete migration/replay proof not fetched. |
| S276-STEPS Worked/advanced steps | BLUEPRINT P291–298; catalog Pro differentiation | PARTIAL | Basic substituted steps free. Advanced symbolic rearrangement, unit normalization, domain proof, intermediate results and reverse verification Pro; all numeric steps consume engine trace. | code/fetched-1.txt → src/calculators/geometry/catalog-completion.ts steps fields; adapter  journey reuses step strings; no advanced derivation engine in fetched code. |
| S276-SCENARIOS Complete scenarios | BLUEPRINT P409–418 | PARTIAL | A/B/C complete input sets, baseline equals normal run; comparable output units; shape/mode differences explicitly labeled rather than misleading percent delta. | code/fetched-3.txt → src/lib/batch21-six-calculators.ts sixScenarioMetadata display bindings; input/packets/276.json retained synthetic versioned scenario evidence, not full graph/reverse analytics proof. |
| S276-SENSITIVITY Deterministic sensitivity | BLUEPRINT P413–414; RECOMMENDATION sweep details | MISSING | One-at-a-time 101 inclusive equally spaced points by default; explicit bounds/units; baseline included as separate exact row if off-grid; invalid points retain status gaps; finite differences optional only from certified engine rows, never alternative formulas. | input/packets/276.json mandatoryFullScope: geometryCorePresentation supportsSensitivity=false; fetched engine contains no sweep. |
| S276-TABLE Detailed reconciliation table | BLUEPRINT P417–420; catalog advanced steps/graphing | MISSING | Semantic parameter/intermediate/result rows and graph/sweep coordinate table; each cell linked to structured output. No fabricated amortization schedule; schedule-reconciliation criterion assessed on meaningful geometry tables. | code/fetched-3.txt → src/lib/batch21-six-calculators.ts adapters emit metrics/journey; no geometry detailed table generation in fetched symbols. |
| S276-EXPORT Owned professional exports | BLUEPRINT P419–420; catalog Pro exports | PROOF_MISSING | CSV/JSON/PDF serialize same result snapshot, units, modes, source/revision and warnings; source/hash binds replay; authorization and tier tests cover denied/allowed actions. | input/packets/276.json full exports acceptance unresolved; synthetic receipts cannot prove genuine account ownership. |
| S276-PERSIST History/projects/replay | BLUEPRINT P578–584 | PARTIAL | Exact immutable snapshots, complete inputs/modes/units and scenario versions retained; shared workspace ACL integration delegated to root common implementation. | input/packets/276.json snapshot/recovery evidence bounded synthetic; historical raw values must not be recomputed. |
| S276-TIERS Central entitlement parity | BLUEPRINT P302–405,708–709 | PROOF_MISSING | Root entitlement matrix applied to each geometry feature; raw result parity across plans and server protected-action denial tests with genuine accounts. | input/packets/276.json entitlement-validation bounded synthetic only. |
| S276-BUSINESS Full Business workflow/delivery | BLUEPRINT P424–438,585–591; catalog Business differentiation | UNKNOWN | Root shared team/client/embed/API/batch/webhook/builder/branding/governance contracts integrated and accepted per ID; compute engine remains identical. | No Business implementation symbols fetched for geometry; input/packets/276.json lists mandatory unresolved Business scope. |
| S276-UX Accessible responsive Final UX | BLUEPRINT P286–300,543–552 | PROOF_MISSING | Root UX/accessibility/performance/SEO/security contracts plus geometry chart alternatives and target controls; published trust follows lifecycle, numeric revisions only Methodology. | input/packets/276.json responsive evidence bounded; performance/security/SEO/accessibility criterion-specific proof missing. |
| S276-REVIEW Qualified complete acceptance | BLUEPRINT P455–495,685–723 | PROOF_MISSING | Bind all15 QA dispositions and source applicability to complete new technical revision; signed/dated qualified geometry/numerics review with competence and conflicts recorded. No licensed external specialist inferred for generic educational scope; any regulated design claim triggers separate scope review. | input/lifecycle-publication-prerequisites.json; input/packets/276.json reviewerRequirements pending. |

## ownerChoices

```json
[
  {
    "choiceId": "S276-C1",
    "decision": "Adopt all five modes and complete inverse/graph contract",
    "recommended": "All as specified; Free two-point/rise-run/line core and useful graph; Pro full inverses/analysis.",
    "alternatives": [
      "Keep only two-point core as a named component while full generic product remains incomplete",
      "Adopt fewer line forms with controlled complete-scope reconciliation against catalog graphing/reverse obligations"
    ],
    "implications": "Scope is a product choice, not permission to mark existing endpoints complete. More modes require new immutable revision, source applicability and extra QA."
  },
  {
    "choiceId": "S276-C2",
    "decision": "Adopt exact classifications and units",
    "recommended": "Typed vertical/coincident outcomes, explicit axis units and ratio; angle/grade only compatible dimensions.",
    "alternatives": [
      "Unitless educational profile with prominently declared dimensionless axes; full physical-unit feature remains open",
      "All coherent physical dimensions with expanded reviewed unit registry"
    ],
    "implications": "Never numerical Infinity for vertical; v1 stays separate; incompatible quantity axes may define dimensional slope but not geometric angle."
  },
  {
    "choiceId": "S276-C3",
    "decision": "Adopt explicit prospective numeric envelope/display",
    "recommended": "Envelope and1e-11 relative oracle criterion;12/15digit display and17roundtrip raw.",
    "alternatives": [
      "High precision decimal/rational compute with wider certified envelope",
      "Keep v2 wide core for replay and refuse new unsupported conditioning until numeric engine certified"
    ],
    "implications": "No silent restriction or recomputation of historical inputs; source equations unchanged; 15 displayed digits not 15 guaranteed accurate digits."
  }
]
```

## acceptanceCases

```json
[
  {
    "caseId": "S276-A01",
    "input": {
      "mode": "two_points",
      "points": [
        [
          1,
          2
        ],
        [
          4,
          8
        ]
      ]
    },
    "expected": {
      "m": 2,
      "dx": 3,
      "dy": 6,
      "b": 0,
      "equation": "y=2x"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A02",
    "input": {
      "points": [
        [
          -2,
          5
        ],
        [
          2,
          -3
        ]
      ]
    },
    "expected": {
      "m": -2,
      "b": 1
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A03",
    "input": {
      "points": [
        [
          0,
          4
        ],
        [
          3,
          4
        ]
      ]
    },
    "expected": {
      "m": 0,
      "classification": "horizontal",
      "equation": "y=4"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A04",
    "input": {
      "points": [
        [
          3,
          0
        ],
        [
          3,
          2
        ]
      ]
    },
    "expected": {
      "status": "undefined_slope",
      "line": "x=3",
      "graph": "vertical clipped segment",
      "numericSlope": null
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A05",
    "input": {
      "points": [
        [
          3,
          2
        ],
        [
          3,
          2
        ]
      ]
    },
    "expected": {
      "status": "indeterminate",
      "lineCount": "infinitely_many",
      "graph": "single point"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A06",
    "input": {
      "mode": "general_line",
      "A": 2,
      "B": -1,
      "C": 0
    },
    "expected": {
      "m": 2,
      "b": 0
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A07",
    "input": {
      "mode": "general_line",
      "A": 0,
      "B": 0,
      "C": 0
    },
    "expected": {
      "status": "indeterminate",
      "solution": "entire plane, not unique line"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A08",
    "input": {
      "mode": "general_line",
      "A": 0,
      "B": 0,
      "C": 1
    },
    "expected": {
      "status": "no_solution"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A09",
    "input": {
      "target": "x2",
      "m": 0,
      "x1": 1,
      "y1": 2,
      "y2": 2
    },
    "expected": {
      "status": "infinitely_many",
      "domain": "x2≠1 within adopted envelope"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A10",
    "input": {
      "target": "x2",
      "m": 0,
      "x1": 1,
      "y1": 2,
      "y2": 3
    },
    "expected": {
      "status": "no_solution"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A11",
    "input": {
      "target": "y2",
      "m": 2,
      "x1": 1,
      "y1": 2,
      "x2": 4
    },
    "expected": {
      "solution": 8,
      "forwardSlope": 2
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A12",
    "input": {
      "points": [
        [
          0,
          0
        ],
        [
          1,
          100
        ]
      ],
      "xUnit": "m",
      "yUnit": "cm"
    },
    "expected": {
      "slope": "100 cm/m",
      "normalizedSlope": 1,
      "gradePercent": 100,
      "angleDegrees": 45
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A13",
    "input": {
      "points": [
        [
          0,
          0
        ],
        [
          2,
          4
        ]
      ],
      "xUnit": "s",
      "yUnit": "m"
    },
    "expected": {
      "slope": "2 m/s",
      "angle": "unavailable incompatible dimensions"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A14",
    "input": {
      "x1": "1000000000000",
      "x2": "1000000000000.00001",
      "y1": "0",
      "y2": "1"
    },
    "expected": {
      "status": "precision_required",
      "not": "vertical"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A15",
    "input": {
      "mode": "rise_run",
      "rise": "0",
      "run": "0"
    },
    "expected": {
      "status": "indeterminate",
      "not": "horizontal"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A16",
    "input": {
      "sweep": "x2",
      "x1": 0,
      "y1": 0,
      "y2": 1,
      "range": [
        -1,
        1
      ]
    },
    "expected": {
      "atZero": "undefined_slope",
      "segments": "break at0; no connection across asymptote"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A17",
    "input": {
      "points": [
        [
          4,
          8
        ],
        [
          1,
          2
        ]
      ]
    },
    "expected": {
      "m": 2,
      "dx": -3,
      "dy": -6,
      "line": "same asA01"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A18",
    "input": {
      "historical": "geometry.slope@1 rise/run snapshot"
    },
    "expected": {
      "replay": "recorded original output",
      "coordinates": "not fabricated"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A19",
    "input": {
      "x1": true,
      "x2": 1,
      "y1": 0,
      "y2": 1
    },
    "expected": {
      "status": "invalid_input"
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  },
  {
    "caseId": "S276-A20",
    "input": {
      "x1": "0",
      "x2": "1e-320",
      "y1": "0",
      "y2": "1e-323"
    },
    "expected": {
      "status": "numeric_out_of_envelope",
      "note": "Retain existing zero-underflow refusal receipt; this is proposed boundary/partial-underflow oracle proof, not repeat campaign."
    },
    "acceptanceCriteria": "Exact expected classification and mathematical value; numeric outputs additionally meet the proposed oracle tolerance."
  }
]
```

## acceptanceWorkflowCases

```json
[
  {
    "caseId": "276-W01",
    "input": {
      "sameInput": "one reference case",
      "plans": [
        "Free",
        "Pro",
        "Business"
      ],
      "delivery": [
        "web",
        "API",
        "embed",
        "batch"
      ]
    },
    "expected": {
      "rawEngineResult": "identical revision/source/value/warnings"
    },
    "acceptanceCriteria": "Compare structured raw values; API/embed/batch require Business authorization but never a different answer."
  },
  {
    "caseId": "276-W02",
    "input": {
      "save": "genuine owner account",
      "otherWorkspace": "different organization",
      "tamperedClientPlan": "Business"
    },
    "expected": {
      "ownerReplay": "original exact snapshot",
      "unauthorizedReadExport": "denied server-side"
    },
    "acceptanceCriteria": "Root shared auth/RLS/security test with this domain payload and exact IDs; synthetic transport insufficient."
  },
  {
    "caseId": "276-W03",
    "input": {
      "scenarioA": "baseline",
      "export": [
        "CSV",
        "JSON",
        "PDF"
      ],
      "table": "same baseline"
    },
    "expected": {
      "reconciliation": "raw/dimension/source identity identical; display exact formatter policy"
    },
    "acceptanceCriteria": "No recompute from displayed labels; source/revision/unit/mode survives JSON roundtrip; verify PDF textual/chart alternative."
  },
  {
    "caseId": "276-W04",
    "input": {
      "viewports": [
        "mobile portrait",
        "mobile landscape",
        "desktop"
      ],
      "input": "invalid and successful",
      "interaction": "keyboard and screen reader"
    },
    "expected": {
      "errors": "labeled and announced",
      "result": "before upgrade/explanation",
      "overflow": false,
      "chartAlternative": "equivalent data"
    },
    "acceptanceCriteria": "Retain screenshots/interaction traces plus genuine assistive-technology evidence; no blanket WCAG claim from automation."
  },
  {
    "caseId": "276-W05",
    "input": {
      "builder": "Business template of adopted shape/mode",
      "webhook": "duplicate delivery",
      "APIKey": "revoked",
      "lifecycle": "draft"
    },
    "expected": {
      "template": "same certified engine and constrained schema",
      "webhook": "idempotent signed/audited",
      "revokedAccess": "denied",
      "discovery": "not public"
    },
    "acceptanceCriteria": "Root shared integration proofs per domain identity; geometry task owns fixtures only."
  }
]
```

## tasks

```json
[
  {
    "taskId": "S276-ENGINE",
    "ownedFiles": [
      "src/calculators/geometry/slope-final-contract.ts",
      "src/calculators/geometry/slope-final-contract.test.ts"
    ],
    "personHours": [
      24,
      36
    ],
    "deliverable": "New immutable registered definition with typed modes, exact decimal validation/classification, stable line representations, inverse solution sets and forward residual traces; do not edit catalog-completion.ts old revision.",
    "dependencies": [
      "Owner adopts S276-C1..C3"
    ],
    "nonOverlap": "Slope-only engine and test; Volume engine isolated; root owns registry integration."
  },
  {
    "taskId": "S276-PRESENT",
    "ownedFiles": [
      "src/calculators/geometry/slope-final-presentation.ts",
      "src/calculators/geometry/slope-final-result.ts",
      "src/calculators/geometry/slope-final-analysis.ts"
    ],
    "personHours": [
      20,
      28
    ],
    "deliverable": "Structured line graph clipping, rise/run triangle/labels, domain table, reverse/scenario/sweep adapters, units and feature metadata; root renderer consumes model.",
    "dependencies": [
      "S276-ENGINE",
      "Root structured result/renderer interfaces"
    ],
    "nonOverlap": "Domain descriptors/adapters only; shared renderer/auth/API/export infrastructure root-owned."
  },
  {
    "taskId": "S276-QA",
    "ownedFiles": [
      "tests/geometry/s276-contract.acceptance.test.ts",
      "docs/geometry/s276-review-evidence.json"
    ],
    "personHours": [
      16,
      24
    ],
    "deliverable": "Per-feature oracle cases, regression/replay fixtures, dimension/degeneracy/error-classification checks, graph/table/scenario/export reconciliation adapters and exact-version review packet. Reuse retained evidence; collect only missing proof.",
    "dependencies": [
      "Adopt complete contract",
      "Domain compute and adapters"
    ],
    "nonOverlap": "Geometry domain fixtures and per-ID evidence only; root owns shared auth/entitlement/security/accessibility/performance harnesses and lifecycle actions."
  }
]
```

## qaCriteria

```json
[
  {
    "criterion": "engine-tests",
    "currentTechnicalSufficiency": "Bounded supporting evidence; insufficient for complete product acceptance",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "formula-review",
    "currentTechnicalSufficiency": "Source mathematics sufficiently established for the stated bounded profile; implementation/numeric and accountable exact-version disposition remain pending",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "sources",
    "currentTechnicalSufficiency": "Source mathematics sufficiently established for the stated bounded profile; implementation/numeric and accountable exact-version disposition remain pending",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "methodology",
    "currentTechnicalSufficiency": "Source mathematics sufficiently established for the stated bounded profile; implementation/numeric and accountable exact-version disposition remain pending",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "reverse-solve",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "visualization-reconciliation",
    "currentTechnicalSufficiency": "Two selected endpoints only; no infinite-line/equation/intercept proof. Insufficient for full catalog scope.",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "schedule-reconciliation",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "scenario-reconciliation",
    "currentTechnicalSufficiency": "Bounded supporting evidence; insufficient for complete product acceptance",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "sensitivity-validation",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "entitlement-validation",
    "currentTechnicalSufficiency": "Bounded supporting evidence; insufficient for complete product acceptance",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "ux-responsive",
    "currentTechnicalSufficiency": "Bounded supporting evidence; insufficient for complete product acceptance",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "performance",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "security",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "seo-content",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  },
  {
    "criterion": "accessibility",
    "currentTechnicalSufficiency": "No criterion-specific proof in retained packet; insufficient",
    "requiredNewDisposition": "PENDING exact complete-contract technical revision/source bound reviewer decision; add only missing branch/evidence after contract adoption",
    "formalDecision": "PENDING"
  }
]
```

## evidenceLimits

```json
{
  "scope": "No formula/source/repository mutation, test run, new audit, browser or production inspection performed for this proposal. Read exact code and retained input evidence.",
  "existing": "input/packets/{masterId}.json and -geometry-review.md: reported 12 UI, 15 engine/helper, 8 snapshot/recovery checks; local Vite/Chromium synthetic transport. CI41420268580 green for named scope only.",
  "notEstablished": [
    "Genuine authenticated account/RLS persistence",
    "Full WCAG or physical/assistive technology checks",
    "All proposed numeric envelope/shape/mode/reverse cases",
    "Exact-version named qualified approval",
    "Production lifecycle/publication state"
  ],
  "reuse": "Retain witnessed zero-underflow refusal/recovery; test only missing nonzero subnormal precision/partial-underflow cases against independent oracle. Do not repeat broad audit.",
  "freshUIRead": "code/calculator-interactive.tsx exactPR1519 supplied by root: PrismTool and CoordinateSlopeTool read. PrismTool unary+ parses fields, UI precisionError can suppress output; CoordinateSlopeTool requiredCalculatorNumber and explicit empty checks; both use geometryCorePresentation, Steps, CalculatorAccountActions/sixScenarioMetadata. No advanced geometry modes or full line/solid renderer in these symbols."
}
```

Geometry-owned effort: 60–88 person-hours. Incremental geometry-owned implementation/evidence only; excludes shared root infrastructure, reviewer elapsed time, new source access delays and release operations. Ranges are planning estimates, not measured task durations.

Evidence read: blueprint-full.txt (governing clauses P0–1159); both geometry packets/reviews; exact fetched-1/fetched-3 and provenance; domain-review-consolidated rows275/276; source-edition applicability register and actual OpenStax geometry captures; OWNER-CHOICES; lifecycle-publication-prerequisites. Source hashes refer to saved retrieval JSON/parsed text, never asserted original publisher PDF/HTML binaries.


# Shared full-product contract — proposed

This is part of all6contracts. Source/Blueprint requirements and proposed numeric/resource policies are distinguished. No ownerapproval,engineacceptance orpublication authority is granted. Unrelated Business/billing implementation stays deferred; existing Business workflow contracts remain represented without new commercial work.

## SH-01 — Identity, contract and immutable technical lineage

Authority: Blueprint §§2–4,12,18,25; catalog exact six rows; explicit user scope

Keep all six catalog IDs/slugs and baseline tuples. This proposed document revision is draft-20261102.1, not a new approval. Hash the selected complete contract. Expanded math/grammar/input/output/rounding semantics must use an allocated immutable successor technical revision; never overwrite recorded Slopev1/v2, other v1 results or snapshots. UI-only labels may change only if replay interpretation is preserved. Do not preallocate a certified successor by editing version fields.

Baseline status: **PARTIAL**. Input packets/source bindings establish six baseline tuples; no complete successor contract approval.

Acceptance: For every six identity replay at least one old snapshot before/after integration byte-for-byte at authoritative stored inputs/results/mode/version. Version mismatch is explicit; no latest-engine fallback. Same canonical URL and catalog ID; controlled successor version evidence.

## SH-02 — Strict inputs and typed numerical outcomes

Authority: Blueprint §§4,7,13; numerical format/envelope is a proposal

Accept complete signed decimal/scientific tokens only; no JS coercion of empty/whitespace/hex/Infinity/NaN, no partial parse. Preserve original normalized decimal strings and unit/mode IDs. Dataset grammar and expression grammar override single-scalar token grammar only as explicitly specified. Locale-aware UI may normalize a selected locale; ambiguous separators error. Return typed outcomes: finite result, vertical line, degenerate/underdetermined, no-solution, domain-error, precision-unavailable, budget-exhausted, cancelled. Never manufacture0 or a success result for error states.

Baseline status: **PARTIAL**. Fresh calculator-interactive.tsx parseDataset uses split/Number; CoordinateSlopeTool rejects blanks; six-candidate-numeric-safety.ts has bounded caller-side underflow guards.

Acceptance: Blank,invalid exponent,hex,malformed locale,nonfinite,overflow,subnormal/underflow and ambiguity cases; errors field-linked. No successful snapshot/save/export of invalid output. Every classification has text accessible without chart.

## SH-03 — Shared precision and display policy

Authority: Blueprint §4/§13 requires explicit rounding; exact numeric choices are owner proposal

Separate authoritative compute, raw serialization and display. Default display12significant digits, expanded15 for binary64 values; mark approximations. Exact integer/rational labels only when algebra proves them. Proposed ties-to-even for presentation, no intermediate display rounding in compute. Statistical Decimal50 raw strings may expose more exact audit digits, not false binary64 precision. Domain contracts specify the controlling per-domain envelope and budget: geometry uses1e-11 relative for nonzero well-conditioned results with exact zero/classification; statistics uses1e-40 relative Decimal results; graph scalar evaluation uses its explicit absolute/relative1e-12 policy. Do not silently substitute one budget for another. Other binary64 helper paths require a declared oracle-backed budget, proposed error <=max(8ULP(reference),1e-12*abs(reference)) for nonzero well-conditioned values; exact algebraic zeros stay zero and underflow of a nonzero result cannot silently pass. Ill-conditioned cases need proved bound, high precision fallback or typed precision refusal, not widened epsilon. Decimal statistics use their stricter100digit-oracle criterion. Plot/analysis error budgets are separate and must be reported.

Baseline status: **PARTIAL**. Fresh renderer-display.ts uses max2fractiondigits for abs>=.01 and8significant below. Current engines and caller guards are bounded evidence, not this new numeric contract.

Acceptance: Test display ties, scientific notation, negative zero, tiny/huge finite results and raw/full expansion; compare independent >=100digit oracle with declared condition envelopes. Do not infer 12correct digits from 12displayed digits. Label uncertainty when final digit is not stable.

## SH-04 — Structured results and metadata

Authority: Blueprint §§5–7,12

One version-bound result artifact drives hero,KPIs,steps,charts,tables,reverse/scenario/sensitivity and exports. Include catalog/engine/version, contract hash, input strings/units/modes, raw outputs or typed classification, algorithm revision, source references, assumptions,warnings,error/approximation metadata, numerical policy and plan-independent result digest. Avoid ad-hoc recomputation in chart/renderer/export. Optional metrics only when meaningful; no fabricated3–6cards.

Baseline status: **PARTIAL**. Exact types.ts and batch21-six-calculators.ts provide structured outputs and scenario labels; typed classification, exact decimal strings and full new branches are unproven.

Acceptance: Verify same artifact digest and raw values consumed by every supported view; deliberate tamper/mismatched ID/version must fail. Exhaustive discriminated outcome rendering.

## SH-05 — Simple/Advanced inputs and guided explanations

Authority: Blueprint §7; layout specifics proposed

Simple mode exposes complete accuracy-required forward inputs; Advanced adds optional analysis controls. Changing display mode never resets or changes hidden accuracy inputs. Default empty user-owned inputs; examples load only through explicit Use example with label. Calculate action, progress and cancel; preserve last valid result but mark it stale after edits. Show formula substitution, units, assumptions and what the result means before upgrade prompts.

Baseline status: **PARTIAL**. Fresh UI exposes basic input components; proposed examples/stale-result and full modes not established across six.

Acceptance: Switch Simple/Advanced with populated inputs; output unchanged. Clear example leaves no unannounced default. Keyboard calculate/error focus and recoverable cancel. Distinguish old/stale and current result.

## SH-06 — Useful charts and equivalent tables

Authority: Blueprint §§6–7,10,13,17

Every applicable six has a useful Free visual plus semantic data/table alternative. All chart values derive from the result artifact; graph approximation/reliability is explicit and no connection is drawn across a known invalid/unresolved segment. Show raw versus display distinction in tables. Virtualization/paging may limit displayed rows, never silently drop observations or exported rows. Use shared chart/table components, not six divergent renderers.

Baseline status: **PARTIAL**. Slope adapter supplies endpoints only; prism adapter has scalar volume; graph grid81 samples, stats presentations and retained per-ID raw-table/fallback tests establish bounded behavior only.

Acceptance: Per-ID hero/chart/table/replay reconciliation; table has caption,headers,units and gap status; identify full versus sampled rows. Test pathological graph intervals, weighted counts, solid diagram proportions. Color-independent legends/text equivalents.

## SH-07 — Reverse solving and sensitivity through forward compute

Authority: Blueprint §§7,10,13; exact targets proposed in six contracts

Use each contract’s declared reverse target and finite domain. Return all solutions under the selected branch policy, none, multiple/underdetermined or incomplete search; numeric candidates always fed back to the same forward engine. Residual <=max(contract absolute scale threshold,1e-10*target scale) unless stricter domain criterion; report both x-bracket width and residual for graph solvers. Sensitivity sweeps call the same forward pipeline with one explicit selected variable/parameter, fixed baseline and bounded range; discontinuities/invalid outcomes are retained, not interpolated into success.

Baseline status: **PARTIAL**. Existing private sensitivity/scenario infrastructure and bounded receipts retained; all new six target/domain proofs not established.

Acceptance: One feasible/infeasible/underdetermined reverse case per declared target and boundary; verify forward residual independently. Baseline sweep equals normal output. Root search cannot mistake a pole for a zero or claim exhaustive real roots from finite samples.

## SH-08 — History and immutable replay

Authority: Blueprint §§10,18

Reuse existing authenticated ownership/scoped persistence. Save normalized exact inputs, modes, units, expression AST/grammar version, ranges, selected algorithm/error policy, selected outputs and source/contract/version hashes. Read-only replay displays recorded results; optional recalculate creates a new artifact and never overwrites saved history. Owner switch/logout/revocation hides prior-owner results; failed save does not imply saved success. Deduplicate only through existing idempotent save contract.

Baseline status: **PARTIAL**. Fresh calculator-account-actions.tsx uses createCalculationSnapshot, current owner guards and saveHistoryAtomically; input package supplies bounded workflow tests. Complete new metadata/replay branches and genuine per-ID account proof remain pending.

Acceptance: Two synthetic isolated owners: save,reload,logout,owner switch,denied read,failed network retry,duplicate save,stale version and unknown version. Do not use production credentials/data; retain exact snapshot and result receipts per ID.

## SH-09 — Scenarios and sensitivity persistence

Authority: Blueprint §§10,18

Reuse existing scenario workspace with complete version-bound input sets and labeled baseline. Copy scenario changes only intended fields; unit/mode changes visible. Compare only compatible outputs, label incompatible comparison. Persist exact sweep parameters and error states if saved. Never share mutable references between scenarios. Business organization ownership follows existing controls without new Business/billing scope.

Baseline status: **PARTIAL**. CalculatorAccountActions imports CalculatorScenarioWorkspace and sixScenarioMetadata; existing tests cover bounded paths, not all proposed modes.

Acceptance: A/B/C scenario baseline equals primary calculation exactly at same version; modify one without changing others; restore/replay after new revision and account recovery. Selected unit conversions reconcile.

## SH-10 — JSON/CSV/PDF exports and accessible reports

Authority: Blueprint §§8,10,13,17

Pro/Business use existing report transport. JSON includes complete typed artifact; CSV includes units,mode,revision,raw/display values,full selected table or explicit sampled status and safe text escaping; PDF includes same outputs,methodology,source/revision,assumptions and accessible textual chart alternatives. Unicode/math notation must map to selectable searchable text, fonts embedded as required; tag structure, logical reading order, tables/headers and metadata independently validated. A PDF button is not proof of exported bytes or PDF/UA. Free retains existing basic share/plain-text core result, no accuracy-relevant values hidden.

Baseline status: **PARTIAL**. Fresh AccountActions has actual JSON/CSV/PDF serialization calls and error handling. Input reports export-control click/fallback proof; full per-ID exported-byte/source/Unicode/PDF-UA acceptance missing.

Acceptance: Read actual downloaded bytes for all6; compare raw/digest/units/modes/source versions; malicious formula strings escaped for CSV spreadsheet opening, Unicode minus/superscripts/Greek preserved. Independent PDF reader and validator plus human reading-order check; no compliance claim from metadata/tag existence alone.

## SH-11 — Free/Pro/Business parity and central capabilities

Authority: Blueprint §§8–11,24.2

All supported forward core modes/shapes and inputs needed for correctness available on Free with same engine/domain/precision as Pro/Business. Free useful chart/basic table/basic selected reverse and existing limited saves; Pro full analytical tools,scenarios,sensitivity,expanded saves/projects and professional exports. Business inherits Pro and existing team/client/embed/API/batch/governance adapters. Exact quotas remain centrally configured existing policy; no new billing,seat or commercial policy work. Do not cap precision or statistically truncate data by tier. Advanced analysis access may differ; any operation offered on two plans gives identical authoritative output for identical inputs.

Baseline status: **PARTIAL**. Blueprint and current AccountActions central entitlements are established; six complete new-mode cross-plan proof remains absent.

Acceptance: Engine-level equality across plan capability contexts for every core mode; server-side denial for unavailable operations without changing compute; Free source/error/assumptions visible. No new billing task and no plan upgrade triggered in acceptance.

## SH-12 — Accessibility and mobile

Authority: Blueprint §§7,13,17; WCAG targets/budgets below proposed acceptance policies

Persistent labels,field errors linked by aria-describedby,error summary focus,keyboard operation for every control and nondrag alternatives. Chart/table/explanation equivalent; announcements concise/cancellable and do not stream every sample. No color-only state; reduced motion respected; focus visible and logical. Test320,360,390,768,1280px portrait/landscape,200%zoom/400%reflow. Proposed WCAG2.2AA audit target,44CSSpx preferred touch controls; at least24CSSpx minimum or applicable spacing exception separately reviewed. Math verbalized; not image-only. Physical Android/TalkBack evidence required where mandatory, not simulated by mobile viewport.

Baseline status: **PROOF_MISSING**. Retained graph raw table/fallback/export-control and hosted UI tests support bounded paths only; physical6device workflows and independent complete accessibility review unavailable.

Acceptance: PerID keyboard-only forward/reverse/scenario/export with focus recovery; desktop screenreader and physical Android/TalkBack tester receipts exactdevice/OS/browser; contrast/reflow/reducedmotion/orientation/manual chart tasks. Any criterion N/A needs explicit justified reviewer disposition, not automatic pass.

## SH-13 — Measured performance and bounded computation

Authority: Blueprint §§13,17; numbers proposed product policy

Keep numeric work off main thread when it exceeds interactive budget. Deterministic operation/sample/refinement caps; cancel stale requests. Propose warm scalar/math data10k result p95<=500ms; one standard function plot p95<=1000ms and allowed graph-analysis job<=2000ms on declared4xCPU-throttled browser. No main-thread task>50ms attributable to solver loops. Cold page field data target LCP<=2.5s,INP<=200ms,CLS<=0.1 at75thpercentile is a proposed launch target, not measured attainment. Synthetic20runs after5warmups with machine/browser dataset and memory report; physical and field data separate. Large jobs return partial budget status and preserve input.

Baseline status: **PROOF_MISSING**. Exact-headCI success is not a measured per-ID performance distribution; no new performance run executed in this specification task.

Acceptance: Measure fixedfixtures scalar,10kstats,allsolids,and graph discontinuities/solverworkload; record p50,p95,max,memory,HTML/JS payload,worker cancellation and cold/warm provenance; fail budget rather than hide long task. Retain timing variance; no performance claim from unexecuted spec.

## SH-14 — Security and resource-safe expression/import/export

Authority: Blueprint §§13,17,20

No eval/Function/dynamic code execution; expression AST only,whitelist names/operators,depth/token/budget caps,network-free deterministic computation. Treat pasted data and files as data; boundsize,numericcount,CSVcells. Escape display and spreadsheet formulas; sanitize shared labels. Account,scenario,export requests fail closed on invalid owner/role/quota and use existing endpoints. No new provider/domain/database permission changes.

Baseline status: **PARTIAL**. Existing expression-engine parser is bounded AST; AccountActions current owner guards observed. New grammar,imports,analysis budgets and exported bytes need targeted negative acceptance.

Acceptance: Prototype/property/member access,assignment,script/html,unicode confusables,deepnesting,hugetokens,adversarialsolver and CSVformula cases; verify no network/code execution and no freeze. Existing auth/RLS tests reused only for exact unchanged scope.

## SH-15 — Source, competent review and lifecycle

Authority: Blueprint §§12–13,25; existing15QAcheck types

Every formula/algorithm has source clause or explicit derivation and worked golden. Distinguish mathematical source facts from product operator/mode/shapelist/tolerances. Competent geometry/statistics/numericalanalysis reviewers assess applicable full contract and exact version/source/QA evidence; do not fabricate professional approval. Preserve all43authority blockers and11retainedspecialist requirements untouched. Existing15perID lifecycle QA checks remain pending unless actual authorized disposition occurs later. No assumption of approval from CI,metadata or these proposals.

Baseline status: **PARTIAL**. Input lifecycle-publication-prerequisites.json and exact publishing.ts describe gates; existing90criteria all pending, bounded12source/formula findings ready for adjudication.

Acceptance: PerID15criterion evidence and accountable assignment/disposition including conditional applicability,reverse/scenario/table/visual parity,security/SEO,a11y/performance. Only after separate authorized contract+QA and lifecycle decisions could review->certified->published proceed. This task performs none.

