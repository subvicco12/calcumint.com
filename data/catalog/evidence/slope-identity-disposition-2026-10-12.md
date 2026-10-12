# Slope calculator identity disposition — 2026-10-12

**Decision: HOLD catalog mapping and publication.** This is a source-backed engineering disposition, not an approval.

## Observed registry identities

- Active: `launch-slope-calculator`, slug `slope-calculator`, category `math`, rise/run input contract.
- Inactive source definition: `geometry.slope`, slug `slope-calculator`, category `geometry`, coordinate-point input contract; excluded from `geometryCompletionDefinitions` in `src/calculators/geometry/catalog-completion.ts`.
- Master Catalog ID 276: `Slope Calculator`, domain `Geometry`.
- Verified offline evidence workflow 38284439442: `registryDuplicate:false`, active and inactive identities distinct, 2 dedicated golden fixtures for active Slope, launch audit issues empty.

## Disposition and safe resolution

Do not automatically reclassify active Math Slope as Geometry merely to satisfy domain/title matching. Do not activate `geometry.slope` under the existing slug, as that would conflict with the active registry entry. Both implementations can be mathematically valid but represent different input/output contracts.

Before approval, review the Master Catalog #276 feature definition against both contracts, choose one authoritative implementation, and record explicit mapping and reason. If the coordinate-based calculator is selected, plan a separately reviewed migration of the public slug, related content and tests rather than silently swapping engines. Retain the existing active registry and all publication holds until governance gates complete.

External slope mathematics: https://openstax.org/books/college-algebra/pages/4-1-linear-functions . This establishes the mathematics, **not** which CalcuMint implementation Master Catalog #276 intended.

No database publication, certification grant, merge, or deployment is authorized by this document.

## Owner product-contract decision — 2026-10-12

The owner explicitly **approved Geometry coordinate-point Slope** as the intended product contract for Master Catalog **#276**. This supersedes the earlier undecided contract choice, but **does not approve migration, registry activation, certification, database publication, merge or deployment**.

- Intended domain: **Geometry**; inputs: `x1,y1,x2,y2`; formula: `m=(y2-y1)/(x2-x1)` for nonvertical lines.
- Intended public slug: `slope-calculator`, with **exactly one** active registry entry at any point in the migration.
- Current active implementation: `launch-slope-calculator` (Math, rise/run). Intended candidate: currently inactive `geometry.slope` (Geometry, coordinate points). Do not treat approval as permission to activate the duplicate slug now.
- Migration prerequisites: inventory persisted IDs, API consumers, saved scenarios, share links, history, SEO/redirects, calculator input schema and result contracts; design compatibility or explicit versioned migration for rise/run data; certify vertical-line and numerical boundary handling; verify identity and lifecycle tests; obtain release authorization.
- Publication remains **HOLD** until the applicable independent review, certification, authoritative database publication lifecycle, CI/security and deployment gates are completed.

The original HOLD decision above remains operative for release and publication, but the intended Master Catalog #276 input/domain identity is now **owner-approved**.
