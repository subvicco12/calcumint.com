"use server";

import {z} from 'zod';
import {isDeepStrictEqual} from 'node:util';
import {requireDraftAccountAccess} from '@/lib/draft-account-access';
import {readAccountEntitlements} from '@/lib/account-persistence';
import {normalizePlan} from '@/lib/entitlements';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {draftMasterIdForSlug,validateDraftPersistedCapture,type DraftSavedReference} from '@/lib/draft-persistence-contract';

const uuid=z.string().uuid();
const referenceRow=z.object({id:uuid,calculator_slug:z.string().min(1),calculator_version:z.number().int().positive(),created_at:z.iso.datetime({offset:true}),name:z.string().min(1).max(120).optional()});
const unavailable=()=>new Error('Saved draft unavailable');
type Account=Awaited<ReturnType<typeof requireDraftAccountAccess>>;
async function ownedRecord(account:Account,source:'history'|'scenario',id:string){
 const result=await account.supabase.from(source==='history'?'calculation_history':'saved_scenarios').select('id,calculator_slug,calculator_version,input_data,output_data').eq('user_id',account.user.id).eq('id',id).maybeSingle();
 if(result.error)throw unavailable();
 return result.data;
}
function capture(row:unknown){
 const snapshot=readPersistedCalculationSnapshot(row);
 const masterId=draftMasterIdForSlug(snapshot.calculatorSlug);
 if(masterId===undefined)throw unavailable();
 return validateDraftPersistedCapture(masterId,snapshot);
}

export async function loadDraftWorkspace(expectedOwnerId?:string){
 const account=await requireDraftAccountAccess(expectedOwnerId);
 const profile=await account.supabase.from('profiles').select('plan').eq('id',account.user.id).maybeSingle();
 if(profile.error)throw new Error('Account plan unavailable');
 const records:DraftSavedReference[]=[];
 for(const source of ['history','scenario'] as const){
  const query=source==='history'
   ? account.supabase.from('calculation_history').select('id,calculator_slug,calculator_version,created_at')
   : account.supabase.from('saved_scenarios').select('id,calculator_slug,calculator_version,created_at,name');
  const result=await query.eq('user_id',account.user.id).order('created_at',{ascending:false}).limit(100);
  if(result.error)throw unavailable();
  for(const raw of result.data??[]){
   const parsed=referenceRow.safeParse(raw);
   if(!parsed.success||(source==='scenario'&&parsed.data.name===undefined))throw unavailable();
   const row=parsed.data;
   const masterId=draftMasterIdForSlug(row.calculator_slug);
   if(masterId===undefined)continue;
   records.push({id:row.id,masterId,source,label:source==='scenario'?row.name??row.calculator_slug:row.calculator_slug,createdAt:row.created_at});
  }
 }
 return {ownerId:account.user.id,plan:normalizePlan(profile.data?.plan),records};
}

export async function saveDraftCalculation(entry:{expectedOwnerId:string;masterId:number;requestId:string;snapshot:unknown}){
 // Validate/copy before any await; client objects cannot mutate the revision in flight.
 const validated=validateDraftPersistedCapture(entry.masterId,entry.snapshot);
 const requestId=uuid.parse(entry.requestId);
 const expectedOwnerId=z.string().min(1).parse(entry.expectedOwnerId);
 const account=await requireDraftAccountAccess(expectedOwnerId);
 const reconcile=async(readAccount=account)=>{
  const row=await ownedRecord(readAccount,'history',requestId);
  if(!row)return false;
  // JSONB normalizes numeric -0; compare detached JSON values while retaining strings.
  if(!isDeepStrictEqual(JSON.parse(JSON.stringify(capture(row))),JSON.parse(JSON.stringify(validated))))throw unavailable();
  return true;
 };
 if(await reconcile())return {id:requestId};
 const entitlements=await readAccountEntitlements(account.supabase,account.user.id);
 // Existing count-then-insert quota cannot safely authorize concurrent bounded writes.
 if(entitlements.historyLimit!==null)throw new Error('New private DRAFT saves require the atomic Free history quota contract; existing saved captures remain readable.');
 const dispatchAccount=await requireDraftAccountAccess(expectedOwnerId);
 const dispatchEntitlements=await readAccountEntitlements(dispatchAccount.supabase,dispatchAccount.user.id);
 if(dispatchEntitlements.historyLimit!==null)throw new Error('New private DRAFT saves require the atomic Free history quota contract; existing saved captures remain readable.');
 const snapshot=validated.snapshot;
 const result=await dispatchAccount.supabase.from('calculation_history').insert({id:requestId,user_id:dispatchAccount.user.id,calculator_slug:snapshot.calculatorSlug,calculator_version:snapshot.calculatorVersion,input_data:snapshot.input,output_data:snapshot.output});
 if(result.error){
  if(result.error.code==='23505'&&await reconcile(dispatchAccount))return {id:requestId};
  throw unavailable();
 }
 return {id:requestId};
}

export async function reopenDraftCalculation(entry:{expectedOwnerId:string;source:'history'|'scenario';id:string}){
 const source=z.enum(['history','scenario']).parse(entry.source);
 const id=uuid.parse(entry.id);
 const account=await requireDraftAccountAccess(z.string().min(1).parse(entry.expectedOwnerId));
 const row=await ownedRecord(account,source,id);
 if(!row)throw unavailable();
 return capture(row);
}
