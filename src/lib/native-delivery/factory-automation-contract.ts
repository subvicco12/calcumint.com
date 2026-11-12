import {equalCompletionJson} from '@/calculators/completion-contracts';
import {z} from 'zod';
import {factoryDeliveryIdentity} from './factory-delivery-catalog';
import {technologyFiveIdentity} from './technology-five-catalog';
import {runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {NativeDeliveryError} from './contract';
/** Only these nine exact registered versions enter the existing durable job/outbox. */
export const factoryAutomationBatchSchema=z.object({catalogId:z.number().int(),version:z.literal(1),rows:z.array(z.record(z.string(),z.string().max(4096))).min(1).max(100),webhookEndpointId:z.uuid().optional()}).strict().refine(x=>Boolean(factoryDeliveryIdentity(x.catalogId,x.version)),'Unsupported exact factory automation tuple');
export function automationIdentity(catalogId:number,version:number){return technologyFiveIdentity(catalogId,version)??factoryDeliveryIdentity(catalogId,version);}
export function runFactoryAutomationBatch(raw:unknown){
 const parsed=factoryAutomationBatchSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide an exact factory tuple and 1–100 decimal-string input objects');
 const {catalogId,version,rows}=parsed.data,identity=factoryDeliveryIdentity(catalogId,version)!;
 return rows.map((input,index)=>{try{
  const packet=runFactoryCalculation(catalogId,version,input);
  return {index,ok:true as const,result:{catalogId,engineId:identity.engineId,slug:identity.slug,version,packet,input:packet.snapshot.input,output:packet.snapshot.output}};
 }catch(error){return {index,ok:false as const,error:error instanceof Error?error.message:'Factory input refused'};}});
}

/** Numerical replay is consistency, not authenticated provenance or release authority. */
export function verifyFactoryAutomationRows(catalogId:number,version:number,inputs:unknown,outputs:unknown){
 const checked=factoryAutomationBatchSchema.safeParse({catalogId,version,rows:inputs});
 if(!checked.success||!equalCompletionJson(runFactoryAutomationBatch(checked.data),outputs))throw new NativeDeliveryError(503,'Immutable factory batch differs from exact engine replay');
}
