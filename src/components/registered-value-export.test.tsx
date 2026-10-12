// @vitest-environment jsdom
import {Blob as NodeBlob} from 'node:buffer';import {cleanup,fireEvent,render,screen} from '@testing-library/react';import {afterEach,expect,it,vi} from 'vitest';
import {calculatorRegistry} from '@/calculators/registry';import {runCalculator} from '@/calculators/engine';
const state=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-key';return {plan:'free'};});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>{const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null,error:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:null,count:0,error:null}).then(resolve)};return {auth:{getUser:async()=>({data:{user:{id:'synthetic-user'}},error:null})},from:()=>query};}}));
import {CalculatorInteractive} from './calculator-interactive';afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();});
const cases=[{slug:'bandwidth-calculator',input:{dataMegabytes:100,timeSeconds:10}},{slug:'bmr-calculator',input:{weightKg:70,heightCm:175,ageYears:30,sex:'male'}},{slug:'asphalt-calculator',input:{lengthMeters:10,widthMeters:5,depthMeters:.05,densityKgPerCubicMeter:2400,wastePercent:5}}];
it.each(['free','pro','business'])('keeps actual generic trust UI and complete raw JSON/CSV unchanged on %s',async plan=>{
 state.plan=plan;
 for(const reference of cases){let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:synthetic';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});render(<CalculatorInteractive slug={reference.slug}/>);const definition=calculatorRegistry.getBySlug(reference.slug)!;const expected=runCalculator(definition,reference.input).output;
  expect(screen.getByText('Sources',{selector:'summary'})).toBeTruthy();await screen.findByRole('button',{name:'Save calculation'});
  if(plan==='free'){expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();expect(screen.queryByRole('button',{name:'Export CSV'})).toBeNull();}else{
   fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));const json=JSON.parse(await blob!.text());expect(json).toMatchObject({calculatorSlug:definition.slug,calculatorVersion:definition.version,input:reference.input,output:expected});expect(json.output).toEqual(expected);
   fireEvent.click(screen.getByRole('button',{name:'Export CSV'}));const csv=await blob!.text();for(const [key,value] of Object.entries(expected as Record<string,unknown>)){const encoded=typeof value==='object'?JSON.stringify(value):String(value);expect(csv).toContain(`"${key}","${encoded.replaceAll('"','""')}"`);}
  }
  cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();
 }
});
