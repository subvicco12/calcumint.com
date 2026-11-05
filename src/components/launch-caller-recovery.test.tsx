/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
const observed=vi.hoisted(()=>({input:{} as Record<string,unknown>,output:null as unknown}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(p:typeof observed)=>{observed.input=p.input;observed.output=p.output;return null;}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=> 'free'}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
it('uses the destination calculator defaults instead of a different calculator draft',()=>{
 const view=render(<CalculatorInteractive slug="ratio-calculator"/>);
 fireEvent.change(screen.getByLabelText('First value'),{target:{value:'999'}});
 view.rerender(<CalculatorInteractive slug="average-two-numbers-calculator"/>);
 expect(observed.input).toEqual({a:10,b:20});expect(observed.output).toEqual({result:15});
});
it('keeps a draft during same-calculator rerenders',()=>{
 const view=render(<CalculatorInteractive slug="ratio-calculator"/>);fireEvent.change(screen.getByLabelText('First value'),{target:{value:'5.5'}});
 view.rerender(<CalculatorInteractive slug="ratio-calculator"/>);expect(observed.input.a).toBe(5.5);
});
it('allows valid fractional values in native browser validity',()=>{
 render(<CalculatorInteractive slug="ratio-calculator"/>);const field=screen.getByLabelText('First value') as HTMLInputElement;
 fireEvent.change(field,{target:{value:'0.5'}});expect(field.validity.stepMismatch).toBe(false);expect(field.checkValidity()).toBe(true);
});
it('exposes the source integer constraint without inventing a decimal-place cap',()=>{
 render(<CalculatorInteractive slug="rounding-calculator"/>);const field=screen.getByLabelText('Decimal places') as HTMLInputElement;
 expect(field.step).toBe('1');expect(field.max).toBe('');
 fireEvent.change(field,{target:{value:'1.5'}});expect(field.validity.stepMismatch).toBe(true);expect(field.getAttribute('aria-invalid')).toBe('true');expect(observed.output).toBeNull();
});
it('exposes the exact factor maximum and rejects overflow before save/export',()=>{
 render(<CalculatorInteractive slug="factor-calculator"/>);const field=screen.getByLabelText('Integer from 2 to 1,000,000,000') as HTMLInputElement;
 expect(field.max).toBe('1000000000');
 fireEvent.change(field,{target:{value:'1000000001'}});expect(field.validity.rangeOverflow).toBe(true);expect(field.getAttribute('aria-invalid')).toBe('true');expect(observed.output).toBeNull();
});
it('links rejected required inputs to accessible field-specific errors and recovers valid zero',()=>{
 render(<CalculatorInteractive slug="ratio-calculator"/>);const a=screen.getByLabelText('First value'), b=screen.getByLabelText('Second value');
 fireEvent.change(a,{target:{value:''}});expect(a.getAttribute('aria-invalid')).toBe('true');const id=a.getAttribute('aria-describedby');expect(id).toBeTruthy();expect(document.getElementById(id!)?.textContent).toContain('First value');expect(observed.output).toBeNull();
 fireEvent.change(a,{target:{value:'0'}});expect(a.getAttribute('aria-invalid')).not.toBe('true');expect(observed.output).toEqual({result:0});
 fireEvent.change(b,{target:{value:'0'}});expect(b.getAttribute('aria-invalid')).toBe('true');expect(observed.output).toBeNull();
 fireEvent.change(b,{target:{value:'2'}});expect(observed.output).toEqual({result:0});
});
