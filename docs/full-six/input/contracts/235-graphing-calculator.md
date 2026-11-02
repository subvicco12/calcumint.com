# 235 — Graphing: complete proposed contract

Baseline `advanced-math.graphing@1`, slug `graphing-calculator`; PR1519 `7cdffeed3d5a8789689aa5495277e28b780227dc`. Proposal draft-20261102.1. **PENDING, not canonical approval. RELEASE HOLD.**

This document includes the complete domain proposal and shared full-product requirements. Input source facts are not approval questions. Existing historical versions remain immutable; any material expanded implementation requires a controlled successor technical revision.

# 235: advanced-math.graphing — proposed full contract

Contract revision: `draft-20261102.1`. Baseline `advanced-math.graphing@1` is retained unchanged; material changes require a validated successor technical revision. Status: proposed, no approval or release action.

Selected product role: mathematical analysis workspace. Catalog class: B Analytical. Modes: explicit-real, parametric-Pro, polar-Pro. Angle policy: radians default; degrees Pro mode.

Full normative grammar, numeric domains, algorithms, output schemas, feature decisions, evidence distinctions and exact acceptance fixture sets are in `graph-contracts.md`; machine fields are in this product’s `*-full-contract.json`. Both files are required components of this contract. Shared workflow requirements remain mandatory; they are implemented once and accepted separately per ID.

| Feature ID | Tier | Contract | Existing evidence |
|---|---|---|---|
| G-01 | Free | Restricted grammar, precedence, finite full-match numeric input, bounded whitelist AST | partial: expression-engine.ts:tokenize/parseExpression/evaluateExpression; no depth/node/underflow guard |
| G-02 | Free | Binary64 reviewed numeric envelope, domain statuses, angle semantics and display/replay policy | partial: expression-engine.ts:evaluateExpression finite guards only; renderer-display.ts differs from proposed policy |
| G-03 | Free | AST-domain-guarded adaptive explicit plot with cell/gap records and reconciled accessible table | missing: catalog-batch-10.ts:sample fixed81; calculator-interactive.tsx:FunctionCurve joins surviving sampled-grid cells only |
| A235-01 | Free | Six explicit functions, numerical roots/intersections with residual/bracket and incomplete-coverage diagnostics | missing: graphDef only one expression fixed sample output |
| A235-02 | Free | Symbolic derivative at point, verified local extrema and proper numerical finite integral | missing: graphDef no derivative/integral/critical-point branch; other calculus calculators are separate IDs |
| A235-03 | Pro | Derivative overlay and verified bounded inverse-function solve | missing: graphDef/graphPresentation absent analysis schemas |
| A235-04 | Pro | Parametric x(t),y(t), polar r(theta), degree-mode with chain-rule semantics | missing: expression-engine.ts only x; graphDef only explicit expression |
| A235-05 | Pro | A/B/C complete analysis scenarios and parameter sensitivities with branch diagnostics | missing: graphPresentation flags false; generic account scenario does not prove numeric adapters |
| W-GRAPH-EXPORT | Pro | CSV/JSON/PDF raw/display reconciliation plus graph SVG/PNG | proof-gap-and-extension: CalculatorAccountActions controls demonstrated enabled; no clicked exported bytes; SVG/PNG selected extension |
| W-GRAPH-PERSIST | Pro | Real-user isolated history, immutable replay/hash and saved scenarios | proof-gap: synthetic account tests do not prove real auth/DB isolation/reload |
| W-GRAPH-BUSINESS | Business | Organizations, roles, clients, templates, branding, embed, authenticated API, batch, idempotent webhooks, quotas/audit | unproven: not established by bounded graph source or UI tests |
| Q-GRAPH | all | Exact-head per-ID numerical, security, responsive, accessibility, reconciliation, entitlement and performance review | pending: retained packets criteria all pending; CI is evidence only |

Selected alternatives and retained limitations: implicit F(x,y)=0 excluded in this revision, alternative 80–140 h separately; generic root search never claims completeness; formal optional polynomial branch may prove all distinct roots and multiplicities; finite proper integrals only. #251 exposes sampled range/target crossings and visual inverse relation; #235 adds bounded numerical analyses and parametric/polar Pro branches. Acceptance and identities never transfer between the two products.

Recommended profile: robust numerical analysis,448–698 graph-domain hours; formal interval/exact-completeness alternative adds240–400h and is not a Blueprint requirement. Runtime OK_NUMERIC and BOUNDED_ESTIMATE are numerical statuses, never lifecycle certification. No all-roots/global-extrema claim from samples.

