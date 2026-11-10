// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup,fireEvent} from '@testing-library/react';
const state=vi.hoisted(()=>({plan:'business',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:{value:number}|null}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.plan='business';state.snapshot=null;});
const rows=[['storage-conversion-calculator',1024,'2048'],['aspect-ratio-calculator',1920/1080,'2'],['resolution-calculator',2073600,'2160'],['dpi-calculator',300,'600'],['power-supply-calculator',600,'1200'],['website-bandwidth-calculator',200,'400'],['cloud-storage-cost-calculator',20,'40'],['cloud-data-transfer-cost-calculator',45,'90']] as const;
for(const [slug,value,target] of rows)it(slug+' integrates live analysis and goal refusal/recovery without altering versioned snapshots',()=>{
 render(<CalculatorInteractive slug={slug}/>);const before=structuredClone(state.snapshot);expect(before?.output?.value).toBe(value);
 const analysis=screen.getByRole('region',{name:'Analysis'});expect(within(analysis).getByRole('table',{name:'Relationship samples'})).toBeTruthy();
 const targetForm=within(analysis).getByRole('form',{name:'Target calculation'});
 const targetInput=within(targetForm).getByRole('textbox',{name:/^Target result \(/});fireEvent.change(targetInput,{target:{value:target}});fireEvent.submit(within(analysis).getByRole('form',{name:'Target calculation'}));expect(within(analysis).getByRole('status').textContent).toContain('Forward verified result: '+target);expect(state.snapshot).toEqual(before);
 fireEvent.change(targetInput,{target:{value:'invalid'}});fireEvent.submit(within(analysis).getByRole('form',{name:'Target calculation'}));expect(within(analysis).getByRole('alert')).toBeTruthy();expect(state.snapshot).toEqual(before);
 const field=document.querySelector('input[data-technology-field]')!;fireEvent.change(field,{target:{value:''}});expect(state.snapshot?.output).toBeNull();expect(screen.queryByRole('form',{name:'Target calculation'})).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Use worked example'}));expect(state.snapshot).toEqual(before);expect(screen.getByRole('form',{name:'Target calculation'})).toBeTruthy();
});
it('refuses a subnormal primary input with a normal product and recovers without saving it',()=>{render(<CalculatorInteractive slug='resolution-calculator'/>);fireEvent.change(screen.getByLabelText('Height (pixels)'),{target:{value:'1e100'}});fireEvent.change(screen.getByLabelText('Width (pixels)'),{target:{value:'1e-320'}});expect(state.snapshot?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('region',{name:'Analysis'})).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Use worked example'}));expect(state.snapshot?.output?.value).toBe(2073600);});
