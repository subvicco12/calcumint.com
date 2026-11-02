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

