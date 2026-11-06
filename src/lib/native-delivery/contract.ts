import {z} from 'zod';
import {runCalculator} from '@/calculators/engine';
import {getPublication20Definition} from '@/lib/publication20';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
export const nativeIdentity=Object.freeze({catalogId:440,engineId:'conversion.frequency',slug:'frequency-converter',version:1});
export class NativeDeliveryError extends Error{constructor(public status:number,message:string){super(message);}}
const inputSchema=z.object({value:z.string().max(4096),fromUnit:z.enum(['hz','khz','mhz','ghz']),toUnit:z.enum(['hz','khz','mhz','ghz'])}).strict();
export const nativeRequestSchema=z.object({catalogId:z.literal(440),version:z.literal(1),input:inputSchema}).strict();
export function runNativeCalculation(raw:unknown){
 const parsed=nativeRequestSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide the exact native identity/version, a finite value and offered units.');
 const entry=getPublication20Definition(nativeIdentity.slug)!;if(entry.catalogId!==440||entry.definition.id!==nativeIdentity.engineId||entry.definition.version!==1)throw new NativeDeliveryError(503,'Native engine binding unavailable');
 const input={...parsed.data.input,value:requiredCalculatorNumber(parsed.data.input.value)};
 try{const {output}=runCalculator(entry.definition,input);validatePublication20Result(entry,input,output);return{...nativeIdentity,enteredValue:parsed.data.input.value,input,output,methodology:entry.definition.formulas,sources:entry.definition.sources,limitations:entry.scope,warnings:['Binary64 values; subnormal input/output and overflow are refused. Display rounding does not change stored results. JSON represents signed zero as zero; enteredValue retains the submitted decimal text.']};}
 catch{throw new NativeDeliveryError(422,'Value is outside the supported finite normal range or has unsupported precision.');}
}
export async function readNativeJson(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new NativeDeliveryError(400,'JSON body required');let length=0;const chunks:Uint8Array[]=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>8192){await reader.cancel();throw new NativeDeliveryError(413,'Request exceeds 8 KiB');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(length);let at=0;for(const c of chunks){bytes.set(c,at);at+=c.length;}try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new NativeDeliveryError(400,'Valid JSON required');}
}
