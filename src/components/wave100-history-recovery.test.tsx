// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {SavedCalculationActions} from './saved-calculation-actions';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=> 'pro'}));
afterEach(cleanup);
it('verifies new chemistry only when explicitly requested and keeps recorded fields unchanged',()=>{
 const snapshot=getFactoryWorkflows(328).execute({moles:'0.01',solutionVolumeLiters:'0.2'}).snapshot,before=JSON.stringify(snapshot);render(<SavedCalculationActions snapshot={snapshot}/>);expect(screen.queryByText(/Exact engine agreement verified:/)).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Verify exact engine agreement'}));expect(screen.getByRole('status').textContent).toContain('chemistry.molarity v1');expect(JSON.stringify(snapshot)).toBe(before);
});
it('refuses tampered steps and unsupported versions without upgrading historical output',()=>{
 const snapshot=getFactoryWorkflows(328).execute({moles:'1',solutionVolumeLiters:'2'}).snapshot;render(<SavedCalculationActions snapshot={{...snapshot,output:{...snapshot.output,steps:['forged']}}}/>);fireEvent.click(screen.getByRole('button',{name:'Verify exact engine agreement'}));expect(screen.getByRole('alert').textContent).toContain('no current-engine fallback or upgrade');
});
