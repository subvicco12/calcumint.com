import 'server-only';
import {createSupabaseAdminClient} from '@/lib/supabase/admin';
import {NativeDeliveryError} from './contract';
import type {TechnologyFiveEmbedGrant} from './technology-five-grant';
import {nativeDigest,embedDebitStatus,requireNativeEmbedKey} from './metering';
import {technologyFiveIdentity} from './technology-five-catalog';
export async function persistTechnologyFiveGrant(claims:TechnologyFiveEmbedGrant,token:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed audit unavailable');
 const r=await admin.from('technology_five_embed_grants').insert({id:claims.grantId,organization_id:claims.organizationId,issuer_id:claims.issuerId,api_key_id:claims.apiKeyId,token_hash:nativeDigest(token),allowed_origin:claims.allowedOrigin,catalog_id:claims.catalogId,engine_id:technologyFiveIdentity(claims.catalogId,claims.version)!.engineId,technical_version:claims.version,issued_at:new Date(claims.issuedAt*1000).toISOString(),expires_at:new Date(claims.expiresAt*1000).toISOString()});
 if(r.error)throw new NativeDeliveryError(503,'Embed audit unavailable');
}
export async function requirePersistedTechnologyFiveGrant(claims:TechnologyFiveEmbedGrant,token:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed audit unavailable');
 const r=await admin.from('technology_five_embed_grants').select('id').eq('id',claims.grantId).eq('organization_id',claims.organizationId).eq('issuer_id',claims.issuerId).eq('api_key_id',claims.apiKeyId).eq('token_hash',nativeDigest(token)).eq('allowed_origin',claims.allowedOrigin).eq('catalog_id',claims.catalogId).eq('engine_id',technologyFiveIdentity(claims.catalogId,claims.version)!.engineId).eq('technical_version',claims.version).is('revoked_at',null).gt('expires_at',new Date().toISOString()).maybeSingle();
 if(r.error)throw new NativeDeliveryError(503,'Embed audit unavailable');if(!r.data)throw new NativeDeliveryError(403,'Embed grant revoked or unavailable');
 await requireNativeEmbedKey(claims.organizationId,claims.issuerId,claims.apiKeyId);
}
export async function debitTechnologyFiveEmbed(claims:TechnologyFiveEmbedGrant,requestId:string,input:unknown,result:unknown){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Embed metering unavailable');
 const r=await admin.rpc('consume_technology_five_embed_v1',{p_grant_id:claims.grantId,p_request_id:requestId,p_request_hash:nativeDigest(JSON.stringify(input)),p_result_hash:nativeDigest(JSON.stringify(result))});
 if(r.error)throw new NativeDeliveryError(503,'Embed metering unavailable');return embedDebitStatus(r.data);
}
