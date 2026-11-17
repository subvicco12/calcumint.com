// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {CalculatorFactoryDownloads} from './calculator-factory-downloads';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
it('downloads real verified artifacts and revokes the object URL',()=>{
 vi.useFakeTimers();
 const create=vi.fn(()=> 'blob:test'),revoke=vi.fn(),click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 Object.defineProperties(URL,{createObjectURL:{value:create,configurable:true},revokeObjectURL:{value:revoke,configurable:true}});
 const flow=getFactoryWorkflows(218),packet=flow.execute({x:'2'});
 render(<CalculatorFactoryDownloads workflows={flow} packet={packet} title="Square" plan="pro"/>);
 for(const label of ['JSON','CSV','PDF'])fireEvent.click(screen.getByRole('button',{name:`Download ${label}`}));
 vi.runAllTimers();
 expect(click).toHaveBeenCalledTimes(3);expect(create).toHaveBeenCalledTimes(3);expect(revoke).toHaveBeenCalledTimes(3);
 expect(create.mock.calls.every(call=>(call as unknown[])[0] instanceof Blob)).toBe(true);
});
it('retains an accessible denial and creates no artifact for Free',()=>{
 const flow=getFactoryWorkflows(218),packet=flow.execute({x:'2'});
 render(<CalculatorFactoryDownloads workflows={flow} packet={packet} title="Square" plan="free"/>);
 fireEvent.click(screen.getByRole('button',{name:'Download PDF'}));expect(screen.getByRole('alert').textContent).toContain('Pro');
});
