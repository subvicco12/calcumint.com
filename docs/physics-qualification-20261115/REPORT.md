# Physics queue qualification — 15 November 2026

**RELEASE HOLD ACTIVE. No target gains scoped engineering completion, canonical approval, certification or publication eligibility.** All five remain PARTIAL. The evidence supports additional qualification witnesses, not an authorized change to historical mathematics or adoption of a physical contract.

Baseline: `3ccdd6d026ca0ec51063ff4501901ac92e8ace6a`.
Isolated branch: `engineering/physics-qualification-20261115`.
Committed harness tested: `9af9210d70302312595ae4917a861954a4df89e2`.
Entire application `src` tree: `351339f16f711d7a6838f54e60062c261e81aa7a`, identical to baseline. The final documentation commit preserves that tree and the tested harness bytes. Final remote delivery SHA is reported separately after push/readback, avoiding a self-referential commit claim.

PR1538 and its branch were not modified. No runtime, historical/private engine, registry, admission policy, dependency, script, workflow, migration, canonical ledger or production resource was changed. No new successor was created or adopted.

## Per-ID disposition

| ID | Exact assessed identity | Disposition and genuine blockers |
|---|---|---|
|322|`physics.capacitance` / `capacitance-calculator` @1|PARTIAL. Existing signed Q/V scalar and historical delivery work; publisher-defined compatible units and signed physical applicability remain unapproved. Nonzero quotients can round below the minimum subnormal; this is a final representation limit, not recoverable intermediate underflow.|
|323|Historical `physics.coulomb-force` @1; private `private.physics-scaled.coulomb-force` / `private-physics-scaled-coulomb-force` @1, revision `private.physics-scaled.20261112.1`|PARTIAL. Historical numerator-underflow zero must replay unchanged. Private scaling recovers selected representable results, but medium/point-charge assumptions, signed-force convention, units and constant precision are unapproved. The private identity is unregistered and has no exact-revision product/account/Business delivery acceptance.|
|324|Historical `physics.projectile-motion` @1; private `private.physics-scaled.projectile-range` / `private-physics-scaled-projectile-range` @1, same private revision|PARTIAL. Private scaling recovers selected speed-squared underflows, but degree conversion can itself underflow to zero before scaling. Ideal launch/level-ground scope, units and endpoint policy remain unapproved; the retained 90-degree sine residual is positive. Private adoption and exact-revision authenticated/product delivery are missing.|
|325|`physics.free-fall` / `free-fall-calculator` @1|PARTIAL. `gravity=Number.MIN_VALUE,time=2^100` returns historical zero although the exact expression is `2^-875`. The leading half-factor underflows before time multiplication. Changing v1 would break replay. No separately admitted/adopted successor exists; units, from-rest/constant-gravity and zero-gravity applicability remain unapproved.|
|327|`physics.angular-velocity` / `angular-velocity-calculator` @1|PARTIAL. Existing signed displacement/time scalar and historical delivery work. Angular/time/output units and average signed angular velocity applicability remain unapproved; radians cannot be inferred. Below-minimum quotient results are unrepresentable.|

All five also retain independent full-domain precision acceptance and actual exact-identity product/visual delivery requirements. Historical exact-version RPC/serializer results below do not establish full UI, API/embed, automation, performance, physical-source or production acceptance. Existing mechanisms mean that recreating engines or adding speculative advanced functions is not justified missing work.

## Reconciled source and historical evidence

The scientific-model manifest (`data/catalog/scientific-models-2026-10-25/manifest.json`) has unknown mapping authority and current certification for these rows; its candidate source is only **CalcuMint deterministic physics engine**. Historical implementation labels such as `certified`, `Verified example` and `OBSERVED_PUBLISHED` are retained data, not new qualification authority.

`src/lib/calculator-factory/completion/physics.ts` explicitly records null publisher source/units and blocked source/unit contracts. The observed-domain metadata documents implementation domains without adopting physical units. `docs/calculator-factory/wave1/physics-evidence.json` identifies the private revision and explicitly denies successor coverage by prior browser evidence. The 20261112 gap review, 20261113 domain evidence and `docs/seven-recovery-20261111/physics-workflow-evidence.json` consistently retain these limits.

The prior workflow index records 15 journeys/50 native exports against historical identities, with isolated development-source/configuration limitations. Its original producer/verifier and raw run paths are not present in this worktree; they are externally retained by the existing index. Their hashes/index are historical evidence, not a newly verified raw archive or fresh private-successor acceptance. This run supplies new local historical RPC/native evidence and does not substitute it for the missing raw browser evidence.

Existing exact-stage source gates passed without admission changes. Six new tests compare live bytes to the exact baseline for the historical engine, private arithmetic, cohort, completion review, replay verifier and private evidence manifest. No new application source means no mathematical successor admission is required or claimed.

