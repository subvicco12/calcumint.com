// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {CalculatorFactoryPortal} from './calculator-factory-portal';
const calls=vi.hoisted(()=>({save:vi.fn()}));
vi.mock('@/app/account/actions',()=>({saveCalculationHistory:calls.save}));
afterEach(()=>{cleanup();vi.clearAllMocks();});
it('hosts the exact-zero successor in the private portal with persisted and shared Business controls',async()=>{
 calls.save.mockResolvedValue({id:'receipt'});
 render(<CalculatorFactoryPortal ownerId="11111111-1111-4111-8111-111111111111" plan="business"/>);
 fireEvent.change(screen.getByLabelText('Engineering contract'),{target:{value:'226'}});
 fireEvent.change(screen.getByLabelText('Dividend'),{target:{value:'1.5'}});
 fireEvent.change(screen.getByLabelText('Divisor'),{target:{value:'.5'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.queryByRole('alert')).toBeNull();
 expect(screen.getByRole('table',{name:'Exact signed remainder'}).textContent).toContain('0');
 expect(screen.getByRole('region',{name:'Persisted project scenarios'})).toBeTruthy();
 expect(screen.getByRole('region',{name:'Factory shared Business workspace'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));
 await waitFor(()=>expect(calls.save).toHaveBeenCalledTimes(1));
 expect(calls.save.mock.calls[0][0]).toMatchObject({calculatorSlug:'remainder-calculator',calculatorVersion:1,input:{a:1.5,b:.5},output:{result:0}});
});

it('retains independent legacy analysis for accepted inputs without relabeling exact-zero packets',()=>{
 render(<CalculatorFactoryPortal ownerId="11111111-1111-4111-8111-111111111111" plan="business"/>);
 fireEvent.change(screen.getByLabelText('Engineering contract'),{target:{value:'226'}});
 fireEvent.change(screen.getByLabelText('Dividend'),{target:{value:'17'}});
 fireEvent.change(screen.getByLabelText('Divisor'),{target:{value:'5'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('region',{name:'Exact-version analysis'})).toBeTruthy();
 expect(screen.getByRole('region',{name:'What-if sensitivity'})).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Dividend'),{target:{value:'1.5'}});
 fireEvent.change(screen.getByLabelText('Divisor'),{target:{value:'.5'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.queryByRole('region',{name:'Exact-version analysis'})).toBeNull();
 expect(screen.getByText(/Legacy analysis is unavailable/)).toBeTruthy();
 expect(screen.queryByRole('alert')).toBeNull();
});
