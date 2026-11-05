/** @vitest-environment jsdom */
import React from 'react';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import vectors from '../../tests/calculator-first-20261105/witnesses.json';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
const state=vi.hoisted(()=>({plan:'free' as 'free'|'pro'|'business'}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
import {SavedCalculationActions} from './saved-calculation-actions';
afterEach(cleanup);
it.each(vectors)('$catalogId verifies recorded history on every plan without upgrading or rewriting it',v=>{
 const def=calculatorRegistry.getBySlug(v.slug)!;const output=runCalculator(def,v.numerical.input).output as Record<string,unknown>;
 const snapshot={calculatorSlug:v.slug,calculatorVersion:v.version,input:v.numerical.input,output};const original=JSON.stringify(snapshot);
 for(const plan of ['free','pro','business'] as const){state.plan=plan;
  const view=render(<SavedCalculationActions snapshot={snapshot}/>);
  expect(screen.queryByText(/Exact engine agreement verified:/)).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Verify exact engine agreement'}));expect(screen.getByText(/Exact engine agreement verified:/).textContent).toContain(v.engineId+' v1');
  expect((screen.getByRole('button',{name:'Export recorded JSON'}) as HTMLButtonElement).disabled).toBe(plan==='free');
  expect(JSON.stringify(snapshot)).toBe(original);view.unmount();
 }
});
it('preserves tampered and unsupported versions as readable historical records without granting verification',()=>{
 const v=vectors[0],snapshot={calculatorSlug:v.slug,calculatorVersion:2,input:v.numerical.input,output:{result:999}};render(<SavedCalculationActions snapshot={snapshot}/>);fireEvent.click(screen.getByRole('button',{name:'Verify exact engine agreement'}));expect(screen.getByRole('alert').textContent).toContain('no current-engine fallback or upgrade');
});
