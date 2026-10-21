# Isolated Business browser acceptance

Run from repository root:

```sh
node scripts/test-business-browser.mjs
```

Requires Chromium at `/usr/bin/chromium` (override `CHROMIUM_PATH`). Report defaults to `/tmp/calcumint-business-browser/business-browser-report.json`; override `BUSINESS_BROWSER_ARTIFACTS` to preserve a run. Viewport journeys capture actual pages at 320 and 1280 pixels. Failures include screenshots. No production configuration is changed.

This runs actual `src/app/business/page.tsx`, `src/app/business/api/page.tsx`, their actions and permission/entitlement/crypto helpers in Vite SSR. Browser navigations, field edits, HTML validation, pointer clicks, submit, success disclosure and retry links run in native Chromium CDP. Supabase auth/database transport and Next framework link/redirect/cache/form dispatch are adapted. The local server uses a random per-run bearer token and loopback listener; browser requests outside that origin are blocked. Credentials are not printed or recorded in reports. Writes are in-memory only.

The embed fixture mounts actual `PublicEmbedCalculator` with the real custom formula engine in Chromium. Requests run the actual embed `events`, `leads`, and `session` route handlers, using real locally signed session tokens and synthetic admin database queries/RPC replies. It verifies analytics view/calculate writes, numeric results, required consent, consent evidence payload, unconfirmed submission retry with stable original request/payload, changed consent blocking, and stale published version renewal rejection. Synthetic RPC replies do not prove SQL atomicity or persistent consent evidence. The fixture definition is valid production schema input, not a replacement result component.

Business coverage includes all five role control matrices; rejected plan, membership, organization, project, client, audit, credential, webhook and analytics reads with successful retry; Business upgrade gate; workspace, project and client creation actions; five-seat invite rejection; API key quota browser validation, server validation with bypassed browser constraints and missing scopes, actual creation/hash storage/disclosure, revocation; action permission recheck after role downgrade.

Actual `src/app/globals.css` declarations are served for Business and embed viewport checks, excluding its Tailwind import. The harness checks page overflow and Business field labels, and preserves screenshots. Next Image is loaded with an empty browser process environment; logo/image rendering is not exercised.

Limits: this is not full Next runtime/RSC/hydration acceptance. Tailwind-generated utility fidelity, physical devices, production login, real persistence/RLS, concurrent seat allocation, API endpoint quota exhaustion, persisted key revocation, actual webhook dispatch, and database lead/consent atomicity remain unverified. The Business API dashboard displays recent event counts; it does not expose actual quota exhaustion. Separate DB/API acceptance remains required.

Unhandled browser exceptions fail the report. No production source fixes were required by these journeys. Initial failures came from fixture import/encoding, wrapped inline-link hit targets, and the Vite development websocket; these were corrected in the harness.
