import {runFactoryEmbedCalculation} from './factory-embed-contract';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {readNativeJson,NativeDeliveryError} from './contract';
/** Capture authorized attempts, including refusals, for the existing request-based quota.
 * Invalid grants/origins/authority are still rejected before this boundary.
 */
export async function captureEmbedRequest(request:Request,catalogId=440,version=1){
 const parsed=z.uuid().safeParse(request.headers.get('Idempotency-Key'));
 const requestId=parsed.success?parsed.data:randomUUID();let input:unknown=null;
 try{
  if(!parsed.success)throw new NativeDeliveryError(422,'UUID Idempotency-Key required');
  input=await readNativeJson(request);
  return{requestId,input,status:200,result:runFactoryEmbedCalculation(catalogId,version,input)};
 }catch(error){
  if(!(error instanceof NativeDeliveryError)||error.status<400||error.status>=500)throw error;
  return{requestId,input,status:error.status,result:{error:error.message}};
 }
}
