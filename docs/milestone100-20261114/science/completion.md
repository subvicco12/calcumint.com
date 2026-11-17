# Private science completion candidates

Engineering capture revision: `private.science-completion.20261114.1`. These are three candidate IDs, not three certified or published calculators. No registry, engine version, adoption, entitlement or production change is included.

| Exact catalog ID | Exact engine v1 | Supported scope and units | Named reverse variable |
| --- | --- | --- | --- |
| 328 Molarity Calculator | chemistry.molarity / molarity-calculator | Dissolved amount mol / total homogeneous solution volume L → mol/L | moles |
| 331 Moles Calculator | chemistry.moles / moles-calculator | Sample mass g / user supplied molar mass g/mol → mol | massGrams |
| 332 Dilution Calculator | chemistry.dilution / dilution-calculator | Conserved solute, initial concentration mol/L, initial and final measured solution volumes L → final mol/L; final volume ≥ positive initial volume | initialConcentration |

The software completion adds immutable exact-engine snapshots, explicit per-field units and scope, named numerator inverse with replay reconciliation, and sampled relationship data with refused-domain gaps. The registered historical engine arithmetic and its own steps remain intact inside the snapshot. Inputs require exact keys, finite normal numeric values or zero, ordinary records and no getters/symbols. Engine schema limits remain enforced. Nonzero subnormal output and unwitnessed zero output are refused, including dilution intermediate underflow. This is a deliberately bounded capture domain, not a full-domain numerical certification.

Dilution capture rejects concentration by evaporation (`finalVolume < initialVolume`) and the unphysical empty initial aliquot. It does not calculate final volume by adding solvent volumes, assume volume additivity, or model reaction/precipitation. Input concentrations use mol/L for this private contract even though the source permits other self-consistent concentration units. Moles requires supplied molar mass and does not infer a molecular formula, isotope composition, purity or atomic-weight table.

## Source evidence

Authority identity: `docs/calculator-first/authority-catalog.json`, exact IDs 328, 331 and 332. Historical arithmetic and unit-bearing field evidence: `src/calculators/chemistry/catalog-batch-1.ts` (molarity, moles and dilution definitions). This file's existing generic source label and `reviewStatus` are not independent publisher verification and are not promoted to certification evidence here.

External methodology checked 2026-11-14 with Firecrawl search then full-page retrieval: OpenStax, *Chemistry 2e*, Paul Flowers, Klaus Theopold, Richard Langley, William R. Robinson, section 3.3, <https://openstax.org/books/chemistry-2e/pages/3-3-molarity>. Search ID `01a1d81f-5c3b-748a-a40c-8571292653a3`; scrape ID `01a1d81f-a0f9-7048-8bda-34add90dd7b1`, HTTP 200, cache timestamp 2026-11-14T01:24:34.889Z. Only factual definitions and calculations are used; no textbook content or assets are redistributed.

The page defines molarity by solute moles per liter of **solution**, converts supplied mass to moles using molar mass, and derives the dilution equation from unchanged solute amount. It explicitly distinguishes initial and final measured solution volumes and permits equivalent units only when they cancel. These facts support all three contracts above without guessing legacy physics units.

## Independent numerical witnesses

| ID | Input | Expected raw output | Provenance |
| --- | --- | --- | --- |
| 328 | 0.01 mol / 0.2 L | 0.05 mol/L (binary64 rounding allowed) | OpenStax tea check-your-learning example |
| 331 | 36 g / 18 g/mol | 2 mol | Independent exact rational arithmetic witness; not an atomic-mass reference |
| 332 | 2.04 mol/L × 0.025 L / 0.5 L | 0.102 mol/L (binary64 rounding allowed) | OpenStax methanol dilution check-your-learning example, mL normalized to L |

Additional exact rational witnesses use 123456/64 = 1929 for molarity and moles. Inverse replay and JSON snapshot replay use exact original engine identity; graph samples include zero, negative, infinite and ordinary values. Accessor non-evaluation, extra keys, symbol keys, subnormal input/output, intermediate-underflow zero, reverse overflow, dilution-volume ordering, and sample-size refusal are exercised. Tests are verification evidence, not additional completed IDs.

## Remaining decisions and exclusions

Owner/specialist acceptance of these explicitly bounded contracts and any production certification remain outstanding. A richer chemistry product would require uncertainty/significant-figure policy, concentration unit selection/conversion, molar-mass sourcing, and laboratory-specific applicability; none are silently inferred.

Physics IDs 322, 323, 324, 325 and 327 remain excluded: the existing review records lack publisher-defined units and physical applicability; the unadopted 323/324 successor must stay private. This lane did not alter them. Chemistry IDs 329, 330 and 333–340 remain uncounted: no source-backed completion was implemented in this lane, and pH activity, atomic-weight policy, gas model/constant policy, stoichiometric equation handling and Nernst applicability require their own bounded decisions. Existing generic ideal-gas pressure index is not an exact ideal-gas-law identity.
