# Slope compatibility review — 2026-10-13

**Status: review complete for repository-level contracts; production-data assessment incomplete. No registry activation authorized.**

## Reviewed implementation

- `src/calculators/geometry/slope-legacy-compatibility.ts`: isolated strict rise/run schema, nonzero finite run, derived origin-anchored coordinate representation, separate legacy `{result}` and coordinate `{value,dx,dy,steps}` outputs. Does not alter persisted snapshots.
- `src/lib/calculation-snapshot.ts`: snapshot captures calculator slug, version, input and output as immutable copied JSON-domain records. No implicit migration.
- `src/lib/scenario-reevaluation.ts`: reviewed explicit contract required; current allowlist only percentage and unit conversion, not Slope.
- `src/calculators/geometry/slope-registry-hold.test.ts`: one active launch Slope; approved Geometry candidate inactive; actual registry `geometry.slope` absent.
- `src/calculators/geometry/slope-snapshot-hold.test.ts`: historical input/output unchanged; both legacy and proposed coordinate snapshot generations remain excluded from automatic scenario re-evaluation.
- Coordinate candidate golden tests cover signed slopes; engine guards nonfinite arithmetic. The source definition's registry `version:1` is NOT a reviewed persistence migration version. Do not assume a historical version collision is safe.

## Findings and unresolved risks

1. **Version identity collision:** legacy public slug `slope-calculator` is currently version 1. Proposed Geometry candidate also declares version 1. Because snapshots identify by slug and version, a naive atomic switch could reinterpret legacy saved `{rise,run}` v1 snapshots as coordinate `{x1,y1,x2,y2}` v1. Before activation, assign a separately reviewed coordinate snapshot/engine version (for example version 2) and test historic-version dispatch. This is a recommendation, not an authorization to change it.
2. **Adapter not integrated:** isolated adapter is not a persistence migration, API compatibility layer or approved re-evaluation contract. It must not be wired automatically based on slug alone.
3. **Production inventory inaccessible:** read-only Supabase list-tables was permission denied. No aggregate saved-data counts, consumers or history shape distribution verified. Cannot claim production compatibility is complete.
4. **CI pending:** offline reconciliation #38341156700 passed for head `0d4c006d33d91358cc8a91c54a77fcb6b58c8fb3`; full CI #38341156723 was in progress when recorded. Previous CI #38341049807 cancelled.
5. **Publication:** registry presence is not authoritative publication or DB certification. Maintain the existing lifecycle, YMYL and security gates.

## Reviewed atomic switch prerequisites

- Explicit owner decision on versioned legacy adapter and coordinate engine version; no silent snapshot conversion.
- Authorized read-only production persistence inventory, plus consumer/route/analytics review.
- Atomic removal of launch active Slope and addition of Geometry Slope, with a single slug and no duplicate ID.
- Replace HOLD regression tests with explicit post-switch uniqueness, version-specific historic snapshot dispatch, coordinate input rejection of legacy shape, no automatic scenario re-evaluation and fail-closed publication route checks.
- Run full exact-head CI, offline reconciliation, security and production `next build --webpack`, and obtain applicable certification and release approvals.

**Disposition:** Do not execute registry replacement, merge, deploy, certify or publish.
