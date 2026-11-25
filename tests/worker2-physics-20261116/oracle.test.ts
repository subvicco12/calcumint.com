import Decimal from 'decimal.js';
import { describe, expect, it } from 'vitest';
import { roundFactorRatio } from './exact-factors';
import { calculateCoulombCandidate, calculateFreeFallCandidate, calculateProjectileCandidate, tinyAngleLimit } from './candidates';

// Independent radix-2 parsing + decimal arithmetic. No candidate bit decoder,
// integer division, exponent selection, or rounding helper is reused here.
const D = Decimal.clone({ precision: 1600, rounding: Decimal.ROUND_HALF_EVEN });
// decimal.js raises working precision by the input's significant digits.
// Bound BOTH input and requested trig precision to400 (internal pi table1025).
// The separate factor oracle retains1600 digits for subnormal/tie checks.
const S = Decimal.clone({ precision: 400, rounding: Decimal.ROUND_HALF_EVEN });
const binary = (x: number) => new D('0b' + Math.abs(x).toString(2)).mul(x < 0 ? -1 : 1);
function reference(numerators: number[], denominators: number[]) {
  let result = new D(1);
  for (const x of numerators) result = result.mul(binary(x));
  for (const x of denominators) result = result.div(binary(x));
  return result.toNumber();
}
function matches(actual: () => number, expected: number, hasZeroFactor = false) {
  if (!Number.isFinite(expected) || (expected === 0 && !hasZeroFactor)) expect(actual).toThrow('finite nonzero range');
  else expect(actual()).toBe(expected);
}

describe('single-round factor arithmetic boundaries', () => {
  it.each([
    [[1, 1 + 2 ** -52], [1]],
    [[1 + 2 ** -52, 1 + 2 ** -52], [1]],
    [[Number.MIN_VALUE, 3], [2]], // halfway -> even2min
    [[Number.MIN_VALUE, 5], [2]], // halfway -> even2min
    [[Number.MIN_VALUE], [2]], // halfway -> zero, explicit candidate refusal
    [[Number.MIN_VALUE, 1 + 2 ** -52], [2]], // just above halfway -> min
    [[2 ** -1022, 1 - 2 ** -53], []], // normal/subnormal boundary tie
    [[Number.MAX_VALUE], [1]],
    [[Number.MAX_VALUE, 1 + 2 ** -52], []],
    [[0, Number.MAX_VALUE], [Number.MIN_VALUE]],
    [[-Number.MIN_VALUE, 3], [2]],
    [[1, 7, 13, 2 ** -1000], [3, 11]],
  ] as [number[], number[]][])('agrees with independent reference for %j / %j', (n, d) => {
    matches(() => roundFactorRatio(n, d), reference(n, d), n.includes(0));
  });
  it('rejects invalid factors before handling an annihilating zero', () => {
    for (const n of [[Infinity], [NaN], [0, Infinity]]) expect(() => roundFactorRatio(n, [])).toThrow('Finite factors');
    for (const d of [[0], [NaN], [Infinity], [-0]]) expect(() => roundFactorRatio([0], d)).toThrow('nonzero denominators');
  });
  it('rounds normal halfway ties to even for both lower-significand parities', () => {
    // These odd54-bit numerators cannot themselves be supplied as binary64.
    expect(roundFactorRatio([2 ** 27 + 1, 2 ** 26 + 1], [2 ** 53])).toBe(1 + 2 ** -26 + 2 ** -27);
    expect(roundFactorRatio([2 ** 27 + 1, 2 ** 26 + 3], [2 ** 53])).toBe(1 + 3 * 2 ** -26 + 2 ** -27 + 2 ** -51);
  });
  it('carries a halfway significand into the next exponent', () => {
    // (2^54-1)/2^53 = 2-2^-53, halfway between prev(2) and2.
    expect(roundFactorRatio([2 ** 27 - 1, 2 ** 27 + 1], [2 ** 53])).toBe(2);
    expect(roundFactorRatio([2 ** 53 - 1, Number.MIN_VALUE], [2])).toBe(2 ** -1022);
  });
  it('distinguishes the exact overflow midpoint from values below it', () => {
    const mersenneFactors = [2 ** 27 - 1, 2 ** 27 + 1]; // product2^54-1
    expect(() => roundFactorRatio([...mersenneFactors, 2 ** 970], [])).toThrow('finite nonzero range');
    // (2^54-1)^2*2^916 = MAX_VALUE+2^916, below overflow midpoint.
    expect(roundFactorRatio([...mersenneFactors, ...mersenneFactors, 2 ** 916], [])).toBe(Number.MAX_VALUE);
  });
});

