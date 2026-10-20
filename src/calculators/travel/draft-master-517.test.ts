import { describe, expect, it } from 'vitest';
import { weightedGradeCalculator as c, type GradeInput } from './draft-master-517';
const input: GradeInput = { assessments: [{score:80,weight:4},{score:90,weight:6}], mode:'weighted',missingPolicy:'reject',scale:{minScore:0,maxScore:100,bands:[{minScore:0,label:'Low'},{minScore:85,label:'High'}]}};
const run=(i:GradeInput)=>c.calculate(i,{});
describe('517 explicit grade policy',()=>{
 it('matches independent exact rational 860/10, invariant under weight scaling',()=>{expect(run(input)).toMatchObject({average:86,label:'High',totalWeight:10,usedCount:2,excludedCount:0,zeroWeightCount:0});expect(run({...input,assessments:[{score:80,weight:.4},{score:90,weight:.6}]}).average).toBe(86);});
 it('uses unweighted native scale and returns no invented label',()=>expect(run({...input,mode:'unweighted',scale:{minScore:-10,maxScore:10},assessments:[{score:-4},{score:8}]})).toMatchObject({average:2,label:null,totalWeight:2}));
 it('excludes explicitly missing and zero weighted observations',()=>expect(run({...input,missingPolicy:'exclude',assessments:[{score:null,weight:3},{score:100,weight:0},{score:85,weight:2}]})).toMatchObject({average:85,label:'High',usedCount:1,excludedCount:1,zeroWeightCount:1}));
 it('rejects product underflow instead of silently dropping a nonzero contribution',()=>{for(const assessments of [[{score:0.1,weight:Number.MIN_VALUE}],[{score:0.1,weight:Number.MIN_VALUE},{score:1,weight:1}]])expect(()=>run({...input,scale:{minScore:0,maxScore:1},assessments})).toThrow();});
 it('fails closed when reused mean rounds outside the supplied scale',()=>expect(()=>run({...input,scale:{minScore:0,maxScore:0.1},assessments:[{score:0.1,weight:0.1},{score:0.1,weight:0.1}]})).toThrow());
 it('rejects all-excluded work and overflowing total weights',()=>{expect(()=>run({...input,missingPolicy:'exclude',assessments:[{score:null,weight:1}]})).toThrow();expect(()=>run({...input,assessments:[{score:0,weight:Number.MAX_VALUE},{score:0,weight:Number.MAX_VALUE}]})).toThrow();});
 it('includes the maximum in the top label',()=>expect(run({...input,assessments:[{score:100,weight:1}]}).label).toBe('High'));
 it.each([NaN,Infinity,-Infinity])('rejects nonfinite direct score %s',score=>expect(()=>run({...input,assessments:[{score,weight:1}]})).toThrow());
 it('rejects missing policy, missing work, all zero weights and overflow',()=>{
  for(const bad of [{...input,missingPolicy:undefined},{...input,assessments:[{score:null,weight:1}]},{...input,assessments:[{score:90,weight:0}]},{...input,assessments:[{score:100,weight:Number.MAX_VALUE}]}])expect(()=>run(bad as GradeInput)).toThrow();
 });
 it('rejects ambiguous or invalid scales and weights',()=>{
  for(const scale of [{minScore:0,maxScore:0},{minScore:0,maxScore:100,bands:[{minScore:1,label:'A'}]},{minScore:0,maxScore:100,bands:[{minScore:0,label:'A'},{minScore:50,label:'A'}]},{minScore:0,maxScore:100,bands:[{minScore:0,label:'A'},{minScore:0,label:'B'}]}])expect(()=>run({...input,scale})).toThrow();
  for(const weight of [-1,NaN,Infinity,undefined])expect(()=>run({...input,assessments:[{score:10,weight}]})).toThrow();
  expect(()=>run({...input,mode:'unweighted'})).toThrow();
  expect(()=>run({...input,assessments:[{score:101,weight:1}]})).toThrow();
 });
});
