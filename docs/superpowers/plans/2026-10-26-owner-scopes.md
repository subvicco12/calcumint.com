# Twenty owner-approved bounded calculator scopes

> Implement the approved contracts autonomously. Use parallel isolated implementation lanes, then one integration validation and independent review.

**Goal:** Complete all 20 approved supplied-input profiles behind existing private reviewer authorization.
**Spec:** `data/catalog/scope-policy-decisions-2026-10-25/owner-selections-2026-10-26.json`, authoritative commit `2a351a99fdcd3861beaed453db4ca11cccebb684`. Explicit user instruction supersedes the misleading retraction in earlier ancestry.
**Architecture:** Strict Zod schemas and deterministic pure kernels; shared calculations for matching families; private definitions and existing runCalculator/snapshot/export pipeline. No public registry entries, certification or publication.
**Constraints:** Preserve frozen PRs, historical versions, 14 original DRAFTs, 424 ledger records, two rejected mappings and 70 specialist cases. No production access, payments, migration, merge or deployment.

## Review focus

- Zero/negative denominators and unattainable margin/ROAS targets fail explicitly rather than fabricating a zero result.
- Supplied quantities, rates, periods, bases and currencies remain explicit; no demand, tax, provider, market or clinical defaults.
- Overflow, invalid dates, mixed currency/period baskets and horizon mismatches reject safely.
- Switching example/mode or editing input clears stale snapshots/exports; private role/account fences remain active.
- Projection schedules, historical snapshots and all exported outputs use the same authoritative result.

## Tasks

- [ ] Foundation: add strict owner-model definition support with pinned approval provenance, finite-output checks and independent unit tests. Validate RED then GREEN.
- [ ] Pricing lane: private-owner-business-core.ts and test; IDs145/156/157/158/161/177/181. Include supplied gross sales, explicit profit/margin/dated-NPV modes, hourly target, markup/margin prices and explicit profitability bases. Examples cover every supported mode. No public registration.
- [ ] Impact lane: private-owner-business-impact.ts and test; IDs44/159/160/194/195/200/201/203. Share contribution/comparison arithmetic and explicit inverse constraints; no hidden demand response, provider fees or tax.
- [ ] Everyday lane: private-owner-everyday.ts and test; IDs109/467/471/512/507. Supplied matching baskets, explicit depreciation schedule methods, matched nominal cash flows, manual dated directional FX, pinned trip-cost v1 reuse. No inferred market values or FX provider.
- [ ] Integration: private-owner-definitions.ts aggregation and reviewer lookup/catalog links/isolated fixture; enable accessible mode-specific examples in the workbench, preserving stale-output and account boundaries. Native browser exercises all20 and alternate modes; exports and role denial retained.
- [ ] Evidence: successor 20-row owner execution manifest links approval, schemas, definitions, tests and explicit non-approvals. Preserve historical register and ledger unchanged.
- [ ] Validation: focused tests, full unit suite, launch/certification guards, lint/typecheck/webpack, isolated PostgreSQL security, transport, Reference Six and native Next runtime. Fresh independent integration/numerical review, separate draft PR against reviewed scientific baseline and inspect exact-head hosted CI.

## Engineering rulings

- All new profiles are private engineering bindings, not canonical catalog/publication approval. The user approval makes the20 bounded scopes effective; old sourceStatus fields describe history only.
- Alternative approved methods use explicit modes and separate examples, with no silent default; no unsupported financial convention is inferred.
- Dated NPV, if selected, explicitly declares its day-count convention; nominal cash-flow comparisons explicitly declare undiscounted valuation. These are modeled supplied-input profiles, not specialist certification.
