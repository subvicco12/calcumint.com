# Public-only two-calculator Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task-by-task after coordinator plan review. Steps below track implementation, not design approval.

**Goal:** Prepare the approved anonymous two-calculator candidate without advancing RELEASE HOLD.
**Architecture:** Server-owned product policy narrows the existing protected publication snapshot and denies excluded capabilities at executable boundaries. Separate public-only readiness reports preserve the existing full-product contracts; server-selected capabilities drive consistent client presentation.
**Tech Stack:** Existing Next 16/React 19/TypeScript, Vitest, pinned browser fixtures; `next build --webpack`.
**Spec:** `docs/superpowers/specs/2026-10-24-public-only-two-calculators-design.md`.

## Global constraints

- Base `6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04`; branch `candidate/public-only-two-calculators-20261024`; worktree `/workspace/public-only-candidate`.
- RELEASE HOLD. No merge, push/PR, deployment, production publication, DB changes, credential work or paid resources. Coordinator must approve plan before implementation and separately confirm external publication scope.
- Preserve full-product readiness, historical math, certification/source/YMYL/RLS gates, branch protections, all existing CI checks, 424 ledger identities/statuses and 14 unpublished DRAFTs.
- No new dependencies or secrets. Synthetic fixtures only; never copy .env.local into this worktree.

## Inspection and overlap findings

GitHub metadata/search and remote refs verified #1470 as newest PR, still open/draft at the supplied SHA; main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. Remote branches include existing publication-authority/readiness/discovery work already represented in the cumulative candidate; reuse its current manifest and route authority rather than cherry-picking older branches. #1468 engineering and #1469/#1470 auth work overlap account, exports and login code; retain their fixes and add policy checks ahead of them. No competing public-only branch was found in the remote head listing. Recheck remote heads and PRs before future external submission.

No AGENTS.md or .agents/skills found in the selected tree; /workspace/.agents is empty. Repository docs do not waive plan review. The writing-plans workflow requires review before implementation, consistent with the coordinator's explicit gate.

Verified at the selected base: feature-flags.ts sets all nine flags true and has no consumers; login/page.tsx renders AuthPanel unconditionally; billing checkout and AI explain handlers lack product-disable checks. launch/readiness.ts requires Paddle/AI/webhook/service-role/admin credentials. env.ts has a separate strict assertProductionEnvironment contract. proxy.ts and SiteHeader perform auth reads on anonymous requests; useCalculatorPlan reads profiles. Exports and saved scenarios are client components, not export API routes. sitemap.ts advertises pricing/business-platform. PublicationSnapshot already composes the protected anonymous RPC with exact repository identities and fails closed. Both selected definitions are certified v1 with sources/examples; this is not DB publication evidence.

## Review focus

1. Valid old sessions and populated excluded credentials must not re-enable features (Tasks 1, 3, 4).
2. Malformed extra manifest rows and version drift must not disappear during allowlist filtering (Task 2).
3. Direct Server Action requests can bypass page/layout guards (Task 3).
4. Unknown mode and mode changes across cache/build boundaries must not produce full-feature navigation (Tasks 1, 4, 5).
5. A green anonymous configuration check must not imply both identities are published or full product is ready (Tasks 2, 5).

## Task 1: One server policy and explicit client capabilities

Files: create `src/lib/product-mode.ts`, `src/lib/product-mode.test.ts`, `src/lib/product-mode-server.ts`, `src/components/product-capabilities.tsx`; modify `src/lib/feature-flags.ts`, `src/app/layout.tsx`, `src/proxy.ts`.
Interfaces: `ProductMode = 'full' | 'public-only' | 'invalid'`; pure `resolveProductMode(value: string | undefined): ProductMode`; `capabilitiesForMode(mode): ProductCapabilities`; server-only `getProductPolicy()` reads `CALCUMINT_PRODUCT_MODE`. Capabilities cover existing nine feature flags plus `savedData`, `exports`, `ads`; full retains enabled behavior, public-only enables only calculatorEngine, invalid enables none. `requireProductCapability(capability): void` throws fixed `FeatureUnavailableError` before work. `ProductCapabilitiesProvider` accepts the server snapshot; `useProductCapabilities()` fails closed without it. Client snapshot is presentation, never server authorization.

