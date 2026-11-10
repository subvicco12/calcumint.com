import {z} from 'zod';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {validateTechnologyCapture} from '@/lib/technology-capture-trust';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
import {NativeDeliveryError} from './contract';
import {technologyNextRequestSchema,runTechnologyNextCalculation} from './technology-next-contract';
import {technologyNextFiveRequestSchema,runTechnologyNextFiveCalculation} from './technology-next-five-contract';
import {technologyFiveIdentity} from './technology-five-catalog';
const decimal=z.string().min(1).max(4096),transfer=z.object({dataMegabytes:decimal,bandwidthMbps:decimal}).strict();
export const technologyFiveLegacyRequestSchema=z.discriminatedUnion('catalogId',[
 z.object({catalogId:z.literal(370),version:z.literal(1),input:z.object({dataMegabytes:decimal,timeSeconds:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(371),version:z.literal(1),input:transfer}).strict(),
 z.object({catalogId:z.literal(372),version:z.literal(1),input:transfer}).strict(),
 z.object({catalogId:z.literal(373),version:z.literal(1),input:z.object({bandwidthMbps:decimal,timeSeconds:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(386),version:z.literal(1),input:z.object({inputBytes:decimal}).strict()}).strict()
]);
export const technologyFiveRequestSchema=z.union([technologyFiveLegacyRequestSchema,technologyNextRequestSchema,technologyNextFiveRequestSchema]);
/** Pure deterministic delivery contract only. Routes separately require actual publication and Business authority. */
export function runTechnologyFiveCalculation(raw:unknown){
 const nextFive=technologyNextFiveRequestSchema.safeParse(raw);if(nextFive.success)return runTechnologyNextFiveCalculation(nextFive.data);
 const next=technologyNextRequestSchema.safeParse(raw);if(next.success)return runTechnologyNextCalculation(next.data);
 const parsed=technologyFiveLegacyRequestSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide the exact supported Technology identity/version and decimal-string inputs');
 const identity=technologyFiveIdentity(parsed.data.catalogId,parsed.data.version)!;const definition=calculatorRegistry.getBySlug(identity.slug);
 if(!definition||definition.id!==identity.engineId||definition.version!==identity.version)throw new NativeDeliveryError(503,'Exact Technology engine unavailable');
 const enteredInput=parsed.data.input,input=Object.fromEntries(Object.entries(enteredInput).map(([key,value])=>[key,requiredCalculatorNumber(value)]));
 try{
  const output=runCalculator(definition,input).output as {value:number;steps:readonly string[]};validateTechnologyCapture(definition.id,input,output);const entry=getPublication20Definition(identity.slug);if(entry)validatePublication20Result(entry,input,output);
  return {catalogId:identity.catalogId,engineId:identity.engineId,slug:identity.slug,version:identity.version,title:identity.title,unit:identity.unit,enteredInput,input,output,methodology:definition.formulas,sources:definition.sources,limitations:identity.catalogId===386?'Padded Base64 payload length only; no line wrapping or MIME/data-URL headers.':'Ideal decimal MB/Mbps arithmetic; protocol overhead, latency and congestion are excluded.',warnings:['Original registered binary64 engine and version; unsupported decimal precision, subnormal values and underflow are refused at new delivery captures. Display rounding does not change raw output.']};
 }catch{throw new NativeDeliveryError(422,'Inputs are outside the original supported domain or current finite normal precision boundary');}
}
