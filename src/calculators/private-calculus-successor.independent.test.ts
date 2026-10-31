import {describe,it,expect} from 'vitest';
import {exportPrivateCalculus,importPrivateCalculus} from './private-calculus-successor';
const run=(input:unknown)=>exportPrivateCalculus(input).calculation.output.value;
describe('independent private calculus successor',()=>{
 it.each([['x^3',2,12],['x^-2',2,-.25],['x^0',0,0],['2^x',0,Math.LN2],['sin(x)',0,1],['ln(x)',1,1],['sqrt(x)',4,.25],['abs(x)',-2,-1]])('analytic derivative %s',(expression,x,value)=>expect(run({operation:'derivative',expression,x})).toBeCloseTo(value,14));
 it('evaluates narrow continuous peak instead of finite samples',()=>expect(run({operation:'limit',expression:'exp(-x^2/1e-20)',x:0})).toBe(1));
 it.each(['abs(x)','sqrt(x)','1/x','ln(x)','tan(pi/2+x)'])('rejects unsupported derivative domain %s',expression=>expect(()=>run({operation:'derivative',expression,x:0})).toThrow());
 it.each(['sqrt(x)','1/x','ln(x)','(x^2-1)/(x-1)'])('rejects unsupported limit domain %s',expression=>expect(()=>run({operation:'limit',expression,x:expression.includes('x-1')?1:0})).toThrow());
 it.each([['x^2',0,3,9],['(x+1)^2',-1,2,9],['x^32',0,1,1/33],['x/2+3',2,-2,-12]])('polynomial integral %s',(expression,lower,upper,value)=>expect(run({operation:'integral',expression,lower,upper})).toBeCloseTo(value,14));
 it.each(['unsupported(','exp(-x^2)','x^33','1/x'])('validates integral before equal endpoints %s',expression=>expect(()=>run({operation:'integral',expression,lower:0,upper:0})).toThrow());
 it('replays and binds identity/output/method',()=>{const s=exportPrivateCalculus({operation:'derivative',expression:'x^2',x:2});expect(importPrivateCalculus(s)).toEqual(s);const forged=structuredClone(s);forged.calculation.output.value=5;expect(()=>importPrivateCalculus(forged)).toThrow();});
 it.each(['derivative','limit','integral'] as const)('rejects underflow throughout %s',operation=>{
  for(const expression of ['1e-400','1e-200*1e-200','1e-300/1e100','(1e-200)^2',...(operation==='integral'?[]:['exp(-1000)'])])expect(()=>run(operation==='integral'?{operation,expression,lower:0,upper:1}:{operation,expression,x:1})).toThrow();
  expect(run(operation==='integral'?{operation,expression:'0*x',lower:0,upper:1}:{operation,expression:'0*x',x:1})).toBe(0);
 });
 it.each(['derivative','limit','integral'] as const)('rejects complete addend erasure in %s',operation=>{
  expect(()=>run(operation==='integral'?{operation,expression:'1e16+1-1e16',lower:0,upper:1}:{operation,expression:'1e16+x-1e16',x:1})).toThrow();
  expect(run(operation==='integral'?{operation,expression:'x-x',lower:0,upper:1}:{operation,expression:'x-x',x:1})).toBe(0);
 });
 it('rejects destructive intermediate underflow despite representable final derivative',()=>{
  // Exact derivative is 1e-200; first product 1e-400 silently disappears in binary64.
  expect(()=>run({operation:'derivative',expression:'1e-200*1e-200*1e200*x',x:1})).toThrow();
 });
});
