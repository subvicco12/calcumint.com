import {describe, expect, it} from 'vitest';
import {combinationCalculator, binomialProbabilityCalculator, normalDistributionCalculator} from '@/calculators/statistics/catalog-batch-3';
import {bayesTheoremCalculator} from '@/calculators/statistics/catalog-batch-4';
import {statisticsBContracts} from './next-engineering-statistics-b';

const [combination, binomial, normal, bayes] = statisticsBContracts;
const cases = [
  {contract: combination, engine: combinationCalculator, input: {n: 5, r: 3}, raw: {n: '5', r: '3'}},
  {contract: binomial, engine: binomialProbabilityCalculator, input: {n: 10, k: 3, p: 0.5}, raw: {n: '10', k: '3', p: '0.5'}},
  {contract: normal, engine: normalDistributionCalculator, input: {x: 0, mean: 0, standardDeviation: 1}, raw: {x: '0', mean: '0', standardDeviation: '1'}},
  {contract: bayes, engine: bayesTheoremCalculator, input: {prior: 0.2, likelihood: 0.8, evidenceGivenNot: 0.1}, raw: {prior: '0.2', likelihood: '0.8', evidenceGivenNot: '0.1'}},
] as const;

it('binds only the four assigned immutable identities and records units and evidence', () => {
  expect(statisticsBContracts.map(c => [c.catalogId, c.engineId, c.version, c.primaryKey])).toEqual([
    [289, 'statistics.combination', 1, 'combinations'], [290, 'statistics.binomial-probability', 1, 'probability'],
    [291, 'statistics.normal-distribution', 1, 'cdf'], [300, 'statistics.bayes-theorem', 1, 'posterior'],
  ]);
  for (const c of statisticsBContracts) {
    expect(c.sourceEvidence?.some(s => s.startsWith('https://'))).toBe(true);
    expect(c.fields.every(f => !!f.unit)).toBe(true);
  }
});

describe.each(cases)('$engine.id capture and replay', ({contract, input, raw, engine}) => {
  it('retains every structured output and exact historical forward result', () => {
    const snapshot = contract.execute(raw);
    // The heterogeneous engine union is intentionally dispatched with its matching case.
    const output = engine.calculate(input as never, {});
    expect(snapshot.output).toEqual(output);
    expect(contract.verifyHistorical(JSON.parse(JSON.stringify(snapshot))).snapshot).toEqual(snapshot);
    expect(snapshot.output.steps).toBeInstanceOf(Array);
  });
  it('refuses missing, unknown, blank, malformed, and nonfinite fields', () => {
    const first = Object.keys(raw)[0];
    const missing: Record<string, string> = {...raw};
    delete missing[first];
    for (const bad of [missing, {...raw, invented: '1'}, {...raw, [first]: ''}, {...raw, [first]: 'NaN'}, {...raw, [first]: 'Infinity'}, {...raw, [first]: '1abc'}]) {
      expect(() => contract.execute(bad)).toThrow();
    }
  });
  it('refuses forged primary, steps, extra outputs, identities, versions and fields', () => {
    const s = contract.execute(raw);
    for (const bad of [
      {...s, calculatorVersion: 2}, {...s, calculatorSlug: 'unavailable'},
      {...s, input: {...s.input, invented: 1}}, {...s, input: {}},
      {...s, output: {...s.output, [contract.primaryKey]: 42}},
      {...s, output: {...s.output, steps: ['forged']}},
      {...s, output: {...s.output, invented: 1}},
    ]) expect(() => contract.verifyHistorical(bad)).toThrow();
  });
});

it('combination independent goldens, integer domain and exact range', () => {
  expect(combination.execute({n: '52', r: '5'}).output.combinations).toBe(2598960);
  expect(combination.execute({n: '0', r: '0'}).output.combinations).toBe(1);
  expect(combination.execute({n: '10000', r: '1'}).output.combinations).toBe(10000);
  expect(combination.execute({n: '56', r: '28'}).output.combinations).toBe(7648690600760440);
  for (const raw of [{n: '-1', r: '0'}, {n: '2.5', r: '1'}, {n: '2', r: '3'}, {n: '10001', r: '0'}, {n: '57', r: '28'}]) {
    expect(() => combination.execute(raw)).toThrow();
  }
});

