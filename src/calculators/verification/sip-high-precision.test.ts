import { expect, it } from 'vitest';
import { sipCalculator, sipFutureValue } from '../finance/sip';
import { runCalculator } from '../engine';
import { exactDeposits, exactCents, decimalRational, errorCentInterval, stableDiagnostic } from './sip-high-precision-reference';
import { sipHighPrecisionVectors } from './fixtures/sip-high-precision-vectors';

it('validates the oracle against hand-derived rational deposits before using it', () => {
  for (const [monthly, annual, months, timing, cents] of [
    [100, 12, 2, 'end', 20100n], [100, 12, 2, 'beginning', 20301n],
    [400, -99, 2, 'end', 76700n], [600, 1000, 2, 'end', 170000n],
    [0.005, 0, 1, 'end', 1n], [0.004999999999999999, 0, 1, 'end', 0n],
    [0.005000000000000001, 0, 1, 'end', 1n],
  ] as const) expect(exactCents(exactDeposits(monthly, annual, months, timing))).toBe(cents);
  expect(decimalRational(1e100).numerator).toBe(10n ** 100n);
  expect(() => decimalRational(1e-19)).toThrow('reference decimal bound');
  expect(() => exactDeposits(1, 12, 1201, 'end')).toThrow();
});

it('checks exact interval direction and equality without floating-point comparisons', () => {
  const exact = { numerator: 1n, denominator: 3n };
  expect(errorCentInterval(0.33, exact)).toEqual(['-1', '0']);
  expect(errorCentInterval(0.34, exact)).toEqual(['0', '1']);
  expect(errorCentInterval(1, { numerator: 1n, denominator: 1n })).toEqual(['0', '0']);
});

it('retains all six registered goldens and the legacy example at version 1', () => {
  expect(sipCalculator.version).toBe(1);
  expect(sipCalculator.goldenTests).toHaveLength(6);
  for (const golden of sipCalculator.goldenTests ?? []) {
    const v = sipCalculator.inputSchema.parse(golden.input);
    expect(exactCents(exactDeposits(v.monthlyContribution, v.annualReturnPercent, v.termMonths, v.contributionTiming))).toBe(BigInt(Math.round(golden.expected.futureValue! * 100)));
    expect(runCalculator(sipCalculator, golden.input).output).toEqual(golden.expected);
  }
  for (const example of sipCalculator.examples ?? []) expect(runCalculator(sipCalculator, example.input).output).toEqual(example.expected);
});

it('reference properties cover both timings, signs, maximum term, rounding and huge integers', () => {
  expect(sipHighPrecisionVectors).toHaveLength(55);
  for (const v of sipHighPrecisionVectors) {
    const exact = exactDeposits(v.monthly, v.annual, v.months, v.timing);
    expect(exact.numerator > 0n).toBe(true);
    if (v.annual === 0 && Number.isInteger(v.monthly)) expect(exactCents(exact)).toBe(decimalRational(v.monthly).numerator * BigInt(v.months) * 100n);
    if (v.months === 1 && v.timing === 'end') expect(exactCents(exact)).toBe(exactCents(decimalRational(v.monthly)));
    expect(stableDiagnostic(v.monthly, v.annual, v.months, v.timing)).toBeGreaterThan(0);
  }
});

it('emits version-bound known-issue diagnostics without blessing incorrect output', () => {
  const rows = sipHighPrecisionVectors.map(v => {
    const reference = exactDeposits(v.monthly, v.annual, v.months, v.timing);
    let observed: number;
    try { observed = sipFutureValue(v.monthly, v.annual, v.months, v.timing); } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const maximum = decimalRational(Number.MAX_VALUE);
      expect(reference.numerator * maximum.denominator > maximum.numerator * reference.denominator).toBe(true);
      return { label: v.label, exactCents: exactCents(reference).toString(), rejected: (error as Error).message };
    }
    const output = runCalculator(sipCalculator, { monthlyContribution: v.monthly, annualReturnPercent: v.annual, termMonths: v.months, contributionTiming: v.timing });
    return { label: v.label, exactCents: exactCents(reference).toString(), observed, observedErrorCents: errorCentInterval(observed, reference), outputCents: exactCents(decimalRational(output.output.futureValue)).toString(), stableErrorCents: errorCentInterval(stableDiagnostic(v.monthly, v.annual, v.months, v.timing), reference) };
  });
  console.info('SIP_HIGH_PRECISION_V1_DIAGNOSTIC', JSON.stringify(rows));
  // Guard the harness, not the buggy arithmetic: every observation is bounded
  // by an exact rational interval and must remain a finite positive number.
  for (const row of rows) {
    if ('rejected' in row) continue;
    expect(row.observed).toBeGreaterThan(0);
    expect(BigInt(row.observedErrorCents[1]) - BigInt(row.observedErrorCents[0])).toBeLessThanOrEqual(1n);
  }
});
