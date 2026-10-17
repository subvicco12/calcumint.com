# Slope version-dispatch decision proposal — 2026-10-13

**Proposal only.** Do not change the active registry or persist/migrate historical user records.

## Current verified state

- Active legacy Slope: slug `slope-calculator`, engine version 1, rise/run inputs and `{result}` output.
- Inactive owner-approved Geometry Slope: same slug, also version 1, coordinate inputs and `{value,dx,dy,steps}` output.
- `CalculationSnapshot` persists slug and version, not registry ID. Switching engine under the same slug/version is ambiguous.
- Characterization regression `src/calculators/geometry/slope-snapshot-version-contract.test.ts` pins the collision and rejects cross-shape interpretation.

## Recommended future contract, pending owner and compatibility review

- Preserve legacy historical snapshot identity `slope-calculator` version 1 and its original rise/run input/output without mutation.
- Allocate coordinate Slope **version 2** at activation, subject to independent version contract review and compatibility inventory; never silently reinterpret historical v1.
- Any read-only compatibility view must explicitly dispatch by `(slug,version)`, reject unknown versions and mixed input schemas, and label origin-anchored coordinates as *derived*, not historical.
- Do not add Slope to scenario re-evaluation allowlists by version or slug automatically.
- Preserve a single active slug, and separately require authoritative database certification/publication gates.

## Not yet verified

- Production saved-data rows and client consumers: read-only Supabase permission denied.
- Whether any existing clients rely on version 1 for coordinate candidate test fixtures, public API contracts, saved scenarios or analytics.
- Owner approval of runtime adapter policy and version 2 assignment.
- Exact-head CI for this proposal.

**Release disposition: HOLD.**
