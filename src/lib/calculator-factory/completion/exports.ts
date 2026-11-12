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
 const bytes=format==='pdf'?serializeCalculationPdf(checked.snapshot,{title,methodology:`Private engineering artifact. Exact engine ${checked.identity.engineId??checked.identity.calculatorSlug}@${checked.identity.calculatorVersion}. Source revision ${checked.identity.sourceVersion}. JSON export retains original raw entry and immutable replay data; PDF is a presentation artifact.`,tables:[{title:'Original entered fields',columns:['Field','Entered text'],rows:Object.entries(checked.raw)}]}):new TextEncoder().encode(text);
 const stem=checked.identity.calculatorSlug.replace(/[^a-z0-9-]/gi,'-');
 return Object.freeze({filename:`${stem}-v${checked.identity.calculatorVersion}.${format}`,mime:format==='pdf'?'application/pdf':format==='csv'?'text/csv;charset=utf-8':'application/json;charset=utf-8',bytes});
}
