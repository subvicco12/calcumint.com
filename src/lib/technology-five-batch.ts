import {runCalculator} from '@/calculators/engine';
import {bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {base64SizeCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {validateTechnologyCapture} from '@/lib/technology-capture-trust';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
import {createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
const definitions=[bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator,base64SizeCalculator] as const;
const fields:Record<string,readonly string[]>={'technology.bandwidth':['dataMegabytes','timeSeconds'],'technology.download-time':['dataMegabytes','bandwidthMbps'],'technology.upload-time':['dataMegabytes','bandwidthMbps'],'technology.data-transfer':['bandwidthMbps','timeSeconds'],'technology.base64-size':['inputBytes']};
export function technologyFiveBatchFields(id:string):readonly string[]{if(!Object.hasOwn(fields,id))throw Error('Unsupported five-calculator batch identity');return fields[id];}
export function technologyFiveBatchResultUnit(id:string):string{technologyFiveBatchFields(id);return id==='technology.bandwidth'?'Mbps':id==='technology.data-transfer'?'MB':id==='technology.base64-size'?'encoded bytes':'seconds';}
export type TechnologyFiveBatch=Readonly<{schemaVersion:1;engineId:string;version:1;rows:readonly Readonly<{raw:string;snapshot?:CalculationSnapshot;error?:string}>[]}>;
/** Local bounded evaluation, not a metered server job or publication authority. */
export function evaluateTechnologyFiveBatch(id:string,draft:string):TechnologyFiveBatch{
 const keys=technologyFiveBatchFields(id),definition=definitions.find(d=>d.id===id)!;
 if(new TextEncoder().encode(draft).length>65536)throw Error('Batch exceeds the 64 KiB engineering limit');
 const lines=draft.replace(/\r\n/g,'\n').split('\n');if(lines.length<1||lines.length>100)throw Error('Enter 1–100 rows (engineering limit)');
 const rows=lines.map(raw=>{try{
  if(raw.length>4096)throw Error('Row exceeds the 4096-character engineering limit');
  const columns=raw.split(',');if(columns.length!==keys.length)throw Error('Provide exactly '+keys.length+' numeric columns in the displayed order');
  const input=Object.fromEntries(keys.map((key,index)=>[key,requiredCalculatorNumber(columns[index])]));
  const output=runCalculator(definition as typeof bandwidthCalculator,input).output;validateTechnologyCapture(id,input,output);
  const profile=getPublication20Definition(definition.slug);if(profile)validatePublication20Result(profile,input,output);
  return Object.freeze({raw,snapshot:createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input,output})});
 }catch(error){return Object.freeze({raw,error:error instanceof Error?error.message:'Invalid row'});}});
 return Object.freeze({schemaVersion:1,engineId:id,version:1,rows:Object.freeze(rows)});
}
function complete(batch:TechnologyFiveBatch){if(!batch.rows.length||batch.rows.some(row=>!row.snapshot||row.error))throw Error('Correct every row before exporting; partial exports are unavailable');}
export function serializeTechnologyFiveBatch(batch:TechnologyFiveBatch):string{complete(batch);const bytes=JSON.stringify(batch,null,2);replayTechnologyFiveBatch(bytes);return bytes;}
export function technologyFiveBatchCsv(batch:TechnologyFiveBatch):string{
 complete(batch);const checked=replayTechnologyFiveBatch(JSON.stringify(batch));const keys=technologyFiveBatchFields(checked.engineId);
 const quote=(x:unknown)=>'"'+String(x).replaceAll('"','""')+'"';
 return [['row','calculator_id','calculator_slug','calculator_version',...keys,'result','result_unit'],...checked.rows.map((r,index)=>[index+1,checked.engineId,r.snapshot!.calculatorSlug,r.snapshot!.calculatorVersion,...keys.map(k=>r.snapshot!.input[k]),r.snapshot!.output.value,technologyFiveBatchResultUnit(checked.engineId)])].map(row=>row.map(quote).join(',')).join('\r\n');
}
/** Verifies unsigned numerical consistency only; not authenticated provenance. */
export function replayTechnologyFiveBatch(bytes:string):TechnologyFiveBatch{
 if(new TextEncoder().encode(bytes).length>524288)throw Error('Replay exceeds the 512 KiB engineering limit');
 const value:unknown=JSON.parse(bytes);
 const shape=(v:unknown,keys:readonly string[])=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join('|')!==[...keys].sort().join('|'))throw Error('Invalid exact batch schema');};
 shape(value,['schemaVersion','engineId','version','rows']);const batch=value as TechnologyFiveBatch;
 if(batch.schemaVersion!==1||batch.version!==1||typeof batch.engineId!=='string'||!Array.isArray(batch.rows)||batch.rows.length<1||batch.rows.length>100)throw Error('Invalid batch identity/version/rows');
 technologyFiveBatchFields(batch.engineId);
 for(const row of batch.rows){shape(row,['raw','snapshot']);if(typeof row.raw!=='string'||/[\r\n]/.test(row.raw))throw Error('Invalid entered row');verifyRegisteredSnapshot(row.snapshot);}
 const checked=evaluateTechnologyFiveBatch(batch.engineId,batch.rows.map(row=>row.raw).join('\n'));complete(checked);
 const same=(a:unknown,b:unknown):boolean=>{if(Object.is(a,b)||a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const x=Object.keys(a),y=Object.keys(b);return x.length===y.length&&x.every(k=>Object.hasOwn(b,k)&&same((a as Record<string,unknown>)[k],(b as Record<string,unknown>)[k]));};
 if(!same(checked,batch))throw Error('Batch replay differs from entered text, exact identity/version or historical result');return checked;
}
