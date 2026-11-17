import {
  molalityCalculator,
  phCalculator,
  idealGasLawCalculator,
  gasDensityCalculator,
  percentCompositionCalculator,
  solutionConcentrationCalculator,
} from '@/calculators/chemistry/catalog-batch-1';
import {createEngineeringContract} from './next-engineering-core';

const evidence = (section: string) => [
  `docs/next-engineering-20261115/chemistry-a/sources/${section}.md`,
  'docs/next-engineering-20261115/chemistry-a/source-manifest.json',
];

/** Private review only. Original v1 engines and historical domains remain immutable. */
export const chemistryAContracts = Object.freeze([
  createEngineeringContract(molalityCalculator, {
    catalogId: 329, primaryKey: 'value', unit: 'mol/kg',
    scope: 'Molality n/m_solvent from solute amount in mol and positive solvent mass in kg. The denominator is solvent mass, not solution mass. Composition only; no ideal-solution activity or colligative-property prediction.',
    sourceEvidence: evidence('11-4-colligative-properties'),
    fieldUnits: {moles: 'mol', solventMassKg: 'kg'},
  }),
  createEngineeringContract(phCalculator, {
    catalogId: 333, primaryKey: 'value', unit: 'dimensionless',
    scope: 'Concentration-model pH = -log10([H+]/(1 mol/L)), with positive hydrogen-ion concentration in mol/L. Ideal dilute-solution approximation treating concentration as activity; no activity coefficients, ionic-strength correction, acid dissociation solving or temperature-based neutrality classification. Values are not restricted to 0–14.',
    sourceEvidence: [...evidence('14-2-ph-and-poh'), ...evidence('11-4-colligative-properties')],
    fieldUnits: {hydrogenIonConcentration: 'mol/L'},
  }),
  createEngineeringContract(idealGasLawCalculator, {
    catalogId: 334, primaryKey: 'value', unit: 'atm',
    scope: 'Ideal-gas absolute pressure P=nRT/V in atm; amount in mol, strictly positive absolute temperature in K and volume in L. Immutable v1 R=0.082057366080960 L·atm·mol^-1·K^-1. Zero amount represents the vacuum limit. No real-gas, gauge-pressure or Celsius conversion.',
    sourceEvidence: [...evidence('9-2-ideal-gas-law'), ...evidence('nist-molar-gas-constant'), ...evidence('nist-sp811-pressure-units')],
    fieldUnits: {moles: 'mol', temperatureKelvin: 'K', volumeLiters: 'L'},
    validate(input) {
      if (input.temperatureKelvin <= 0) throw Error('Absolute gas temperature must be positive in K');
    },
  }),
  createEngineeringContract(gasDensityCalculator, {
    catalogId: 335, primaryKey: 'value', unit: 'g/L',
    scope: 'Ideal-gas density rho=PM/(RT) in g/L; nonnegative absolute pressure in atm, strictly positive molar mass in g/mol and absolute temperature in K. Immutable v1 R=0.082057366080960 L·atm·mol^-1·K^-1. Zero pressure is the vacuum limit; no real-gas corrections.',
    sourceEvidence: [...evidence('9-3-gas-stoichiometry'), ...evidence('nist-molar-gas-constant'), ...evidence('nist-sp811-pressure-units')],
    fieldUnits: {pressureAtm: 'atm', molarMassGPerMol: 'g/mol', temperatureKelvin: 'K'},
    validate(input) {
      if (input.molarMassGPerMol <= 0) throw Error('Gas molar mass must be positive in g/mol');
    },
  }),
  createEngineeringContract(percentCompositionCalculator, {
    catalogId: 336, primaryKey: 'value', unit: '%',
    scope: 'Mass percent =100 componentMass/totalMass using g for both masses. Total includes the component and must be positive; component lies from zero through total. A composition ratio, with no volume-percent or mass/volume-percent interpretation.',
    sourceEvidence: [...evidence('3-4-other-concentrations'), ...evidence('3-2-mass-composition')],
    fieldUnits: {componentMass: 'g', totalMass: 'g'},
    validate(input) {
      if (input.componentMass > input.totalMass) throw Error('Component mass must not exceed total mass');
    },
  }),
  createEngineeringContract(solutionConcentrationCalculator, {
    catalogId: 337, primaryKey: 'value', unit: 'g/L',
    scope: 'Mass concentration = solute mass in g / positive final total solution volume in L, not solvent volume. The mass/volume ratio underlying the textbook mass-volume percentage is expressed here in g/L, not percent. Composition only; no activity or ideal-solution thermodynamic correction and no conversion to molarity.',
    sourceEvidence: evidence('3-4-other-concentrations'),
    fieldUnits: {soluteMassGrams: 'g', solutionVolumeLiters: 'L'},
  }),
]);
