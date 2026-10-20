# Slope historical snapshot metadata policy — 2026-10-13

**Scope:** Isolated owner-approved v1/v2 compatibility reader, not active registry/public routing. Release remains HOLD.

## Evidence and current contract

- Legacy `slope-calculator` v1 records use `rise/run` inputs and `{result}` output; proposed Geometry coordinate v2 uses `x1,y1,x2,y2` and `{value,dx,dy,steps:string[]}`.
- `src/calculators/geometry/slope-versioned-compatibility.ts` accepts only `calculatorSlug`, `calculatorVersion`, `input`, `output`; it strictly validates version-specific input/output shapes and returns an immutable copy without recalculation.
- `src/lib/calculation-snapshot.ts` creates a frozen JSON-domain copy and rejects unsupported values. JSON serialization normalizes signed zero.
- Owner-provided read-only production screenshots reported zero Slope records in inspected history/scenario/share tables, not proof that external or browser-stored payloads are absent.
- Exact-head `0f15e0e3df2d4183ad214fa54a33afdf0337919b`: CI #38395019337 SUCCESS; offline #38395019265 SUCCESS.

## Proposed explicit metadata policy (not yet approved for runtime integration)

1. **Never silently discard fields.** Unknown top-level or input/output keys are rejected by the strict reader. Original stored records remain untouched.
2. **Metadata envelope is separate from mathematical payload.** If real historical evidence shows fields such as timestamps, display labels, provenance, IDs or annotations, review and explicitly schema them at the persistence boundary. Do not add them to calculator inputs or outputs.
3. **No automatic normalization.** Preserve original stored output values and version identity; never recalculate during historical read. Distinguish JSON serialization limitations (e.g., signed zero) from stored-value fidelity.
4. **Fail closed and retain raw record in storage.** Unsupported historical shapes require a separately reviewed read-only compatibility view, not destructive migration, permissive parsing or silent coercion.
5. **No automatic eligibility.** Snapshot metadata never grants scenario re-evaluation, certification, publication or registry activation.

## Outstanding

- Obtain actual sanitized historical payload shapes, if any, before approving a metadata envelope.
- Confirm whether shared/batch/export/API/browser consumers add wrapper fields not represented by `CalculationSnapshot`.
- Explicitly approve any runtime integration, coordinate engine version update, registry replacement and certification/publication separately.

**Disposition: HOLD.**
