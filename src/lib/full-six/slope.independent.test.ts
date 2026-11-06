import {describe,it,expect} from 'vitest';
import {calculateFullSlope,solveFullSlope} from './slope';

// Independently generated with Python fractions.Fraction and decimal localcontext(prec=100).
// These oracle strings are constants, never production output serialized as expectations.
const witnesses=[
 {"input": {"mode": "two_points", "x1": "0.1", "y1": "0.2", "x2": "0.4", "y2": "0.8"}, "slope": "2", "intercept": "0"},
 {"input": {"mode": "two_points", "x1": "1", "y1": "7", "x2": "4", "y2": "8"}, "slope": "0.3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333", "intercept": "6.666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666667"},
 {"input": {"mode": "two_points", "x1": "-3.125", "y1": "2.25", "x2": "6.875", "y2": "-7.75"}, "slope": "-1", "intercept": "-0.875"},
 {"input": {"mode": "two_points", "x1": "1000000", "y1": "-1000000", "x2": "1002000", "y2": "-997000"}, "slope": "1.5", "intercept": "-2500000"},
 {"input": {"mode": "two_points", "x1": "0", "y1": "0", "x2": "0.000001", "y2": "0.000007"}, "slope": "7", "intercept": "0"},
 {"input": {"mode": "two_points", "x1": "-500000000000", "y1": "-500000000000", "x2": "500000000000", "y2": "500000000000"}, "slope": "1", "intercept": "0"},
 {"input": {"mode": "two_points", "x1": "1.25", "y1": "-0.375", "x2": "3.5", "y2": "4.125"}, "slope": "2", "intercept": "-2.875"},] as const;
describe('Slope independent exact-rational100-digit witnesses',()=>{
 for(const [i,w]of witnesses.entries())it(`preserves rational witness ${i+1} and reversed endpoint orientation`,()=>{
  const expected=Number(w.slope),b=Number(w.intercept);
  for(const input of [w.input,{mode:'two_points',x1:w.input.x2,y1:w.input.y2,x2:w.input.x1,y2:w.input.y1}]){
   const actual=calculateFullSlope(input);expect(actual.status).toBe('finite');
   expect(Math.abs(actual.values.slope-expected)).toBeLessThanOrEqual(1e-11*Math.abs(expected));
   if(b===0)expect(actual.values.yIntercept).toBe(0);else expect(Math.abs(actual.values.yIntercept-b)).toBeLessThanOrEqual(1e-11*Math.abs(b));
  }
 });
 it('preserves exact mathematical zero instead of a negative-zero result',()=>{
  const actual=calculateFullSlope({mode:'slope_intercept',m:'-0',b:'-0'});expect(Object.is(actual.values.slope,-0)).toBe(false);expect(actual.inputs.m.negativeZero).toBe(true);
 });
 it('rejects object behavior without executing accessors',()=>{
  let read=0;const input={mode:'slope_intercept',get m(){read++;return '2';},b:'1'};
  expect(calculateFullSlope(input).status).toBe('domain-error');expect(read).toBe(0);
 });
 it('retains line inverse zero and infinite-solution branches without selecting arbitrary members',()=>{
  const horizontal={mode:'slope_intercept',m:'0',b:'0'};
  expect(solveFullSlope({target:'line_x',line:horizontal,y:'0'}).status).toBe('underdetermined');
  expect(solveFullSlope({target:'line_x',line:horizontal,y:'1'}).status).toBe('no-solution');
  expect(solveFullSlope({target:'line_y',line:horizontal,x:'8'}).value).toBe(0);
 });
});
