import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({client:null as unknown,plan:{projects:true,scenarios:true},history:vi.fn(),scenario:vi.fn(),business:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>mock.client}));
vi.mock('@/lib/account-persistence',()=>({readAccountEntitlements:async()=>mock.plan}));
vi.mock('@/app/account/actions',()=>({saveCalculationHistory:mock.history,saveProjectScenario:mock.scenario}));
vi.mock('@/app/admin/calculator-factory/actions',()=>({factoryBusinessWorkspace:mock.business}));
import {saveConstructionHistory,saveConstructionScenario,restoreConstructionScenario,readConstructionHistory,constructionProjects,constructionBusinessProjects} from './account';
import {constructionContracts,constructionWorkflows} from './cohort';
const owner='11111111-1111-4111-8111-111111111111',project='22222222-2222-4222-8222-222222222222',request='33333333-3333-4333-8333-333333333333';
let rows:Record<string,unknown>,filters:[string,unknown][];
beforeEach(()=>{
 rows={calculation_projects:{id:project,name:'Project'}};filters=[];mock.plan={projects:true,scenarios:true};mock.history.mockReset().mockResolvedValue({id:request});mock.scenario.mockReset().mockResolvedValue(undefined);mock.business.mockReset().mockResolvedValue({role:'member',projects:[],sharing:{available:false}});
 mock.client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from:(table:string)=>{const q={select:()=>q,eq:(k:string,v:unknown)=>{filters.push([k,v]);return q;},order:()=>q,limit:async()=>({data:[rows[table]],error:null}),maybeSingle:async()=>({data:rows[table]??null,error:null})};return q;}};
});
it.each(constructionContracts)('unit: actual #$catalogId snapshot goes through existing atomic history and scenario actions',async c=>{
 const packet=constructionWorkflows(c.catalogId).execute(Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)])));
 expect(await saveConstructionHistory({expectedOwnerId:owner,requestId:request,packet})).toEqual({id:request});
 expect(mock.history).toHaveBeenLastCalledWith({...packet.snapshot,expectedOwnerId:owner,requestId:request});
 expect(await saveConstructionScenario({expectedOwnerId:owner,projectId:project,requestId:request,name:'Case',packet})).toEqual({historyId:request,scenarioId:request});
 expect(Object.fromEntries(mock.scenario.mock.calls[0][0])).toMatchObject({expectedOwnerId:owner,projectId:project,historyId:request,requestId:request,name:'Case'});
 rows.saved_scenarios={id:request,name:'Case',project_id:project,calculator_slug:c.slug,calculator_version:1,input_data:packet.snapshot.input,output_data:packet.snapshot.output};
 expect(await restoreConstructionScenario({expectedOwnerId:owner,scenarioId:request})).toMatchObject({catalogId:c.catalogId,snapshot:packet.snapshot});
 rows.calculation_history=rows.saved_scenarios;expect(await readConstructionHistory({expectedOwnerId:owner,historyId:request})).toMatchObject({catalogId:c.catalogId,snapshot:packet.snapshot});
 expect(filters).toContainEqual(['user_id',owner]);
});
it('unit: stale owner, downgrade, foreign project and forged packet fail before persistence',async()=>{
 const packet=constructionWorkflows(343).execute({lengthMeters:'3',widthMeters:'2',depthMeters:'.25',wastePercent:'20'});
 await expect(constructionProjects(project)).rejects.toThrow('Account context changed');mock.plan={projects:false,scenarios:false};await expect(constructionProjects(owner)).rejects.toThrow('Pro or Business');
 mock.plan={projects:true,scenarios:true};rows.calculation_projects=null;await expect(saveConstructionScenario({expectedOwnerId:owner,projectId:project,requestId:request,name:'Case',packet})).rejects.toThrow('Owned project');
 await expect(saveConstructionHistory({expectedOwnerId:owner,requestId:request,packet:{...packet,snapshot:{...packet.snapshot,output:{value:99}}}})).rejects.toThrow();expect(mock.history).not.toHaveBeenCalled();expect(mock.scenario).not.toHaveBeenCalled();
});
it('unit: context read cannot activate Business writes or native commercial capability',async()=>{
 expect(await constructionBusinessProjects({expectedOwnerId:owner,organizationId:project})).toMatchObject({role:'member',delivery:{available:false}});
 mock.business.mockRejectedValue(Error('Current organization permission required'));await expect(constructionBusinessProjects({expectedOwnerId:owner,organizationId:project})).rejects.toThrow('permission');
});
