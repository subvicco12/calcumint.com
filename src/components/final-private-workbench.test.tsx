// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {FinalPrivateWorkbench} from './final-private-workbench';
import {exportFinalPrivate,finalPrivateExamples} from '../calculators/final-private-workbench';
afterEach(cleanup);
it('discovers50 identities and exposes blocked provider contracts without calculation',()=>{
 render(<FinalPrivateWorkbench/>);
 expect(screen.getByLabelText('Calculator identity').querySelectorAll('option')).toHaveLength(50);
 fireEvent.change(screen.getByLabelText('Calculator identity'),{target:{value:'198'}});
 expect(screen.getByRole('status').textContent).toContain('Blocked');
 expect(screen.queryByRole('button',{name:'Calculate'})).toBeNull();
 fireEvent.change(screen.getByLabelText('Find calculator'),{target:{value:'Coast'}});
 expect(screen.getByLabelText('Calculator identity').querySelectorAll('option')).toHaveLength(1);
 expect(screen.getByLabelText('Calculator identity')).toHaveProperty('value','89');
});
it('saves and restores a detached scenario after invalid input',()=>{
 render(<FinalPrivateWorkbench/>);
 fireEvent.change(screen.getByLabelText('Calculator identity'),{target:{value:'81'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('workbench-result').textContent).toBe('120');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));
 expect(screen.getByTestId('workbench-result').textContent).toBe('120');expect(screen.queryByRole('alert')).toBeNull();
 expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toContain('100');
 fireEvent.click(screen.getByRole('button',{name:'Clear scenarios'}));expect(screen.queryByRole('button',{name:'Restore scenario 1'})).toBeNull();
});
it('imports only replay-verified snapshots and invalidates on a forged import',()=>{
 render(<FinalPrivateWorkbench/>);
 const snapshot=exportFinalPrivate(81,finalPrivateExamples[81]);
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(snapshot)}});
 fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByTestId('workbench-result').textContent).toBe('120');
 const forged=JSON.parse(JSON.stringify(snapshot));forged.payload.calculation.output.balance={numerator:'999',denominator:'1'};
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(forged)}});
 fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
