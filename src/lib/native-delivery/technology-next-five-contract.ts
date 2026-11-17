import {z} from 'zod';
import {calculatorRegistry} from '@/calculators/registry';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {runTechnologyNextFive,technologyNextFiveDefinition} from '@/lib/technology-next-five-analysis';
import {NativeDeliveryError} from './contract';
import {technologyNextFiveIdentity} from './technology-next-five-catalog';
const decimal=z.string().min(1).max(4096);
export const technologyNextFiveRequestSchema=z.discriminatedUnion('catalogId',[
 z.object({catalogId:z.literal(369),version:z.literal(1),input:z.object({prefixLength:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(375),version:z.literal(1),input:z.object({diskCount:decimal,diskSizeGb:decimal,raidLevel:z.enum(['0','1','5','6','10'])}).strict()}).strict(),
 z.object({catalogId:z.literal(380),version:z.literal(1),input:z.object({capacityWh:decimal,loadWatts:decimal,efficiencyPercent:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(381),version:z.literal(1),input:z.object({batteryWh:decimal,loadWatts:decimal,efficiencyPercent:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(387),version:z.literal(1),input:z.object({length:decimal,characterPoolSize:decimal}).strict()}).strict()
]);
/** Closed private software delivery tuple; no new engine version or publication authorization. */
export function runTechnologyNextFiveCalculation(raw:unknown){const parsed=technologyNextFiveRequestSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide the exact next-five tuple and declared decimal-string inputs');const identity=technologyNextFiveIdentity(parsed.data.catalogId,parsed.data.version)!;const definition=technologyNextFiveDefinition(identity.engineId),registered=calculatorRegistry.getBySlug(identity.slug);if(!registered||registered.id!==identity.engineId||registered.version!==identity.version||definition.slug!==identity.slug||definition.version!==identity.version)throw new NativeDeliveryError(503,'Exact next-five engine unavailable');const enteredInput=parsed.data.input,input=Object.fromEntries(Object.entries(enteredInput).map(([key,value])=>[key,Object.hasOwn(identity.enumOptions,key)?value:requiredCalculatorNumber(value)]));try{const output=runTechnologyNextFive(identity.engineId,input);return{catalogId:identity.catalogId,engineId:identity.engineId,slug:identity.slug,version:identity.version,title:identity.title,unit:identity.unit,enteredInput,input,output,methodology:definition.formulas,sources:definition.sources,limitations:identity.limitations,warnings:['Registered raw binary64 engine and exact immutable technical revision; refused precision is not rounded into acceptance. No canonical/source certification or publication approval. JSON represents signed zero as zero.']};}catch{throw new NativeDeliveryError(422,'Inputs violate the original domain or current capture precision boundary');}}
