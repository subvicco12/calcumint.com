import {
  stoichiometryCalculator, halfLifeCalculator, nernstEquationCalculator,
  beerLambertLawCalculator, titrationCalculator,
} from '@/calculators/chemistry/catalog-batch-1';
import {createEngineeringContract} from './next-engineering-core';

const evidence = 'docs/next-engineering-20261115/chemistry-b/source-manifest.json';

/** Private engineering capture adapters; immutable catalog engines remain authoritative for historical replay. */
export const chemistryBContracts = Object.freeze([
  createEngineeringContract(stoichiometryCalculator, {
    catalogId:338, primaryKey:'value', unit:'mol',
    scope:'Target amount in mol from the ratio of positive coefficients in the same supplied balanced reaction. Coefficients may share a fractional rescaling. Assumes complete stoichiometric conversion of the supplied known amount; no equation balancing, limiting-reactant selection, yield, purity or side-reaction model.',
    sourceEvidence:[evidence,'https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry'],
    fieldUnits:{knownMoles:'mol',knownCoefficient:'dimensionless',targetCoefficient:'dimensionless'},
    validate(input) {
      if (input.targetCoefficient <= 0) throw Error('Positive balanced-reaction target coefficient required');
    },
  }),
  createEngineeringContract(halfLifeCalculator, {
    catalogId:339, primaryKey:'value', unit:'same as initial amount',
    scope:'Remaining amount for a closed first-order decay process with a constant positive half-life, no replenishment and nonnegative elapsed time. Initial and remaining amounts share one unit; elapsed time and half-life share one time unit. For positive initial amount, capture requires both the decay factor and remaining amount to be positive normal binary64 values; mathematical decay rounded to zero or subnormal intermediates is refused.',
    sourceEvidence:[evidence,'https://openstax.org/books/chemistry-2e/pages/12-4-integrated-rate-laws'],
    fieldUnits:{initialAmount:'chosen amount unit',elapsedTime:'same time unit as halfLife',halfLife:'same time unit as elapsedTime'},
    validate(input, output) {
      if (input.initialAmount > 0 && (Math.pow(0.5,input.elapsedTime/input.halfLife) < 2**-1022 || output.value < 2**-1022)) {
        throw Error('Positive decay factor and remaining amount must remain in the normal binary64 range');
      }
    },
  }),
  createEngineeringContract(nernstEquationCalculator, {
    catalogId:340, primaryKey:'value', unit:'V',
    scope:'Nernst cell potential E = E° - (RT/nF) ln Q for the same balanced redox reaction, with E° applicable at the supplied positive kelvin temperature and a positive safe-integer electron transfer count n. Q is a positive dimensionless activity quotient relative to standard states, with pure solid/liquid activities taken as unity; concentration substitution requires justified ideal behavior. The engine fixes R = 8.31446261815324 J/(mol K) and F = 96485.33212 C/mol; it does not compute activities, temperature corrections to E°, kinetics, overpotential or junction potentials.',
    sourceEvidence:[evidence,'https://openstax.org/books/chemistry-2e/pages/17-4-potential-free-energy-and-equilibrium','https://openstax.org/books/chemistry-2e/pages/13-2-equilibrium-constants','https://goldbook.iupac.org/terms/view/A00115','https://physics.nist.gov/cgi-bin/cuu/Value?r','https://physics.nist.gov/cgi-bin/cuu/Value?f'],
    fieldUnits:{standardPotential:'V',temperatureKelvin:'K',electronCount:'dimensionless integer',reactionQuotient:'dimensionless activity quotient'},
    validate(input) {
      if (!Number.isSafeInteger(input.electronCount)) throw Error('Positive safe-integer electron count required');
    },
  }),
  createEngineeringContract(beerLambertLawCalculator, {
    catalogId:341, primaryKey:'value', unit:'dimensionless',
    scope:'Decadic absorbance A = εbc using molar absorption coefficient ε in L/(mol cm), optical path b in cm and concentration c in mol/L. Assumes collimated monochromatic radiation, a homogeneous isotropic absorbing medium, and valid linear response at the chosen wavelength; excludes scattering, stray light, concentration-dependent interactions, speciation changes and detector saturation. Zero factor gives zero absorbance within the ideal mathematical model.',
    sourceEvidence:[evidence,'https://goldbook.iupac.org/terms/view/B00626'],
    fieldUnits:{molarAbsorptivity:'L/(mol cm)',pathLength:'cm',concentration:'mol/L'},
  }),
  createEngineeringContract(titrationCalculator, {
    catalogId:342, primaryKey:'value', unit:'mol/L',
    scope:'Analyte molar concentration at exact equivalence of the supplied balanced titrant/analyte reaction, using positive stoichiometric coefficients with optional common fractional rescaling. Titrant concentration is in mol/L; titrant and analyte volumes must use the same unit (for example both mL). Assumes quantitative selective reaction, known titrant concentration, and measured volumes; no endpoint/equivalence correction, blank correction, dilution, acid/base speciation or uncertainty model.',
    sourceEvidence:[evidence,'https://openstax.org/books/chemistry-2e/pages/4-5-quantitative-chemical-analysis','https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry'],
    fieldUnits:{titrantConcentration:'mol/L',titrantVolume:'same volume unit as analyteVolume',analyteVolume:'same volume unit as titrantVolume',titrantCoefficient:'dimensionless',analyteCoefficient:'dimensionless'},
  }),
]);
