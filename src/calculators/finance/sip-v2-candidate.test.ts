import { describe, expect, it } from 'vitest';
import { sipV2Candidate, sipV2FutureValue, requiredMonthlySipV2 } from './sip-v2-candidate';
import { exactCents, exactDeposits } from '../verification/sip-high-precision-reference';
import { sipInverseIndependentVectors } from '../verification/fixtures/sip-inverse-independent';
import { sipHighPrecisionVectors } from '../verification/fixtures/sip-high-precision-vectors';

const calculate = (monthly: number, annual: number, months: number, timing: 'beginning' | 'end' = 'beginning') => sipV2Candidate.calculate({ monthlyContribution: monthly, annualReturnPercent: annual, termMonths: months, contributionTiming: timing }, {});
describe('unregistered SIP v2 candidate', () => {
  it('is an explicitly draft new version', () => {
    expect([sipV2Candidate.id, sipV2Candidate.slug, sipV2Candidate.version, sipV2Candidate.reviewStatus]).toEqual(['finance.sip', 'sip-calculator', 2, 'draft']);
  });
  for (const v of sipHighPrecisionVectors) it(`independent rational oracle: ${v.label}`, () => {
    const cents = exactCents(exactDeposits(v.monthly, v.annual, v.months, v.timing));
    if (cents > BigInt(Number.MAX_SAFE_INTEGER)) expect(() => calculate(v.monthly, v.annual, v.months, v.timing)).toThrow(/precision|range/);
    else expect(calculate(v.monthly, v.annual, v.months, v.timing).futureValue).toBe(Number(cents) / 100);
  });
  for (const annual of [1e-300, -1e-300, 1e-12, -1e-12]) it(`preserves near-zero limit ${annual}`, () => {
    for (const timing of ['beginning', 'end'] as const) expect(calculate(10000, annual, 1200, timing).futureValue).toBe(12000000);
  });
  it('does not replace nonzero tiny rates with zero at half-cent boundaries', () => {
    expect(calculate(0.005, 1e-300, 1).futureValue).toBe(0.01);
    expect(calculate(0.005, -1e-300, 1).futureValue).toBe(0);
    expect(calculate(0.005, 0, 1).futureValue).toBe(0.01);
  });
  it('checks the independently authored candidate goldens', () => {
    for (const v of sipV2Candidate.goldenTests ?? []) expect(sipV2Candidate.calculate(v.input, {})).toEqual(v.expected);
  });
  it('certifies exact recurring-rate half-cent ties', () => {
    expect(calculate(241.2, 5, 1).futureValue).toBe(242.21);
  });
  it('rounds signed gain from rounded decimal cents', () => {
    expect(calculate(1, -99, 12).estimatedGain).toBe(Number(exactCents(exactDeposits(1, -99, 12, 'beginning')) - 1200n) / 100);
  });
  it('rejects invalid schema and direct inputs consistently', () => {
    for (const args of [[NaN, 10, 12], [-1, 10, 12], [1, -100, 12], [1, 1001, 12], [1, 10, 0], [1, 10, 1.5], [Infinity, 0, 1]] as const) {
      expect(() => sipV2FutureValue(args[0], args[1], args[2])).toThrow();
      expect(() => calculate(args[0], args[1], args[2])).toThrow();
    }
    expect(() => sipV2FutureValue(1, 10, 12, 'bad' as 'end')).toThrow();
    expect(() => calculate(1e308, 1000, 1200)).toThrow();
    expect(() => calculate(1e100, 0, 1)).toThrow();
    expect(sipV2FutureValue(0, 10, 1200)).toBe(0);
  });
  it('rejects individually unrepresentable decimal cents below the integer-cent ceiling', () => {
    // Exact invested cents 9,007,199,254,740,951 would serialize as .52.
    expect(() => calculate(30023997515803.17, 0, 3)).toThrow(/precision/);
    expect(calculate(10000000000, 0, 1).futureValue).toBe(10000000000);
  });
  it('measures bounded maximum-term work locally', () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) expect(calculate(10000, i % 2 ? 1e-300 : -99, 1200).futureValue).toBeGreaterThan(0);
    console.info(`SIP v2 benchmark: 100 max-term evaluations ${(performance.now() - start).toFixed(1)}ms (local observation, no latency guarantee)`);
  });
  for (const v of sipInverseIndependentVectors) it(`independent inverse: ${v.label}`, () => {
    expect(requiredMonthlySipV2(v.target, v.annualReturnPercent, v.termMonths, v.timing)).toBeCloseTo(v.monthly, 10);
    expect(calculate(v.monthly, v.annualReturnPercent, v.termMonths, v.timing)).toEqual(v.expected);
  });
  it('inverse handles a factor beyond finite binary64 without materializing Infinity', () => {
    const monthly = requiredMonthlySipV2(1000000, 1000, 1200, 'beginning');
    expect(monthly).toBeGreaterThan(0);
    expect(sipV2FutureValue(monthly, 1000, 1200, 'beginning')).toBeCloseTo(1000000, 6);
  });
  it('uses one authored formula across contexts and plans', () => {
    for (const plan of ['free', 'pro', 'business']) for (const currency of ['USD', 'EUR']) {
      const input = { monthlyContribution: 10000, annualReturnPercent: 1e-12, termMonths: 1200, contributionTiming: 'beginning' as const, plan };
      expect(sipV2Candidate.calculate(input, { currency })).toEqual({ futureValue: 12000000, investedAmount: 12000000, estimatedGain: 0 });
    }
  });
  it('inverse solves through the same stable accumulation factor', () => {
    for (const annual of [-99, -1e-12, 0, 1e-12, 10, 1000]) for (const timing of ['beginning', 'end'] as const) {
      const monthly = requiredMonthlySipV2(1000000, annual, 120, timing);
      expect(sipV2FutureValue(monthly, annual, 120, timing)).toBeCloseTo(1000000, 6);
    }
    expect(() => requiredMonthlySipV2(Infinity, 10, 120)).toThrow();
  });
});
