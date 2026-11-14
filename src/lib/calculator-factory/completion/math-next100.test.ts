import {describe,it,expect} from 'vitest';
import {calculateNext100Math as calc,graphNext100Math as graph,reverseNext100Math as reverse,next100MathContracts,type Next100MathId} from './math-next100';
const vectors:[Next100MathId,Record<string,number>,number][]=[
 [213,{numerator:-3,denominator:4},-.75], [221,{x:-125},-5],
 [222,{base:-2,exp:3},-8], [223,{base:3,exponent:4},81],
 [224,{x:8,base:2},3], [225,{x:-4},-.25], [226,{a:-17,b:5},-2],
 [227,{a:12,b:18},36], [228,{a:48,b:18},6], [229,{number:97},97],
 [230,{value:-1.25,decimals:1},-1.2], [231,{coefficient:3.2,exponent:6},3200000],
 [234,{observed:98,actual:100},2],
];
describe('wave100 bounded math delivery',()=>{
 it('binds thirteen distinct version-one identities',()=>{
  expect(next100MathContracts.map(x=>x.catalogId)).toEqual(vectors.map(x=>x[0]));
  expect(new Set(next100MathContracts.map(x=>x.engineId)).size).toBe(13);
 });
 it.each(vectors)('captures independent arithmetic vector %s',(id,input,expected)=>{
  const result=calc(id,input);expect(result.snapshot.output.result).toBe(expected);
  expect(result.snapshot.input).toEqual(input);expect(Object.isFrozen(result.snapshot.input)).toBe(true);
  const x=input[next100MathContracts.find(x=>x.catalogId===id)!.solveFor];
  expect(graph(id,input,[x])[0]).toEqual({x,y:expected});
  const inverse=reverse(id,input,expected,[x,x,NaN]);
  expect(inverse.exhaustive).toBe(false);expect(inverse.witnesses).toHaveLength(1);
 });
 it('retains separate power and exponent field identities and rejects extras',()=>{
  expect(()=>calc(222,{base:2,exponent:3})).toThrow();
  expect(()=>calc(223,{base:2,exp:3})).toThrow();
  expect(()=>calc(213,{numerator:3,denominator:4,extra:1})).toThrow();
 });
 it('refuses undefined, overflowing, lost-zero and subnormal capture',()=>{
  for(const [id,input] of [
   [213,{numerator:1,denominator:0}], [222,{base:-2,exp:.5}],
   [223,{base:1e200,exponent:2}], [224,{x:2,base:1}],
   [225,{x:0}], [226,{a:1,b:0}], [227,{a:9007199254740991,b:2}],
   [228,{a:9007199254740992,b:2}], [229,{number:1000000001}],
   [230,{value:1,decimals:-1}], [231,{coefficient:1,exponent:-324}],
   [234,{observed:1,actual:0}], [213,{numerator:1,denominator:1e308}],
   [221,{x:Number.MIN_VALUE}],
  ] as [Next100MathId,Record<string,number>][])expect(()=>calc(id,input)).toThrow();
 });
 it('preserves signed remainder, smallest factor and intentional rounded zero',()=>{
  expect(calc(226,{a:-17,b:5}).snapshot.output.result).toBe(-2);
  expect(calc(229,{number:12}).snapshot.output.result).toBe(2);
  expect(calc(230,{value:.04,decimals:1}).snapshot.output.result).toBe(0);
  expect(calc(224,{x:1,base:10}).snapshot.output.result).toBe(0);
 });
 it('finds multiple discrete witnesses without claiming all solutions',()=>{
  expect(reverse(228,{a:12,b:18},6,[6,12,24,30,5]).witnesses.map(x=>x.value)).toEqual([6,12,24,30]);
  expect(reverse(226,{a:17,b:5},2,[2,7,12,17,-3]).witnesses.map(x=>x.value)).toEqual([2,7,12,17]);
  expect(reverse(230,{value:1.23,decimals:1},1.2,[1.16,1.24,1.26]).witnesses.map(x=>x.value)).toEqual([1.16,1.24]);
 });
 it('uses exact output matching for inverse witnesses',()=>{
  expect(reverse(213,{numerator:1,denominator:1},1,[1+Number.EPSILON]).witnesses).toEqual([]);
  expect(reverse(221,{x:8},2,[27]).witnesses).toEqual([]);
 });
 it('bounds analysis and reports graph gaps',()=>{
  const points=graph(225,{x:1},[-1,0,1,Infinity]);
  expect(points[0]).toEqual({x:-1,y:-1});expect(points[1]).toHaveProperty('error');
  expect(points[3]).toHaveProperty('error');
  expect(()=>graph(221,{x:8},Array(102).fill(1))).toThrow();
  expect(()=>reverse(221,{x:8},2,[])).toThrow();
  expect(()=>reverse(221,{x:8},Infinity,[8])).toThrow();
 });
});
