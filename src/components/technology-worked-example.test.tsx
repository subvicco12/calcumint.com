// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent,within} from '@testing-library/react';
import cases from '../../tests/execution-recovery-20261109/technology-cases.json';
import hazards from '../../docs/cohort22-closure-20261109/technology/hazard-witnesses.json';
import {calculatorRegistry} from '@/calculators/registry';
const state=vi.hoisted(()=>({plan:'free',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:{value:number}|null;exportMethodology?:string}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.snapshot=null;state.plan='free';});
for(const plan of ['free','pro','business'])for(const row of cases.rows)it(`#${row.masterId} ${plan} exposes its exact-engine worked example and recovers a refused draft`,()=>{
 state.plan=plan;const view=render(<CalculatorInteractive slug={row.slug}/>);
 const panel=screen.getByRole('region',{name:'Worked example'});
 expect(within(panel).getByRole('table',{name:'Worked example inputs'})).toBeTruthy();
 expect(within(panel).getByText(String(row.expected),{exact:true})).toBeTruthy();
 expect(within(panel).getByText('Source references')).toBeTruthy();
 const definition=calculatorRegistry.getBySlug(row.slug)!;expect(screen.getByText('Methodology',{selector:'summary'}).parentElement?.textContent).toContain('Technical calculation revision: '+definition.id+'@'+row.version);expect(state.snapshot?.exportMethodology).toContain('Technical calculation revision: '+definition.id+'@'+row.version);
 for(const source of calculatorRegistry.getBySlug(row.slug)!.sources){if(source.url)expect(within(panel).getByRole('link',{name:source.label}).getAttribute('href')).toBe(source.url);if(source.note)expect(within(panel).getByText(source.note)).toBeTruthy();}
 if(plan==='free')expect(screen.queryByRole('table',{name:'Input and output reconciliation'})).toBeNull();else expect(screen.getByRole('table',{name:'Input and output reconciliation'})).toBeTruthy();
 const field=view.container.querySelector('input')!;fireEvent.change(field,{target:{value:''}});expect(state.snapshot?.output).toBeNull();
 fireEvent.click(within(panel).getByRole('button',{name:'Use worked example'}));
 expect(state.snapshot?.calculatorVersion).toBe(row.version);expect(state.snapshot?.output?.value).toBeCloseTo(row.expected,10);
 expect(screen.queryByRole('alert')).toBeNull();
});
it('loads immutable storage example units instead of borrowing live selector state',()=>{
 render(<CalculatorInteractive slug='storage-conversion-calculator'/>);
 fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'KiB'}});fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'TiB'}});
 fireEvent.click(screen.getByRole('button',{name:'Use worked example'}));
 expect(state.snapshot?.input).toEqual({value:1,fromUnit:'GiB',toUnit:'MiB'});expect(state.snapshot?.output?.value).toBe(1024);
});
it('restores the explicit RAID example level and retains a detached earlier snapshot',()=>{
 render(<CalculatorInteractive slug='raid-capacity-calculator'/>);fireEvent.change(screen.getByLabelText('RAID level'),{target:{value:'5'}});
 const retained=structuredClone(state.snapshot);fireEvent.click(screen.getByRole('button',{name:'Use worked example'}));
 expect(state.snapshot?.input.raidLevel).toBe('10');expect(retained?.input.raidLevel).toBe('5');expect(retained?.input).not.toEqual(state.snapshot?.input);
});
it('does not offer a fresh saved PPI result when squared intermediates underflow',()=>{
 render(<CalculatorInteractive slug='screen-ppi-calculator'/>);
 for(const label of ['Width (pixels)','Height (pixels)','Diagonal (in)'])fireEvent.change(screen.getByLabelText(label),{target:{value:'1e-200'}});
 expect(state.snapshot?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
});

for(const plan of ['free','pro','business'])for(const [index,witness]of hazards.cases.entries())it(`#${witness.masterId} ${plan} refuses fresh unstable witness${index} without rewriting the engine`,()=>{
 state.plan=plan;const row=cases.rows.find(row=>row.masterId===witness.masterId)!;const view=render(<CalculatorInteractive slug={row.slug}/>);
 for(const [key,value]of Object.entries(witness.input)){const field=view.container.querySelector(`[data-technology-field="${key}"]`)!;expect(field).toBeTruthy();fireEvent.change(field,{target:{value:String(value)}});}
 expect(state.snapshot?.output).toBeNull();expect(screen.getByRole('alert').textContent).toMatch(/precision|range/i);
 fireEvent.click(screen.getByRole('button',{name:'Use worked example'}));expect(state.snapshot?.output?.value).toBeCloseTo(row.expected,10);
});
