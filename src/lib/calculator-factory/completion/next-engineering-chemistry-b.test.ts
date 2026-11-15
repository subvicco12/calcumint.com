import {describe, expect, it} from 'vitest';
import {
  stoichiometryCalculator, halfLifeCalculator, nernstEquationCalculator,
  beerLambertLawCalculator, titrationCalculator,
} from '@/calculators/chemistry/catalog-batch-1';
import type {EngineeringContract} from './next-engineering-core';
import {chemistryBContracts} from './next-engineering-chemistry-b';

const get = (id: number): EngineeringContract => {
  const contract = chemistryBContracts.find(row => row.catalogId === id);
  if (!contract) throw Error(`Missing chemistry contract ${id}`);
  return contract;
};
const cases = [
  {id:338, engine:stoichiometryCalculator, input:{knownMoles:4, knownCoefficient:3, targetCoefficient:2}, golden:8/3, unit:'mol'},
  {id:339, engine:halfLifeCalculator, input:{initialAmount:80, elapsedTime:30, halfLife:10}, golden:10, unit:'same as initial amount'},
  {id:340, engine:nernstEquationCalculator, input:{standardPotential:1.1, temperatureKelvin:298.15, electronCount:2, reactionQuotient:10}, golden:1.070420325156594, unit:'V'},
  {id:341, engine:beerLambertLawCalculator, input:{molarAbsorptivity:15000, pathLength:1.2, concentration:0.00002}, golden:0.36, unit:'dimensionless'},
  {id:342, engine:titrationCalculator, input:{titrantConcentration:0.1, titrantVolume:40, analyteVolume:25, titrantCoefficient:2, analyteCoefficient:1}, golden:0.08, unit:'mol/L'},
] as const;
const textInput = (input: object) => Object.fromEntries(Object.entries(input).map(([key,value]) => [key,String(value)]));