Initial state: all expression fields empty; no automatic calculation, curve, result, history entry or export payload. Explicit Use example may populate x^2 with example provenance, then the user activates Calculate. Radians and illustrative viewport [-5,5]/auto are disclosed mode/view constants, never silently evaluated user data. See G-QA-0.

Numeric-token exponent cap [-308,308] applies even to zero literals: 0e0 is valid zero; 0e999 returns RANGE_UNSUPPORTED.


# Proposed full contracts: #251 and #235

Status: PROPOSED ENGINEERING CONTRACT, not approval, implementation, certification, or publication. Snapshot: 2026-11-02. Proposed contract revision `draft-20261102.1`; baseline v1 is immutable. Material grammar/output/semantic changes require a validated successor technical version under existing policy; this document neither overwrites historical v1 nor approves a candidate version. Candidates remain separate: #251 `advanced-math.function-plotter-2d@1`, slug `function-plotter-2d`, catalog A Essential; #235 `advanced-math.graphing@1`, slug `graphing-calculator`, catalog B Analytical. Technical revision must change immutably when implemented. A shared parser/renderer never merges identities or acceptance records.

## Authority and interpretation

BLUEPRINT means supplied `blueprint-full.txt` paragraph identifiers. SOURCE means inspected existing implementation or retained mathematics. RECOMMENDATION means a concrete proposed product/engineering choice; it is not imposed by DLMF or inferred from the title. Blueprint P147–158 requires one deterministic engine, immutable revision, typed inputs and explicit precision; P179–211 requires structured output and reconciliation; P241–242 graphing requires domain/range and accessible summary; P286–300 universal UX; P385–420 complete Free calculation, Pro analysis/reverse/scenarios/sensitivity/persistence/exports; P424–437 Business delivery; P455 onward evidence gates. Current essential presentation flags cannot waive these requirements.

Retained DLMF 1.2.8 (2026-09-15), §4.2 and §4.14, establish elementary function definitions/periodicity and tan=sin/cos. Captures are `input/source-captures/dlmf.nist.gov-4.2.txt`, `dlmf.nist.gov-4.14.txt`, and `dlmf.txt`. They do not mandate parser grammar, UI tiers, finite ranges, algorithms, JavaScript accuracy, or the proposed error budgets. Capture provenance limits in packets remain; source adoption and named competent review remain pending.

## Distinct full product choices

#251 is the explicit-real visual exploration product. Free plots one f(x), shows trace and reconciled value table, domain/gaps, sampled range, steps and interpretation. Pro adds up to six overlays, A/B/C visual scenarios, parameter slider/sensitivity, target horizontal-line reverse solve, annotations and SVG/PNG plus CSV/JSON/PDF exports. It does not pretend sampled extrema are analytic extrema. Its required reverse branch solves f(x)=target on a selected finite interval; analysis engine may be shared with #235 but #251 presents only target crossings and verified candidate brackets. Optional inverse *relation view* reflects selected explicit points across y=x and labels multi-valued results; no unproved inverse-function claim. This is a selected recommendation, not existing capability.

#235 is the mathematical analysis workspace. Free provides up to six explicit-real functions, roots, pairwise intersections, numeric derivative at a specified point, local extrema candidates and finite proper definite integrals, with stated bounds and unresolved regions. Pro provides derivative overlays, bounded inverse-function solve on a numerically assessed monotone interval, parametric x(t),y(t) and polar r(theta) curves, A/B/C analyses, parameter sensitivity and advanced explanations/exports. Implicit F(x,y)=0 is explicitly excluded from this proposed revision: neither title nor Blueprint requires every graphing modality. Alternative: add implicit interval subdivision with singular-cell reporting as a separately estimated branch (80–140 h), not a hidden deferred acceptance condition. Parametric/polar are selected Pro branches, not vague future possibilities. Neither product promises all roots/global extrema for arbitrary expressions; no exhaustive completeness is claimed in the recommended numerical profile. Business for both is the root shared team/client/template/embed/API/batch/webhook/branding/governance workflow over the same result. Product IDs stay in all saved records, APIs and exports.

## G-01: lexical and AST contract (SOURCE baseline + RECOMMENDATION hardening)

