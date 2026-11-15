// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {Wave100CalculatorAnalysis} from './wave100-calculator-analysis';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
const cases:[number,Record<string,string>,string,string][]=[[328,{moles:'1',solutionVolumeLiters:'2'},'moles','mol/L'],[331,{massGrams:'36',molarMass:'18'},'massGrams','mol'],[332,{initialConcentration:'2',initialVolume:'1',finalVolume:'4'},'initialConcentration','mol/L']];
for(const [id,raw,key,unit]of cases)it(`accessible unit-bearing analysis and recovery #${id}`,()=>{
 const packet=getFactoryWorkflows(id).execute(raw),restored:unknown[]=[];const view=render(<Wave100CalculatorAnalysis packet={packet} plan="business" onRestore={s=>restored.push(s)}/>);
 expect(screen.getByRole('table',{name:'Arithmetic steps'}).textContent).toContain(unit);const value=screen.getByRole('table',{name:'Immutable engine output'}).textContent;
 fireEvent.change(screen.getByLabelText('Explicit samples for '+key),{target:{value:'0,1,-1'}});fireEvent.click(screen.getByRole('button',{name:'Sample values'}));expect(screen.getByRole('table',{name:'Explicit sample values'}).textContent).toContain('Refused:');expect(screen.getByRole('img',{name:'Explicit engine samples'}).outerHTML).not.toMatch(/NaN|Infinity/);
 fireEvent.change(screen.getByLabelText('Target result'),{target:{value:'-1'}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Target result'),{target:{value:String(packet.snapshot.output.value)}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.queryByRole('alert')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Restore reconciled input'}));expect(restored).toHaveLength(1);
 view.rerender(<Wave100CalculatorAnalysis packet={packet} plan="free" onRestore={()=>{}}/>);expect((screen.getByRole('button',{name:'Reconcile target'})as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole('table',{name:'Immutable engine output'}).textContent).toBe(value);
});
