// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import cases from '../../tests/execution-recovery-20261109/technology-cases.json';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {createCalculationSnapshot,serializeCalculationJson} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import type {ScenarioDisplayMetadata} from '@/lib/scenario-display-metadata';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
const state=vi.hoisted(()=>({plan:'free',snapshot:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>|null;scenarioDisplayMetadata?:ScenarioDisplayMetadata;exportMethodology?:string}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:NonNullable<typeof state.snapshot>)=>{state.snapshot=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.snapshot=null;state.plan='free';});
it('migrates the actual technology caller to explicit Final scalar applicability',()=>{
 const view=render(<CalculatorInteractive slug="screen-ppi-calculator"/>);
 expect(view.container.querySelector('.final-calculator-renderer')).not.toBeNull();
 expect(screen.queryByText('Advanced Analysis')).toBeNull();
 expect(screen.queryByText('Goal Solver')).toBeNull();
});
it('refuses lossy typed input before schema validation and denies a saved snapshot',()=>{
 render(<CalculatorInteractive slug="resolution-calculator"/>);
 fireEvent.change(screen.getByLabelText('Width (pixels)'),{target:{value:'9007199254740993'}});
 expect(state.snapshot?.output).toBeNull();
 expect(screen.getByRole('alert')).toBeTruthy();
});
it('associates lossless numeric refusal with the original editable field',()=>{
 render(<CalculatorInteractive slug="resolution-calculator"/>);
 const field=screen.getByLabelText('Width (pixels)');
 fireEvent.change(field,{target:{value:'9007199254740993'}});
 expect(field.getAttribute('aria-invalid')).toBe('true');
 const id=field.getAttribute('aria-describedby');expect(id).toBeTruthy();
 expect(document.getElementById(id!)?.textContent).toContain('without losing entered digits');
 expect((field as HTMLInputElement).value).toBe('9007199254740993');
 fireEvent.change(field,{target:{value:'1920'}});
 expect(field.getAttribute('aria-invalid')).toBeNull();expect(state.snapshot?.output?.value).toBe(2073600);
});
for(const plan of ['free','pro','business'])for(const row of cases.rows){
 it(`${row.masterId}: actual ${plan} caller preserves independent literal, immutable identity, sources and recovery`,()=>{
  state.plan=plan;const view=render(<CalculatorInteractive slug={row.slug}/>);
  const definition=calculatorRegistry.getBySlug(row.slug)!;
  expect(definition.version).toBe(row.version);expect(state.snapshot?.calculatorSlug).toBe(row.slug);expect(state.snapshot?.calculatorVersion).toBe(row.version);
  expect(view.container.querySelector('.final-calculator-renderer')).not.toBeNull();
  for(const label of ['Advanced Analysis','Advanced charts','Sensitivity analysis','Goal Solver'])expect(screen.queryByText(label)).toBeNull();
  const captured=state.snapshot!;expect(captured.output?.value).toBeCloseTo(row.expected,9);
  const immutable=runCalculator(definition,captured.input);expect(captured.output).toEqual(immutable.output);
  expect(screen.getByText('Methodology',{selector:'summary'}).parentElement?.textContent).toContain(definition.formulas[0].expression);
  expect(captured.exportMethodology).toContain(definition.formulas[0].expression);
  for(const source of definition.sources){if(source.url)expect(screen.getByRole('link',{name:source.label}).getAttribute('href')).toBe(source.url);if(source.note)expect(screen.getByText(source.note)).toBeTruthy();}
  const snapshot=createCalculationSnapshot({calculatorSlug:row.slug,calculatorVersion:row.version,input:captured.input,output:captured.output!});
  expect(verifyRegisteredSnapshot(JSON.parse(serializeCalculationJson(snapshot))).snapshot).toEqual(snapshot);
  expect(()=>verifyRegisteredSnapshot({...snapshot,output:{...snapshot.output,value:row.expected+1}})).toThrow();
  const field=screen.getAllByRole('spinbutton')[0] as HTMLInputElement,original=field.value;
  for(const invalid of ['', '0x10', '0.10000000000000001', '1e400']){
   fireEvent.change(field,{target:{value:invalid}});expect(state.snapshot?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(field.getAttribute('aria-invalid')).toBe('true');
  }
  fireEvent.change(field,{target:{value:original}});expect(state.snapshot?.output).toEqual(immutable.output);expect(screen.queryByRole('alert')).toBeNull();
  fireEvent.change(field,{target:{value:'0'}});
  let expected:unknown=null;try{expected=runCalculator(definition,state.snapshot!.input).output;}catch{}
  expect(state.snapshot?.output).toEqual(expected);
  fireEvent.change(field,{target:{value:original}});
  if(plan==='free')expect(screen.queryByRole('table',{name:'Input and output reconciliation'})).toBeNull();
  else expect(screen.getByRole('table',{name:'Input and output reconciliation'}).textContent).toContain(String(row.expected));
 });
}
it('keeps string subnet addresses out of numeric parsing and labels the RAID selector in scenario metadata',()=>{
 const view=render(<CalculatorInteractive slug="ip-subnet-calculator"/>);
 expect(state.snapshot?.input.address).toBe('192.168.1.10');expect(state.snapshot?.output?.value).toBe(256);
 view.rerender(<CalculatorInteractive slug="raid-capacity-calculator"/>);
 expect(state.snapshot?.scenarioDisplayMetadata?.inputs.raidLevel).toEqual({label:'RAID level'});
 fireEvent.change(screen.getByLabelText('RAID level'),{target:{value:'5'}});expect(state.snapshot?.output?.value).toBe(3000);
});
