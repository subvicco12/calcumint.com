import { describe, expect, it } from 'vitest';
import { calculateCoulombScaled, calculateProjectileScaled } from '../experimental/physics-scaled';
import { physicsCandidates } from '../cohorts/physics';
import { physicsCompletionReview } from './physics';
import { verifyBatch22PhysicsSnapshot } from '../../batch22-physics-replay';

// Decode IEEE-754 bits, not decimal spellings or the successor's decomposition.
type Rational = readonly [bigint, bigint];
function binary(value: number): Rational {
  const view = new DataView(new ArrayBuffer(8)); view.setFloat64(0, value);
  const bits = view.getBigUint64(0), negative = bits >> 63n;
  const exponent = Number((bits >> 52n) & 2047n);
  const fraction = bits & ((1n << 52n) - 1n);
  const significand = exponent ? (1n << 52n) + fraction : fraction;
  const power = exponent ? exponent - 1075 : -1074;
  const signed = negative ? -significand : significand;
  return power >= 0 ? [signed << BigInt(power), 1n] : [signed, 1n << BigInt(-power)];
}
function exactRatio(numerators: number[], denominators: number[]): Rational {
  let numerator = 1n, denominator = 1n;
  for (const value of numerators) { const [n,d] = binary(value); numerator *= n; denominator *= d; }
  for (const value of denominators) { const [n,d] = binary(value); numerator *= d; denominator *= n; }
  return [numerator, denominator];
}
function within(actual: number, [n,d]: Rational, relativeBits = 48) {
  const [a,b] = binary(actual);
  const error = a*d - n*b;
  const abs = (x: bigint) => x < 0n ? -x : x;
  expect(abs(error) * (1n << BigInt(relativeBits)) <= abs(n*b)).toBe(true);
}

describe('physics successor actual binary64 independent rational qualification', () => {
  it.each([
    [1e-200,1e-200,1e-100], [1e-200,-1e-200,1e-100],
    [Number.MIN_VALUE,1e100,1e-100], [1e100,1e100,1e100],
  ])('Coulomb %s %s %s', (charge1,charge2,distance) => {
    const actual = calculateCoulombScaled({charge1,charge2,distance}).value;
    within(actual, exactRatio([8.9875517923e9,charge1,charge2],[distance,distance]));
  });
  it.each([[1e-200,1e-300], [1e-150,1e-300], [1e100,1e100]])('projectile %s %s', (speed,gravity) => {
    // At this exact input the retained binary64 sin operand is exactly one.
    expect(Math.sin(2 * 45 * Math.PI / 180)).toBe(1);
    within(calculateProjectileScaled({speed,angle:45,gravity}).value, exactRatio([speed,speed],[gravity]));
  });
  it('checks subnormal rounding by an exact half-ulp bound', () => {
    const actual = calculateProjectileScaled({speed:1e-200,angle:45,gravity:1e-80}).value;
    const [n,d] = exactRatio([1e-200,1e-200],[1e-80]); const [a,b] = binary(actual);
    const error = a*d-n*b;
    expect((error < 0n ? -error : error) * (1n << 1075n) <= b*d).toBe(true);
  });
  it('rejects singularities and nonrepresentable final magnitudes', () => {
    for (const gravity of [0,Number.MIN_VALUE]) expect(() => calculateProjectileScaled({speed:1e100,angle:45,gravity})).toThrow();
    expect(() => calculateCoulombScaled({charge1:1,charge2:1,distance:0})).toThrow();
    expect(() => calculateProjectileScaled({speed:Number.MIN_VALUE,angle:45,gravity:1})).toThrow();
  });
});

it('replays every historical v1 example and preserves the two underflow zeros', () => {
  for (const row of physicsCandidates) {
    const historical = 'historicalEngine' in row ? row.historicalEngine : {slug:row.slug,version:row.version};
    const input = Object.fromEntries(row.fields.map(field => [field.key,field.defaultValue]));
    // Original formula's step text is part of immutable history.
    const value = row.catalogId === 323 ? 0 : row.catalogId === 324 ? 0 : row.engine.calculate(input as never,{}).value;
    const replayInput = row.catalogId === 323 ? {charge1:1e-200,charge2:1e-200,distance:1e-100}
      : row.catalogId === 324 ? {speed:1e-200,angle:45,gravity:1e-300} : input;
    const label = row.title.replace(' Calculator','');
    const result = verifyBatch22PhysicsSnapshot({calculatorSlug:historical.slug,calculatorVersion:historical.version,input:replayInput,output:{value,steps:[`${label} = ${value}`]}});
    expect(result.engineVersion).toBe(1);
  }
});
it('does not promote numerical evidence into unit or source acceptance', () => {
  expect(physicsCompletionReview.map(row => row.catalogId)).toEqual([322,323,324,325,327]);
  for (const row of physicsCompletionReview) {
    expect(row.publisherSource).toBeNull(); expect(row.canonicalUnit).toBeNull();
    expect(row.missingFacts.length).toBeGreaterThan(0);
  }
  for (const row of physicsCompletionReview.filter(row => [323,324].includes(row.catalogId))) expect(row.registered).toBe(false);
});
