import {describe,it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-replay';
import {validatePublication20Result} from './result-trust';
import {conversionPublicationDefinitions} from './conversions';
/** New cohort witnesses are literal expected results derived from unit definitions,
 * not the engine's worked examples. They do not grant applicability/source review. */
const witnesses=[
 [423,-2.5,'yd','mm',-2286],
 [424,3,'ft2','cm2',2787.0912],
 [425,2,'qt_us','ml',1892.705892],
 [427,-40,'c','f',-40],
 [428,3,'knot','m_s',1.5433333333333333333333333333333333],
 [429,2,'bar','pa',200000],
 [430,10,'cal','j',41.84],
 [431,0.002,'mw','w',2000],
 [432,1.5,'week','h',252],
 [433,100,'grad','deg',90],
 [434,2,'MiB','KB',2097.152],
 [437,2,'kg_l','kg_m3',2000],
 [438,250000,'dyn','n',2.5],
 [439,24,'lbf_in','lbf_ft',2],
 [440,0.125,'mhz','hz',125000],
] as const;
const expectedIds=[423,424,425,427,428,429,430,431,432,433,434,437,438,439,440];
const byId=(id:number)=>conversionPublicationDefinitions.find(r=>r.catalogId===id)!;
describe('exact existing-engine converter cohort acceptance',()=>{
 it('has exactly fifteen immutable identities, preserving DRAFT and original engine definitions',()=>{
  expect(conversionPublicationDefinitions.map(x=>x.catalogId)).toEqual(expectedIds);
  for(const x of conversionPublicationDefinitions){expect(x.definition.version).toBe(1);expect(x.definition.reviewStatus).toBe('draft');expect(x.definition.riskClass).toBe('standard');expect(x.fields.map(f=>f.key)).toEqual(['value','fromUnit','toUnit']);expect(x.primaryKey).toBe('result');}
 });
 it.each(witnesses)('executes #%i against an independent literal unit witness',(id,value,fromUnit,toUnit,expected)=>{
  const binding=byId(id),out=runCalculator(binding.definition,{value,fromUnit,toUnit}).output;
  expect(Object.keys(out)).toEqual(['result']);const actual=out.result as number;
  expect(Number.isFinite(actual)).toBe(true);
  expect(Math.abs(actual-expected)).toBeLessThanOrEqual(Math.max(Number.MIN_VALUE*8,Math.abs(expected)*Number.EPSILON*8));
  expect(binding.outputUnit({value,fromUnit,toUnit})).toBe(toUnit);
 });
 it.each([[-300,'c','k',-26.85],[-1,'k','c',-274.15],[-500,'f','k',-22.405555555555555]] as const)('preserves OWN-427 algebraic values below absolute zero: %s %s to %s',(value,fromUnit,toUnit,expected)=>{const entry=byId(427),input={value,fromUnit,toUnit},output=runCalculator(entry.definition,input).output;expect(output.result).toBeCloseTo(expected,12);expect(()=>validatePublication20Result(entry,input,output)).not.toThrow();expect(verifyRegisteredSnapshot({calculatorSlug:entry.definition.slug,calculatorVersion:1,input,output}).snapshot.output).toEqual(output);});
 it('makes every declared dropdown choice valid and zero-preserving for identity conversions',()=>{
  for(const binding of conversionPublicationDefinitions){
   const source=binding.fields.find(x=>x.key==='fromUnit')!,target=binding.fields.find(x=>x.key==='toUnit')!;
   expect(source.options?.length).toBeGreaterThan(1);expect(target.options).toEqual(source.options);expect(new Set(source.options).size).toBe(source.options!.length);
   for(const unit of source.options!){expect(runCalculator(binding.definition,{value:0,fromUnit:unit,toUnit:unit}).output).toEqual({result:0});expect(runCalculator(binding.definition,{value:-2,fromUnit:unit,toUnit:unit}).output).toEqual({result:-2});}
  }
 });
 it('rejects cross-family/unrecognized dropdown codes rather than converting by labels',()=>{
  for(const binding of conversionPublicationDefinitions){const unit=binding.fields.find(x=>x.key==='fromUnit')!.options![0];expect(()=>runCalculator(binding.definition,{value:1,fromUnit:unit,toUnit:'unsupported-unit'})).toThrow();expect(()=>runCalculator(binding.definition,{value:NaN,fromUnit:unit,toUnit:unit})).toThrow();}
 });
 it('records the frozen-v1 linear underflow hazard without changing historical formulas',()=>{
  expect(runCalculator(byId(423).definition,{value:Number.MIN_VALUE,fromUnit:'m',toUnit:'km'}).output).toEqual({result:0});
  // Caller must refuse a nonzero linear input lost to zero. Affine temperature
  // zero remains legitimate and must not be rejected by that homogeneous rule.
  expect(runCalculator(byId(427).definition,{value:-273.15,fromUnit:'c',toUnit:'k'}).output).toEqual({result:0});
 });
});
