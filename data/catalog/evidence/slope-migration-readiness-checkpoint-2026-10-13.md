# Slope migration readiness checkpoint — 2026-10-13

**Disposition: HOLD; review only.** No registry replacement, certification grant, publication, merge, deployment, or production database mutation.

## Verified exact-head evidence

- Draft PR #1392 head `1e789e9b2977d72b38ea2b9ec0096eb0eb15e0ab`; GitHub reports open, draft, mergeable. Mergeability is not authorization.
- CI #38299940338 **success** and offline catalog reconciliation #38299940343 **success** on that exact head.
- Earlier head `e75ecc683068d781c7d177aa26ca96696523b696` offline #38299693491 **success**, CI #38299693489 **cancelled**. It is not a passing CI claim.
- Current regression `src/calculators/geometry/slope-registry-hold.test.ts` pins one active legacy slug, inactive `geometry.slope`, and strict rejection of coordinate payloads by the legacy adapter.
- The isolated `slope-legacy-compatibility.ts` returns preserved rise/run input, origin-derived coordinates and separate legacy/coordinate output shapes. It is not integrated into production or scenario reevaluation.
- Geometry candidate has deterministic golden fixtures and finite output guards.

## Atomic switch review: current decision

**Do not execute** the planned same-commit removal of active launch Slope and insertion of `geometry.slope` into geometry definitions. The current HOLD regression would deliberately fail after an authorized switch; the migration commit must replace it with post-switch uniqueness, coordinate-schema, route-publication and snapshot-compatibility assertions. Never simply delete the safety test.

## Outstanding independent gates

1. Supabase production table inventory: read-only list-tables attempt returned permission denied. Aggregate persisted slug/version/input-shape counts and downstream consumers remain unknown.
2. Owner review of versioned legacy adapter runtime integration, historic snapshot semantics, and backward compatibility policy remains outstanding.
3. Registry switch must have its own exact-head CI, offline reconciliation, security and `next build --webpack` evidence, and appropriate calculator certification.
4. Publication authority remains independent of registry presence. Verify authoritative DB lifecycle and route fail-closed behavior before any public release.
5. PR #1392 is broad (161 changed files at this checkpoint); review scope and unrelated changes before contemplating merge.

**Next engineering action:** secure authorized read-only inventory and explicit adapter policy decision; prepare post-switch tests as a separate unactivated proposal; continue independent review without weakening existing controls.
