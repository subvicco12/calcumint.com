'use server';

import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {readAccountEntitlements} from '@/lib/account-persistence';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {saveCalculationHistory,saveProjectScenario} from '@/app/account/actions';
import {factorySharingCapability,verifyFactoryPacket,verifyFactoryStoredSnapshot} from '@/lib/calculator-factory/completion/business';
import {technologyFiveSharingSession,technologyFiveSharingAccess} from '@/lib/business/technology-five-sharing-server';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';

async function account(expectedOwnerId:string){
 const expected=z.string().uuid().parse(expectedOwnerId);
 const client=await createSupabaseServerClient();
 if(!client)throw Error('Authentication unavailable');
 const session=await client.auth.getUser();
 if(session.error||!session.data.user)throw Error('Sign in to continue');
 if(session.data.user.id!==expected)throw Error('Account context changed');
 const entitlements=await readAccountEntitlements(client,expected);
 if(!entitlements.projects||!entitlements.scenarios)throw Error('Projects and scenarios require Pro or Business');
 return {client,userId:expected};
}

export async function factoryProjects(expectedOwnerId:string){
 const {client,userId}=await account(expectedOwnerId);
 const projects=await client.from('calculation_projects').select('id,name').eq('user_id',userId).order('created_at',{ascending:false}).limit(100);
 if(projects.error)throw Error('Projects temporarily unavailable');
 return {projects:projects.data??[],sharing:factorySharingCapability};
}

export async function factorySaveScenario(input:{expectedOwnerId:string;projectId:string;name:string;requestId:string;packet:FactoryExecutionPacket}){
 // Snapshot and request values must be copied before the first await.
 const packet=verifyFactoryPacket(input.packet);
 const parsed=z.object({expectedOwnerId:z.string().uuid(),projectId:z.string().uuid(),name:z.string().trim().min(1).max(120),requestId:z.string().uuid()}).parse(input);
 const {client,userId}=await account(parsed.expectedOwnerId);
 const project=await client.from('calculation_projects').select('id').eq('id',parsed.projectId).eq('user_id',userId).maybeSingle();
 if(project.error||!project.data)throw Error('Owned project unavailable');
 // Existing account actions and their atomic RPCs own quotas, idempotency and authorization.
 const history=await saveCalculationHistory({...packet.snapshot,requestId:parsed.requestId,expectedOwnerId:userId});
 const form=new FormData();
 for(const [key,value] of Object.entries({expectedOwnerId:userId,projectId:parsed.projectId,historyId:history.id,name:parsed.name,requestId:parsed.requestId}))form.set(key,value);
 await saveProjectScenario(form);
 return {historyId:history.id,scenarioId:parsed.requestId};
}

export async function factoryRestoreScenario(input:{expectedOwnerId:string;scenarioId:string}){
 const parsed=z.object({expectedOwnerId:z.string().uuid(),scenarioId:z.string().uuid()}).parse(input);
 const {client,userId}=await account(parsed.expectedOwnerId);
 const result=await client.from('saved_scenarios').select('id,name,project_id,calculator_slug,calculator_version,input_data,output_data').eq('id',parsed.scenarioId).eq('user_id',userId).maybeSingle();
 if(result.error||!result.data)throw Error('Owned scenario unavailable');
 const project=await client.from('calculation_projects').select('id').eq('id',result.data.project_id).eq('user_id',userId).maybeSingle();
 if(project.error||!project.data)throw Error('Owned project unavailable');
 const verified=verifyFactoryStoredSnapshot(readPersistedCalculationSnapshot(result.data));
 return {scenarioId:result.data.id,name:result.data.name,projectId:result.data.project_id,...verified};
}

/** Existing generic Business containers remain readable; factory snapshot writes stay capability-blocked. */
export async function factoryBusinessWorkspace(input:{expectedOwnerId:string;organizationId:string}){
 const parsed=z.object({expectedOwnerId:z.string().uuid(),organizationId:z.string().uuid()}).parse(input);
 const context=await technologyFiveSharingSession();
 if(context.user.id!==parsed.expectedOwnerId)throw Error('Account context changed');
 const role=await technologyFiveSharingAccess(context,parsed.organizationId,false,false);
 const projects=await context.client.from('business_projects').select('id,name,status').eq('organization_id',parsed.organizationId).order('created_at',{ascending:false}).limit(100);
 if(projects.error)throw Error('Business projects temporarily unavailable');
 return {organizationId:parsed.organizationId,role,projects:projects.data??[],sharing:factorySharingCapability};
}
