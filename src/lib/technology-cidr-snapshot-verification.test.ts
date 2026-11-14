import {it,expect} from 'vitest';
import {cidrCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {runCalculator} from '@/calculators/engine';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
const snapshot=(prefixLength:number)=>({calculatorSlug:cidrCalculator.slug,calculatorVersion:1,input:{prefixLength},output:runCalculator(cidrCalculator,{prefixLength}).output});
it('replays every original CIDR v1 prefix through the actual global snapshot reader',()=>{
 for(let prefix=0;prefix<=32;prefix++){
  const source=snapshot(prefix),proof=verifyRegisteredSnapshot(source);
  expect(proof.engineId).toBe('technology.cidr');expect(proof.engineVersion).toBe(1);expect(proof.snapshot).toEqual(source);
 }
});
it('rejects altered CIDR outputs, inputs, versions and envelope extras',()=>{
 const source=snapshot(24);
 for(const bad of [{...source,calculatorVersion:2},{...source,output:{...source.output,value:255}},{...source,input:{prefixLength:24,other:1}},{...source,input:{prefixLength:24.5}},{...source,accepted:true}])expect(()=>verifyRegisteredSnapshot(bad)).toThrow();
});
