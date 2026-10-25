# Calculator-first completion implementation plan

Goal: Make existing deterministic calculators testable by authorized reviewers and reconcile every authoritative master entry without inventing aliases, formulas or public approval.

Architecture: Reuse platform owner/admin/reviewer verification, owner session boundary, immutable registry and existing calculator UI. A separate engine-contract preview supports example-backed engines without a polished interface using their real input schema and engine; it is not a substitute for specialist or product UX approval. Offline inventory reports exact candidates, hints separately, unknowns and historical-only DB observations.

Constraints: Preserve PR1475, all historical versions, 424 ledger identities/statuses, 14 unpublished DRAFTs. No production operations, migrations, certification or publication. No inferred title equivalence. Existing explicit user directive authorizes autonomous inline execution.

- [x] Add failing inventory tests: all540 IDs, no hint promotions, immutable identities, missing/certification/publication distinct, deterministic example probes.
- [x] Add failing reviewer route tests: anonymous/nonreviewer denial, noindex, fresh role verification before registry detail, unknown IDs fail closed, session boundary.
- [x] Add failing contract-preview tests: real schema validation, known outputs, blank numeric rejection, nested inputs, stale result removal, reset, immutable exports and no account/provider writes.
- [x] Implement inventory/report export and reviewer list/detail routes; preserve public gates and existing14 workspace.
- [x] Verify actual browser navigation, mobile labels/layout, calculations and exports; record unsupported charts/interfaces honestly.
- [x] Implement only source-backed additional family gaps demonstrated by inventory; otherwise retain explicit unknown contract/specialist gates.
- [x] Run focused/full unit/security/transport/runtime/guards/lint/typecheck/webpack build; review integration independently and record exact commit.

Execution outcome: private preview functionality and two proven example-fixture defects completed. No new math engine was justified from unresolved title-only linkage. Exact all540 implementation count remains UNKNOWN and no publication/certification authority was inferred.
