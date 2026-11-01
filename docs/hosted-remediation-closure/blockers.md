# Remaining closure gates

## Software evidence still bounded

- Publication final-row proposal covers UPDATE in a synthetic fixture. Direct INSERT lifecycle, dependency mutations, captured real RLS/grants and all combined trigger interactions need additional isolated acceptance before it can be recommended for adoption. The date repair and new final-row guard do not certify content.
- Admin migration compatibility uses six scoped public tables and local pinned auth. The concurrent expected-state calls demonstrate atomic one-winner behavior, not a forced lock-contention proof. Full hosted-schema equivalence and legacy-data audit remain unestablished.
- Account permissions are tested against an explicit four-table allowlist and observed RLS, not every deployed client or historical inherited grant path. Provider ownership and provider-managed grants were not changed.

## Decisions and external prerequisites

- Resolve existing-owner invitation semantics, existing-member seat accounting and membership identity/ownership mutation authority. Tests characterize current behavior; they do not approve it.
- Specify revocation and expiry semantics while waiting for locks. Captured acceptance can complete after deletion or expiry. Choose one protocol shared by issuance, acceptance, membership mutation and every direct/service/privileged writer.
- Inventory and reconcile participating external writers. A service-role or privileged insert can bypass the tested quota path; no isolated RPC successor is a global guarantee.
- Approve retained display-name UPDATE and billing-customer SELECT requirements before038 adoption. Confirm data compatibility, authentic target metadata/source hashes, roles/inheritance and dependencies immediately before any separately authorized rollout.
- Obtain rollout/rollback authority for009,032–035,038, the date correction and any final-row successor. Runtime compatibility and matching historical source bytes do not authorize migration activation or manufacture applied-history markers.
- Preserve43 calculator authority blockers and qualified applicability requirements. Work on canonical/authority decisions is separate from this software evidence.

All existing model-only proposals remain guarded outside active migrations. No permission to modify production, certify or publish is implied. **RELEASE HOLD remains active.**
