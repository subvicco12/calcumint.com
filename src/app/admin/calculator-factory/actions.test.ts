import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({client:null as unknown,entitlements:{projects:true,scenarios:true},history:vi.fn(),scenario:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>mock.client}));
vi.mock('@/lib/account-persistence',()=>({readAccountEntitlements:async()=>mock.entitlements}));
vi.mock('@/app/account/actions',()=>({saveCalculationHistory:mock.history,saveProjectScenario:mock.scenario}));
import {factoryProjects,factorySaveScenario,factoryRestoreScenario,factoryBusinessWorkspace} from './actions';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
const owner='11111111-1111-4111-8111-111111111111',request='22222222-2222-4222-8222-222222222222',project='33333333-3333-4333-8333-333333333333';
let rows:Record<string,unknown>;
let filters:[string,unknown][];
beforeEach(()=>{
 filters=[];rows={calculation_projects:{id:project,name:'Project'}};
 mock.entitlements={projects:true,scenarios:true};mock.history.mockReset().mockResolvedValue({id:request});mock.scenario.mockReset().mockResolvedValue(undefined);
 mock.client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from:(table:string)=>{
 const query={select:()=>query,eq:(key:string,value:unknown)=>{filters.push([key,value]);return query;},order:()=>query,limit:async()=>({data:[rows[table]],error:null}),maybeSingle:async()=>({data:rows[table]??null,error:null})};return query;
 }};
});
it('unit: denies stale owners and downgraded plans before reading projects',async()=>{
 await expect(factoryProjects(request)).rejects.toThrow('Account context changed');
 mock.entitlements={projects:false,scenarios:false};await expect(factoryProjects(owner)).rejects.toThrow('Pro or Business');
 expect(filters).toEqual([]);
});
it('unit: captures verified history through existing atomic account actions with stable IDs',async()=>{
 const packet=getFactoryWorkflows(218).execute({x:'4'});
 expect(await factorySaveScenario({expectedOwnerId:owner,projectId:project,name:'Case',requestId:request,packet})).toEqual({historyId:request,scenarioId:request});
 expect(mock.history).toHaveBeenCalledWith({...packet.snapshot,requestId:request,expectedOwnerId:owner});
 const form=mock.scenario.mock.calls[0][0] as FormData;
 expect(Object.fromEntries(form)).toEqual({expectedOwnerId:owner,projectId:project,historyId:request,name:'Case',requestId:request});
 expect(filters).toContainEqual(['user_id',owner]);
});
it('unit: rejects cross tenant projects and tampered packets without persistence',async()=>{
 const packet=getFactoryWorkflows(218).execute({x:'4'});rows.calculation_projects=null;
 await expect(factorySaveScenario({expectedOwnerId:owner,projectId:project,name:'Case',requestId:request,packet})).rejects.toThrow('Owned project unavailable');
 expect(mock.history).not.toHaveBeenCalled();
});
it('unit: restore verifies owned scenario and project and rejects corrupt output',async()=>{
 const {snapshot}=getFactoryWorkflows(218).execute({x:'4'});
 rows.saved_scenarios={id:request,name:'Case',project_id:project,calculator_slug:snapshot.calculatorSlug,calculator_version:snapshot.calculatorVersion,input_data:snapshot.input,output_data:snapshot.output};
 expect(await factoryRestoreScenario({expectedOwnerId:owner,scenarioId:request})).toMatchObject({catalogId:218,snapshot});
 (rows.saved_scenarios as Record<string,unknown>).output_data={result:99};
 await expect(factoryRestoreScenario({expectedOwnerId:owner,scenarioId:request})).rejects.toThrow();
});

it('unit: shared containers recheck actual Business plan and current membership each call',async()=>{
 rows.profiles={plan:'business'};rows.organization_members={role:'member'};rows.business_projects={id:project,name:'Team project',status:'active'};
 expect(await factoryBusinessWorkspace({expectedOwnerId:owner,organizationId:project})).toMatchObject({role:'member',sharing:{available:false}});
 rows.organization_members=null;
 await expect(factoryBusinessWorkspace({expectedOwnerId:owner,organizationId:project})).rejects.toThrow('Current organization permission');
 rows.profiles={plan:'pro'};
 await expect(factoryBusinessWorkspace({expectedOwnerId:owner,organizationId:project})).rejects.toThrow('Business workspace access');
});
