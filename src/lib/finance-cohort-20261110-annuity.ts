/** Unregistered engineering candidate. No calculator version or review status is allocated. */
export const financeAnnuityCandidateRevision = 'private-annuity-log1p-20261110.1';

function validate(amount: number, annualRatePercent: number, termMonths: number): void {
  if (!Number.isFinite(amount) || amount <= 0 ||
      !Number.isFinite(annualRatePercent) || annualRatePercent < 0 || annualRatePercent > 1000 ||
      !Number.isInteger(termMonths) || termMonths < 1 || termMonths > 1200) {
    throw new Error('Annuity inputs must satisfy positive finite amount, annual rate 0..1000 and integer months 1..1200');
  }
}

/** Present value of unit end-of-month payments; equivalent to sum (1+r)^(-k), k=1..n. */
function presentValueFactor(annualRatePercent: number, termMonths: number): number {
  const rate = annualRatePercent / 1200;
  // Below this threshold the first-order change is smaller than binary64 precision
  // throughout the bounded 1200-month domain; also avoids subnormal division error.
  if (rate < Number.EPSILON / (2 * termMonths)) return termMonths;
  return -Math.expm1(-termMonths * Math.log1p(rate)) / rate;
}

function representable(value: number): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error('Annuity result exceeds supported numeric range');
  return value;
}

/** Fixed-rate, fully amortizing, end-of-month payments; no fees, rounding or eligibility policy. */
export function annuityPaymentCandidate(principal: number, annualRatePercent: number, termMonths: number): number {
  validate(principal, annualRatePercent, termMonths);
  return representable(principal / presentValueFactor(annualRatePercent, termMonths));
}

/** Present value of a fixed monthly payment using the same bounded annuity profile. */
export function annuityPrincipalCandidate(monthlyPayment: number, annualRatePercent: number, termMonths: number): number {
  validate(monthlyPayment, annualRatePercent, termMonths);
  return representable(monthlyPayment * presentValueFactor(annualRatePercent, termMonths));
}
