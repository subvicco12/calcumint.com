// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {CompletionWaveAnalysis} from './completion-wave-analysis';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
function packet(id:number,raw?:Record<string,string>){const contract=getFactoryContract(id)!;return getFactoryWorkflows(id).execute(raw??Object.fromEntries(contract.fields.map(f=>[f.key,String(f.defaultValue)])));}
it.each([208,209,210,211,212,215,216])('renders actual math steps and Free forward samples for %i',id=>{
 const current=packet(id);render(<CompletionWaveAnalysis catalogId={id} packet={current} plan="free" onRestore={vi.fn()}/>);
 expect(screen.getByRole('table',{name:'Arithmetic steps'}).textContent).toContain(String(current.snapshot.output.result));
 expect((screen.getByRole('button',{name:'Solve target'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.submit(screen.getByRole('form',{name:'Discrete sample analysis'}));
 expect(screen.getByRole('table',{name:'Sample values'}).textContent).toContain(String(current.snapshot.output.result));
 expect(screen.getByRole('img',{name:'Discrete relationship samples'})).toBeTruthy();
});
it('solves both negative-baseline branches, recovers invalid keyboard input, clears on plan downgrade',()=>{
 const current=packet(208,{old:'1',next:'6'}),restore=vi.fn();
 const view=render(<CompletionWaveAnalysis catalogId={208} packet={current} plan="pro" onRestore={restore}/>);
 const target=screen.getByLabelText('Target output');target.focus();expect(document.activeElement).toBe(target);
 fireEvent.change(target,{target:{value:'bad'}});fireEvent.keyDown(target,{key:'Enter',code:'Enter'});fireEvent.submit(screen.getByRole('form',{name:'Reverse paired math'}));
 expect(screen.getByRole('alert').textContent).toContain('finite');
 fireEvent.change(target,{target:{value:'200'}});fireEvent.keyDown(target,{key:'Enter',code:'Enter'});fireEvent.submit(screen.getByRole('form',{name:'Reverse paired math'}));
 expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('status').textContent).toContain('Candidate 2');expect(screen.getByRole('status').textContent).toContain('Candidate -6');expect(restore).not.toHaveBeenCalled();
 view.rerender(<CompletionWaveAnalysis catalogId={208} packet={current} plan="free" onRestore={restore}/>);
 expect(screen.queryByRole('status')).toBeNull();expect((screen.getByRole('button',{name:'Solve target'}) as HTMLButtonElement).disabled).toBe(true);
});
it('selects denominator analysis, represents refusal gaps and recovers valid samples',()=>{
 render(<CompletionWaveAnalysis catalogId={215} packet={packet(215)} plan="free" onRestore={vi.fn()}/>);
 fireEvent.change(screen.getByLabelText('Analysis variable'),{target:{value:'denominator'}});
 fireEvent.change(screen.getByLabelText('Sample input values, separated by commas'),{target:{value:'0,3'}});fireEvent.submit(screen.getByRole('form',{name:'Discrete sample analysis'}));
 expect(screen.getByRole('table',{name:'Sample values'}).textContent).toContain('Refused:');
 fireEvent.change(screen.getByLabelText('Sample input values, separated by commas'),{target:{value:','}});fireEvent.submit(screen.getByRole('form',{name:'Discrete sample analysis'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Sample input values, separated by commas'),{target:{value:'3'}});fireEvent.submit(screen.getByRole('form',{name:'Discrete sample analysis'}));expect(screen.queryByRole('alert')).toBeNull();
});
it.each(['free','pro'] as const)('performs actual converter swap and target capture for %s',plan=>{
 const restore=vi.fn(),current=packet(425,{value:'1',fromUnit:'gal_us',toUnit:'l'});
 render(<CompletionWaveAnalysis catalogId={425} packet={current} plan={plan} onRestore={restore}/>);
 expect(screen.getByRole('table',{name:'All target units'}).textContent).toContain('3.785');
 const swap=screen.getByRole('button',{name:'Swap units and calculate'});swap.focus();fireEvent.keyDown(swap,{key:'Enter',code:'Enter'});fireEvent.click(swap);
 expect(restore).toHaveBeenCalledWith(expect.objectContaining({input:{value:1,fromUnit:'l',toUnit:'gal_us'}}));
 fireEvent.click(screen.getByRole('button',{name:'Use target mL'}));expect(restore).toHaveBeenLastCalledWith(expect.objectContaining({input:{value:1,fromUnit:'gal_us',toUnit:'ml'}}));
});
it.each([424,425,427,428,433,434])('shows unit definitions and full matrix for converter %i',id=>{
 render(<CompletionWaveAnalysis catalogId={id} packet={packet(id)} plan="free" onRestore={vi.fn()}/>);
 expect(within(screen.getByRole('table',{name:'All target units'})).getAllByRole('row').length).toBeGreaterThan(3);
 expect(screen.getByText(/Competent review remains pending/)).toBeTruthy();
});
it.each([322,323,324,325,327])('shows honest physics steps and numeric discrete graph for %i',id=>{
 render(<CompletionWaveAnalysis catalogId={id} packet={packet(id)} plan="free" onRestore={vi.fn()}/>);
 expect(screen.getByText(/Canonical units unresolved/)).toBeTruthy();
 fireEvent.submit(screen.getByRole('form',{name:'Discrete sample analysis'}));
 expect(screen.getByRole('table',{name:'Sample values'})).toBeTruthy();expect(screen.getByRole('img')).toBeTruthy();
});
it('refuses a tampered packet before presenting analysis',()=>{
 const current=packet(208);render(<CompletionWaveAnalysis catalogId={208} packet={{...current,snapshot:{...current.snapshot,output:{result:999}}}} plan="pro" onRestore={vi.fn()}/>);
 expect(screen.getByRole('alert').textContent).toContain('verified');expect(screen.queryByRole('button')).toBeNull();
});
it('shows per-target overflow and recovers a refused swap using a valid target',()=>{
 const restore=vi.fn();render(<CompletionWaveAnalysis catalogId={424} packet={packet(424,{value:String(Number.MAX_VALUE),fromUnit:'m2',toUnit:'km2'})} plan="free" onRestore={restore}/>);
 expect(screen.getByRole('table',{name:'All target units'}).textContent).toContain('Refused:');
 fireEvent.click(screen.getByRole('button',{name:'Swap units and calculate'}));expect(screen.getByRole('alert')).toBeTruthy();expect(restore).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Use target m²'}));expect(screen.queryByRole('alert')).toBeNull();expect(restore).toHaveBeenCalledWith(expect.objectContaining({input:{value:Number.MAX_VALUE,fromUnit:'m2',toUnit:'m2'}}));
});