Input expression is a Unicode string trimmed at ends, 1–500 UTF-16 code units; grammar tokens are ASCII only except whitespace: accept exactly space, tab, CR, LF. Reject NBSP/zero-width characters, Unicode minus and Unicode mathematical letters with position-specific errors. Numbers: `(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?`. Sign is an operator, never a numeric token. Decimal/scientific notation only; no hex, Infinity, NaN, separators or trailing junk. Parse the entire string; finite literal conversion required. Nonzero decimal literal rounding to zero is RANGE_UNDERFLOW, not silently 0; exact literal `0`, `0.0`, `0e0` remains zero. Exponent cap [-308,308] applies to every numeric token, including zero: `0e999` returns RANGE_UNSUPPORTED. Limit numeric token to 64 characters and exponent to [-308,308] (this deliberately rejects smaller finite subnormal input literals; constants computed by expressions still follow runtime policy). Names are case insensitive ASCII letters; x, pi, e and exactly sin,cos,tan,exp,ln,log,sqrt,abs. `log` is log10; `ln` is natural log. Function application requires one parenthesized expression. Reject implicit multiplication (`2x`,`2(x)`), commas, assignments, equality, property/index access, strings, factorial, percent, comparisons, Boolean operations, definitions, user functions, arrays and additional variables. Multi-function UI stores separate expressions rather than a separator grammar. Advanced parameters a,b,c are declared structured finite inputs substituted as immutable AST parameter nodes only when the parameter mode is selected; do not textual-replace identifiers. Parametric uses t instead of x; polar uses theta instead of x; each mode rejects other free variables.

Normative grammar:
```
expr    := term (("+"|"-") term)*
term    := unary (("*"|"/") unary)*
unary   := ("+"|"-") unary | power
power   := primary ("^" unary)?
primary := NUMBER | VARIABLE | "pi" | "e" | FUNCTION "(" expr ")" | "(" expr ")"
```
Thus +,-,*,/ are left associative; ^ is right associative and binds more tightly than leading unary: -x^2=-(x^2), 2^-2=0.25, 2^3^2=512. Parentheses override. No eval, Function, dynamic import, template evaluation or global object lookup. AST whitelist only number, variable/declared parameter, unary, binary and named unary call; node count ≤256, depth ≤64, tokens ≤512; validate before recursive evaluation; worker operation budget includes all internal evaluations. Reject extra JSON fields in public compute requests. Structured inputs (bounds, target, point, parameter, integral limits) use full-match signed finite decimal grammar equivalent to the literal grammar; preserve entered string and converted bits, never `Number('')` or coercive parseFloat.

## G-02: domains, numeric envelope and precision

All modes are dimensionless real arithmetic, default radians. #251 has radians only. #235 Pro degree-mode is selected: each sin/cos/tan argument is multiplied by binary64 pi/180 before trig; derivative chain rule includes that factor, polar theta uses the same mode, and metadata/axis labels always state it. Changing angle mode recalculates; it never reinterprets old saved output silently. No inverse trig is in this revision. Initial expression fields are empty for both products and every mode; #235 second/overlay functions are absent. No calculation, result, scenario, history entry or export is created until the user supplies valid expressions and activates Calculate. The clearly labeled Use example action may populate f=x^2 and x∈[-5,5]; its provenance is example, and it does not represent user data or silently execute Calculate. An illustrative empty-state viewport x∈[-5,5], y auto is permitted before input without any plotted curve or computed values. Radians is an explicitly disclosed mode constant, not a user expression. Bounds: -1e9≤min<max≤1e9; y viewport finite same bound; spans must be representable and contain ≥3 distinct binary64 coordinates or return GRID_RESOLUTION with raw boundary values. Parametric/polar parameter interval same bounds; illustrative mode viewport [0,2*pi] in radians or [0,360] degrees (not an auto-executed expression). Parameters/targets/trace points finite and |value|≤1e9. Integral limits same bound, distinct, within selected continuity interval; reversed limits use negative orientation and equal limits yield exactly zero. Seed count 81 is only an initial mesh.

