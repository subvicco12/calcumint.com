import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({plan:'pro',authError:false,profileError:false,historyError:false,projectError:false,countError:false,count:0 as number|null,history:{} as Record<string,unknown>,writes:[] as {table:string;value:Record<string,unknown>}[],filters:[] as string[]}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
vi.mock('next/navigation',()=>({redirect:(url:string)=>{throw new Error(`redirect ${url}`);}}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'owner-a'}},error:state.authError?{}:null})},from:(table:string)=>{
 let countOnly=false;
 const query={select:(_columns:string,options?:{head?:boolean})=>{countOnly=Boolean(options?.head);return query;},eq:(field:string,value:string)=>{state.filters.push(`${table}:${field}:${value}`);return query;},maybeSingle:async()=>table==='profiles'?{data:{plan:state.plan},error:state.profileError?{}:null}:table==='calculation_projects'?{data:{id:'project-a'},error:state.projectError?{}:null}:{data:state.history,error:state.historyError?{}:null},then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({count:countOnly?state.count:null,error:state.countError?{}:null}).then(resolve),insert:async(value:Record<string,unknown>)=>{state.writes.push({table,value});return {error:null};}};return query;
}})}));
import {saveCalculationHistory,saveProjectScenario} from './actions';
const legacy=()=>({calculator_slug:'slope-calculator',calculator_version:1,input_data:{rise:6,run:3},output_data:{result:1.999}});
const form=()=>{const f=new FormData();f.set('projectId','project-a');f.set('historyId','history-a');f.set('name','Legacy snapshot');return f;};
beforeEach(()=>{Object.assign(state,{plan:'pro',authError:false,profileError:false,historyError:false,projectError:false,countError:false,count:0,history:legacy(),writes:[],filters:[]});});
it.each(['pro','business'])('copies recorded Slope v1 on %s without recomputation or version upgrade',async plan=>{
 state.plan=plan;const before=JSON.stringify(state.history);await saveProjectScenario(form());
 expect(state.writes).toEqual([{table:'saved_scenarios',value:{user_id:'owner-a',project_id:'project-a',name:'Legacy snapshot',...legacy()}}]);
 expect(JSON.stringify(state.history)).toBe(before);
 expect(state.filters).toContain('calculation_history:user_id:owner-a');expect(state.filters).toContain('calculation_projects:user_id:owner-a');
});
it.each([
 {calculator_version:undefined},{input_data:null},{output_data:undefined},{output_data:{result:Infinity}},
 {input_data:{x1:0,y1:0,x2:3,y2:6}},{calculator_version:2},{calculator_version:3},
])('rejects corrupt or incompatible historical Slope fields %j before scenario writes',async patch=>{
 Object.assign(state.history,patch);await expect(saveProjectScenario(form())).rejects.toThrow();expect(state.writes).toHaveLength(0);
});
it('preserves recorded coordinate v2 and arbitrary older non-Slope versions',async()=>{
 state.history={calculator_slug:'slope-calculator',calculator_version:2,input_data:{x1:0,y1:0,x2:3,y2:6},output_data:{value:1.999,dx:3,dy:6,steps:['historical']}};
 await saveProjectScenario(form());expect(state.writes[0].value.output_data).toEqual(state.history.output_data);
 state.history={calculator_slug:'retired-calculator',calculator_version:7,input_data:{nested:[0,-2]},output_data:{value:0}};
 await saveProjectScenario(form());expect(state.writes[1].value.calculator_version).toBe(7);
});
it.each(['historyError','projectError','profileError','authError'] as const)('fails closed on %s and recovers without altering history',async field=>{
 state[field]=true;await expect(saveProjectScenario(form())).rejects.toThrow();expect(state.writes).toHaveLength(0);
 state[field]=false;await saveProjectScenario(form());expect(state.writes).toHaveLength(1);
});
it('retains Free scenario restrictions while permitting immutable history snapshots on every plan',async()=>{
 await expect((async()=>{state.plan='free';await saveProjectScenario(form());})()).rejects.toThrow(/Pro or Business/);
 for(const plan of ['free','pro','business']){state.plan=plan;await saveCalculationHistory({calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:6,run:3},output:{result:1.999}});}
 expect(state.writes).toHaveLength(3);expect(state.writes.every(w=>w.value.calculator_version===1&&JSON.stringify(w.value.output_data)==='{"result":1.999}')).toBe(true);
});
it.each([null,-1,1.5,Infinity])('does not treat unreadable quota %s as zero',async count=>{
 state.plan='free';state.count=count;await expect(saveCalculationHistory({calculatorSlug:'test',calculatorVersion:1,input:{x:1},output:{value:1}})).rejects.toThrow();expect(state.writes).toHaveLength(0);
});
it('rejects quota read errors and can retry safely',async()=>{
 state.plan='free';state.countError=true;const entry={calculatorSlug:'test',calculatorVersion:1,input:{x:1},output:{value:1}};
 await expect(saveCalculationHistory(entry)).rejects.toThrow();expect(state.writes).toHaveLength(0);state.countError=false;await saveCalculationHistory(entry);expect(state.writes).toHaveLength(1);
});
it('captures a detached finite snapshot before asynchronous authentication',async()=>{
 const entry={calculatorSlug:'test',calculatorVersion:1,input:{x:1},output:{value:1}};
 const saving=saveCalculationHistory(entry);entry.output.value=Infinity;entry.input.x=2;await saving;
 expect(state.writes[0].value.output_data).toEqual({value:1});expect(state.writes[0].value.input_data).toEqual({x:1});
});
it('rejects invalid direct history payloads without database writes',async()=>{
 for(const entry of [{calculatorSlug:'test',calculatorVersion:0,input:{},output:{}},{calculatorSlug:'test',calculatorVersion:1,input:{},output:{value:NaN}},{calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:1,run:0},output:{result:0}}]){
 await expect(saveCalculationHistory(entry)).rejects.toThrow();
 }
 expect(state.writes).toHaveLength(0);
});
