/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
const captured=vi.hoisted(()=>({output:null as unknown,input:null as unknown}));
vi.mock('@/components/use-calculator-plan',()=>({useCalculatorPlan:()=> 'free'}));
vi.mock('@/components/calculator-account-actions',()=>({CalculatorAccountActions:(props:{input:unknown;output:unknown})=>{Object.assign(captured,props);return null;}}));
import {CalculatorInteractive} from '@/components/calculator-interactive';
afterEach(cleanup);
it.each(['9007199254740993','1e-400','0.10000000000000001'])('refuses loss of a registered percentage input lexeme %s before account capture',text=>{
 render(<CalculatorInteractive slug="percentage-of-value-calculator"/>);
 const baseline=structuredClone(captured.output);
 expect(baseline).not.toBeNull();
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:text}});
 expect(captured.output).toBeNull();
 expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:'0'}});
 expect(captured.output).toEqual({result:0});
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:'250'}});
 expect(captured.output).toEqual(baseline);
});
