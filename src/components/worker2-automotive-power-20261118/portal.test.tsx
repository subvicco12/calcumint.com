// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {PowerPortal} from './portal';

vi.mock('@/app/admin/worker2-automotive-power-20261118/actions',()=>({
 saveHistory:vi.fn(),loadProjects:vi.fn(),saveScenario:vi.fn(),restoreScenario:vi.fn(),readHistory:vi.fn(),
}));
afterEach(cleanup);
it('presents both exact candidate identities and clears the old result on edit and refusal',()=>{
 render(<PowerPortal ownerId="fixture-owner" plan="pro"/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByText('Mechanical horsepower',{exact:true})).toBeTruthy();
 fireEvent.change(screen.getByRole('combobox',{name:'Power profile'}),{target:{value:'476'}});
 expect(screen.getByText(/automotive.engine-horsepower@1/)).toBeTruthy();
 expect(screen.queryByText('Mechanical horsepower',{exact:true})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByText('Mechanical horsepower',{exact:true})).toBeTruthy();
 fireEvent.change(screen.getByRole('textbox',{name:/Engine speed/}),{target:{value:''}});
 expect(screen.queryByText('Mechanical horsepower',{exact:true})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
});
