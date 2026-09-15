# Build Batch B5 — Business Workspace Foundation

## Scope
B5 turns the Business tier into a multi-user organization product rather than a larger Pro account.

## Included
- Business organization creation restricted to users whose server-controlled profile plan is `business`.
- Five included seats.
- Role hierarchy: Owner, Admin, Manager, Member, Viewer.
- Member invitations with seven-day tokens and email identity matching on acceptance.
- Shared projects.
- Client workspaces.
- Shared calculation persistence foundation.
- Organization audit log foundation.
- RLS policies across all organization-owned data.
- Business workspace dashboard.

## Permission model
- Owner: full organization authority and future ownership-transfer authority.
- Admin: member administration and workspace administration, except ownership transfer.
- Manager: create/manage projects and client workspaces.
- Member: contribute to shared work.
- Viewer: read-only access.

## Seat policy
The initial Business subscription includes five organization members total, including the owner. Pending invitations count against the temporary allocation check in the application, and invitation acceptance also enforces the hard five-member database limit.

## Security
All organization-owned tables use RLS. Helper functions resolve membership and role server-side. Workspace creation requires an authenticated user with `profiles.plan = 'business'`. Invitation acceptance requires a valid, unexpired token and the authenticated account email must match the invited email.

## Deferred intentionally
Transactional invitation email delivery, seat add-on billing, ownership transfer UI, calculator builder, white-label embeds, lead capture, API keys, webhooks and SSO are not activated in B5. These belong to subsequent build batches.

## Deployment
Do not apply `003_b5_business.sql` to production until B0–B5 are approved for environment integration. Do not merge/deploy merely because CI passes.