Normative backend: binary64 round-to-nearest ties-to-even; preserve signed zero in raw replay but display 0. Decimal input conversion correctly rounded once. Elementary function engine must have a pinned reproducible implementation or demonstrate platform envelope for every supported release platform; ordinary Math functions alone have no established global error warranty. Reviewed scalar operating envelope: intermediate/output finite, |intermediate|≤1e100; |trig argument in radians|≤1e6; exp argument [-700,230]; log arguments ≥1e-100; negative power base allowed only with exactly integral binary64 exponent |b|≤1024; 0^0 is DOMAIN_INDETERMINATE; 0^negative and division by ±0 are DOMAIN_DIV_ZERO; sqrt requires a≥0; ln/log require a>0. Outside envelope return RANGE_UNSUPPORTED even if host would produce a finite value. Underflow of nonzero operation to zero or nonzero subnormal intermediate returns RANGE_UNDERFLOW; exact arithmetic cancellation to zero is valid. Domain error is a sample gap, not a whole-plot failure when other segments remain. A plot with no accepted segments still returns its diagnostics/table; no fabricated line.

Recommended numeric acceptance is an empirically reviewed error profile, not a formal interval certificate: accept a finite scalar value as OK_NUMERIC only within the declared envelope and after independent ≥100-decimal-digit oracle fixtures satisfy abs error ≤max(1e-12,1e-12*abs(oracle)). Pin elementary-function implementation/version or restrict validated runtime platforms; ordinary Math functions alone do not establish a universal error warranty. Runtime cancellation/conditioning indicators and domain-enclosure ambiguity produce NUMERIC_UNCERTAIN rather than invented significant digits. For addition/subtraction use condition proxy (abs(a)+abs(b))/abs(result)>1e12; exact zero from structurally equal finite operands is a supported exception. Zero from other nearly cancelling nonzero operands is flagged uncertain. For roots, estimated local sensitivity abs(residual/derivative) exceeding the position target or derivative indistinguishable from zero makes position accuracy uncertain; retain a converged sign bracket separately. These are disclosed heuristics, not rigorous error propagation. Input rounding and propagated uncertainty are disclosed separately. No hidden epsilon, snapping, or near-zero substitution. Root/integral budgets below are separate approximation budgets. Display defaults 12 significant digits, expanded 15; never feed display rounding back into compute. Raw JSON serializes binary64 values as shortest round-trip decimal (≤17 significant digits), input decimal strings, status, achieved error estimates, bounds and exact-revision/algorithm hash. CSV raw columns use same strings; PDF contains display values plus revision and error/status metadata. UI says approximately where appropriate. High precision oracle is independently implemented at ≥100 decimal digits (e.g. MPFR); independence excludes calling the production AST evaluator or using Math as oracle. Tight tests include cancellation, ill-conditioned expressions and boundary uncertainty. Error estimates and empirical test budgets must never be relabeled mathematical proof or lifecycle certification.

Formal alternative: outward-rounded elementary evaluation and rigorous integral/curve enclosures can establish certified numerical bounds for accepted cells; exact-rational polynomial square-free/Sturm isolation may establish complete roots and multiplicities for degree≤20. These are optional stronger product policies, not mandated by Blueprint or recommended as the initial full product profile. Preserve scope and uncertainty labels when selecting the recommended numerical implementation.

## G-03: adaptive graph and gap contract

Compute outputs contain original request, normalized AST hash, mode, constants/angle mode, numeric profile, view bounds, ordered sample records `{u,x,y,status,errorEstimate,segmentId}`, interval cells `{left,right,status,reason,errorPx}`, gaps and budget use. Undefined, unsupported, unresolved and overflow cells are first-class records, not omitted points. Samples and analysis are authoritative data; renderer never evaluates independently. Auto y range uses finite samples only, labels sampled range, excludes unresolved spikes from a guessed global range, and exposes clipped data counts. Table retains all evaluated positions with status; rows are virtualized but keyboard/search/export reach all records. Derivative/integral tables are separate typed records, not fake plot points.

