# Slope draft registry migration — final engineering evidence and release readiness

Date: 2026-10-13
Repository: subvicco12/calcumint.com
PR: #1392 (open, draft)
Validated exact head before this evidence-only commit: `036f514371a149ca5c3a830084729d01c4cbbf69`
Base at review: `caffafe639350ca0c2c2cf33ae1f099294f5af54`

## Decision

**ENGINEERING CHECKS PASSED at the validated head; PUBLICATION / CERTIFICATION / MERGE / DEPLOYMENT HOLD.**

CI: https://github.com/subvicco12/calcumint.com/actions/runs/38431410600 — SUCCESS on the validated exact head.
Offline reconciliation: https://github.com/subvicco12/calcumint.com/actions/runs/38431410569 — SUCCESS on the same head.
CI includes lint, typecheck, unit tests, launch certification checks, calculator/rule-pack certification checks, and production `next build --webpack`. CI certification *checks* do not constitute authoritative database certification or publication approval.

## Implemented draft scope

- One active registry identity for slug `slope-calculator`: Geometry Master #276 `geometry.slope`, version 2, coordinate inputs `x1,y1,x2,y2`; result `value,dx,dy,steps`.
- Legacy launch Slope version 1 rise/run definition retained as source but excluded from active registry. No unrelated calculator candidates were intentionally activated.
- UI and account snapshot version use v2 engine, not the legacy launch v1 interface. Free, Pro and Business regression suite passed.
- Strict isolated historical reader preserves stored v1 rise/run `{result}` and v2 coordinate output, rejecting unknown versions, mixed shapes, extra v2 input keys, malformed output and unsupported metadata.
- Read-only `calculation_history` row decoder maps `calculator_slug,calculator_version,input_data,output_data` to versioned historical snapshots. It is not connected to public routes or a history-detail consumer.
- Slope is excluded from scenario re-evaluation; no historical replay, recalculation, mutation or database migration is performed.

## Evidence limits and risks

1. Historical database inventory previously found zero Slope records in inspected production tables. This does not prove the absence of browser exports, external integrations or archived snapshots.
2. Account dashboard currently selects history metadata rather than historical input/output details; no existing historical detail route was identified for integration. The decoder is an isolated boundary ready for an explicitly reviewed future read consumer.
3. Strict `(slug,version)` decoding protects historical interpretation but does not itself certify any existing external client or previously exported file.
4. Authoritative production DB certification, publication status and specialist sign-off have **not** been established by the passing CI workflows. Registry review flags are not authoritative DB publication approval.
5. This evidence document is a new commit after the validated head. Fresh exact-head CI and offline reconciliation are required before calling the new PR head green.

## Release governance / explicit HOLD

- **Engineering:** validated at `036f5143`; retest this documentation commit head.
- **Authoritative DB certification:** NOT VERIFIED; no certification or publication-state writes authorized.
- **Publication:** HOLD; do not add Slope to authoritative published manifest or expose through public routes without publication gates.
- **Merge:** HOLD; PR remains draft pending explicit owner authorization and applicable repository protections.
- **Deployment:** HOLD; do not trigger production deployment.
- **Historical data:** PRESERVE; no backfill, rewrite, migration or scenario re-evaluation.
- **Unrelated candidates:** HOLD; no activation of Graphing, 2D Function Plotter, Volume, Standard Deviation or Variance.

## Next authorized-safe actions

1. Run exact-head CI and offline reconciliation after this evidence-only commit.
2. Review the PR diff and public publication gates for unexpected activation or route exposure.
3. If and only if a real historical-detail/import consumer is introduced, wire it through strict versioned read-only decoding with consumer-specific tests.
4. Seek separate owner authorization and authoritative DB evidence before any certification, publication, merge or deployment action.
