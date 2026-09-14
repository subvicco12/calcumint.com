# Build Batch B12 — Production Hardening & Launch Readiness

## Purpose
B12 is the final pre-production engineering gate for CalcuMint. It does not deploy the site. It hardens the application, closes launch blockers, and creates a repeatable readiness contract that must pass before production activation.

## Implemented hardening
- Production HTTPS/canonical-host readiness checks.
- Protected `/api/internal/readiness` endpoint; details require the server-only `ADMIN_WORKER_SECRET`.
- HSTS, CSP, Referrer-Policy, Permissions-Policy, COOP, nosniff and no-store API response headers.
- Private/account/admin/API routes excluded from crawler indexing.
- Health endpoint is non-cacheable and non-indexable.
- Global runtime error boundary and user-friendly 404 page.
- Explicit launch-certification test command in CI.
- B11 portfolio certification remains part of the launch gate: 100+ standard-risk deterministic calculators, deterministic golden vectors and SEO completeness invariants.
- Pro and Business Paddle checkout paths are both supported. Business has monthly/yearly production price IDs rather than being a display-only plan.

## Production readiness contract
The readiness report fails closed until all launch-critical integration configuration exists:
- canonical `https://calcumint.com` site URL
- Supabase URL, anon key and service-role key
- Paddle production mode, API key, webhook secret, Pro monthly/yearly prices and Business monthly/yearly prices
- B8 webhook encryption and worker secrets
- B9 AI provider/base URL/model/API key
- B10 admin worker secret

The readiness endpoint returns only configuration status, never secret values.

## Launch security rules
- Never commit production secrets.
- Service-role, Paddle API/webhook, AI, webhook-worker/encryption and admin-worker credentials remain server-only.
- Production must use HTTPS.
- API responses are non-cacheable by default.
- Customer-facing embeds remain frameable; the global CSP intentionally does not set `frame-ancestors`, because B7 controls embed access with its own domain allowlist.
- Existing RLS, role gates, deterministic calculator rules, billing webhook validation, API-key hashing and webhook signing remain mandatory.

## Go-live activation checklist
1. Review and approve the stacked B0–B12 pull-request chain.
2. Provision the production Supabase project and run migrations in numeric order through B12.
3. Configure Supabase Auth redirect URLs and Google OAuth for `calcumint.com`.
4. Create Paddle production products/prices for Pro monthly/yearly and Business monthly/yearly; configure the verified checkout domain and webhook destination.
5. Configure AdSense production client/slot values once approved.
6. Configure the selected AI provider and server-only credentials.
7. Generate strong independent secrets for webhook encryption, webhook worker and admin worker.
8. Bootstrap the first platform-admin user through controlled service-role operations.
9. Configure scheduled calls for B8 webhook delivery and B10 publication/review workers.
10. Set `NEXT_PUBLIC_SITE_URL=https://calcumint.com` and `NEXT_PUBLIC_PADDLE_ENV=production`.
11. Run the protected readiness check; it must return HTTP 200 and `ready: true`.
12. Merge only the certified chain, deploy the Node.js application to Hostinger, and map the canonical domain.
13. Run post-deployment smoke tests: home, calculator directory, representative calculator pages, auth, Free persistence, Pro checkout, Business checkout/workspace, API/webhook path, AI path, sitemap, robots and `/health`.
14. Verify Search Console, sitemap submission, analytics/AdSense and error monitoring after deployment.

## Deployment gate
B12 code completion does **not** authorize a production merge or Hostinger deployment. Production activation remains a separate explicit step because it changes the live site and requires real external credentials, billing products, database migrations and DNS/hosting state.
