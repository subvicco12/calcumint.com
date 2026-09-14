# B5 — Business Workspace, Teams & Organization Foundation

B5 establishes CalcuMint's multi-tenant Business foundation. It deliberately stops before the no-code calculator builder, white-label embeds, lead capture and API/webhook product surfaces, which are B6–B8.

## Tenancy model

A Business subscriber can create an organization. Organization membership is explicit and every organization-owned table is protected with row-level security. The first creator becomes `owner`.

Roles are ordered as:

- owner — highest authority and tenancy owner
- admin — organization/member administration
- manager — projects, clients, templates and audit access
- member — creates and collaborates on shared calculations
- viewer — read-only access

Ownership cannot be granted through the normal invitation flow.

## Business data model

- `organizations`
- `organization_members`
- `organization_invitations`
- `business_projects`
- `client_workspaces`
- `shared_calculations`
- `shared_templates`
- `organization_audit_events`

The schema is intentionally organization-scoped so B6 custom calculators, B7 embeds/leads and B8 API credentials/webhooks can attach to the same tenant ID without redesigning tenancy.

## Security boundaries

- Organization creation requires the server-controlled profile plan to be `business`.
- RLS is enabled on every Business table.
- `has_organization_role()` centralizes role-based RLS checks.
- Invitation tokens are cryptographically random and only their SHA-256 hash is persisted.
- Invitation acceptance verifies the authenticated account email, token hash, pending status and expiry.
- Managers and above can read audit events; admins and owners manage membership.
- Normal invitation flows cannot assign the `owner` role.

## Application surface

`/business` is the Business dashboard. It provides organization creation, organization switching, team overview, project creation, client workspace creation, invitation creation and audit visibility according to the current member role.

`/business/invitations/accept?token=...` is the acceptance endpoint for one-time invitation links. Production delivery of the raw one-time token remains intentionally outside this build until outbound email infrastructure is connected.

## Feature state after B5

Enabled:
- deterministic calculator engine
- accounts
- Pro billing
- Business workspaces

Still disabled:
- custom calculator builder (B6)
- white-label embeds and lead capture (B7)
- product API and webhooks (B8)
- AI assistant (B9)
- admin console (B10)

## External operations not performed

This build does not apply SQL to a live Supabase project, send real invitations, merge into `main`, change production Paddle state, or deploy to Hostinger.
