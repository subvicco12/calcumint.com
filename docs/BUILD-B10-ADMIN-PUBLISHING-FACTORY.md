# Build Batch B10 — Admin Console, Review Workflow & Publishing Factory

## Purpose
B10 creates CalcuMint's internal operating system for governing a calculator inventory at scale. It is deliberately separate from customer Business workspaces. Platform-admin privileges cannot be self-assigned from the product UI.

## Operator roles
- `owner`: full platform operations authority.
- `admin`: calculator operations, reviewer assignment, publication and bulk factory jobs.
- `reviewer`: QA/review evidence and lifecycle review actions, but cannot publish.
- `editor`: draft/review preparation only.

`platform_admins` has read-self access for authenticated users and intentionally has no authenticated insert/update/delete policy. Initial bootstrap and role changes require trusted service-role/operations access.

## Calculator lifecycle
`draft → review → certified → published`, with `archived` available from governed states. Invalid stage skipping is rejected in server logic. Certification/publication also invoke a database-side gate so a bypassed UI cannot release an incomplete record.

## Quality gates
Every calculator requires:
- deterministic engine tests
- formula review
- reviewed source evidence and at least one source
- methodology completeness
- SEO/content completeness
- accessibility review

Financial, health and tax calculators are treated as YMYL and additionally require:
- specialist YMYL review
- an explicitly assigned review-capable platform operator

## Review provenance
`calculator_review_events` provides an append-oriented audit trail for creation, QA decisions, reviewer assignment, scheduling and lifecycle changes. QA checks record the reviewer, timestamp and supporting details.

## Inventory factory
The admin inventory supports individual calculator records and controlled bulk import of up to 250 records per job. Bulk work is represented in `calculator_bulk_jobs`, providing the basis for later automated generation/QA pipelines without bypassing the same review gates.

## Alerts
Failed QA checks automatically create quality alerts. Resolving/re-passing the failed check resolves the related alert. `refresh_admin_review_alerts()` raises overdue-review alerts, with higher severity for YMYL calculators. The Admin Control Center surfaces open alerts and lets review-capable operators resolve them.

## Publication scheduling
Owner/Admin can schedule a calculator only after it is `certified` and the publishing gate passes. The protected internal endpoint `POST /api/internal/admin/publish` processes due records. It requires server-only `ADMIN_WORKER_SECRET`, rechecks the database gate immediately before publication, raises a critical alert when blocked, and sets the next review date to 180 days after publication.

The worker is intentionally not scheduled or activated in B10. Production scheduling belongs to environment integration/launch authorization.

## Runtime publication boundary
The B10 `published` state is the governed release-approval state for the calculator inventory. Existing public calculators remain code-defined through the deterministic registry and certified-content gate. B11 portfolio expansion/publishing automation can consume approved B10 records to generate/release the corresponding runtime calculator implementation. B10 does not make an unimplemented calculator URL public merely by changing a database row.

## Security
- Platform privileges are independent of customer Free/Pro/Business entitlements.
- Admin tables have RLS.
- Admin assignment cannot be changed through authenticated client policies.
- Certification/publication is enforced in PostgreSQL as well as server actions.
- YMYL requirements are enforced at the database boundary.
- Scheduled publication uses a separate server-only worker secret and Supabase service role.
- Audit and alert records provide operational traceability.

## Production configuration intentionally not performed
- `008_b10_admin_factory.sql` and `008b_b10_alert_automation.sql` have not been applied to live Supabase.
- No production platform-admin user has been bootstrapped.
- `ADMIN_WORKER_SECRET` has not been configured.
- No publishing worker schedule has been enabled.
- No stacked PR has been merged to `main`.
- No Hostinger deployment has been performed.