Deterministic adaptive subdivision uses the initial 81 endpoint-inclusive positions, then left-to-right priority (largest cell screen width, left tie-break), midpoint and quarter probes. Compute uses declared logical viewport 800×480 CSS pixels unless user explicitly changes it; save viewport/profile, never derive math from device pixel ratio. Refine until maximum observed midpoint/quarter deviation from chord ≤0.5 CSS px and the AST domain/continuity guard accepts the cell. This is sampled visual fidelity, not a proof of uniform error or completeness. Use conservative interval/domain propagation to flag denominator zero, log/sqrt domain boundary crossings, negative-base power ambiguity and tan-pole crossings. Domain propagation may overestimate: refine, then leave unresolved cells as gaps at limits. Never join endpoints across a detected or unresolved possible singularity; finite endpoints and midpoint agreement alone cannot authorize a cell. Arbitrary rapidly oscillating expressions may still exceed detectability; report sampled coverage and limits, never assert absence of unsampled features. Poles off grid, removable holes and tangent poles must be blocked by original-AST domain checks; do not simplify away excluded points. Conservative gaps are acceptable with a visible unresolved label. Depth24; total32,768 point evaluations/128,000 domain interval evaluations/2,000,000 AST operations per plot request, worker wall cutoff2s, abort token checked every≤1,024 operations. Deterministic operation/depth caps define reproducible budget status; wall interruption returns CANCELLED without claiming equivalent complete results. Max six curves share aggregate131,072 samples/8,000,000 operations and same2s interaction target; completion may be partial with per-curve statuses. Pan/zoom starts a new versioned compute request and preserves previous result until ready. Zero distinct/grid-collapse states show fallback table and no path. #251 measurements are trace coordinates/sample range, never global extrema. #235 adds separately evaluated numerical analysis records.

## G-04: #235 analysis and #251 reverse solve

All roots/intersections search the selected closed finite interval with AST domain partition, independent of chart pixels. Target solve g=f-target; intersections g=f-h use the same compiler, not subtraction of rounded chart ordinates. Validate candidate in forward engine and retain original expressions/domain. Recommended algorithm: sorted adaptive scan with endpoint/midpoint/quarter evaluations and domain guards, safeguarded Brent refinement of sign-change brackets, plus stationary-point search on the derivative for possible touching roots. Use a pinned audited implementation of Brent and an independently tested polynomial helper where useful; library choice/version/license is a coding prerequisite. Neither a library result nor sampling establishes all roots. Exact endpoint zeros are retained. If a derivative stationary candidate has |g| within residual budget, label it a possible touching root with residual and search bracket, not a proved multiplicity. Derivative behavior may suggest multiplicity but UI says unknown unless analytically established for the exact AST. No sign change never means no roots. Constant-zero AST after safe exact constant folding returns an interval solution set on its original validated domain; constant nonzero returns no roots. Identical ASTs may return identical-on-validated-domain; numeric agreement cannot prove identity.

Stop a bracketed root when width≤max(1e-12,1e-12*max(abs(left),abs(right))) AND forward residual≤max(1e-12,1e-12*scale), scale=max(1,abs(f),abs(target)). Return x estimate, bracket, residual, iterations, termination reason and bracket/domain status. Small residual alone does not establish proximity for ill-conditioned or flat roots. If no representable refinement or conditioning prevents both criteria, return NUMERIC_UNCERTAIN with achieved bounds. Never merge roots using an undisclosed epsilon: overlap of retained brackets gives one unresolved cluster with members, rather than silently dropping roots. Return searched intervals, domain gaps, budget-limited cells and `coverage=sampled-incomplete`. No-root wording is "No roots found in completed search cells" unless a constant/exact special case establishes none. Max65,536 search nodes/1,000,000 point evaluations/8,000,000 AST operations per analysis request, depth64,2s interrupt; BUDGET_EXHAUSTED retains unresolved intervals. Generic root results are numerical candidates/verified residuals, never proof of full root set.

Derivative uses symbolic AST differentiation plus numeric evaluation with chain rule and an independently tested AST simplifier preserving original domain. Expose numeric derivative value and method; abs at zero, sqrt at zero and original holes are nondifferentiable/undefined unless a separate supported analytic rule applies. No smoothed cusp. Derivative AST cap4,096 nodes; unsupported expression/depth returns UNSUPPORTED_DERIVATIVE. Local extrema search combines derivative sign changes, stationary roots and known abs cusps; classify with left/right derivative signs or sampled comparison, explicitly `local-candidate` where numerically inconclusive. Return endpoints separately and a sampled minimum/maximum; never claim global extrema from samples. Derivative zero alone is not an extremum (x^3 at0). Derivative overlay uses the same numeric/plot domain policy.

Proper finite integral: adaptive Gauss–Kronrod15/7 quadrature with error estimate |K-G|, rescaled by a pinned standard algorithm, deterministic largest-estimated-error cell priority (left tie-break), and error target≤max(1e-10,1e-10*abs(total)). Use compensated accumulation. Require original-AST domain checks across every cell, endpoint validation and absence of unresolved singularities before integrating. Independent high precision fixtures and a second refinement pass must satisfy target; runtime successful termination means BOUNDED_ESTIMATE with the achieved quadrature estimate, never a rigorous enclosure. Failure to meet target at budget returns NUMERIC_UNCERTAIN with estimate/work. Split known bounded domain boundaries explicitly; unresolved domain or possible interior pole returns IMPROPER_UNSUPPORTED. No Cauchy principal value, infinite limits or convergent-improper shortcut in this revision. Symmetric cancellation around1/x cannot return0 as a proper integral. Retain sign/orientation and algorithm metadata.

