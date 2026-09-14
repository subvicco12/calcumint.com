# Build Batch B1 — Deterministic Calculator Engine

Status: implementation branch; not production-activated.

## Purpose

B1 establishes the shared calculation runtime required by every public calculator, future API endpoint, embed, report, and Business custom-calculator workflow.

## Engine contract

Each calculator is a typed `CalculatorDefinition` containing:

- stable `id` and SEO `slug`
- semantic integer formula `version`
- category, risk class and review status
- Zod input schema
- pure synchronous `calculate(input, context)` function
- formula metadata
- source metadata
- golden examples

The runner validates unknown input before the compute function and returns calculator ID, slug, version, validated input and deterministic output.

## Precision and units

- Shared explicit rounding helper with a default half-away-from-zero policy.
- Non-finite numbers are rejected.
- Unit conversion is centralized rather than duplicated by calculators.
- Initial families: length, mass, volume and temperature.
- Temperature is converted through kelvin; linear units use canonical base factors.

## Initial reference calculators

1. Percentage of a value
2. Unit conversion
3. Compound interest
4. Fixed-rate amortizing loan payment

The finance calculators are reference implementations only in B1 and must remain unpublished until their source/review metadata passes the later calculator certification gate.

## QA gate

CI must pass ESLint, TypeScript, Vitest and `next build`. Golden vectors cover the reference formulas; boundary tests cover validation, zero-interest loans, rounding and unit-family errors.

## Activation rule

`featureFlags.calculatorEngine` remains false during B1. B2 will integrate the certified engine with public SEO calculator templates; production activation remains a separate release decision.
