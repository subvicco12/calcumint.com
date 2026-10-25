# Heat index private scientific review evidence

Retrieved 2026-10-25 from the official Unidata/MetPy repository at immutable commit `d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05`:

- https://github.com/Unidata/MetPy/blob/d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05/src/metpy/calc/basic.py#L235 (implementation and docstring)
- https://github.com/Unidata/MetPy/blob/d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05/tests/calc/test_basic.py#L208 (independent published vectors)
- https://github.com/Unidata/MetPy/blob/d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05/LICENSE (BSD 3-Clause, retained verbatim in METPY-LICENSE)

Original NOAA description: https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml . Direct access was blocked by the managed proxy (403) in the parent review; this implementation does not claim independent retrieval of NOAA's original page. MetPy is a secondary operational implementation, not NOAA certification. Initially suggested indices.py/test_indices.py do not contain the heat_index function; the actual source is basic.py/test_basic.py.

## Source conventions and supported review scope

Source air temperature is a unit-bearing quantity; relative humidity is a ratio 0..1 (or an explicit percent). This API requires explicit F/C and explicit percent 0..100, converts to F internally, returns F and the requested input unit. MetPy defaults to masking below 80 F; we return an unsupported discriminated result with no fictitious numeric result there. It also implements colder fallback branches when masking is disabled; this kernel deliberately does not expose them.

Source simplified estimate is a = -10.3 + 1.1T + .047RH. Select simplified for a < 79 F, otherwise Rothfusz. This port follows the pinned MetPy threshold literally; it does not claim equivalence to an averaged-simple-estimate NOAA branch test. Corrections follow branch selection: RH <=13 and T80..112 subtracts low humidity adjustment; RH>85 and T80..87 adds high humidity adjustment. Equality at RH13 applies a zero correction. MetPy's small simple/regression transition discontinuity is preserved.

The source does not state a finite, universal Rothfusz upper validity bound or validate every T/RH pair. The kernel currently narrows acceptance to 80..112 F as a private review guard, **not a source validity limit**. 112 F is the low-humidity correction endpoint. Boundary and internal numerical probes establish arithmetic coverage only; they do not establish physiological validity throughout the rectangle, particularly extreme high-humidity temperatures. Public release remains blocked on explicit source applicability review and original NOAA evidence. Solar radiation, wind, exposure, exertion, clothing and individual medical vulnerability are outside the model. The returned limitations explain shade/light wind and increased direct-sun exposure; there is no medical diagnosis, categorical safety advice or safe-exposure assurance.

## Independent numerical evidence

Tests transcribe MetPy rounded regression references, including the vectors its maintainers compared with the NWS website on 2019-07-17: 86F/45% ->87F, 111F/27% ->121F, 96F/60% ->116F (absolute tolerance .5F). Also 35C/70% ->50.3405C (tolerance .001C).

`decimal-reference.py` uses Python's standard-library Decimal at 40-digit precision and separately transcribed coefficients; it never imports or executes the production TypeScript kernel. Its frozen expected values (tolerance 1e-9 F) are:

| Air F | RH % | HI F |
| --- | --- | --- |
|95|10|89.44958730|
|80|90|86.34189170|
|80|0|76.58525919657369255703876489105746205890|
|90|50|94.59694120|
|112|13|108.98888766|

These check arithmetic independently, not model accuracy. Tests also exercise units, threshold neighbors, adjustment endpoints, unsupported ranges, invalid units and nonfinite values. No new runtime dependency; no public registry, private binding aggregate, draft history, database or production service was touched. Master identities 491 and 539 are left for separate private bindings to this shared numerical kernel.
