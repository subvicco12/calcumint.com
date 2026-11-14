import {technologyNextCatalog} from '@/lib/native-delivery/technology-next-catalog';
import {technologyNextDefinition,runTechnologyNext,technologyNextAxis} from './technology-next-analysis';
import {requiredCalculatorNumber} from './registered-input-successor';
import {createCalculationSnapshot,type CalculationSnapshot} from './calculation-snapshot';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
export type TechnologyNextBatch=Readonly<{schemaVersion:1;engineId:string;version:number;rows:readonly Readonly<{raw:string;snapshot?:CalculationSnapshot;error?:string}>[]}>;
export function technologyNextBatchDescriptor(id:string){const d=technologyNextCatalog.find(d=>d.engineId===id);if(!d)throw Error('Unsupported exact batch identity');return d;}
/** Local evaluation only; no account persistence, API quota or server job is created. */
export function evaluateTechnologyNextBatch(id:string,draft:string):TechnologyNextBatch{
 const d=technologyNextBatchDescriptor(id),definition=technologyNextDefinition(id);if(new TextEncoder().encode(draft).length>65536)throw Error('Batch exceeds the 64 KiB engineering limit');
 const lines=draft.replace(/\r\n/g,'\n').split('\n');if(lines.length>100)throw Error('Enter 1–100 rows');
 const rows=lines.map(raw=>{try{if(raw.length>4096)throw Error('Row exceeds 4096 characters');const parts=raw.split(',');if(parts.length!==d.fields.length)throw Error('Provide exactly '+d.fields.length+' columns');const input=Object.fromEntries(d.fields.map(([key],i)=>{const options=d.enumOptions[key];if(options){if(!options.includes(parts[i].trim()))throw Error('Select an offered '+key);return [key,parts[i].trim()];}const n=requiredCalculatorNumber(parts[i]);if(!Number.isFinite(n))throw Error('Enter complete finite decimal inputs');return [key,n];}));const output=runTechnologyNext(id,input);return Object.freeze({raw,snapshot:createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input,output})});}catch(e){return Object.freeze({raw,error:e instanceof Error?e.message:'Invalid row'});}});
 return Object.freeze({schemaVersion:1,engineId:id,version:definition.version,rows:Object.freeze(rows)});
}
function complete(batch:TechnologyNextBatch){if(!batch.rows.length||batch.rows.some(r=>!r.snapshot||r.error))throw Error('Correct every row before exporting; partial exports are unavailable');}
export function serializeTechnologyNextBatch(batch:TechnologyNextBatch){complete(batch);const bytes=JSON.stringify(batch,null,2);replayTechnologyNextBatch(bytes);return bytes;}
export function technologyNextBatchCsv(batch:TechnologyNextBatch){complete(batch);const b=replayTechnologyNextBatch(JSON.stringify(batch)),d=technologyNextBatchDescriptor(b.engineId),q=(v:unknown)=>'"'+String(v).replaceAll('"','""')+'"';return [['row','calculator_id','calculator_slug','calculator_version',...d.fields.map(f=>f[0]),'result','result_unit'],...b.rows.map((r,i)=>[i+1,b.engineId,r.snapshot!.calculatorSlug,b.version,...d.fields.map(f=>r.snapshot!.input[f[0]]),r.snapshot!.output.value,technologyNextAxis(b.engineId,r.snapshot!.input).resultUnit])].map(r=>r.map(q).join(',')).join('\r\n');}
function same(a:unknown,b:unknown):boolean{if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&same((a as Record<string,unknown>)[k],(b as Record<string,unknown>)[k]));}
export function replayTechnologyNextBatch(bytes:string):TechnologyNextBatch{
 if(new TextEncoder().encode(bytes).length>524288)throw Error('Replay exceeds 512 KiB');const raw:unknown=JSON.parse(bytes);
 function shape(v:unknown,keys:readonly string[]){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join('|')!==[...keys].sort().join('|'))throw Error('Invalid exact batch shape');}
 shape(raw,['schemaVersion','engineId','version','rows']);const b=raw as TechnologyNextBatch;const definition=technologyNextDefinition(b.engineId);
 if(b.schemaVersion!==1||b.version!==definition.version||!Array.isArray(b.rows)||!b.rows.length||b.rows.length>100)throw Error('Invalid exact batch identity/version/rows');
 for(const r of b.rows){shape(r,['raw','snapshot']);if(typeof r.raw!=='string'||/[\r\n]/.test(r.raw))throw Error('Invalid entered row');verifyRegisteredSnapshot(r.snapshot);}
 const checked=evaluateTechnologyNextBatch(b.engineId,b.rows.map(r=>r.raw).join('\n'));complete(checked);if(!same(checked,b))throw Error('Replay differs from exact identity, original entered text or historical output');return checked;
}
