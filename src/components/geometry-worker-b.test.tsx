// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {Wave100CalculatorAnalysis} from './wave100-calculator-analysis';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
const cases:[number,Record<string,string>,string][]=[[272,{radius:'3',height:'4'},'height'],[274,{length:'2',width:'3',height:'4'},'height'],[275,{length:'2',width:'3',height:'4'},'height'],[278,{a:'3',b:'4'},'a'],[279,{degrees:'180'},'degrees'],[280,{radians:'3.141592653589793'},'radians']];
for(const [id,raw,field] of cases)it(`provides accessible samples, target recovery and plan parity #${id}`,()=>{
 const packet=getFactoryWorkflows(id).execute(raw),restored:unknown[]=[];
 const view=render(<Wave100CalculatorAnalysis packet={packet} plan="business" onRestore={s=>restored.push(s)}/>);
 const output=screen.getByRole('table',{name:'Immutable engine output'});for(const key of Object.keys(packet.snapshot.output))expect(output.textContent).toContain(key);
 fireEvent.change(screen.getByLabelText('Explicit samples for '+field),{target:{value:'0,1,Infinity'}});fireEvent.click(screen.getByRole('button',{name:'Sample values'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Explicit samples for '+field),{target:{value:'1,2,3'}});fireEvent.click(screen.getByRole('button',{name:'Sample values'}));expect(screen.getByRole('img',{name:'Explicit engine samples'}).outerHTML).not.toMatch(/NaN|Infinity/);expect(screen.getByRole('table',{name:'Explicit sample values'})).toBeTruthy();
 const key=id===274?'surfaceArea':id===275?'volume':'result';fireEvent.change(screen.getByLabelText('Target result'),{target:{value:String(packet.snapshot.output[key])}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.queryByRole('alert')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Restore reconciled input'}));expect(restored).toHaveLength(1);
 view.rerender(<Wave100CalculatorAnalysis packet={packet} plan="free" onRestore={()=>{}}/>);expect((screen.getByRole('button',{name:'Reconcile target'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole('table',{name:'Immutable engine output'}).textContent).toBe(output.textContent);
});
