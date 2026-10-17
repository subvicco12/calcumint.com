# Slope production persistence inventory and compatibility decision — 2026-10-13

**Status: migration review only; public publication HOLD.** Owner approved Geometry coordinate-point Slope product contract, not registry activation or release.

## Verified checks

- Exact head `cf9b6f975587da771e141d71f87c9259e6b12b27`: CI #38292087571 **success** and offline catalog reconciliation #38292087563 **success**.
- The code-level inventory in `slope-coordinate-migration-review-packet-2026-10-12.md` identifies slug/version/input/output snapshot persistence and strict scenario reevaluation contract gating.
- A read-only Supabase `list_tables` request for project `zpwpstsvztyshcnwdfye` was **permission denied**. No production table inventory, persisted row counts, saved-scenario contents, or live API consumer evidence could be verified. No SQL or production mutation was performed.

## Proposed legacy compatibility policy — NOT YET OWNER-APPROVED

1. **Preserve historical snapshots as captured.** Never rewrite `calculatorSlug`, `calculatorVersion`, legacy `{rise,run}` input or legacy `{result}` output in-place.
2. Provide an **explicit, versioned read/compute adapter**, only after security and consumer review: for finite `rise,run` and `run !== 0`, use derived coordinates `{x1:0,y1:0,x2:run,y2:rise}`. Preserve original input alongside the derived result; label coordinates as **derived origin-anchored representation**, not historical points.
3. Reject mixed/partial legacy and coordinate schemas, nonfinite inputs, zero run, vertical coordinate lines, nonfinite `dx`, `dy`, or slope; do not silently coerce invalid data.
4. Treat output `{result}` versus `{value,dx,dy,steps}` as distinct schema versions; only map `value` to a legacy numeric field when a caller explicitly requests the old response shape and version.
5. Keep scenario re-evaluation **disabled for migrated Slope** until an independently reviewed, version-specific complete-input contract is registered. Slug equality must not grant eligibility.
6. Enforce a single active slug `slope-calculator`; the approved registry ID is `geometry.slope`, domain `geometry`. Registry activation and authoritative database certification/publication must be separate gated operations.

## Production inventory still required

With authorized read-only access, enumerate tables and columns for saved calculations, scenario sets, account snapshots, calculator histories, shared outputs, API usage, publication manifest and calculator identity; query **aggregate counts only** by legacy ID/slug/version and payload shape, without exporting personal inputs. Review analytics/third-party API clients and bookmarked URLs separately. Document backups, retention, migration reversibility and access controls before any data migration.

## Atomic registry review checklist

- One commit or logically atomic change removes launch Slope from active `launchDefinitions` and adds `geometry.slope` to `geometryCompletionDefinitions`; never allow duplicate active slug.
- Update tests expecting legacy `rise/run` and the six-standard identity evidence; ensure candidate source, examples and golden fixtures meet applicable certification.
- Verify publication authority fail-closed, registry ID/slug/category uniqueness, current unpublished database state, route behavior, snapshots and version-specific adapters.
- Run exact-head CI, security and production build `next build --webpack`; obtain applicable independent certification and explicit publication/release approvals.

**Decision state:** Owner approved intended Geometry coordinate product identity only. Adapter policy proposed; production inventory blocked by permission; registry migration not executed; publication HOLD.
