/** Candidate arithmetic only. Exact binary64 factors; one nearest-even rounding.
 * Not a declared precision policy for any registered physical calculator.
 */
export function roundFactorRatio(numerators: readonly number[], denominators: readonly number[]): number {
  if (numerators.some(x => !Number.isFinite(x)) || denominators.some(x => !Number.isFinite(x) || x === 0)) {
    throw new Error('Finite factors and nonzero denominators required');
  }
  if (numerators.some(x => x === 0)) return 0;
  let numerator = 1n, denominator = 1n, exponent = 0, sign = 1;
  const view = new DataView(new ArrayBuffer(8));
  for (const [factors, direction] of [[numerators, 1], [denominators, -1]] as const) {
    for (const value of factors) {
      view.setFloat64(0, value);
      const bits = view.getBigUint64(0);
      if (bits >> 63n) sign = -sign;
      const encodedExponent = Number((bits >> 52n) & 2047n);
      const significand = (bits & ((1n << 52n) - 1n)) + (encodedExponent ? 1n << 52n : 0n);
      exponent += direction * (encodedExponent ? encodedExponent - 1075 : -1074);
      if (direction === 1) numerator *= significand;
      else denominator *= significand;
    }
  }
  if (exponent >= 0) numerator <<= BigInt(exponent);
  else denominator <<= BigInt(-exponent);
  let binaryExponent = numerator.toString(2).length - denominator.toString(2).length;
  if (binaryExponent >= 0 ? numerator < (denominator << BigInt(binaryExponent))
    : (numerator << BigInt(-binaryExponent)) < denominator) binaryExponent--;
  const outside = () => new Error('Calculated result is outside the supported finite nonzero range');
  if (binaryExponent > 1023 || binaryExponent < -1075) throw outside();
  const spacingExponent = Math.max(-1074, binaryExponent - 52);
  if (spacingExponent >= 0) denominator <<= BigInt(spacingExponent);
  else numerator <<= BigInt(-spacingExponent);
  let rounded = numerator / denominator;
  const twiceRemainder = 2n * (numerator % denominator);
  if (twiceRemainder > denominator || (twiceRemainder === denominator && (rounded & 1n) === 1n)) rounded++;
  const magnitude = Number(rounded) * 2 ** spacingExponent;
  if (!Number.isFinite(magnitude) || magnitude === 0) throw outside();
  return sign * magnitude;
}
