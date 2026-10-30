// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {RemainingEngineeringReview} from './remaining-engineering-review';
import {remainingExamples,exportRemainingContract} from '../calculators/remaining-contracts';
afterEach(cleanup);
it('discovers540 identities and restores detached calendar scenarios',()=>{
 render(<RemainingEngineeringReview/>);expect(screen.getByLabelText('Catalog identity').querySelectorAll('option')).toHaveLength(540);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('remaining-result').textContent).toBe('400');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});expect(screen.queryByTestId('remaining-result')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));expect(screen.getByTestId('remaining-result').textContent).toBe('400');
});
it('preserves blocked198 and199 without Calculate controls',()=>{render(<RemainingEngineeringReview/>);for(const id of [198,199]){fireEvent.change(screen.getByLabelText('Find catalog identity'),{target:{value:String(id)}});expect(screen.getByTestId('identity-status').textContent).toContain('CONTRACT_BLOCKED');expect(screen.queryByRole('button',{name:'Calculate'})).toBeNull();}});
it('restores a supplied root snapshot and rejects modified methodology',()=>{render(<RemainingEngineeringReview/>);const s=exportRemainingContract(72,remainingExamples[72]);fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(s)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(Number(screen.getByTestId('remaining-result').textContent)).toBeCloseTo(10,9);const t=JSON.parse(JSON.stringify(s));t.helpers=[];fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(t)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();});
it('labels a mathematically unreachable equality without claiming a zero denominator',()=>{render(<RemainingEngineeringReview/>);fireEvent.change(screen.getByLabelText('Find catalog identity'),{target:{value:'63'}});fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:JSON.stringify({...remainingExamples[63],annualReturnPercent:0})}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('remaining-result').textContent).toBe('No future equality under supplied assumptions');});
