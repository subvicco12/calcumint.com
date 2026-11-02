import Decimal from 'decimal.js';

/** Isolated SH-03 presentation foundation; does not certify compute accuracy. */
export const FORMATTER_VERSION = 'full-six-half-even-1';
const DisplayDecimal = Decimal.clone({ precision: 60, rounding: Decimal.ROUND_HALF_EVEN });
const DECIMAL_TOKEN = /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
export interface NumericFormatOptions {
  expanded?: boolean;
  /** Exactness must be established by the caller's algebra, never inferred here. */
  approximation?: 'approximate' | 'exact-integer' | 'exact-rational';
  uncertainty?: string;
  unit?: string;
}
export interface FormattedNumericValue {
  raw: string;
  display: string;
  text: string;
  significantDigits: 12 | 15;
  approximate: boolean;
  negativeZero: boolean;
  formatterVersion: string;
  uncertainty?: string;
  unit?: string;
}
export function serializeBinary64(value: number): string {
  if (!Number.isFinite(value)) throw new RangeError('Expected a finite binary64 value');
  return Object.is(value, -0) ? '-0' : value.toString();
}
export function formatNumericValue(raw: string, options: NumericFormatOptions = {}): FormattedNumericValue {
  if (typeof raw !== 'string' || !DECIMAL_TOKEN.test(raw)) throw new RangeError('Expected a complete decimal string');
  const value = new DisplayDecimal(raw);
  if (!value.isFinite() || (value.isZero() && /[1-9]/.test(raw.split(/[eE]/)[0]))) throw new RangeError('Decimal outside formatting range');
  const significantDigits = options.expanded ? 15 : 12;
  if (options.approximation === 'exact-integer' && !value.isInteger()) throw new RangeError('Exact integer assertion requires an integer');
  const rounded = value.toSignificantDigits(significantDigits, Decimal.ROUND_HALF_EVEN);
  const scientific = !rounded.isZero() && (rounded.abs().lt('1e-6') || rounded.abs().gte('1e12'));
  const display = rounded.isZero() ? '0' : scientific ? rounded.toExponential() : rounded.toFixed();
  const approximate = !options.approximation || options.approximation === 'approximate' || !value.eq(rounded) || !!options.uncertainty;
  const text = `${approximate ? '≈ ' : ''}${display}${options.unit ? ` ${options.unit}` : ''}${options.uncertainty ? ` (${options.uncertainty})` : ''}`;
  return { raw, display, text, significantDigits, approximate, negativeZero: value.isZero() && value.isNegative(), formatterVersion: FORMATTER_VERSION,
    ...(options.unit !== undefined ? {unit: options.unit} : {}), ...(options.uncertainty !== undefined ? {uncertainty: options.uncertainty} : {}) };
}
