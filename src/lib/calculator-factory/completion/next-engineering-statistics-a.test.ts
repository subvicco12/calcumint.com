import {describe, expect, it} from 'vitest';
import {zScoreCalculator} from '@/calculators/statistics/catalog-batch-1';
import {confidenceIntervalCalculator, sampleSizeCalculator, probabilityCalculator, permutationCalculator} from '@/calculators/statistics/catalog-batch-2';
import {statisticsAContracts} from './next-engineering-statistics-a';

const engines = [zScoreCalculator, confidenceIntervalCalculator, sampleSizeCalculator, probabilityCalculator, permutationCalculator] as const;
const contract = (id: number) => {
  const result = statisticsAContracts.find(row => row.catalogId === id);
  if (!result) throw Error(`Missing contract ${id}`);
  return result;
};
const textInput = (input: object) => Object.fromEntries(Object.entries(input).map(([key, value]) => [key, String(value)]));

describe('statistics A immutable engineering bindings', () => {
  it('binds exactly IDs 284–288 and the v1 engine tuples', () => {
    expect(statisticsAContracts.map(row => [row.catalogId, row.engineId, row.slug, row.version])).toEqual([
      [284, 'statistics.z-score', 'z-score-calculator', 1],
      [285, 'statistics.confidence-interval', 'confidence-interval-calculator', 1],
      [286, 'statistics.sample-size', 'sample-size-calculator', 1],
      [287, 'statistics.probability', 'probability-calculator', 1],
      [288, 'statistics.permutation', 'permutation-calculator', 1],
    ]);
  });

  for (const [index, engine] of engines.entries()) {
    const id = 284 + index;
    it(`${id}: preserves every immutable example output field and roundtrips JSON history`, () => {
      const input = engine.examples[0].input;
      // The engine union has different input types; invoke through each contract's exact parsed fields.
      const captured = contract(id).execute(textInput(input));
      const expected = (engine.calculate as (input: object, context: object) => object)(input, {});
      expect(captured.output).toEqual(expected);
      expect(captured.output.steps).toBeInstanceOf(Array);
      const restored = JSON.parse(JSON.stringify(captured));
      expect(contract(id).verifyHistorical(restored).snapshot).toEqual(restored);
      expect(contract(id).sourceEvidence.every(path => path.startsWith('docs/next-engineering-20261115/statistics-a/'))).toBe(true);
    });

    it(`${id}: refuses omitted, invented, blank and numeric raw fields`, () => {
      const raw = textInput(engine.examples[0].input);
      const [first] = Object.keys(raw);
      const omitted = {...raw};
      delete omitted[first];
      for (const invalid of [omitted, {...raw, invented: '1'}, {...raw, [first]: ''}, {...raw, [first]: 1}]) {
        expect(() => contract(id).execute(invalid as Record<string, string>)).toThrow();
      }
    });

    it(`${id}: refuses altered identity, versions, outputs, steps and extra history fields`, () => {
      const c = contract(id), captured = c.execute(textInput(engine.examples[0].input));
      const first = Object.keys(captured.input)[0];
      for (const invalid of [
        {...captured, calculatorSlug: 'unknown-calculator'},
        {...captured, calculatorVersion: 2},
        {...captured, output: {...captured.output, [c.primaryKey]: 12345}},
        {...captured, output: {...captured.output, steps: ['altered']}},
        {...captured, output: {...captured.output, extra: 1}},
        {...captured, input: {...captured.input, extra: 1}},
        {...captured, input: {...captured.input, [first]: '1'}},
      ]) expect(() => c.verifyHistorical(invalid)).toThrow();
    });
  }
});