describe.each(cases)('chemistry contract $id', ({id,engine,input,golden,unit}) => {
  it('binds the exact immutable tuple, all fields, units, scope and applicable sources', () => {
    const contract=get(id);
    expect([contract.engineId,contract.slug,contract.version,contract.primaryKey,contract.unit]).toEqual([engine.id,engine.slug,1,'value',unit]);
    expect(contract.fields.map(field => field.key)).toEqual(Object.keys(input));
    expect(contract.fields.every(field => Boolean(field.unit))).toBe(true);
    expect(contract.scope.length).toBeGreaterThan(100);
    expect(contract.sourceEvidence.some(source => source.startsWith('https://'))).toBe(true);
  });
  it('captures an independent numeric golden and preserves the complete engine output', () => {
    const snapshot=get(id).execute(textInput(input));
    expect(snapshot.output.value).toBeCloseTo(golden,12);
    // Separate from the independent numeric oracle: assert complete immutable output retention.
    const output=engine.calculate(input as never,{});
    expect(snapshot.output).toEqual(output);
    expect(Array.isArray(snapshot.output.steps)).toBe(true);
  });
  it('rejects missing, blank, unknown, nonnumeric and out-of-bound capture fields', () => {
    const raw=textInput(input), first=Object.keys(raw)[0];
    const missing={...raw}; delete missing[first];
    for (const bad of [missing,{...raw,[first]:''},{...raw,extra:'1'},{...raw,[first]:'NaN'},{...raw,[first]:'1e51'},{...raw,[first]:'1e-51'}]) {
      expect(() => get(id).execute(bad)).toThrow();
    }
  });
  it('rejects historical wrong identity/version, tampered value/steps and unknown input/output fields', () => {
    const contract=get(id), snapshot=contract.execute(textInput(input));
    expect(contract.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
    for (const bad of [
      {...snapshot,calculatorVersion:2}, {...snapshot,calculatorSlug:'unknown'},
      {...snapshot,output:{...snapshot.output,value:999}},
      {...snapshot,output:{...snapshot.output,steps:['forged']}},
      {...snapshot,input:{...snapshot.input,extra:1}},
      {...snapshot,output:{...snapshot.output,extra:1}},
    ]) expect(() => contract.verifyHistorical(bad)).toThrow();
  });
});

it('offers exactly catalog IDs 338 through 342', () => {
  expect(chemistryBContracts.map(row => row.catalogId)).toEqual([338,339,340,341,342]);
});
it('requires positive balanced coefficients while allowing fractional common rescaling', () => {
  const contract=get(338);
  expect(contract.execute({knownMoles:'4',knownCoefficient:'1.5',targetCoefficient:'1'}).output.value).toBeCloseTo(8/3,12);
  expect(contract.execute({knownMoles:'0',knownCoefficient:'3',targetCoefficient:'2'}).output.value).toBe(0);
  expect(() => contract.execute({knownMoles:'4',knownCoefficient:'3',targetCoefficient:'0'})).toThrow();
});
it('refuses half-life intermediate power underflow and subnormal results, preserving actual zero and t=0', () => {
  const contract=get(339);
  expect(contract.execute({initialAmount:'0',elapsedTime:'1e50',halfLife:'1e-50'}).output.value).toBe(0);
  expect(contract.execute({initialAmount:'80',elapsedTime:'0',halfLife:'10'}).output.value).toBe(80);
  expect(contract.execute({initialAmount:'1',elapsedTime:'1022',halfLife:'1'}).output.value).toBe(2**-1022);
  for (const input of [
    {initialAmount:'1',elapsedTime:'1075',halfLife:'1'},
    {initialAmount:'1e50',elapsedTime:'1075',halfLife:'1'},
    {initialAmount:'1e50',elapsedTime:'1074',halfLife:'1'},
    {initialAmount:'1e-50',elapsedTime:'1000',halfLife:'1'},
  ]) expect(() => contract.execute(input)).toThrow();
});
it('requires whole electron transfers and positive dimensionless Q, preserving potential direction', () => {
  const contract=get(340), raw={standardPotential:'1.1',temperatureKelvin:'298.15',electronCount:'2',reactionQuotient:'1'};
  expect(contract.execute(raw).output.value).toBe(1.1);
  expect(contract.execute({...raw,reactionQuotient:'0.1'}).output.value).toBeCloseTo(1.129579674843406,12);
  for (const invalid of [{electronCount:'1.5'},{electronCount:'0'},{reactionQuotient:'0'},{reactionQuotient:'-1'},{temperatureKelvin:'0'}]) {
    expect(() => contract.execute({...raw,...invalid})).toThrow();
  }
});
it('preserves optical zero boundaries and refuses negative factors', () => {
  const contract=get(341),raw={molarAbsorptivity:'100',pathLength:'1',concentration:'0.01'};
  for (const field of Object.keys(raw)) {
    expect(contract.execute({...raw,[field]:'0'}).output.value).toBe(0);
    expect(() => contract.execute({...raw,[field]:'-1'})).toThrow();
  }
});
it('uses matching volume units and balanced coefficients at titration equivalence', () => {
  const contract=get(342), raw={titrantConcentration:'0.1',titrantVolume:'40',analyteVolume:'25',titrantCoefficient:'2',analyteCoefficient:'1'};
  expect(contract.execute({...raw,titrantVolume:'0.04',analyteVolume:'0.025'}).output.value).toBeCloseTo(0.08,14);
  expect(contract.execute({...raw,titrantCoefficient:'1',analyteCoefficient:'0.5'}).output.value).toBeCloseTo(0.08,14);
  for (const field of ['analyteVolume','titrantCoefficient','analyteCoefficient']) expect(() => contract.execute({...raw,[field]:'0'})).toThrow();
});

it('replays original engine domains outside capture bounds or chemistry capture assumptions', () => {
  const historical = [
    {id:338,engine:stoichiometryCalculator,input:{knownMoles:1e60,knownCoefficient:1e60,targetCoefficient:0}},
    {id:339,engine:halfLifeCalculator,input:{initialAmount:1,elapsedTime:1075,halfLife:1}},
    {id:340,engine:nernstEquationCalculator,input:{standardPotential:1,temperatureKelvin:298.15,electronCount:0.5,reactionQuotient:1}},
    {id:341,engine:beerLambertLawCalculator,input:{molarAbsorptivity:1e60,pathLength:1,concentration:1e-60}},
    {id:342,engine:titrationCalculator,input:{titrantConcentration:1e60,titrantVolume:1,analyteVolume:1,titrantCoefficient:1e60,analyteCoefficient:1}},
  ];
  for (const {id,engine,input} of historical) {
    const snapshot={calculatorSlug:engine.slug,calculatorVersion:1,input,output:engine.calculate(input as never,{})};
    expect(() => get(id).execute(textInput(input))).toThrow();
    expect(get(id).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  }
});