## Genuine missing qualification work implemented

Added an isolated 15-case test suite covering baseline bytes, exact delivery identity separation, private replay refusal, recoverable free-fall underflow, signed below-minimum quotients and tiny-positive-angle conversion underflow. The private projectile witness uses `speed=2^300,angle=Number.MIN_VALUE,gravity=1`: retained conversion is zero, while the small-angle analytical result lies between `2^-474/30` and `2^-474*2/45`. These are diagnostic witnesses, not full-domain accuracy proofs or fixes.

Added a reproducible genuine local GoTrue/PostgREST/Postgres harness using the repository-pinned image digests and unchanged full candidate schema initializer. All plans use the actual historical engines and exact replay verifier. Fixture-only paid-plan assignments and locally adopted guarded schema bundles do not establish production equivalence or live billing acceptance. Containers/network were cleaned up.

The authenticated receipt records 15 per-ID/plan history checks: exact persistence/replay, same-request retry, conflicting history retry denial, anonymous history denial and foreign history read/update/delete/owner denial. Ten paid-plan scenarios round-trip with exact fields/replay, retry and foreign owner/read denial. Five Free project creations are denied. Scenario anonymous/conflicting-retry denial is not separately claimed.

Fifteen native serializer files (JSON/CSV/PDF for each historical ID) were written and read back with SHA256. JSON was parsed and replayed; CSV checked identity; PDF checked signature and subsequently parsed with `pdfinfo`/`pdftotext`, checking exact slug, engine version and output-value labels. Exports were generated before persistence; their source snapshot was later compared exactly to persisted history/scenarios. This is direct serializer generation, not browser download or restored-snapshot CSV/PDF semantic acceptance.

## Fresh test receipts

Runtime: Node `v24.19.0` (satisfies repository >=22; distinct from hosted Node22). All counts below are suite counts with overlap, not a summed unique-test claim.

| Check | Result | Receipt |
|---|---|---|
|Existing independent numerical, private scaled/cohort, rational and historical replay|131 passed / 5 files|`physics-baseline-tests.json`|
|Observed domains plus rational/replay|31 passed / 2 files|`physics-domain-tests.log`|
|Presentation/identity/retained workflow applicability|27 passed|`physics-presentation-tests.log`|
|New boundary/source/identity tests at committed harness|15 passed|`physics-qualification-committed.log`|
|Historical/domain, native contracts, API quota, automation route, snapshot and PDF tests|299 passed / 9 files|`physics-delivery-tests.json`|
|Exact source-stage adversarial tests|9 passed|`physics-source-adversarial.log`|
|Current Stage9 source and retained capability refusal checks|5 passed|`physics-source-stage9-committed.log`|
|Genuine historical local auth/RLS/replay|15 checks; 10 scenarios; 15 native files; cleanup complete|`authenticated/receipt.json`|
|Independent PDF readback|5 parsed|`pdf-readback.json`|
|Focused ESLint; repository typecheck|Both exit0|`physics-lint.log`, `physics-typecheck.log`|

Reproduction commands from repository root:

```sh
node node_modules/vitest/vitest.mjs run --config tests/physics-qualification-20261115/qualification.vitest.config.ts
node node_modules/vitest/vitest.mjs run --config tests/milestone60-20261113/physics.vitest.config.ts
node node_modules/vitest/vitest.mjs run --config tests/completion-wave-20261113/physics.vitest.config.ts
node --test tests/calculator-factory-source-20261112/exact-stage.test.mjs
node --test tests/four-worker-integration-20261115/source-stage9.test.mjs
node tests/physics-qualification-20261115/authenticated.mjs
```

The genuine harness requires Docker access and the exact three cached image digests in `tests/gotrue-runtime/fixture.mjs`; this run fetched only the missing pinned GoTrue image. No credentials or production endpoint were used.

The original new-suite attempt failed six Git-byte checks because sandbox subprocess creation returned EPERM; nine other cases passed. Its raw log is retained. Unchanged assertions passed with subprocess permissions. A PDF receipt-assembly assertion initially used uppercase `Version`; the actual exact label is `Engine version: 1`. The corrected readback passed for all five files. Neither incident is a numerical/product failure or a waived guard.

Full unfiltered regression, production build, fresh browser journeys and exact-head hosted CI were not run. No runtime changed; targeted results must not be represented as full-product or hosted qualification. An independent software review of the new harness found no blocking defect, with the serializer/scenario limitations above retained; this is not competent physical review.

Machine dispositions: `validation.json`. Raw receipt integrity: `receipt-manifest.json`. The committed auth receipt binds all bundled local source dependencies and harness/fixture hashes; it names the tested harness commit, not a fabricated final commit SHA.
