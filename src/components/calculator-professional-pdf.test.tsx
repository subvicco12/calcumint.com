// @vitest-environment jsdom
import {Blob as NodeBlob} from 'node:buffer';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic';return {plan:'pro'};});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>{const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null}),then:(resolve:(v:unknown)=>unknown)=>Promise.resolve({data:null,count:0}).then(resolve)};return {auth:{getUser:async()=>({data:{user:{id:'synthetic'}}})},from:()=>query};}}));
import {CalculatorAccountActions} from './calculator-account-actions';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
const props={calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:-0.00001,run:2},output:{slope:-0.000005}};
it.each(['pro','business'])('exports the same version-bound signed snapshot as a genuine PDF on %s',async plan=>{
 state.plan=plan;let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(b:NodeBlob)=>{blob=b;return 'blob:pdf';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});fireEvent.click(screen.getByRole('button',{name:'Export PDF'}));expect(blob?.type).toBe('application/pdf');expect((await blob!.text()).startsWith('%PDF-')).toBe(true);expect(await blob!.text()).toContain('-0.000005');
});
it('preserves Free restrictions and rejects malformed results until recovery',async()=>{
 state.plan='free';const view=render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});expect(screen.queryByRole('button',{name:'Export PDF'})).toBeNull();view.unmount();state.plan='pro';const next=render(<CalculatorAccountActions {...props} output={{slope:Infinity}}/>);await screen.findByRole('button',{name:'Save calculation'});expect((screen.getByRole('button',{name:'Export PDF'}) as HTMLButtonElement).disabled).toBe(true);next.rerender(<CalculatorAccountActions {...props}/>);expect((screen.getByRole('button',{name:'Export PDF'}) as HTMLButtonElement).disabled).toBe(false);
});
it('reports download failures and retries without losing valid results',async()=>{
 state.plan='pro';vi.stubGlobal('Blob',NodeBlob);const create=vi.fn().mockImplementationOnce(()=>{throw Error('synthetic failure');}).mockReturnValue('blob:retry');vi.stubGlobal('URL',{createObjectURL:create,revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});fireEvent.click(screen.getByRole('button',{name:'Export PDF'}));expect(screen.getByRole('alert').textContent).toContain('Could not download');fireEvent.click(screen.getByRole('button',{name:'Export PDF'}));expect(screen.queryByRole('alert')).toBeNull();expect((screen.getByRole('button',{name:'Save calculation'}) as HTMLButtonElement).disabled).toBe(false);
});

import {CalculatorInteractive} from './calculator-interactive';
import {DraftCalculatorPreview} from './draft-calculator-preview';
import {draftPreviewDefinitions} from '@/calculators/final-framework/draft-preview-catalog';
it.each(['loan-emi-calculator','sip-calculator','compound-interest-calculator','mortgage-payment','bmi-calculator','break-even-calculator'])('exports Reference Six path %s without changing displayed results',async slug=>{
 state.plan='pro';let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(b:NodeBlob)=>{blob=b;return 'blob:reference';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<CalculatorInteractive slug={slug}/>);await screen.findByRole('button',{name:'Save calculation'});fireEvent.click(screen.getByRole('button',{name:'Export PDF'}));expect(screen.queryByRole('alert')).toBeNull();expect((await blob!.text()).startsWith('%PDF-')).toBe(true);expect(await blob!.text()).toContain(slug);
});
it.each(draftPreviewDefinitions)('exports private DRAFT master $masterId from its immutable capture',async definition=>{
 let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(b:NodeBlob)=>{blob=b;return 'blob:draft';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<DraftCalculatorPreview initialMasterId={definition.masterId} ownerScope="synthetic-reviewer"/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect((screen.getByRole('button',{name:'Export calculation PDF'}) as HTMLButtonElement).disabled).toBe(true);fireEvent.change(screen.getByLabelText('Preview plan'),{target:{value:'pro'}});fireEvent.click(screen.getByRole('button',{name:'Export calculation PDF'}));expect(screen.queryByRole('alert')).toBeNull();expect((await blob!.text()).startsWith('%PDF-')).toBe(true);expect(await blob!.text()).toContain(definition.slug);expect(await blob!.text()).toContain('DRAFT');if(definition.masterId===518)expect(await blob!.text()).toContain('No medical');
});
it.each([{slug:'bmi-calculator',field:'Weight (kg)',invalid:'0'},{slug:'break-even-calculator',field:'Fixed costs',invalid:'-1'}])('retains captured scenarios during invalid-input recovery for $slug',async({slug,field,invalid})=>{
 state.plan='pro';render(<CalculatorInteractive slug={slug}/>);await screen.findByRole('button',{name:'Save calculation'});fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));expect(screen.getByText(/Complete snapshot A/)).toBeTruthy();fireEvent.change(screen.getByLabelText(field),{target:{value:invalid}});expect(screen.getByText(/Complete snapshot A/)).toBeTruthy();expect((screen.getByRole('button',{name:'Export PDF'}) as HTMLButtonElement).disabled).toBe(true);
});
