# Geometry catalog governance proposal — issue #235

Status: **proposal only — not source-of-truth approval**

## Source-derived constraints

The Master Calculator Catalog lists Geometry IDs 255–280 as Planned, Foundation / Expansion 1, Math / solver, A — Essential, with certification required before publish. Relevant rows are:

- 274 — Surface Area Calculator
- 275 — Volume Calculator
- 277 — Distance Calculator
- 278 — Pythagorean Theorem Calculator

The Final Master Product Architecture separates calculator **domain** from **presentation family**, states that this separation is essential for scaling from hundreds to thousands of calculators, and directs catalogue migration **by family, not page-by-page improvisation**. It also requires every migrated calculator to pass the Final publish gate and prohibits mass draft-to-certified promotion or weakening the certified-only public gate.

Neither source explicitly states that a generic catalog row authorizes additional child calculator identities. This proposal does not assume that authority.

## Proposed minimal governance decision

Add an explicit source-of-truth concept of a **catalog family authorization**:

1. A catalog row may be designated as a family/umbrella authorization for named child calculator definitions.
2. Child definitions retain unique calculator IDs/slugs and independent certification evidence.
3. Family membership does not grant certification. Every child remains DRAFT until its own Final publish-gate evidence passes.
4. Adding or changing family membership is a recorded catalog-governance decision, not an inference from similar names or formulas.
5. The public certified-only gate remains unchanged.

If approved, designate:
- Catalog ID 274, Surface Area Calculator, as the family authorization for the 22 current `surface-area-family-proposal` entries in `solid-geometry-reconciliation.ts`.
- Catalog ID 275, Volume Calculator, as the family authorization for the 26 current `volume-family-proposal` entries in `solid-geometry-reconciliation.ts`.

This resolves 48 of the 50 draft identities without adding 48 top-level catalog rows while preserving independent certification.

## Two unresolved diagonal calculators

The following remain explicit expansion decisions:
- Cuboid Space Diagonal Calculator
- Square Prism Space Diagonal Calculator

Existing catalog concepts 277 (Distance Calculator) and 278 (Pythagorean Theorem Calculator) are conceptually related, but the current source does not establish either as an umbrella authorization for three-dimensional solid diagonals.

Required explicit choice:
- authorize both as named children of ID 277; or
- authorize both as named children of ID 278; or
- add a dedicated catalog family/row for solid/space diagonal calculations; or
- retire the two draft definitions.

No option is selected by this document.

## Acceptance criteria to close #235

Issue #235 can close when a source-of-truth governance decision explicitly:
- approves or rejects the family-authorization model;
- if approved, records the 22 children of 274 and 26 children of 275;
- records one explicit disposition for both diagonal calculators;
- preserves independent Final publish-gate certification for every child;
- leaves all affected calculators DRAFT until certification actually passes.

Until then:
- `certificationAuthority` remains `false` for all 50 manifest entries;
- no Batch 11 expansion;
- no certification/publication based solely on proposed family membership.