- [ ] Add policy tests: undefined/full retains full; public-only has only calculatorEngine; empty/unknown/case variants invalid; no request-derived override.
- [ ] Run `npx vitest run src/lib/product-mode.test.ts` and record expected failure before implementation.
- [ ] Implement policy/provider and derive feature flags from policy instead of maintaining a second all-on switch. Make root policy rendering dynamic. In public-only/invalid proxy return without constructing an auth client; preserve full-mode cookie-refresh behavior.
- [ ] Run policy plus `src/lib/supabase/proxy-session-recovery.test.ts`; add no-auth-call assertions with synthetic session cookies and populated fixture env. Commit only this task after green.

## Task 2: Exact identity intersection at existing publication boundary

Files: create `src/calculators/public-only-scope.ts` and `.test.ts`; modify `src/lib/publication-manifest.ts`, extend `src/lib/publication-manifest.test.ts`; retain `src/calculators/publication-authority.ts` semantics.
Interface: `PUBLIC_ONLY_IDENTITIES` contains exactly the two key/slug/version/category tuples in the spec; `restrictPublishedSlugs(mode: ProductMode, definitions: readonly CalculatorDefinition<unknown, unknown>[], publishedSlugs: ReadonlySet<string>): ReadonlySet<string>` returns existing set in full mode, exact matching approved definitions intersected with that set in public-only, empty in invalid mode.

- [ ] Add cases for both/one/neither identity, wrong key/slug/version, uncertified/missing artifacts, nonallowlisted certified calculator, unavailable RPC, malformed/conflicting manifest row outside the allowlist, and no credentials. Full mode preserves its prior set.
- [ ] Run `npx vitest run src/calculators/public-only-scope.test.ts src/lib/publication-manifest.test.ts` red.
- [ ] Apply restriction after existing whole-manifest parsing and composePublishedCalculatorSlugs inside getPublicationSnapshot. Do not manufacture slugs or redefine `available` as release readiness. Keep request-scoped metadata/render consistency and existing blocked-route behavior.
- [ ] Run the new tests plus publication-authority, public-route-readiness, publication-runtime-gate and draft-publication-exclusion tests. Commit after green.

## Task 3: Server executable-boundary denials

Files: create `src/lib/product-route-guard.ts`, `src/lib/product-route-guard.test.ts`, `src/app/public-only-boundaries.test.ts`; modify every route/action family listed below and protected layouts/pages. Add `src/components/feature-unavailable.tsx` for semantic heading, explanation and directory link with no form.
Interfaces: `disabledProductResponse(capability): Response | null` returns 503 JSON `{error:'Feature unavailable in this release'}` with no-store when disabled; `requireProductCapability` guards actions outside mutation/catch blocks. Preserve typed action return contracts where needed by returning their existing failure shape with the fixed message. Pages return the unavailable component and noindex metadata before private reads. No user/session/role is a mode bypass.

| Boundary | Exact files / coverage |
| --- | --- |
| Auth | `src/app/login/actions.ts` (all six exports); login, forgot, reset pages; `src/app/auth/callback/route.ts` before code exchange |
| Accounts | `src/app/account/actions.ts`, `src/app/account/drafts/actions.ts` (every exported action, including reads); account layout and page entrypoints |
| Business | `src/app/business/actions.ts`, `builder/actions.ts`, `delivery/actions.ts`, `api/actions.ts`; Business layout, invite and nested entrypoints |
| Admin | `src/app/admin/actions.ts`, `schedule-actions.ts`, layout/pages; `src/app/api/internal/admin/publish/route.ts` |
| Billing | `src/app/api/billing/{checkout,checkout/status,portal,webhook}/route.ts` including webhook before signature/body/provider work |
| AI | `src/app/api/ai/{find,explain,builder-assist}/route.ts`; `src/app/ai/page.tsx` |
| APIs/workers | `src/app/api/v1/batch/route.ts`, `src/app/api/v1/custom/[calculatorId]/calculate/route.ts`, `src/app/api/internal/webhooks/process/route.ts`, `src/app/api/internal/readiness/route.ts` |
| Delivery | `src/app/embed/[key]/page.tsx`, `src/app/share/[token]/page.tsx`, `src/app/api/embed/[key]/{session,events,leads}/route.ts` |
| Marketing | `src/app/pricing/page.tsx`, `src/app/business-platform/page.tsx`: honest unavailable view without checkout/lead forms |

