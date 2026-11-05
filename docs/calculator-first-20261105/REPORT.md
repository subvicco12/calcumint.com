# Calculator-first software closure — 5 November 2026

Baseline: draft PR1522, `4796b3d7679a06f0751cac8cfec687c88f386ae5`. GitHub PR head, parent ancestry and hosted CI41515635256 SUCCESS were independently verified. No newer open engineering candidate existed at verification. Work uses the existing isolated worktree on separate branch `engineering/calculator-first-20261105`. Exact delivery SHA, successor PR, one bounded hosted-CI observation and measured interval accompany the immutable Drive delivery checkpoint; this report does not manufacture its own commit hash.

## Actual functionality completed

1. **Calculator identity isolation.** Reproduced a Ratio draft `{a:999,b:18}` leaking into Average on an in-place identity transition. Calculator-keyed mounting now initializes the destination's own `{a:10,b:20}` defaults and preserves drafts on same-calculator rerenders. The shared launch caller was extracted without changing a registered schema, formula, default or version.
2. **Accessible contract-driven validation.** Existing integer, minimum and maximum constraints are reflected in controls; other admitted decimals use `step=any`. Required/precision-loss/domain errors receive stable labels, `aria-invalid` and linked field-specific descriptions. Invalid or nonfinite results disable the original save/export paths; valid zero recovers. An initial test mistakenly assumed a 12-place rounding cap; the authoritative engine has no such cap. The test now checks its actual integer rule and Factor's actual 1,000,000,000 maximum. No cap was added to mathematics.
3. **Calculation-bound explanations.** Completed explanations and pending requests belonged to the previous inputs after edits. Explanations now reset on exact calculator/formula/input/output context change and abort obsolete requests. Equivalent rerenders preserve the current explanation. AI still does not calculate replacement numerical results; no provider availability or source authority is claimed.
4. **Real history/scenario recovery.** The central exact-engine verifier rejected every one of the 41 unblocked launch-v1 contracts, preventing exported scenarios from recovery and saved records from explicit verification. An explicit v1-only allowlist now enables exact input/output agreement, separate recovered working sets, and rejection of extra fields, unsupported versions, altered outputs and invented approval fields. No saved record is rewritten, upgraded or silently recalculated. Blocked #214/#217/#268 are excluded.

These are software changes, not additional private calculator wrappers or canonical acceptance promotions.

## Exact calculator coverage

The first20 remain: **209,210,218,219,220,221,225,255,256,259,260,261,262,265,266,267,273,278,279,280**. Their affected browser suite reran unchanged: 120 plan/layout journeys and three unregistered Polygon successor-preservation cases.

The other21 unblocked candidates are: **208,211,212,213,215,216,228,229,263,264,269,270,271,272,223,224,226,227,231,234,230**. Each has an exact registered-v1 binding, an independent numerical witness, boundary and rejection (63 total), and six actual-source browser contexts (126 total). Saved-record action components verify all21 on Free/Pro/Business. All41 have strict forward replay and separate-copy scenario unit acceptance; all three blocked cases retain explicit exclusion tests.

The remaining browser campaign exercises trusted numeric edits, blank/error/recovery, native constraints, input/result artifacts, invalid-save/export denial, paid JSON export/replay/tamper rejection, Free export absence and mobile/desktop reflow. Paid mobile journeys also capture, export, recover and adversarially tamper a scenario set while preserving earlier valid scenarios. One additional client-side identity transition reproduces and closes the draft-leak defect. Authentication/account transport and stored-record props are synthetic. Genuine authenticated persistence, cross-tenant authorization, physical devices, screen readers, complete accessibility, charts and full canonical workflows are not established by these receipts.

## Numerical limitation discovered: #224

For `{x:81,base:3}`, Node's native logarithm ratio returned `4.000000000000001`; Chromium returned `4`. Every browser plan/layout produced identical artifacts. Both agree with the independent bounded engineering witness under its disclosed `1e-14` observation budget, which is not an approved product tolerance. `engineering-closure.json` preserves both exact outputs and marks cross-runtime numerical policy blocked. Strict replay remains exact: a differing record in another runtime is refused, not normalized or accepted with a new tolerance. Historical v1 mathematics and the pending precision/refusal/display policy remain unchanged. Exact per-runtime agreement is not full-domain or cross-runtime proof.