describe('independent constants and domain boundaries', () => {
  it.each([
    [{value: '17', mean: '5', standardDeviation: '6'}, 2, 12],
    [{value: '-3', mean: '5', standardDeviation: '2'}, -4, -8],
    [{value: '5', mean: '5', standardDeviation: '2'}, 0, 0],
  ])('284: standardizes a textbook or zero-deviation fixture', (input, z, deviation) => {
    expect(contract(284).execute(input).output).toMatchObject({zScore: z, deviation});
  });

  it.each(['0', '-1', 'NaN', 'Infinity'])('284: rejects invalid sigma %s', standardDeviation => {
    expect(() => contract(284).execute({value: '1', mean: '0', standardDeviation})).toThrow();
  });

  it.each([
    ['0.8', 1.281551565545], ['0.9', 1.644853626951], ['0.95', 1.95996398454],
    ['0.98', 2.326347874041], ['0.99', 2.575829303549],
  ])('285: preserves the v1 tabulated normal critical value at %s', (confidenceLevel, criticalValue) => {
    expect(contract(285).execute({estimate: '0', standardError: '1', confidenceLevel}).output)
      .toMatchObject({criticalValue, lowerBound: -criticalValue, upperBound: criticalValue});
  });

  it('285: rejects a positive interval width lost to binary64 addition', () => {
    expect(() => contract(285).execute({estimate: '1e20', standardError: '1', confidenceLevel: '0.95'})).toThrow(/collapse/i);
  });

  it.each(['0', '-1'])('285: rejects nonpositive SE %s', standardError => {
    expect(() => contract(285).execute({estimate: '0', standardError, confidenceLevel: '0.95'})).toThrow();
  });

  it.each([285, 286])('%s: rejects confidence levels outside the immutable table', id => {
    const raw = textInput(engines[id - 284].examples[0].input);
    expect(() => contract(id).execute({...raw, confidenceLevel: '0.96'})).toThrow();
  });

  it('286: rounds an independent proportion-planning fixture upward', () => {
    const output = contract(286).execute({confidenceLevel: '0.95', marginOfError: '0.05', proportion: '0.5'}).output;
    expect(output.sampleSize).toBe(385);
    // Independently evaluated normal-quantile formula, allowing the v1 table's rounding.
    expect(output.unroundedSampleSize).toBeCloseTo(384.14588206941244, 8);
  });

  it.each(['0', '1'])('286: excludes degenerate planning proportion %s from new capture', proportion => {
    expect(() => contract(286).execute({confidenceLevel: '0.95', marginOfError: '0.05', proportion})).toThrow(/proportion/i);
  });

  it.each(['0', '-0.1', '1.1', '1e-10'])('286: rejects unsupported margin or sample-count overflow %s', marginOfError => {
    expect(() => contract(286).execute({confidenceLevel: '0.95', marginOfError, proportion: '0.5'})).toThrow();
  });

  it.each([
    ['0.5', '0.4', 0.2, 0.7, 0.5], ['0', '1', 0, 1, 1], ['1', '0', 0, 1, 0], ['1', '1', 1, 1, 0],
  ])('287: retains independent-event and endpoint identities', (probabilityOfA, probabilityOfB, both, either, notA) => {
    expect(contract(287).execute({probabilityOfA, probabilityOfB}).output)
      .toMatchObject({bothIndependent: both, eitherIndependent: either, notA});
  });

  it('287: rejects a nonzero event lost in the complement or union', () => {
    expect(() => contract(287).execute({probabilityOfA: '1e-50', probabilityOfB: '0.5'})).toThrow(/collapse/i);
    expect(() => contract(287).execute({probabilityOfA: '0.5', probabilityOfB: '1e-50'})).toThrow(/collapse/i);
  });

  it('287: rejects a computed union below a certain event, without rewriting v1 output', () => {
    const input = {probabilityOfA: 1, probabilityOfB: 0.13};
    const output = probabilityCalculator.calculate(input, {});
    expect(output.eitherIndependent).toBe(0.9999999999999999);
    expect(() => contract(287).execute(textInput(input))).toThrow(/bounds/i);
    const snapshot = {calculatorSlug: probabilityCalculator.slug, calculatorVersion: 1, input, output};
    expect(contract(287).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });

  it('287: rejects an interior-event union rounded to certainty and preserves v1 history', () => {
    const input = {probabilityOfA: 0.999999999, probabilityOfB: 0.999999999};
    const output = probabilityCalculator.calculate(input, {});
    expect(output.eitherIndependent).toBe(1);
    expect(() => contract(287).execute(textInput(input))).toThrow(/collapse/i);
    const snapshot = {calculatorSlug: probabilityCalculator.slug, calculatorVersion: 1, input, output};
    expect(contract(287).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });

  it.each(['-0.1', '1.1'])('287: rejects probabilities outside [0,1]: %s', probabilityOfA => {
    expect(() => contract(287).execute({probabilityOfA, probabilityOfB: '0.5'})).toThrow();
  });

  it.each([['6', '3', 120], ['0', '0', 1], ['1000000000', '0', 1], ['18', '18', 6402373705728000]])(
    '288: exact ordered count P(%s,%s)', (n, r, permutations) => {
      expect(contract(288).execute({n, r}).output.permutations).toBe(permutations);
    });

  it.each([['19', '19'], ['5', '6'], ['5.5', '2'], ['-1', '0'], ['1000000001', '0']])(
    '288: rejects exact-integer overflow or invalid domain P(%s,%s)', (n, r) => {
      expect(() => contract(288).execute({n, r})).toThrow();
    });

  it('284: bounds new capture and retains original-domain historical values', () => {
    const input = {value: 1e60, mean: 0, standardDeviation: 1e60};
    const snapshot = {calculatorSlug: zScoreCalculator.slug, calculatorVersion: 1, input, output: zScoreCalculator.calculate(input, {})};
    expect(() => contract(284).execute(textInput(input))).toThrow();
    expect(contract(284).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });

  it('285: replays original v1 collapsed intervals without applying capture guards', () => {
    const input = {estimate: 1e20, standardError: 1, confidenceLevel: 0.95};
    const snapshot = {calculatorSlug: confidenceIntervalCalculator.slug, calculatorVersion: 1, input, output: confidenceIntervalCalculator.calculate(input, {})};
    expect(contract(285).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });

  it.each([0, 1])('286: replays the original endpoint proportion %s without a new-capture guard', proportion => {
    const input = {confidenceLevel: 0.95, marginOfError: 0.05, proportion};
    const snapshot = {calculatorSlug: sampleSizeCalculator.slug, calculatorVersion: 1, input, output: sampleSizeCalculator.calculate(input, {})};
    expect(contract(286).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });

  it('287: replays the original tiny-event calculation without a new-capture guard', () => {
    const input = {probabilityOfA: 1e-50, probabilityOfB: 0.5};
    const snapshot = {calculatorSlug: probabilityCalculator.slug, calculatorVersion: 1, input, output: probabilityCalculator.calculate(input, {})};
    expect(contract(287).verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  });
});
