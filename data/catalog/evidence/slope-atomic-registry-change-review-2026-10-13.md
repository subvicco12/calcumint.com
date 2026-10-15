# Master #276 atomic registry replacement — exact change review

**Review-only artifact.** Owner-approved target: `geometry.slope`, Geometry, coordinate inputs `x1,y1,x2,y2`, slug `slope-calculator`. Do not execute the registry switch or publish until applicable review, migration and certification gates pass.

## Proposed atomic code delta

**File: `src/calculators/launch-portfolio.ts`**

- Keep legacy `launchSpecs` and `launchDefinition` available for historical compatibility if required, but change the **active** `launchDefinitions` export to filter out `spec.slug === "slope-calculator"`. Do not delete the legacy formula until persisted consumer inventory and adapter strategy are approved.
- Revisit the `base.length >= 100` assertion only if necessary; filtering the exported definitions must not inadvertently weaken unrelated portfolio checks.

**File: `src/calculators/geometry/catalog-completion.ts`**

- Add the existing `slopeCalculator` to the exported `geometryCompletionDefinitions` in the **same reviewed commit**.
- The candidate now has golden fixtures and finite-result guards. Verify these against certification harness requirements.

**Tests and evidence in the same commit**

- Registry must contain exactly one `slope-calculator` with ID `geometry.slope`, category `geometry`, coordinate input contract; no active `launch-slope-calculator`.
- Update `src/calculators/launch-portfolio-boundaries.test.ts` to test legacy zero-run through the isolated compatibility adapter rather than assuming the public registry accepts rise/run.
- Update `src/calculators/catalog-reviewed-standard-evidence.test.ts` and any six-standard identity reconciliation assertions that currently expect the active launch identity.
- Preserve snapshot immutability, strict legacy adapter validation and version-specific scenario re-evaluation authorization.
- Verify the public route remains blocked without authoritative database publication. A registry change must never implicitly publish.
- Run full CI, offline reconciliation, security checks and production build `next build --webpack` on the exact migration head.

## Gate blockers

1. Production persisted row/API consumer inventory is not verified because Supabase read-only access was permission denied.
2. The proposed versioned legacy adapter policy is not yet explicitly approved for runtime integration.
3. New golden fixtures and adapter require exact-head CI; prior CI results do not certify later commits.
4. Independent applicable calculator certification, authoritative database publication lifecycle and release authorization are outstanding.

**Decision:** Prepare and review the above atomic change only. No active registry switch, merge, production database change, certification grant, or public publication is authorized.
