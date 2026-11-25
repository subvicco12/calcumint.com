import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {readAccountEntitlements} from '@/lib/account-persistence';
import {saveCalculationHistory,saveProjectScenario} from '@/app/account/actions';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {factoryBusinessWorkspace} from '@/app/admin/calculator-factory/actions';
import {verifyCalendarPacket,verifyCalendarSnapshot} from './cohort';

async function account(expectedOwner:string,scenario=false){
 const owner=z.uuid().parse(expectedOwner),client=await createSupabaseServerClient();if(!client)throw Error('Authentication unavailable');
 const session=await client.auth.getUser();if(session.error||!session.data.user)throw Error('Sign in to continue');if(session.data.user.id!==owner)throw Error('Account context changed');
 if(scenario){const e=await readAccountEntitlements(client,owner);if(!e.projects||!e.scenarios)throw Error('Projects and scenarios require Pro or Business');}
 return {owner,client};
}
export async function saveCalendarHistory(input:{expectedOwnerId:string;requestId:string;packet:unknown}){
 const packet=verifyCalendarPacket(input.packet),owner=z.uuid().parse(input.expectedOwnerId),requestId=z.uuid().parse(input.requestId);
 return saveCalculationHistory({...packet.snapshot,expectedOwnerId:owner,requestId});
}
export async function calendarProjects(expectedOwner:string){
 const {owner,client}=await account(expectedOwner,true);
 const rows=await client.from('calculation_projects').select('id,name').eq('user_id',owner).order('created_at',{ascending:false}).limit(100);
 if(rows.error)throw Error('Owned projects unavailable');return {projects:rows.data??[]};
}
export async function saveCalendarScenario(input:{expectedOwnerId:string;projectId:string;requestId:string;name:string;packet:unknown}){
 const packet=verifyCalendarPacket(input.packet);
 const clean=z.object({expectedOwnerId:z.uuid(),projectId:z.uuid(),requestId:z.uuid(),name:z.string().trim().min(1).max(120)}).parse(input);
 const {owner,client}=await account(clean.expectedOwnerId,true);
 const project=await client.from('calculation_projects').select('id').eq('id',clean.projectId).eq('user_id',owner).maybeSingle();if(project.error||!project.data)throw Error('Owned project unavailable');
 const result=await saveCalculationHistory({...packet.snapshot,expectedOwnerId:owner,requestId:clean.requestId});
 const form=new FormData();for(const [k,v] of Object.entries({expectedOwnerId:owner,projectId:clean.projectId,historyId:result.id,name:clean.name,requestId:clean.requestId}))form.set(k,v);
 await saveProjectScenario(form);return {historyId:result.id,scenarioId:clean.requestId};
}
export async function restoreCalendarScenario(input:{expectedOwnerId:string;scenarioId:string}){
 const clean=z.object({expectedOwnerId:z.uuid(),scenarioId:z.uuid()}).strict().parse(input),{owner,client}=await account(clean.expectedOwnerId,true);
 const row=await client.from('saved_scenarios').select('id,name,project_id,calculator_slug,calculator_version,input_data,output_data').eq('id',clean.scenarioId).eq('user_id',owner).maybeSingle();if(row.error||!row.data)throw Error('Owned scenario unavailable');
 const project=await client.from('calculation_projects').select('id').eq('id',row.data.project_id).eq('user_id',owner).maybeSingle();if(project.error||!project.data)throw Error('Owned project unavailable');
 return {...verifyCalendarSnapshot(readPersistedCalculationSnapshot(row.data)),scenarioId:row.data.id};
}
export async function readCalendarHistory(input:{expectedOwnerId:string;historyId:string}){
 const clean=z.object({expectedOwnerId:z.uuid(),historyId:z.uuid()}).strict().parse(input),{owner,client}=await account(clean.expectedOwnerId);
 const row=await client.from('calculation_history').select('calculator_slug,calculator_version,input_data,output_data').eq('id',clean.historyId).eq('user_id',owner).maybeSingle();if(row.error||!row.data)throw Error('Owned history unavailable');
 return verifyCalendarSnapshot(readPersistedCalculationSnapshot(row.data));
}
/** Existing Business reader verifies current plan and membership. No new tuple
 * enters the shared-write/native/job allowlists or SQL capability implicitly. */
export async function calendarBusinessProjects(input:{expectedOwnerId:string;organizationId:string}){
 const clean=z.object({expectedOwnerId:z.uuid(),organizationId:z.uuid()}).strict().parse(input);
 const result=await factoryBusinessWorkspace(clean);
 return {...result,delivery:{available:false as const,reason:'These exact calendar tuples require separately reviewed shared-storage/native delivery capability adoption. No shared write, API/embed grant or metered job is enabled by this worker.'}};
}
