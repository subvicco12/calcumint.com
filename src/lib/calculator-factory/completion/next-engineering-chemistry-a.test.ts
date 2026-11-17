import {expect, it} from 'vitest';
import {chemistryAContracts} from './next-engineering-chemistry-a';
import {
  molalityCalculator, phCalculator, idealGasLawCalculator, gasDensityCalculator,
  percentCompositionCalculator, solutionConcentrationCalculator,
} from '@/calculators/chemistry/catalog-batch-1';
import type {EngineeringContract} from './next-engineering-core';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';

const contract = (id: number): EngineeringContract => {
  const found = chemistryAContracts.find(c => c.catalogId === id);
  if (!found) throw Error(`Missing contract ${id}`);
  return found;
};
const cases = [
  {id: 329, raw: {moles: '35.8', solventMassKg: '2'}, want: 17.9, unit: 'mol/kg'},
  {id: 333, raw: {hydrogenIonConcentration: '2.5e-4'}, want: 3.6020599913279625, unit: 'dimensionless'},
  {id: 334, raw: {moles: '2', temperatureKelvin: '350', volumeLiters: '25'}, want: 2.29760625026688, unit: 'atm'},
  {id: 335, raw: {pressureAtm: '2', molarMassGPerMol: '44', temperatureKelvin: '300'}, want: 3.5747349365798896, unit: 'g/L'},
  {id: 336, raw: {componentMass: '13', totalMass: '52'}, want: 25, unit: '%'},
  {id: 337, raw: {soluteMassGrams: '2.5', solutionVolumeLiters: '0.125'}, want: 20, unit: 'g/L'},
] as const;

it('provides exactly the six assigned immutable chemistry tuples', () => {
  expect(chemistryAContracts.map(c => [c.catalogId, c.engineId, c.version])).toEqual([
    [329, 'chemistry.molality', 1],
    [333, 'chemistry.ph', 1],
    [334, 'chemistry.ideal-gas-law', 1],
    [335, 'chemistry.gas-density', 1],
    [336, 'chemistry.percent-composition', 1],
    [337, 'chemistry.solution-concentration', 1],
  ]);
});

