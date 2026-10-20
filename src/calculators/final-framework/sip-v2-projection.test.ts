import { inspectScheduleContract } from './schedule-contract';
import { describe, expect, it } from 'vitest';
import { buildSipV2DraftProjection, serializeSipV2DraftCsv, serializeSipV2DraftJson } from './sip-v2-projection';
import { sipHighPrecisionVectors } from '../verification/fixtures/sip-high-precision-vectors';
import { sipV2Candidate } from '../finance/sip-v2-candidate';
const input = { monthlyContribution: 10000, annualReturnPercent: 1e-12, termMonths: 1200, contributionTiming: 'beginning' as const };
describe('SIP v2 draft projections', () => {
  for (const annualReturnPercent of [0, 1e-12, -1e-12, 1e-300, -1e-300, 8, -99]) for (const contributionTiming of ['beginning', 'end'] as const) it(`reconciles ${annualReturnPercent} ${contributionTiming}`, () => {
    const p = buildSipV2DraftProjection({ ...input, annualReturnPercent, contributionTiming });
    expect(p.result.schedule).toHaveLength(1200);
    expect(inspectScheduleContract(p.result.schedule!, p.result.scheduleMetadata!)).toEqual([]);
    const csv = serializeSipV2DraftCsv(p).split('\r\n');
    expect(csv).toHaveLength(1205);
    for (const [index, row] of p.result.schedule!.entries()) expect(csv[index + 5]).toBe([row.period, row.values.investedAmount, row.values.estimatedGain, row.values.futureValue].map(value => `"${value}"`).join(','));
    expect(p.result.schedule?.at(-1)?.values).toEqual(p.output);
    for (const month of [1, 12, 55, 1200]) expect(p.result.schedule?.[month - 1].values).toEqual(sipV2Candidate.calculate({ ...p.input, termMonths: month }, {}));
    expect(p.result.series?.[0].points.at(-1)?.y).toBe(p.output.futureValue);
    expect(JSON.parse(serializeSipV2DraftJson(p))).toEqual(p);
    expect(serializeSipV2DraftCsv(p)).toContain('"finance.sip","sip-calculator","2","draft"');
  });
  for (const vector of sipHighPrecisionVectors) it(`reference projection: ${vector.label}`, () => {
    const raw = { monthlyContribution: vector.monthly, annualReturnPercent: vector.annual, termMonths: vector.months, contributionTiming: vector.timing };
    let output;
    try { output = sipV2Candidate.calculate(raw, {}); } catch { expect(() => buildSipV2DraftProjection(raw)).toThrow(); return; }
    const p = buildSipV2DraftProjection(raw);
    expect(p.output).toEqual(output);
    if (p.periodStatus === 'available') expect(p.result.schedule?.at(-1)?.values).toEqual(output);
  });
  it('keeps valid core when an optional prefix cannot round-trip decimal cents', () => {
    const p = buildSipV2DraftProjection({ monthlyContribution: 11000000000000.01, annualReturnPercent: 0, termMonths: 8, contributionTiming: 'end' });
    expect(p.output.futureValue).toBe(88000000000000.08);
    expect(p.periodStatus).toBe('unavailable');
    expect(p.result.schedule).toBeUndefined();
    expect(p.result.series).toBeUndefined();
    expect(p.result.warnings?.join(' ')).toContain('unavailable');
    expect(JSON.parse(serializeSipV2DraftJson(p)).output.futureValue).toBe(88000000000000.08);
  });
  it('preserves caller context and signed zero gain', () => {
    const p = buildSipV2DraftProjection({ ...input, monthlyContribution: 0.005, annualReturnPercent: -1e-300, termMonths: 1 }, { locale: 'en-IN', currency: 'INR' });
    expect(p.output).toEqual({ futureValue: 0, investedAmount: 0.01, estimatedGain: -0.01 });
    expect(p.context).toEqual({ locale: 'en-IN', currency: 'INR' });
    expect(serializeSipV2DraftCsv(p)).toContain('"0","0.01","-0.01"');
  });
  it('preserves explicit negative zero input through JSON and rejects false context', () => {
    const p = buildSipV2DraftProjection({ ...input, annualReturnPercent: -0, termMonths: 1 });
    expect(Object.is(JSON.parse(serializeSipV2DraftJson(p)).input.annualReturnPercent, -0)).toBe(true);
    expect(() => buildSipV2DraftProjection(input, { currency: false } as unknown as { currency: string })).toThrow();
  });
  it('rejects invalid inputs and context', () => {
    for (const raw of [null, false, { ...input, monthlyContribution: 0 }, { ...input, termMonths: 0 }, { ...input, annualReturnPercent: Infinity }]) expect(() => buildSipV2DraftProjection(raw)).toThrow();
    expect(() => buildSipV2DraftProjection(input, { currency: '' })).toThrow();
  });
  it('rejects stale identity, output, metadata, rows and non-JSON values', () => {
    const p = buildSipV2DraftProjection({ ...input, termMonths: 2 });
    const changes: readonly [string[], unknown][] = [
      [['identity', 'version'], 1], [['output', 'futureValue'], 99],
      [['result', 'schedule', '0', 'values', 'futureValue'], 99],
      [['result', 'scheduleMetadata', 'caption'], 'certified'],
      [['context', 'currency'], 'USD'], [['extra'], undefined], [['output', 'estimatedGain'], NaN],
    ];
    for (const [path, replacement] of changes) {
      const copy = structuredClone(p);
      let cursor = copy as unknown as Record<string, unknown>;
      for (const key of path.slice(0, -1)) cursor = cursor[key] as Record<string, unknown>;
      cursor[path.at(-1)!] = replacement;
      expect(() => serializeSipV2DraftJson(copy)).toThrow();
      expect(() => serializeSipV2DraftCsv(copy)).toThrow();
    }
  });
});
it('neutralizes formula-like context text in CSV without changing numeric signs or JSON',()=>{
 for(const currency of ['=1+1',' +1','-1','@SUM(1,1)','\t=1+1']){
  const projection=buildSipV2DraftProjection({monthlyContribution:100,annualReturnPercent:-12,termMonths:2,contributionTiming:'end'},{currency});
  expect(serializeSipV2DraftCsv(projection)).toContain(`"'${currency}"`);
  expect(JSON.parse(serializeSipV2DraftJson(projection)).context.currency).toBe(currency);
  expect(serializeSipV2DraftCsv(projection)).toContain('"-1"');
 }
});
