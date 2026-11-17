import {z} from 'zod';import {calculatorRegistry} from '@/calculators/registry';import {runCalculator} from '@/calculators/engine';import {requiredCalculatorNumber} from '@/lib/registered-input-successor';import {validateTechnologyNextCapture} from '@/lib/technology-next-capture-trust';import {getPublication20Definition} from '@/lib/publication20';import {validatePublication20Result} from '@/lib/publication20/result-trust';import {NativeDeliveryError} from './contract';import {technologyNextIdentity} from './technology-next-catalog';
const decimal=z.string().min(1).max(4096),units=z.enum(['B','KiB','MiB','GiB','TiB']);
export const technologyNextRequestSchema=z.discriminatedUnion('catalogId',[
 z.object({catalogId:z.literal(374),version:z.literal(1),input:z.object({value:decimal,fromUnit:units,toUnit:units}).strict()}).strict(),
 z.object({catalogId:z.literal(377),version:z.literal(1),input:z.object({width:decimal,height:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(378),version:z.literal(1),input:z.object({widthPixels:decimal,heightPixels:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(379),version:z.literal(1),input:z.object({pixels:decimal,lengthInches:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(382),version:z.literal(1),input:z.object({systemLoadWatts:decimal,headroomPercent:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(383),version:z.literal(2),input:z.object({pageSizeMb:decimal,monthlyPageViews:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(384),version:z.literal(1),input:z.object({storageGb:decimal,pricePerGbMonth:decimal}).strict()}).strict(),
 z.object({catalogId:z.literal(385),version:z.literal(1),input:z.object({transferGb:decimal,pricePerGb:decimal}).strict()}).strict()
]);
/** New closed delivery contract, not a new mathematical engine or a publication authorization. */
export function runTechnologyNextCalculation(raw:unknown){
 const parsed=technologyNextRequestSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide the exact next-cohort tuple, offered units and decimal-string numeric inputs');
 const identity=technologyNextIdentity(parsed.data.catalogId,parsed.data.version)!,definition=calculatorRegistry.getBySlug(identity.slug);if(!definition||definition.id!==identity.engineId||definition.version!==identity.version)throw new NativeDeliveryError(503,'Exact next-cohort engine unavailable');
 const enteredInput=parsed.data.input,input=Object.fromEntries(Object.entries(enteredInput).map(([key,value])=>[key,Object.hasOwn(identity.enumOptions,key)?value:requiredCalculatorNumber(value)]));
 try{const output=runCalculator(definition,input).output as {value:number;steps:readonly string[]};validateTechnologyNextCapture(definition.id,input,output);const entry=getPublication20Definition(identity.slug);if(entry)validatePublication20Result(entry,input,output);
 return {catalogId:identity.catalogId,engineId:identity.engineId,slug:identity.slug,version:identity.version,title:identity.title,unit:identity.catalogId===374?String(input.toUnit):identity.unit,enteredInput,input,output,methodology:definition.formulas,sources:definition.sources,limitations:identity.limitations,warnings:['Raw binary64 numeric result; not an exact-integer or full real-arithmetic claim. Original registered binary64 engine and exact technical version; unsupported decimal provenance and refused result domains are not rounded into acceptance. JSON encodes signed zero as zero; enteredInput retains original decimal strings.']};
 }catch{throw new NativeDeliveryError(422,'Inputs are outside the original supported domain or current capture precision boundary');}
}
