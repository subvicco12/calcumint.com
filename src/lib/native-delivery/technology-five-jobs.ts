import {technologyNativeTupleShape,isTechnologyNativeTuple} from './technology-native-schema';
import {z} from 'zod';import {NativeDeliveryError} from './contract';import {runTechnologyFiveCalculation} from './technology-five-contract';
/** Technical row bound inherited verbatim from the existing /api/v1/batch contract. */
export const technologyFiveBatchSchema=z.object({...technologyNativeTupleShape,rows:z.array(z.record(z.string(),z.json())).min(1).max(100),webhookEndpointId:z.uuid().optional()}).strict().refine(isTechnologyNativeTuple,'Unsupported exact Technology tuple');
export type TechnologyFiveBatch=z.infer<typeof technologyFiveBatchSchema>;
export function runTechnologyFiveBatch(raw:unknown){const parsed=technologyFiveBatchSchema.safeParse(raw);if(!parsed.success)throw new NativeDeliveryError(422,'Provide an exact Technology tuple and1–100 input objects');const {catalogId,version,rows}=parsed.data;return rows.map((input,index)=>{try{return {index,ok:true as const,result:runTechnologyFiveCalculation({catalogId,version,input})};}catch(error){if(!(error instanceof NativeDeliveryError)||error.status!==422)throw error;return {index,ok:false as const,error:error.message};}});}
