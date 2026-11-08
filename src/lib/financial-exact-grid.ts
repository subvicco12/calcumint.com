import { roundTo, type RoundingMode } from "../calculators/precision";

/** Standalone experimental engineering component; no registered calculator adoption. */
export const financialExactGridTechnicalRevision = "private-exact-grid-candidate-1";

/**
 * Prove membership in the decimal grid using the exact binary64 rational.
 * If x = significand * 2^exponent, then x * 10^digits is integral iff
 * significand * 2^(exponent + digits) is integral: the remaining factor
 * 5^digits is odd and cannot cancel a power-of-two denominator.
 */
function liesOnExactDecimalGrid(value: number, digits: number): boolean {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value, false);
  const bits = view.getBigUint64(0, false);
  const exponentBits = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & ((1n << 52n) - 1n);
  const significand = exponentBits === 0 ? fraction : (1n << 52n) | fraction;
  const exponent = exponentBits === 0 ? -1074 : exponentBits - 1023 - 52;
  const decimalGridExponent = exponent + digits;
  return decimalGridExponent >= 0 || significand % (1n << BigInt(-decimalGridExponent)) === 0n;
}

/**
 * Preserve already exact grid values only. All off-grid rounding remains the
 * legacy policy; this component does not establish a complete rounding proof
 * or change any registered financial calculator or historical replay.
 */
export function roundFinancialExactGridCandidate(value: number, digits = 2, mode: RoundingMode = "half-away-from-zero"): number {
  if (Number.isFinite(value) && Number.isInteger(digits) && digits >= 0 && digits <= 12 && liesOnExactDecimalGrid(value, digits)) {
    return value === 0 ? 0 : value;
  }
  return roundTo(value, digits, mode);
}
