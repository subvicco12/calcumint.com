import 'server-only';
import {createHash} from 'node:crypto';
import {createSupabaseAdminClient} from '@/lib/supabase/admin';
import {NativeDeliveryError} from './contract';
import type {NativeEmbedGrant} from './grant';
export const nativeDigest=(value:string)=>createHash('sha256').update(value).digest('hex');
export function embedDebitStatus(value:unknown){
 if(value==='accepted')return false;if(value==='replayed')return true;
 if(value==='limited')throw new NativeDeliveryError(429,'Shared API key quota exceeded');
 if(value==='conflict')throw new NativeDeliveryError(409,'Request ID was used with different calculation data');
 if(value==='denied'||value==='invalid')throw new NativeDeliveryError(403,'Embed grant revoked or unavailable');
 throw new NativeDeliveryError(503,'Embed metering unavailable');
}
export async function requireNativeEmbedKey(organizationId:string,issuerId:string,apiKeyId:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed authority unavailable');
 const key=await admin.from('business_api_keys').select('id,scopes').eq('id',apiKeyId).eq('organization_id',organizationId).eq('created_by',issuerId).eq('status','active').maybeSingle();
 if(key.error)throw new NativeDeliveryError(503,'Embed authority unavailable');if(!key.data||!key.data.scopes.includes('calculations:run'))throw new NativeDeliveryError(403,'Select your active organization key with calculations:run scope');
}
export async function persistNativeGrant(claims:NativeEmbedGrant,token:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed audit unavailable');
 const r=await admin.from('native_embed_grants').insert({id:claims.grantId,organization_id:claims.organizationId,issuer_id:claims.issuerId,api_key_id:claims.apiKeyId,token_hash:nativeDigest(token),allowed_origin:claims.allowedOrigin,catalog_id:claims.catalogId,engine_id:'conversion.frequency',technical_version:claims.version,issued_at:new Date(claims.issuedAt*1000).toISOString(),expires_at:new Date(claims.expiresAt*1000).toISOString()});
 if(r.error)throw new NativeDeliveryError(503,'Embed audit unavailable');
}
export async function requirePersistedNativeGrant(claims:NativeEmbedGrant,token:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed audit unavailable');
 const r=await admin.from('native_embed_grants').select('id').eq('id',claims.grantId).eq('organization_id',claims.organizationId).eq('issuer_id',claims.issuerId).eq('api_key_id',claims.apiKeyId).eq('token_hash',nativeDigest(token)).eq('allowed_origin',claims.allowedOrigin).eq('catalog_id',440).eq('technical_version',1).is('revoked_at',null).gt('expires_at',new Date().toISOString()).maybeSingle();
 if(r.error)throw new NativeDeliveryError(503,'Embed audit unavailable');if(!r.data)throw new NativeDeliveryError(403,'Embed grant revoked or unavailable');
 await requireNativeEmbedKey(claims.organizationId,claims.issuerId,claims.apiKeyId);
}
export async function debitNativeEmbed(claims:NativeEmbedGrant,requestId:string,input:unknown,result:unknown){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed metering unavailable');
 const r=await admin.rpc('consume_native_embed_v1',{p_grant_id:claims.grantId,p_request_id:requestId,p_request_hash:nativeDigest(JSON.stringify(input)),p_result_hash:nativeDigest(JSON.stringify(result))});
 if(r.error)throw new NativeDeliveryError(503,'Embed metering unavailable');return embedDebitStatus(r.data);
}
