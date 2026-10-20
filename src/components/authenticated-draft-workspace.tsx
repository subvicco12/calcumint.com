'use client';
import {DraftCalculatorPreview} from './draft-calculator-preview';
import {saveDraftCalculation,reopenDraftCalculation} from '@/app/account/drafts/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {DraftSavedReference} from '@/lib/draft-persistence-contract';
/** Only server-verified owner/plan references enter this client adapter. Actions re-authorize every call. */
export function AuthenticatedDraftWorkspace({ownerId,plan,records,initialRecord}:{ownerId:string;plan:CalcuMintPlan;records:readonly DraftSavedReference[];initialRecord?:DraftSavedReference}){
 return <DraftCalculatorPreview initialMasterId={initialRecord?.masterId} persistence={{ownerId,plan,records,initialRecordId:initialRecord?.id,initialRecordSource:initialRecord?.source,
  save:(masterId,snapshot,requestId)=>saveDraftCalculation({expectedOwnerId:ownerId,masterId,snapshot,requestId}),
  reopen:record=>reopenDraftCalculation({expectedOwnerId:ownerId,source:record.source,id:record.id})
 }}/>;
}
