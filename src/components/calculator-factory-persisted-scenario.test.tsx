// @vitest-environment jsdom
import {useState} from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({projects:vi.fn(),save:vi.fn(),restore:vi.fn()}));
vi.mock('@/app/admin/calculator-factory/actions',()=>({factoryProjects:mocks.projects,factorySaveScenario:mocks.save,factoryRestoreScenario:mocks.restore}));
import {CalculatorFactoryPersistedScenario} from './calculator-factory-persisted-scenario';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
const packet=getFactoryWorkflows(218).execute({x:'4'}),owner='11111111-1111-4111-8111-111111111111';
beforeEach(()=>{mocks.projects.mockReset().mockResolvedValue({projects:[{id:'project',name:'My project'}]});mocks.save.mockReset().mockResolvedValue({historyId:'history',scenarioId:'scenario'});mocks.restore.mockReset().mockResolvedValue({catalogId:218,snapshot:packet.snapshot});});
afterEach(cleanup);
it('loads projects only on request and reuses the save UUID until input changes',async()=>{
 mocks.save.mockRejectedValueOnce(Error('Retry'));
 render(<CalculatorFactoryPersistedScenario ownerId={owner} packet={packet} onRestore={vi.fn()}/>);
 expect(mocks.projects).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Load owned projects'}));await screen.findByRole('option',{name:'My project'});
 fireEvent.change(screen.getByLabelText('Scenario name'),{target:{value:'Case'}});
 fireEvent.click(screen.getByRole('button',{name:'Save project scenario'}));await screen.findByText('Retry');
 fireEvent.click(screen.getByRole('button',{name:'Save project scenario'}));await screen.findByText(/Saved scenario scenario/);
 expect(mocks.save.mock.calls[0][0].requestId).toBe(mocks.save.mock.calls[1][0].requestId);
 fireEvent.change(screen.getByLabelText('Scenario name'),{target:{value:'Changed'}});fireEvent.click(screen.getByRole('button',{name:'Save project scenario'}));
 await waitFor(()=>expect(mocks.save).toHaveBeenCalledTimes(3));
 expect(mocks.save.mock.calls[2][0].requestId).not.toBe(mocks.save.mock.calls[0][0].requestId);
});
it('restores verified normalized snapshots and ignores stale account replies',async()=>{
 let resolve!:(x:unknown)=>void;mocks.restore.mockImplementationOnce(()=>new Promise(r=>resolve=r));const onRestore=vi.fn();
 const view=render(<CalculatorFactoryPersistedScenario ownerId={owner} packet={packet} onRestore={onRestore}/>);
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 view.rerender(<CalculatorFactoryPersistedScenario ownerId="different-owner" packet={packet} onRestore={onRestore}/>);
 await act(async()=>resolve({catalogId:218,snapshot:packet.snapshot}));expect(onRestore).not.toHaveBeenCalled();
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 await waitFor(()=>expect(onRestore).toHaveBeenCalledWith(packet.snapshot,218));
});
it('ignores responses after packet changes and unmount',async()=>{
 let resolve!:(x:unknown)=>void;mocks.projects.mockImplementationOnce(()=>new Promise(r=>resolve=r));
 const view=render(<CalculatorFactoryPersistedScenario ownerId={owner} packet={packet} onRestore={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Load owned projects'}));
 view.rerender(<CalculatorFactoryPersistedScenario ownerId={owner} packet={null} onRestore={vi.fn()}/>);
 await act(async()=>resolve({projects:[{id:'old',name:'Stale project'}]}));expect(screen.queryByRole('option',{name:'Stale project'})).toBeNull();
 view.unmount();
});

it('disables controls in flight and ignores restore completion after unmount',async()=>{
 let resolve!:(x:unknown)=>void;mocks.restore.mockImplementationOnce(()=>new Promise(r=>resolve=r));const onRestore=vi.fn();
 const view=render(<CalculatorFactoryPersistedScenario ownerId={owner} packet={packet} onRestore={onRestore}/>);
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 expect((screen.getByRole('button',{name:'Load owned projects'}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByRole('button',{name:'Restore saved scenario'}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByLabelText('Scenario name') as HTMLInputElement).maxLength).toBe(120);
 view.unmount();await act(async()=>resolve({catalogId:218,snapshot:packet.snapshot}));expect(onRestore).not.toHaveBeenCalled();
});

it('retains restore success through a matching parent packet update and clears it on later edits',async()=>{
 const restored=getFactoryWorkflows(218).execute({x:'5'});
 mocks.restore.mockResolvedValue({catalogId:218,snapshot:restored.snapshot});
 function Parent(){const [value,setValue]=useState(packet);return <><button onClick={()=>setValue(getFactoryWorkflows(218).execute({x:'6'}))}>Edit calculation</button><CalculatorFactoryPersistedScenario ownerId={owner} packet={value} onRestore={()=>setValue(restored)}/></>;}
 render(<Parent/>);fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 await screen.findByText('Verified saved snapshot restored.');
 fireEvent.click(screen.getByRole('button',{name:'Edit calculation'}));expect(screen.queryByText('Verified saved snapshot restored.')).toBeNull();
});
it('does not preserve restore success when the parent changes to a different snapshot',async()=>{
 const restored=getFactoryWorkflows(218).execute({x:'5'}),different=getFactoryWorkflows(218).execute({x:'6'});
 mocks.restore.mockResolvedValue({catalogId:218,snapshot:restored.snapshot});
 function Parent(){const [value,setValue]=useState(packet);return <CalculatorFactoryPersistedScenario ownerId={owner} packet={value} onRestore={()=>setValue(different)}/>;}
 render(<Parent/>);fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 await waitFor(()=>expect(mocks.restore).toHaveBeenCalled());await act(async()=>{});
 expect(screen.queryByText('Verified saved snapshot restored.')).toBeNull();
});

it('retains a personal restore acknowledgement when equal inputs normalize raw decimal text and field order',async()=>{
 const initial=getFactoryWorkflows(440).execute({value:'01.000',toUnit:'khz',fromUnit:'hz'});
 const normalized=getFactoryWorkflows(440).execute({fromUnit:'hz',toUnit:'khz',value:'1'});
 expect(initial.snapshot.input).toEqual(normalized.snapshot.input);
 expect(initial.snapshot.output).toEqual({result:0.001});
 expect(initial.snapshot.output).toEqual(normalized.snapshot.output);
 expect(JSON.stringify(initial)).not.toBe(JSON.stringify(normalized));
 mocks.restore.mockResolvedValue({catalogId:440,snapshot:normalized.snapshot});
 function Parent(){
  const [value,setValue]=useState(initial);
  return <><output aria-label="Parent raw fields">{JSON.stringify(value.raw)}</output><button onClick={()=>setValue(getFactoryWorkflows(440).execute({value:'2',fromUnit:'hz',toUnit:'khz'}))}>Edit actual value</button><CalculatorFactoryPersistedScenario ownerId={owner} packet={value} onRestore={()=>setValue(normalized)}/></>;
 }
 render(<Parent/>);
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'personal-scenario'}});
 fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 await waitFor(()=>expect(screen.getByLabelText('Parent raw fields').textContent).toBe(JSON.stringify(normalized.raw)));
 expect(screen.getByText('Verified saved snapshot restored.')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Edit actual value'}));
 expect(screen.queryByText('Verified saved snapshot restored.')).toBeNull();
});
