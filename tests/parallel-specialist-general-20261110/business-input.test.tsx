import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {useState} from 'react';
import {GuidedBusinessInputs,GuidedBusinessWorkspace} from '../../src/components/specialist-general-20261110-business-input';
import {businessDraft,calculateBusinessDraft,parseBusinessDraft,guidedBusinessIds} from '../../src/lib/specialist-general-20261110-business-input';
afterEach(cleanup);
describe('guided supplied business scenarios',()=>{
 it.each(guidedBusinessIds)('executes existing contract %i without changing its basis',id=>{
  const result=calculateBusinessDraft(id,businessDraft(id));expect(result.errors).toEqual({});expect(result.snapshot?.masterId).toBe(id);expect(result.snapshot?.calculation.input.scope).toBe('supplied-business-no-policy');
 });
 it('has independently expected margin and MRR results',()=>{
  expect(calculateBusinessDraft(139,businessDraft(139)).snapshot?.calculation.output.value).toBe(30);
  expect(calculateBusinessDraft(165,businessDraft(165)).snapshot?.calculation.output.value).toBe(120);
 });
 it.each(['',' ','0x10','Infinity','1e999','12 apples'])('rejects an absent/nondecimal revenue %j',revenue=>{
  expect(calculateBusinessDraft(139,{...businessDraft(139),revenue}).errors.revenue).toBeTruthy();
 });
 it('retains zero-base undefined status and rejects impossible cohorts',()=>{
  expect(calculateBusinessDraft(166,{...businessDraft(166),startingCustomers:'0',lostCustomers:'0'}).snapshot?.calculation.output.value).toBeNull();
  expect(calculateBusinessDraft(166,{...businessDraft(166),lostCustomers:'101'}).errors.contract).toBeTruthy();
 });
 it('exposes labeled inputs, updates draft and blocks blank submission',()=>{
  const calculated=vi.fn();
  function Harness(){const[draft,setDraft]=useState(businessDraft(139));return <GuidedBusinessInputs id={139} draft={draft} onChange={setDraft} onCalculate={calculated}/>;}
  render(<Harness/>);fireEvent.change(screen.getByLabelText('Revenue'),{target:{value:''}});fireEvent.click(screen.getByText('Calculate guided scenario'));
  expect(calculated).not.toHaveBeenCalled();expect(screen.getByRole('alert').textContent).toContain('Correct');expect(screen.getByLabelText('Revenue').getAttribute('aria-invalid')).toBe('true');
  fireEvent.change(screen.getByLabelText('Revenue'),{target:{value:'200'}});fireEvent.click(screen.getByText('Calculate guided scenario'));
  expect(calculated.mock.calls[0][0].calculation.output.value).toBe(65);
 });
 it('invalidates the parent result on edit and reloads restored input on keyed remount',()=>{
  const invalidate=vi.fn(),calculate=vi.fn();
  const initial=businessDraft(139);
  const view=render(<GuidedBusinessWorkspace key="first" id={139} input={initial} plan="free" onInvalidate={invalidate} onCalculate={calculate}/>);
  fireEvent.change(screen.getByLabelText('Revenue'),{target:{value:''}});
  expect(invalidate).toHaveBeenCalledOnce();
  view.rerender(<GuidedBusinessWorkspace key="restored" id={139} input={{...initial,revenue:200}} plan="free" onInvalidate={invalidate} onCalculate={calculate}/>);
  expect((screen.getByLabelText('Revenue') as HTMLInputElement).value).toBe('200');
  fireEvent.click(screen.getByText('Calculate guided scenario'));
  expect(calculate.mock.calls[0][0].calculation.output.value).toBe(65);
 });

 it.each(['9007199254740993','0.10000000000000001','-0.10000000000000001','1e-400','-1e-400','2.2250738585072012e-308'])('refuses lossy input while retaining its exact draft text %s',revenue=>{
  const draft={...businessDraft(139),revenue};
  expect(calculateBusinessDraft(139,draft).errors.revenue).toContain('precision');
  expect(draft.revenue).toBe(revenue);
 });
 it.each(['5e-324','-5e-324','1e-12','-0',' 12.50 '])('keeps current capture policy without inventing a business domain for %s',revenue=>{
  const result=parseBusinessDraft(139,{...businessDraft(139),revenue});
  expect(result.errors).toEqual({});
  expect(Object.is(result.input.revenue,Number(revenue))).toBe(true);
 });
 it('does not silently repair incompatible scope from scenario JSON',()=>{
  const draft=businessDraft(139,{...businessDraft(139),scope:'different-policy'});
  expect(calculateBusinessDraft(139,draft).snapshot).toBeNull();
  expect(calculateBusinessDraft(139,draft).errors.scope).toContain('Repair the scenario JSON');
 });

});