- [ ] Inventory every exported HTTP method and `use server` function via `rg`; make the table-driven boundary tests include all entries, failing when a new export lacks a classification. Layout checks do not substitute for leaf/action guards.
- [ ] Add invocation tests with valid-looking sessions, worker secrets and provider mocks: every disabled handler/action returns unavailable and zero auth/DB/provider/queue calls; malformed payloads are denied before parsing; direct callback does not exchange code. Run new tests red.
- [ ] Guard each exported handler/action and private page read before side effects. Keep existing auth, ownership, stale-session, quota and reconciliation checks in the full-mode branch. Exempt only anonymous protected manifest reads; do not block them using a broad Supabase-client shutdown.
- [ ] Run new boundary tests and existing auth/callback/recovery, billing/webhook, Business credentials and draft action tests in full mode. Test health remains nonsecret liveness. Commit after green.

## Task 4: Anonymous calculator rendering and consistent SEO

Files: `src/components/{site-header,site-footer,compact-nav-menu,calculator-interactive,final-calculator-renderer,calculator-account-actions,calculator-scenario-workspace,ai-result-explanation,free-user-ad-slot,use-calculator-plan}.tsx` (use-calculator-plan is `.ts`); `src/app/{page,layout,calculators/page,calculators/[category]/page,calculators/[category]/[slug]/page}.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/site.ts`; create `src/app/public-only-discovery.test.tsx` and `src/components/public-only-calculator.test.tsx`. Inspect legal/about copy and change only current-mode availability assertions.

- [ ] Add tests for exact governed URLs/counts/search/related links/categories/sitemap/canonical metadata, no pricing/business entries, missing authority vs empty manifest states, direct excluded calculator URL denial, and no upgrade/full-catalog completion claims. Run red.
- [ ] Server-select public navigation without calling SiteHeader auth. Feed the policy snapshot to client renderers. Public mode uses free deterministic behavior without mounting account/session, saved scenario, export, AI or ad components; useCalculatorPlan returns free without client construction when accounts disabled. No account subscriptions or persistence requests on public calculator interaction. Preserve full-mode mounts and behavior.
- [ ] Keep formula/source/example/assumptions/FAQ/validation content intact. Display a concise release-scope notice that saves/accounts/payments/AI/Business/exports are unavailable. Retain accessible status/error focus and mobile labels. Use the same scoped manifest for all discovery and metadata; disabled pages are noindex and omitted from sitemap. Preserve robots' existing protections and extend for excluded public marketing/delivery paths.
- [ ] Run new rendering tests and existing percentage/unit-conversion final-contract, readiness, renderer migration, boundary and cross-plan authority suites. Add fixtures where a forged client full policy cannot bypass Task 3. Commit after green.

## Task 5: Scoped readiness without weakening full mode

Files: create `src/lib/launch/public-only-readiness.ts` and `.test.ts`; retain `src/lib/launch/readiness.ts`, `src/lib/env.ts` full contracts; extend regression tests in `src/lib/launch/readiness.test.ts` and existing env assertion tests. Update `.env.example` with optional nonsecret mode documentation and B2 architecture documentation.
Interface: `buildPublicOnlyReadinessReport(env: NodeJS.ProcessEnv, publication: PublicationSnapshot): ReadinessReport & {scope:'public-only'; releaseAuthorized:false}` checks exact public-only mode, canonical HTTPS URL, nonempty anonymous manifest configuration, available authority, both exact scoped calculator routes, and disabled excluded capabilities. Unknown or absent observations fail, never default to a repository-only set. Caller supplies only snapshots produced by the protected manifest boundary; tests supply explicit synthetic observations.