it.each(cases)('ID $id captures an independently calculated golden and all structured output', ({id, raw, want, unit}) => {
  const c = contract(id), snapshot = c.execute(raw);
  expect(snapshot.output.value).toBeCloseTo(want, 13);
  expect(snapshot.output.steps).toEqual([`${c.title.replace(' Calculator', '')} = ${snapshot.output.value}`]);
  expect(Object.keys(snapshot.output).sort()).toEqual(['steps', 'value']);
  expect(snapshot.calculatorSlug).toBe(c.slug);
  expect(snapshot.calculatorVersion).toBe(1);
  expect(c.unit).toBe(unit);
  expect(c.fields.every(f => f.unit)).toBe(true);
  expect(c.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
});

it.each(cases)('ID $id refuses omitted, invented and non-text raw fields', ({id, raw}) => {
  const c = contract(id), key = Object.keys(raw)[0];
  const omitted = {...raw} as Record<string, string>;
  delete omitted[key];
  for (const invalid of [omitted, {...raw, extra: '1'}, {...raw, [key]: 1}, {...raw, [key]: null}, {...raw, [key]: true}, [], null]) {
    expect(() => c.execute(invalid as never)).toThrow();
  }
});

it.each(cases)('ID $id refuses incomplete, nonfinite, out-of-range and malformed numeric text', ({id, raw}) => {
  const c = contract(id), key = Object.keys(raw)[0];
  for (const bad of ['', '   ', 'NaN', 'Infinity', '-Infinity', '1e309', '1e51', '1e-51', '12junk', '0x10', '1/2', '1,000']) {
    expect(() => c.execute({...raw, [key]: bad})).toThrow();
  }
});

it.each([
  [329, {moles: '0', solventMassKg: '1'}, 0],
  [334, {moles: '0', temperatureKelvin: '1', volumeLiters: '1'}, 0],
  [335, {pressureAtm: '0', molarMassGPerMol: '1', temperatureKelvin: '1'}, 0],
  [336, {componentMass: '0', totalMass: '1'}, 0],
  [336, {componentMass: '1', totalMass: '1'}, 100],
  [337, {soluteMassGrams: '0', solutionVolumeLiters: '1'}, 0],
  [333, {hydrogenIonConcentration: '10'}, -1],
  [333, {hydrogenIonConcentration: '1e-15'}, 15],
  [333, {hydrogenIonConcentration: '1e-50'}, 50],
  [333, {hydrogenIonConcentration: '1e50'}, -50],
] as const)('ID %i retains physical zero/endpoints and unrestricted concentration-model pH', (id, raw, want) => {
  expect(contract(id).execute(raw).output.value).toBe(want);
});

it.each([
  [329, {moles: '-1', solventMassKg: '1'}],
  [329, {moles: '1', solventMassKg: '0'}],
  [333, {hydrogenIonConcentration: '0'}],
  [333, {hydrogenIonConcentration: '-1'}],
  [334, {moles: '1', temperatureKelvin: '0', volumeLiters: '1'}],
  [334, {moles: '0', temperatureKelvin: '0', volumeLiters: '1'}],
  [334, {moles: '1', temperatureKelvin: '-1', volumeLiters: '1'}],
  [334, {moles: '1', temperatureKelvin: '1', volumeLiters: '0'}],
  [335, {pressureAtm: '1', molarMassGPerMol: '0', temperatureKelvin: '1'}],
  [335, {pressureAtm: '0', molarMassGPerMol: '0', temperatureKelvin: '1'}],
  [335, {pressureAtm: '-1', molarMassGPerMol: '1', temperatureKelvin: '1'}],
  [335, {pressureAtm: '1', molarMassGPerMol: '1', temperatureKelvin: '0'}],
  [336, {componentMass: '1.0000000000000002', totalMass: '1'}],
  [336, {componentMass: '1', totalMass: '0'}],
  [337, {soluteMassGrams: '1', solutionVolumeLiters: '0'}],
] as const)('ID %i refuses nonphysical capture inputs %j', (id, raw) => {
  expect(() => contract(id).execute(raw)).toThrow();
});

it.each([
  [329, {moles: '1e-50', solventMassKg: '1e50'}, 1e-100],
  [334, {moles: '1e-50', temperatureKelvin: '1e-50', volumeLiters: '1e50'}, 8.205736608096e-152],
  [335, {pressureAtm: '1e-50', molarMassGPerMol: '1e-50', temperatureKelvin: '1e50'}, 1.2186596374704168e-149],
  [336, {componentMass: '1e-50', totalMass: '1e50'}, 1e-98],
  [337, {soluteMassGrams: '1e-50', solutionVolumeLiters: '1e50'}, 1e-100],
] as const)('ID %i preserves a nonzero result at the bounded numeric extremes', (id, raw, want) => {
  const value = contract(id).execute(raw).output.value as number;
  expect(value).toBeGreaterThan(0);
  expect(value / want).toBeCloseTo(1, 13);
});

const histories = [
  {id: 329, slug: molalityCalculator.slug, input: {moles: 1e60, solventMassKg: 1e60}, output: {value: 1, steps: ['Molality = 1']}},
  {id: 333, slug: phCalculator.slug, input: {hydrogenIonConcentration: 1e-60}, output: {value: 60, steps: ['pH = 60']}},
  {id: 334, slug: idealGasLawCalculator.slug, input: {moles: 1, temperatureKelvin: 0, volumeLiters: 1}, output: {value: 0, steps: ['Ideal Gas Law = 0']}},
  {id: 335, slug: gasDensityCalculator.slug, input: {pressureAtm: 1, molarMassGPerMol: 0, temperatureKelvin: 1}, output: {value: 0, steps: ['Gas Density = 0']}},
  {id: 336, slug: percentCompositionCalculator.slug, input: {componentMass: 2, totalMass: 1}, output: {value: 200, steps: ['Percent Composition = 200']}},
  {id: 337, slug: solutionConcentrationCalculator.slug, input: {soluteMassGrams: 1e60, solutionVolumeLiters: 1e60}, output: {value: 1, steps: ['Solution Concentration = 1']}},
] as const;

it.each(histories)('ID $id replays its original v1 domain while refusing the same new capture', ({id, slug, input, output}) => {
  const c = contract(id), snapshot = {calculatorSlug: slug, calculatorVersion: 1, input, output};
  expect(() => c.execute(Object.fromEntries(Object.entries(input).map(([k, v]) => [k, String(v)])))).toThrow();
  expect(c.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
});

it.each(histories)('ID $id refuses tampered historical fields and unavailable identity/version', ({id, slug, input, output}) => {
  const c = contract(id), snapshot: CalculationSnapshot = {calculatorSlug: slug, calculatorVersion: 1, input, output};
  for (const bad of [
    {...snapshot, calculatorVersion: 2},
    {...snapshot, calculatorSlug: 'unavailable'},
    {...snapshot, input: {...input, extra: 1}},
    {...snapshot, output: {...output, value: output.value + 1}},
    {...snapshot, output: {...output, steps: ['tampered']}},
    {...snapshot, output: {...output, extra: 1}},
  ]) expect(() => c.verifyHistorical(bad)).toThrow();
});

it('preserves a genuinely underflowed original-domain historical result without admitting it as capture', () => {
  const snapshot = {calculatorSlug: 'molality-calculator', calculatorVersion: 1, input: {moles: Number.MIN_VALUE, solventMassKg: 1e100}, output: {value: 0, steps: ['Molality = 0']}};
  expect(contract(329).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  expect(() => contract(329).execute({moles: String(Number.MIN_VALUE), solventMassKg: '1e100'})).toThrow();
});