// Deterministic finite operand matrix, including subnormals and non-power-of-two
// denominators. This is bounded numerical evidence, not exhaustive domain proof.
let seed = 0x32332425;
const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
const exponents = [-1074, -1073, -1022, -1000, -700, -500, -300, -100, -1, 0, 1, 100, 200, 300];
const finite = () => (1 + next()) * 2 ** exponents[Math.floor(next() * exponents.length)];
const inputs = Array.from({ length: 96 }, () => ({ charge1: finite() * (next() < .5 ? -1 : 1), charge2: finite(), distance: finite() }));
describe('323 candidate same binary64 constant and exact operands', () => {
  it.each(inputs)('agrees with decimal oracle for %j', x => {
    matches(() => calculateCoulombCandidate(x).value, reference([8.9875517923e9, x.charge1, x.charge2], [x.distance, x.distance]));
  });
  it.each([
    { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 },
    { charge1: -1e-6, charge2: 3e-6, distance: 7 },
    { charge1: Number.MIN_VALUE, charge2: 2 ** 300, distance: 1e-100 },
  ])('is charge-swap invariant and preserves signs for %j', x => {
    const value = calculateCoulombCandidate(x).value;
    expect(calculateCoulombCandidate({ ...x, charge1: x.charge2, charge2: x.charge1 }).value).toBe(value);
    expect(calculateCoulombCandidate({ ...x, charge1: -x.charge1 }).value).toBe(-value);
    expect(calculateCoulombCandidate({ ...x, charge1: x.charge1 * 2, charge2: x.charge2 * 2, distance: x.distance * 2 }).value).toBe(value);
  });
});

describe('325 complete product including subnormal gravity', () => {
  it.each([
    [Number.MIN_VALUE, 1], [Number.MIN_VALUE, 2], [Number.MIN_VALUE, 2 ** 100],
    [Number.MIN_VALUE, 2 ** 300], [2 ** -1000, 2 ** 300], [9.8, 2],
    [0, 1e100], [1e100, 0], [1e100, 1e100], [1e-200, 1e-200],
  ])('agrees with independent product for gravity%s/time%s', (gravity, time) => {
    matches(() => calculateFreeFallCandidate({ gravity, time }).value, reference([.5, gravity, time, time], []), gravity === 0 || time === 0);
  });
});

describe('324 tiny angle uses an independent high precision sine reference', () => {
  it.each([Number.MIN_VALUE, 2 * Number.MIN_VALUE, 2 ** -1022, 2 ** -1000, 2 ** -700, tinyAngleLimit])('angle%s remains recoverable', angle => {
    const x = { speed: 2 ** 300, angle, gravity: 1 };
    const r = binary(angle).mul(2).mul(binary(Math.PI)).div(180);
    const oracle = binary(x.speed).pow(2).mul(new S(r.toString()).toSignificantDigits(400).sin().toString()).div(binary(x.gravity)).toNumber();
    expect(calculateProjectileCandidate(x).value).toBe(oracle);
  });
  it.each([
    { speed: 2 ** 300, angle: tinyAngleLimit * (1 + 2 ** -52), gravity: 1 },
    { speed: 1e-200, angle: 45, gravity: 1e-300 },
    { speed: 1e-200, angle: 45, gravity: 1e-80 },
    { speed: 10, angle: 30, gravity: 9.8 },
    { speed: 10, angle: 90, gravity: 10 },
  ])('retains the libm operand outside the tiny branch for %j', x => {
    const sine = Math.sin(2 * x.angle * Math.PI / 180);
    expect(calculateProjectileCandidate(x).value).toBe(reference([x.speed, x.speed, sine], [x.gravity]));
  });
  it('retains exact input zeros, final-range refusals and the positive endpoint residual', () => {
    expect(calculateProjectileCandidate({ speed: 0, angle: Number.MIN_VALUE, gravity: 1 }).value).toBe(0);
    expect(calculateProjectileCandidate({ speed: 1, angle: 0, gravity: Number.MIN_VALUE }).value).toBe(0);
    expect(calculateProjectileCandidate({ speed: 10, angle: 90, gravity: 10 }).value).toBeGreaterThan(0);
    expect(() => calculateProjectileCandidate({ speed: 1, angle: Number.MIN_VALUE, gravity: 1 })).toThrow('finite nonzero range');
    expect(() => calculateProjectileCandidate({ speed: 1e100, angle: 45, gravity: Number.MIN_VALUE })).toThrow('finite nonzero range');
  });
});
