# Scenario reports and Business acceptance implementation plan

Goal: extend the authorized existing immutable A/B/C workspace with deterministic reports, accessible charts and PDF/CSV/JSON exports; verify isolated Business journeys.

Constraints: RELEASE HOLD; no database/provider/registry/version/formula changes. Raw captures remain unchanged. No inferred units or approvals. Existing plan entitlements govern reports.

- [x] Root: test-first validated report model in src/lib/scenario-report.ts; finite compatible output differences only; missing/context mismatch/overflow explicitly unavailable; full snapshots retained.
- [x] Root: shared scenario-report presentation and workspace PDF/report exports; scoped table/chart labels, mobile containment, retry retention, Free/Pro/Business regression coverage.
- [x] PDF lane: backward-compatible calculation PDF tables/vector charts; language/title and text alternatives; no PDF/UA claim. Test malformed options and complete pagination.
- [x] Business lane: actual Business pages/actions through isolated synthetic transport and Chromium; permissions, quotas, consent, analytics/recovery boundaries; distinguish server/RLS/provider unknowns.
- [x] Root: integrate focused evidence, typecheck, affected lint, certification and webpack build; update bounded acceptance evidence; one cumulative draft and exact-head CI.

Review focus: mixed display contexts, extreme signed values, invalid/stale captures, revoked entitlement/account boundaries, full long-table/raw-data retention. No exactly-once, production or assistive-device guarantee is inferred from isolated tests.

Outcome: local focused/browser/build evidence recorded in docs/audits/scenario-business-2026-10-21/README.md. Exact-head CI remains a final PR gate.
