import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({rpcError:false}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
vi.mock('next/navigation',()=>({redirect:(url:string)=>{throw Error(url);}}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({
 auth:{getUser:async()=>({data:{user:{id:'owner-a'}},error:null})},
 rpc:async(_name:string,args:Record<string,unknown>)=>({data:state.rpcError?null:args.p_request_id,error:state.rpcError?{}:null}),
 from:(table:string)=>{const q={select:()=>q,eq:()=>q,insert:()=>q,update:()=>q,delete:()=>q,
  maybeSingle:async()=>({data:table==='profiles'?{plan:'pro'}:table==='calculation_projects'?{id:'project-a'}:{calculator_slug:'slope-calculator',calculator_version:1,input_data:{rise:6,run:3},output_data:{result:1.999}},error:null}),
  then:(resolve:(r:unknown)=>unknown)=>Promise.resolve({error:null}).then(resolve)};return q;}
})}));
import {revalidatePath} from 'next/cache';
import {createCalculationProject,deleteCalculationProject,saveProjectScenario,updateProjectScenarioName,deleteProjectScenario} from './actions';
function form(){const f=new FormData();for(const [key,value] of Object.entries({expectedOwnerId:'owner-a',projectId:'project-a',historyId:'history-a',scenarioId:'scenario-a',name:'Original name',requestId:'11111111-1111-4111-8111-111111111111'}))f.set(key,value);return f;}
beforeEach(()=>{state.rpcError=false;vi.clearAllMocks();});
it('refreshes the selected project after an acknowledged atomic scenario copy',async()=>{
 await saveProjectScenario(form());expect(revalidatePath).toHaveBeenCalledWith('/account');expect(revalidatePath).toHaveBeenCalledWith('/account/projects');expect(revalidatePath).toHaveBeenCalledWith('/account/projects/project-a');
});
it.each([createCalculationProject,deleteCalculationProject,updateProjectScenarioName,deleteProjectScenario])('refreshes project browsing after a successful workspace mutation',async action=>{
 await action(form());expect(revalidatePath).toHaveBeenCalledWith('/account/projects');
});
it.each([updateProjectScenarioName,deleteProjectScenario])('invalidates project detail metadata after scenario mutation without trusting a supplied project',async action=>{
 const data=form();data.delete('projectId');await action(data);expect(revalidatePath).toHaveBeenCalledWith('/account/projects/[id]','page');
});
it('does not refresh as an acknowledged completion after an unconfirmed copy',async()=>{
 state.rpcError=true;await expect(saveProjectScenario(form())).rejects.toThrow('Could not save scenario');expect(revalidatePath).not.toHaveBeenCalled();
});
