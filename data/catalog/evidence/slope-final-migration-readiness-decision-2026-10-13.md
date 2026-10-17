# Slope final migration-readiness decision — 2026-10-13

**Decision: NOT READY FOR RUNTIME MIGRATION — HOLD.** This decision applies to the Geometry coordinate Slope replacing the active legacy rise/run Slope. It does not revoke approval of the isolated compatibility contract.

## Verified exact-head engineering evidence

- PR #1392 is **open, draft**, exact head `236319c38bc4b6b13e9b651b999a36bdc00dbe97`; GitHub mergeable flag is not authorization.
- CI run [#38410523738](https://github.com/subvicco12/calcumint.com/actions/runs/38410523738) **SUCCESS**.
- Offline reconciliation [#38410523727](https://github.com/subvicco12/calcumint.com/actions/runs/38410523727) **SUCCESS**.
- Isolated `slope-versioned-compatibility.ts` validates strict v1 rise/run and v2 coordinate shapes, preserves stored output and creates immutable copies. It is **not wired** to registry, persistence routes, scenario re-evaluation or public runtime.
- Tests cover cross-version rejection, unknown versions, missing outputs, malformed steps and unexpected metadata.

## Blocking gates

1. **Version collision:** active `launch-slope-calculator` and inactive `geometry.slope` both declare slug `slope-calculator`, version 1. Owner-approved proposed contract reserves v1 for rise/run and v2 for coordinates, but candidate engine still declares v1. No registry replacement or version change has been made.
2. **Atomic registry migration not authorized:** replacing active launch definition with Geometry candidate requires a reviewed atomic change, updated registry/boundary tests and regression validation. Product-contract approval is not activation approval.
3. **Runtime consumer and historical compatibility coverage incomplete:** batch and share custom-calculator routes are distinct from built-in Slope; browser storage, external clients, exports, analytics and potential metadata envelopes are not exhaustively inventoried. Strict reader rejects unknown shapes without deleting source records.
4. **Authoritative certification/publication absent:** candidate not in authoritative published manifest; `reviewStatus: certified` in source is not proof of DB certification. Maintain publication lifecycle, exact-head CI, applicable review and fail-closed public routing.
5. **No scenario eligibility:** Slope v1/v2 not in reviewed scenario allowlist. No automatic historical migration or re-evaluation.
6. **Production inventory limitations:** owner-supplied read-only SQL screenshots show zero inspected Slope saved records and no matching catalog entry; screenshots do not establish absence of browser/external history or independent live DB verification in this session.

## Release sequence (requires separate authorization and gates)

1. Approve the specific atomic runtime migration plan and any historical metadata policy changes; retain v1 legacy read semantics and version v2 coordinate identity.
2. Review external/browser/export consumers and sanitized historical shapes; add compatibility tests without mutating stored evidence.
3. Prepare isolated branch changes for engine version 2 and atomic single-slug registry switch, plus affected tests, **only after authorization**.
4. Complete CI, production `next build --webpack`, certification, publication authority and release governance checks; no automatic publish.
5. Merge/deploy/publish only with explicit authorization and satisfied gates.

**Disposition: HOLD. No registry switch, DB mutation, certification, publication, merge or deployment.**
