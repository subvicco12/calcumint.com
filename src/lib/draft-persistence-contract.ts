import type {CalculationSnapshot} from './calculation-snapshot';
import type {CalcuMintPlan} from './entitlements';
import {draftPreviewDefinitions,getDraftPreviewDefinition} from '@/calculators/final-framework/draft-preview-catalog';
import {validateDraftPreviewCapture} from './draft-preview-history';
export type DraftSavedReference={id:string;masterId:number;source:'history'|'scenario';label:string;createdAt:string};
export type DraftPersistedCapture={masterId:number;snapshot:CalculationSnapshot};
export type DraftHistoryPage={records:readonly DraftSavedReference[];nextCursor:string|null};
export type DraftHistoryPages=Partial<Record<DraftSavedReference['source'],DraftHistoryPage>>;
export type DraftAuthenticatedPersistence={
 pages?:DraftHistoryPages;
 loadPage?:(source:DraftSavedReference['source'],cursor?:string)=>Promise<DraftHistoryPage>;
 ownerId:string;plan:CalcuMintPlan;initialRecordId?:string;initialRecordSource?:DraftSavedReference['source'];records:readonly DraftSavedReference[];
 save:(masterId:number,snapshot:CalculationSnapshot,requestId:string)=>Promise<{id:string}>;
 reopen:(record:DraftSavedReference)=>Promise<DraftPersistedCapture>;
};
export function draftMasterIdForSlug(slug:string){return draftPreviewDefinitions.find(d=>d.slug===slug)?.masterId;}
/** Strict private v1 reader. Unsupported history remains untouched, never upgraded. */
export function validateDraftPersistedCapture(masterId:number,rawSnapshot:unknown):DraftPersistedCapture{
 getDraftPreviewDefinition(masterId);
 const capture=validateDraftPreviewCapture(masterId,rawSnapshot);
 if(JSON.stringify(capture.snapshot).length>1024*1024)throw new Error('Captured DRAFT exceeds the private persistence limit');
 return {masterId,snapshot:capture.snapshot};
}

export function draftAccountRecordHref(slug:string,id:string,source:DraftSavedReference["source"]){return draftMasterIdForSlug(slug)===undefined?undefined:`/account/drafts?source=${source}&id=${encodeURIComponent(id)}`;}
