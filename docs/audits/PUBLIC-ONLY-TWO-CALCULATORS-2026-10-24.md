# Public-only two-calculator candidate — RELEASE HOLD

Implementation source: `9064f0a7d4c3bd8504d4d1d14e1314263a57f422`.
Base: frozen draft #1470 at `6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04`.
Branch: `candidate/public-only-two-calculators-20261024`.
The owner approved native implementation of the reviewed plan; the coordinator will arrange separate independent review. No external submission is authorized or performed.

## Implemented behavior

- Server-owned `CALCUMINT_PRODUCT_MODE`: explicit `public-only` enables only anonymous calculators; unset/`full` retains the full product; invalid values grant no capabilities. Browser input cannot select server policy.
- Existing protected manifest is parsed in full and composed with repository certification before intersection with exactly `core.percentage-of-value` v1 and `core.unit-conversion` v1 (exact key/slug/category/version). Missing, malformed or conflicting authority fails closed. No lifecycle approval or publication occurred.
- Every exported application API/auth callback and Server Action for excluded features is denied before work. Private pages render unavailable/noindex views. Protected manifest reads and nonsecret health liveness remain separate. Account, billing, AI, Business/builder, delivery/share/embed, API/webhook, admin and internal-worker boundaries are covered.
- Anonymous rendering skips proxy/header authentication, browser profile/subscription lookups, saved-data/export/scenario controls, AI and ads. Client snapshots do not authorize server operations. Missing client capability context fails closed.
- Home, directory, categories, related links, metadata, sitemap and robots use the scoped authority/policy. Company/legal pages qualify retained full-product descriptions without rewriting legal terms. Both calculators retain engines/formulas/sources/examples and gain an accessible error alert when the existing engine rejects overflow.
- A separate scoped readiness report distinguishes anonymous configuration, observed publication, and release authority (`releaseAuthorized:false`). Existing `buildProductionReadinessReport` and `assertProductionEnvironment` source and meaning are unchanged. Full-mode prerequisite regressions remove every previously required input in turn.
- CI receives an additive public-only browser step. No prior step, branch protection, certification gate or security assertion was removed.

## Verification

| Command | Result |
| --- | --- |
| `npm test -- --maxWorkers=4` | 4,745 passed; four existing skips; 717 files passed / two skipped |
| `npm run test:launch` | 46 passed |
| `npm run test:certification` | 15 guard tests passed; no certification action |
| `npm run build` in full and public-only modes | Both passed with webpack |
| `npm run typecheck` | Passed with tracked configuration restored |
| `npm run lint` | Zero errors; 28 existing warnings |
| `npm run test:public-only-browser` | 13 checks passed; 17 manifest-only fixture requests; no browser exceptions/disallowed requests |

These final application-source checks are at `9064f0a7d4c3bd8504d4d1d14e1314263a57f422`; subsequent audit/plan changes are documentation only. Exact commands and artifact hashes are recorded in the adjacent JSON manifest. Builds use `next build --webpack`; generated tsconfig changes are restored before the preserved-config typecheck. No .env.local was copied or read.

The public-mode runtime fixture runs actual Next/React/CSS and native action dispatch against a loopback HTTP manifest server, without any database. It verifies 320/1280px calculation, keyboard use, rejected-overflow recovery, direct excluded pages/APIs, native action denial, manifest mismatch/corruption/empty/unavailable states, sitemap scope and invalid mode. Only anonymous manifest RPC requests are allowed at the provider fixture; browser external requests are blocked. This is not production publication evidence.

Reference Six (36 journeys), Business (29 journeys) and transport (12 checks) passed during integration. Reference Six and Business use their existing synthetic fixtures and are not real-provider/DB acceptance. They ran before the final legal-notice-only change; the final full unit suite and webpack builds cover that change.

## Failure record and implementation rulings

- Initial npm ci could not use the default cache; a writable /tmp cache succeeded with 477 packages. No dependency/lockfile upgrade.
- The initial full suite reported 233 failures in 16 legacy component files because they did not mount the new root capability provider. Shared test render wrappers now supply the real explicit full-mode provider; nested public-mode providers override it. Production missing-context behavior remains disabled and is directly tested without the wrapper. Risk: fixture context differs from a missing-root deployment, so real Next evidence remains necessary.
- One subsequent full run had a stale imported `metadata` test after conversion to request-time `generateMetadata`; the assertion now calls the exported function and retains the same expected full-mode robots policy.
- Public fixture failures were preserved rather than counted as passes: missing tracked data in the Next test copy, incorrect JavaScript regex escaping, and Next16's development action-manifest location. The fixture now copies data and discovers the compiled manifest path.
- Vitest and the existing Business Vite SSR fixture map the `server-only` marker to an empty test module; real Next builds retain and enforce that marker. Risk: isolated tests do not prove server/client bundling, so both webpack builds are required.
- Keep exported featureFlags compatibility using runtime policy getters, after typecheck caught the old exported API's removal. No second all-on flag authority remains.
- Shared context changes and their regression-fixture updates were committed together after focused verification, rather than splitting temporarily broken test fixtures between plan tasks. Route guards are tested through actual exported handlers/actions rather than an additional wrapper-only test file.
- A displayed conversion expectation was corrected from raw 3.218688 to the existing 3.22 km presentation; numerical rounding was not changed.
- Overflow alert tests reproduced two missing accessible error states; reused CalculatorInputError without changing either mathematical contract. Full-mode invalid-result presentation gains the same alert.
- Robots metadata is dynamic because runtime mode changes must not retain build-time full-product crawler entries. Cost: request-time robots rendering.
- The local ledger was maintained directly because cloud skill helper scripts were not installed. The coordinator owns the requested fresh independent review; author self-review does not substitute for it.

## Preserved boundaries and pending gates

Diff inspection confirms no changes to Supabase SQL/migrations, calculator core definitions, source/certification records, full readiness/env implementation, release governance, data or the acceptance ledger. The 424 ledger identities/statuses and 14 unpublished DRAFTs are not promoted. Frozen #1470 and main refs were rechecked unchanged read-only.

Pending, not denied or uncertain:

- Fresh independent code review arranged by coordinator.
- Isolated PostgreSQL security and DB-backed native Business runtime checks: intentionally not executed under the explicit no-database-mutation restriction. Existing CI stages remain mandatory; no passing result is inferred.
- Actual protected DB manifest publication/deployment compatibility, existing direct-provider/RLS exposure, hosted/provider acceptance, physical-device accessibility, controlled deployed performance and operational/release evidence.
- Any push/PR requires separate coordinator publication-scope confirmation. No hosted exact-head CI has run for this local branch.

No action was rejected by automatic approval review; no external action has an uncertain outcome. No push, PR, merge, deployment, production mutation, credential work, paid-resource activation or database mutation occurred. Application guards do not revoke provider credentials or disable direct Supabase/Auth/PostgREST endpoints. RELEASE HOLD remains.
