// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CatalogEngineeringReview} from './catalog-engineering-review';
import {businessExamples,exportBusinessContract} from '../calculators/business-contracts';
afterEach(cleanup);
it('discovers540 exact identities with classification and unknown publication, preserving blocked198',()=>{
 render(<CatalogEngineeringReview/>);
 expect(screen.getByLabelText('Catalog identity').querySelectorAll('option')).toHaveLength(540);
 fireEvent.change(screen.getByLabelText('Find catalog identity'),{target:{value:'198'}});
 expect(screen.getByLabelText('Catalog identity').querySelectorAll('option')).toHaveLength(1);
 expect(screen.getByTestId('identity-status').textContent).toContain('CONTRACT_BLOCKED');
 expect(screen.queryByRole('button',{name:'Calculate'})).toBeNull();
});
it('calculates a private business scope, invalidates edits and restores immutable scenarios',()=>{
 render(<CatalogEngineeringReview/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('business-result').textContent).toBe('30');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));expect(screen.getByTestId('business-result').textContent).toBe('30');expect(screen.queryByRole('alert')).toBeNull();
});
it('imports only actual-engine snapshots and rejects selected identity tampering',()=>{
 render(<CatalogEngineeringReview/>);const s=exportBusinessContract(139,businessExamples[139]);
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(s)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
 const forged=JSON.parse(JSON.stringify(s));forged.masterId=140;
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:JSON.stringify(forged)}});fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
