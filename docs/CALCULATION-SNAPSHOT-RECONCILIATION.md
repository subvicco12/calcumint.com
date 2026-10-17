# Shared calculation snapshot reconciliation — Batch 11

Evidence date: 12 October 2026, IST. Independent stacked review proposal on #1380 head `8b3600c8d79e83326b770dca5bfcb9a07ec07567`; main `caffafe639350ca0c2c2cf33ae1f099294f5af54`, #1379 `6060f0451153be75f9af643c30968db3450b0f83`. Source drafts remain unchanged. Scoped export ownership review identified #1374's already inherited CSV implementation and #1380's Mortgage integration, with no separate account snapshot proposal.

## Completed supported engineering

A reproduced shared defect allowed malformed present data to enable save/JSON controls while CSV rejected it. Plain JSON serialization coerced nonfinite numbers to null or omitted unsupported fields. A mocked authenticated save also captured mutated input/output during the auth await. This proposal validates and freezes an independent snapshot before those actions, keeping history, CSV and JSON bound to the same engine data and identity/version. Favorites remain independent calculator bookmarks and entitlement/backend quota policy is unchanged.

The plain JSON-domain contract accepts finite numbers (including zero, negatives and small values), strings, booleans, null, dense arrays, ordinary/null-prototype records and repeated noncyclic references. It rejects nonfinite/explicit undefined/function/symbol/bigint values, cycles, sparse arrays, primitive root records, custom prototypes/toJSON behavior, symbol/nonenumerable fields and accessors without invoking them. Missing optional keys remain valid. No financial bounds or client registry authorization are added; identity checks require only the existing nonempty slug/positive safe-integer version contract.

The snapshot deep copy freezes accepted nested values without mutating the source. Serialization defensively revalidates; this is not a claim of literally one traversal. Raw CSV API, field order, quoting and formula-text neutralization remain intact. Top-level CSV retains signed zero; standard JSON and JSON-encoded nested CSV represent signed zero as zero, an existing representational limit, not an engine rounding change. No period rows are sampled during export.

Malformed present result data announces an accessible error and disables save/CSV/JSON. Valid recovery restores controls. Null output remains the ordinary disabled state without a duplicate error. Tests use a mocked authenticated client for snapshot race verification; no real history/favorite write was exercised.

## Evidence

111 focused tests in 13 files pass, including 20 pure snapshot boundaries, 6 real-account component tests, all-six actual download workflows, schedule exports, analytical sidecars, quota/RLS source guards, publication/identity gates and 13 Mortgage evidence-vector tests. Final local typecheck passes; affected lint and exact-head CI are reported in the draft body. No local full build, dependency installation or broad PR/catalog audit.

Actual Chromium at 320/1280 on Free/Pro/Business verifies invalid save/export disabled states, accessible alert/recovery, keyboard focus and no page overflow. Harness uses the actual account component/global CSS with synthetic plan/auth/query fixtures; it does not validate actual account persistence, deployment or specialist assistive-technology acceptance.

## Specialist package and release blockers

[MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md](MORTGAGE-SPECIALIST-REVIEW-PACKAGE.md) supplies actual versioned aggregate behavior, 12 input/output/rejection vectors, an observed LoanAnalysis rounding mismatch, unresolved period decisions and future acceptance criteria. The zero-rate rounding residual and tiny values are observations requiring financial review, not endorsed rules. No Mortgage period contract, schedule or period chart is invented; those remain **BLOCKED**. Financial specialist/HOLD evidence remains UNKNOWN, and normal authorized reviewer/owner/admin gates remain mandatory.

Counts remain 574 registered engines / 226 source code-certified candidates / 209 prior authoritative published entries (reused evidence); these are distinct from specialist approval and deployed-route visibility. BMI/Break-even draft restrictions and the existing sixteen-candidate matrix remain unchanged. No database reads/writes, approval, publication/certification promotion, formula change, RLS/security weakening, merge or deployment occurred. Next substantial step: authorized financial specialist adjudicates the supplied Mortgage decisions; engineering implements periods only against that reviewed immutable contract.
