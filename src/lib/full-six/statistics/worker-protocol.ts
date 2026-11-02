import type {DecimalStatisticsInput} from './decimal-descriptive';
import {immutableFullSixArtifact,type FullSixArtifact} from '../result-contract';
import {statisticsBinding} from '../statistics-workflow';

export const STATISTICS_WORKER_PROTOCOL='decimal50-worker-1' as const;
export const MAX_RETAINED_INPUT_CHARACTERS=2_000_000;
export type StatisticsWorkerRequest={protocol:typeof STATISTICS_WORKER_PROTOCOL;jobId:number;catalogId:282|283;input:DecimalStatisticsInput};
export type StatisticsWorkerResponse={protocol:typeof STATISTICS_WORKER_PROTOCOL;jobId:number;catalogId:282|283;artifact:FullSixArtifact};
/** Copy only own data descriptors, with bounds before traversal or schema parsing. */
export function boundedData(value:unknown,maxCharacters=MAX_RETAINED_INPUT_CHARACTERS):unknown{
 let characters=0,nodes=0;const ancestors=new Set<object>();
 function copy(v:unknown,depth:number):unknown{
  if(++nodes>120000||depth>12)throw Error('Message exceeds structural budget');
  if(typeof v==='string'){characters+=v.length;if(characters>maxCharacters)throw Error('Message exceeds character budget');return v;}
  if(v===null||v===undefined||typeof v==='boolean')return v;
  if(typeof v==='number'&&Number.isSafeInteger(v))return v;
  if(typeof v!=='object')throw Error('Message must contain plain data');
  if(ancestors.has(v))throw Error('Cyclic message');
  const array=Array.isArray(v);if(Object.getPrototypeOf(v)!==(array?Array.prototype:Object.prototype))throw Error('Message must contain plain objects');
  ancestors.add(v);const keys=Reflect.ownKeys(v);if(keys.length>10001)throw Error('Message exceeds entry budget');
  if(array){
   const length=Object.getOwnPropertyDescriptor(v,'length');
   if(!length||!('value'in length)||!Number.isSafeInteger(length.value)||length.value<0||length.value>10000||length.enumerable||keys.length!==length.value+1)throw Error('Array must be dense and bounded');
   // Exact canonical index set; symbols, custom keys, and sparse arrays cannot normalize away.
   for(const key of keys){if(key==='length')continue;if(typeof key!=='string'||!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=length.value)throw Error('Invalid array field');}
  }
  const result:Record<string,unknown>|unknown[]=array?[]:{};
  for(const key of keys){if(array&&key==='length')continue;if(typeof key!=='string'||key==='__proto__'||key==='constructor'||key==='prototype')throw Error('Invalid data key');characters+=key.length;if(characters>maxCharacters)throw Error('Message exceeds character budget');const d=Object.getOwnPropertyDescriptor(v,key);if(!d||!('value'in d)||!d.enumerable)throw Error('Only enumerable data descriptors are accepted');Object.defineProperty(result,key,{value:copy(d.value,depth+1),enumerable:true,writable:true,configurable:true});}
  ancestors.delete(v);return result;
 }
 return copy(value,0);
}
function exactKeys(value:object,allowed:string[]){if(Object.keys(value).some(k=>!allowed.includes(k)))throw Error('Unexpected message field');}
export function validateStatisticsInput(value:unknown):DecimalStatisticsInput{
 const input=boundedData(value) as DecimalStatisticsInput;
 if(!input||typeof input!=='object')throw Error('Invalid input');exactKeys(input,['mode','encoding','rows','missingPolicy','unit']);
 if(!['sample','population'].includes(input.mode)||!['raw','frequency'].includes(input.encoding)||!['reject','omit'].includes(input.missingPolicy??'reject')||(input.unit!==undefined&&(typeof input.unit!=='string'||input.unit.length>40))||!Array.isArray(input.rows)||input.rows.length<1||input.rows.length>10000)throw Error('Invalid bounded statistics input');
 for(const row of input.rows){if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Invalid row');exactKeys(row,['value','frequency','missing']);if((row.value!==undefined&&row.value!==null&&(typeof row.value!=='string'||row.value.length>128))||(row.frequency!==undefined&&(typeof row.frequency!=='string'||row.frequency.length>128))||(row.missing!==undefined&&typeof row.missing!=='boolean'))throw Error('Invalid bounded row');}
 return input;
}
export function validateStatisticsRequest(value:unknown):StatisticsWorkerRequest{
 const r=boundedData(value) as StatisticsWorkerRequest;if(!r||typeof r!=='object')throw Error('Invalid request');exactKeys(r,['protocol','jobId','catalogId','input']);if(r.protocol!==STATISTICS_WORKER_PROTOCOL||!Number.isSafeInteger(r.jobId)||r.jobId<1||![282,283].includes(r.catalogId))throw Error('Invalid worker request identity');return {...r,input:validateStatisticsInput(r.input)};
}
export function validateStatisticsResponse(value:unknown,request:StatisticsWorkerRequest):FullSixArtifact{
 const r=boundedData(value,3_000_000) as StatisticsWorkerResponse;if(!r||typeof r!=='object')throw Error('Invalid response');exactKeys(r,['protocol','jobId','catalogId','artifact']);if(r.protocol!==STATISTICS_WORKER_PROTOCOL||r.jobId!==request.jobId||r.catalogId!==request.catalogId)throw Error('Worker response identity mismatch');
 const artifact=immutableFullSixArtifact(r.artifact),binding=statisticsBinding(request.catalogId);
 for(const key of Object.keys(binding) as (keyof typeof binding)[])if(artifact[key]!==binding[key])throw Error('Artifact binding mismatch');
 if(artifact.numericPolicy.revision!==binding.implementationRevision||artifact.numericPolicy.precisionDigits!==50||artifact.numericPolicy.rounding!=='half-even')throw Error('Numeric policy mismatch');
 const input=request.input,expectedModes={mode:input.mode,encoding:input.encoding,missingPolicy:input.missingPolicy??'reject',unit:input.unit??''};
 if(JSON.stringify(artifact.modes)!==JSON.stringify(expectedModes))throw Error('Input mode mismatch');
 if(Object.keys(artifact.inputs).length!==input.rows.length||input.rows.some((row,i)=>artifact.inputs[String(i)]!==JSON.stringify({value:row.value??null,...(row.frequency!==undefined?{frequency:row.frequency}:{}),...(row.missing!==undefined?{missing:row.missing}:{})})))throw Error('Input binding mismatch');
 if(artifact.sources.length!==1||artifact.sources[0].sourceId!=='NIST-SCALE'||artifact.sources[0].contentSHA256!=='f534c231c9a18207ae0dc8d977fe1b045afbeef94ae17c98e9f6a79895ba7aa8'||artifact.sources[0].clause!=='Supplied retrieval: Measures of Scale; sample dispersion and squared/original units; no new publisher authentication claimed.')throw Error('Source binding mismatch');
 return artifact;
}
