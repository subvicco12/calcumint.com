// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CalculatorFactorySensitivity} from './calculator-factory-sensitivity';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
it('shows real candidate differences without modifying current calculation and clears stale previews',()=>{
 const packet=getFactoryWorkflows(218).execute({x:'12'});
 render(<CalculatorFactorySensitivity packet={packet} plan="pro"/>);
 fireEvent.change(screen.getByLabelText('Candidate values'),{target:{value:'-2,0,3'}});fireEvent.click(screen.getByRole('button',{name:'Preview what-if'}));
 expect(screen.getByRole('table',{name:'What-if comparison'}).textContent).toContain('-140');expect(packet.snapshot.output.result).toBe(144);
 fireEvent.change(screen.getByLabelText('Candidate values'),{target:{value:'bad'}});expect(screen.queryByRole('table')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Preview what-if'}));expect(screen.getByRole('alert')).toBeTruthy();
});
it('keeps Free mathematics intact while denying optional paid previews',()=>{
 render(<CalculatorFactorySensitivity packet={getFactoryWorkflows(220).execute({x:'4'})} plan="free"/>);
 expect((screen.getByRole('button',{name:'Preview what-if'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByText(/Pro or Business/)).toBeTruthy();
});
