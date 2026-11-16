import { expect, it } from 'vitest';
import { calculateCoulombScaled, calculateProjectileScaled } from '../../src/lib/calculator-factory/experimental/physics-scaled';
import { freeFallCalculator } from '../../src/calculators/physics/catalog-batch-3';
import { calculateCoulombCandidate, calculateFreeFallCandidate, calculateProjectileCandidate } from './candidates';

// RED receipt exercised real predecessors before candidate code existed.
// Keep both predecessor behavior and proposed correction explicit after GREEN.
it('324 preserves a tiny positive angle until the final representable result', () => {
  const input = { speed: 2 ** 300, angle: Number.MIN_VALUE, gravity: 1 };
  expect(calculateProjectileScaled(input).value).toBe(0);
  const value = calculateProjectileCandidate(input).value;
  expect(value).toBeGreaterThan((2 ** -474) / 30);
  expect(value).toBeLessThan((2 ** -474) * 2 / 45);
});
it('325 rounds the complete exact product instead of the leading half-gravity', () => {
  const input = { gravity: Number.MIN_VALUE, time: 2 ** 100 };
  expect(freeFallCalculator.calculate(input, {}).value).toBe(0);
  expect(calculateFreeFallCandidate(input).value).toBe(2 ** -875);
});
it('323 proposes one final nearest-even rounding of retained binary64 operands', () => {
  const input = { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 };
  expect(calculateCoulombScaled(input).value).toBe(8.987551792299997e-191);
  expect(calculateCoulombCandidate(input).value).toBe(8.987551792299999e-191);
});
