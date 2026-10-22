# Actual Next runtime and tagged PDF acceptance — RELEASE HOLD

Baseline: cumulative draft #1466, `61ca2c78bf4d46ee8ec4604f9d2009dcf13cfd38`. This batch preserves its ancestry, source PRs, historical engines, fourteen private DRAFT calculators and publication controls. No database proposals or migrations changed or applied outside disposable fixtures.

## Verified corrections

- API keys and webhook signing secrets previously entered redirect query strings. Creation now returns a typed Server Action result to an owner-bound, memory-only client view. Forged legacy query parameters are not reflected. Fresh server ownership checks, pre/post-dispatch browser verification, session notifications, unmount/account boundaries and pagehide clear or suppress disclosure. Dismiss restores keyboard focus. Credentials are never placed in URLs, cookies or persistent browser storage by this flow. Existing database hashes/encrypted webhook secrets remain unchanged. Unknown outcomes require reviewing/revoking unwanted credentials; this is not exactly-once creation and there is no automatic retry.
- Real native project submission after role removal correctly failed RLS but reached an inaccessible generic error fallback, including an unjustified unchanged-data claim. A scoped Business error boundary now announces an uncertain outcome without internal details, offers read-only workspace reload and returns focus when appropriate. Actual browser acceptance verifies the denied project is absent and reload does not replay the write.
- The deterministic PDF serializer now emits tagged PDF1.7: Document/H1/H2/P, Figure alternatives, Table/TR/TH/TD, column scopes/header references, page MCIDs, parent-tree links, logical reading order and pagination artifacts. Complete raw values, sources, methodology, immutable versions and units remain available. Wrapped/multipage cells preserve logical identity. Metadata includes language/title; pagination decorations are artifacts.

## Isolated runtime evidence

`node scripts/test-next-runtime-browser.mjs`: **23/23** actual Next.js journeys; **0 unexpected browser exceptions**, **0 disallowed outbound requests**, 482 browser network entries. Actual Next dev webpack/RSC, React hydration, native Server Actions, application CSS/Tailwind and installed Supabase SDK are exercised. Successful database replies originate in real disposable PostgreSQL17.6/PostgREST12.2.3; no substituted success data. Coverage includes five Business roles, project/client/invitation creation and acceptance, credential hashing/disclosure/reload/revocation, stale-role denial, API scopes/quotas/usage, atomic batch recovery/conflict/outsider isolation, outages/recovery, embed calculation/consent persistence/stale version and320px/1280px layouts.

`node tests/next-runtime/security.mjs`: **8/8** real HTTP/SQL checks: JWT signature denial, profile display-name permission with plan-write denial, cross-owner RLS, client TRUNCATE/internal-RPC denial, membership identity/owner fencing, concurrent duplicate embed receipts/conflicts, late-failure transaction rollback/retry, absent/incompatible RPC fail-closed behavior.

Pinned Docker digests and exact repository migrations/proposals are recorded in `tests/next-runtime/database.mjs`. Fixtures use an internal network, ephemeral PostgreSQL storage and random local keys, and accept no supplied production database URL. Guarded SQL proposals are checked for refusal then enabled only inside the disposable fixture. Auth helper schema and platform grants are explicit local models, **not proof of deployed equivalence**.

### Fidelity limits

- Identity is a synthetic local JWT-verifying HTTP provider, **not GoTrue**. Real signup, password recovery, refresh rotation, email/MFA, server revocation and live provider acceptance remain UNVERIFIED.
- The temporary test-copy CSP adds webpack development `unsafe-eval` and the exact loopback identity origin. Repository/production CSP is unchanged. These journeys prove hydrated development behavior, not production CSP/CDN/TLS/deployment compatibility.
- External database outages are injected503s; successes use actual PostgREST. Production RPC deployment, schema/grants and operational acceptance remain UNKNOWN/deferred.
- No live billing/payment transactions, production mutations or physical Android/TalkBack checks. Physical-device and screen-reader acceptance remain UNVERIFIED.
- The legacy29-journey SSR harness remains useful, but its fixture-only boundary/form wrappers cannot prove client lifecycle security. The new Next suite owns that evidence.

## PDF accessibility scope

Tagging is implemented and regression-tested, including bidirectional MCID/parent-tree associations, header relationships and full long-table retention. **PDF/UA conformance is UNVERIFIED**. No claim of certified assistive-reader behavior: embedded Unicode fonts/ToUnicode mapping, independent PDF/UA validation and physical screen-reader reading order remain gaps. Existing Latin1/explicit Unicode escape limitations are retained transparently. The visible export states this limitation. PDF tags do not grant calculator certification.

## Reproduction and evidence

Run existing `npm ci` once when dependencies are absent. Pull the two digest-pinned images declared in the fixture, then run:

```sh
node tests/next-runtime/security.mjs
node scripts/test-next-runtime-browser.mjs
node scripts/test-business-browser.mjs
npm run test:final-reference-browser
npm run test:certification
npm run typecheck
npm run build
```

`CHROMIUM_PATH` may select installed Chromium. `NEXT_RUNTIME_ARTIFACTS`, `BUSINESS_BROWSER_ARTIFACTS` and `FINAL_REFERENCE_ARTIFACTS` select local output folders. Runtime logs/screenshots are local diagnostic material, not public evidence uploads. No credentials or raw runtime logs are committed. CI adds the real runtime/security checks without removing any existing checks; build remains `next build --webpack`.

Final local validation: **61 focused tests** across six files, **15 certification-check tests**, typecheck, affected lint and production webpack build passed. **36 Reference Six browser journeys** and the retained **29 legacy Business journeys** passed. External `pdfinfo` on the actual downloaded report confirms Tagged=yes, Suspects=no, PDF1.7; structure text exposes the logical tree. Passing certification checks do not grant certification.

Local artifacts: `/workspace/review-artifacts/runtime-pdf-2026-10-22/`. The original native-error red report is preserved separately from the final green run. Final focused/typecheck/lint/build and exact-head CI outcomes are recorded on the draft PR. Baseline evidence is reused where unchanged.

## Acceptance and next actions

The424-record ledger remains **55 VERIFIED /331 PARTIAL /20 BLOCKED /18 UNKNOWN**. Existing PARTIAL rows gain this bounded evidence; no authority or production classification is promoted. No new engines or identities. Mortgage/BMI specialist decisions, SIPv2 numerical-policy approval,836 waiver authorities,210 source reviews,540 mapping decisions,12 HOLD dispositions and38 specialist reviews remain UNKNOWN unless separately authenticated.

Next substantial batch: validate tagged PDF reading order with an independent accessibility validator/reader, then production-mode isolated Next acceptance under unchanged CSP. Real GoTrue/device/provider acceptance requires separately authorized infrastructure. Production migration/backup/Neon execution remains deferred by owner direction. RELEASE HOLD: no merge, deployment, certification or publication.
