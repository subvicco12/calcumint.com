// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {FinancialContractReview} from './financial-contract-review';
afterEach(cleanup);
it('shows methodology and invalidates stale exports on input changes',()=>{
 render(<FinancialContractReview/>);
 expect(screen.getAllByText(/RELEASE HOLD/).length).toBeGreaterThan(0);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByTestId('financial-result').textContent).toBe('40');
 fireEvent.click(screen.getByRole('button',{name:'Save local snapshot'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 expect(screen.getByTestId('financial-history').textContent).toContain('private-financial-21');
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Load example'}));
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByTestId('financial-result').textContent).toBe('40');
});
it('uses the same mathematical results after changing review plan',()=>{
 render(<FinancialContractReview/>);
 for(const plan of ['free','pro','business']){
  fireEvent.change(screen.getByLabelText('Review plan'),{target:{value:plan}});
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByTestId('financial-result').textContent).toBe('40');
 }
});
