# Worker 2 — bounded physics remediation

**RELEASE HOLD ACTIVE. Three isolated numerical successor candidates delivered; all affected catalog IDs remain PARTIAL. Zero scoped completions, canonical approvals, certifications or publication eligibility.**

Baseline: `8296454dc7244205ef4cf0b6e0b41c38f90af20f`.
Previous qualification: `engineering/physics-qualification-20261115` at `9607925df1f4d5bedc765f3c607529d84b440821`, retained in the baseline intake.
Candidate code commit: `3267b4bf2afac70a5d8cd92162f4a6175b56ff24`.
Delivery branch: `engineering/worker2-physics-remediation-20261116`. Final remote SHA is returned after push/readback; the final evidence-only commit preserves these exact candidate bytes.

All edits are additions under `tests/worker2-physics-20261116/` and `docs/worker2-physics-20261116/`. No Worker1/3 files, application `src`, historical v1 engines, old private implementation, replay dispatch, registry, shared source/admission manifests, dependencies, SQL, workflows or PR1538 were modified. The candidates live outside application source and default test discovery. They are **unregistered and not admitted to live source policy**. Local provenance bindings are not an authority grant.

## Per-defect work and disposition

All three identities have version1 within distinct namespaces and revision `private.worker2.physics-numerics.20261116.1`. This is not historical version1 replacement or an automatic version2 upgrade.

| ID | Separate candidate ID | Reproducible predecessor witness | Proposed correction / current disposition |
|---|---|---|---|
|324|`private.worker2.physics.projectile-tiny-angle`|`speed=2^300,angle=Number.MIN_VALUE,gravity=1`: old private conversion/sine becomes0; resulting range0. Candidate gives `7.156314503058255e-145`.|For degree angles<=`2^-500`, retain speed,speed,2,angle,Math.PI as separate numerator factors and180,gravity as denominators. The linear-sine approximation is explicitly bounded below. Else retain the old binary64 libm sine operand. **Bounded numerical candidate validated; source/precision/adoption pending.**|
|325|`private.worker2.physics.free-fall-exact-product`|`gravity=Number.MIN_VALUE,time=2^100`: `.5*gravity` rounds0 before time multiplication; historical result0. Exact product is `2^-875 = 3.9696644133184383e-264`.|Accumulate `.5*gravity*time*time` as exact binary64 factors, then round once. **Intermediate-loss correction validated as a candidate; physical applicability, numerical policy and adoption pending.**|
|323|`private.worker2.physics.coulomb-exact-ratio`|`charge1=charge2=1e-200,distance=1e-100`: old private result `8.987551792299997e-191`; one final rounding of the retained exact binary64 operands gives `8.987551792299999e-191` (two representable steps apart).|Accumulate the same binary64 `8.9875517923e9` and charge/distance operands exactly and round once. **Proposed numerical-policy candidate validated; not an established violation of an approved tolerance.** Constant precision and physical/adoption decisions remain unresolved.|

`witnesses.json` records the exact numeric inputs, observed predecessor/candidate outputs, candidate identity and pending policy/admission status. `receipts/red-predecessors.log` contains the three real failing predecessor assertions run before candidate implementation. The final tests preserve those predecessor outputs and separately require corrected candidate behavior; they do not change v1 expectations.

## Source justification and numerical boundaries

The unchanged historical source `src/calculators/physics/catalog-batch-3.ts` supplies the three expressions, binary64 Coulomb constant and existing input domains. The unchanged private `experimental/physics-scaled.ts` supplies prior factor-scaling intent, strict Coulomb/projectile schemas and named revision `private.physics-scaled.20261112.1`. The prior qualification/intake supplies the reproducible underflow mechanisms. No new physical model, medium, unit system, constant value, launch-height model or endpoint convention was selected.

The proposed factor primitive decodes binary64 factors into exact integer significands/powers of two, forms an integer rational, chooses the final normal/subnormal spacing and rounds nearest with ties to even using integer remainder comparisons. Intermediate products never underflow or overflow. A nonzero exact result that rounds to zero, or a result that rounds to infinity, is refused. Exact zero factors return+0. This final-range/zero policy follows the earlier private candidate's direction but is **a proposal for the new free-fall candidate**, whose historical engine instead accepts underflow zero. Rounding once can also change ordinary last bits; such changes never migrate into historical snapshots.

For tiny degree angles, let `r=2*angle*Math.PI/180`, interpreting the retained binary64 Math.PI as an operand. For `0<angle<=2^-500`, `0<r<2^-504` and `0<=1-sin(r)/r<=r²/6<2^-1008`. The implementation evaluates the linear factor expression without materializing r. It therefore recovers the demonstrated tiny-angle loss with a stated approximation bound. This is **not universal correctly rounded transcendental evaluation**: even an extremely small approximation error may affect a near-midpoint result. The bound does not authorize an adoption tolerance. Outside the branch, the existing libm operand and positive90-degree sine residual are retained; final products use the proposed one-round arithmetic.

