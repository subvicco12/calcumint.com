import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';
import { paymentForLoan } from '../../src/calculators/finance/loan-analysis';
import { annuityPaymentCandidate, annuityPrincipalCandidate } from '../../src/lib/finance-cohort-20261110-annuity';

// Independent decimal discounted-cash-flow sum, avoiding log/expm1 and closed-form subtraction.
const D = Decimal.clone({ precision: 90 });
function factor(rate: number, months: number): Decimal {
  const discount = new D(1).div(new D(1).plus(new D(rate.toString()).div(1200)));
  let power = new D(1), sum = new D(0);
  for (let i = 0; i < months; i++) { power = power.mul(discount); sum = sum.plus(power); }
  return sum;
}
describe('standalone annuity numerical successor', () => {
  it('retains the historical failure witness without modifying replay', () => {
    expect(() => paymentForLoan(1200, 1e-14, 12)).toThrow('numeric range');
  });
  it.each([0, Number.MIN_VALUE, 1e-310, 1e-300, 1e-14, 1e-10, 0.01, 6, 1000])('matches independent discounted cash flows at annual rate %s', (rate) => {
    for (const months of [1, 12, 360, 1200]) {
      const pvFactor = factor(rate, months);
      const expectedPayment = new D(1200).div(pvFactor).toNumber();
      const expectedPrincipal = pvFactor.mul(100).toNumber();
      expect(Math.abs(annuityPaymentCandidate(1200, rate, months) / expectedPayment - 1)).toBeLessThan(2e-14);
      expect(Math.abs(annuityPrincipalCandidate(100, rate, months) / expectedPrincipal - 1)).toBeLessThan(2e-14);
    }
  });
  it('avoids intermediate overflow when the monthly payment is representable', () => {
    expect(Number.isFinite(annuityPaymentCandidate(1e308, 1000, 1200))).toBe(true);
    expect(annuityPaymentCandidate(1e308, 0, 1200)).toBe(1e308 / 1200);
  });
  it('rejects unsupported domains and unrepresentable nonzero results', () => {
    for (const args of [[0, 6, 12], [NaN, 6, 12], [1, -1, 12], [1, 1001, 12], [1, 6, 1201], [1, 6, 1.5], [1, Infinity, 12]]) {
      expect(() => annuityPaymentCandidate(...args as [number, number, number])).toThrow();
      expect(() => annuityPrincipalCandidate(...args as [number, number, number])).toThrow();
    }
    expect(() => annuityPrincipalCandidate(1e308, 0, 1200)).toThrow('numeric range');
    expect(() => annuityPaymentCandidate(Number.MAX_VALUE, 1000, 1)).toThrow('numeric range');
    expect(() => annuityPaymentCandidate(Number.MIN_VALUE, 0, 1200)).toThrow('numeric range');
  });
});
