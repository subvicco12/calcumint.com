# Physics observed-domain evidence

This extension describes the actual candidate input ranges, zero restrictions, arithmetic expressions, angle encoding and zero/underflow behavior for IDs 322, 323, 324, 325 and 327. `physicsCompletionReview` now carries these observed contracts alongside its existing blocked source/unit status. Every field unit and canonical output unit remains null. This is implementation evidence, not a physical methodology or publisher-source adoption.

The focused regression checks the 12 input fields against each exact candidate's real schema, including both range endpoints, zero, NaN, infinities and out-of-range values. Additional checks preserve candidate identities and private/public distinction. Three historical witnesses explicitly retain nonzero-input zero results for capacitance, free fall and angular velocity. In particular, free fall with gravity `Number.MIN_VALUE` and time `1e100` returns zero because the immutable expression multiplies 0.5 by gravity first. A finite mathematically recoverable result does not authorize replacing historical v1 arithmetic.

323 and 324 remain private scaled successors with unchanged constant and endpoint residual. The pre-existing independent binary64 rational and replay tests run alongside these new domain checks. No engine, registry, admission manifest, route, browser evidence, source adoption, version, certification or publication is changed.

Validation: Node 22.23.4, `node node_modules/vitest/vitest.mjs run --config tests/milestone60-20261113/physics.vitest.config.ts`: 2 files, 31 tests passed (20 new domain/identity witnesses, 11 retained rational/replay witnesses). `git diff --check` passed. The focused config supplies the existing `@` source alias needed by replay imports.

Remaining blockers: approved units/source/scope and independent full-domain precision acceptance; exact private successor adoption for 323/324; exact-identity browser/export/account/Business delivery evidence; native advanced capabilities and individual visual adjudication. No residual row is newly admissible from this evidence alone.

Reviewed source SHA-256 bindings:

- Historical engine `src/calculators/physics/catalog-batch-3.ts`: `b5c1870d729cbbd32db6eac439c7b6aa2b90f54c3677879bf0a05120a5f0faf6`.
- Private scaled implementation `src/lib/calculator-factory/experimental/physics-scaled.ts`: `744a6d0b6134f01ff66ec9ca8ffdb4a4b8ea73f4745c01a0df79e8426441fc74`.
- Observed contract `src/lib/calculator-factory/completion/physics-domain.ts`: `95aacbc7352d634ec58980eb8ccb7bcd3130325fcc313a033df0e32ea0b3d59a`.
