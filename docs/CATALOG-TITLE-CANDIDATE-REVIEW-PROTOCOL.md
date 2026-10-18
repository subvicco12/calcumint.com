# Catalog title-candidate review protocol

This is a planning and review protocol, not certification or publication authorization.

## Evidence hierarchy

1. The 540-row canonical master catalog identifies the required portfolio and master IDs.
2. The registry inventory identifies implemented calculator IDs, slugs, versions, risk classes, and review states.
3. The source-reviewed slug ledger establishes approved domain and contract mappings; title equality alone never does.
4. The authoritative database publication manifest establishes publication records only when calculator key, slug, and version match.
5. Live route visibility must be verified separately.

## Review disposition

For each provisional title candidate, record master ID, master domain and title, registry ID, slug, version, source file, input and output contracts, risk class, and a source-backed decision: approved, hold, or rejected. Do not infer equivalence from identical names or formulas. Keep all competing candidates and reused slugs on HOLD pending adjudication. Do not alter calculator identities or historical versions to force matches.

## Existing known conflicts

The partial mixed-category ledger explicitly holds power-calculator versus power-from-work-calculator, travel-time-calculator versus time-from-distance-speed-calculator, and distance-calculator because of domain/title collisions and input-unit contract differences. These holds must remain in place until reviewed evidence resolves them.

## Acceptance criteria

- Each approved mapping identifies exactly one master ID and registry calculator identity/version, with independently reviewed source and mathematical scope.
- No registry slug is assigned to multiple master IDs without a documented, approved product identity decision.
- Risk-specific specialist review is recorded when required.
- Publication evidence is read-only and never used to grant certification, change lifecycle, or expose a route.
- Reconciliation exports show unresolved mappings and conflicts rather than silently discarding them.

## Release boundary

All mapping outputs are offline evidence only. Do not merge, certify, publish, deploy, change RLS, or write to production databases on the basis of this protocol.
