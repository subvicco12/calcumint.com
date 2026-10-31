/** Private evidence previews only. Registered scenario/risk allowlists remain separate. */
import {z} from 'zod';
import {exportScaledContract,importScaledContract,getScaledAdapter} from '@/calculators/scaled-contract-adapters';
import {copyCalculationData} from './calculation-snapshot';
import {recordedNumberDifference} from './recorded-number-difference';
function verifiedContext(raw:unknown){
 const baseline=importScaledContract(raw),adapter=getScaledAdapter(baseline.adapterKey);
 const input=adapter.getInput(baseline.artifact) as Record<string,unknown>;
 const schema=z.toJSONSchema(adapter.input,{io:'input'});
 const properties=schema.properties??{};
 const fields=Object.entries(properties).filter(([key,node])=>
  node!==true&&node!==false&&(node.type==='number'||node.type==='integer')&&
  Object.hasOwn(input,key)&&typeof input[key]==='number'&&Number.isFinite(input[key]),
 ).map(([key])=>key);
 return {baseline,adapter,input,fields};
}
/** Only declared top-level numeric fields already supplied in the verified complete input. */
export function eligiblePrivateSensitivityFields(raw:unknown):readonly string[]{return Object.freeze(verifiedContext(raw).fields);}
export function previewPrivateSensitivity(raw:unknown,field:string,candidateValues:readonly number[]){
 const {baseline,adapter,input,fields}=verifiedContext(raw);
 if(typeof field!=='string'||!fields.includes(field))throw Error('Select a supplied top-level numeric field supported by this immutable private contract.');
 const copied=copyCalculationData({values:candidateValues},{}).input.values;
 if(!Array.isArray(copied)||copied.length<1||copied.length>25||copied.some(value=>typeof value!=='number'||!Number.isFinite(value)))throw Error('Supply 1–25 finite numeric candidate values.');
 const baselineValue=adapter.getOutput(baseline.artifact).value;
 // Construct all points before returning: one invalid domain fails the entire preview.
 const points=copied.map((inputValue:number)=>{
  const completeInput=copyCalculationData({input},{}).input.input as Record<string,unknown>;
  const packet=importScaledContract(exportScaledContract(adapter.key,{...completeInput,[field]:inputValue},'free'));
  if(packet.adapterKey!==baseline.adapterKey||packet.engineVersion!==baseline.engineVersion||packet.validationRevision!==baseline.validationRevision)throw Error('Private preview immutable identity changed.');
  const value=adapter.getOutput(packet.artifact).value;
  return Object.freeze({inputValue,packet,value,difference:typeof value==='number'&&typeof baselineValue==='number'?recordedNumberDifference(value,baselineValue):null});
 });
 return Object.freeze({baseline,field,points:Object.freeze(points)});
}
export type PrivateSensitivityPreview=ReturnType<typeof previewPrivateSensitivity>;
