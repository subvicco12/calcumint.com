/** Exact draft-only decimal arithmetic. No registered/historical engine imports this policy. */
export function parseDecimal(value: string, significantDigits = 100, maxFractionDigits = 100) {
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {
    throw new Error("Expected a plain signed decimal string");
  }
  const negative = value.startsWith("-");
  const unsigned = value.replace(/^[+-]/, "");
  const [whole, fraction = ""] = unsigned.split(".");
  const coefficient = (whole + fraction).replace(/^0+/, "") || "0";
  if (coefficient.length > significantDigits || fraction.length > maxFractionDigits) {
    throw new Error("Decimal precision exceeds the draft contract");
  }
  return { numerator: BigInt(coefficient) * (negative ? -1n : 1n), denominator: 10n ** BigInt(fraction.length) };
}

/** One final significant-digit rounding, ties to even; canonical plain decimal serialization. */
export function formatRational(numerator: bigint, denominator: bigint, digits = 34): string {
  if (denominator === 0n) throw new Error("Division by zero");
  if (!Number.isSafeInteger(digits) || digits < 1 || digits > 100) throw new Error("Invalid precision");
  if (numerator === 0n) return "0";
  const negative = (numerator < 0n) !== (denominator < 0n);
  const n = numerator < 0n ? -numerator : numerator;
  const d = denominator < 0n ? -denominator : denominator;
  let exponent = n.toString().length - d.toString().length;
  if (exponent >= 0 ? n < d * 10n ** BigInt(exponent) : n * 10n ** BigInt(-exponent) < d) exponent--;
  if (exponent < -1000 || exponent > 1000) throw new Error("Result exponent exceeds the draft contract");
  const scale = digits - 1 - exponent;
  const scaledN = scale >= 0 ? n * 10n ** BigInt(scale) : n;
  const scaledD = scale >= 0 ? d : d * 10n ** BigInt(-scale);
  let q = scaledN / scaledD;
  const remainder = scaledN % scaledD;
  if (2n * remainder > scaledD || (2n * remainder === scaledD && q % 2n !== 0n)) q++;
  if (q.toString().length - 1 - scale > 1000) throw new Error("Rounded result exceeds the draft contract");
  let result = q.toString();
  if (scale > 0) {
    result = result.padStart(scale + 1, "0");
    result = `${result.slice(0, -scale)}.${result.slice(-scale)}`.replace(/0+$/, "").replace(/\.$/, "");
  } else if (scale < 0) result += "0".repeat(-scale);
  return (negative ? "-" : "") + result;
}
