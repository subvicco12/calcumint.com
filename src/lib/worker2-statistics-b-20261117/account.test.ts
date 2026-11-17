import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({client:null as unknown,plan:{projects:true,scenarios:true},history:vi.fn(),scenario:vi.fn(),business:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>mock.client}));
vi.mock('@/lib/account-persistence',()=>({readAccountEntitlements:async()=>mock.plan}));
vi.mock('@/app/account/actions',()=>({saveCalculationHistory:mock.history,saveProjectScenario:mock.scenario}));
vi.mock('@/app/admin/calculator-factory/actions',()=>({factoryBusinessWorkspace:mock.business}));
import {saveStatisticsHistory,saveStatisticsScenario,restoreStatisticsScenario,readStatisticsHistory,statisticsProjects,statisticsBusinessProjects} from './account';
import {statisticsContracts,statisticsWorkflows} from './cohort';
const owner='11111111-1111-4111-8111-111111111111',project='22222222-2222-4222-8222-222222222222',request='33333333-3333-4333-8333-333333333333';
let rows:Record<string,unknown>,filters:[string,unknown][];
beforeEach(()=>{
 rows={calculation_projects:{id:project,name:'Project'},platform_admins:{role:'reviewer',active:true}};filters=[];mock.plan={projects:true,scenarios:true};mock.history.mockReset().mockResolvedValue({id:request});mock.scenario.mockReset().mockResolvedValue(undefined);mock.business.mockReset().mockResolvedValue({role:'member',projects:[],sharing:{available:false}});
 mock.client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from:(table:string)=>{const q={select:()=>q,eq:(k:string,v:unknown)=>{filters.push([k,v]);return q;},order:()=>q,limit:async()=>({data:[rows[table]],error:null}),maybeSingle:async()=>({data:rows[table]??null,error:null})};return q;}};
});
it.each(statisticsContracts)('unit: actual #$catalogId snapshot goes through existing atomic history and scenario actions',async c=>{
 const packet=statisticsWorkflows(c.catalogId).execute(Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)])));
 expect(await saveStatisticsHistory({expectedOwnerId:owner,requestId:request,packet})).toEqual({id:request});
 expect(mock.history).toHaveBeenLastCalledWith({...packet.snapshot,expectedOwnerId:owner,requestId:request});
 expect(await saveStatisticsScenario({expectedOwnerId:owner,projectId:project,requestId:request,name:'Case',packet})).toEqual({historyId:request,scenarioId:request});
 expect(Object.fromEntries(mock.scenario.mock.calls[0][0])).toMatchObject({expectedOwnerId:owner,projectId:project,historyId:request,requestId:request,name:'Case'});
 rows.saved_scenarios={id:request,name:'Case',project_id:project,calculator_slug:c.slug,calculator_version:1,input_data:packet.snapshot.input,output_data:packet.snapshot.output};
 expect(await restoreStatisticsScenario({expectedOwnerId:owner,scenarioId:request})).toMatchObject({catalogId:c.catalogId,snapshot:packet.snapshot});
 rows.calculation_history=rows.saved_scenarios;expect(await readStatisticsHistory({expectedOwnerId:owner,historyId:request})).toMatchObject({catalogId:c.catalogId,snapshot:packet.snapshot});
 expect(filters).toContainEqual(['user_id',owner]);
});
it('unit: stale owner, downgrade, foreign project and forged packet fail before persistence',async()=>{
 const packet=statisticsWorkflows(296).execute({values:'[1,2,3,4]',quartileNumber:'1'});
 await expect(statisticsProjects(project)).rejects.toThrow('Account context changed');mock.plan={projects:false,scenarios:false};await expect(statisticsProjects(owner)).rejects.toThrow('Pro or Business');
 mock.plan={projects:true,scenarios:true};rows.calculation_projects=null;await expect(saveStatisticsScenario({expectedOwnerId:owner,projectId:project,requestId:request,name:'Case',packet})).rejects.toThrow('Owned project');
 await expect(saveStatisticsHistory({expectedOwnerId:owner,requestId:request,packet:{...packet,snapshot:{...packet.snapshot,output:{value:99}}}})).rejects.toThrow();expect(mock.history).not.toHaveBeenCalled();expect(mock.scenario).not.toHaveBeenCalled();
});
it('unit: context read cannot activate Business writes or native commercial capability',async()=>{
 expect(await statisticsBusinessProjects({expectedOwnerId:owner,organizationId:project})).toMatchObject({role:'member',delivery:{available:false}});
 mock.business.mockRejectedValue(Error('Current organization permission required'));await expect(statisticsBusinessProjects({expectedOwnerId:owner,organizationId:project})).rejects.toThrow('permission');
});
it('unit: revoked review access cannot save history or read private Business context',async()=>{
 rows.platform_admins=null;
 const packet=statisticsWorkflows(296).execute({values:'[1,2,3,4]',quartileNumber:'1'});
 await expect(saveStatisticsHistory({expectedOwnerId:owner,requestId:request,packet})).rejects.toThrow('review access');
 await expect(statisticsBusinessProjects({expectedOwnerId:owner,organizationId:project})).rejects.toThrow('review access');
 expect(mock.history).not.toHaveBeenCalled();expect(mock.business).not.toHaveBeenCalled();
});
