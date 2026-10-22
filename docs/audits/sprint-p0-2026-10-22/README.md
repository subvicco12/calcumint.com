# P0 authentication closure sprint — RELEASE HOLD

## Governing scope and H0

The governing plan is the owner's ChatGPT-project source. The owner supplied the applicable H0–H48 milestones directly: H0–12 prioritizes hosted auth/session root cause; H12–24 runtime/security and exact-head CI; H24–36 independent QA, ledger reconciliation and code freeze; H36–48 final 6/6 CI, evidence freeze and development-candidate handoff. Escalate unexplained auth at H12; at H18 stop speculative fixes and produce a reproducible BLOCKED candidate. Do not search for a repository copy as a prerequisite.

`SPRINT_BASE_SHA=71261465c877eab27e48c70605dd5435d87eda77`. H0 recorded at 2026-10-22 16:42:22 UTC (22:12:22 Asia/Calcutta). PR #1467 remained draft on `feat/next-runtime-pdf-accessibility-20261021`; its GitHub head, origin branch and local HEAD matched. The base descends from `d371a58c527dbd493751db0108ce4c00f631402f`. The initial primary worktree had no tracked changes and only pre-existing generated `next-env.d.ts` untracked. Explicitly authorized detached secondary worktrees use the sprint base.

| Baseline workflow | Run | Conclusion |
| --- | --- | --- |
| CI | 39804832593 | FAILURE: native revoke journey; CDP recovery passed |
| Atomic embed PostgreSQL proposal | 39804832657 | SUCCESS |
| Atomic batch PostgreSQL proposal | 39804832576 | SUCCESS |
| Atomic billing PostgreSQL proposal | 39804832917 | SUCCESS |
| Offline catalog reconciliation evidence | 39804832533 | SUCCESS |
| Private DRAFT persistence PostgreSQL acceptance | 39804832491 | SUCCESS |

The hosted failure waited for `Actual runtime key`, but the page displayed `We could not verify your account. Your data is hidden until verification succeeds.` Later unit/build steps were skipped. Raw GitHub log download remained blocked by the environment network policy; authenticated Checks API annotations supplied the exact failure. Baseline observations are retained in `/workspace/.pr1467/sprint/baseline.json`.

## Demonstrated race and smallest correction

The synthetic browser driver's `identity(cookie)` cleared **all** cookies before reinstalling the requested session, including when the exact same session was already selected. The two separate CDP commands expose an empty-cookie interval. A real installed Supabase SDK `/auth/v1/user` read completing in that interval is correctly rejected by the application's session-bound fetch. The SDK reports `AuthRetryableFetchError` with `Authentication session changed. Retry.`; the account boundary correctly hides private content and offers explicit verification recovery.

This is a demonstrated fixture transition defect, not permission to accept an unverified response. Cached synthetic JWTs alone did not remove the clear/restore interval. The correction checks the active relevant browser cookies and does nothing only when exactly one canonical cookie already has the exact requested value, with no stale session chunks. Anonymous selection and real replacements retain clearing/replacement. Application auth, owner checks, provider verification, API-key revocation, secret handling, RLS and fail-closed behavior are unchanged.

The auth fixture adds an explicit response gate for deterministic scheduling. The committed regression uses real Chromium, the installed Supabase browser SDK, application cookie/session transport and a local HMAC-verifying HTTP identity fixture. It holds an actual `/user` response, then controls only the CDP cookie-write scheduling. No credentials, cookie values or bearer tokens are emitted in evidence. A real different-owner replacement must still reject the pending owner response and subsequently verify only the replacement owner.

## Regression and sequence evidence

- Baseline gated regression is RED: expected verified owner, received `{id:null,error:'AuthRetryableFetchError',sessionChanged:true}`. Corrected driver is GREEN. This does not depend on an arbitrary response-delay sleep.
- Ordinary baseline full sequence with diagnostic-only test-copy tracing and 4x Chromium CPU throttling: 25/25 journeys passed; cleanup complete. This establishes the intermittent nature, not absence of the bug.
- Controlled full-sequence baseline replay preserves the preceding native actions, stale-role checks and all outage/retry journeys. Holding the synthetic same-owner restore until the pending SDK read completes reproduces the same fail-closed account screen in the existing in-flight-verification journey. Sanitized test-copy trace records cookie continuity and boundary error categories; no production source is instrumented.
- Corrected controlled 4x CPU replay: auth continuity and revoke journeys passed; 24/25 overall, with a distinct invitation interaction timeout waiting for `invite=` navigation. This stress-only interaction remains unresolved; the page showed a healthy owner workspace, not the account-verification failure.
- Corrected ordinary unmodified runtime suite: **25/25 passed**, cleanup complete. Full CDP suite: **9/9 passed**. Disposable PostgreSQL/PostgREST: **8/8 security checks passed**, plus schema bootstrap. Targeted ESLint and whitespace checks passed.
- H0 is complete. The H0–H12 fixture race has deterministic red/green evidence and a locally validated correction; hosted confirmation remains pending. Independent QA and ledger reconciliation are bounded evidence, not completion of all H24–H48 acceptance gates.
- Results are retained in the candidate evidence package. The exact-head hosted checkpoint and every stage are reported separately with the actual candidate SHA; this baseline document must not be read as a green CI assertion.

Reproduce the committed deterministic regression from the repository root:

```sh
node --test --test-reporter=spec --test-name-pattern='synthetic same-owner' tests/next-runtime/cdp.test.mjs
node --test --test-reporter=spec tests/next-runtime/cdp.test.mjs
node tests/next-runtime/security.mjs
node scripts/test-next-runtime-browser.mjs
```

Node 22 and installed Chromium are used for sprint checks. `CHROMIUM_PATH` may select the existing browser. Database checks use pinned disposable PostgreSQL/PostgREST and repository fixtures, never a supplied production URL. There are eight functional HTTP/security checks plus schema bootstrap validation. Full-sequence replay scripts, preparation script, red/green logs, sanitized trace reports and hashes are retained outside the checkout under `/workspace/.pr1467/sprint/`; diagnostic runs explicitly add observation-only tracing to a temporary source copy and are not production-mode acceptance.

## Independent lanes and ledger boundaries

- [Production runtime/CSP](production-runtime.md): isolated production build and bounded anonymous HTTP/hydration checks under unchanged CSP; authenticated production-mode behavior remains unverified.
- [PDF/accessibility](pdf-accessibility.md): 48 reused PDFs passed bounded fresh structural checks. Generating-commit provenance is unavailable; PDF/UA, embedded Unicode fonts, assistive-reader usability and device/CWV performance remain unverified.
- [Ledger triage](ledger-triage.md): 424 unique records remain **55 VERIFIED / 331 PARTIAL / 20 BLOCKED / 18 UNKNOWN**. CSV SHA-256 remains `8b2ac855dcee0a6cb70451f9faf248e03162a695c962ec1349dd264c303e0779`. No ledger classification, source-review authority, certification or publication status is promoted.

All fourteen unpublished DRAFT calculators, mathematical contracts and historical versions remain untouched. No new calculators, Neon migration, broad refactor, production writes/migrations, merges, deployments, live payments, certification or publication are authorized by this evidence. Green development checks would support a development candidate only. Real GoTrue/signup/refresh/revocation/provider and deployed operational acceptance remain separate unverified gates.

## Hosted cold-start follow-up

See [cold-start investigation and correction](cold-start-closure.md) for the reproduced hosted I/O stall, isolated diagnostic workflow IDs, rejected treatments and pinned browser fixture correction. Exact candidate CI conclusions remain a separate checkpoint.
