/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
const state=vi.hoisted(()=>{
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-test-key';
 return {plan:'pro'};
});
vi.mock('@/components/use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>{
 const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:null,count:0}).then(resolve)};
 return {auth:{getUser:async()=>({data:{user:{id:'synthetic-user'}}})},from:()=>query};
}}));
import {CalculatorInteractive} from '@/components/calculator-interactive';
afterEach(cleanup);
it.each(['free','pro','business'])('disables actual registered save and entitled exports for lossy drafts and restores on %s',async plan=>{
 state.plan=plan;
 render(<CalculatorInteractive slug="percentage-of-value-calculator"/>);
 const save=await screen.findByRole('button',{name:'Save calculation'}) as HTMLButtonElement;
 expect(save.disabled).toBe(false);
 const names=plan==='free'?['Save calculation']:['Save calculation','Export CSV','Export JSON'];
 for(const value of ['9007199254740993','1e-400','0.10000000000000001']){
  fireEvent.change(screen.getByLabelText('Value'),{target:{value}});
  for(const name of names)expect((screen.getByRole('button',{name}) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByLabelText('Value') as HTMLInputElement).value).toBe(value);
  fireEvent.change(screen.getByLabelText('Value'),{target:{value:'0'}});
  for(const name of names)expect((screen.getByRole('button',{name}) as HTMLButtonElement).disabled).toBe(false);
 }
});
