// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {StatisticsPortal} from './portal';
import {statisticsContracts,statisticsWorkflows} from '@/lib/worker2-statistics-b-20261117/cohort';
const api=vi.hoisted(()=>({history:vi.fn(),projects:vi.fn(),save:vi.fn(),restore:vi.fn(),read:vi.fn(),business:vi.fn()}));
vi.mock('@/app/admin/worker2-statistics-b-20261117/actions',()=>({saveHistory:api.history,loadProjects:api.projects,saveScenario:api.save,restoreScenario:api.restore,readHistory:api.read,loadBusiness:api.business}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const owner='11111111-1111-4111-8111-111111111111';
it.each(statisticsContracts)('renders Final result, strict array errors and keyboard-capable form for#$catalogId',c=>{
 render(<StatisticsPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Statistics profile'),{target:{value:String(c.catalogId)}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByLabelText('Calculation result')).toBeTruthy();
 const first=c.fields[0];fireEvent.change(screen.getByLabelText(first.label,{exact:false}),{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByLabelText('Calculation result')).toBeNull();
 fireEvent.change(screen.getByLabelText(first.label,{exact:false}),{target:{value:first.defaultValue}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.queryByRole('alert')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));expect(screen.getByRole('alert').textContent).toContain('Pro');
 expect(screen.queryByRole('option',{name:/#298/})).toBeNull();
});
it('retries history with the same UUID and restores array-valued owned scenarios',async()=>{
 api.history.mockRejectedValueOnce(Error('Lost confirmation')).mockResolvedValue({id:'history'});
 render(<StatisticsPortal ownerId={owner} plan="business"/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByText('Lost confirmation');fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByText(/Authenticated immutable history saved/);expect(api.history.mock.calls[0][0].requestId).toBe(api.history.mock.calls[1][0].requestId);
 const packet=statisticsWorkflows(296).execute({values:'[9,8,7,6]',quartileNumber:'3'});api.restore.mockResolvedValue({catalogId:296,snapshot:packet.snapshot});
 fireEvent.change(screen.getByLabelText('Saved scenario ID'),{target:{value:'scenario'}});fireEvent.click(screen.getByRole('button',{name:'Restore saved scenario'}));await waitFor(()=>expect((screen.getByLabelText('Observed values (JSON array)',{exact:false}) as HTMLInputElement).value).toBe('[9,8,7,6]'));
 expect((screen.getByLabelText('Quartile number',{exact:false}) as HTMLSelectElement).value).toBe('3');expect(screen.queryByRole('alert')).toBeNull();
});
it('does not let a late owned restore overwrite an edited array draft',async()=>{
 let resolve!:(value:unknown)=>void;api.read.mockImplementation(()=>new Promise(r=>resolve=r));
 render(<StatisticsPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));await waitFor(()=>expect(api.read).toHaveBeenCalled());
 fireEvent.change(screen.getByLabelText('Observed values (JSON array)',{exact:false}),{target:{value:'[8,9]'}});
 resolve({catalogId:296,snapshot:statisticsWorkflows(296).execute({values:'[1,2,3,4]',quartileNumber:'1'}).snapshot});
 await new Promise(r=>setTimeout(r,20));expect((screen.getByLabelText('Observed values (JSON array)',{exact:false}) as HTMLInputElement).value).toBe('[8,9]');expect(screen.queryByLabelText('Calculation result')).toBeNull();
});
