/** UNREGISTERED DRAFT. Decimal interval evaluation of the authored SIP formula.
 * 360 fractional digits enclose every finite binary64 canonical decimal input,
 * including subnormals. No production oracle or entitlement-specific math. */
import { z } from 'zod';
import { sipV2Goldens } from './sip-v2-goldens';
import type { CalculatorDefinition } from '../types';

const schema = z.object({
  monthlyContribution: z.number().finite().positive(),
  annualReturnPercent: z.number().finite().min(-99).max(1000),
  termMonths: z.number().int().min(1).max(1200),
  contributionTiming: z.enum(['beginning', 'end']).default('beginning'),
});
type Input = z.infer<typeof schema>;
type Output = { futureValue: number; investedAmount: number; estimatedGain: number };
type Timing = 'beginning' | 'end';
const SCALE = 10n ** 360n;
const SAFE_CENTS = BigInt(Number.MAX_SAFE_INTEGER);
function decimal(value: number): bigint {
  const [mantissa, exponent = '0'] = value.toString().split('e');
  const [integer, fraction = ''] = mantissa.split('.');
  return BigInt(integer + fraction) * 10n ** BigInt(360 + Number(exponent) - fraction.length);
}
function validate(monthly: number, annual: number, months: number, timing: Timing) {
  if (!Number.isFinite(monthly) || monthly < 0 || !Number.isFinite(annual) || annual < -99 || annual > 1000 || !Number.isInteger(months) || months < 1 || months > 1200 || !['beginning', 'end'].includes(timing)) throw new RangeError('Invalid SIP v2 input');
}
const ceilDivide = (n: bigint, d: bigint) => (n + d - 1n) / d;
function accumulation(monthly: number, annual: number, months: number, timing: Timing): [bigint, bigint] {
  validate(monthly, annual, months, timing);
  const p = decimal(monthly);
  // Positive growth multiplier: division with outward rounding also works for
  // negative annual rates because the complete numerator remains positive.
  const numerator = SCALE * 1200n + decimal(annual);
  const qLo = numerator / 1200n;
  const qHi = ceilDivide(numerator, 1200n);
  let lo = 0n, hi = 0n;
  for (let i = 0; i < months; i++) {
    lo = lo * qLo / SCALE + p;
    hi = ceilDivide(hi * qHi, SCALE) + p;
  }
  if (timing === 'beginning') {
    lo = lo * qLo / SCALE;
    hi = ceilDivide(hi * qHi, SCALE);
  }
  return [lo, hi];
}
function certifiedCents([lo, hi]: [bigint, bigint], exact?: () => bigint): bigint {
  const low = (lo * 100n + SCALE / 2n) / SCALE;
  const high = (hi * 100n + SCALE / 2n) / SCALE;
  if (low !== high) {
    if (!exact) throw new RangeError('SIP v2 precision interval crosses a rounding boundary');
    return checkedCents(exact());
  }
  if (high > SAFE_CENTS) throw new RangeError('SIP v2 currency precision exceeds safe integer cents range');
  return checkedCents(low);
}

function checkedCents(cents: bigint): bigint {
  if (cents > SAFE_CENTS || cents < -SAFE_CENTS) throw new RangeError('SIP v2 currency precision exceeds safe integer cents range');
  if (decimal(Number(cents) / 100) * 100n !== cents * SCALE) throw new RangeError('SIP v2 decimal currency precision cannot round-trip');
  return cents;
}
function gcd(a: bigint, b: bigint): bigint { while (b) { const next = a % b; a = b; b = next; } return a < 0n ? -a : a; }
/** Rare exact half-cent fallback. Bound power operands to 20,000 decimal
 * digits before constructing them; tiny-rate ambiguous cases fail closed. */
function exactBoundaryCents(p: number, a: number, n: number, t: Timing): bigint {
  const rate = decimal(a), divisor = gcd(rate, SCALE * 1200n);
  const d = SCALE * 1200n / divisor, delta = rate / divisor, q = d + delta;
  if (Math.max(q.toString().length, d.toString().length) * n > 20000) throw new RangeError('SIP v2 precision boundary exceeds exact fallback work limit');
  const principal = decimal(p), common = gcd(principal, SCALE);
  let numerator = principal / common * (q ** BigInt(n) - d ** BigInt(n));
  let denominator = SCALE / common * delta * d ** BigInt(n - 1);
  if (t === 'beginning') { numerator *= q; denominator *= d; }
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  return (numerator * 200n + denominator) / (denominator * 2n);
}
function money(p: number, a: number, n: number, t: Timing): bigint {
  return certifiedCents(accumulation(p, a, n, t), () => exactBoundaryCents(p, a, n, t));
}

