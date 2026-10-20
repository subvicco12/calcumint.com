/** Engineering arithmetic evidence only; no financial specialist approval.
 * Each target is a deposit-by-deposit rational sum, independent of the
 * production quotient of powers. Existing registered goldens remain untouched.
 */
export const sipNumericalCompatibilityVectors = [
  { label: 'zero return, maximum term', monthly: 1, annual: 0, months: 1200, timing: 'end', target: 1200, cents: 120000n, numerator: 1n, denominator: 1n },
  { label: 'negative schema endpoint, end', monthly: 400, annual: -99, months: 2, timing: 'end', target: 767, cents: 76700n, numerator: 367n, denominator: 400n },
  { label: 'negative schema endpoint, beginning', monthly: 400, annual: -99, months: 2, timing: 'beginning', target: 703.7225, cents: 70372n, numerator: 367n, denominator: 400n },
  { label: 'positive schema endpoint, end', monthly: 600, annual: 1000, months: 2, timing: 'end', target: 1700, cents: 170000n, numerator: 11n, denominator: 6n },
  { label: 'positive schema endpoint, beginning', monthly: 600, annual: 1000, months: 2, timing: 'beginning', target: 3116.6666666666665, cents: 311667n, numerator: 11n, denominator: 6n },
] as const;
