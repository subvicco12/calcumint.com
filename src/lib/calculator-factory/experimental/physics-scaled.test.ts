import { describe, expect, it } from 'vitest';
import { projectileMotionCalculator as projectile, coulombForceCalculator as coulomb } from '../../../calculators/physics/catalog-batch-3';
import { calculateProjectileScaled, calculateCoulombScaled } from './physics-scaled';
const range = (speed: number, angle: number, gravity: number) => calculateProjectileScaled({ speed, angle, gravity }).value;
const force = (charge1: number, charge2: number, distance: number) => calculateCoulombScaled({ charge1, charge2, distance }).value;

const near = (actual: number, expected: number) => {
  expect(Number.isFinite(actual)).toBe(true);
  expect(actual).not.toBe(0);
  expect(Math.abs((actual - expected) / expected)).toBeLessThan(3e-15);
};

const reduce = (numerator: bigint, denominator: bigint) => {
  let a = numerator, b = denominator;
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return [numerator / a, denominator / a];
};

describe('independent exact decimal rational derivations', () => {
  it('reduces projectile decimal witness to exactly 1/10^100', () => {
    const [numerator, denominator] = reduce(10n ** 300n, 10n ** 400n);
    expect([numerator, denominator]).toEqual([1n, 10n ** 100n]);
    expect(Number(numerator) / Number(denominator)).toBe(1e-100);
  });
  it('reduces Coulomb decimal witness with the unchanged exact decimal constant', () => {
    const [numerator, denominator] = reduce(89875517923n * 10n ** 200n, 10n ** 401n);
    expect([numerator, denominator]).toEqual([89875517923n, 10n ** 201n]);
    near(Number(numerator) / Number(denominator), 8.9875517923e-191);
  });
});

describe('preserved v1 underflow witnesses', () => {
  it('324 admits normal finite inputs but squares to zero before division', () => {
    const input = { speed: 1e-200, angle: 45, gravity: 1e-300 };
    expect(projectile.inputSchema.safeParse(input).success).toBe(true);
    expect(projectile.calculate(input, {})).toEqual({ value: 0, steps: ['Projectile Motion = 0'] });
    near(range(input.speed, input.angle, input.gravity), 1e-100);
  });
  it('323 admits normal finite inputs but its numerator underflows before division', () => {
    const input = { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 };
    expect(coulomb.inputSchema.safeParse(input).success).toBe(true);
    expect(coulomb.calculate(input, {})).toEqual({ value: 0, steps: ['Coulomb Force = 0'] });
    near(force(input.charge1, input.charge2, input.distance), 8.9875517923e-191);
  });
});

describe('unregistered scaled arithmetic literal witnesses', () => {
  // At45 degrees sin(90 degrees)=1; decimal exponent cancellation gives these
  // expectations without invoking either implemented formula as an oracle.
  it.each([
    [1e-200, 1e-300, 1e-100],
    [1e-150, 1e-300, 1],
    [1e-100, 1e-300, 1e100],
    [1e-200, 1e-100, 1e-300],
    [1e-100, 1e100, 1e-300],
    [10, 10, 10],
  ])('range speed%s gravity%s gives%s', (speed, gravity, expected) => near(range(speed, 45, gravity), expected));

  it.each([
    [1e-200, 1e-200, 1e-100, 8.9875517923e-191],
    [1e-200, -1e-200, 1e-100, -8.9875517923e-191],
    [-1e-200, -1e-200, 1e-100, 8.9875517923e-191],
    [1e-200, 1e-200, 1e-200, 8.9875517923e9],
    [1e-300, 1e100, 1e-100, 8.9875517923e9],
    [1e100, 1e100, 1e100, 8.9875517923e9],
    [1e-6, 1e-6, 1, 0.0089875517923],
  ])('force charges%s/%s distance%s gives%s', (q1, q2, distance, expected) => near(force(q1, q2, distance), expected));

  it('retains zero, complementary angle and signed force behavior', () => {
    expect(range(0, 45, 10)).toBe(0);
    expect(range(20, 0, 10)).toBe(0);
    near(range(20, 30, 10), 34.64101615137754);
    near(range(20, 60, 10), 34.64101615137754);
    expect(force(0, 1, 2)).toBe(0);
    near(force(1e-6, -2e-6, 2), -0.00449377589615);
  });
  it('returns a representable subnormal instead of prematurely zeroing it', () => {
    const actual = range(1e-200, 45, 1e-80);
    expect(actual).toBe(1e-320);
    expect(actual).toBeGreaterThan(0);
  });
  it('throws for truly unrepresentable results and invalid denominator factors', () => {
    expect(() => range(1e-200, 45, 1e100)).toThrow('outside the supported finite range');
    expect(() => range(1e100, 45, 1e-300)).toThrow('outside the supported finite range');
    expect(() => force(1e100, 1e100, 1e-100)).toThrow('outside the supported finite range');
    expect(() => range(1, 45, 0)).toThrow();
    expect(() => force(1, 1, 0)).toThrow();
  });
});

describe('strict private admission', () => {
 it.each([NaN, Infinity, -Infinity, 1e101, '1', null])('rejects invalid charge %s', value => expect(() => calculateCoulombScaled({ charge1: value, charge2: 1, distance: 1 })).toThrow());
 it('rejects unknown keys, missing fields and out-of-domain angles', () => {
  expect(() => calculateProjectileScaled({ speed: 1, angle: 45, gravity: 1, height: 1 })).toThrow();
  expect(() => calculateCoulombScaled({ charge1: 1, charge2: 1 })).toThrow();
  for (const angle of [-1, 91]) expect(() => calculateProjectileScaled({ speed: 1, angle, gravity: 1 })).toThrow();
 });
});
