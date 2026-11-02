/** Isolated successor prototype: never imported by historical engines or registry.
 * Exact BigInt sufficient statistics avoid cancellation across the entire input
 * envelope. Decimal.js 10.6.0 (MIT) performs only final 50-digit division/sqrt.
 */
import Decimal from 'decimal.js';
const D = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_EVEN, minE: -1000, maxE: 1000, toExpNeg: -7, toExpPos: 12 });
const SCALE = 10n ** 133n;
type Fraction = { n: bigint; d: bigint };
export type DecimalStatisticsInput = {
  mode: 'population' | 'sample';
  encoding: 'raw' | 'frequency';
  rows: readonly { value: string | null | undefined; frequency?: string; missing?: boolean }[];
  missingPolicy?: 'reject' | 'omit';
  unit?: string;
};
export type DecimalStatisticsErrorCode = 'invalid-input' | 'invalid-decimal' | 'decimal-envelope' | 'invalid-frequency' | 'missing-value' | 'cardinality' | 'numerical-failure';
export type DecimalStatisticsResult = {
  status: 'finite'; mode: 'population' | 'sample'; encoding: 'raw' | 'frequency'; unit: string;
  counts: { importedRows: number; validRows: number; omittedRows: number; zeroFrequencyRows: number; effectiveN: number };
  denominator: number;
  rows: { index: number; original: string | null; normalized: string | null; frequency: number; disposition: 'valid' | 'omitted' | 'zero-frequency' }[];
  metrics: Record<'sum' | 'mean' | 'centeredM2' | 'variance' | 'standardDeviation' | 'minimum' | 'maximum' | 'range' | 'q1' | 'median' | 'q3' | 'iqr' | 'rawMad' | 'meanAbsoluteDeviation', string>;
  numericalPolicy: { algorithm: 'exact-integer-lattice-rational-decimal50-v1'; precision: 50; rounding: 'half-even'; relativeBudget: '1e-40'; scaleExponent: -133 };
};
export type DecimalStatisticsOutcome = DecimalStatisticsResult | { status: 'error'; code: DecimalStatisticsErrorCode; message: string; row?: number };
class InputError extends Error { constructor(public code: DecimalStatisticsErrorCode, message: string, public row?: number) { super(message); } }
function fail(code: DecimalStatisticsErrorCode, message: string, row?: number): never { throw new InputError(code, message, row); }
function parse(value: string, row: number): bigint {
  const token = value.trim();
  if (token.length > 128 || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(token)) fail('invalid-decimal', 'Expected a complete finite decimal token of at most 128 characters', row);
  const [mantissa, exponent = '0'] = token.toLowerCase().split('e');
  const unsigned = mantissa.replace(/^[+-]/, '');
  const [whole, fraction = ''] = unsigned.split('.');
  const digits = (whole + fraction).replace(/^0+/, '').replace(/0+$/, '');
  if (!digits) return 0n;
  // Bound exponent before Number conversion, preventing overflow and huge powers.
  const e = Number(exponent);
  const rawDigits = (whole + fraction).replace(/^0+/, '');
  const adjusted = e - fraction.length + rawDigits.length - 1;
  if (digits.length > 34 || !Number.isSafeInteger(adjusted) || adjusted < -100 || adjusted > 100) fail('decimal-envelope', 'Requires at most 34 significant digits and adjusted exponent -100..100', row);
  const power = adjusted - digits.length + 1 + 133;
  return BigInt(digits) * 10n ** BigInt(power) * (mantissa.startsWith('-') ? -1n : 1n);
}
function raw(f: Fraction): string { return f.n === 0n ? '0' : new D(f.n.toString()).div(f.d.toString()).toString(); }
function exact(x: bigint): string {
  if (x === 0n) return '0';
  const digits = abs(x).toString().padStart(134, '0');
  const text = `${digits.slice(0, -133)}.${digits.slice(-133)}`.replace(/0+$/, '').replace(/\.$/, '');
  return (x < 0n ? '-' : '') + text;
}
function abs(x: bigint) { return x < 0n ? -x : x; }
/** No frequency expansion, floating point observations, epsilon decisions, or silent partial result. */
export function computeDecimalStatistics(input: DecimalStatisticsInput): DecimalStatisticsOutcome {
  try {
    if (!input || !['population', 'sample'].includes(input.mode) || !['raw', 'frequency'].includes(input.encoding) || !Array.isArray(input.rows) || !['reject', 'omit'].includes(input.missingPolicy ?? 'reject') || (input.unit !== undefined && (typeof input.unit !== 'string' || input.unit.length > 40))) fail('invalid-input', 'Invalid mode, encoding, missing policy, rows, or unit');
    if (input.rows.length < 1 || input.rows.length > 10000) fail('cardinality', 'Requires 1..10000 stored rows');
    const rows: DecimalStatisticsResult['rows'] = [];
    const values: { x: bigint; f: number }[] = [];
    let count = 0, omitted = 0, zero = 0;
    for (let index = 0; index < input.rows.length; index++) {
      const row = input.rows[index];
      if (!row || typeof row !== 'object') fail('invalid-input', 'Invalid row', index);
      let f = 1;
      if (input.encoding === 'frequency') {
        if (typeof row.frequency !== 'string' || row.frequency.length > 128 || !/^\d+$/.test(row.frequency.trim())) fail('invalid-frequency', 'Frequency must be a nonnegative integer token', index);
        f = Number(row.frequency.trim());
        if (!Number.isSafeInteger(f) || f > 10000000) fail('invalid-frequency', 'Frequency exceeds 10000000', index);
      } else if (row.frequency !== undefined) fail('invalid-frequency', 'Raw rows cannot specify frequency', index);
      const original = typeof row.value === 'string' ? row.value : null;
      if (f === 0) { zero++; rows.push({ index, original, normalized: null, frequency: 0, disposition: 'zero-frequency' }); continue; }
      if (row.missing === true || row.value === null || row.value === undefined || (typeof row.value === 'string' && row.value.trim() === '')) {
        if (input.missingPolicy !== 'omit') fail('missing-value', 'Missing observation requires explicit omit policy', index);
        omitted++; rows.push({ index, original, normalized: null, frequency: f, disposition: 'omitted' }); continue;
      }
      if (typeof row.value !== 'string') fail('invalid-decimal', 'Observation must be an exact decimal string', index);
      const x = parse(row.value, index);
      count += f;
      if (count > 10000000) fail('cardinality', 'Effective frequency total exceeds 10000000', index);
      values.push({ x, f }); rows.push({ index, original, normalized: exact(x), frequency: f, disposition: 'valid' });
    }
    if (count < (input.mode === 'sample' ? 2 : 1)) fail('cardinality', 'Insufficient effective observations for selected mode');
    const n = BigInt(count);
    let sum = 0n, squares = 0n;
    for (const { x, f } of values) { sum += x * BigInt(f); squares += x * x * BigInt(f); }
    const m2numerator = n * squares - sum * sum;
    if (m2numerator < 0n) fail('numerical-failure', 'Negative exact centered sum');
    const denominator = input.mode === 'sample' ? count - 1 : count;
    const variance = raw({ n: m2numerator, d: n * BigInt(denominator) * SCALE * SCALE });
    values.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0);
    function rank(k: number, sorted = values): bigint { let cumulative = 0; for (const row of sorted) { cumulative += row.f; if (k < cumulative) return row.x; } throw new Error('Rank out of range'); }
    // Type 7 at p=k/4; all rank decisions exact integer arithmetic.
    function quantile(k: number): bigint { const h4 = (count - 1) * k; const j = Math.floor(h4 / 4); const r = h4 % 4; return 4n * rank(j) + BigInt(r) * (rank(Math.min(j + 1, count - 1)) - rank(j)); }
    const q1 = quantile(1), median = quantile(2), q3 = quantile(3);
    const deviations = values.map(({ x, f }) => ({ x: abs(4n * x - median), f })).sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0);
    const mad8 = rank(Math.floor((count - 1) / 2), deviations) + rank(Math.floor(count / 2), deviations);
    let aad = 0n; for (const { x, f } of values) aad += BigInt(f) * abs(n * x - sum);
    const metrics = {
      sum: exact(sum), mean: raw({ n: sum, d: n * SCALE }), centeredM2: raw({ n: m2numerator, d: n * SCALE * SCALE }), variance,
      standardDeviation: new D(variance).sqrt().toString(), minimum: exact(values[0].x), maximum: exact(values[values.length - 1].x), range: exact(values[values.length - 1].x - values[0].x),
      q1: raw({ n: q1, d: 4n * SCALE }), median: raw({ n: median, d: 4n * SCALE }), q3: raw({ n: q3, d: 4n * SCALE }), iqr: raw({ n: q3 - q1, d: 4n * SCALE }), rawMad: raw({ n: mad8, d: 8n * SCALE }), meanAbsoluteDeviation: raw({ n: aad, d: n * n * SCALE })
    };
    if (Object.values(metrics).some(x => !new D(x).isFinite())) fail('numerical-failure', 'Nonfinite result');
    return { status: 'finite', mode: input.mode, encoding: input.encoding, unit: input.unit ?? '', counts: { importedRows: rows.length, validRows: values.length, omittedRows: omitted, zeroFrequencyRows: zero, effectiveN: count }, denominator, rows, metrics, numericalPolicy: { algorithm: 'exact-integer-lattice-rational-decimal50-v1', precision: 50, rounding: 'half-even', relativeBudget: '1e-40', scaleExponent: -133 } };
  } catch (error) {
    return error instanceof InputError ? { status: 'error', code: error.code, message: error.message, ...(error.row === undefined ? {} : { row: error.row }) } : { status: 'error', code: 'numerical-failure', message: 'Exact decimal computation failed' };
  }
}