function asNumber(value: bigint): number { return Number(`${value}e-360`); }

/** Unrounded approximation for numerical/inverse use, with certified cent bounds.
 * Decimal cents are authoritative; returned binary64 is not exact decimal money. */
export function sipV2FutureValue(monthly: number, annual: number, months: number, timing: Timing = 'beginning'): number {
  const interval = accumulation(monthly, annual, months, timing);
  certifiedCents(interval, () => exactBoundaryCents(monthly, annual, months, timing));
  return asNumber((interval[0] + interval[1]) / 2n);
}
export function requiredMonthlySipV2(target: number, annual: number, months: number, timing: Timing = 'beginning'): number {
  if (!Number.isFinite(target) || target <= 0) throw new RangeError('Invalid SIP v2 target');
  const targetCents = certifiedCents([decimal(target), decimal(target)]);
  // Factor itself need not be currency-sized; the forward result must be.
  const [lo, hi] = accumulation(1, annual, months, timing);
  const monthly = asNumber(decimal(target) * SCALE / ((lo + hi) / 2n));
  if (!Number.isFinite(monthly) || monthly <= 0) throw new RangeError('SIP v2 inverse exceeds numeric range');
  if (money(monthly, annual, months, timing) !== targetCents) throw new RangeError('SIP v2 inverse cannot reconcile target currency precision');
  return monthly;
}
export const sipV2Candidate: CalculatorDefinition<Input, Output> = {
  id: 'finance.sip', slug: 'sip-calculator', title: 'SIP Investment Calculator', category: 'finance-investment',
  version: 2, riskClass: 'financial', reviewStatus: 'draft', inputSchema: schema, goldenTests: sipV2Goldens,
  calculate: (raw) => {
    const input = schema.parse(raw);
    const { monthlyContribution: p, annualReturnPercent: a, termMonths: n, contributionTiming: t } = input;
    const fv = money(p, a, n, t);
    const invested = certifiedCents([decimal(p) * BigInt(n), decimal(p) * BigInt(n)]);
    return { futureValue: Number(fv) / 100, investedAmount: Number(invested) / 100, estimatedGain: Number(checkedCents(fv - invested)) / 100 };
  },
  formulas: [{ id: 'sip-future-value', expression: 'FV = PMT × ((1+r)^n - 1)/r × timingFactor', description: 'Equal monthly deposits; r = annual percent / 1200. At r=0, FV=PMT×n. Evaluated by outward-rounded decimal deposit recurrence.' }],
  sources: [{ label: 'OpenStax — Mathematics of Finance: annuities', url: 'https://openstax.org/books/contemporary-mathematics/pages/6-3-annuities' }, { label: 'Investor.gov — Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' }],
  examples: [{ label: 'Near-zero 100-year accumulation', input: { monthlyContribution: 10000, annualReturnPercent: 1e-12, termMonths: 1200, contributionTiming: 'beginning' }, expected: { futureValue: 12000000, investedAmount: 12000000, estimatedGain: 0 } }],
};

/** Authoritative cumulative monthly snapshots, using one outward-rounded loop.
 * Rounded snapshots are outputs, never rounded cash-flow state. May fail for a
 * prefix even when the terminal calculation is representable. */
export function sipV2PeriodSnapshots(raw: unknown): readonly { month: number; output: Output }[] {
  const { monthlyContribution: p, annualReturnPercent: a, termMonths: n, contributionTiming: t } = schema.parse(raw);
  const principal = decimal(p), numerator = SCALE * 1200n + decimal(a);
  const qLo = numerator / 1200n, qHi = ceilDivide(numerator, 1200n);
  let lo = 0n, hi = 0n;
  const rows: { month: number; output: Output }[] = [];
  for (let month = 1; month <= n; month++) {
    lo = lo * qLo / SCALE + principal;
    hi = ceilDivide(hi * qHi, SCALE) + principal;
    const interval: [bigint, bigint] = t === 'beginning' ? [lo * qLo / SCALE, ceilDivide(hi * qHi, SCALE)] : [lo, hi];
    const fv = certifiedCents(interval, () => exactBoundaryCents(p, a, month, t));
    const invested = certifiedCents([principal * BigInt(month), principal * BigInt(month)]);
    rows.push({ month, output: { futureValue: Number(fv) / 100, investedAmount: Number(invested) / 100, estimatedGain: Number(checkedCents(fv - invested)) / 100 } });
  }
  return rows;
}
