import {describe,it,expect} from 'vitest';
import Decimal from 'decimal.js';
import {calculateAdvancedStatistics,ADVANCED_STATISTICS_REVISION} from './advanced';
const raw=(values:string[])=>({mode:'population' as const,encoding:'raw' as const,rows:values.map(value=>({value})),unit:'kg'});
const D=Decimal.clone({precision:100});
function finite(input:unknown){const r=calculateAdvancedStatistics(input);expect(r.status).toBe('finite');if(r.status!=='finite')throw Error(r.message);return r;}
describe('private advanced Decimal50 statistics exact contracts',()=>{
 it('reuses complete type7 and robust summaries while emitting exact rational histogram membership',()=>{
  const r=finite({dataset:raw(['-1','0','1','2']),bins:3});
  expect(r.revision).toBe(ADVANCED_STATISTICS_REVISION);
  expect(r.summary.metrics).toMatchObject({mean:'0.5',variance:'1.25',q1:'-0.25',median:'0.5',q3:'1.25',iqr:'1.5',rawMad:'1',meanAbsoluteDeviation:'1'});
  expect(r.histogram.bins.map(b=>b.count)).toEqual([1,1,2]);
  expect(r.histogram.bins[0].lower).toMatchObject({numerator:'-1',denominator:'1'});
  expect(r.histogram.finalRightClosed).toBe(true);
 });
 it('keeps nonterminating bin edges exact and never bins by rounded display',()=>{
  const r=finite({dataset:raw(['0','0.3333333333333333333333333333333333','1']),bins:3});
  expect(r.histogram.bins[0].upper).toMatchObject({numerator:'1',denominator:'3'});
  expect(r.histogram.bins.map(b=>b.count)).toEqual([2,0,1]);
 });
 it('counts frequency multiplicity without expansion and preserves ignored rows',()=>{
  const r=finite({dataset:{mode:'sample',encoding:'frequency',rows:[{value:'0',frequency:'2'},{value:'3',frequency:'1'},{value:'nonsense',frequency:'0'}]},bins:3});
  expect(r.summary.metrics.variance).toBe('3');expect(r.summary.denominator).toBe(2);
  expect(r.histogram.bins.map(b=>b.count)).toEqual([2,0,1]);
  expect(r.contributions.map(x=>x.weightedSquaredDeviation.decimal)).toEqual(['2','4']);
  expect(r.summary.rows[2].disposition).toBe('zero-frequency');
 });
 it('handles the effective frequency bound without expansion and retains explicit omitted rows',()=>{const r=finite({dataset:{mode:'population',encoding:'frequency',missingPolicy:'omit',rows:[{value:'-1',frequency:'5000000'},{value:'1',frequency:'5000000'},{value:null,frequency:'4'}]}});expect(r.summary.counts).toMatchObject({effectiveN:10000000,omittedRows:1});expect(r.summary.metrics.variance).toBe('1');expect(r.contributions).toHaveLength(2);expect(r.histogram.bins.reduce((s,b)=>s+b.count,0)).toBe(10000000);expect(r.histogram.bins[0].count).toBe(5000000);expect(r.histogram.bins.at(-1)?.count).toBe(5000000);});
 it('contribution rationals reconcile exactly and disclose squared units',()=>{
  const r=finite({dataset:raw(['-1','0','1','2'])});
  expect(r.contributions[0].deviation).toMatchObject({numerator:'-3',denominator:'2',decimal:'-1.5'});
  expect(r.contributions[0].squaredDeviation).toMatchObject({numerator:'9',denominator:'4',decimal:'2.25'});
  expect(r.contributionUnits).toEqual({deviation:'kg',squaredDeviation:'kg^2'});
  expect(r.contributions.reduce((s,x)=>s.plus(x.weightedSquaredDeviation.decimal),new D(0)).toString()).toBe(r.summary.metrics.centeredM2);
 });
 it('constant histogram is one exact bin regardless of requested bin count',()=>{
  const r=finite({dataset:raw(['7','7']),bins:100});expect(r.histogram.bins).toHaveLength(1);expect(r.histogram.bins[0].count).toBe(2);
 });
 it('recomputes affine outputs from exact derived observations and retains base-plus-transform provenance',()=>{
  const r=finite({dataset:raw(['1','3']),analysis:{kind:'affine',scale:'2',shift:'5'}});
  const a=r.analysis;if(!a||a.kind!=='affine')throw Error('wrong analysis');
  expect(a.forward.metrics).toMatchObject({mean:'9',variance:'4',standardDeviation:'2'});expect(a.derivedRows.map(x=>x.value)).toEqual(['7','11']);
  expect(a.provenance).toMatchObject({baseDatasetRetained:true,manualInputCapAppliedToDerived:false,precisionDigits:100});
 });
 it('preserves tiny dispersion after huge exact shift instead of cancellation',()=>{
  const r=finite({dataset:raw(['0','2e-100']),analysis:{kind:'affine',scale:'1',shift:'1e100'}});
  if(!r.analysis||r.analysis.kind!=='affine')throw Error('wrong analysis');expect(r.analysis.forward.metrics.variance).toBe('1e-200');expect(r.analysis.forward.metrics.minimum).not.toBe(r.analysis.forward.metrics.maximum);expect(r.analysis.forward.metrics.range).toBe('0.'+'0'.repeat(99)+'2');
 });
 it('solves irrational target at100digits and independently checks the signed forward residual',()=>{
  const r=finite({dataset:raw(['0','2']),analysis:{kind:'target-scale',metric:'variance',target:'2',shift:'1'}});
  const a=r.analysis;if(!a||a.kind!=='target-scale')throw Error('wrong analysis');
  expect(new D(a.scale).minus(new D(2).sqrt()).abs().lt('1e-90')).toBe(true);
  expect(new D(a.relativeResidual).abs().lte('1e-40')).toBe(true);expect(new D(a.forward.metrics.variance).minus(2).abs().lte('2e-40')).toBe(true);
  expect(a.derivedRows[1].value.length).toBeGreaterThan(34);
 });
 it('signed affine transforms preserve exact dispersion and do not change the nonnegative target branch',()=>{const r=finite({dataset:raw(['1','3']),analysis:{kind:'affine',scale:'-2',shift:'5'}});if(!r.analysis||r.analysis.kind!=='affine')throw Error('wrong analysis');expect(r.analysis.forward.metrics).toMatchObject({mean:'1',variance:'4',standardDeviation:'2'});expect(r.analysis.derivedRows.map(x=>x.value)).toEqual(['3','-1']);});
 it('targetSD and zero targets use the declared nonnegative scale branch',()=>{
  const r=finite({dataset:raw(['0','2']),analysis:{kind:'target-scale',metric:'standardDeviation',target:'3',shift:'0'}});
  if(!r.analysis||r.analysis.kind!=='target-scale')throw Error('wrong analysis');expect(r.analysis.scale).toBe('3');expect(r.analysis.forward.metrics.variance).toBe('9');
  const z=finite({dataset:raw(['0','2']),analysis:{kind:'target-scale',metric:'variance',target:'0',shift:'5'}});
  if(!z.analysis||z.analysis.kind!=='target-scale')throw Error('wrong analysis');expect(z.analysis.scale).toBe('0');expect(z.analysis.forward.metrics.variance).toBe('0');
 });
 it('distinguishes impossible and underdetermined constant-dataset targets without epsilons',()=>{
  expect(calculateAdvancedStatistics({dataset:raw(['2','2']),analysis:{kind:'target-scale',metric:'variance',target:'1',shift:'0'}}).status).toBe('no-solution');
  expect(calculateAdvancedStatistics({dataset:raw(['2','2']),analysis:{kind:'target-scale',metric:'variance',target:'0',shift:'0'}}).status).toBe('underdetermined');
 });
 it('approved affine scale sweep computes all five named branches without changing sample denominator',()=>{const r=finite({dataset:{...raw(['1','2','3']),mode:'sample'},analysis:{kind:'scale-sweep',shift:'10'}});const a=r.analysis;if(!a||a.kind!=='scale-sweep')throw Error('wrong analysis');expect(a.points.map(x=>x.scale)).toEqual(['0','0.5','1','1.5','2']);expect(a.points.map(x=>x.status==='finite'?x.forward.metrics.variance:x.status)).toEqual(['0','0.25','1','2.25','4']);expect(a.points.map(x=>x.status==='finite'?x.forward.metrics.standardDeviation:x.status)).toEqual(['0','0.5','1','1.5','2']);});
 it('scale sweep retains out-of-envelope branches as explicit gaps',()=>{const r=finite({dataset:raw(['5e100','9e100']),analysis:{kind:'scale-sweep',shift:'0'}});if(!r.analysis||r.analysis.kind!=='scale-sweep')throw Error('wrong analysis');expect(r.analysis.points.map(x=>x.status)).toEqual(['finite','finite','finite','precision-unavailable','precision-unavailable']);});
 it('single raw observation sweep recomputes exact fixed-mode points',()=>{
  const r=finite({dataset:raw(['0','2']),analysis:{kind:'observation-sweep',rowIndex:0,minimum:'0',maximum:'2',steps:3}});
  const a=r.analysis;if(!a||a.kind!=='observation-sweep')throw Error('wrong analysis');expect(a.points.map(x=>x.status==='finite'?x.metrics.variance:x.status)).toEqual(['1','0.25','0']);expect(a.points.map(x=>x.value)).toEqual(['0','1','2']);
 });
 it('sensitivity preserves rational replacement provenance and labels out-of-envelope points as gaps',()=>{const r=finite({dataset:raw(['0','1e-100']),analysis:{kind:'observation-sweep',rowIndex:0,minimum:'0',maximum:'1e-100',steps:3}});if(!r.analysis||r.analysis.kind!=='observation-sweep')throw Error('wrong analysis');expect(r.analysis.points.map(x=>x.status)).toEqual(['finite','precision-unavailable','finite']);expect(r.analysis.points[1].exactReplacement.numerator).toBe('1');});
 it('frequency sweep replaces one effective observation and preserves effectiveN',()=>{
  const r=finite({dataset:{mode:'population',encoding:'frequency',rows:[{value:'0',frequency:'2'},{value:'3',frequency:'1'}]},analysis:{kind:'observation-sweep',rowIndex:0,minimum:'0',maximum:'3',steps:2}});
  if(!r.analysis||r.analysis.kind!=='observation-sweep')throw Error('wrong analysis');expect(r.analysis.replacementScope).toBe('single-effective-observation-from-frequency-row');expect(r.analysis.points.map(x=>x.status==='finite'?x.metrics.variance:x.status)).toEqual(['2','2']);
 });
 it.each([
  {bins:0},{bins:101},{analysis:{kind:'affine',scale:'0x10',shift:'0'}},{analysis:{kind:'target-scale',metric:'variance',target:'-1',shift:'0'}},{analysis:{kind:'observation-sweep',rowIndex:2,minimum:'0',maximum:'1',steps:2}},{analysis:{kind:'observation-sweep',rowIndex:0,minimum:'2',maximum:'1',steps:2}},{bogus:true}
 ])('rejects unsupported inputs without successful artifacts %j',extra=>{expect(calculateAdvancedStatistics({dataset:raw(['0','1']),...extra}).status).toBe('domain-error');});
 it('does not evaluate getters or accept unknown dataset fields',()=>{let read=0;const input={get dataset(){read++;return raw(['0','1']);}};expect(calculateAdvancedStatistics(input).status).toBe('domain-error');expect(read).toBe(0);expect(calculateAdvancedStatistics({dataset:{...raw(['0','1']),certified:true}}).status).toBe('domain-error');});
 it('refuses oversized sweep work before emitting partial results',()=>{expect(calculateAdvancedStatistics({dataset:raw(Array.from({length:1001},(_,i)=>String(i))),analysis:{kind:'observation-sweep',rowIndex:0,minimum:'0',maximum:'1',steps:101}}).status).toBe('budget-exhausted');});
 it('rejects raw analytic weights and preserves effectiveN limits',()=>{expect(calculateAdvancedStatistics({dataset:{...raw(['1','2']),rows:[{value:'1',frequency:'2'},{value:'2'}]}}).status).toBe('domain-error');expect(calculateAdvancedStatistics({dataset:{mode:'population',encoding:'frequency',rows:[{value:'0',frequency:'10000001'}]}}).status).toBe('domain-error');});
});
