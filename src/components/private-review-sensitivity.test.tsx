// @vitest-environment jsdom
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {ScaledContractReview} from './scaled-contract-review';
afterEach(()=>{cleanup();localStorage.clear();});
const plan=(value:string)=>fireEvent.change(screen.getByLabelText('Synthetic private plan'),{target:{value}});
const run=()=>fireEvent.click(screen.getByRole('button',{name:'Run contract'}));
const preview=()=>fireEvent.click(screen.getByRole('button',{name:'Preview private sensitivity'}));
const candidates=(value:string)=>fireEvent.change(screen.getByLabelText('Private candidate values (comma-separated, maximum 25)'),{target:{value}});
it('offers paid immutable previews while preserving Free mathematics and original captures',()=>{
 render(<ScaledContractReview/>);run();expect(screen.getByTestId('cv-value').textContent).toBe('121');expect((screen.getByRole('button',{name:'Preview private sensitivity'}) as HTMLButtonElement).disabled).toBe(true);
 plan('pro');fireEvent.click(screen.getByRole('button',{name:'Save review history'}));fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));const saved=localStorage.getItem('calcumint-private-contract-validation-scaled-v2');const original=screen.getByTestId('cv-output').textContent;
 expect((screen.getByLabelText('Private numeric input field') as HTMLSelectElement).value).toBe('principal');candidates('210,420');preview();const table=screen.getByRole('table',{name:'Private sensitivity preview'});expect(within(table).getByText('242')).toBeTruthy();expect(within(table).getAllByRole('row')).toHaveLength(3);expect(screen.getByTestId('cv-output').textContent).toBe(original);expect(localStorage.getItem('calcumint-private-contract-validation-scaled-v2')).toBe(saved);expect(screen.getByRole('button',{name:'Restore scenario A'})).toBeTruthy();
 plan('business');expect(screen.getByRole('table',{name:'Private sensitivity preview'})).toBeTruthy();plan('free');expect(screen.queryByRole('table',{name:'Private sensitivity preview'})).toBeNull();expect(screen.getByTestId('cv-output').textContent).toBe(original);plan('pro');expect(screen.queryByRole('table',{name:'Private sensitivity preview'})).toBeNull();
});
it('clears stale results after candidate, calculator input and profile edits and reports atomic invalid domains',()=>{
 render(<ScaledContractReview/>);plan('pro');run();candidates('420');preview();expect(screen.getByRole('table',{name:'Private sensitivity preview'})).toBeTruthy();candidates('420,-1');expect(screen.queryByRole('table',{name:'Private sensitivity preview'})).toBeNull();preview();expect(screen.getByRole('alert').textContent).toContain('Private sensitivity failed');expect(screen.getByTestId('cv-value').textContent).toBe('121');
 candidates('420');preview();fireEvent.change(screen.getByLabelText('Principal'),{target:{value:'630'}});expect(screen.queryByRole('table',{name:'Private sensitivity preview'})).toBeNull();expect((screen.getByRole('button',{name:'Preview private sensitivity'}) as HTMLButtonElement).disabled).toBe(true);run();expect(screen.queryByRole('table',{name:'Private sensitivity preview'})).toBeNull();expect(screen.getByTestId('cv-value').textContent).toBe('363');
 fireEvent.change(screen.getByLabelText('Related calculator and immutable adapter'),{target:{value:'private.canonical-calculus.246'}});run();expect(screen.getByText(/No supplied top-level numeric fields/)).toBeTruthy();expect((screen.getByRole('button',{name:'Preview private sensitivity'}) as HTMLButtonElement).disabled).toBe(true);
});
it('uses independent zero-rate monthly payments and rejects blank or oversized supplied candidates',()=>{
 render(<ScaledContractReview/>);plan('pro');for(const [label,value] of [['Principal','1200'],['Annual rate percent','0'],['Term months','12']])fireEvent.change(screen.getByLabelText(label),{target:{value}});run();expect(screen.getByTestId('cv-value').textContent).toBe('100');candidates('1200,2400');preview();expect(within(screen.getByRole('table',{name:'Private sensitivity preview'})).getByText('200')).toBeTruthy();
 for(const value of ['','1200,',Array(26).fill('1200').join(','),'Infinity']){candidates(value);preview();expect(screen.getByRole('alert').textContent).toContain('Private sensitivity failed');expect(screen.getByTestId('cv-value').textContent).toBe('100');}
});
