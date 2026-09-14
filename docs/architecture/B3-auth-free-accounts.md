# B3 — Authentication & Free Accounts

## Purpose
B3 adds the secure identity and user-owned persistence layer that Pro and Business entitlements will build on later. It does not enable paid billing.

## Authentication
- Supabase Auth through `@supabase/ssr`
- email/password sign-in and sign-up
- Google OAuth entry point
- PKCE callback exchange at `/auth/callback`
- session refresh through Next.js `proxy.ts`
- server-side `getUser()` verification for protected account pages/actions

## Free account capabilities
- profile with immutable client-side plan entitlement
- locale, currency and unit-system preferences
- calculator favorites
- calculation history with calculator version, input and output snapshots
- account dashboard and sign-out
- calculator-page controls for favorite and explicit cloud-history save

## Database security
All user-owned tables have RLS enabled. Policies scope reads/writes to `auth.uid()`. The `profiles.plan` column is not client-editable: table-level UPDATE is revoked from `authenticated`, then UPDATE is granted only for `display_name`. Future B4 billing webhooks/service-role code will be responsible for plan changes.

## Tables
- `profiles`
- `user_preferences`
- `favorites`
- `calculation_history`

A trigger creates the Free profile and default preferences when a new `auth.users` row is created.

## Environment requirements
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- production and staging Supabase projects must remain separate
- Google OAuth must be configured separately in Supabase and Google Cloud before the Google button is activated in a deployed environment

## Activation order
1. Create/configure the intended Supabase environment.
2. Apply `supabase/migrations/001_b3_accounts.sql`.
3. Configure Site URL and allowed callback URLs.
4. Configure email and optional Google provider.
5. Add environment variables in the deployment environment.
6. Validate sign-up, confirmation, sign-in, OAuth, sign-out, RLS isolation, favorites and history before production deployment.

## Deliberately excluded
- Paddle billing and entitlement webhooks (B4)
- paid-plan quota enforcement (B4)
- Business teams/workspaces (B5)
- builder, embeds, API, AI and admin systems (later batches)
