// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup,fireEvent} from '@testing-library/react';
const state=vi.hoisted(()=>({plan:'business',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:{value:number}|null;exportMethodology?:string}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {TechnologyFinalTwoAnalysis} from './technology-final-two-analysis';
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

it('connects refused targets to the existing help and clears refusal on editing',()=>{
 render(<TechnologyFinalTwoAnalysis id='technology.ip-subnet' input={{address:'192.0.2.0',prefixLength:24}} plan='pro'/>);
 const target=screen.getByRole('textbox',{name:'Target result (addresses)'});
 const submit=()=>fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));
 fireEvent.change(target,{target:{value:'300'}});
 submit();
 expect(target.getAttribute('aria-invalid')).toBe('true');
 const help=target.getAttribute('aria-describedby')!.split(' ').map(id=>document.getElementById(id));
 expect(help).toContain(screen.getByRole('alert'));
 expect(help.some(el=>el?.textContent?.startsWith('Only supported targets'))).toBe(true);
 fireEvent.change(target,{target:{value:'256'}});
 expect(target.hasAttribute('aria-invalid')).toBe(false);
 expect(screen.queryByRole('alert')).toBeNull();
 submit();
 expect(screen.getByRole('status').textContent).toContain('24');
});

it('recovers mixed IPv4 batch rows accessibly while preserving the scalar snapshot',()=>{
 render(<CalculatorInteractive slug='ip-subnet-calculator'/>);
 const before=structuredClone(state.snapshot);
 const batch=screen.getByRole('region',{name:'Bounded batch calculation'});
 const rows=within(batch).getByLabelText('Batch IPv4 address and prefix rows');
 fireEvent.change(rows,{target:{value:'192.0.2.7,24\n2001:db8::1,24'}});
 fireEvent.click(within(batch).getByRole('button',{name:'Evaluate rows'}));
 expect(rows.getAttribute('aria-invalid')).toBe('true');
 expect(document.getElementById(rows.getAttribute('aria-describedby')!)).toBe(within(batch).getByRole('alert'));
 expect(within(batch).getByRole('button',{name:'Download batch JSON'}).hasAttribute('disabled')).toBe(true);
 expect(within(batch).getByRole('table',{name:'Batch results'}).textContent).toContain('256');
 fireEvent.change(rows,{target:{value:'192.0.2.7,24'}});
 fireEvent.click(within(batch).getByRole('button',{name:'Evaluate rows'}));
 expect(rows.hasAttribute('aria-invalid')).toBe(false);
 expect(within(batch).getByRole('button',{name:'Download batch JSON'}).hasAttribute('disabled')).toBe(false);
 expect(state.snapshot).toEqual(before);
 fireEvent.change(screen.getByLabelText('IPv4 address'),{target:{value:'192.0.2.8'}});
 expect((within(batch).getByLabelText('Batch IPv4 address and prefix rows') as HTMLTextAreaElement).value).toBe('192.0.2.7,24');
});
