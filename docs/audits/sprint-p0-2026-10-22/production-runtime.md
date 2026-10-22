# Isolated production runtime/CSP evidence — RELEASE HOLD

Date: 2026-10-22. Baseline: `71261465c877eab27e48c70605dd5435d87eda77` (PR #1467). Detached worktree: `/workspace/pr1467-lanes/production`. This document is the lane's only tracked-file change. No production operations, live integrations, credentials, migrations, auth changes, publication or deployment occurred.

## Scope and provenance

Inspected `docs/audits/runtime-pdf-2026-10-22/README.md`, `docs/architecture/B12-production-hardening.md`, `next.config.ts`, `tests/next-runtime/server.mjs`, `tests/next-runtime/cdp.mjs`, package scripts and existing main `.next` outputs before rebuilding. The native runtime harness explicitly uses development webpack and adds `unsafe-eval` plus a synthetic loopback identity origin to test-copy CSP. It cannot establish unchanged-CSP production behavior.

Existing main build artifacts were not reused: `/workspace/.pr1467/build.log` records `.env.local`, while `validation-summary.json` identifies older `f9f76198805ead50af0d26c92cac26339d002c3c`; no matching baseline, secret-free build provenance was established. The main checkout/output was untouched. The governing Forty-Eight-Hour Completion Plan is a supplied ChatGPT-project source, not a repository document. Supplied milestones govern: H0–12 auth priority; H12–24 runtime/security exact-head CI; H24–36 independent QA/ledger/code freeze; H36–48 final 6/6, evidence freeze and handoff. This secondary lane preserves all fourteen unpublished DRAFT calculators, math contracts and historical versions.

## Commands and outcomes

From `/workspace/calcumint.com`:

```sh
git worktree add --detach /workspace/pr1467-lanes/production 71261465c877eab27e48c70605dd5435d87eda77
```

Exit 0. From the isolated worktree:

```sh
ln -s /workspace/calcumint.com/node_modules node_modules
nice -n 15 env -i PATH="$PATH" HOME=/tmp NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_BUILD_WORKER=1 NEXT_PUBLIC_SITE_URL=http://127.0.0.1:31467 NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:31468 NEXT_PUBLIC_SUPABASE_ANON_KEY=local-only-synthetic-anon NEXT_PUBLIC_PADDLE_ENV=sandbox node node_modules/next/dist/bin/next build --webpack > /workspace/.pr1467/sprint/production/build.log 2>&1
nice -n 15 node /workspace/.pr1467/sprint/production/probe.mjs > /workspace/.pr1467/sprint/production/probe.log 2>&1
```

Both exit 0. Next 16.3.5 compilation: 30.9 seconds; complete TypeScript, prerender and trace stages succeeded. One low-priority build ran; default prerender workers were observed at nice 15 (the environment flag is not a claim of universally single-worker execution). No dependency install or shared test cache was used. Next automatically rewrote `tsconfig.json` and generated `next-env.d.ts`; original tracked configuration was restored byte-for-byte and generated copies retained outside the checkout.

The external disposable probe launches actual `next start --hostname 127.0.0.1 --port 31467` under an explicit minimal synthetic environment, then uses the repository's native Chromium CDP helper with outbound interception. Server ready time: 208ms. Only its own Next and Chromium processes were stopped; probe exit 0 and resource close completed.

## Measured behavior

| HTTP GET route | Status | Measured result |
| --- | --- | --- |
| `/` | 200 | Repository CSP; `X-Frame-Options: SAMEORIGIN` |
| `/login` | 200 | Repository CSP; `X-Frame-Options: SAMEORIGIN` |
| `/business` | 307 | Location `/login`; protected CSP/framing headers |
| `/embed/nonexistent` | 200 | CSP omits `frame-ancestors`; no X-Frame-Options |
| `/api/v1/custom/nonexistent/calculate` | 405 | `Cache-Control: no-store`; protected CSP/framing headers |

On `/` and `/login`, headless Chromium found React property attachment on real DOM controls/links. Both recorded zero `securitypolicyviolation` events after load and a 500ms settling interval. Browser exceptions: zero. Browser network entries: 25; disallowed outbound entries: zero. This demonstrates these bounded pages loading under actual production webpack scripts without adding `unsafe-eval` or a loopback identity exception. The CSP still intentionally contains repository `unsafe-inline`; this is not a strict nonce-based CSP security audit.

Raw artifacts: `/workspace/.pr1467/sprint/production/` contains `build.log`, `build-id.txt`, `provenance.json`, `probe.mjs`, `probe.log`, `report.json`, `server.log`, and original/generated TypeScript configuration evidence. `report.json` retains exact HTTP CSP strings and observed browser/network entries. The worktree `.next` is isolated generated output.

## Fidelity limits and next checks

This is anonymous local HTTP acceptance with synthetic public configuration and shared installed dependency binaries. It does not establish functional calculation interaction, real embed content/session acceptance, native authenticated actions, GoTrue refresh/revocation, database compatibility, paid workflows, deployed TLS/CDN behavior, screen-reader/device acceptance, or broader portfolio correctness. React property attachment is evidence of hydration, not a full functional interaction assertion. `/embed/nonexistent` is an unavailable-content route, not a functioning embed acceptance test; the API GET 405 is method handling, not calculation acceptance. Local loopback HTTP also does not reproduce browser `upgrade-insecure-requests` behavior on deployed origins.

After the P0 auth lane is stable, a separate disposable production-mode fixture should exercise real calculator interactions, valid embeds and authenticated Server Actions under unchanged CSP. Synthetic identity transport must be reconciled with the existing production `connect-src` policy without silently relaxing that policy. Keep the existing production/schema/provider acceptance gates and RELEASE HOLD; no evidence here authorizes release or changes ledger authority classifications.
