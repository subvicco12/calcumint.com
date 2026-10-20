# Version-aware SIP draft integration

Goal: Complete isolated v2 adapters while preserving current v1/public registration and all historical captures.
Spec: User's version-aware SIP request; #1448 candidate/permission evidence.

Exclusive lanes: projection owns additive candidate snapshot helper and new sip-v2-projection module/tests/export; analytics owns new sip-v2-analytics module/tests; security owns API schema/helper compatibility fixtures. Parent owns explicit version dispatch, fresh draft scenarios, captured snapshot guards, combined renderer/adapter tests, workflows and acceptance ledger.

Design: version1 always resolves original engine; version2 explicitly resolves unregistered draft candidate. No defaults/upgrades/unknown-version fallback. Stored captures are read as captured, not recalculated. Fresh draft scenario requests are separate from persisted financial re-evaluation allowlists. V2 period rows are cumulative engine snapshots, never invented cash-flow transactions; optional precision failure preserves valid summary. Exports bind identity/input/output/rows and locale/currency context. Analytics use the same engine and exact cent deltas; unavailable requests stay explicit. Draft trust metadata cannot assert certified v1 provenance.

Review focus: no v1/public import/registration change; terminal/chart/table/CSV parity and 1200-row performance; corrupt/stale/version-mismatched payload rejection; negative/zero/tiny values preserved; actual renderer plan properties; helper-role tests use authoritative policies and proposals remain unapplied outside disposable fixtures.

Run focused regressions/certification, typecheck, lint and one webpack checkpoint, plus affected PostgreSQL suites; independent review; one final changed-head automatic CI run. User explicitly authorizes autonomous execution, superseding routine design confirmation/repeated full local suite steps. RELEASE HOLD: no production writes, migrations, payments, merges, deployments or certification/publication changes. All owner/specialist approvals remain UNKNOWN.
