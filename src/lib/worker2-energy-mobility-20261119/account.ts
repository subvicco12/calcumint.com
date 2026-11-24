import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {readAccountEntitlements} from '@/lib/account-persistence';
import {saveCalculationHistory,saveProjectScenario} from '@/app/account/actions';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {mobilityContracts,verifyMobilityPacket,verifyMobilitySnapshot} from './cohort';

async function account(expectedOwner:string,scenario=false){
 const owner=z.uuid().parse(expectedOwner),client=await createSupabaseServerClient();if(!client)throw Error('Authentication unavailable');
 const session=await client.auth.getUser();if(session.error||!session.data.user)throw Error('Sign in to continue');if(session.data.user.id!==owner)throw Error('Account context changed');
 const review=await client.from('platform_admins').select('role,active').eq('user_id',owner).maybeSingle();
 if(review.error||!review.data?.active||!['owner','admin','reviewer'].includes(String(review.data.role)))throw Error('Authorized engineering review access required');
 if(scenario){const e=await readAccountEntitlements(client,owner);if(!e.projects||!e.scenarios)throw Error('Projects and scenarios require Pro or Business');}
 return {owner,client};
}
export async function saveMobilityHistory(input:{expectedOwnerId:string;requestId:string;packet:unknown}){
 const packet=verifyMobilityPacket(input.packet),owner=z.uuid().parse(input.expectedOwnerId),requestId=z.uuid().parse(input.requestId);
 await account(owner);
 return saveCalculationHistory({...packet.snapshot,expectedOwnerId:owner,requestId});
}
export async function mobilityProjects(expectedOwner:string){
 const {owner,client}=await account(expectedOwner,true);
 const rows=await client.from('calculation_projects').select('id,name').eq('user_id',owner).order('created_at',{ascending:false}).limit(100);
 if(rows.error)throw Error('Owned projects unavailable');return {projects:rows.data??[]};
}
export async function saveMobilityScenario(input:{expectedOwnerId:string;projectId:string;requestId:string;name:string;packet:unknown}){
 const packet=verifyMobilityPacket(input.packet);
 const clean=z.object({expectedOwnerId:z.uuid(),projectId:z.uuid(),requestId:z.uuid(),name:z.string().trim().min(1).max(120)}).parse(input);
 const {owner,client}=await account(clean.expectedOwnerId,true);
 const project=await client.from('calculation_projects').select('id').eq('id',clean.projectId).eq('user_id',owner).maybeSingle();if(project.error||!project.data)throw Error('Owned project unavailable');
 const result=await saveCalculationHistory({...packet.snapshot,expectedOwnerId:owner,requestId:clean.requestId});
 const form=new FormData();for(const [k,v] of Object.entries({expectedOwnerId:owner,projectId:clean.projectId,historyId:result.id,name:clean.name,requestId:clean.requestId}))form.set(k,v);
 await saveProjectScenario(form);return {historyId:result.id,scenarioId:clean.requestId};
}
function recoverOwnedMobilityRecord(row:{calculator_slug:string;calculator_version:number;input_data:unknown;output_data:unknown}){
 const contract=mobilityContracts.find(candidate=>candidate.slug===row.calculator_slug);
 if(!contract)return {status:'unavailable'} as const;
 if(row.calculator_version!==contract.version)return {status:'unsupported-version'} as const;
 return verifyMobilitySnapshot(readPersistedCalculationSnapshot(row));
}
export async function restoreMobilityScenario(input:{expectedOwnerId:string;scenarioId:string}){
 const clean=z.object({expectedOwnerId:z.uuid(),scenarioId:z.uuid()}).strict().parse(input),{owner,client}=await account(clean.expectedOwnerId,true);
 const row=await client.from('saved_scenarios').select('id,name,project_id,calculator_slug,calculator_version,input_data,output_data').eq('id',clean.scenarioId).eq('user_id',owner).maybeSingle();if(row.error||!row.data)return {status:'unavailable'} as const;
 const project=await client.from('calculation_projects').select('id').eq('id',row.data.project_id).eq('user_id',owner).maybeSingle();if(project.error||!project.data)return {status:'unavailable'} as const;
 const result=recoverOwnedMobilityRecord(row.data);
 return 'status' in result?result:{...result,scenarioId:row.data.id};
}
export async function readMobilityHistory(input:{expectedOwnerId:string;historyId:string}){
 const clean=z.object({expectedOwnerId:z.uuid(),historyId:z.uuid()}).strict().parse(input),{owner,client}=await account(clean.expectedOwnerId);
 const row=await client.from('calculation_history').select('calculator_slug,calculator_version,input_data,output_data').eq('id',clean.historyId).eq('user_id',owner).maybeSingle();if(row.error||!row.data)return {status:'unavailable'} as const;
 return recoverOwnedMobilityRecord(row.data);
}
