import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({userId:'owner-a',plan:'pro',authError:false,profileError:false,historyError:false,projectError:false,countError:false,count:0 as number|null,history:{} as Record<string,unknown>,writes:[] as {table:string;value:Record<string,unknown>}[],filters:[] as string[]}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
vi.mock('next/navigation',()=>({redirect:(url:string)=>{throw new Error(`redirect ${url}`);}}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:state.userId}},error:state.authError?{}:null})},rpc:async(name:string,args:Record<string,unknown>)=>{
 if(name==='save_calculation_history_atomic'){state.writes.push({table:'calculation_history',value:{user_id:state.userId,calculator_slug:args.p_calculator_slug,calculator_version:args.p_calculator_version,input_data:args.p_input_data,output_data:args.p_output_data}});return {data:args.p_request_id,error:null};}
 if(name==='save_project_scenario_atomic'){state.writes.push({table:'saved_scenarios',value:{user_id:state.userId,project_id:args.p_project_id,name:args.p_name,...state.history}});return {data:args.p_request_id,error:null};}
 return {data:null,error:{code:'PGRST202'}};
 },from:(table:string)=>{
 let countOnly=false;
 const query={select:(_columns:string,options?:{head?:boolean})=>{countOnly=Boolean(options?.head);return query;},eq:(field:string,value:string)=>{state.filters.push(`${table}:${field}:${value}`);return query;},maybeSingle:async()=>table==='profiles'?{data:{plan:state.plan},error:state.profileError?{}:null}:table==='calculation_projects'?{data:{id:'project-a'},error:state.projectError?{}:null}:{data:state.history,error:state.historyError?{}:null},then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({count:countOnly?state.count:null,error:state.countError?{}:null}).then(resolve),insert:async(value:Record<string,unknown>)=>{state.writes.push({table,value});return {error:null};},upsert:async(value:Record<string,unknown>)=>{state.writes.push({table,value});return {error:null};},update:(value:Record<string,unknown>)=>{state.writes.push({table,value});return query;},delete:()=>{state.writes.push({table,value:{}});return query;}};return query;
}})}));
import {saveCalculationHistory,saveProjectScenario} from '@/app/account/actions';
import {draftPreviewDefinitions,calculateDraftPreview,draftPreviewScenarioMetadata} from './draft-preview-catalog';
import {calculatorRegistry} from '@/calculators/registry';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {readDraftPreviewCapture,saveDraftPreviewCapture} from '@/lib/draft-preview-history';
import {captureScenario,scenarioSetPayload} from '@/lib/scenario-set';
import {eligibleScenarioContract,reevaluateScenario} from '@/lib/scenario-reevaluation';
import {eligibleSensitivityFields} from '@/lib/scenario-sensitivity-capabilities';
import {calculateScenarioSensitivity} from '@/lib/scenario-sensitivity';
class MemoryStorage implements Storage {
 data=new Map<string,string>(); get length(){return this.data.size;} clear(){this.data.clear();}
 getItem(key:string){return this.data.get(key)??null;} key(index:number){return [...this.data.keys()][index]??null;}
 removeItem(key:string){this.data.delete(key);} setItem(key:string,value:string){this.data.set(key,value);}
}
const form=()=>{const f=new FormData();for(const [k,v] of Object.entries({projectId:'project-a',historyId:'history-a',name:'Synthetic DRAFT',expectedOwnerId:'owner-a'}))f.set(k,v);return f;};
beforeEach(()=>{Object.assign(state,{userId:'owner-a',plan:'pro',authError:false,profileError:false,historyError:false,projectError:false,countError:false,count:0,history:{},writes:[],filters:[]});});
// Synthetic Supabase boundary only: these tests cannot establish deployed RLS or browser authentication.
it.each(draftPreviewDefinitions)('$masterId: existing authenticated actions preserve unregistered DRAFT snapshot and scenario',async d=>{
 const calculation=calculateDraftPreview(d.masterId,d.initialInput),before=JSON.stringify(calculation.snapshot);
 expect(calculatorRegistry.getBySlug(d.slug)).toBeUndefined();
 await saveCalculationHistory(calculation.snapshot);
 const row=state.writes[0].value;expect(row).toEqual({user_id:'owner-a',calculator_slug:d.slug,calculator_version:1,input_data:calculation.snapshot.input,output_data:calculation.snapshot.output});
 state.history=row;await saveProjectScenario(form());
 expect(state.writes[1]).toEqual({table:'saved_scenarios',value:{...row,project_id:'project-a',name:'Synthetic DRAFT'}});
 expect(readPersistedCalculationSnapshot(state.writes[1].value)).toEqual(calculation.snapshot);
 expect(state.filters).toContain('calculation_history:user_id:owner-a');expect(state.filters).toContain('calculation_projects:user_id:owner-a');
 expect(JSON.stringify(calculation.snapshot)).toBe(before);
});
it.each(['authError','profileError','historyError','projectError'] as const)('scenario rejects %s without writing',async field=>{
 const c=calculateDraftPreview(205,draftPreviewDefinitions[0].initialInput);state.history={calculator_slug:c.snapshot.calculatorSlug,calculator_version:1,input_data:c.snapshot.input,output_data:c.snapshot.output};
 state[field]=true;await expect(saveProjectScenario(form())).rejects.toThrow();expect(state.writes).toEqual([]);
});
it('rejects a stale authenticated owner before reading or writing account data',async()=>{
 state.userId='owner-b';await expect(saveProjectScenario(form())).rejects.toThrow('Account context changed');expect(state.filters).toEqual([]);expect(state.writes).toEqual([]);
});
it.each(draftPreviewDefinitions)('$masterId: captures labelled scenarios but explicitly denies uncertified re-evaluation and sensitivity',d=>{
 const c=calculateDraftPreview(d.masterId,d.initialInput),before=JSON.stringify(c.snapshot);
 const rows=captureScenario([], 'A',c.snapshot,'Synthetic baseline',draftPreviewScenarioMetadata(d.masterId,c));
 expect(scenarioSetPayload(rows).scenarios[0].output).toEqual(c.snapshot.output);
 expect(eligibleScenarioContract(c.snapshot)).toBeUndefined();expect(eligibleSensitivityFields(c.snapshot)).toEqual([]);
 expect(()=>reevaluateScenario(c.snapshot,undefined)).toThrow(/explicit reviewed contract/);
 expect(()=>calculateScenarioSensitivity(c.snapshot,Object.keys(c.snapshot.input)[0],[1,2])).toThrow(/eligible certified calculator/);
 expect(JSON.stringify(c.snapshot)).toBe(before);
});
it.each(draftPreviewDefinitions)('$masterId: local owner/version/corrupt envelopes fail closed and preserve evidence',d=>{
 const storage=new MemoryStorage(),c=calculateDraftPreview(d.masterId,d.initialInput);saveDraftPreviewCapture(storage,'owner-a',d.masterId,c.snapshot);
 const key=storage.key(0)!,original=storage.getItem(key)!;
 type Envelope={ownerScope:string;masterId:number;snapshot:{calculatorVersion:number;output:Record<string,unknown>}};
 expect(readDraftPreviewCapture(storage,'owner-b',d.masterId)).toBeNull();
 for(const patch of [(e:Envelope)=>e.ownerScope='owner-b',(e:Envelope)=>e.snapshot.calculatorVersion=2,(e:Envelope)=>e.snapshot.output={corrupt:true},(e:Envelope)=>e.masterId=-1]){
  const e=JSON.parse(original);patch(e);const corrupt=JSON.stringify(e);storage.setItem(key,corrupt);
  expect(()=>readDraftPreviewCapture(storage,'owner-a',d.masterId)).toThrow();expect(storage.getItem(key)).toBe(corrupt);
 }
 storage.setItem(key,original);expect(readDraftPreviewCapture(storage,'owner-a',d.masterId)?.snapshot).toEqual(c.snapshot);
});
it('preserves opaque historical non-Slope revisions without silently upgrading them',()=>{
 const row={calculator_slug:'basic-calculator',calculator_version:73,input_data:{historical:'opaque'},output_data:{recorded:'unchanged'}};
 expect(readPersistedCalculationSnapshot(row)).toEqual({calculatorSlug:row.calculator_slug,calculatorVersion:73,input:row.input_data,output:row.output_data});
});
it.each([0,-1,1.5,NaN,Infinity])('historical rows reject structurally invalid version %s',version=>{
 expect(()=>readPersistedCalculationSnapshot({calculator_slug:'basic-calculator',calculator_version:version,input_data:{},output_data:{}})).toThrow();
});
