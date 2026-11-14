# Retained-source converter factor audit

The retained UCUM 2.2 native ZIP adds independent factor and formula evidence for the 13 requested converters. The JSON binds the archive, native members and unchanged engine files by SHA256 and includes native XML excerpts. Reproduce the exact rational comparisons with `python3 docs/competent-closure-20261108/converter-source-audit.py`. No external source retrieval, engine execution, old golden rerun or production change was used.

“Supported” below means the retained relationships support the intended mathematical correspondence. It does not mean competent source applicability, numerical precision, canonical mapping or certification approval. Product aliases remain explicit and are not silently parsed as UCUM unit spellings.

| ID | Source correspondence | Remaining decision |
|---|---|---|
| 423 length | Supported: international inch/foot/yard/mile and SI prefixes | Explicit international-code mapping; no survey variant substitution |
| 424 area | Partial: square international units and hectare supported | International acre construction matches code, but UCUM's named US acre uses survey units |
| 425 volume | Supported: liter and international cubic units; US gallon/quart exact definitions | Explicit US liquid scope and aliases |
| 427 temperature | Supported: native Celsius/Fahrenheit affine functions | Separate cancellation/offset/representation precision review and applicability |
| 428 speed | Supported: international mile/foot, 3600-second hour and 1852-metre nautical mile | Binary64 expression and operation precision review |
| 429 pressure | Partial: SI, bar and atmosphere supported | Existing psi factor truncates the independent source-derived factor |
| 430 energy | Supported: SI joule, watt-hour and thermochemical calorie | Retain thermochemical scope; no alternative calorie assumption |
| 431 power | Supported: mechanical horsepower construction | Existing Number is correctly rounded from the exact source factor; ordinary binary64 precision remains |
| 433 angle | Supported: degree, gon and circle definitions | Explicit grad→gon / turn→circle aliases; Math.PI approximation requires numerical review |
| 434 storage | Supported: byte, decimal prefixes and binary prefixes | Explicit B→By / KB→kBy etc.; case-sensitive product codes are not UCUM codes |
| 437 density | Partial: SI/liter factors supported | Existing pound per cubic foot factor is a legacy approximation |
| 438 force | Supported: newton, dyne and conventional pound-force | Standard gravity scope; separate numerical precision review |
| 439 torque | Partial: pound-force times international length supported | Existing foot-pound constant and derived inch-pound factor approximate the source values |

The concrete differences requiring a decision are:

| Factor | Existing definition | Retained-source exact construction |
|---|---|---|
| psi, Pa | `6894.757293168` | `6894.757293168361336722673…` from lbf/international-inch² |
| lb/ft³, kg/m³ | `16.01846337396` | `16.018463373960139579655…` |
| lbf·ft, N·m | `1.3558179483314` | `1.3558179483314004` |
| lbf·in, N·m | existing foot-pound Number divided by 12 | `0.1129848290276167` |
| acre, m² | `4046.8564224` | Matches `4840 * international-yard²`; differs from UCUM `[acr_us] = 4046.872609874252…` |

Each of the first four existing stored Numbers differs from the nearest binary64 representation of its independently derived source value. This identifies approximation; it does not decide whether the discrepancy is acceptable. No tolerance or factor replacement is approved here. UCUM's `[acr_br]` uses historical British yard units and is also not an automatic replacement for the declared international construction.

Mechanical horsepower needs a different conclusion: UCUM `550 * international-foot * pound-force` is exactly `745.69987158227022 W`. The existing decimal spelling `745.6998715822702` differs as a decimal, but both round to the same binary64 Number. Treating that spelling difference as an additional stored-number truncation would be incorrect. Likewise the declared pound-force decimal `4.4482216152605 N` exactly matches the source construction before binary64 representation.

These facts reduce source ambiguity and isolate the remaining decisions. They do not establish full-domain arithmetic accuracy, physical applicability, competent approval, canonical adoption, certification or publication eligibility. Historical factors and packets remain unchanged.

Reproduce without altering the retained facts: `python docs/competent-closure-20261108/converter-source-audit.py --check`. Default generation refuses to overwrite an existing retained record.
