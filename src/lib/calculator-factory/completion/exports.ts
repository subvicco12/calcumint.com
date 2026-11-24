import {scopedEngineeringDisplay} from './scoped-engineering-metadata';
import {serializeCalculationPdf} from '@/lib/calculation-export-pdf';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {FactoryExecutionPacket,FactoryWorkflows} from '../workflows';
/** Downloads are verified artifacts, not publication/certification attestations.
 * JSON retains the replay packet; CSV/PDF are presentation artifacts only.
 */
export function factoryDownload(workflows:FactoryWorkflows,packet:FactoryExecutionPacket,format:'json'|'csv'|'pdf',plan:CalcuMintPlan,title:string){
 // Reuse the governed entitlement check even for the PDF path.
 const text=workflows.exportPacket(packet,format==='csv'?'csv':'json',plan);
 const checked=workflows.verify(packet);
 const metadata=workflows.scopedMetadata;
 const displayMetadata=metadata?scopedEngineeringDisplay(metadata):undefined;
 // Mode-aware contracts declare a union of fields. Filter only verified, compiled
 // mode metadata for PDF display; JSON replay retains the full contract metadata.
 const display=metadata?.modeDependent&&displayMetadata?{...displayMetadata,
  inputs:Object.fromEntries(Object.entries(displayMetadata.inputs).filter(([key])=>Object.hasOwn(checked.snapshot.input,key))),
  outputs:Object.fromEntries(Object.entries(displayMetadata.outputs).filter(([key])=>Object.hasOwn(checked.snapshot.output,key))),
 }:displayMetadata;
 const bytes=format==='pdf'?serializeCalculationPdf(checked.snapshot,{title,methodology:`Private engineering artifact. Exact engine ${checked.identity.engineId??checked.identity.calculatorSlug}@${checked.identity.calculatorVersion}. Source revision ${checked.identity.sourceVersion}. JSON export retains original raw entry and immutable replay data; PDF is a presentation artifact.`,...(metadata?{methodology:`SCOPED ENGINEERING CONTRACT. ${metadata.scope} ${metadata.limitations.join(' ')} ${metadata.authority} Exact source revision: ${checked.identity.sourceVersion}.`,displayMetadata:display,sources:[...new Set([...metadata.sourceEvidence,...metadata.publisherSources])].map(source=>({label:source,...(source.startsWith('https://')?{url:source}:{})}))}:{}),tables:[{title:'Original entered fields',columns:['Field','Entered text'],rows:Object.entries(checked.raw)}]}):new TextEncoder().encode(text);
 const stem=checked.identity.calculatorSlug.replace(/[^a-z0-9-]/gi,'-');
 return Object.freeze({filename:`${stem}-v${checked.identity.calculatorVersion}.${format}`,mime:format==='pdf'?'application/pdf':format==='csv'?'text/csv;charset=utf-8':'application/json;charset=utf-8',bytes});
}
