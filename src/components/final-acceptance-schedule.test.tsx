// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {FinalResultPresentation} from './final-result-presentation';
import {FinalCalculatorRenderer} from './final-calculator-renderer';
import {referencePresentations} from '@/calculators/final-framework/reference-presentations';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
afterEach(cleanup);
const result:StructuredCalculationResult={primaryResult:{id:'total',label:'Total',value:30},schedule:[{id:'a',period:1,values:{principal:10,interest:20}},{id:'b',period:2,values:{interest:3,principal:7}},{id:'c',period:3,values:{interest:0,fee:-0.0001}}]};
it('binds legacy cells to column IDs across reordered, missing and additional fields',()=>{
 render(<FinalResultPresentation result={result} plan="pro"/>);
 const table=screen.getByRole('table',{hidden:true});const rows=within(table).getAllByRole('row',{hidden:true});
 expect(within(rows[0]).getAllByRole('columnheader',{hidden:true}).map(n=>n.textContent)).toEqual(['Period','principal','interest','fee']);
 expect(within(rows[2]).getAllByRole('cell',{hidden:true}).map(n=>n.textContent)).toEqual(['7','3','—']);
 expect(within(rows[3]).getAllByRole('cell',{hidden:true}).map(n=>n.textContent)).toEqual(['—','0','-0.0001']);
 expect(table.closest('[role="region"]')?.getAttribute('tabindex')).toBe('0');
});
for(const Component of [FinalResultPresentation,FinalCalculatorRenderer])it(`${Component.name} uses authoritative column order, labels, units and reconciliation`,()=>{
 const data:StructuredCalculationResult={...result,schedule:result.schedule!.slice(0,2),scheduleMetadata:{caption:'Declared amounts',period:{key:'month',label:'Month',unit:'months'},columns:[{key:'interest',label:'Interest',unit:'EUR'},{key:'principal',label:'Principal',unit:'EUR'}],granularity:'checkpoints',terminal:[{column:'principal',expected:7,tolerance:0}]}};
 render(Component===FinalCalculatorRenderer?<FinalCalculatorRenderer result={data} plan="pro" presentation={referencePresentations.loanEmi}/>:<FinalResultPresentation result={data} plan="pro"/>);
 const table=screen.getByRole('table',{hidden:true});const rows=within(table).getAllByRole('row',{hidden:true});expect(within(rows[0]).getAllByRole('columnheader',{hidden:true}).map(n=>n.textContent)).toEqual(['Month (months)','Interest (EUR)','Principal (EUR)']);expect(within(rows[2]).getAllByRole('cell',{hidden:true}).map(n=>n.textContent)).toEqual(['3','7']);
});
it('keeps metadata rejection fail-closed without hiding valid core results',()=>{
 const data={...result,scheduleMetadata:{caption:'Declared amounts',period:{key:'month',label:'Month'},columns:[{key:'principal',label:'Principal'}],granularity:'complete' as const}};
 render(<FinalResultPresentation result={data} plan="pro"/>);expect(screen.getByRole('status').textContent).toContain('30');expect(screen.queryByRole('table',{hidden:true})).toBeNull();expect(screen.getByRole('alert').textContent).toContain('schedule');
});
it('summarizes large legacy schedules with terminal row and keyboard-operable expansion',()=>{
 const schedule=Array.from({length:100},(_,i)=>({id:String(i),period:i+1,values:{value:i}}));
 render(<FinalResultPresentation result={{...result,schedule}} plan="business"/>);
 const table=screen.getByRole('table',{hidden:true});expect(within(table).getAllByRole('row',{hidden:true})).toHaveLength(26);
 expect(within(table).getAllByRole('row',{hidden:true}).at(-1)?.textContent).toBe('10099');
 const button=screen.getByRole('button',{name:'Show all 100 rows',hidden:true});fireEvent.click(button);expect(within(table).getAllByRole('row',{hidden:true})).toHaveLength(101);expect(button.getAttribute('aria-expanded')).toBe('true');
});
