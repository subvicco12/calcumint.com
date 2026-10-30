// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {ComponentEngineeringReview} from './component-engineering-review';
import {componentExamples,exportComponentContract} from '../calculators/component-contracts';
afterEach(cleanup);
it('discovers540 identities and restores detached private loan scenarios',()=>{
 render(<ComponentEngineeringReview/>);
 expect(screen.getByLabelText('Catalog identity').querySelectorAll('option')).toHaveLength(540);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('component-result').textContent).toBe('400');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});expect(screen.queryByTestId('component-result')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));expect(screen.getByTestId('component-result').textContent).toBe('400');
});
it('preserves blocked198 and incomplete date25 without calculate controls',()=>{
 render(<ComponentEngineeringReview/>);
 for(const id of [198,25]){fireEvent.change(screen.getByLabelText('Find catalog identity'),{target:{value:String(id)}});expect(screen.queryByRole('button',{name:'Calculate'})).toBeNull();}
});
it('restores a named-unit snapshot and rejects tampering',()=>{
 render(<ComponentEngineeringReview/>);const s=exportComponentContract(426,componentExamples[426]);
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(s)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByTestId('component-result').textContent).toBe('1000');
 const t=JSON.parse(JSON.stringify(s));t.calculation.output.value=999;
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(t)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
it('explains undefined refinance break-even when there are no positive payment savings',()=>{
 render(<ComponentEngineeringReview/>);
 fireEvent.change(screen.getByLabelText('Find catalog identity'),{target:{value:'33'}});
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:JSON.stringify({...componentExamples[33],currentAnnualRatePercent:0,newAnnualRatePercent:0})}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByTestId('component-result').textContent).toBe('No positive monthly payment savings');
});
