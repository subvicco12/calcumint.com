import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from "./calculation-snapshot";
import {calculateDraftPreview,getDraftPreviewDefinition} from "@/calculators/final-framework/draft-preview-catalog";
const LIMIT=1024*1024;
function key(owner:string,id:number){if(typeof owner!=="string"||!owner.trim()||owner.length>128)throw new Error("An explicit local reviewer scope is required");const d=getDraftPreviewDefinition(id);return `calcumint:private-draft:v1:${encodeURIComponent(owner)}:${d.masterId}`;}
function canonical(value:unknown):string{
 if(Array.isArray(value))return `[${value.map(canonical).join(",")}]`;
 if(value&&typeof value==="object")return `{${Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+canonical((value as Record<string,unknown>)[k])).join(",")}}`;
 return JSON.stringify(value);
}
export function validateDraftPreviewCapture(id:number,raw:unknown){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new Error("Invalid local capture");
 const record=copyCalculationData({},raw as Record<string,unknown>).output;
 if(Object.keys(record).sort().join(",")!=="calculatorSlug,calculatorVersion,input,output")throw new Error("Unexpected captured fields");
 const snapshot=createCalculationSnapshot(record as CalculationSnapshot),d=getDraftPreviewDefinition(id);
 if(snapshot.calculatorSlug!==d.slug||snapshot.calculatorVersion!==d.version)throw new Error("Unsupported captured identity/version; history was not upgraded");
 // Verification only: preserve captured output. Never replace history with a newer engine result.
 const verified=calculateDraftPreview(id,snapshot.input);
 if(canonical(verified.snapshot.input)!==canonical(snapshot.input)||canonical(verified.snapshot.output)!==canonical(snapshot.output))throw new Error("Captured calculation does not match its immutable DRAFT contract");
 return {...verified,snapshot};
}
/** Synthetic local reviewer storage only, not server authentication or an account persistence writer. */
export function saveDraftPreviewCapture(storage:Storage,owner:string,id:number,snapshot:CalculationSnapshot):void{
 const slot=key(owner,id);const checked=validateDraftPreviewCapture(id,snapshot);const payload=JSON.stringify({schemaVersion:1,ownerScope:owner,masterId:id,snapshot:checked.snapshot});
 if(payload.length>LIMIT)throw new Error("Local capture exceeds the 1 MiB preview storage limit");
 storage.setItem(slot,payload);
}
export function readDraftPreviewCapture(storage:Storage,owner:string,id:number){
 const text=storage.getItem(key(owner,id));if(text===null)return null;
 if(text.length>LIMIT)throw new Error("Oversized local capture");
 const parsed:unknown=JSON.parse(text);
 if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error("Invalid local capture envelope");
 const e=copyCalculationData({},parsed as Record<string,unknown>).output;
 if(Object.keys(e).sort().join(",")!=="masterId,ownerScope,schemaVersion,snapshot"||e.schemaVersion!==1||e.ownerScope!==owner||e.masterId!==id)throw new Error("Local capture owner/schema/identity mismatch");
 return validateDraftPreviewCapture(id,e.snapshot);
}