it('binomial independent PMF, degenerate boundaries and underflow refusal', () => {
  expect(binomial.execute({n: '10', k: '3', p: '0.5'}).output.probability).toBeCloseTo(15 / 128, 14);
  for (const [n, k, p, probability] of [[0, 0, 0.5, 1], [10, 0, 0, 1], [10, 1, 0, 0], [10, 10, 1, 1], [10, 9, 1, 0]]) {
    expect(binomial.execute({n: String(n), k: String(k), p: String(p)}).output.probability).toBe(probability);
  }
  for (const raw of [{n: '2', k: '3', p: '0.5'}, {n: '2', k: '1.5', p: '0.5'}, {n: '10001', k: '0', p: '0.5'}, {n: '2', k: '1', p: '-0.1'}, {n: '2', k: '1', p: '1.1'}, {n: '10000', k: '10000', p: '0.5'}, {n: '1070', k: '1070', p: '0.5'}]) {
    expect(() => binomial.execute(raw)).toThrow();
  }
});

it('normal independent density and CDF reference values disclose approximation', () => {
  const atMean = normal.execute({x: '0', mean: '0', standardDeviation: '1'}).output;
  expect(atMean.pdf).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 15);
  expect(atMean.cdf).toBeCloseTo(0.5, 8);
  const high = normal.execute({x: '1.96', mean: '0', standardDeviation: '1'}).output;
  const low = normal.execute({x: '-1.96', mean: '0', standardDeviation: '1'}).output;
  expect(high.cdf as number).toBeCloseTo(0.9750021048517795, 6);
  expect(low.cdf as number).toBeCloseTo(0.0249978951482204, 6);
  expect(high.upperTail).toBe(low.cdf);
  expect(normal.scope).toMatch(/approximation/i);
});

it('normal capture refuses unsupported tails and density underflow; historical replay preserves them', () => {
  for (const x of ['-4', '4']) expect(() => normal.execute({x, mean: '0', standardDeviation: '1'})).not.toThrow();
  for (const x of ['-4.000001', '4.000001', '40']) expect(() => normal.execute({x, mean: '0', standardDeviation: '1'})).toThrow();
  for (const standardDeviation of ['0', '-1']) expect(() => normal.execute({x: '0', mean: '0', standardDeviation})).toThrow();
  const input = {x: 40, mean: 0, standardDeviation: 1};
  const old = {calculatorSlug: normalDistributionCalculator.slug, calculatorVersion: 1, input, output: normalDistributionCalculator.calculate(input, {})};
  expect(old.output.upperTail).toBe(0);
  expect(normal.verifyHistorical(old).snapshot).toEqual(old);
  const wideInput = {x: 1e60, mean: 1e60, standardDeviation: 1e60};
  expect(normal.verifyHistorical({calculatorSlug: normalDistributionCalculator.slug, calculatorVersion: 1, input: wideInput, output: normalDistributionCalculator.calculate(wideInput, {})}).snapshot.input).toEqual(wideInput);
});

it('binomial historical replay preserves former underflow results', () => {
  const input = {n: 10000, k: 10000, p: 0.5};
  const snapshot = {calculatorSlug: binomialProbabilityCalculator.slug, calculatorVersion: 1, input, output: binomialProbabilityCalculator.calculate(input, {})};
  expect(snapshot.output.probability).toBe(0);
  expect(binomial.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
});

it('Bayes independent fraction, endpoints and zero evidence', () => {
  expect(bayes.execute({prior: '0.03', likelihood: '0.75', evidenceGivenNot: '0.15'}).output.posterior).toBeCloseTo(15 / 112, 14);
  expect(bayes.execute({prior: '0', likelihood: '1', evidenceGivenNot: '1'}).output.posterior).toBe(0);
  expect(bayes.execute({prior: '1', likelihood: '1', evidenceGivenNot: '0'}).output.posterior).toBe(1);
  for (const raw of [{prior: '0', likelihood: '1', evidenceGivenNot: '0'}, {prior: '1', likelihood: '0', evidenceGivenNot: '1'}, {prior: '0.5', likelihood: '0', evidenceGivenNot: '0'}, {prior: '-0.1', likelihood: '1', evidenceGivenNot: '1'}, {prior: '0.5', likelihood: '1.1', evidenceGivenNot: '1'}]) {
    expect(() => bayes.execute(raw)).toThrow();
  }
});

it('refuses rounded interior probability endpoints but preserves historical agreement', () => {
  expect(() => binomial.execute({n: '1', k: '0', p: '1e-50'})).toThrow(/rounded/);
  expect(() => bayes.execute({prior: '0.5', likelihood: '1', evidenceGivenNot: '1e-50'})).toThrow(/rounded/);
  const input = {prior: 0.5, likelihood: 1, evidenceGivenNot: 1e-50};
  const snapshot = {calculatorSlug: bayesTheoremCalculator.slug, calculatorVersion: 1, input, output: bayesTheoremCalculator.calculate(input, {})};
  expect(snapshot.output.posterior).toBe(1);
  expect(bayes.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
});
