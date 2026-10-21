/** Offline source-contract oracle. Decimal Number.toString() values are exact
 * rationals here; this deliberately does not model intermediate IEEE rounding.
 * Bounds keep work deterministic: <=18 fractional decimal places, <=309 integer
 * digits, <=1200 deposits. Never imported by production calculation code. */
export type Rational = { numerator: bigint; denominator: bigint };
export function decimalRational(value: number): Rational {
  if (!Number.isFinite(value)) throw new RangeError('finite decimal required');
  const [coefficient, exponentText = '0'] = value.toString().toLowerCase().split('e');
  const [integer, fraction = ''] = coefficient.split('.');
  const exponent = Number(exponentText) - fraction.length;
  if (exponent < -18 || exponent > 308) throw new RangeError('reference decimal bound');
  const digits = BigInt(integer + fraction);
  return exponent >= 0 ? { numerator: digits * 10n ** BigInt(exponent), denominator: 1n }
    : { numerator: digits, denominator: 10n ** BigInt(-exponent) };
}
export function exactDeposits(monthly: number, annual: number, months: number, timing: 'beginning' | 'end'): Rational {
  if (!(monthly >= 0) || annual < -99 || annual > 1000 || !Number.isInteger(months) || months < 1 || months > 1200 || !['beginning', 'end'].includes(timing)) throw new RangeError('reference input bound');
  const principal = decimalRational(monthly);
  const rate = decimalRational(annual);
  const d = rate.denominator * 1200n;
  const q = d + rate.numerator;
  let numerator = 0n;
  let denominator = principal.denominator;
  // end deposit recurrence V[k+1] = V[k] * q/d + PMT.
  for (let month = 0; month < months; month++) {
    numerator = numerator * q + principal.numerator * (denominator / principal.denominator) * d;
    denominator *= d;
  }
  return timing === 'beginning' ? { numerator: numerator * q, denominator: denominator * d } : { numerator, denominator };
}
export function exactCents(value: Rational): bigint {
  return (value.numerator * 200n + value.denominator) / (value.denominator * 2n);
}
/** Exact signed interval enclosing (observed decimal output - reference), in cents.
 * Floor/ceil endpoints are strings so huge supported integers stay lossless. */
export function errorCentInterval(observed: number, reference: Rational): [string, string] {
  const actual = decimalRational(observed);
  const n = (actual.numerator * reference.denominator - reference.numerator * actual.denominator) * 100n;
  const d = actual.denominator * reference.denominator;
  const floor = n >= 0n ? n / d : -((-n + d - 1n) / d);
  const ceil = n % d === 0n ? floor : floor + 1n;
  return [floor.toString(), ceil.toString()];
}
/** Diagnostic candidate only: never a production dependency or financial rule. */
export function stableDiagnostic(monthly: number, annual: number, months: number, timing: 'beginning' | 'end') {
  const r = annual / 1200;
  const sum = r === 0 ? months : Math.expm1(months * Math.log1p(r)) / r;
  return monthly * sum * (timing === 'beginning' ? 1 + r : 1);
}
