# Chemistry A private engineering lane

RELEASE HOLD ACTIVE. This lane provides private engineering contracts only. It does not authorize certification, publication, canonical counts, production changes or PR1538 changes. Shared registry, UI, export and history routing are owned by the coordinator.

The isolated branch is `engineering/next-chemistry-a-20261115`, based on `7629d5a0`. Its only runtime addition is `src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts`; the corresponding `.test.ts` is the only test addition. Existing engines and the shared helper are unchanged.

| Catalog ID | Immutable engine ID | Version | Export | Result unit |
| --- | --- | --- | --- | --- |
| 329 | chemistry.molality | 1 | molalityCalculator | mol/kg |
| 333 | chemistry.ph | 1 | phCalculator | dimensionless |
| 334 | chemistry.ideal-gas-law | 1 | idealGasLawCalculator | atm |
| 335 | chemistry.gas-density | 1 | gasDensityCalculator | g/L |
| 336 | chemistry.percent-composition | 1 | percentCompositionCalculator | % |
| 337 | chemistry.solution-concentration | 1 | solutionConcentrationCalculator | g/L |

Every tuple uses `primaryKey: value`, the exact exported engine from `src/calculators/chemistry/catalog-batch-1.ts`, and `createEngineeringContract` from `next-engineering-core.ts`. Each workflow source version has the exact form `factory-wave1-20261112.1/<engineId>@1/private.next-engineering.20261115.1`; individual values are recorded in `source-manifest.json`.

Capture requires all and only the engine's numeric fields as complete decimal text, with finite magnitudes at most 1e50 and nonzero magnitudes at least 1e-50. The shared helper rejects malformed/nonfinite text, omitted/invented fields and non-text values. Engine schema validation remains in effect. Capture-only guards require positive temperature for ID334, positive molar mass for ID335 and component mass no larger than total mass for ID336. Positive volume/solvent-mass/temperature denominators are enforced by the original schemas. Zero solute/amount/pressure is retained where the model permits it. Percent composition uses matching grams for both masses and a total that includes the component. Concentration uses final solution volume, not solvent volume.

The pH contract explicitly uses the ideal dilute concentration approximation: -log10([H+]/(1 mol/L)). It does not solve acid dissociation, compute activity coefficients or classify neutrality by temperature. Values outside 0–14 are supported by this model. Molality and mass concentration are composition ratios and imply no thermodynamic ideal-solution prediction. Both gas contracts assume ideal behavior and absolute pressure and temperature. The native rounded R=0.082057366080960 L atm mol^-1 K^-1 is preserved; OpenStax's printed 0.08206 is a rounded presentation of the same scale. NIST CODATA R and the standard atmosphere conversion provide additional unit context, without asserting that the native decimal R is exact.

The bounded capture range prevents the selected positive products and quotients from underflowing: the smallest positive result among these formulas is approximately 8.2e-152 atm (ID334). This is well above binary64's minimum normal value. The helper independently rejects nonfinite and nonzero subnormal primary outputs. There is no extra arbitrary lower cutoff on positive outputs. Tests exercise the extremal positive cases and genuine underflow in the larger original historical domain.

Historical verification deliberately bypasses capture-only guards and capture magnitude bounds. It replays the exact original v1 engine and compares the complete snapshot, including structured steps. Tests preserve historical zero K for ID334, zero molar mass for ID335, component greater than total for ID336, magnitudes outside capture bounds and an underflowed original-domain molality result. Wrong identity/version, extra fields and tampered result or steps are refused. This is exact forward agreement, with no certification authority.

`source-manifest.json` binds each tuple to retained actual primary text, URL, observation timestamp, scrape ID and SHA256. `source-capture-metadata.json` repeats the eight source-file records for convenient inspection. OpenStax Chemistry 2e sections 11.4, 14.2, 9.2, 9.3, 3.4 and 3.2 were fetched with Firecrawl; NIST CODATA and SP811 conversions supplement the gas constants. Content may be cached; no claim of live freshness is made. Section 3.3 was not repurposed for these six IDs. For ID337, section 3.4 supports the mass/volume ratio; the manifest explicitly records the conversion from grams per 100 mL to g/L.

`receipts/red.log` records the initial missing-six-contract assertion failure. `receipts/capture-guards-red.log` records eight actual failing physical-boundary/history-isolation assertions before adding the guards. `receipts/green.log` and `receipts/eslint.log` contain the final targeted checks. Golden values are literals derived independently: 35.8 mol / 2 kg =17.9 mol/kg; -log10(2.5e-4) =3.6020599913279625; P=2(0.082057366080960)(350)/25 =2.29760625026688 atm; density=2(44)/(0.082057366080960(300)) =3.574734936579889645... g/L (independent Python Decimal, 60-digit precision); 13/52 times 100 =25%; 2.5 g / 0.125 L =20 g/L.

The final focused run passed 62 lane tests and two existing helper tests (64 total), and ESLint passed for the two owned TypeScript files. An optional whole-tree TypeScript attempt had already started when the coordinator narrowed validation to focused tests/lint; it was terminated (exit -15), with no typecheck success claim. Its receipt is retained as `receipts/typecheck.log`. No full test suite was run in this lane.

Disposition: six contracts ready for coordinator integration and review. The release hold and all canonical/production authority remain unchanged. No push is performed by this lane.
