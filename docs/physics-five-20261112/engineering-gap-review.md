# Physics five bounded numerical evidence extension — 2026-11-12

Release hold remains in force. This isolated change adds tests only. No engine, formula, version, lifecycle record, application, entitlement, preserved browser evidence or canonical ledger is changed.

## Existing requirements and evidence

`docs/blueprint-reconciliation/blueprint-to-540.json` records IDs322,323,324,325,327 as registered implemented candidates, not approved canonical mappings; each retains `FULL_CONTRACT_AND_EVIDENCE_REVIEW_REQUIRED`, unknown source/review restrictions and missing full-domain independent numerical acceptance. The original Blueprint is recorded there with SHA256 `d9534dbcce0eb8a301beb5d1027a4bd50022ce863c30b461ae6f53fdf7724455`.

The recorded acceptance ledger clauses BP-0117-0118 (typed validation and technical revision) and BP-0433-0434 (unit tests, golden vectors and boundaries) support expanding numerical regression evidence. BP-0433-0434 remains BLOCKED by authority/review gates; these tests cannot close that requirement wholesale.

Read acceptance producer `tests/physics-five-20261111/acceptance.mjs` and external `/workspace/artifacts/physics-five-20261111/REPORT.md`. Existing producer06a30b465c6f7ea7e9a99bb4c37099904a1d6d71 and retained verifier8cc6a46aeee74cd922de3b424c51b95075831caf preserve15 genuine local authenticated journeys and50 completed native exports. This change neither reruns nor extends their coverage to a new application revision.

## Narrow engineering gap

Existing `catalog-batch-3.test.ts` covers default examples, sign-only Coulomb force and selected invalid denominators. `catalog-batch-3-boundaries.test.ts` adds selected schema failures; `physics-batch-3-direct-domain-validation.test.ts` checks one input field's positive infinity and repeats golden examples. None supplies the new literal analytical vectors or all-input invalid-number matrix.

New `src/calculators/physics/physics-five-independent-numerics.test.ts` adds25 independently specified literal expectations and48 direct-call rejection witnesses. Expected outputs are not read from golden fixtures, exports or presentation adapters. Relative error tolerance1e-14 avoids an absolute tolerance swallowing tiny nonzero values; zero witnesses demand exact zero. This verifies the observed existing signed/ideal scalar contracts, without declaring those contracts physically or canonically complete.

| ID | Existing identity/version | Additional bounded witnesses | Remaining individual criteria |
|---|---|---|---|
|322|physics.capacitance/1|Zero charge, signed charge and voltage, fractional ratio, upper finite ratio; both fields' invalid-number rejection|Approve signed Q/V interpretation, compatible unit metadata, canonical scope/identity/version, numerical range/rounding policy, authoritative methodology/source applicability and competent review.|
|323|physics.coulomb-force/1|Zero charge, exact signed force, swapped charges, both-negative charges, inverse-square distance; all three fields' invalid-number rejection|Approve signed-force convention, Coulomb constant value and precision, medium/point-charge assumptions, units, canonical scope/identity/version, full numerical range/rounding, source applicability and competent review.|
|324|physics.projectile-motion/1|Zero speed, zero angle, complementary30/60-degree ranges, inverse gravity; all three fields' invalid-number rejection|Approve ideal level-ground scope, degree/unit metadata, endpoint numerical policy, full-domain stability, canonical identity/version, source applicability and competent review.|
|325|physics.free-fall/1|Zero elapsed time, zero gravity, fractional time, quadratic time scaling and linear gravity scaling; both fields' invalid-number rejection|Approve from-rest constant-gravity scope, zero-gravity interpretation, units, numerical range/rounding, canonical identity/version, source applicability and competent review.|
|327|physics.angular-velocity/1|Zero displacement, signed and fractional ratios, inverse time scaling, upper finite ratio; both fields' invalid-number rejection|Approve average angular velocity interpretation, radian/time units, signed scope, full numerical range/rounding, canonical identity/version, source applicability and competent review.|

All five additionally retain full-domain UX/accessibility/performance, production build/CSP/schema equivalence, billing/provider acceptance, and full history/scenario/export reconciliation beyond the finite preserved run5 evidence. The original run5 limits remain intact. No N/A, exemption, appointed review, source approval, certification, publication or completion status is inferred.

## Validation

Coordinating lane allocated one focused CPU window. Node22.23.4 executed `node node_modules/vitest/vitest.mjs run src/calculators/physics/physics-five-independent-numerics.test.ts --maxWorkers=1`: one file,73 tests passed,413ms total (19ms tests). `git diff --check` passed. The73 cases comprise25 numerical vectors and48 invalid-number cases across12 input fields. No build, broad suite, browser/authentication run, production action, push or PR is part of this change.
