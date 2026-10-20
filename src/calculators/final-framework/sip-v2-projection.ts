/** Unregistered draft v2 only. No v1 registry, history or publication imports. */
import { z } from 'zod';
import { sipV2Candidate, sipV2PeriodSnapshots } from '../finance/sip-v2-candidate';
import type { StructuredCalculationResult } from './types';

const contextSchema = z.object({ locale: z.string().min(1).refine(value => value.trim().length > 0).optional(), currency: z.string().min(1).refine(value => value.trim().length > 0).optional() }).strict();
type Context = z.infer<typeof contextSchema>;
export type SipV2DraftProjection = {
  identity: { id: 'finance.sip'; slug: 'sip-calculator'; version: 2 };
  reviewStatus: 'draft';
  context: Context;
  input: ReturnType<typeof sipV2Candidate.inputSchema.parse>;
  output: ReturnType<typeof sipV2Candidate.calculate>;
  periodStatus: 'available' | 'unavailable';
  result: StructuredCalculationResult;
};
export function buildSipV2DraftProjection(rawInput: unknown, context: Context = {}): SipV2DraftProjection {
  const authoredContext = contextSchema.parse(context);
  // Context strings are labels supplied by the caller, never inferred currency.
  const input = sipV2Candidate.inputSchema.parse(rawInput);
  const output = sipV2Candidate.calculate(input, authoredContext);
  const unit = authoredContext.currency === undefined ? {} : { unit: authoredContext.currency };
  const result: StructuredCalculationResult = {
    primaryResult: { id: 'futureValue', label: 'Draft v2 projected value', value: output.futureValue, ...unit },
    metrics: [{ id: 'investedAmount', label: 'Cumulative contributions', value: output.investedAmount, ...unit }, { id: 'estimatedGain', label: 'Cumulative modeled growth', value: output.estimatedGain, ...unit }],
    composition: [{ id: 'invested', label: 'Contributions', value: output.investedAmount, ...unit }, { id: 'gain', label: 'Modeled growth', value: output.estimatedGain, ...unit }],
    warnings: ['Unregistered draft version 2; not certified. Modeled returns are not guaranteed.'],
    methodology: 'Draft v2 outward-rounded decimal accumulation. Monthly snapshots use the same contribution timing and authoritative rounding as the terminal calculation. Contributions and growth are cumulative outputs; do not sum snapshots as cash-flow transactions.',
    sources: sipV2Candidate.sources,
  };
  let periodStatus: SipV2DraftProjection['periodStatus'] = 'available';
  try {
    const snapshots = sipV2PeriodSnapshots(input);
    result.schedule = snapshots.map(({ month, output: values }) => ({ id: String(month), period: month, values }));
    result.scheduleMetadata = {
      caption: 'Draft v2 SIP projected monthly snapshots', period: { key: 'month', label: 'Month', unit: 'months' },
      columns: [{ key: 'investedAmount', label: 'Cumulative contributions', ...unit }, { key: 'estimatedGain', label: 'Cumulative modeled growth', ...unit }, { key: 'futureValue', label: 'Projected value', ...unit }],
      granularity: 'complete', terminal: Object.entries(output).map(([column, expected]) => ({ column, expected, tolerance: 0 })),
    };
    result.series = [{ id: 'growth', label: 'Draft v2 projected monthly value', ...unit, points: snapshots.map(({ month, output: value }) => ({ x: month, y: value.futureValue })) }];
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    periodStatus = 'unavailable';
    result.warnings = [...result.warnings!, `Optional monthly projection unavailable: ${error.message}`];
  }
  return { identity: { id: 'finance.sip', slug: 'sip-calculator', version: 2 }, reviewStatus: 'draft', context: authoredContext, input, output, periodStatus, result };
}

// Reject values JSON would silently drop/coerce before comparing the complete
// version-bound v2 payload. Object key ordering does not affect validation.
function canonical(value: unknown, seen = new Set<object>()): string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return Object.is(value, -0) ? '-0' : JSON.stringify(value);
  if (typeof value !== 'object' || value === null || seen.has(value)) throw new TypeError('Invalid draft projection JSON');
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('Invalid draft projection object');
  if (Reflect.ownKeys(value).some(key => typeof key === 'symbol')) throw new TypeError('Invalid draft projection keys');
  if (Array.isArray(value) && Object.keys(value).length !== value.length) throw new TypeError('Invalid draft projection array');
  seen.add(value);
  const encoded = Array.isArray(value) ? `[${value.map(item => canonical(item, seen)).join(',')}]` : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key], seen)}`).join(',')}}`;
  seen.delete(value);
  return encoded;
}
function validateProjection(value: SipV2DraftProjection): void {
  const supplied = canonical(value);
  const expected = buildSipV2DraftProjection(value.input, value.context);
  if (supplied !== canonical(expected)) throw new TypeError('Stale or tampered SIP v2 draft projection');
}
export function serializeSipV2DraftJson(projection: SipV2DraftProjection): string {
  validateProjection(projection);
  return canonical(projection);
}
export function serializeSipV2DraftCsv(projection: SipV2DraftProjection): string {
  validateProjection(projection);
  const cell = (value: unknown) => `"${(Object.is(value, -0) ? '-0' : String(value ?? '')).replaceAll('"', '""')}"`;
  const rows: unknown[][] = [
    ['calculatorId', 'slug', 'version', 'reviewStatus', 'locale', 'currency'],
    [projection.identity.id, projection.identity.slug, projection.identity.version, projection.reviewStatus, projection.context.locale, projection.context.currency],
    ['futureValue', 'investedAmount', 'estimatedGain', 'periodStatus'],
    [projection.output.futureValue, projection.output.investedAmount, projection.output.estimatedGain, projection.periodStatus],
    ['month', 'investedAmount', 'estimatedGain', 'futureValue'],
    ...(projection.result.schedule ?? []).map(row => [row.period, row.values.investedAmount, row.values.estimatedGain, row.values.futureValue]),
  ];
  return rows.map(row => row.map(cell).join(',')).join('\r\n');
}
