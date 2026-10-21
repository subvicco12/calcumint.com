"use server";

import {z} from 'zod';
import {isDeepStrictEqual} from 'node:util';
import {requireDraftAccountAccess} from '@/lib/draft-account-access';
import {saveHistoryAtomically} from '@/lib/account-persistence';
import {normalizePlan} from '@/lib/entitlements';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {draftMasterIdForSlug,validateDraftPersistedCapture,type DraftSavedReference} from '@/lib/draft-persistence-contract';

import {draftHistorySlugs,decodeDraftHistoryCursor,encodeDraftHistoryCursor,draftHistorySeekFilter,type DraftHistoryPageRequest} from '@/lib/draft-history-pagination';

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

function reference(raw:unknown,source:'history'|'scenario'):DraftSavedReference{
 const parsed=referenceRow.safeParse(raw);
 if(!parsed.success||(source==='scenario'&&parsed.data.name===undefined))throw unavailable();
 const row=parsed.data,masterId=draftMasterIdForSlug(row.calculator_slug);
 if(masterId===undefined)throw unavailable();
 return {id:row.id,masterId,source,label:source==='scenario'?row.name!:row.calculator_slug,createdAt:row.created_at};
}
async function historyPage(account:Account,entry:DraftHistoryPageRequest){
 const source=z.enum(['history','scenario']).parse(entry.source);
 const limit=z.union([z.literal(20),z.literal(50)]).parse(entry.limit??20);
 const cursor=entry.cursor!=null?decodeDraftHistoryCursor(entry.cursor,account.user.id,source,limit):undefined;
 const table=source==='history'?'calculation_history':'saved_scenarios';
 let query=account.supabase.from(table).select(source==='history'?'id,calculator_slug,calculator_version,created_at':'id,calculator_slug,calculator_version,created_at,name').eq('user_id',account.user.id).in('calculator_slug',draftHistorySlugs);
 if(cursor)query=query.or(draftHistorySeekFilter(cursor));
 const result=await query.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(limit+1);
 if(result.error)throw unavailable();
 const rows=(result.data??[]).map(raw=>reference(raw,source));
 const records=rows.slice(0,limit),last=records.at(-1);
 return {records,nextCursor:rows.length>limit&&last?encodeDraftHistoryCursor({v:1,owner:account.user.id,source,limit,createdAt:last.createdAt,id:last.id}):null};
}
export async function loadDraftHistoryPage(entry:DraftHistoryPageRequest){
 const account=await requireDraftAccountAccess(z.string().min(1).parse(entry.expectedOwnerId));
 return historyPage(account,entry);
}
export async function loadDraftWorkspace(expectedOwnerId?:string,selectedReference?:{source:'history'|'scenario';id:string}){
 const account=await requireDraftAccountAccess(expectedOwnerId);
 const profile=await account.supabase.from('profiles').select('plan').eq('id',account.user.id).maybeSingle();
 if(profile.error)throw new Error('Account plan unavailable');
 const history=await historyPage(account,{expectedOwnerId:account.user.id,source:'history'});
 const scenario=await historyPage(account,{expectedOwnerId:account.user.id,source:'scenario'});
 const records=[...history.records,...scenario.records];
 if(selectedReference){
  const source=z.enum(['history','scenario']).parse(selectedReference.source),id=uuid.parse(selectedReference.id);
  if(!records.some(record=>record.source===source&&record.id===id)){
   const result=await account.supabase.from(source==='history'?'calculation_history':'saved_scenarios').select(source==='history'?'id,calculator_slug,calculator_version,created_at':'id,calculator_slug,calculator_version,created_at,name').eq('user_id',account.user.id).eq('id',id).in('calculator_slug',draftHistorySlugs).maybeSingle();
   if(result.error||!result.data)throw unavailable();
   records.push(reference(result.data,source));
  }
 }
 return {ownerId:account.user.id,plan:normalizePlan(profile.data?.plan),records,pages:{history,scenario}};
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
 const dispatchAccount=await requireDraftAccountAccess(expectedOwnerId);
 try{
  await saveHistoryAtomically(dispatchAccount.supabase,requestId,validated.snapshot,dispatchAccount.user.id);
 }catch{
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
