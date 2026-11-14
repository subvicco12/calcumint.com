# Independent software review — repair requested

Reviewed all12 changed SRC files at APP `5d4df0b462991053c95ebcdd85d6d9b0f4024bc8` against baseline `eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8`. This is software review only and grants no canonical, source, certification or publication approval.

## P2 — known output units disappear in shared result and native delivery

New math/geometry contracts omit the unit metadata consumed by `factoryResult`, although their calculation adapters supply the correct analysis units. Ordinary calls demonstrate:234 observed98/actual100 returns2 without `%`;279 degrees180 returnsπ without radians;280 radiansπ returns180 without degrees;272 radius3/height5 returns47.1238898038469 without cubic units. Both the common result and `runFactoryEmbedCalculation` omit units. Thus analysis and shared/native results disagree about the quantity metadata.

Repair the applicable contract unit or outputUnit mapping, reuse it across presentation paths, and add assertions for those four witnesses plus representative area/length/dimensionless results. Do not invent physical units for geometry inputs where only compatible generic units are established. The arithmetic itself was not shown incorrect by these witnesses.

## Independent verification and limits

Executed `node docs/milestone100-20261114/review/independent-review-probes.mjs`. The retained JSON shows all69 native tuples unique, registered and bound to exact factory ID/slug/version, with matching default replay outputs. All69 rejected version2 and extra fields.222 remains private due the known power alias collision;276/277v2 remain intentionally excluded. All three new numeric forward entrypoints refused accessors without getter evaluation and rejected symbol fields.

Inspected inverse direction and replay refusal, bounded numerical guards, frozen snapshot copying, partial scope descriptions, source/units restrictions, and UI finite-sample behavior. No additional demonstrated new defect was established. The changed tests were read; this review did not duplicate root's reported258-test/lint/typecheck run or execute a build. Existing native input precheck getter behavior predates this diff and is not reported as a newly introduced defect.

The bounded contracts still require applicable integrated browser/account evidence, final exact-revision verification, and separate competent source/canonical acceptance. Release hold remains in force. Re-run the probes after repair with updated assertions; the current probe intentionally asserts the demonstrated missing metadata and will need to change when fixed.

## Follow-up — W100-R1 resolved in current working tree

The repair adds `%` to234's contract and a single geometry output-unit mapping shared by contract metadata and capture. Executed fresh probes confirm common result and native delivery now agree for234/272/279/280 and258, while numerical output matches unchanged exact forward replay. All69 native tuple, refusal and three accessor/symbol entrypoint probes pass again. This resolves the demonstrated software defect in the working tree; final APP pin remains pending.

Independently captured the baseline catalog using read-only `git show`, verified its SHA256 `171aa03828ca3adb5880123d0c303ca6b98d598c70ab906baef3c59ef5ed61c9`, and proved its44 literal tuples exactly equal retained-catalog44.json. The live69 exactly equal that44 plus the explicit25 new witnesses. The SQL test now retains historical44 assertions and adds separate complete69 successor assertions; it does not slice/filter the live roster to satisfy old SQL. Registry/share roster tests extend explicit expected lists, and automation tests extend the exact value+steps shape only for the three chemistry successors.

Executed the five focused changed integration/test files:232 tests passed; one historical-pin test could not complete because its nested `spawnSync git` returned EPERM in this execution sandbox. The full69 SQL-map test and other SQL checks passed. This is an environment execution limit, not a demonstrated assertion mismatch; the separate capture/hash check above independently verifies the historical catalog evidence. Full log: `repair-focused-tests.log`. No all-green claim is made for this five-file run.

## Reproducibility and independent source boundary

Converted the review probe to ESM `.mjs` with static Node imports and `createJiti`, removed the untracked CommonJS version, and executed the new script and targeted ESLint successfully. The JSON records the actual application HEAD used for this fresh successful69-tuple/unit/accessor check; its script hash is recorded in independent-review.json. No application SRC changed during this step.

The geometry source follow-up now contains genuine frozen OpenStax9.3–9.6 and NIST source bodies, metadata and hashed excerpts. These establish concrete proposed formula applicability for bounded cone272, prism274/275, Pythagorean278 and angle conversion279/280. They partially support257/258 but do not cover all Heron/angle outputs. They do not resolve254/268/276/277, generic solid-family authorization or234's exact percent-error provenance. Independent capture, software verification, complete-product scope and competent formal approval remain separate facts; no source/canonical approval is granted by this review.
