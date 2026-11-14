import {getFactoryContract,getFactoryWorkflows} from '../registry';
import type {FactoryExecutionPacket} from '../workflows';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
import {recordedNumberDifference} from '@/lib/recorded-number-difference';
/** Explicit finite what-if samples, not a derivative, optimizer or risk forecast.
 * Candidates retain raw decimal text and execute the unchanged registered engine.
 */
export function previewFactorySensitivity(packet:FactoryExecutionPacket,field:string,values:readonly string[],plan:CalcuMintPlan){
 if(!getPlanEntitlements(plan).scenarios)throw Error('What-if previews require Pro or Business');
 const id=packet.identity.catalogId,version=packet.identity.calculatorVersion;
 if(typeof id!=='number'||!factoryDeliveryIdentity(id,version))throw Error('Exact supported factory version required');
 const contract=getFactoryContract(id)!,workflows=getFactoryWorkflows(id),baseline=workflows.verify(packet);
 if(!contract.fields.some(row=>row.key===field&&row.kind==='number'))throw Error('Choose a supplied numeric field');
 if(!Array.isArray(values)||!values.length||values.length>25||values.some(value=>typeof value!=='string'||!value.trim())||values.join(',').length>20000)throw Error('Enter 1–25 complete decimal candidates');
 const baselineValue=baseline.snapshot.output[contract.primaryKey];
 if(typeof baselineValue!=='number'||!Number.isFinite(baselineValue))throw Error('Numeric baseline required');
 const points=values.map(raw=>{
  const candidate=workflows.execute({...baseline.raw,[field]:raw});
  const value=candidate.snapshot.output[contract.primaryKey];
  if(typeof value!=='number'||!Number.isFinite(value))throw Error('Numeric candidate output required');
  return Object.freeze({raw,packet:candidate,value,difference:recordedNumberDifference(value,baselineValue)});
 });
 return Object.freeze({baseline,field,points:Object.freeze(points)});
}
export type FactorySensitivityPreview=ReturnType<typeof previewFactorySensitivity>;

import {parseFinalPrivateSnapshotText} from '@/lib/final-private-snapshot-text';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {factoryResult} from '../registry';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import {serializeCalculationPdf} from '@/lib/calculation-export-pdf';
export function replayFactorySensitivity(text:string,plan:CalcuMintPlan):FactorySensitivityPreview{
 const supplied=parseFinalPrivateSnapshotText(text) as {schemaVersion?:number;kind?:string;preview?:FactorySensitivityPreview};
 if(!supplied||supplied.schemaVersion!==1||supplied.kind!=='factory-what-if'||Object.keys(supplied).length!==3||!supplied.preview||!Array.isArray(supplied.preview.points))throw Error('Exact what-if artifact required');
 const expected=previewFactorySensitivity(supplied.preview.baseline,supplied.preview.field,supplied.preview.points.map(point=>point.raw),plan);
 if(!equalCompletionJson(expected,supplied.preview))throw Error('What-if artifact differs from immutable engine replay');
 return expected;
}
export function exportFactorySensitivity(preview:FactorySensitivityPreview,format:'json'|'csv'|'pdf',plan:CalcuMintPlan){
 if(!getPlanEntitlements(plan).exports)throw Error('What-if exports require Pro or Business');
 if(!['json','csv','pdf'].includes(format))throw Error('Unsupported what-if export format');
 const checked=replayFactorySensitivity(JSON.stringify({schemaVersion:1,kind:'factory-what-if',preview}),plan);
 const unit=factoryResult(checked.baseline.identity.catalogId!,checked.baseline.raw).primaryResult.unit??'';
 const envelope={schemaVersion:1,kind:'factory-what-if',preview:checked};
 const text=format==='json'?JSON.stringify(envelope,null,2):serializeCalculationCsv({identity:checked.baseline.identity,field:checked.field,baseline:checked.baseline.raw,unit},{points:checked.points.map(row=>({raw:row.raw,value:row.value,difference:row.difference}))});
 const bytes=format==='pdf'?serializeCalculationPdf(checked.baseline.snapshot,{title:'Immutable-engine what-if comparison',methodology:'Explicit candidate values; same registered engine. No derivative or forecast. Baseline snapshots are unchanged; JSON preserves full replay packets.',tables:[{title:'What-if comparison',columns:['Entered candidate',`Engine result${unit?' ('+unit+')':''}`,`Difference${unit?' ('+unit+')':''}`],rows:checked.points.map(row=>[row.raw,String(row.value),row.difference===null?'Outside finite range':String(row.difference)])}]}):new TextEncoder().encode(text);
 return {filename:`${checked.baseline.identity.calculatorSlug}-v${checked.baseline.identity.calculatorVersion}-what-if.${format}`,mime:format==='pdf'?'application/pdf':format==='csv'?'text/csv;charset=utf-8':'application/json;charset=utf-8',bytes};
}
