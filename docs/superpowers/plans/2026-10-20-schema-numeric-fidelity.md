# Schema fidelity and numerical evidence plan

Goal: Verify #1446 against repository-shaped schema/roles and independent exact arithmetic while preserving RELEASE HOLD.
Spec: User's schema fidelity/numerical completion request; existing batch/embed HTTP acceptance and SIP numerical compatibility evidence.

## Ownership and acceptance

- Schema lane owns native batch/embed harnesses and new shared schema fixtures; guarded RPC changes only for reproduced defects. Load untouched relevant migrations and real membership/RLS, test owner/member/outsider boundaries and rollback/concurrency. Platform bootstrap is an explicit assumption, not production equivalence.
- Numerical lane owns new verification-only rational oracle, vectors/tests and evidence. Independently derive SIP expectations, identify nonzero cancellation/rounding boundaries and preserve engines, versions and historical outputs.
- Identity lane owns crosswalk evidence/triage only. Inspect three prior label hints and three ambiguous cases; promote no label-only link to approval. Implement deterministic evidence classification only where source contracts support it.
- Parent owns CI integration, consolidated acceptance ledger and review. Integrate lane commits without overlaps; focused tests, certification, typecheck, affected lint and one webpack checkpoint, then one changed-head automatic CI run.

## Constraints and rulings

No production writes, migrations, payments, merges, deployments, certification/publication or inferred approvals. No new dependencies. Slope v1 and immutable history stay unchanged. Existing 1,636 authority requests remain UNKNOWN. User authorizes parallel execution and no routine confirmation; repeated design approval/full local suites are superseded by this request and final automatic full CI.

## Review focus

Test fixture grants must be distinguished from Supabase production grants; migration provenance must be pinned to actual files, not claimed deployed. Cross-account helpers need real membership, including role filtering. Exact reference arithmetic must be independent from production evaluation and correctly handle half-cent/large values. Known numerical gaps are diagnostics, never approved replacement results or silent version changes. Mapping suggestions must retain identity/version/source provenance and UNKNOWN approvals.