Inverse-function solve requires continuity-domain checks and a supported monotonicity assessment: symbolic derivative sign propagation on the interval where available, exact simple polynomial monotonic rules (including x^3), otherwise adaptive derivative sign sampling returning `monotonicity=empirical` and NUMERIC_UNCERTAIN if ambiguous. Exclude unsupported ambiguous inverse branches, rather than return an unqualified inverse function. Solve f(x)=y by the same bracketed algorithm with forward verification; return branch interval/domain/range and assessment type. x^2 on[-2,2] is NOT_ONE_TO_ONE; [0,2] is a supported branch. #251 inverse relation view simply reflects explicit points and labels potentially multi-valued output. Parametric evaluates x(t),y(t); domain gaps union across both. Polar evaluates x=r*cos(theta),y=r*sin(theta), allows negative r, never forces closure, and uses same angle mode. Refine both coordinate screen deviations with the common domain guards. Parametric/polar analysis of roots/extrema/integrals and implicit intersections is excluded explicitly; explicit analytical tools remain complete within the selected scope.

Formal alternative increment: rigorous outward-rounded transcendental enclosures, interval Newton uniqueness proofs, exact-rational degree≤20 Sturm/square-free isolation with multiplicity, proven monotonic inverse branches, validated quadrature and curve enclosures: additional240–400h over the recommended profile, plus independent specialist review. This stronger branch can claim only the properties actually proved; it is not a Blueprint prerequisite.

## G-05: tiers, scenario and sensitivity bindings

All accuracy controls, domain warnings, angle mode needed to interpret selected mode, raw status and useful core visualization are Free when that mode is offered; identical requests yield identical authoritative results across plans. #251 Pro overlays/scenarios do not reduce Free single-function fidelity. #235 Free analysis is complete within declared scope; Pro adds modes and depth of exploration rather than reducing root precision. Three scenarios each carry complete input/viewport/numeric profile; baseline byte-reconciles with normal compute. Sensitivity sweeps one declared parameter a,b,c over 2–101 finite points in [-1e9,1e9], outputs selected trace ordinate/root branch/integral only; branch loss or ambiguity is a gap, never nearest-root substitution. Pro explanation shows parse tree, substitutions, domain partitions, convergence/error decisions and forward checks. Root shared exports/persistence and Business implementation own entitlement, auth, history/replay, tenant isolation, API/batch/webhook/accessibility; acceptance must execute per-ID adapters and modes and preserve all feature IDs below. No independent alternate formulas in the workflow layer.

## Existing evidence versus required work

At review head `7cdffeed3d5a8789689aa5495277e28b780227dc`: `src/calculators/advanced-math/catalog-batch-10.ts` `sample`, `graphDef`, `graphingCalculator`, `functionPlotter2dCalculator` implements one fixed 81-position finite sampler for both IDs, stores only successful points, sampled min/max and three steps. Blob `ac5f6afd1704fc90ae2672c5ff10b49bef77c28b`, SHA256 `78370a3240b98b4339d88fdaa95cf57ff963f7b780b0956d6fc541909a0f93de`. It is not complete graphing under this proposed contract. Missing: interval/numeric error profile, adaptive continuity, explicit gap records, distinct product branches, analysis/modes, parameter syntax and hardening.

`src/calculators/advanced-math/expression-engine.ts` `tokenize`, `parseExpression`, `evaluateExpression`, `compileExpression` implements stated basic ASCII decimal/scientific grammar, lowercase name normalization, precedence/right-associative powers and intermediate finite guard. Blob `1a24b517ea1eaae6f9d7528e4df89e45989a4fd8`, SHA256 `52af6dda5267eeeeb34830776a054e1ad1e5051560e99f2483bd7879bedf3d24`. SOURCE differences: accepts JS whitespace; no depth/node/operation limits; Math.pow accepts 0^0=1; finite check misses underflow, tangent pole approximation and the proposed reviewed numeric profile. These are implemented behavior, not proof of selected semantics.

