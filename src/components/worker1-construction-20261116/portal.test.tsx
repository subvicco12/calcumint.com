// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {ConstructionPortal} from './portal';
import {constructionContracts,constructionWorkflows} from '@/lib/worker1-construction-20261116/cohort';
const api=vi.hoisted(()=>({history:vi.fn(),projects:vi.fn(),save:vi.fn(),restore:vi.fn(),read:vi.fn(),business:vi.fn()}));
vi.mock('@/app/admin/worker1-construction-20261116/actions',()=>({saveHistory:api.history,loadProjects:api.projects,saveScenario:api.save,restoreScenario:api.restore,readHistory:api.read,loadBusiness:api.business}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const owner='11111111-1111-4111-8111-111111111111';
it.each(constructionContracts)('private Final renderer and error recovery preserve exact #$catalogId inputs',c=>{
 render(<ConstructionPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Construction profile'),{target:{value:String(c.catalogId)}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByLabelText('Calculation result')).toBeTruthy();expect(screen.getByText(/Binary64 calculation/)).toBeTruthy();
 const f=c.fields[0];fireEvent.change(screen.getByLabelText(f.label,{exact:false}),{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByLabelText('Calculation result')).toBeNull();
 fireEvent.change(screen.getByLabelText(f.label,{exact:false}),{target:{value:String(f.defaultValue)}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.queryByRole('alert')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));expect(screen.getByRole('alert').textContent).toContain('Pro');
});
it('retains a stable authenticated history request after uncertain transport and checks scenario restore identity',async()=>{
 api.history.mockRejectedValueOnce(Error('Lost confirmation')).mockResolvedValue({id:'history'});api.projects.mockResolvedValue({projects:[{id:'project',name:'Project'}]});
 render(<ConstructionPortal ownerId={owner} plan="business"/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByText('Lost confirmation');
 fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByText(/Authenticated immutable history saved/);expect(api.history.mock.calls[0][0].requestId).toBe(api.history.mock.calls[1][0].requestId);
 fireEvent.click(screen.getByRole('button',{name:'Load owned projects'}));await screen.findByText('Owned projects loaded');
 const packet=constructionWorkflows(343).execute({lengthMeters:'2',widthMeters:'3',depthMeters:'.5',wastePercent:'0'});api.restore.mockResolvedValue({catalogId:343,snapshot:packet.snapshot});
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));await waitFor(()=>expect((screen.getByLabelText('Length',{exact:false}) as HTMLInputElement).value).toBe('2'));
 expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByText(/Team writes, API\/embed grants/)).toBeTruthy();
});
it('shows a verified historical underflow snapshot read-only without forcing a new capture',async()=>{
 const c=constructionContracts.find(c=>c.catalogId===343)!;const input={lengthMeters:1e-200,widthMeters:1e-200,depthMeters:1e-200,wastePercent:0};
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};api.read.mockResolvedValue({catalogId:343,snapshot});
 render(<ConstructionPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Construction profile'),{target:{value:'343'}});
 fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 await waitFor(()=>expect(screen.getByLabelText('Verified historical construction snapshot').textContent).toContain('"value": 0'));
 expect(screen.getByText('Recorded result unit: m³')).toBeTruthy();expect(screen.queryByLabelText('Calculation result')).toBeNull();expect((screen.getByLabelText('Length',{exact:false}) as HTMLInputElement).value).toBe('5');
});
it('does not overwrite an uncalculated draft with a late history response',async()=>{
 let resolve!:(v:unknown)=>void;api.read.mockImplementation(()=>new Promise(r=>resolve=r));
 render(<ConstructionPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 await waitFor(()=>expect(api.read).toHaveBeenCalledTimes(1));fireEvent.change(screen.getByLabelText('Length',{exact:false}),{target:{value:'123'}});
 const packet=constructionWorkflows(343).execute({lengthMeters:'5',widthMeters:'4',depthMeters:'.1',wastePercent:'10'});
 resolve({catalogId:343,snapshot:packet.snapshot});await new Promise(r=>setTimeout(r,20));
 expect((screen.getByLabelText('Length',{exact:false}) as HTMLInputElement).value).toBe('123');expect(screen.queryByLabelText('Calculation result')).toBeNull();
});