The independent oracle parses exact operands through radix-2 strings and uses Decimal arithmetic, rather than reusing the candidate bit decoder, integer quotient or rounding code. The factor reference uses1600 significant digits; the sine reference bounds both input digits and requested precision to400 to fit decimal.js's finite internal pi table. Selected sine results agree after binary64 conversion; for the smallest angles,400 digits cannot resolve the still smaller sine correction itself. The analytical bound and finite tests are separate evidence, not an exhaustive precision proof.

`source-bindings.json` binds seven unchanged baseline evidence/source files and six candidate/test/config files through exact Git refs, blobs, byte counts and SHA256. It explicitly says `WORKER_LOCAL_PROVENANCE_ONLY_NOT_LIVE_SOURCE_ADMISSION`. An integrator would need an independently governed admission of these exact candidate bytes; no shared manifests were changed to manufacture it.

## Validation and retained failures

Runtime Node `v24.19.0`. Existing dependency tree reused only after verifying the baseline lockfile was unchanged from prior qualification; no install, package or lockfile modification.

| Check | Result | Receipt |
|---|---|---|
|Initial proposed-behavior assertions on actual predecessors|3 expected failures|`receipts/red-predecessors.log`|
|Final candidate/oracle/preservation suite|156 passed across3 files|`receipts/candidate-boundaries.json`|
|Retained physics, private scaling, domain and historical replay regressions|155 passed across8 files|`receipts/retained-physics.json`|
|Prior qualification/source-byte/identity suite|15 passed|`receipts/previous-qualification.log`|
|Current source-stage9 adversarial preservation|5 passed|`receipts/retained-source.log`|
|Focused ESLint / repository typecheck|Both exit0|`receipts/lint-final.log`, `receipts/typecheck-final.log`|

The156 candidate cases include independent exact-factor boundary comparisons, normal even/odd halfway ties, exponent carry, subnormal rounding and rejection, normal/subnormal transition, exact overflow midpoint and below-midpoint result,96 deterministic Coulomb operand cases, charge-swap/sign/scaling invariants, free-fall power-of-two cases, tiny-angle high-precision sine checks, strict domain refusals and immutable/replay identity refusals. Counts in different suites overlap and must not be summed into a unique total.

Reproduce:

```sh
node node_modules/vitest/vitest.mjs run --config tests/worker2-physics-20261116/vitest.config.ts
node node_modules/vitest/vitest.mjs run src/lib/calculator-factory/cohorts/physics.test.ts src/lib/calculator-factory/experimental/physics-scaled.test.ts src/lib/calculator-factory/completion/physics.test.ts src/calculators/physics/physics-five-independent-numerics.test.ts src/lib/batch22-physics-replay.test.ts src/calculators/physics/catalog-batch-3.test.ts src/calculators/physics/catalog-batch-3-boundaries.test.ts src/calculators/physics/physics-batch-3-direct-domain-validation.test.ts
node node_modules/vitest/vitest.mjs run --config tests/physics-qualification-20261115/qualification.vitest.config.ts
node --test tests/four-worker-integration-20261115/source-stage9.test.mjs
```

Git-subprocess checks need environment subprocess permission; no assertion was weakened. Independent software review found no blocking algorithm defect and suggested the additional tie/carry/overflow cases now included. The review shell independently passed144 checks but hit sandbox EPERM on nine Git-subprocess checks; the primary permitted run passed all156 final cases. This is software review, not competent physical review.

Retained intermediate oracle attempts failed because decimal.js's sine implementation raises working precision by input significant digits, exceeding its internal pi table; one transformation fixture doubled a charge above the unchanged1e100 domain. The oracle now bounds both sine input and requested precision; the metamorphic fixture stays within the same schema. No candidate mathematical correction was required by these harness failures. Earlier failed JSON/logs remain present, including `candidate-tests.json`; only `candidate-boundaries.json` is the final complete156-case receipt.

Full-product suite/build, fresh authenticated/browser/native delivery, hosted CI and production tests were not run. These candidates have no integrated runtime surface to authenticate or publish. Prior historical authentication evidence is retained in the baseline and **does not transfer** to these identities.

## Stop boundary and remaining decisions

Further work now requires unavailable authority rather than another numerical implementation:

- **324:** approved physical units and ideal launch/level-ground applicability; endpoint policy; acceptance of the bounded tiny-angle branch/libm scope and final rounding/range behavior; independent source admission, registry adoption and exact-revision product/authenticated/native delivery.
- **325:** approved time/gravity/distance units, from-rest/constant-gravity/zero-gravity applicability; explicit one-round and final-zero/refusal policy; independently admitted successor, registry/replay design and exact-revision product/delivery acceptance.
- **323:** approved medium/point-charge and signed-force applicability, units, Coulomb constant precision and numerical tolerance. No tolerance is inferred from the two-ULP witness. Independently admitted/adopted identity and exact-revision product/authenticated/delivery evidence are still absent.

Work stopped at these boundaries. No investigation of322/327 was reopened. No full-domain precision, scoped completion, canonical approval, certification, publication or production readiness is claimed.
