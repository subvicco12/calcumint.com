/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {validateScenarioDisplayMetadata} from '@/lib/scenario-display-metadata';
const state=vi.hoisted(()=>({plan:'free',props:null as null|Record<string,unknown>}));
vi.mock('@/components/use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/components/calculator-account-actions',()=>({CalculatorAccountActions:(props:Record<string,unknown>)=>{state.props=props;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
const six=['graphing-calculator','function-plotter-2d','volume-calculator','slope-calculator','standard-deviation-calculator','variance-calculator'];
it.each(six)('%s binds exact engine snapshot, scenario labels and plan-invariant inputs/results',slug=>{
 let original:unknown;
 for(const plan of ['free','pro','business']){
  state.plan=plan;render(<CalculatorInteractive slug={slug}/>);
  const p=state.props!;expect(p.output).not.toBeNull();expect(p.scenarioDisplayMetadata).toBeDefined();
  const snapshot=createCalculationSnapshot({calculatorSlug:slug,calculatorVersion:p.calculatorVersion as number,input:p.input as Record<string,unknown>,output:p.output as Record<string,unknown>});
  expect(validateScenarioDisplayMetadata(p.scenarioDisplayMetadata,snapshot)).toEqual(p.scenarioDisplayMetadata);
  const artifact={input:p.input,output:p.output,version:p.calculatorVersion};
  if(original)expect(artifact).toEqual(original);else original=structuredClone(artifact);
  expect(p.calculatorVersion).toBe(slug==='slope-calculator'?2:1);cleanup();
 }
});
it.each(six.slice(0,2))('%s rejects a missing bound and preserves an explicit zero',slug=>{
 render(<CalculatorInteractive slug={slug}/>);const field=screen.getByLabelText('Minimum x');
 fireEvent.change(field,{target:{value:''}});expect(state.props!.output).toBeNull();
 fireEvent.change(field,{target:{value:'0'}});expect(state.props!.output).not.toBeNull();
});
it('separates the two known reciprocal sample segments instead of drawing across omitted zero',()=>{
 const {container}=render(<CalculatorInteractive slug='graphing-calculator'/>);
 fireEvent.change(screen.getByLabelText('f(x)'),{target:{value:'1/x'}});
 expect((state.props!.output as {points:unknown[]}).points).toHaveLength(80);
 expect(container.querySelectorAll('path[data-sampled-segment]')).toHaveLength(2);
 expect(container.querySelectorAll('svg[aria-label="Function curve across the selected x range"] line')).toHaveLength(2);
 expect(screen.getByRole('table',{name:'Engine sampled function values'})).toBeTruthy();
});
it('exposes existing slope deltas and prism dimensions without changing engine outputs',()=>{
 render(<CalculatorInteractive slug='slope-calculator'/>);expect(screen.getByText('Δx')).toBeTruthy();expect(screen.getByText('Δy')).toBeTruthy();cleanup();
 render(<CalculatorInteractive slug='volume-calculator'/>);expect(screen.getAllByText(/cubic units/).length).toBeGreaterThan(0);expect(state.props!.output).toMatchObject({volume:24,surfaceArea:52});
});
it('keeps finite huge graph samples renderable without overflowing the chart scale',()=>{
 const {container}=render(<CalculatorInteractive slug='graphing-calculator'/>);
 fireEvent.change(screen.getByLabelText('f(x)'),{target:{value:'1e308*x'}});
 expect(state.props!.output).not.toBeNull();
 const paths=[...container.querySelectorAll('path[data-sampled-segment]')];expect(paths.length).toBeGreaterThan(0);
 for(const path of paths)expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
});
it('keeps raw results available if a valid narrow range collapses binary64 sample positions',()=>{
 const {container}=render(<CalculatorInteractive slug='graphing-calculator'/>);
 fireEvent.change(screen.getByLabelText('Minimum x'),{target:{value:'999999999.9999999'}});
 fireEvent.change(screen.getByLabelText('Maximum x'),{target:{value:'1000000000'}});
 expect(state.props!.output).not.toBeNull();expect(container.querySelectorAll('path[data-sampled-segment]')).toHaveLength(0);
 expect(screen.getByText(/sample positions cannot be distinguished/)).toBeTruthy();
});
