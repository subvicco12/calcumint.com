import {expect,it} from 'vitest';
import vectors from '../../tests/calculator-first-20261105/witnesses.json';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
it('contains the 21 remaining unblocked candidates without enrolling policy-gated contracts',()=>{expect(vectors).toHaveLength(21);expect(new Set(vectors.map(v=>v.catalogId)).size).toBe(21);expect(vectors.some(v=>[214,217,268].includes(v.catalogId))).toBe(false);});
it.each(vectors)('$catalogId executes independent numerical, boundary and rejection witnesses',v=>{
 const def=calculatorRegistry.getBySlug(v.slug)!;expect([def.id,def.version]).toEqual([v.engineId,v.version]);
 for(const witness of [v.numerical,v.boundary]){
  const out=runCalculator(def,witness.input);const result=(out.output as {result:number}).result;
  expect(Number.isFinite(result)).toBe(true);expect(Math.abs(result-witness.expected)).toBeLessThanOrEqual(Math.max(Number.MIN_VALUE,Math.abs(witness.expected)*1e-14));
  expect(Object.keys(out.output as object)).toEqual(['result']);expect(verifyRegisteredSnapshot({calculatorSlug:v.slug,calculatorVersion:1,input:out.input,output:out.output})).toMatchObject({engineId:v.engineId,engineVersion:1});
 }
 expect(()=>runCalculator(def,v.rejection)).toThrow();
});
