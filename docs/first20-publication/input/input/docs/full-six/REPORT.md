# Owner-authorized full-six engineering increment

Baseline: draft PR #1519, `7cdffeed3d5a8789689aa5495277e28b780227dc`; exact-head CI #41420268580 freshly verified SUCCESS. Work uses a separate successor worktree/branch. RELEASE HOLD remains active.

## Authorization and input integrity

The direct user request authorizes recommended OWN-01–08 for isolated engineering/testing. Attached documents remain source material: their proposal, pending commissioning and original approval fields are retained verbatim. They neither override the user request nor establish mathematical certification, qualified applicability, lifecycle authority or release permission.

`CalcuMint_Six_Contracts.zip` SHA-256: `787448824ea5988098639f590d14a9de7fe65ea12d9bf891e37ac96288b1557c`. All 125 unique archive members passed CRC; all 124 root-manifest entries matched sizes and SHA-256. Twenty-five retained members including the original manifest and native Blueprint are retained under `input/` and verified by `scripts/full-six/check-evidence.mjs`. This establishes supplied-byte integrity, not fresh publisher authentication. Original complete scope and 28-task plan remain represented; no requirement was removed to match this increment.

## Functional engineering

### Current registered input correction

Three actual Percentage interface regressions demonstrated silent representation loss: `9007199254740993` became another integer, `1e-400` became zero, and `0.10000000000000001` lost digits before engine validation. The current caller now imports a new strict boundary using the existing decimal-token parser. Unsupported new input remains visible, suppresses successful results and cannot be saved/exported. Explicit zero and supported inputs recover unchanged outputs.

Only one existing application source line changed. Original `numeric-input.ts`, historical engines, registry, replay readers and evidence documents remain unchanged. The correction applies only to existing `requiredCalculatorNumber` call sites, including the shared launch interfaces. Other finance-specific and direct-Number sites are not claimed audited or fixed. Decimal statistics use their own exact-string contract and are not narrowed to binary64.

Validation includes 413 focused existing/new tests, real account-action component denial/recovery on Free/Pro/Business, and 18 Chromium journeys: three rejected tokens × three plans × two viewports. Free's exact Save-only action set and Pro/Business's four actions are asserted; this is not a weakened universal button count. Four additional existing Percentage/Unit mobile/desktop browser journeys passed. Browser account transport is synthetic: no genuine authentication, production persistence, physical device or specialist acceptance is inferred.

### Decimal statistics foundation: #282 and #283

New unregistered library code implements explicit raw/frequency population/sample statistics with 1–10,000 stored rows, at most 10,000,000 effective observations, integer frequency validation, exact ordinary decimal parsing, missing-value rejection or explicit omission, and distinct counts. Inputs allow at most 34 significant digits and adjusted exponent −100..100.

BigInt lattice/rational arithmetic avoids input representation loss and cancellation; Decimal50 performs final division/square root. Outputs include sum, mean, centered M2, variance, standard deviation, extrema, range, type-7 quartiles/median, IQR, raw MAD and mean absolute deviation. Frequency observations are not expanded into memory. Forty-five tests include 20 independent Python Fraction/100–200-digit oracle cases, tiny near-identical values, cardinality and rejection boundaries. An algorithm/error-budget rationale is recorded without substituting for qualified numerical review.

Paired experimental workflow adapters preserve distinct IDs, contract hashes, primary fields and original versus squared units. Actual engine artifacts match across plan contexts because plan does not affect arithmetic. Exact JSON replay checks the selected identity, implementation revision and contract; a separate recomputation detects modified outputs even when their digest is recomputed. This is experimental workflow software, not an allocated registered successor, canonical route, authenticated history or production entitlement proof.

### Shared foundations: #235, #251, #275, #276, #282, #283

- Strict typed experimental artifacts retain exact decimal strings, original inputs/modes, contract/algorithm/source bindings and explicit non-success outcomes. “Finite” artifacts reject overflow/nonzero underflow under an explicit ±1000 adjusted-exponent envelope.
- Display uses domain-independent presentation only: 12 significant digits by default, 15 expanded, half-even rounding, approximation/uncertainty labels and retained signed-zero raw serialization. No historical renderer was replaced and displayed digits do not certify compute accuracy.
- Explicit geometry unit/dimension conversions provide reusable Decimal50 groundwork; unsupported units and cross-dimension conversion fail. No gallon identity or non-SI source adoption was invented.
- Immutable snapshot JSON retains exact strings and freezes copies. No latest-version fallback. Creation and reading share the 2,000,000 serialized-character limit; save fails before success if the artifact cannot be replayed. Digest integrity is not authentication, approval or proof of correct computation.

Independent review exposed the finite-artifact exponent hole and a producer/reader size mismatch. Both were corrected and the 13 snapshot tests rerun independently. New modules live explicitly under `src/lib/full-six/` as unregistered foundations; the frozen registered-engine tree and historical reconciliation assertions are unchanged. This is not an exclusion added to weaken an inventory guard: no registered engine or canonical implementation class was promoted, and every new library has a separate source binding in `execution-manifest.json`.

## Fast-publication lane

`../fast-publication-20261102/registered-review-queue.json` contains 44 exact basic-math/geometry registered launch candidates, excluding the six expanded targets and ambiguous identities. It reuses existing 540-row readiness, canonical and requirement sources, preserving every tuple, provenance pointer and all 25 retained unmet requirements per candidate (1,100 total). It does not infer that all unmet requirements are absent software, rank global simplicity, or transfer family evidence. Seven mutation/identity tests and deterministic generation check pass.

New complete canonical contracts established: **0**. New publication-eligible calculators: **0**. Release wave: **empty**. The previous 209 public-engine observation is historical, not a new live count or approved canonical binding count. Exact scope adjudication and accountable QA/source/reviewer/lifecycle evidence remain necessary; code and passing tests do not replace those decisions.

## Validation and preservation

See `validation.json` for exact commands, receipts, attempts and remaining external acceptance. The first full run was not green: the default sandbox denied loopback/subprocesses and the historical reconciliation correctly detected new prototype files initially placed in its source tree. Modules were relocated into the explicit unregistered library area, without changing old hashes/assertions; full validation was rerun with supported local-fixture permissions. No failed attempt is represented as a product pass.

All 194 protected source hashes verified unchanged. Catalog CSV, 424 acceptance ledger, registry and historical mathematics are byte-identical to baseline. All 540 identities, original 14 DRAFTs, 43 authority blockers and source records remain protected. Existing 1,207 pending QA decisions are unchanged. No production SQL, migrations, lifecycle writes, payments, certification, publication, merge or deployment occurred.

## Remaining work and effort

This increment closes reusable subscopes, not entire SH-T1/SH-T2, ST-JOINT tasks or any of the six full products. Histogram/rational bins, contribution tables, transforms/reverse/sensitivity, worker cancellation and representative browser performance, full modes/units/line/solid/grammar algorithms, private UI, authenticated persistence/scenarios, complete report bytes and assistive acceptance remain unfinished. Technical successor allocation and canonical routing remain pending.

Suggested next independent tranche: statistics worker/cancellation and private component integration (16–24 engineering hours); histogram/contribution tables with exact provenance (16–24); transforms/reverse/sensitivity (24–40); versioned authenticated workflow/export integration (16–24). These are estimates for specific remaining work, not measured hours or a claim to finish the whole program. The package's 772–1,202-hour full-six planning estimate excludes external review and cannot be mechanically reduced by tests or module counts. The remaining 44-candidate scope/reviewer decisions and all authority/qualified obligations have no invented completion date.
