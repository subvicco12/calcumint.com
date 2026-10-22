// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {GoalSolverPanel,ScenarioComparisonPanel,SensitivityPanel} from './final-analysis-panels';
import {referencePresentations} from '@/calculators/final-framework/reference-presentations';
import type {Scenario,SensitivityPoint} from '@/calculators/final-framework/analysis';
afterEach(cleanup);const presentation=referencePresentations.sip;
it.each(['pro','business'] as const)('contains malformed analytical arrays and recovers without stale rows on %s',plan=>{
 for(const malformed of [null,{},[null],Array(1),[{id:'a',label:1,value:0,delta:0}],[{id:'a',label:'A',value:0,delta:0,input:false}]]){
  const view=render(<ScenarioComparisonPanel plan={plan} presentation={presentation} resultLabel="Value" scenarios={malformed as unknown as Scenario[]}/>);expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('table')).toBeNull();
  view.rerender(<ScenarioComparisonPanel plan={plan} presentation={presentation} resultLabel="Value" scenarios={[{id:'new',label:'New',value:-1e-12,delta:0}]}/>);expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('rowheader',{name:'New'})).toBeTruthy();cleanup();
 }
 for(const malformed of [null,{},[null],Array(1),[{input:0,value:'1'}]]){
  render(<SensitivityPanel plan={plan} presentation={presentation} resultLabel="Value" points={malformed as unknown as SensitivityPoint[]}/>);expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('meter')).toBeNull();cleanup();
 }
});
it('bounds large finite analytical DOM while retaining full domain and explicit paging',()=>{
 const points=Array.from({length:150000},(_,input)=>({input,value:input===149999?-100:input}));
 const view=render(<SensitivityPanel plan="pro" presentation={presentation} resultLabel="Value" points={points}/>);
 expect(screen.getAllByRole('meter')).toHaveLength(25);expect(screen.getAllByRole('meter')[0].getAttribute('min')).toBe('-100');expect(screen.getAllByRole('meter')[0].getAttribute('max')).toBe('149998');expect(screen.getByRole('status').textContent).toContain('1–25 of 150000');
 fireEvent.click(screen.getByRole('button',{name:'Next sensitivity page'}));expect(within(screen.getByRole('table')).getAllByRole('row')[1].textContent).toBe('2525');
 view.rerender(<SensitivityPanel plan="pro" presentation={presentation} resultLabel="Value" points={[{input:0,value:0}]}/>);expect(screen.queryByRole('button',{name:'Next sensitivity page'})).toBeNull();expect(screen.getAllByRole('meter')).toHaveLength(1);expect(within(screen.getByRole('table')).getAllByRole('row')[1].textContent).toBe('00');
});
it('pages scenarios in original order and resets on replacement input',()=>{
 const scenarios=Array.from({length:51},(_,i)=>({id:String(i),label:`Case ${i}`,value:i,delta:i}));const view=render(<ScenarioComparisonPanel plan="business" presentation={presentation} resultLabel="Value" scenarios={scenarios}/>);
 expect(screen.getAllByRole('rowheader')).toHaveLength(25);expect((screen.getByRole('button',{name:'Previous scenario page'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Next scenario page'}));fireEvent.click(screen.getByRole('button',{name:'Next scenario page'}));expect(screen.getByRole('rowheader',{name:'Case 50'})).toBeTruthy();expect((screen.getByRole('button',{name:'Next scenario page'}) as HTMLButtonElement).disabled).toBe(true);
 view.rerender(<ScenarioComparisonPanel plan="business" presentation={presentation} resultLabel="Value" scenarios={[{id:'new',label:'New',value:0,delta:0}]}/>);expect(screen.queryByRole('rowheader',{name:'Case 50'})).toBeNull();expect(screen.getByRole('rowheader',{name:'New'})).toBeTruthy();expect(scenarios).toHaveLength(51);
 view.rerender(<ScenarioComparisonPanel plan="business" presentation={presentation} resultLabel="Value" scenarios={null as unknown as Scenario[]}/>);expect(screen.getByRole('alert')).toBeTruthy();
 view.rerender(<ScenarioComparisonPanel plan="business" presentation={presentation} resultLabel="Value" scenarios={scenarios}/>);expect(screen.getByRole('rowheader',{name:'Case 0'})).toBeTruthy();expect(screen.queryByRole('rowheader',{name:'Case 50'})).toBeNull();
});

it.each(['free','pro','business'] as const)('contains malformed labels and duplicate scenario identities without weakening entitlements on %s',plan=>{
 const goal=render(<GoalSolverPanel plan={plan} presentation={presentation} target={0} solved={0} solvedLabel={{} as unknown as string}/>);expect(screen.queryByRole('alert')!==null).toBe(plan!=='free');goal.rerender(<GoalSolverPanel plan={plan} presentation={presentation} target={-0} solved={-1e-12}/>);expect(screen.queryByRole('alert')).toBeNull();cleanup();
 render(<ScenarioComparisonPanel plan={plan} presentation={presentation} resultLabel="Value" scenarios={[{id:'same',label:'A',value:0,delta:0},{id:'same',label:'B',value:1,delta:1}]}/>);expect(screen.queryByRole('alert')!==null).toBe(plan!=='free');expect(screen.queryByRole('table')).toBeNull();cleanup();
 render(<SensitivityPanel plan={plan} presentation={presentation} resultLabel={{} as unknown as string} points={[{input:0,value:0}]}/>);expect(screen.queryByRole('alert')!==null).toBe(plan!=='free');
});
