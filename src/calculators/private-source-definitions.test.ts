import {describe,it,expect} from 'vitest';
import {privateSourceDefinitions as definitions, privateSourceBindings} from './private-source-definitions';
import {runCalculator} from './engine';
import cases from '../../tests/next-runtime/source-scope-cases.json';
function matches(actual:unknown, expected:unknown){
 if(typeof expected==='number'){expect(typeof actual).toBe('number');expect(Number.isFinite(actual)).toBe(true);expect(actual).toBeCloseTo(expected,10);}
 else if(expected && typeof expected==='object'){
  expect(actual).not.toBeNull();expect(typeof actual).toBe('object');
  expect(Object.keys(actual as object).sort()).toEqual(Object.keys(expected).sort());
  for(const [key,value] of Object.entries(expected))matches((actual as Record<string,unknown>)[key],value);
 }else expect(actual).toEqual(expected);
}
const get=(id:number)=>definitions.find(x=>x.masterId===id)!.definition;
describe('bounded private source profiles',()=>{
 it('binds exactly seven draft identities without owner approval metadata',()=>{
  expect(definitions.map(x=>x.masterId)).toEqual([81,85,86,126,469,488,516]);
  expect(privateSourceBindings).toHaveLength(7);
  for(const {masterId,definition:d} of definitions){expect(d.id).toBe(`private.source.${masterId}`);expect(d.version).toBe(1);expect(d.reviewStatus).toBe('draft');expect(d).not.toHaveProperty('ownerModel');}
 });
 for(const c of cases) for(const e of c.examples) it(`${c.masterId}: ${e.label}`,()=>{
  const input=structuredClone(e.input),before=JSON.stringify(input);
  matches(runCalculator(get(c.masterId),input).output,e.expected);
  expect(JSON.stringify(input)).toBe(before);
 });
 it('keeps independently authored fixture identities and examples aligned',()=>{expect(cases).toEqual(definitions.map(({masterId,definition:d})=>({masterId,slug:d.slug,title:d.title,examples:d.examples})));});
 it('executes every definition example',()=>{for(const {definition:d} of definitions)for(const e of d.examples)matches(runCalculator(d,e.input).output,e.expected);});
 it('rejects unknown fields and nonfinite values without mutating input',()=>{
  for(const c of cases){const d=get(c.masterId),input={...c.examples[0].input,unexpected:true};const before=JSON.stringify(input);expect(()=>runCalculator(d,input)).toThrow();expect(JSON.stringify(input)).toBe(before);}
  for(const n of [NaN,Infinity,-Infinity,-1])expect(()=>runCalculator(get(81),{currency:'USD',period:'period',initial:n,timing:'end',steps:[]})).toThrow();
 });
 it('rejects unsupported policy/boundary/rate/scale and overflow',()=>{
  const first=(id:number)=>structuredClone(cases.find(c=>c.masterId===id)!.examples[0].input) as Record<string,unknown>;
  for(const [id,patch] of [[126,{sourceProfile:'CURRENT'}],[126,{rateFraction:.2}],[126,{currency:'USD'}],[488,{auxiliaryBoundary:'inside-SCOP'}],[488,{baselineEfficiency:0}],[488,{scop:0}],[516,{policyId:''}],[516,{policyVersion:''}],[516,{maxGradePoints:0}],[516,{rows:[{points:5,credits:1}]}],[516,{rows:[{points:0,credits:0}]}],[469,{paymentCount:0}],[81,{steps:[{rate:-1,deposit:0}]}],[81,{steps:[{rate:0,deposit:-1}]}],[85,{steps:[{rate:0,withdrawal:-1}]}],[86,{timing:undefined}],[81,{initial:1e308,steps:[{rate:10,deposit:0}]}],[469,{adjustedCapitalizedCost:1e308,totalRentCharge:1e308}]] as const)expect(()=>runCalculator(get(id),{...first(id),...patch})).toThrow();
 });
 it('preserves definition examples across successful and rejected calls',()=>{for(const {definition:d} of definitions){const before=JSON.stringify(d.examples);runCalculator(d,d.examples[0].input);expect(()=>runCalculator(d,{...d.examples[0].input as object,unknown:true})).toThrow();expect(JSON.stringify(d.examples)).toBe(before);}});
 it('rejects nonfinite and negative component inputs',()=>{for(const [id,field] of [[126,'amount'],[469,'residual'],[488,'auxiliaryKWh']] as const){for(const value of [-1,NaN,Infinity,-Infinity]){const input=cases.find(c=>c.masterId===id)!.examples[0].input;expect(()=>runCalculator(get(id),{...input,[field]:value})).toThrow();}}for(const value of [-1,NaN,Infinity])expect(()=>runCalculator(get(516),{policyId:'p',policyVersion:'v',maxGradePoints:4,rows:[{points:value,credits:1}]})).toThrow();});
 it('bounds arrays and strings',()=>{expect(()=>runCalculator(get(81),{currency:'X'.repeat(65),period:'x',initial:0,timing:'end',steps:[]})).toThrow();expect(()=>runCalculator(get(81),{currency:'USD',period:'x',initial:0,timing:'end',steps:Array.from({length:10001},()=>({rate:0,deposit:0}))})).toThrow();});
});
