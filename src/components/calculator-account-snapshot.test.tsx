// @vitest-environment jsdom
import { Blob as NodeBlob } from 'node:buffer';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const state=vi.hoisted(()=>{
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-test-key';
 return {plan:'pro',inserts:[] as Record<string,unknown>[],defer:false,resolve:null as null|((value:unknown)=>void)};
});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>{
 const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:null,count:0}).then(resolve),insert:async(value:Record<string,unknown>)=>{state.inserts.push(value);return {error:null};}};
 return {auth:{getUser:()=>state.defer?new Promise(resolve=>{state.resolve=resolve;}):Promise.resolve({data:{user:{id:'synthetic-user'}}})},from:()=>query};
}}));
import { SensitivityPanel } from './final-analysis-panels';
import { referencePresentations } from '@/calculators/final-framework/reference-presentations';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { FinalResultPresentation } from './final-result-presentation';
import { CalculatorAccountActions } from './calculator-account-actions';
afterEach(()=>{cleanup();state.inserts=[];state.defer=false;state.resolve=null;vi.unstubAllGlobals();vi.restoreAllMocks();});
const identity={calculatorSlug:'sip-calculator',calculatorVersion:1};
it.each(['free','pro','business'])('rejects malformed present result data for every real action on %s and recovers',async plan=>{
 state.plan=plan;const view=render(<CalculatorAccountActions {...identity} input={{rate:1}} output={{nested:[{value:Infinity}]}}/>);
 const save=await screen.findByRole('button',{name:'Save calculation'});expect((save as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole('alert')).toBeTruthy();fireEvent.click(save);expect(state.inserts).toHaveLength(0);
 if(plan!=='free')for(const name of ['Export CSV','Export JSON'])expect((screen.getByRole('button',{name}) as HTMLButtonElement).disabled).toBe(true);
 else expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 view.rerender(<CalculatorAccountActions {...identity} input={{rate:0}} output={{nested:[{value:0}]}}/>);expect((save as HTMLButtonElement).disabled).toBe(false);expect(screen.queryByRole('alert')).toBeNull();
});
it('saves the validated immutable click snapshot even when input/output change during auth await',async()=>{
 state.plan='pro';const input={rate:0.001},output={rows:[{value:123.456789}]};render(<CalculatorAccountActions {...identity} input={input} output={output}/>);
 const save=await screen.findByRole('button',{name:'Save calculation'});state.defer=true;fireEvent.click(save);await waitFor(()=>expect(state.resolve).toBeTruthy());
 input.rate=99;output.rows[0].value=999;state.resolve!({data:{user:{id:'synthetic-user'}}});
 await waitFor(()=>expect(state.inserts).toHaveLength(1));expect(state.inserts[0]).toMatchObject({calculator_slug:identity.calculatorSlug,calculator_version:1,input_data:{rate:0.001},output_data:{rows:[{value:123.456789}]}});
});
it('keeps null output as ordinary disabled state rather than reporting an extra data error',async()=>{
 render(<CalculatorAccountActions {...identity} input={{rate:NaN}} output={null}/>);const save=await screen.findByRole('button',{name:'Save calculation'});expect((save as HTMLButtonElement).disabled).toBe(true);expect(screen.queryByRole('alert')).toBeNull();
});
it('exports identical nested context/analysis precision in JSON and CSV with standard signed-zero JSON semantics',async()=>{
 state.plan='business';let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:synthetic';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<CalculatorAccountActions {...identity} input={{negativeZero:-0,small:0.000000001}} output={{context:{version:1},rows:[{value:123.456789}],zero:0}}/>);
 fireEvent.click(await screen.findByRole('button',{name:'Export JSON'}));const json=JSON.parse(await blob!.text());expect(json.input.small).toBe(0.000000001);expect(json.output.rows[0].value).toBe(123.456789);expect(Object.is(json.input.negativeZero,-0)).toBe(false);
 fireEvent.click(screen.getByRole('button',{name:'Export CSV'}));const csv=await blob!.text();expect(csv).toContain('"negativeZero","-0"');expect(csv).toContain('123.456789');
});

it.each(['free','pro','business'] as const)('aligns both result presentations with account rejection and recovery on %s',async plan=>{
 state.plan=plan;
 for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){
  const fixture=(value:number)=><><Renderer plan={plan} result={{primaryResult:{id:'value',label:'Value',value}}}/><CalculatorAccountActions {...identity} input={{rate:0}} output={{value}}/></>;
  const view=render(fixture(Infinity));const save=await screen.findByRole('button',{name:'Save calculation'});
  expect(screen.getAllByRole('alert')).toHaveLength(2);expect((save as HTMLButtonElement).disabled).toBe(true);expect(document.querySelector('.result-box,.result-hero')).toBeNull();
  if(plan!=='free')for(const name of ['Export CSV','Export JSON'])expect((screen.getByRole('button',{name}) as HTMLButtonElement).disabled).toBe(true);
  view.rerender(fixture(0));expect(screen.queryByRole('alert')).toBeNull();expect((save as HTMLButtonElement).disabled).toBe(false);expect(document.querySelector('.result-box,.result-hero')?.textContent).toContain('0');cleanup();
 }
});

it.each(['free','pro','business'] as const)('isolates invalid analytic presentation from core while rejecting the same nonfinite raw account payload on %s',async plan=>{
 state.plan=plan;const points=[{input:0,value:Infinity}];render(<><FinalCalculatorRenderer result={{primaryResult:{id:'value',label:'Core',value:123}}} plan={plan}/><SensitivityPanel plan={plan} presentation={referencePresentations.sip} resultLabel="Value" points={points}/><CalculatorAccountActions {...identity} input={{rate:0}} output={{value:123,points}}/></>);
 const save=await screen.findByRole('button',{name:'Save calculation'});expect((save as HTMLButtonElement).disabled).toBe(true);expect(document.querySelector('.result-box')?.textContent).toContain('123');expect(screen.getAllByRole('alert')).toHaveLength(plan==='free'?1:2);expect(screen.queryByRole('meter')).toBeNull();
});
it.each(['pro','business'])('exports complete raw analytic arrays despite presentation paging on %s',async plan=>{
 state.plan=plan;let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:synthetic';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 const points=Array.from({length:51},(_,input)=>({input,value:input===50?-1e-12:input}));render(<><SensitivityPanel plan={plan as 'pro'|'business'} presentation={referencePresentations.sip} resultLabel="Value" points={points}/><CalculatorAccountActions {...identity} input={{rate:0}} output={{points}}/></>);
 expect(screen.getAllByRole('meter')).toHaveLength(25);fireEvent.click(screen.getByRole('button',{name:'Next sensitivity page'}));
 fireEvent.click(await screen.findByRole('button',{name:'Export JSON'}));expect(JSON.parse(await blob!.text()).output.points).toEqual(points);
 fireEvent.click(screen.getByRole('button',{name:'Export CSV'}));const csv=await blob!.text();expect(csv).toContain('-1e-12');expect(csv).toContain('50');expect(points).toHaveLength(51);
});
