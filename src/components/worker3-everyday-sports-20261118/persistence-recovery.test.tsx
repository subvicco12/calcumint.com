// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {EverydayPortal} from './portal';
import {everydayContract,everydayWorkflows} from '@/lib/worker3-everyday-sports-20261118/cohort';
const api=vi.hoisted(()=>({read:vi.fn(),restore:vi.fn()}));
vi.mock('@/app/admin/worker3-everyday-sports-20261118/actions',()=>({saveHistory:vi.fn(),loadProjects:vi.fn(),saveScenario:vi.fn(),readHistory:api.read,restoreScenario:api.restore,loadBusiness:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const owner='11111111-1111-4111-8111-111111111111';
const snapshot=()=>{const c=everydayContract(508),p=everydayWorkflows(508).execute(Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)])));return {...p.snapshot,input:Object.fromEntries(Object.entries(p.snapshot.input).reverse()),output:Object.fromEntries(Object.entries(p.snapshot.output).reverse())};};
it('acknowledges owned history restoration after JSONB key reordering',async()=>{
 api.read.mockResolvedValue({catalogId:508,snapshot:snapshot()});render(<EverydayPortal ownerId={owner} plan="pro"/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 expect(await screen.findByText('Verified owned snapshot restored')).toBeTruthy();expect(screen.queryByRole('alert')).toBeNull();
});
it('acknowledges an intentional scenario restore that replaces a different calculated draft',async()=>{
 api.restore.mockResolvedValue({catalogId:508,snapshot:snapshot()});render(<EverydayPortal ownerId={owner} plan="pro"/>);
 fireEvent.change(screen.getByLabelText('Transport cost',{exact:false}),{target:{value:'80'}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));
 expect(await screen.findByText('Verified owned snapshot restored')).toBeTruthy();expect((screen.getByLabelText('Transport cost',{exact:false}) as HTMLInputElement).value).toBe('300');
});
for(const change of ['draft','profile','owner'] as const)it('ignores a late history response after '+change+' changes',async()=>{
 let resolve!:(v:unknown)=>void;api.read.mockImplementation(()=>new Promise(r=>resolve=r));const view=render(<EverydayPortal ownerId={owner} plan="pro"/>);
 fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));await waitFor(()=>expect(api.read).toHaveBeenCalledOnce());
 if(change==='draft')fireEvent.change(screen.getByLabelText('Transport cost',{exact:false}),{target:{value:'123'}});
 if(change==='profile')fireEvent.change(screen.getByLabelText('Everyday profile'),{target:{value:'513'}});
 if(change==='owner')view.rerender(<EverydayPortal ownerId="22222222-2222-4222-8222-222222222222" plan="pro"/>);
 await act(async()=>resolve({catalogId:508,snapshot:snapshot()}));
 expect(screen.queryByText('Verified owned snapshot restored')).toBeNull();expect(screen.queryByLabelText('Calculation result')).toBeNull();
 if(change==='draft')expect((screen.getByLabelText('Transport cost',{exact:false}) as HTMLInputElement).value).toBe('123');
});
