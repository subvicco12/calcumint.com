// @vitest-environment jsdom
import { cleanup,render,screen } from '@testing-library/react';
import { afterEach,expect,it } from 'vitest';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { FinalResultPresentation } from './final-result-presentation';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
const core:StructuredCalculationResult={primaryResult:{id:'value',label:'Result',value:100},methodology:'Existing methodology',sources:[{label:'Existing source'}],warnings:['Existing warning']};
afterEach(cleanup);
it.each(['free','pro','business'] as const)('fails visibly for nonfinite core values in both renderers on %s and recovers',plan=>{
 for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){
  for(const value of [NaN,Infinity,-Infinity]){
   const view=render(<Renderer result={{...core,primaryResult:{...core.primaryResult,value}}} plan={plan}/>);
   expect(screen.getByRole('alert').textContent).toMatch(/unavailable|invalid/);expect(document.querySelector('.result-box,.result-hero')).toBeNull();
   view.rerender(<Renderer result={{...core,primaryResult:{...core.primaryResult,value:0}}} plan={plan}/>);expect(screen.queryByRole('alert')).toBeNull();expect(document.querySelector('.result-box,.result-hero')?.textContent).toContain('0');cleanup();
  }
 }
});
it('rejects malformed primary/metrics without a render exception',()=>{
 for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation])for(const result of [{},{...core,primaryResult:null},{...core,metrics:{}},{...core,metrics:[{id:'metric',label:'Metric',value:Infinity}]}]){
  render(<Renderer result={result as StructuredCalculationResult}/>);expect(screen.getByRole('alert')).toBeTruthy();cleanup();
 }
});
it('contains optional invalid visuals while retaining valid core, warnings and trust in both renderers',()=>{
 const result={...core,composition:[{id:'composition',label:'Part',value:Infinity}],ranges:[{id:'range',label:'Range',max:Infinity}],series:[{id:'series',label:'Series',points:[{x:NaN,y:1}]}]};
 for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){
  render(<Renderer result={result}/>);expect(document.querySelector('.result-box,.result-hero')?.textContent).toContain('100');expect(screen.getAllByRole('alert')).toHaveLength(3);
  expect(screen.queryByText('Trend')).toBeNull();expect(screen.queryByText('Reference range')).toBeNull();expect(screen.queryByText('Overview')).toBeNull();
  expect(screen.getByText('Existing methodology')).toBeTruthy();expect(screen.getByText('Existing source')).toBeTruthy();expect(screen.getByText('Existing warning')).toBeTruthy();cleanup();
 }
});