## Historical and CI integration

The original six-packet guard intentionally binds the predecessor caller, so it correctly rejected the changed caller. Neither that guard, its eight negative tests, the original full-six guard and manifest, frozen packets nor historical manifests was edited. A separately reviewed wrapper validates the new caller/extracted implementation hashes and original guard/test hashes, then runs the original verification in an isolated exact predecessor fixture. All other bound files come from the current tree and must still match the frozen capture. Two packets/21 bindings, the original full-six guard (24 source bindings and25retained inputs), eight original negative tests and ten successor mutation tests pass.

Review found and corrected a shallow-CI dependency: the wrapper needs baseline4796b3d as well as historicalc1c7371/af94b00. CI explicitly fetches all three exact refs. A fresh local depth-1 repository with only those objects passed. All five CI jobs, aggregate requirements, caching, security and certification checks remain. The new browser step has an eight-minute bound calibrated above the measured local campaign. Its existing publication-factory job budget grows from12 to20minutes to accommodate the added work; all original steps, the other job budgets and assertions remain unchanged. A trial move into the historically frozen build job was rejected by the existing48-check contract and reverted without changing its assertions. No polling or required checks were removed.

## Validation and review

Final `npm run test:production` exited0: **7,571 unit tests passed, four existing skips; 45 launch checks; 15 certification checks; lint0errors/29existing warnings; typecheck; next build --webpack**. Additional post-integration lint/typecheck, Node22.23.4 numerical receipt reproduction, 48 five-job/cache checks, the historical fixture/mutation tests and evidence reproduction checks passed. The initial full run had one new test-fixture routing typo (7,526 passes plus one failure); it was corrected and the full final run passed. Original transient sandbox/network limitations and the initial unsupported-replay failures were not counted as passes.

Independent read-only reviews examined production callers, strict recovery, fixtures, evidence honesty, frozen-source protection and CI. The missing shallow baseline fetch was the only important finding and is corrected with a reproducing fresh-repository test. Review is engineering review, not a mathematical, canonical, specialist, QA or publication approval.

## Source reuse, preservation and publication disposition

Drive AGENTS and the 27-artifact index were read directly. The committed 44-row readiness register matches Drive's indexed SHA256 `f9377f378668aaf6626c59872d238757a7158851628dfbd97b3b1bb30e441ae1`. Existing first20 source packages and exact QA records were reused without broad inventory or source research. Original pending/partial statuses and all1,100 retained obligations are carried into the44-row supplemental closure register without formal promotion.

`preservation.json` verifies 540 catalog identities, 424 acceptance records and unchanged engine/registry/catalog/source evidence. Original14DRAFTs, 43 authority blockers, all historical engines, the completed Decimal50 worker/UI/replay subscopes and the unregistered Polygonv2 remain preserved. Source records and immutable historical manifests were not regenerated.

**Newly canonical-accepted:0. Newly publication-eligible:0. Newly live:0.** No formal QA passes, reviewer approvals, N/A decisions or source approvals were invented. Current live counts were not redundantly re-audited. No production SQL, lifecycle write, certification promotion, payment activation, merge, deployment or publication occurred. RELEASE HOLD active.

## Remaining decisions and effort

See `blockers.md` for exact conditional work. #214 rounding, #217 identity/full weighting scope and #268 version adoption remain blocked as directed. All44 still require complete canonical scope/mapping, applicable source provenance, accountable mathematical/QA review and authoritative lifecycle evidence. #224 adds an explicit cross-runtime precision/replay limitation; no regulated assumptions were introduced.

Measured effort is reported as elapsed UTC time from branch creation (16:05:12Z) through the Drive checkpoint, including tests and review; it is not a claim of human labor hours or a guaranteed all540 completion date. No known demonstrated independently authorized defect remains unfixed within this batch's reproduced cases. Conditional implementation estimates require actual scope/policy decisions; no generic calendar completion forecast replaces them.
