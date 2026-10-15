# Master #276 coordinate Slope — migration compatibility plan

**Owner-approved target** (2026-10-12): Geometry `geometry.slope`, two coordinate points `x1,y1,x2,y2`, public slug `slope-calculator`. **Release/publication HOLD**; this is an implementation plan, not migration authorization.

## Confirmed repository contracts

- Current active `launch-slope-calculator`: Math category, inputs `rise` and nonzero `run`, computes `rise/run`. Defined by launch portfolio, and referenced by `src/calculators/launch-portfolio-boundaries.test.ts` for invalid zero run.
- Target `geometry.slope`: Geometry category, inputs `x1,y1,x2,y2`; rejects vertical line `x1===x2`, computes `(y2-y1)/(x2-x1)`. Defined but **not** exported in `geometryCompletionDefinitions`.
- Both definitions currently claim the same slug, but only launch Slope is active in the registry. Registry collision must remain prohibited.
- Existing six-candidate evidence and regression tests explicitly assert the **current** active launch identity. They must be updated together with any registry migration, never preemptively.
- Repository code search found `slope-calculator` references in launch portfolio, launch boundary tests and engineering files containing longer slope-related names. Search is not a complete inventory of runtime API consumers or persisted user data.

## Proposed controlled implementation sequence

1. **Inventory**: search runtime route handlers, share links, saved scenarios, history, API request payloads, analytics, SEO and persisted database references for both registry ID and slug. Record affected contracts; do not infer absence from GitHub code search.
2. **Compatibility contract**: decide whether legacy rise/run requests remain accepted temporarily by a versioned adapter. A mathematically valid mapping is `(x1,y1)=(0,0)`, `(x2,y2)=(run,rise)` for finite nonzero run. This preserves slope numeric value, but not original point location or historical input representation; do not misrepresent it as lossless history migration.
3. **Validation**: reject vertical lines and nonfinite coordinates; test near-vertical nonzero differences, overflow and cancellation, negative slope and swapped endpoints. Evaluate whether output `value,dx,dy,steps` is compatible with launch `result` and existing clients.
4. **Atomic registry migration**: after compatibility and release review, remove launch Slope from active registry at the same time as including Geometry Slope; ensure exactly one active `slope-calculator` slug, with intended `geometry.slope` ID and category. Update identity evidence tests and any slug-specific expectations.
5. **Certification and publication**: run full tests, security, deterministic golden fixtures, CI and `next build --webpack` on exact head. Obtain independent applicable review, authoritative database lifecycle certification and explicit publication/release approvals before exposing the target.

## Not yet established

No verified runtime consumer/persistence inventory, no approved adapter strategy, no target golden-fixture certification, no authoritative database mapping change, and no release authorization. Do not merge, deploy, publish or change production data based on this plan.
