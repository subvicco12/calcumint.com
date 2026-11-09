// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {FinalResultPresentation} from './final-result-presentation';
import {networkPublicationDefinitions} from '@/lib/publication20/network';
import type {ScenarioDisplayMetadata} from '@/lib/scenario-display-metadata';
const state=vi.hoisted(()=>({plan:'free',account:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>|null;scenarioDisplayMetadata?:ScenarioDisplayMetadata}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(props:NonNullable<typeof state.account>)=>{state.account=props;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.account=null;state.plan='free';});

describe('existing technology caller workflow regressions',()=>{
 it('resets hidden invalid fields when navigating from bandwidth to storage',()=>{
  const view=render(<CalculatorInteractive slug="bandwidth-calculator"/>);
  fireEvent.change(screen.getByLabelText('Time (s)'),{target:{value:''}});
  expect(state.account?.output).toBeNull();
  view.rerender(<CalculatorInteractive slug="storage-conversion-calculator"/>);
  expect(state.account?.output?.value).toBe(1024);
  expect((screen.getByLabelText('Value') as HTMLInputElement).value).toBe('1');
  expect(screen.queryByRole('alert')).toBeNull();
 });
 it('restores defaults when the second numeric field changes meaning',()=>{
  const view=render(<CalculatorInteractive slug="bandwidth-calculator"/>);
  fireEvent.change(screen.getByLabelText('Data (MB)'),{target:{value:'123'}});
  fireEvent.change(screen.getByLabelText('Time (s)'),{target:{value:'7'}});
  view.rerender(<CalculatorInteractive slug="download-time-calculator"/>);
  expect(state.account?.input).toEqual({dataMegabytes:100,bandwidthMbps:80});
  expect(state.account?.output?.value).toBe(10);
 });
 for(const entry of networkPublicationDefinitions){
  it(`${entry.catalogId} carries declared input units into account/scenario metadata`,()=>{
   render(<CalculatorInteractive slug={entry.definition.slug}/>);
   for(const field of entry.fields){
    expect(state.account?.scenarioDisplayMetadata?.inputs[field.key]).toEqual({label:field.label,...(field.kind==='number'?{unit:field.key==='value'?state.account?.input.fromUnit:field.unit}:{})});
   }
  });
  it.each(['free','pro','business'] as const)(`${entry.catalogId} uses the current %s plan for result capabilities`,plan=>{
   state.plan=plan;
   const current=render(<CalculatorInteractive slug={entry.definition.slug}/>);
   expect(state.account?.output).not.toBeNull();
   expect(current.container.querySelector('.final-calculator-renderer')).not.toBeNull();
   // Historical component compatibility is a separate subject, never substituted for the current caller.
   const legacy=render(<FinalResultPresentation plan={plan} result={{primaryResult:{id:'value',label:'Legacy compatibility',value:state.account!.output!.value as number}}}/>);
   for(const label of ['Advanced charts','Scenario comparison','Sensitivity analysis','Goal Solver']){
    expect(within(current.container).queryByText(label)).toBeNull();
    if(plan==='free')expect(within(legacy.container).getByText(label)).toBeTruthy();
    else expect(within(legacy.container).queryByText(label)).toBeNull();
   }
  });
  it.each(['free','pro','business'] as const)(`${entry.catalogId} reconciles recorded inputs and output on %s`,plan=>{
   state.plan=plan;
   render(<CalculatorInteractive slug={entry.definition.slug}/>);
   const table=screen.queryByRole('table',{name:'Input and output reconciliation'});
   if(plan==='free'){expect(table).toBeNull();return;}
   expect(table).toBeTruthy();
   for(const field of entry.fields){
    const row=within(table!).getByRole('rowheader',{name:field.label}).closest('tr')!;
    expect(within(row).getAllByRole('cell').map(cell=>cell.textContent)).toEqual([String(state.account?.input[field.key]),field.kind==='number'?(field.key==='value'?String(state.account?.input.fromUnit):field.unit??''):'']);
   }
   const resultRow=within(table!).getByRole('rowheader',{name:'Stored result'}).closest('tr')!;
   expect(within(resultRow).getAllByRole('cell').map(cell=>cell.textContent)).toEqual([String(state.account?.output?.value),entry.outputUnit(state.account!.input)]);
   expect(screen.getByText(entry.scope)).toBeTruthy();
   expect(screen.getByText('Methodology',{selector:'summary'}).parentElement?.textContent).toContain(entry.definition.formulas[0].expression);
   const legacy=render(<FinalResultPresentation plan={plan} result={{primaryResult:{id:'value',label:'Legacy compatibility',value:state.account!.output!.value as number},methodology:entry.definition.formulas[0].expression}}/>);
   expect(within(legacy.container).getByText('Result methodology',{selector:'summary'}).parentElement?.textContent).toContain(entry.definition.formulas[0].expression);
   fireEvent.change(screen.getByLabelText(entry.fields[0].label),{target:{value:''}});
   expect(screen.queryByRole('table',{name:'Input and output reconciliation'})).toBeNull();
  });
 }
 it('binds selected storage source and target units to account/scenario display metadata',()=>{
  render(<CalculatorInteractive slug="storage-conversion-calculator"/>);
  fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'GiB'}});
  fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'KiB'}});
  expect(state.account?.output?.value).toBe(1048576);
  const metadata=state.account?.scenarioDisplayMetadata;
  expect(metadata?.inputs.value).toEqual({label:'Value',unit:'GiB'});
  expect(metadata?.inputs.fromUnit).toEqual({label:'From unit'});
  expect(metadata?.inputs.toUnit).toEqual({label:'To unit'});
  expect(metadata?.outputs.value.unit).toBe('KiB');
  fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'MiB'}});
  expect(state.account?.scenarioDisplayMetadata?.inputs.value.unit).toBe('MiB');
  expect(state.account?.output?.value).toBe(1024);
 });
 it('updates paid reconciliation rows when selected storage units change',()=>{
  state.plan='pro';
  render(<CalculatorInteractive slug="storage-conversion-calculator"/>);
  fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'MiB'}});
  fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'KiB'}});
  const table=screen.getByRole('table',{name:'Input and output reconciliation'});
  expect(within(within(table).getByRole('rowheader',{name:'Value'}).closest('tr')!).getAllByRole('cell').map(cell=>cell.textContent)).toEqual(['1','MiB']);
  expect(within(within(table).getByRole('rowheader',{name:'Stored result'}).closest('tr')!).getAllByRole('cell').map(cell=>cell.textContent)).toEqual(['1024','KiB']);
 });
});
