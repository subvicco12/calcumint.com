import {describe,it,expect} from 'vitest';
import {analyzePairMath,reversePairMath,type PairMathId} from '../../src/lib/completion-wave-20261113/math-analysis';
import {calculateBasicMath} from '../../src/lib/calculator-factory/cohorts/basic-math';

describe('seven bounded math profiles through actual immutable v1 engines',()=>{
 it.each([
  [208,{old:-80,next:-100},'next',-25],
  [209,{value:-240,percent:12.5},'value',-270],
  [210,{value:240,percent:150},'percent',-120],
  [211,{a:7,b:4},'a',1.75],
  [212,{a:3,b:8},'a',0.375],
  [215,{numerator:1,denominator:3},'numerator',1/3],
  [216,{a:-10,b:30},'a',10],
 ] as [PairMathId,Record<string,number>,string,number][])('captures %i and retains raw output', (id,input,field,expected)=>{
  const result=analyzePairMath(id,input,field,[input[field]]);
  expect(result.snapshot.output.result).toBe(expected);
  expect(result.snapshot).toEqual(calculateBasicMath(id,input).snapshot);
  expect(result.points).toEqual([{x:input[field],y:expected}]);
  expect(result.steps.at(-1)?.value).toBe(expected);
  expect(result.precision).toContain('approximate');
 });
 it('keeps both percentage-change old-value branches when target exceeds 100%',()=>{
  const solved=reversePairMath(208,{old:1,next:6},'old',200);
  expect(solved.status).toBe('finite');
  expect(solved.candidates).toEqual([{value:2,forwardValue:200},{value:-6,forwardValue:200}]);
 });
 it('reverses signed negative-baseline change with abs(original)',()=>{
  expect(reversePairMath(208,{old:-100,next:-50},'next',-25).candidates).toEqual([{value:-125,forwardValue:-25}]);
  expect(reversePairMath(208,{old:-100,next:-50},'old',50).candidates).toEqual([{value:-100,forwardValue:50}]);
 });
 it.each([
  [209,{value:-100,percent:20},'value',-120,-100],
  [209,{value:-100,percent:20},'percent',-120,20],
  [210,{value:100,percent:150},'value',-50,100],
  [210,{value:100,percent:150},'percent',-50,150],
  [211,{a:7,b:4},'a',2,8],
  [211,{a:7,b:4},'b',2,3.5],
  [212,{a:3,b:8},'b',0.5,6],
  [215,{numerator:3,denominator:8},'denominator',0.5,6],
  [216,{a:10,b:30},'a',25,20],
  [216,{a:10,b:30},'b',25,40],
 ] as [PairMathId,Record<string,number>,string,number,number][])('reverses %i %s %s', (id,input,field,target,value)=>{
  expect(reversePairMath(id,input,field,target).candidates).toEqual([{value,forwardValue:target}]);
 });
 it('reports degenerate equations without inventing a unique answer',()=>{
  expect(reversePairMath(208,{old:10,next:0},'old',-100).status).toBe('nonunique');
  expect(reversePairMath(210,{value:5,percent:100},'value',0).status).toBe('nonunique');
  expect(reversePairMath(209,{value:0,percent:20},'percent',0).status).toBe('nonunique');
  expect(reversePairMath(211,{a:0,b:1},'b',0).status).toBe('nonunique');
  expect(reversePairMath(211,{a:1,b:1},'b',0).status).toBe('none');
  expect(reversePairMath(209,{value:10,percent:20},'percent',5).status).toBe('none');
 });
 it('avoids intermediate inverse overflow for two-number mean',()=>{
  const value=Number.MAX_VALUE;
  expect(reversePairMath(216,{a:value,b:value},'a',value).candidates).toEqual([{value,forwardValue:value}]);
  expect(analyzePairMath(216,{a:value,b:-value},'a').snapshot.output.result).toBe(0);
 });
 it('retains opposite-extreme percentage change and refuses invalid sample gaps',()=>{
  expect(analyzePairMath(208,{old:Number.MAX_VALUE,next:-Number.MAX_VALUE},'old').snapshot.output.result).toBe(-200);
  const points=analyzePairMath(215,{numerator:1,denominator:3},'denominator',[0,3,Number.MAX_VALUE]).points;
  expect(points[0]).toHaveProperty('error');expect(points[1]).toEqual({x:3,y:1/3});expect(points[2]).toHaveProperty('error');
 });
 it('enforces capture boundaries, explicit fields and bounded finite samples',()=>{
  expect(()=>analyzePairMath(211,{a:1,b:0},'a')).toThrow();
  expect(()=>analyzePairMath(209,{value:Number.MAX_VALUE,percent:100},'value')).toThrow();
  expect(()=>analyzePairMath(216,{a:10,b:20,c:30},'a')).toThrow();
  expect(()=>analyzePairMath(211,{a:1,b:2},'unknown')).toThrow();
  expect(()=>analyzePairMath(211,{a:1,b:2},'a',[NaN])).toThrow();
  expect(()=>analyzePairMath(211,{a:1,b:2},'a',Array(102).fill(1))).toThrow();
  expect(()=>reversePairMath(211,{a:1,b:2},'a',Number.MIN_VALUE)).toThrow();
 });
 it('retains deliberately bounded quotient and two-number scope',()=>{
  expect(analyzePairMath(211,{a:12,b:18},'a').scope).toContain('does not simplify');
  expect(analyzePairMath(212,{a:3,b:8},'a').scope).toContain('does not solve');
  expect(analyzePairMath(216,{a:1,b:2},'a').scope).toContain('exactly two');
 });
});
