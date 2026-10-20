# Private DRAFT experience — 20 October 2026

RELEASE HOLD. This is a local synthetic reviewer harness, not a deployed or authenticated preview service. No registry, certification, publication, formulas, versions, production storage, billing or security migrations change.

## Provenance and coverage

Cumulative baseline #1454 `d4dfb14472036ff1d8334c828a136e25b3012e16` preserves #1452/#1453 and all fourteen owner-authorized DRAFT v1 definitions:

205 Basic; 206 Scientific; 232 Big Number; 233 Random Number; 435 Fuel Economy; 441 Digital Resolution; 481 Solar Panel Sizing; 484 EV Charging Energy; 487 Rainwater; 498 Ingredient Mass/Volume; 517 Grade; 518 Sleep Duration; 529 Power/Weight; 531 Planetary Weight.

`draft-preview-catalog.ts` binds their existing typed adapters to shared Final renderer input/result contracts and scenario labels. Units follow explicit selected source units. Grade averages include caller scale context; no institution policy is inferred. Random draws have an authoritative ordinal table; EV battery/loss values have a same-unit kWh composition. Other scalar engines do not acquire invented time series or schedules. Scientific decimal strings and big integers remain strings, including in exports. Standard JSON numeric signed zero becomes zero, disclosed in the interface.

The preview reuses `FinalCalculatorRenderer`, `CalculatorScenarioWorkspace`, trust cards, result formatting, and existing JSON/CSV serializers. Free/Pro/Business use the same adapter and engine. Existing analytical entitlements control capture/export actions outside formulas. Registry-dependent Goal Solver and sensitivity re-evaluation remain unavailable for these unregistered engines; no fake public registry entry enables them.

## Running privately

After existing `npm ci`, run `npm run dev:draft-preview` and use `http://127.0.0.1:4179/tests/draft-preview/` in the workspace browser. It binds loopback only, now requires the per-run reviewer credential documented in `DRAFT-ACCEPTANCE-2026-10-20.md`, loads no environment file, and has no production database or authentication client. Do not expose the port publicly or treat the synthetic owner/plan selectors as authorization. Vite is pinned to the already locked 7.3.7; no dependency versions are upgraded. Public Next routes, sitemap and manifest are untouched. The dev server denies environment files, .git/.aws/.codex and external filesystem requests; CORS is disabled. This remains a trusted developer tool, not a sandbox for untrusted users.

`npm run test:draft-preview-browser` uses installed Chromium/CDP and synthetic inputs. It must not use production accounts. Physical Android, TalkBack, real assistive technology and real download interruption checks remain UNVERIFIED. Browser emulation establishes viewport/DOM behavior, not device certification.

## Snapshots and recovery

Local retention is explicitly synthetic reviewer-scoped browser storage, not server account persistence. Scope plus master ID isolates slots, not hostile users sharing a browser. Never store real private account data in the harness. One immutable v1 capture per calculator/scope is capped at 1 MiB. Exact schema, identity/version and deterministic output checks fail closed on tampering, corrupt/missing fields, unsupported versions and oversized data; they never upgrade or replace historical outputs. Failed reads/writes preserve stored material and form inputs. Owner or calculator changes reset active workspace state.

Edits invalidate current capture, result and current export. Previously captured valid scenarios retain their own inputs/outputs. A/B/C comparison exports use immutable snapshots; Free shows the existing analytical preview. Download errors preserve capture for retry; no exactly-once download or server-write guarantee is claimed.

## Validation and review boundaries

460 focused tests pass across all fourteen engines, decimal utilities, three adapters, 60 new UI/history regressions and 15 certification guards. Each calculator has a full UI workflow covering mathematical plan parity, current JSON/CSV, local save/reopen, A/B/C scenarios, invalid edit recovery and metadata. Typecheck and affected ESLint pass. One `next build --webpack` passes. Required GitHub CI applies to the final PR head; see the PR check links for its exact status rather than inferring certification.

49 browser checks pass, including all fourteen calculators at 320px/1280px, fourteen save/reopen and A/B/C workflows, 28 raw calculation downloads and two scenario-set downloads. Chromium downloads are paced to respect its burst limiter; the UI reports a request rather than claiming completed download. Browser results and screenshots are retained privately under `/workspace/review-artifacts/draft-experience-2026-10-20/`; the final PR records exact counts. Screenshots are not specialist/accessibility approval. The 540-row implementation overlay records fourteen private experiences, fourteen owner-authorized unregistered DRAFT definitions, unchanged 574 public-registry definitions and zero new certifications/publications.

## Remaining decisions and next batch

Review numerical-policy details, NASA spherical gravity applicability, timezone offset scope, user-configured grade scales and clinical/financial exclusions from #1454 before any certification. All external waiver/source/mapping/HOLD/specialist approvals remain UNKNOWN. Public identity decisions, certification, authorized publication and deployment remain separate gates. Mortgage/BMI decisions are untouched.

Next: review the private experience with authorized human reviewers, including physical Android/TalkBack and actual keyboard/screen-reader workflows. A subsequent independent batch can design a private version-addressable engine resolver for optional analytics, with explicit identity/version contracts; keep public registry and historical outputs unchanged. Real authenticated server persistence requires its own authorization/isolation tests and is not established by this local harness.
