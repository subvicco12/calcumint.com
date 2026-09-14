# B4 — Pro Subscription, Billing, Ads & Premium Entitlements

## Scope
B4 introduces the commercial foundation for CalcuMint Pro while keeping Business capabilities disabled for later batches.

## Plan behavior
- Anonymous and Free users may see Google AdSense placements.
- Pro and Business users never render AdSense slots.
- Free accounts are capped at 10 favorites and 20 saved calculations by database triggers.
- Pro and Business accounts receive unlimited favorites/history and premium CSV/JSON exports.
- Pro pricing is modeled at $7.99/month or $79.90/year (roughly two months free). Pricing remains configuration-driven through Paddle price IDs.

## Paddle flow
1. A signed-in user chooses monthly or yearly Pro on `/pricing`.
2. `/api/billing/checkout` creates a Paddle transaction server-side using a configured recurring price ID and trusted CalcuMint user metadata.
3. Paddle hosts payment collection.
4. `/api/billing/webhook` verifies `Paddle-Signature` against the raw body using HMAC-SHA256 and a five-second replay tolerance.
5. Verified subscription events are stored idempotently and synchronized to `subscriptions`, `billing_customers`, and the server-controlled `profiles.plan` entitlement.
6. Active, trialing, and past-due subscriptions retain paid entitlement; canceled/paused/non-paid states fall back to Free.

## Billing interval policy
- Monthly → yearly is an allowed immediate upgrade policy.
- Yearly → monthly must not take effect before the current annual term ends.
- The policy helpers are implemented and tested. Executing deferred annual→monthly changes requires the later scheduled billing worker/automation before production activation.

## Security
- Paddle API keys, webhook secrets and Supabase service-role keys remain server-only.
- Checkout metadata containing the CalcuMint user ID is generated on the authenticated server endpoint rather than trusted from browser input.
- Billing tables are RLS-enabled and writable only by server/service-role code.
- End users can read only their own billing/subscription rows.
- Webhook payloads are rejected unless the signature is fresh and valid.
- Duplicate webhook event IDs are ignored.

## Required environment configuration before sandbox testing
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PADDLE_ENV=sandbox`
- `PADDLE_API_KEY`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_PRO_MONTHLY_PRICE_ID`
- `PADDLE_PRO_YEARLY_PRICE_ID`
- optional AdSense values: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR`

## External actions intentionally not performed by this batch
- No Supabase migration is applied to a live project.
- No Paddle products/prices, tokens, domains or webhook destinations are created.
- No AdSense production unit is activated.
- No branch is merged to `main`.
- No Hostinger production deployment occurs.
