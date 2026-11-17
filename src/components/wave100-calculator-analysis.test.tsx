// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {Wave100CalculatorAnalysis} from './wave100-calculator-analysis';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
it('renders signed sample coordinates without nonfinite SVG and preserves refusal gaps',()=>{
 const packet=getFactoryWorkflows(221).execute({x:'-8'});render(<Wave100CalculatorAnalysis packet={packet} plan="pro" onRestore={()=>{}}/>);
 fireEvent.change(screen.getByLabelText('Explicit samples for x'),{target:{value:'-1e308,0,1e308'}});fireEvent.click(screen.getByRole('button',{name:'Sample values'}));
 const plot=screen.getByRole('img',{name:'Explicit engine samples'});expect(plot.querySelectorAll('circle')).toHaveLength(3);expect(plot.outerHTML).not.toMatch(/NaN|Infinity/);
 fireEvent.change(screen.getByLabelText('Explicit samples for x'),{target:{value:'Infinity'}});fireEvent.click(screen.getByRole('button',{name:'Sample values'}));expect(screen.queryByRole('img')).toBeNull();expect(screen.getByRole('alert').textContent).toContain('finite');
});
it('distinguishes finite inverse candidates from complete inverse proof and restores exact input',()=>{
 const packet=getFactoryWorkflows(221).execute({x:'8'}),restored:unknown[]=[];const v=render(<Wave100CalculatorAnalysis packet={packet} plan="pro" onRestore={s=>restored.push(s)}/>);
 fireEvent.change(screen.getByLabelText('Target result'),{target:{value:'3'}});fireEvent.change(screen.getByLabelText('Explicit candidate values for x'),{target:{value:'8,27,64'}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.getByRole('status').textContent).toContain('27');fireEvent.click(screen.getByRole('button',{name:'Restore reconciled input'}));expect(restored).toEqual([getFactoryWorkflows(221).execute({x:'27'}).snapshot]);
 v.rerender(<Wave100CalculatorAnalysis packet={packet} plan="free" onRestore={()=>{}}/>);expect((screen.getByRole('button',{name:'Reconcile target'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.queryByRole('status')).toBeNull();
});
it('shows source-established chemistry units, exact target replay and invalid-target recovery',()=>{
 const packet=getFactoryWorkflows(328).execute({moles:'0.01',solutionVolumeLiters:'0.2'});render(<Wave100CalculatorAnalysis packet={packet} plan="business" onRestore={()=>{}}/>);expect(screen.getByRole('table',{name:'Arithmetic steps'}).textContent).toContain('mol/L');fireEvent.change(screen.getByLabelText('Target result'),{target:{value:'-1'}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.getByRole('alert')).toBeTruthy();fireEvent.change(screen.getByLabelText('Target result'),{target:{value:'0.5'}});fireEvent.click(screen.getByRole('button',{name:'Reconcile target'}));expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('status').textContent).toContain('0.1');
});
it('rejects tampered exact-version packets before analysis',()=>{
 const p=JSON.parse(JSON.stringify(getFactoryWorkflows(328).execute({moles:'1',solutionVolumeLiters:'2'})));p.snapshot.output.value=999;render(<Wave100CalculatorAnalysis packet={p} plan="business" onRestore={()=>{}}/>);expect(screen.getByRole('alert').textContent).toContain('verified');expect(screen.queryByRole('table')).toBeNull();
});

it('presents every original engine output field and secondary units without recomputation',()=>{
 const packet=getFactoryWorkflows(257).execute({a:'13',b:'14',c:'15'});const view=render(<Wave100CalculatorAnalysis packet={packet} plan="business" onRestore={()=>{}}/>);const t=screen.getByRole('table',{name:'Immutable engine output'});for(const [k,v] of Object.entries(packet.snapshot.output)){expect(t.textContent).toContain(k);expect(t.textContent).toContain(typeof v==='object'?JSON.stringify(v):String(v));}expect(t.textContent).toContain('degrees');expect(t.textContent).toContain('square units');expect(packet.snapshot.output.perimeter).toBe(42);view.rerender(<Wave100CalculatorAnalysis packet={getFactoryWorkflows(277).execute({x1:'1',y1:'2',x2:'6',y2:'14'})} plan="business" onRestore={()=>{}}/>);const coordinate=screen.getByRole('table',{name:'Immutable engine output'});for(const key of ['dx','dy'])expect([...coordinate.querySelectorAll('tr')].find(row=>row.querySelector('th')?.textContent===key)?.textContent).toContain('length units');
});
