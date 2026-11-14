import {randomUUID} from 'node:crypto';import {z} from 'zod';
import {readNativeJson,NativeDeliveryError} from './contract';
import {runTechnologyFiveCalculation} from './technology-five-contract';
/** Identity comes exclusively from the verified grant. Authorized refusal attempts are metered too. */
export async function captureTechnologyFiveEmbedRequest(request:Request,identity:{catalogId:number;version:number}){
 const key=z.uuid().safeParse(request.headers.get('Idempotency-Key'));const requestId=key.success?key.data:randomUUID();let input:unknown=null;
 try{if(!key.success)throw new NativeDeliveryError(422,'UUID Idempotency-Key required');input=await readNativeJson(request);return {requestId,input,status:200,result:runTechnologyFiveCalculation({...identity,input})};}
 catch(error){if(!(error instanceof NativeDeliveryError)||error.status<400||error.status>=500)throw error;return {requestId,input,status:error.status,result:{error:error.message}};}
}
