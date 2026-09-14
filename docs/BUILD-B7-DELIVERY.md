# Build Batch B7 — White-Label Embeds, Lead Capture & Client Delivery

## Scope
B7 turns published Business calculators into deployable customer-facing assets.

## Included
- Public `/embed/{publicKey}` delivery surface for published custom calculators.
- Server-only service-role access for anonymous embed configuration, event and lead operations.
- Domain allowlists with optional direct-link access.
- White-label company name, logo, accent color and CalcuMint-brand suppression.
- Configurable CTA button and click analytics.
- Lead capture for name, email, phone and company.
- Required consent text plus optional privacy-policy URL.
- Consent records stored separately from lead records.
- Calculation input/output snapshot stored with submitted lead.
- Embed analytics foundation: view, calculate, lead_submit and cta_click.
- Expiring client share links; only a SHA-256 hash of the secret token is persisted.
- Business delivery dashboard with deployment library, lead inbox and basic event totals.
- RLS keeps embeds, leads, consent and analytics private to the organization in authenticated workspace views.

## Security
Public visitors never receive database insert permissions. Anonymous write traffic goes through validated Next.js server endpoints using the server-only Supabase service role. Embed keys are random opaque tokens. Share-link secrets are never stored in plaintext. Published calculator versions are immutable and the public surfaces execute only the deterministic B6 formula engine.

## Deferred intentionally
Custom domains, password-protected share links, CRM delivery, outbound webhooks, CSV lead export, advanced analytics, bot/rate-limit infrastructure and external API keys belong to B8 and later hardening batches.

## Deployment
Do not apply `005_b7_delivery.sql` to production until the stacked B0–B7 migration set is approved for environment integration. No production deployment is implied by CI success.
