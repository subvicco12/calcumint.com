// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=> 'free'}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:({output}:{output:unknown})=><button disabled={!output}>Capture current fixture</button>}));
import {Publication20Tool} from './publication20-tool';
import {CatalogEngineeringReview} from './catalog-engineering-review';
afterEach(cleanup);
it('loads a registered converter example explicitly and recovers a refused editable value',()=>{
 render(<Publication20Tool slug="temperature-converter"/>);
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:''}});
 expect(screen.getByRole('button',{name:'Capture current fixture'}).hasAttribute('disabled')).toBe(true);
 const examples=screen.getByRole('region',{name:'Worked examples'});
 fireEvent.click(within(examples).getByRole('button',{name:'Use worked example 1'}));
 expect((screen.getByLabelText('Value') as HTMLInputElement).value).toBe('32');
 expect((screen.getByLabelText('From unit') as HTMLSelectElement).value).toBe('f');
 expect((screen.getByLabelText('To unit') as HTMLSelectElement).value).toBe('c');
 expect(document.querySelector('[data-publication20-result]')?.getAttribute('data-publication20-result')).toBe('0');
 expect(screen.getByRole('button',{name:'Capture current fixture'}).hasAttribute('disabled')).toBe(false);
});
it('uses guided real business calculation, invalidates edits and restores an immutable scenario',()=>{
 render(<CatalogEngineeringReview/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate guided scenario'}));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Revenue'),{target:{value:''}});
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate guided scenario'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
 expect(screen.queryByRole('alert')).toBeNull();
});
