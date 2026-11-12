import {describe,it,expect} from 'vitest';
import {completeScalarMath,reverseScalarMath} from './math';

describe('scalar completion, independently specified integer witnesses',()=>{
 it('retains all real square preimages and unique cube/root preimages',()=>{
  expect(reverseScalarMath(218,144)).toEqual([-12,12]);
  expect(reverseScalarMath(218,0)).toEqual([0]);
  expect(reverseScalarMath(219,-27)).toEqual([-3]);
  expect(reverseScalarMath(220,15)).toEqual([225]);
 });
 it('does not silently accept impossible targets or lost-nonzero inverses',()=>{
  for(const id of [218,220] as const) expect(()=>reverseScalarMath(id,-1)).toThrow();
  expect(()=>reverseScalarMath(220,1e-200)).toThrow();
  expect(()=>reverseScalarMath(220,Number.MAX_VALUE)).toThrow();
 });
 it('provides actual-engine graph points and inspectable arithmetic steps',()=>{
  const result=completeScalarMath(218,-12,[-2,-1,0,1,2]);
  expect(result.steps.map(s=>s.value)).toEqual([-12,144]);
  expect(result.graph.map(p=>p.y)).toEqual([4,1,0,1,4]);
  expect(result.snapshot.output.result).toBe(144);
  expect(result.captureRevision).toBe('private.basic-math-capture.normal-output.20261112.1');
 });
 it('bounds graphs and reports individual domain/refusal points',()=>{
  expect(()=>completeScalarMath(218,1,Array(102).fill(1))).toThrow();
  const points=completeScalarMath(220,4,[-1,0,4]).graph;
  expect(points[0].error).toBeTruthy();
  expect(points.slice(1).map(p=>p.y)).toEqual([0,2]);
 });
 it('reconciles rounded inverse targets at explicit relative tolerance',()=>{
  for(const id of [218,219,220] as const)for(const target of [0.1,1,2,10,1e100]){
   for(const candidate of reverseScalarMath(id,target)){
    const actual=completeScalarMath(id,candidate).snapshot.output.result as number;
    expect(Math.abs(actual-target)/Math.max(Math.abs(actual),Math.abs(target))).toBeLessThanOrEqual(8*Number.EPSILON);
   }
  }
 });
 it('agrees with independent integer multiplication and reverse identities',()=>{
  for(let n=-40;n<=40;n++){
   const square=Number(BigInt(n)**2n),cube=Number(BigInt(n)**3n);
   expect(completeScalarMath(218,n).snapshot.output.result).toBe(square);
   expect(completeScalarMath(219,n).snapshot.output.result).toBe(cube);
   expect(completeScalarMath(220,square).snapshot.output.result).toBe(Math.abs(n));
   expect(reverseScalarMath(219,cube)[0]).toBeCloseTo(n,12);
  }
 });
});
