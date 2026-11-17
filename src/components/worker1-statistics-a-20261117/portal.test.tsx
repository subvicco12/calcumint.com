// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {StatisticsPortal} from './portal';
import {statisticsContracts,statisticsWorkflows} from '@/lib/worker1-statistics-a-20261117/cohort';
const api=vi.hoisted(()=>({save:vi.fn(),history:vi.fn(),scenario:vi.fn(),restore:vi.fn(),projects:vi.fn(),business:vi.fn()}));
vi.mock('@/app/admin/worker1-statistics-a-20261117/actions',()=>({saveHistory:api.save,readHistory:api.history,saveScenario:api.scenario,restoreScenario:api.restore,loadProjects:api.projects,loadBusiness:api.business}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const owner='11111111-1111-4111-8111-111111111111';
it.each(statisticsContracts)('Final dataset labels, keyboard form and accessible refusal recover for #$catalogId',c=>{
 render(<StatisticsPortal ownerId={owner} plan="free"/>);fireEvent.change(screen.getByLabelText('Statistics profile'),{target:{value:String(c.catalogId)}});
 fireEvent.submit(screen.getByRole('button',{name:'Calculate'}).closest('form')!);expect(screen.getByLabelText('Calculation result')).toBeTruthy();
 fireEvent.change(screen.getByLabelText(c.fields[0].label),{target:{value:'1,,2'}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByLabelText('Calculation result')).toBeNull();expect(screen.queryByRole('button',{name:'Save calculation'})).toBeNull();
 fireEvent.change(screen.getByLabelText(c.fields[0].label),{target:{value:String(c.fields[0].defaultValue)}});fireEvent.submit(screen.getByRole('button',{name:'Calculate'}).closest('form')!);expect(screen.queryByRole('alert')).toBeNull();
});
it('restores array observations through owned history, unlike the scalar-only workbench',async()=>{
 api.history.mockResolvedValue({catalogId:294,snapshot:statisticsWorkflows(294).execute({values:'0,10,20',weights:'1,2,1'}).snapshot});
 render(<StatisticsPortal ownerId={owner} plan="business"/>);fireEvent.change(screen.getByLabelText('Statistics profile'),{target:{value:'294'}});fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 await waitFor(()=>expect((screen.getByLabelText('Observations (comma-separated)') as HTMLInputElement).value).toBe('0, 10, 20'));
 expect(screen.getByLabelText('Calculation result')).toBeTruthy();expect(screen.queryByRole('alert')).toBeNull();
});
it('keeps weighted cancellation history read-only and does not permit a new save',async()=>{
 api.history.mockResolvedValue({catalogId:294,snapshot:{calculatorSlug:'weighted-mean-calculator',calculatorVersion:1,input:{values:[1e50,1,-1e50],weights:[1,1,1]},output:{weightedMean:0,totalWeight:3,count:3,steps:['Weighted sum = 0','Total weight = 3','Weighted mean = 0']}}});
 render(<StatisticsPortal ownerId={owner} plan="business"/>);fireEvent.change(screen.getByLabelText('Statistics profile'),{target:{value:'294'}});fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 await screen.findByLabelText('Verified historical statistics snapshot');expect(screen.queryByLabelText('Calculation result')).toBeNull();expect(screen.queryByRole('button',{name:'Save calculation'})).toBeNull();
});
it('ignores a late history response after draft edits',async()=>{
 let resolve!:(x:unknown)=>void;api.history.mockImplementation(()=>new Promise(r=>resolve=r));
 render(<StatisticsPortal ownerId={owner} plan="pro"/>);fireEvent.change(screen.getByLabelText('Saved history ID'),{target:{value:'history'}});fireEvent.click(screen.getByRole('button',{name:'Restore owned history'}));
 fireEvent.change(screen.getByLabelText('X observations (comma-separated)'),{target:{value:'9,8,7'}});
 resolve({catalogId:292,snapshot:statisticsWorkflows(292).execute({xValues:'1,2,3',yValues:'2,4,6'}).snapshot});await new Promise(r=>setTimeout(r,20));expect((screen.getByLabelText('X observations (comma-separated)') as HTMLInputElement).value).toBe('9,8,7');expect(screen.queryByLabelText('Calculation result')).toBeNull();
});
