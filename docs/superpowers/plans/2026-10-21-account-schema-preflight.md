# Account Schema Preflight Correction Implementation Plan

> Execute inline; owner has authorized autonomous safe draft engineering.

Goal: reject incompatible or unverifiable account schema contracts without applying SQL.
Architecture: read PostgreSQL catalogs into a bounded contract descriptor; compare against a checked-in descriptor derived from actual001/009/029/038 migrations. Preserve independent deployment-history evidence. Unknown/deparser differences require review, never automatic equivalence.
Spec: owner ACCOUNT SCHEMA PREFLIGHT CORRECTION request.
Constraints: RELEASE HOLD; no production writes; immutable historical migrations; unchanged migration order/build command.

- [x] Reproduce integer/default/nullability schema being incorrectly accepted in disposable PostgreSQL.
- [x] Add PostgreSQL mutation regressions for columns/defaults/constraints, RLS/policies, effective grants and inaccessible metadata.
- [x] Replace presence-only assessment with strict contract comparison and a fail-closed query adapter.
- [x] Validate canonical fixture on PostgreSQL16 and17; derive expected descriptor solely from existing migrations, not production assumptions.
- [ ] Run focused tests, typecheck, affected lint and webpack build; review diff, update acceptance evidence and push one cumulative draft PR.

Review focus: missing metadata must fail; incompatible same-name columns must fail; unvalidated constraints and permissive policies must fail; inherited/column grants must be assessed; query failures must not leak raw diagnostics or report readiness. Existing production compatibility remains UNKNOWN.
