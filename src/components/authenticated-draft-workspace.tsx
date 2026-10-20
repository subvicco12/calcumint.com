'use client';
import {DraftCalculatorPreview} from './draft-calculator-preview';
import {saveDraftCalculation,reopenDraftCalculation,loadDraftHistoryPage} from '@/app/account/drafts/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {DraftSavedReference,DraftHistoryPages} from '@/lib/draft-persistence-contract';
/** Only server-verified owner/plan references enter this client adapter. Actions re-authorize every call. */
export function AuthenticatedDraftWorkspace({ownerId,plan,records,initialRecord,pages}:{ownerId:string;plan:CalcuMintPlan;records:readonly DraftSavedReference[];initialRecord?:DraftSavedReference;pages?:DraftHistoryPages}){
 return <DraftCalculatorPreview initialMasterId={initialRecord?.masterId} persistence={{ownerId,plan,records,pages,loadPage:(source,cursor)=>loadDraftHistoryPage({expectedOwnerId:ownerId,source,cursor}),initialRecordId:initialRecord?.id,initialRecordSource:initialRecord?.source,
  save:(masterId,snapshot,requestId)=>saveDraftCalculation({expectedOwnerId:ownerId,masterId,snapshot,requestId}),
  reopen:record=>reopenDraftCalculation({expectedOwnerId:ownerId,source:record.source,id:record.id})
 }}/>;
}