`src/calculators/final-framework/advanced-math-visual-core-adapters.ts` `graphResult` outputs finite count, sampled min/max and one series; shares graphingCalculator.sources with both. Blob `ed172f7075dd9cd3f97ddd781bd42f1e4e8dae8e`, SHA256 `f9819631ed937ad8a324936cc4ff1ebe4863f7b97c26efe79322cddae258a576`. `advanced-math-visual-core-presentations.ts` `graphPresentation` is essential, growth-line only, and disables schedule/goal/scenarios/sensitivity. Blob `21b53b368c385f6e9725f9ec4e114bdabb5464b0`, SHA256 `ae7cc37218a8d4607d7714b7f79d2a06d18b7e1a3c3ae42d3f323e2c3b05ea2b`. Missing new structured schemas and enabled selected features; metadata alone is not capability evidence.

Retained `previous-qa/source-changes/src/components/post1518-six-workflow.test.tsx` plus packet bounded evidence demonstrates each mounted actual CalculatorInteractive adapter under synthetic Pro/account transport: [0,Number.MIN_VALUE] yields 81 positions/two distinct values and fallback without SVG path; [0,1] recovers finite line/table; export controls enabled. These are proof for those states only. Export bytes, real authentication/isolation/reload, browser/assistive-tech and production performance remain proof gaps; do not call them necessarily absent implementation. Fresh exact-ref UI bytes in `code/calculator-interactive.tsx`, bound to blob `c3c0beb44a5179a925bb44c64ea47109b82c8211`, were inspected at `FunctionPlotTool` and `FunctionCurve`: both IDs mount the same form, strict-number helper, adapter/renderer, sampled SVG and String(raw) table; account actions receive definition slug/version and scenario metadata. SVG uses segmentSampledGraph for omitted-grid gaps and explicitly says lines are not proof of continuity; this cannot detect unsampled poles. `displayNumber` is used for axis limits; root inspected renderer-display.ts uses up to two fractional digits for abs≥.01 and eight significant digits below, differing from proposed12/15 policy. This bounded UI read does not establish full dependency closure. CI success and historical browser crash do not settle current capability.

## QA fixture set and acceptance

The machine companion maps features, fixture expected outcomes and task ownership. Run each common fixture through both IDs and all plans/modes where applicable. Independent oracle checks decimal conversion and elementary function values at ≥100 digits using separate implementation. Every accepted numeric fixture must meet independent-oracle error budgets; runtime estimates and brackets must retain their actual method/limitations. Existing matching tests may be reused with exact hash binding; these listed fixtures are required acceptance vectors, not newly executed tests.

