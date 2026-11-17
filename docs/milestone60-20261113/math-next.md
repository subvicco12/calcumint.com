# Seven geometry completions — private evidence

The additions bind existing registered `launch-` engines, version 1, to the authority catalog without changing engine history. Catalog rows remain planned; these artifacts do not assert certification, publication, production adoption, or release acceptance.

| Catalog ID | Exact slug | Engine ID | Fixed dimensions / reverse control |
| --- | --- | --- | --- |
| 255 | hypotenuse-calculator | launch-hypotenuse-calculator | Keep b, solve a from requested hypotenuse |
| 256 | triangle-area-calculator | launch-triangle-area-calculator | Keep base, solve perpendicular height |
| 259 | rectangle-area-calculator | launch-rectangle-area-calculator | Keep length, solve width |
| 260 | rectangle-perimeter-calculator | launch-rectangle-perimeter-calculator | Keep length, solve width |
| 263 | circle-area-calculator | launch-circle-area-calculator | Solve radius from area |
| 264 | circle-circumference-calculator | launch-circle-circumference-calculator | Solve radius from circumference |
| 265 | circle-diameter-calculator | launch-circle-diameter-calculator | Solve radius from diameter |

All tuples use version 1. Source binding: `docs/calculator-first/authority-catalog.json` rows above, exact `src/calculators/launch-portfolio.ts` specifications/definitions, and existing engine golden provenance at `data/verification/codex-a-standard-risk-goldens-2026-10-15.json`. Every forward, graph, and inverse replay calls the unchanged engine. Engine result metadata and raw values are retained in snapshots.

`src/lib/calculator-factory/completion/math-next.ts` exports immutable contracts with native dimension fields, formula steps, strict capture, inverse controls, and explicit sampled graph controls (101 points maximum). Dimensions must use one consistent length unit; area results are square units. No unit conversion, arbitrary triangle solver, automatic graph interpolation, or inferred dimensions are claimed. Graph samples vary only the named reverse dimension; invalid samples retain an error gap.

Strict capture refuses extra/missing fields, invalid schema inputs, nonfinite output, subnormal output, and zero from a nonzero mathematical result. Algebraically witnessed zero is allowed. Reverse solving refuses nonunique zero-base/zero-length inverses, negative dimensions, impossible hypotenuse targets, and candidates that fail forward replay within 16 relative binary64 epsilons. Binary64 results and inverse candidates are approximations.

Independent numeric vectors are stored in `tests/milestone60-20261113/math-vectors.json`. Focused Vitest coverage verifies seven known outputs, seven inverse controls and engine replays, graph gaps, JSON input replay, immutable capture, strict fields, impossible/degenerate targets, overflow, underflow and witnessed zero. Command: Node 22.23.4 `npx vitest run src/lib/calculator-factory/completion/math-next.test.ts`; result: 1 file, 9 tests passed.

Integration still needs the shared registry to append `nextMathContracts`, parsing numeric raw fields before invoking `calculateNextMath(...).snapshot`; UI controls should call `reverseNextMath` and `graphNextMath`. Shared manifest, ledger, registry, and UI are deliberately owned by the coordinating agent. Native mathematical controls close the bounded geometry software gap; organizational acceptance, evidence ledgers, entitlements, exports, and workflows must be attached by shared integration before declaring the milestone complete.
