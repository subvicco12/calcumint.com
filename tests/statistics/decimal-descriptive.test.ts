import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';
import fixtures from './decimal-descriptive-fixtures.json';
import { computeDecimalStatistics, type DecimalStatisticsInput } from '../../src/lib/full-six/statistics/decimal-descriptive';
const Ref = Decimal.clone({ precision: 220 });
const raw = (values: string[], mode: 'sample' | 'population' = 'population'): DecimalStatisticsInput => ({ mode, encoding: 'raw', rows: values.map(value => ({ value })) });
describe('isolated exact decimal descriptive statistics', () => {
  for (const fixture of fixtures.cases) it(`independent 100/200 digit oracle: ${fixture.name} ${fixture.mode}`, () => {
    const result = computeDecimalStatistics(fixture as DecimalStatisticsInput);
    expect(result.status).toBe('finite');
    if (result.status !== 'finite') return;
    for (const [key, value] of Object.entries(fixture.expected)) {
      const actual = new Ref(result.metrics[key as keyof typeof result.metrics]);
      const expected = new Ref(value);
      if (expected.isZero()) expect(actual.toString()).toBe('0');
      else expect(actual.sub(expected).abs().div(expected.abs()).lte('1e-40'), key).toBe(true);
    }
    const v = new Ref(result.metrics.variance), sd = new Ref(result.metrics.standardDeviation);
    expect(v.isZero() ? sd.isZero() : sd.mul(sd).sub(v).abs().div(v).lte('3e-40')).toBe(true);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
  it('retains exact mixed-exponent sum and normalized inputs', () => {
    const result = computeDecimalStatistics(raw(['1e100', '1e-100']));
    if (result.status !== 'finite') throw Error(result.message);
    expect(new Ref(result.metrics.sum).sub('1e100').toString()).toBe('1e-100');
    expect(new Ref(result.rows[1].normalized!).toString()).toBe('1e-100');
  });
  it('counts omissions and zero frequencies without expansion', () => {
    const result = computeDecimalStatistics({ mode: 'sample', encoding: 'frequency', missingPolicy: 'omit', rows: [{value:'1',frequency:'2'}, {value:null,frequency:'3'}, {value:'invalid ignored',frequency:'0'}] });
    expect(result.status).toBe('finite');
    if (result.status === 'finite') { expect(result.counts).toEqual({importedRows:3,validRows:1,omittedRows:1,zeroFrequencyRows:1,effectiveN:2}); expect(result.metrics.variance).toBe('0'); }
  });
  it('frequency equivalence and permutation determinism including type7/MAD/AAD', () => {
    const expanded=computeDecimalStatistics(raw(['-2','-2','1','4','4','4'],'sample'));
    const aggregate=computeDecimalStatistics({mode:'sample',encoding:'frequency',rows:[{value:'4',frequency:'3'},{value:'-2',frequency:'2'},{value:'1',frequency:'1'}]});
    if(expanded.status!=='finite'||aggregate.status!=='finite') throw Error('unexpected error');
    expect(aggregate.metrics).toEqual(expanded.metrics);
    const reversed=computeDecimalStatistics(raw(['4','4','4','1','-2','-2'],'sample'));
    if(reversed.status!=='finite') throw Error('unexpected error');
    expect(reversed.metrics).toEqual(expanded.metrics);
  });
  it('translation, scale and sample/population relationship', () => {
    const run=(v:string[],mode:'population'|'sample'='population')=>{const r=computeDecimalStatistics(raw(v,mode)); if(r.status!=='finite')throw Error(r.message);return r.metrics;};
    const a=run(['1','2','3']), b=run(['1001','1002','1003']), c=run(['-2','-4','-6']), sample=run(['1','2','3'],'sample');
    expect(a.variance).toBe(b.variance);
    expect(new Ref(c.variance).div(a.variance).sub(4).abs().lt('1e-45')).toBe(true);
    expect(new Ref(sample.variance).div(a.variance).sub('1.5').abs().lt('1e-45')).toBe(true);
  });
  for(const value of ['NaN','Infinity','0x10','1/2','1%','1 kg','1e101','1e-101','1.1234567890123456789012345678901234','1'.repeat(129)]) it(`rejects ${value.slice(0,40)}`,()=>expect(computeDecimalStatistics(raw([value])).status).toBe('error'));
  it('normalizes negative zero, insignificant zeros and exponent bounds',()=>{
    const r=computeDecimalStatistics(raw(['-0','000.1000000','1e100','1e-100']));
    expect(r.status).toBe('finite'); if(r.status==='finite'){expect(r.rows[0].normalized).toBe('0');expect(r.rows[0].original).toBe('-0');expect(r.rows[1].normalized).toBe('0.1');}
  });
  it('singleton population succeeds and sample fails',()=>{expect(computeDecimalStatistics(raw(['2'])).status).toBe('finite');expect(computeDecimalStatistics(raw(['2'],'sample'))).toMatchObject({status:'error',code:'cardinality'});});
  it('rejects missing by default and all omitted',()=>{expect(computeDecimalStatistics(raw(['']))).toMatchObject({code:'missing-value'});expect(computeDecimalStatistics({...raw(['']),missingPolicy:'omit'})).toMatchObject({code:'cardinality'});});
  for(const frequency of ['-1','1.5','NaN','10000001','+1','1e2']) it(`rejects frequency ${frequency}`,()=>expect(computeDecimalStatistics({mode:'population',encoding:'frequency',rows:[{value:'1',frequency}]})).toMatchObject({code:'invalid-frequency'}));
  it('enforces stored/effective limits and explicit mode',()=>{
    expect(computeDecimalStatistics(raw(Array(10001).fill('1')))).toMatchObject({code:'cardinality'});
    expect(computeDecimalStatistics({mode:'population',encoding:'frequency',rows:[{value:'1',frequency:'10000000'},{value:'2',frequency:'1'}]})).toMatchObject({code:'cardinality'});
    expect(computeDecimalStatistics({...raw(['1']),mode:undefined} as unknown as DecimalStatisticsInput)).toMatchObject({code:'invalid-input'});
  });
  it('accepts 10000 observations',()=>{const r=computeDecimalStatistics(raw(Array.from({length:10000},(_,i)=>String(i))));expect(r.status).toBe('finite');if(r.status==='finite')expect(r.metrics.mean).toBe('4999.5');});
});
