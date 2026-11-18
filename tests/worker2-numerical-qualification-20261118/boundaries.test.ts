import { expect, it } from 'vitest';
import { angularVelocityCalculator, capacitanceCalculator } from '../../src/calculators/physics/catalog-batch-3';
import { coefficientOfVariationCalculator } from '../../src/calculators/statistics/catalog-batch-4';

const min = Number.MIN_VALUE;

it.each([
  ['#322 capacitance', (n: number, d: number) => capacitanceCalculator.calculate({charge: n, voltage: d}).value],
  ['#327 angular velocity', (n: number, d: number) => angularVelocityCalculator.calculate({angle: n, time: d}).value],
] as const)('%s rounds the exact quotient at the subnormal boundary', (_name, divide) => {
  // Expressed in units of 2^-1074, the exact quotients are 1/4, 1/2 and 1.
  expect(divide(min, 4)).toBe(0);
  expect(divide(min, 2)).toBe(0);
  expect(divide(-min, 2)).toBe(-0);
  expect(divide(min, 1)).toBe(min);
  expect(divide(3 * min, 2)).toBe(2 * min);
});

it('#298 preserves magnitude-based v1 and exposes its scale assumptions', () => {
  const engine = coefficientOfVariationCalculator;
  const cv = (mean: number, standardDeviation: number) =>
    engine.calculate(engine.inputSchema.parse({mean, standardDeviation})).coefficientOfVariation;
  expect(engine.version).toBe(1);
  expect(cv(10, 2)).toBe(0.2);
  expect(cv(-10, 2)).toBe(0.2);
  expect(cv(100, 20)).toBe(0.2);
  expect(cv(20, 2)).toBe(0.1);
  expect(cv(min, min)).toBe(1);
  expect(() => cv(min, 1)).toThrow(/supported numeric range/);
  expect(engine.inputSchema.safeParse({mean: 0, standardDeviation: 2}).success).toBe(false);
});
