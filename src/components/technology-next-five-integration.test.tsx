// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup,fireEvent} from '@testing-library/react';
const state=vi.hoisted(()=>({plan:'business',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:{value:number}|null;exportMethodology?:string}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.plan='business';state.snapshot=null;});
it('CIDR refuses lossy entered prefixes and recovers without changing immutable revision',()=>{
 render(<CalculatorInteractive slug='cidr-calculator'/>);
 expect(state.snapshot?.output?.value).toBe(256);
 const field=screen.getByLabelText('CIDR prefix');
 fireEvent.change(field,{target:{value:'24.000000000000001'}});
 expect(state.snapshot?.output).toBeNull();
 expect(field.getAttribute('aria-invalid')).toBe('true');
 expect(document.getElementById(field.getAttribute('aria-describedby')!)?.textContent).toContain('without losing entered digits');
 fireEvent.change(field,{target:{value:'0'}});
 expect(state.snapshot?.output?.value).toBe(4294967296);
 expect(state.snapshot?.calculatorVersion).toBe(1);
});
for(const plan of ['free','pro','business'])for(const [slug,value] of [['cidr-calculator',256],['raid-capacity-calculator',2000],['battery-runtime-calculator',4.5],['ups-runtime-calculator',1.8],['password-entropy-calculator',104.8734216268422]] as const)it(`${plan} ${slug} integrates original-engine relationship samples without changing the captured calculation`,()=>{
 state.plan=plan;render(<CalculatorInteractive slug={slug}/>);
 const before=structuredClone(state.snapshot);expect(before?.output?.value).toBeCloseTo(value,10);
 const analysis=screen.getByRole('region',{name:'Analysis'});
 expect(within(analysis).getByRole('table',{name:'Relationship samples'})).toBeTruthy();
 if(plan==='free')expect(within(analysis).queryByRole('button',{name:'Solve target'})).toBeNull();
 else expect(within(analysis).getByRole('button',{name:'Solve target'})).toBeTruthy();
 expect(state.snapshot).toEqual(before);
});
