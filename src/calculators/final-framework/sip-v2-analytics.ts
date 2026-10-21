/** Offline, unregistered draft-only v2 analytics. No registry or saved-record authority. */
import { z } from 'zod';
import { runCalculator } from '../engine';
import { requiredMonthlySipV2, sipV2Candidate } from '../finance/sip-v2-candidate';
import type { Scenario, SensitivityPoint } from './analysis';
import type { UnavailableRateRequest } from './registered-rate-analysis';

const identity = () => ({ id: 'finance.sip' as const, slug: 'sip-calculator' as const, version: 2 as const });
export type SipV2DraftInput = z.infer<typeof sipV2Candidate.inputSchema>;
export type SipV2DraftOutput = ReturnType<typeof sipV2Candidate.calculate>;
export type SipV2DraftAnalytics = {
  identity: ReturnType<typeof identity>;
  baseline: { input: SipV2DraftInput; output: SipV2DraftOutput };
  scenarios: Scenario[];
  points: SensitivityPoint[];
  unavailable: UnavailableRateRequest[];
};

// Candidate outputs are decimal cents. Subtract their canonical cents rather than binary64 money.
function cents(value: number): bigint {
  const [coefficient, exponent = '0'] = value.toString().split('e');
  const [whole, fraction = ''] = coefficient.split('.');
  const digits = BigInt(whole + fraction);
  const power = Number(exponent) - fraction.length + 2;
  if (power >= 0) return digits * 10n ** BigInt(power);
  const divisor = 10n ** BigInt(-power);
  if (digits % divisor !== 0n) throw new RangeError('SIP v2 delta requires canonical cents');
  return digits / divisor;
}
function centDelta(value: number, baseline: number): number {
  const difference = cents(value) - cents(baseline);
  const result = Number(difference) / 100;
  if (!Number.isFinite(result) || cents(result) !== difference) throw new RangeError('SIP v2 delta currency precision cannot round-trip');
  return result;
}

/** Each requested rate is evaluated independently, without replacing out-of-domain rates. */
export function buildSipV2DraftAnalytics(rawInput: unknown): SipV2DraftAnalytics {
  const baseline = runCalculator(sipV2Candidate, rawInput);
  const result: SipV2DraftAnalytics = {
    identity: identity(), baseline: { input: baseline.input, output: baseline.output },
    scenarios: [], points: [], unavailable: [],
  };
  const request = (surface: UnavailableRateRequest['surface'], offset: number, index: number) => {
    // Preserve signed zero and subnormal baseline rates.
    const rate = offset === 0 ? baseline.input.annualReturnPercent : baseline.input.annualReturnPercent + offset;
    try {
      const value = runCalculator(sipV2Candidate, { ...baseline.input, annualReturnPercent: rate }).output.futureValue;
      const delta = surface === 'scenarios' ? centDelta(value, baseline.output.futureValue) : 0;
      if (!Number.isFinite(value) || !Number.isFinite(delta)) throw new RangeError('Nonfinite SIP v2 analysis');
      if (surface === 'scenarios') result.scenarios.push({
        id: String(index), label: `${rate}% rate`, value, delta, baseline: offset === 0,
        input: { label: 'Annual return', value: rate, unit: '%' },
      });
      else result.points.push({ input: rate, value });
    } catch {
      result.unavailable.push({ surface, rate, label: 'Annual return', unit: '%', reason: 'Requested rate is outside the draft SIP v2 engine’s supported inputs or currency precision range.' });
    }
  };
  [-1, 0, 1].forEach((offset, index) => request('scenarios', offset, index));
  [-2, -1, 0, 1, 2].forEach((offset, index) => request('sensitivity', offset, index));
  return result;
}

const goalSchema = z.object({
  targetFutureValue: z.number().finite().positive(),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  contributionTiming: z.enum(['beginning', 'end']),
});
export type SipV2DraftGoalInput = z.infer<typeof goalSchema>;

/** The authored inverse and forward candidate must reconcile at target currency precision. */
export function solveSipV2DraftGoal(rawInput: SipV2DraftGoalInput) {
  const input = goalSchema.parse(rawInput);
  const monthlyContribution = requiredMonthlySipV2(input.targetFutureValue, input.annualReturnPercent, input.termMonths, input.contributionTiming);
  const output = runCalculator(sipV2Candidate, { ...input, monthlyContribution }).output;
  // Let the same authored candidate certify target cents, including decimal round-trip limits.
  const roundedTarget = runCalculator(sipV2Candidate, {
    monthlyContribution: input.targetFutureValue, annualReturnPercent: 0, termMonths: 1, contributionTiming: 'end',
  }).output.futureValue;
  if (output.futureValue !== roundedTarget) throw new RangeError('SIP v2 goal cannot reconcile rounded target');
  return { identity: identity(), input, output: { monthlyContribution, ...output } };
}