0. Initial-state workflow: each ID opens with empty expression fields, no curve/result/export-ready payload/history write, and no automatic compute. Use example is explicitly labeled, populates the sample with example provenance, and still requires Calculate; clearing expressions removes stale results. Mode changes with no valid supplied expressions do not calculate. Radians and illustrative viewport defaults remain visible.
1. Grammar: -2^2→-4; (-2)^2→4; 2^-2→0.25; 2^3^2→512; 8/4/2→1; 1e-3+.5→0.501; SIN(pi/2)≈1. Reject 2x,2(x),sin x,x=1,Math.sin(x),x[0],NaN,Infinity,0x10,1_000,1e,empty,whitespace-only,unknown y; boundary 500/501 chars, depth64/65 and 256/257 nodes with parser-safe generators. Injection payloads never execute. Numeric field empty/null/array/Boolean/trailing junk fail, signed/scientific valid.
2. Domain/range: ln(0),sqrt(-1),1/0,0^0,0^-1,(-1)^.5→typed domain error; (-2)^3=-8; sqrt(0)=0; exp(231)→RANGE_UNSUPPORTED; exp(-701)→RANGE_UNSUPPORTED; 1e-308*1e-308→RANGE_UNDERFLOW; x-x yields exact zero; tan at pi/2 and across pi/2 must produce unresolved/pole gap, never a bridged stroke. Radians sin(pi/2)≈1; degrees sin(90)≈1, derivative sin at0≈pi/180.
3. Adaptive rendering: 1/x on [-1,1],1/(x-.123456789),tan(x) on[-2,2],(x^2-1)/(x-1),sqrt(x) on[-1,1],ln(x) on[-1,1] have explicit original-domain gaps and no stroke across them. sin(1000000*x) must return unresolved/budget if fidelity unachievable; endpoint/midpoint aliases cannot certify flatness. exp(x) over large range displays supported portions and range gaps. x on[0,Number.MIN_VALUE]→GRID_RESOLUTION/no path. [0,1] x recovers. Clipping does not connect discontinuities. Every line cell passes domain guards and ≤0.5px midpoint/quarter observed error at800×480; unresolved cells have no stroke. Include adversarial oscillations to verify coverage warnings, not a universal fidelity claim.
4. Roots: x^2-2 on[-2,2] finds two disjoint bracketed candidates near ±sqrt(2), each within root budget; (x-1)^2 finds possible touching root near1 with unknown multiplicity; (x-1)^4*(x+2) finds touching candidate near1 and bracketed root near-2 without unproved multiplicities; x^3 finds0 without classifying it as extremum; x^2+1 reports no roots found, coverage sampled-incomplete; zero polynomial interval solution set; (x-.1)*(x-.100001) two separate roots or honest bound failure, never merged by epsilon; 1/(x-.1) no root across pole; sin(1/x) around0 generic unresolved with no completeness claim. f=x^2,h=2 intersections share candidate brackets; f=f identical-on-domain, not arbitrary selected point.
5. Derivatives/extrema: x^3 at2 derivative12; x^2 local minimum candidate0 at0 over[-2,2] and endpoint values4 tie; sampled range is not global proof; -(x-1)^2 local max0 at1; abs(x) at0 nondifferentiable and cusp minimum; sqrt at0 derivative unsupported; x^3 derivative0 at0 is not extremum. Inverse x^3 on[-2,2] valid despite derivative zero at0 under explicit supported monotonic rule; x^2 on[-2,2] NOT_ONE_TO_ONE, [0,2] valid inverse for y=1→x=1.
6. Integrals: x^2 [0,1] estimate differs from independent1/3 oracle by≤1e-10 and reported estimated error≤1e-10; sin [0,pi] matches independent oracle (mathematical pi semantics) near2 within integral budget; reversed interval negative; zero width0; 1/x[-1,1] and 1/sqrt(x)[0,1] IMPROPER_UNSUPPORTED, no principal-value or convergent-improper shortcut. Integral work exhaustion preserves estimate/status without unsupported accuracy claim.
7. Modes: parametric cos(t),sin(t),t∈[0,2pi] unit circle points; polar r=2 at0/90 degrees→(2,0)/(0,2); r=-2 at0→(-2,0); parametric1/t,t has gap at0; no forced closure if endpoints differ. Cancel, resource limits, malformed AST, repeated requests, six curves, narrowing coordinate collapse, slow device and all render/export modes tested.
8. Reconcile raw chart/table/trace/steps/reverse/scenario/sensitivity/download/API against same structured result, separate per-ID. Download CSV/JSON/PDF/SVG/PNG bytes (PNG pixel content/data-hash metadata), actual plan gates server and page, real-user history/replay and cross-tenant denial. Browser at320/768/1440 widths, keyboard-only trace/table and screen reader summaries include gap counts/uncertain analyses. Operation budgets exact and wall p95≤2s on declared representative browser/device dataset; exceeding targets is pending performance acceptance, never proof from unit-test duration.

## Non-overlapping engineering work estimate

These are proposed implementation estimates, not commitments. Recommended robust numerical profile reuses audited numerical libraries after version/license review; it does not include mandatory formal-completeness machinery. Shared grammar/numeric engine60–90h; adaptive visual/domain engine50–80h; #251 visual adapter/UX32–48h; #251 target-solving UI16–24h (shared root solver reused); #235 numerical roots/intersections50–80h; symbolic derivative/local-extrema/inverse40–64h; adaptive proper quadrature32–56h; parametric/polar32–48h; per-ID scenario/sensitivity/export adapters40–64h total; independent numeric/parser/graph QA64–96h; browser/accessibility/performance32–48h. Total448–698h. Existing library maturity/reusable calculus helpers may reduce implementation work only after exact-head compatibility review; no fabricated minimal estimate is assumed. Formal interval/exact-completeness alternative adds240–400h (combined688–1,098h), plus specialist review, rather than being silently required for initial full product. Root shared auth/history/export delivery/Business/entitlements work is outside these totals and must not be counted twice. Graph export serialization/adapters are included; shared delivery infrastructure is excluded. Implicit-mode alternative80–140h is separate and excluded. Numerical/UX reviewer signoffs remain gates, not implemented work.


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

