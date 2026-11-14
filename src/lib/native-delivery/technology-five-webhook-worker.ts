import {randomUUID} from 'node:crypto';import {z} from 'zod';import {webhookHeaders} from '@/lib/api/webhooks';import {automationIdentity,verifyFactoryAutomationRows} from './factory-automation-contract';import {factoryDeliveryIdentity} from './factory-delivery-catalog';import {sendTechnologyWebhook} from './technology-five-webhook-transport';
const claimSchema=z.object({status:z.literal('claimed'),id:z.uuid(),eventId:z.uuid(),leaseToken:z.uuid(),payloadText:z.string().max(2000000),endpointUrl:z.string(),secretCiphertext:z.string(),organizationId:z.uuid(),issuerId:z.uuid(),catalogId:z.number().int(),version:z.number().int()});
export type TechnologyWebhookClaim=z.infer<typeof claimSchema>;
export type TechnologyWebhookOutcome={id:string;leaseToken:string;delivered:boolean;httpStatus:number|null;error:string|null};
export type TechnologyWebhookDependencies={claim:(token:string)=>Promise<unknown>;check:(id:string,token:string)=>Promise<boolean>;finish:(outcome:TechnologyWebhookOutcome)=>Promise<boolean>;assertAuthority:(claim:TechnologyWebhookClaim)=>Promise<void>;decrypt:(ciphertext:string)=>string};
/** Inherited20-event worker bound. Storage owns leases, retry8 and120-minute cap.
 * At-least-once delivery uses the same immutable event ID and payload on every retry. */
export async function processTechnologyFiveWebhooks(deps:TechnologyWebhookDependencies,send:typeof sendTechnologyWebhook=sendTechnologyWebhook){
 const counts={processed:0,delivered:0,failed:0,unavailable:0};
 for(let i=0;i<20;i++){
  const leaseToken=randomUUID(),raw=await deps.claim(leaseToken);if(raw&&typeof raw==='object'&&'status' in raw){if(raw.status==='missing')break;if(raw.status==='cancelled'||raw.status==='dead_letter'){counts.processed++;counts.unavailable++;continue;}}
  const parsed=claimSchema.safeParse(raw);if(!parsed.success||parsed.data.leaseToken!==leaseToken)throw Error('Webhook lease outcome unavailable');const item=parsed.data,identity=automationIdentity(item.catalogId,item.version);let delivered=false,httpStatus:number|null=null,error:string|null=null;
  try{
   const payload=JSON.parse(item.payloadText);if(!identity||payload.id!==item.eventId||payload.type!=='calculation.completed'||payload.data?.id!==item.eventId||payload.data?.catalog_id!==identity.catalogId||payload.data?.engine_id!==identity.engineId||payload.data?.technical_version!==identity.version||payload.data?.status!=='completed')throw Error('Immutable webhook identity differs');
   if(factoryDeliveryIdentity(item.catalogId,item.version))verifyFactoryAutomationRows(item.catalogId,item.version,payload.data.input_rows,payload.data.output_rows);
   await deps.assertAuthority(item);if(await deps.check(item.id,leaseToken)!==true)throw Error('Current dispatch authority unavailable');const secret=deps.decrypt(item.secretCiphertext);if(secret.length<16)throw Error('Webhook signing unavailable');
   httpStatus=await send(item.endpointUrl,item.payloadText,{...webhookHeaders(secret,item.payloadText),'x-calcumint-event-id':item.eventId,'x-calcumint-delivery-id':item.id},async()=>{if(await deps.check(item.id,leaseToken)!==true)throw Error('Current dispatch authority unavailable');});
   delivered=httpStatus>=200&&httpStatus<300;if(!delivered)error='Webhook response was not successful (HTTP '+httpStatus+')';
  }catch(cause){error=cause instanceof Error?cause.message.slice(0,500):'Webhook dispatch unavailable';}
  if(await deps.finish({id:item.id,leaseToken,delivered,httpStatus,error})!==true)throw Error('Webhook delivery outcome unconfirmed');counts.processed++;if(delivered)counts.delivered++;else counts.failed++;
 }
 return counts;
}
