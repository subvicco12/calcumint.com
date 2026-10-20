import { describe, expect, it } from 'vitest';
import { buildSipV2DraftAnalytics, solveSipV2DraftGoal } from './sip-v2-analytics';
import { sipV2Candidate } from '../finance/sip-v2-candidate';
import { exactCents, exactDeposits } from '../verification/sip-high-precision-reference';
const input = { monthlyContribution: 100, annualReturnPercent: 10, termMonths: 12, contributionTiming: 'beginning' as const };
describe('unregistered SIP v2 draft analytics', () => {
  for (const rate of [-99, -1e-300, -1e-12, 0, 1e-300, 1e-12, 10, 1000]) for (const timing of ['beginning', 'end'] as const) it(`authored requests and independent cents ${rate} ${timing}`, () => {
    const raw = Object.freeze({ ...input, annualReturnPercent: rate, contributionTiming: timing });
    const result = buildSipV2DraftAnalytics(raw);
    expect(result.identity).toEqual({ id: 'finance.sip', slug: 'sip-calculator', version: 2 });
    expect(result.baseline.output.futureValue).toBe(Math.abs(rate) > 0 && Math.abs(rate) < 1e-18 ? 1200 : Number(exactCents(exactDeposits(100, rate, 12, timing))) / 100);
    expect(result.scenarios).toHaveLength(rate === -99 || rate === 1000 ? 2 : 3);
    expect(result.points).toHaveLength(rate === -99 || rate === 1000 ? 3 : 5);
    for (const scenario of result.scenarios) {
      const annualReturnPercent = scenario.input!.value;
      const expected = sipV2Candidate.calculate({ ...raw, annualReturnPercent }, {});
      expect(scenario.value).toBe(expected.futureValue);
      expect(scenario.delta).toBe(Number((BigInt(Math.round(expected.futureValue * 100)) - BigInt(Math.round(result.baseline.output.futureValue * 100)))) / 100);
      expect(scenario.input).toEqual({ label: 'Annual return', value: annualReturnPercent, unit: '%' });
      expect(scenario.label).toBe(`${annualReturnPercent}% rate`);
    }
    expect(raw.annualReturnPercent).toBe(rate);
  });
  it('preserves negative zero in authored request metadata', () => {
    const result = buildSipV2DraftAnalytics({ ...input, annualReturnPercent: -0 });
    expect(Object.is(result.baseline.input.annualReturnPercent, -0)).toBe(true);
    expect(Object.is(result.points.find(v => Object.is(v.input, -0))?.input, -0)).toBe(true);
  });
  it('subtracts currency cents exactly for scenario deltas', () => {
    const result = buildSipV2DraftAnalytics({ ...input, monthlyContribution: 0.01, annualReturnPercent: 10, termMonths: 1200 });
    for (const scenario of result.scenarios) {
      const expected = exactCents(exactDeposits(0.01, scenario.input!.value, 1200, 'beginning')) - exactCents(exactDeposits(0.01, 10, 1200, 'beginning'));
      expect(scenario.delta).toBe(Number(expected) / 100);
    }
  });
  it('reports original out-of-domain requests without clamping or losing baseline', () => {
    const result = buildSipV2DraftAnalytics({ ...input, annualReturnPercent: -99 });
    expect(result.unavailable.map(v => v.rate)).toEqual([-100, -101, -100]);
    expect(result.scenarios.find(v => v.baseline)?.value).toBe(result.baseline.output.futureValue);
    expect(result.baseline.output.estimatedGain).toBeLessThan(0);
  });
  it('isolates result objects and canonicalizes defaults', () => {
    const raw = { monthlyContribution: 100, annualReturnPercent: 0, termMonths: 1, plan: 'free' };
    const first = buildSipV2DraftAnalytics(raw);
    first.baseline.input.monthlyContribution = 999;
    first.identity.version = 2;
    expect(buildSipV2DraftAnalytics(raw).baseline.input.monthlyContribution).toBe(100);
    expect(buildSipV2DraftAnalytics(raw).baseline.input.contributionTiming).toBe('beginning');
    expect(first.baseline.output.estimatedGain).toBe(0);
  });
  for (const bad of [null, {}, { ...input, monthlyContribution: 0 }, { ...input, termMonths: 1201 }, { ...input, annualReturnPercent: NaN }, { ...input, contributionTiming: 'bad' }, { ...input, monthlyContribution: 1e308 }]) it(`rejects invalid baseline ${JSON.stringify(bad)}`, () => {
    expect(() => buildSipV2DraftAnalytics(bad)).toThrow();
  });
  it('captures numerical rejection of a neighboring request', () => {
    const result = buildSipV2DraftAnalytics({ ...input, monthlyContribution: 7e10, annualReturnPercent: 0, termMonths: 1200 });
    expect(result.baseline.output.futureValue).toBe(8.4e13);
    expect(result.unavailable.length).toBeGreaterThan(0);
    expect(result.scenarios.some(v => v.baseline)).toBe(true);
  });
  for (const rate of [-99, -1e-300, 0, 1e-300, 10, 1000]) for (const timing of ['beginning', 'end'] as const) it(`goal forward reconciliation ${rate} ${timing}`, () => {
    const goalInput = Object.freeze({ targetFutureValue: 1000000.004, annualReturnPercent: rate, termMonths: 120, contributionTiming: timing });
    const result = solveSipV2DraftGoal(goalInput);
    expect(result.identity.version).toBe(2);
    expect(result.input).toEqual(goalInput);
    expect(result.output.futureValue).toBe(1000000);
    expect(sipV2Candidate.calculate({ ...goalInput, monthlyContribution: result.output.monthlyContribution }, {})).toEqual({ futureValue: result.output.futureValue, investedAmount: result.output.investedAmount, estimatedGain: result.output.estimatedGain });
  });
  for (const patch of [{ targetFutureValue: 0 }, { targetFutureValue: Infinity }, { targetFutureValue: 90071992547410 }, { termMonths: 0 }, { annualReturnPercent: -100 }, { contributionTiming: 'wrong' }]) it(`rejects unsupported goal ${JSON.stringify(patch)}`, () => {
    expect(() => solveSipV2DraftGoal({ targetFutureValue: 1000, annualReturnPercent: 10, termMonths: 12, contributionTiming: 'end', ...patch } as never)).toThrow();
  });
});
