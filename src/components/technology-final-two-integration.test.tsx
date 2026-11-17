// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup,fireEvent} from '@testing-library/react';
const state=vi.hoisted(()=>({plan:'business',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:{value:number}|null;exportMethodology?:string}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.plan='business';state.snapshot=null;});
for(const plan of ['free','pro','business'])for(const [slug,value] of [['ip-subnet-calculator',256],['screen-ppi-calculator',141.21199808219862]]as const)it(`${plan} ${slug} keeps registered headline/capture while exposing bounded analysis`,()=>{
 state.plan=plan;render(<CalculatorInteractive slug={slug}/>);const before=structuredClone(state.snapshot);expect(before?.output?.value).toBe(value);expect(before?.calculatorVersion).toBe(1);const analysis=screen.getByRole('region',{name:'Analysis'});expect(within(analysis).getByRole('table',{name:'Relationship samples'})).toBeTruthy();expect(within(analysis).getByRole('img')).toBeTruthy();if(plan==='free')expect(within(analysis).queryByRole('button',{name:'Solve target'})).toBeNull();else expect(within(analysis).getByRole('button',{name:'Solve target'})).toBeTruthy();expect(state.snapshot).toEqual(before);
});
it('strict IPv4 text remains editable, invalid output cannot reach capture and valid spellings recover',()=>{
 render(<CalculatorInteractive slug='ip-subnet-calculator'/>);const address=screen.getByLabelText('IPv4 address');expect(address.getAttribute('inputmode')).toBe('text');fireEvent.change(address,{target:{value:'256.0.0.1'}});expect(state.snapshot?.output).toBeNull();fireEvent.change(address,{target:{value:'192.168.001.010'}});expect(state.snapshot?.input.address).toBe('192.168.001.010');expect(state.snapshot?.output?.value).toBe(256);
});
it('clears a verified goal when current input changes and refuses an unattainable discrete target',()=>{
 render(<CalculatorInteractive slug='ip-subnet-calculator'/>);const analysis=screen.getByRole('region',{name:'Analysis'}),target=within(analysis).getByLabelText('Target result (addresses)');fireEvent.change(target,{target:{value:'256'}});fireEvent.click(within(analysis).getByRole('button',{name:'Solve target'}));expect(within(analysis).getByRole('status').textContent).toContain('24');fireEvent.change(screen.getByLabelText('IPv4 address'),{target:{value:'10.0.0.1'}});const current=screen.getByRole('region',{name:'Analysis'});expect((within(current).getByLabelText('Target result (addresses)') as HTMLInputElement).value).toBe('');expect(within(current).queryByRole('status')).toBeNull();fireEvent.change(within(current).getByLabelText('Target result (addresses)'),{target:{value:'300'}});fireEvent.click(within(current).getByRole('button',{name:'Solve target'}));expect(within(current).getByRole('alert').textContent).toContain('No supported integer prefix');
});
