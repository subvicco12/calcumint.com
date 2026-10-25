import {expect,it} from 'vitest';
import {calculatorRegistry} from '../registry';
import {runCalculator} from '../engine';
import {goldenMismatch} from '../launch-certification';
import {parabolaExample,paraboloidExample} from './graph-example-fixtures';
it.each(['graphing-calculator','function-plotter-2d','function-plotter-3d'])('uses a complete analytic grid for %s',slug=>{
 const d=calculatorRegistry.getBySlug(slug)!;
 const expected=slug==='function-plotter-3d'?paraboloidExample:parabolaExample;
 expect(runCalculator(d,d.examples[0].input).output).toEqual(expected);
 expect(d.examples[0].expected).toEqual(expected);
 expect(goldenMismatch(runCalculator(d,d.examples[0].input).output,d.examples[0].expected)).toBeNull();
});
it('keeps the three numerical diagnostic fixtures explicitly unresolved',()=>{
 for(const slug of ['derivative-calculator','integral-calculator','limit-calculator']){
  const d=calculatorRegistry.getBySlug(slug)!;
  expect(goldenMismatch(runCalculator(d,d.examples[0].input).output,d.examples[0].expected)).not.toBeNull();
 }
});
