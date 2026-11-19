// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {FoodPortal} from './portal';
import {foodContracts} from '@/lib/worker3-food-quantity-20261119/cohort';
const api=vi.hoisted(()=>({history:vi.fn(),projects:vi.fn(),save:vi.fn(),restore:vi.fn(),read:vi.fn(),business:vi.fn()}));
vi.mock('@/app/admin/worker3-food-quantity-20261119/actions',()=>({saveHistory:api.history,loadProjects:api.projects,saveScenario:api.save,restoreScenario:api.restore,readHistory:api.read,loadBusiness:api.business}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const owner='11111111-1111-4111-8111-111111111111';
it.each(foodContracts)('private Final renderer and error recovery preserve exact #$catalogId inputs',c=>{
 render(<FoodPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Food profile'),{target:{value:String(c.catalogId)}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByLabelText('Calculation result')).toBeTruthy();expect(screen.getByText(/Binary64 calculation/)).toBeTruthy();
 const f=c.fields[0];fireEvent.change(screen.getByLabelText(f.label,{exact:false}),{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByLabelText('Calculation result')).toBeNull();
 fireEvent.change(screen.getByLabelText(f.label,{exact:false}),{target:{value:String(f.defaultValue)}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.queryByRole('alert')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));expect(screen.getByRole('alert').textContent).toContain('Pro');
});
