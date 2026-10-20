import { expect, it } from 'vitest';
import { sipCalculator, sipFutureValue, requiredMonthlySip } from '../finance/sip';
import { runCalculator } from '../engine';
import { sipNumericalCompatibilityVectors } from './fixtures/sip-numerical-compatibility';

// Exact rational recurrence for deposited principal, with no subtraction or
// division by a modeled return. Kept local to verification, never a new engine.
function rationalDeposits(monthly: bigint, months: number, q: bigint, d: bigint, beginning: boolean) {
  let numerator = 0n;
  let denominator = 1n;
  for (let month = 0; month < months; month++) {
    numerator = numerator * q + monthly * denominator * d;
    denominator *= d;
  }
  return beginning ? { numerator: numerator * q, denominator: denominator * d } : { numerator, denominator };
}
function cents(numerator: bigint, denominator: bigint) {
  return (numerator * 200n + denominator) / (denominator * 2n);
}

for (const v of sipNumericalCompatibilityVectors) {
  it(`independent rational numerical boundary: ${v.label}`, () => {
    const exact = rationalDeposits(BigInt(v.monthly), v.months, v.numerator, v.denominator, v.timing === 'beginning');
    expect(cents(exact.numerator, exact.denominator)).toBe(v.cents);
    expect(sipFutureValue(v.monthly, v.annual, v.months, v.timing)).toBeCloseTo(v.target, 9);
    expect(requiredMonthlySip(v.target, v.annual, v.months, v.timing)).toBeCloseTo(v.monthly, 9);
    for (const plan of ['free', 'pro', 'business']) {
      const run = runCalculator(sipCalculator, { monthlyContribution: v.monthly, annualReturnPercent: v.annual, termMonths: v.months, contributionTiming: v.timing, plan });
      expect(run.version).toBe(1);
      expect(run.output.futureValue).toBe(Number(v.cents) / 100);
      expect(run.output.investedAmount).toBe(v.monthly * v.months);
    }
  });
}

it('checks the six registered arithmetic references with independent rational deposits', () => {
  expect(sipCalculator.goldenTests).toHaveLength(6);
  for (const golden of sipCalculator.goldenTests ?? []) {
    const input = sipCalculator.inputSchema.parse(golden.input);
    const q = input.annualReturnPercent === 0 ? 100n : 101n;
    const exact = rationalDeposits(BigInt(input.monthlyContribution), input.termMonths, q, 100n, input.contributionTiming === 'beginning');
    expect(Number(cents(exact.numerator, exact.denominator)) / 100).toBe(golden.expected.futureValue);
    expect(runCalculator(sipCalculator, golden.input).output).toEqual(golden.expected);
  }
});

it('preserves the registered legacy example output', () => {
  expect(sipCalculator.examples).toHaveLength(1);
  for (const example of sipCalculator.examples ?? []) {
    expect(runCalculator(sipCalculator, example.input).output).toEqual(example.expected);
  }
});

it('retains zero-rate behavior when signed subnormal annual rates underflow during monthly conversion', () => {
  for (const annual of [Number.MIN_VALUE, -Number.MIN_VALUE]) {
    for (const timing of ['beginning', 'end'] as const) {
      expect(annual / 100 / 12).toBe(annual > 0 ? 0 : -0);
      expect(runCalculator(sipCalculator, { monthlyContribution: 1, annualReturnPercent: annual, termMonths: 1200, contributionTiming: timing }).output).toEqual({ futureValue: 1200, investedAmount: 1200, estimatedGain: 0 });
    }
  }
});

it('fails closed on a lost annuity factor without replacing it with a guessed result', () => {
  for (const annual of [1e-300, -1e-300]) {
    for (const timing of ['beginning', 'end'] as const) {
      const input = { monthlyContribution: 1, annualReturnPercent: annual, termMonths: 1200, contributionTiming: timing };
      expect(sipCalculator.inputSchema.safeParse(input).success).toBe(true);
      expect(() => sipFutureValue(1, annual, 1200, timing)).toThrow();
      expect(() => sipCalculator.calculate(input, {})).toThrow();
      expect(() => runCalculator(sipCalculator, input)).toThrow();
      expect(() => requiredMonthlySip(1200, annual, 1200, timing)).toThrow();
      expect(sipFutureValue(0, annual, 1200, timing)).toBe(annual > 0 ? 0 : -0);
    }
  }
});

it('allows legitimate positive projections that round to zero', () => {
  expect(runCalculator(sipCalculator, { monthlyContribution: .00001, annualReturnPercent: -99, termMonths: 1, contributionTiming: 'beginning' }).output.futureValue).toBe(0);
});

it('rejects nonfinite zero-rate accumulation consistently through every forward entry point', () => {
  for (const timing of ['beginning', 'end'] as const) {
    const input = { monthlyContribution: 1e308, annualReturnPercent: 0, termMonths: 1200, contributionTiming: timing };
    expect(() => sipFutureValue(1e308, 0, 1200, timing)).toThrow();
    expect(() => sipCalculator.calculate(input, {})).toThrow();
    expect(() => runCalculator(sipCalculator, input)).toThrow();
  }
});
