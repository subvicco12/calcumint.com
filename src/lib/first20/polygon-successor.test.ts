import {describe,it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {calculatorRegistry} from '@/calculators/registry';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {polygonAreaSuccessor,createPolygonSnapshot,replayPolygonSnapshot} from './polygon-successor';
const legacy=launchDefinitions.find(d=>d.id==='launch-polygon-area-calculator')!;
describe('isolated regular-polygon numerical successor',()=>{
 it('retains exact predecessor schema and leaves the global registry on v1',()=>{expect(polygonAreaSuccessor.inputSchema).toBe(legacy.inputSchema);expect(polygonAreaSuccessor.reviewStatus).toBe('draft');expect(calculatorRegistry.getBySlug(legacy.slug)?.version).toBe(1);});
 it('rejects identity/schema tampering but accepts JSON key-order changes',()=>{const snap=createPolygonSnapshot({sides:3,side:1e154},2);expect(replayPolygonSnapshot(JSON.stringify({output:snap.output,input:{side:1e154,sides:3},calculatorVersion:2,calculatorSlug:snap.calculatorSlug}))).toEqual(snap);expect(()=>replayPolygonSnapshot(JSON.stringify({...snap,calculatorSlug:'square-calculator'}))).toThrow('identity');expect(()=>replayPolygonSnapshot(JSON.stringify({...snap,certified:true}))).toThrow('identity');expect(()=>replayPolygonSnapshot(JSON.stringify({...snap,input:{...snap.input,extra:1}}))).toThrow('replay');});

 it('reproduces v1 false overflow and stages a finite v2 result without rewriting v1',()=>{
  const input={sides:3,side:1e154};expect(()=>runCalculator(legacy,input)).toThrow(/finite range/);
  const current=runCalculator(polygonAreaSuccessor,input);
  expect(current.version).toBe(2);expect(current.output.result/4.330127018922193e307).toBeCloseTo(1,14);
  expect(()=>runCalculator(legacy,input)).toThrow(/finite range/);
 });
 it('retains ordinary accepted v1 outputs bit-for-bit and exact version replay',()=>{
  for(const sides of [3,4,5,6,8,12,1000,Number.MAX_SAFE_INTEGER])for(const side of [1e-9,4,1e100]){
   const input={sides,side},old=runCalculator(legacy,input);expect(runCalculator(polygonAreaSuccessor,input).output).toEqual(old.output);
  }
  for(const version of [1,2]){const snapshot=createPolygonSnapshot({sides:6,side:4},version);expect(replayPolygonSnapshot(JSON.stringify(snapshot))).toEqual(snapshot);}
 });
 it('keeps original invalid/subnormal and truly nonfinite rejection; no latest fallback',()=>{
  for(const input of [{sides:2,side:1},{sides:3.5,side:1},{sides:Infinity,side:1},{sides:3,side:Number.MIN_VALUE},{sides:3,side:0},{sides:3,side:1e308}])expect(()=>runCalculator(polygonAreaSuccessor,input)).toThrow();
  const snap=createPolygonSnapshot({sides:3,side:1e154},2);expect(()=>replayPolygonSnapshot(JSON.stringify({...snap,calculatorVersion:99}))).toThrow(/version/);
  expect(()=>replayPolygonSnapshot(JSON.stringify({...snap,output:{result:0}}))).toThrow(/replay/);
 });
});
