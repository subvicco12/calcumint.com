# Codex C — decimal-to-fraction golden contract

15 October 2026 IST. Baseline draft #1394: `c7e5091fb7e62e2a08053831bbf8aa8b40a56718`. Branch `test/decimal-fraction-golden-contract`. Release HOLD.

## Scope and authority

The final standard-risk missing explicit record can be closed without an arithmetic change. Bind24 independently specified literal numeric/display vectors to the existing registered identity `launch-decimal-to-fraction-calculator`, version1. Its inherited certified flag is unchanged, not a new certification. No schema, calculator expression, input acceptance, calculation, formatter, identity, source metadata, version, plan entitlement or lifecycle code changes. The launch factory delta is a fixture import and a slug-specific goldenTests binding; Codex A fixtures/tests and Codex B precision changes are untouched.

Fixtures derive from the existing calculator contract, elementary integer fraction reduction, and ECMAScript rounding/Number semantics:

- https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.round
- https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.epsilon

These are reference pointers, not newly granted source/specialist approval. Expected values are literal data, never produced by the engine or the historical comparator.

## Verified boundaries and retained behavior

| Boundary | Existing contract retained |
| --- | --- |
| Input decimal | Any finite Number; no new magnitude or safe-integer input restriction. |
| Precision | Integer0–12 inclusive; all13precisions explicitly covered. Invalid, fractional and nonfinite precision rejects at the schema. |
| Denominator | 10^precision:1 through1000000000000; all are exactly represented safe integers. |
| Numerator | Math.round((decimal + Number.EPSILON) × denominator), under binary64 arithmetic. No global safe-integer limit is added. |
| Rounding | Existing absolute EPSILON adjustment and Math.round toward positive infinity at ties, including negative ties. It is not shared half-away-from-zero rounding. |
| Zero | Numeric negative zero from -.5 at precision0 remains negative zero; display remains0/1. |
| Overflow | Schema-valid finite values may overflow when scaled; existing calculation finite-result guard rejects them before UI formatting. |
| Large accepted values |9008at12places has an exactly represented numerator beyond MAX_SAFE_INTEGER and remains accepted.1e21at0places retains exponential fraction display1e+21/1. MAX_VALUEat0places also remains accepted. |

The24literal fixtures include13precision-specific125/1000 family vectors, signed reduction, positive/negative half ties,1.005EPSILON compatibility,zero,maximum safe numerator,safe and unsafe-range exactly represented scaled integers,and exponential display. Additional boundary tests cover malformed/nonfinite inputs, overflow rejection and MAX_VALUE acceptance. Strict Object.is checks protect signs and signed zero; exact BigInt GCD checks verify reduced fixture fractions without a floating tolerance. Context changes do not enter the arithmetic.

## Historical differential evidence

The decimal-to-fraction specification line is identical to historical main `caffafe639350ca0c2c2cf33ae1f099294f5af54`. The historical module was read with git show and transpiled in memory; no checkout or source rewrite was needed. Compared old/new schema, calculation and formatter across25decimal values ×13precisions =325combinations:

-277accepted combinations: identical numeric values including signed zero and identical fraction strings.
-48rejected combinations: identical finite-range rejection.

Values:±0,±MIN_VALUE,±EPSILON,±1e-20,±.125,±.5,±1.005,9000,9008,MAX_SAFE_INTEGER,±1e20,±1e100,±1e308,±MAX_VALUE. This comparison establishes regression evidence, not independent expected mathematics; the golden literals above are separate. Source inspection confirms the arithmetic/schema/formatter are unchanged, beyond the sampled comparison.

## Decisions still protected

Safe scaled integer numerator plus the existing safe denominator gives a conservative exact-integer reduction envelope. It is not the entire existing accepted domain; unsafe-range values can still be exactly represented and simplify correctly. Enforcing MAX_SAFE_INTEGER would reject existing inputs and requires an authorized compatibility/version decision. Exact-decimal versus binary64 input meaning, arbitrary rational formatting, overflow rescaling and tie-policy changes also require a separate contract. No such change is necessary to add compatible golden evidence and none is made here. The raw formatter retains its finite-calculation precondition; no reachable public Infinity-formatter hang is claimed.

Runtime registry check:574definitions; missing explicit records25→24; standard-risk1→0. The remaining24non-standard gaps retain applicable specialist gates. This is an explicit-record metric, not exhaustive mathematical verification, master-catalog identity approval or authorization to certify/publish.

## Verification

Initial red run: golden binding failed,27existing/literal checks passed. After binding:102tests/4focused modules passed, including new28tests, launch contracts, Codex B boundaries and structural certification checks. Typecheck and affected lint passed. `npm test`:604files passed/2skipped;2679tests passed/4skipped. `git diff --check` passed. No repeated local build was needed for this fixture-only arithmetic-preserving delta; baseline #1394 webpack evidence is reused, with automatic exact-head draft-PR CI providing a fresh production build. No dependency, configuration, security, workflow or lifecycle edits.
