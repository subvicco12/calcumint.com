// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const fixture=vi.hoisted(()=>({plan:'free' as 'free'|'pro'|'business'}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>fixture.plan}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
for(const plan of ['free','pro','business']as const)it(`${plan} renders independent cost/revenue crossover values and preserves the core answer`,()=>{
 fixture.plan=plan;render(<CalculatorInteractive slug="break-even-calculator"/>);
 expect(document.querySelector('.final-calculator-renderer .result-box[role=status]')?.textContent).toContain('500');
 const chart=screen.getByRole('img',{name:'Cost and revenue crossover'});expect(chart).toBeTruthy();
 const table=screen.getByRole('table',{name:'Cost and revenue at modeled quantities'});const rows=within(table).getAllByRole('row');expect(rows.map(r=>r.textContent)).toContain('50025,00025,0000');
 fireEvent.change(screen.getByLabelText('Fixed costs'),{target:{value:''}});expect(screen.queryByRole('img',{name:'Cost and revenue crossover'})).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
});
for(const plan of ['pro','business']as const)it(`${plan} solves target profit using the existing units engine and recovers from invalid targets`,()=>{
 fixture.plan=plan;render(<CalculatorInteractive slug="break-even-calculator"/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 fireEvent.change(screen.getByLabelText('Target profit'),{target:{value:'5000'}});const panel=screen.getByRole('region',{name:'Target profit analysis'});expect(within(panel).getByText('750 units')).toBeTruthy();expect(within(panel).getByText('5,000')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Target profit'),{target:{value:'-1'}});expect(within(panel).queryByText('750 units')).toBeNull();expect(within(panel).getByRole('alert')).toBeTruthy();expect(document.querySelector('.final-calculator-renderer .result-box[role=status]')?.textContent).toContain('500');
 fireEvent.change(screen.getByLabelText('Target profit'),{target:{value:'0'}});expect(within(panel).getByText('500 units')).toBeTruthy();
});
it('keeps a valid extreme core answer when the optional chart exceeds finite range',()=>{
 fixture.plan='free';render(<CalculatorInteractive slug="break-even-calculator"/>);
 fireEvent.change(screen.getByLabelText('Variable cost per unit'),{target:{value:'0'}});fireEvent.change(screen.getByLabelText('Price per unit'),{target:{value:'1'}});fireEvent.change(screen.getByLabelText('Fixed costs'),{target:{value:'1e308'}});
 expect(document.querySelector('.final-calculator-renderer .result-box[role=status]')).toBeTruthy();expect(screen.queryByRole('img',{name:'Cost and revenue crossover'})).toBeNull();expect(screen.getByRole('alert').textContent).toContain('core result is unchanged');
});
it('keeps target-profit modeling a capability while Free retains the complete core and crossover',()=>{
 fixture.plan='free';render(<CalculatorInteractive slug="break-even-calculator"/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 expect(screen.queryByLabelText('Target profit')).toBeNull();expect(screen.queryByRole('region',{name:'Target profit analysis'})).toBeNull();expect(screen.getByRole('img',{name:'Cost and revenue crossover'})).toBeTruthy();
});
