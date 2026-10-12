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
