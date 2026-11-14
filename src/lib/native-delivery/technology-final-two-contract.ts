import {z} from 'zod';
import {calculatorRegistry} from '@/calculators/registry';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {runTechnologyFinalTwo,technologyFinalTwoDefinition} from '@/lib/technology-final-two-analysis';
import {technologyFinalTwoIdentity} from './technology-final-two-catalog';
import {NativeDeliveryError} from './contract';
const decimal=z.string().min(1).max(4096);
export const technologyFinalTwoRequestSchema=z.discriminatedUnion('catalogId',[
 z.object({catalogId:z.literal(368),version:z.literal(1),input:z.object({address:z.string().min(1).max(15),prefixLength:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(376),version:z.literal(1),input:z.object({widthPixels:decimal,heightPixels:decimal,diagonalInches:decimal}).strict()}).strict()
]);
export function runTechnologyFinalTwoCalculation(raw:unknown){const parsed=technologyFinalTwoRequestSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide the exact final-two tuple, IPv4 text and decimal-string numeric fields');
 const identity=technologyFinalTwoIdentity(parsed.data.catalogId,parsed.data.version)!,definition=technologyFinalTwoDefinition(identity.engineId),registered=calculatorRegistry.getBySlug(identity.slug);if(!registered||registered.id!==identity.engineId||registered.version!==identity.version||definition.slug!==identity.slug)throw new NativeDeliveryError(503,'Exact existing final-two engine unavailable');
 const enteredInput=parsed.data.input,input=Object.fromEntries(Object.entries(enteredInput).map(([key,value])=>[key,identity.catalogId===368&&key==='address'?value:requiredCalculatorNumber(value)]));
 try{const output=runTechnologyFinalTwo(identity.engineId,input);return{catalogId:identity.catalogId,engineId:identity.engineId,slug:identity.slug,version:identity.version,title:identity.title,unit:identity.unit,enteredInput,input,output,methodology:definition.formulas,sources:definition.sources,limitations:identity.limitations,warnings:['Original registered binary64 v1 engine. Entered IPv4 text and numeric strings are retained; refused numeric precision is not rounded into acceptance. JSON represents signed zero as zero. No source/canonical certification or publication approval.']};}catch{throw new NativeDeliveryError(422,'Inputs violate the original profile domain or current capture precision boundary');}
}
