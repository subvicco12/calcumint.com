import {describe,it,expect} from 'vitest';
import {integrate,limitAt} from './numerical-calculus';
import {integralCalculator,limitCalculator} from './catalog-batch-9';
describe('frozen v1 independent diagnostics (observations, not acceptance)',()=>{
 it('observes equal-bound parser and finite-bound bypass',()=>{
  expect(integrate('unsupported(',1,1)).toEqual({value:0,estimatedError:0,intervals:2});
  expect(integrate('x',Infinity,Infinity).value).toBe(0);
  expect(()=>integralCalculator.calculate({expression:'unsupported(',lower:1,upper:1},{})).toThrow();
 });
 it('observes accepted sampled limit zero where continuity gives one',()=>{
  const expression='exp(-x^2/1e-20)';
  expect(limitAt(expression,0)).toEqual({value:0,left:0,right:0});
  const result=limitCalculator.calculate({expression,x:0,direction:'both'},{});
  expect(result.value).toBe(0);
  expect(result.steps.at(-1)).toContain('Certified finite limit');
  // exp(-x²/1e-20) is continuous, so the exact limit at zero is exp(0)=1.
 });
 it('observes missed narrow Gaussian with zero reported error',()=>{
  const result=integrate('exp(-((x-0.1234567)/0.0000001)^2)',0,1);
  expect(result.value).toBe(0);
  expect(result.estimatedError).toBe(0);
  // Gaussian total area is sqrt(pi)*1e-7; endpoints are >10^6 widths away.
  expect(Math.sqrt(Math.PI)*1e-7).toBeGreaterThan(100*1e-9);
 });
});
