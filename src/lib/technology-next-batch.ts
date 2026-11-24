import {technologyNextCatalog} from '@/lib/native-delivery/technology-next-catalog';
import {technologyNextFiveCatalog} from '@/lib/native-delivery/technology-next-five-catalog';
import {technologyFinalTwoCatalog} from '@/lib/native-delivery/technology-final-two-catalog';
import {runTechnologyNextFive} from './technology-next-five-analysis';
import {runTechnologyFinalTwo} from './technology-final-two-analysis';
import {runTechnologyNext,technologyNextAxis} from './technology-next-analysis';
import {requiredCalculatorNumber} from './registered-input-successor';
import {createCalculationSnapshot,type CalculationSnapshot} from './calculation-snapshot';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
export type TechnologyNextBatch=Readonly<{schemaVersion:1;engineId:string;version:number;rows:readonly Readonly<{raw:string;snapshot?:CalculationSnapshot;error?:string}>[]}>;
const batchProfiles=[
 {catalog:technologyNextCatalog,run:runTechnologyNext},
 {catalog:technologyNextFiveCatalog,run:runTechnologyNextFive},
 {catalog:technologyFinalTwoCatalog,run:runTechnologyFinalTwo}
] as const;
function batchProfile(id:string){
 for(const profile of batchProfiles){
  const descriptor=profile.catalog.find(row=>row.engineId===id);
  if(descriptor)return {descriptor,run:profile.run};
 }
 throw Error('Unsupported exact batch identity');
}
export function technologyNextBatchDescriptor(id:string){return batchProfile(id).descriptor;}
function resultUnit(id:string,input:Readonly<Record<string,unknown>>){
 return id==='technology.storage-conversion'?technologyNextAxis(id,input).resultUnit:technologyNextBatchDescriptor(id).unit;
}
/** Local evaluation only; no account persistence, API quota or server job is created. */
export function evaluateTechnologyNextBatch(id:string,draft:string):TechnologyNextBatch{
 const {descriptor,run}=batchProfile(id);
 if(new TextEncoder().encode(draft).length>65536)throw Error('Batch exceeds the 64 KiB engineering limit');
 const lines=draft.replace(/\r\n/g,'\n').split('\n');
 if(lines.length>100)throw Error('Enter 1–100 rows');
 const rows=lines.map(raw=>{
  try{
   if(raw.length>4096)throw Error('Row exceeds 4096 characters');
   const parts=raw.split(',');
   if(parts.length!==descriptor.fields.length)throw Error('Provide exactly '+descriptor.fields.length+' columns');
   const input=Object.fromEntries(descriptor.fields.map(([key],index)=>{
    const entered=parts[index].trim();
    const options=descriptor.enumOptions[key];
    if(options){
     if(!options.includes(entered))throw Error('Select an offered '+key);
     return [key,entered];
    }
    if(descriptor.engineId==='technology.ip-subnet'&&key==='address')return [key,entered];
    const number=requiredCalculatorNumber(entered);
    if(!Number.isFinite(number))throw Error('Enter complete finite decimal inputs');
    return [key,number];
   }));
   const output=run(id,input);
   const snapshot=createCalculationSnapshot({calculatorSlug:descriptor.slug,calculatorVersion:descriptor.version,input,output});
   return Object.freeze({raw,snapshot});
  }catch(error){
   return Object.freeze({raw,error:error instanceof Error?error.message:'Invalid row'});
  }
 });
 return Object.freeze({schemaVersion:1,engineId:id,version:descriptor.version,rows:Object.freeze(rows)});
}
function complete(batch:TechnologyNextBatch){if(!batch.rows.length||batch.rows.some(r=>!r.snapshot||r.error))throw Error('Correct every row before exporting; partial exports are unavailable');}
export function serializeTechnologyNextBatch(batch:TechnologyNextBatch){complete(batch);const bytes=JSON.stringify(batch,null,2);replayTechnologyNextBatch(bytes);return bytes;}
export function technologyNextBatchCsv(batch:TechnologyNextBatch){complete(batch);const b=replayTechnologyNextBatch(JSON.stringify(batch)),d=technologyNextBatchDescriptor(b.engineId),q=(v:unknown)=>'"'+String(v).replaceAll('"','""')+'"';return [['row','calculator_id','calculator_slug','calculator_version',...d.fields.map(f=>f[0]),'result','result_unit'],...b.rows.map((r,i)=>[i+1,b.engineId,r.snapshot!.calculatorSlug,b.version,...d.fields.map(f=>r.snapshot!.input[f[0]]),r.snapshot!.output.value,resultUnit(b.engineId,r.snapshot!.input)])].map(r=>r.map(q).join(',')).join('\r\n');}
function same(a:unknown,b:unknown):boolean{if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&same((a as Record<string,unknown>)[k],(b as Record<string,unknown>)[k]));}
export function replayTechnologyNextBatch(bytes:string):TechnologyNextBatch{
 if(new TextEncoder().encode(bytes).length>524288)throw Error('Replay exceeds 512 KiB');const raw:unknown=JSON.parse(bytes);
 function shape(v:unknown,keys:readonly string[]){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join('|')!==[...keys].sort().join('|'))throw Error('Invalid exact batch shape');}
 shape(raw,['schemaVersion','engineId','version','rows']);const b=raw as TechnologyNextBatch;const d=technologyNextBatchDescriptor(b.engineId);
 if(b.schemaVersion!==1||b.version!==d.version||!Array.isArray(b.rows)||!b.rows.length||b.rows.length>100)throw Error('Invalid exact batch identity/version/rows');
 for(const r of b.rows){shape(r,['raw','snapshot']);if(typeof r.raw!=='string'||/[\r\n]/.test(r.raw))throw Error('Invalid entered row');verifyRegisteredSnapshot(r.snapshot);}
 const checked=evaluateTechnologyNextBatch(b.engineId,b.rows.map(r=>r.raw).join('\n'));complete(checked);if(!same(checked,b))throw Error('Replay differs from exact identity, original entered text or historical output');return checked;
}
