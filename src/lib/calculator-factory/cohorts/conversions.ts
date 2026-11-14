/** Closed delivery bridge to existing v1 engines; no lifecycle or source approval. */
import {z} from 'zod';
import {runCalculator} from '@/calculators/engine';
import {conversionPublicationDefinitions} from '@/lib/publication20/conversions';
import type {Publication20Definition} from '@/lib/publication20/types';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {sameRecordedJson} from '@/lib/recorded-json-equality';

export const conversionFactoryCatalogIds=Object.freeze([423,424,425,427,428,430,431,432,433,434,438,440] as const);
const rawDecimal=z.string().min(1).max(4096).refine(value=>{try{return Number.isFinite(requiredCalculatorNumber(value));}catch{return false;}},'Enter a complete finite decimal without losing entered digits');
export type ConversionFactoryRequest={catalogId:number;version:1;input:{value:string;fromUnit:string;toUnit:string}};
function requestSchema(entry:Publication20Definition){
 const units=entry.fields.find(field=>field.key==='fromUnit')!.options!;
 const unit=z.string().refine(value=>units.includes(value),'Select an exact offered unit code');
 return z.object({catalogId:z.literal(entry.catalogId),version:z.literal(1),input:z.object({value:rawDecimal,fromUnit:unit,toUnit:unit}).strict()}).strict();
}
function execute(entry:Publication20Definition,raw:unknown){
 const request=requestSchema(entry).parse(raw),enteredInput=Object.freeze({...request.input});
 const input={...enteredInput,value:requiredCalculatorNumber(enteredInput.value)};
 const output=runCalculator(entry.definition,input).output;
 validatePublication20Result(entry,input,output);
 const snapshot=createCalculationSnapshot({calculatorSlug:entry.definition.slug,calculatorVersion:entry.definition.version,input,output});
 return Object.freeze({catalogId:entry.catalogId,engineId:entry.definition.id,version:entry.definition.version,slug:entry.definition.slug,enteredInput,input:snapshot.input,output:snapshot.output,unit:entry.outputUnit(input),snapshot,scope:entry.scope});
}
export type ConversionFactoryDefinition=Publication20Definition&Readonly<{
 engineId:string;version:1;requestSchema:ReturnType<typeof requestSchema>;
 run:(raw:unknown)=>ReturnType<typeof execute>;
}>;
export const conversionFactoryDefinitions:readonly ConversionFactoryDefinition[]=Object.freeze(conversionFactoryCatalogIds.map(catalogId=>{
 const entry=conversionPublicationDefinitions.find(row=>row.catalogId===catalogId);
 if(!entry||entry.definition.version!==1)throw Error('Exact conversion v1 binding unavailable');
 return Object.freeze({...entry,engineId:entry.definition.id,version:1 as const,requestSchema:requestSchema(entry),run:(raw:unknown)=>execute(entry,raw)});
}));
export function getConversionFactoryDefinition(catalogId:number){return conversionFactoryDefinitions.find(entry=>entry.catalogId===catalogId);}
export function runConversionFactoryCalculation(raw:unknown){
 const identity=z.object({catalogId:z.number().int()}).passthrough().parse(raw);
 const entry=getConversionFactoryDefinition(identity.catalogId);
 if(!entry)throw Error('Unsupported conversion factory identity');
 return entry.run(raw);
}
/** Current raw-input agreement plus existing unsigned historical numeric consistency. */
export function replayConversionFactoryCalculation(raw:unknown,recorded:unknown){
 const result=runConversionFactoryCalculation(raw),verified=verifyRegisteredSnapshot(recorded);
 if(!sameRecordedJson(result.snapshot,verified.snapshot))throw Error('Conversion replay does not match the exact entered input and v1 result');
 return result;
}