- [ ] Add tests: only anonymous config is insufficient; both protected matching identities plus config succeeds technically; one/mismatch/unavailable fails; excluded secrets neither required nor enabling; full mode cannot use this report. Always releaseAuthorized=false.
- [ ] Add full regression assertions for every current required env key, Paddle production/canonical-host rules, and assertProductionEnvironment's additional client-token requirement. Removing each currently required full-mode input must continue to fail; existing summaries/contracts remain unchanged. Run red for new scoped cases.
- [ ] Implement separate report; do not change old functions to default to a smaller scope or funnel full-product audits into it. Keep internal/readiness blocked in public-only and unchanged/authenticated in full. Document configuration vs observed DB publication vs explicit release authorization.
- [ ] Run `npm run test:launch` and new scoped readiness tests. Commit after green.

## Task 6: Candidate verification and evidence handoff

Files: create `tests/public-only/browser.mjs`, `scripts/test-public-only-browser.mjs`, and `docs/audits/PUBLIC-ONLY-TWO-CALCULATORS-2026-10-24.md`; reuse `tests/next-runtime` CDP/fixture helpers. Add a non-replacing npm browser script and CI step only if the isolated harness is deterministic; never remove existing checks.

- [ ] Build a loopback-only anonymous manifest fixture; permit its read RPC and deny all other network destinations. Use actual Next rendering/hydration at 320px and desktop, keyboard-only calculation/error recovery, both exact identities, missing/malformed manifest and populated synthetic account cookies. Assert no private/provider calls or export/download controls and direct excluded route/Server Action denials. Run fixture with public-only and invalid modes. No production DB/provider access.
- [ ] Run focused tests from Tasks 1–5, `npm run lint`, `npm run typecheck`, `npm test -- --maxWorkers=4`, `npm run test:launch`, `npm run test:certification`. Run unchanged full-mode reference browser (`npm run test:final-reference-browser`), transport (`node --test tests/next-runtime/browser-fixture.test.mjs tests/next-runtime/cdp.test.mjs`) and native Next/Business harnesses per existing CI. Database-mutating fixtures are not authorized in this task: report their security/runtime evidence as pending unless coordinator separately clarifies permission for disposable DB operations; do not run their setup silently.
- [ ] Run full and public-only `npm run build` with `next build --webpack` sequentially, no live DB, no credentials. Preserve tracked tsconfig and rerun typecheck if build generates changes. Keep full-mode and scoped evidence separate; do not treat old PR CI as new-head evidence.
- [ ] Inspect full diff and ensure no engine/math/version/catalog/SQL/ledger-status changes. Record exact source SHA, commands/results, fixture limitations and failed runs without relabeling them. Recheck frozen remote refs read-only. Commit scoped evidence only after results exist.
- [ ] Return local candidate and remaining gates to coordinator. External push/PR remains pending separate scope confirmation; no release action. Actual protected DB publication/deployed manifest compatibility, physical-device accessibility, deployed performance, security/operational acceptance and explicit release authority remain gaps until evidenced.

## Self-review and gate outcome

Coverage reviewed against every approved-design requirement: mode and invalid inputs (1); exact identity/publication authority (2); every excluded server surface (3); exports/client side effects, mobile/formula/SEO consistency (4); distinct strict full/public readiness (5); regressions/evidence/release constraints (6). Interfaces share ProductMode/ProductCapabilities and existing PublicationSnapshot/ReadinessReport; exports have no nonexistent API route assumed. Corrected initially easy-to-miss paths: proxy/header auth, password recovery callbacks, admin scheduler, anonymous embed/share endpoints, browser profile lookup, client-only exports, independent env assertion and static marketing sitemap entries. Direct provider shutdown is explicitly not claimed. No unimplemented test is marked passing.

Plan gate: PENDING coordinator review. Only these two planning documents have been written; no application implementation, local commit, runtime test, push, PR or production/DB operation has occurred. This stop is required by the requested review gate and writing-plans handoff, not a new request to reapprove the already-approved design.
