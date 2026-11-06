import 'server-only';import {createSupabaseAdminClient} from '@/lib/supabase/admin';import {verifyApiRequest,ApiAuthError} from '@/lib/api/auth';import {NativeDeliveryError} from './contract';
/** Current owner plan and issuer membership, never user-editable JWT metadata. */
export async function requireNativeIssuer(organizationId:string,issuerId:string){
 const admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'Business service unavailable');
 const [org,member]=await Promise.all([admin.from('organizations').select('id,name,owner_user_id').eq('id',organizationId).maybeSingle(),admin.from('organization_members').select('role').eq('organization_id',organizationId).eq('user_id',issuerId).maybeSingle()]);
 if(org.error||member.error)throw new NativeDeliveryError(503,'Business authority unavailable');if(!org.data||!member.data||!['owner','admin'].includes(member.data.role)||(member.data.role==='owner'&&org.data.owner_user_id!==issuerId))throw new NativeDeliveryError(403,'Organization Owner or Admin required');
 const owner=await admin.from('profiles').select('plan').eq('id',org.data.owner_user_id).maybeSingle();if(owner.error)throw new NativeDeliveryError(503,'Business entitlement unavailable');const issuer=issuerId===org.data.owner_user_id?owner:await admin.from('profiles').select('plan').eq('id',issuerId).maybeSingle();if(issuer.error)throw new NativeDeliveryError(503,'Business entitlement unavailable');if(owner.data?.plan!=='business'||issuer.data?.plan!=='business')throw new NativeDeliveryError(403,'Active Business organization required');return org.data;
}
export async function requireNativeApi(request:Request){
 const principal=await verifyApiRequest(request,'calculations:run'),admin=createSupabaseAdminClient();if(!admin)throw new NativeDeliveryError(503,'API unavailable');
 const key=await admin.from('business_api_keys').select('created_by,organization_id,status').eq('id',principal.keyId).eq('key_hash',principal.keyHash).eq('status','active').maybeSingle();if(key.error)throw new NativeDeliveryError(503,'API authority unavailable');if(!key.data||key.data.organization_id!==principal.organizationId)throw new ApiAuthError(401,'API key rejected');
 await requireNativeIssuer(principal.organizationId,key.data.created_by);
 const quota=await admin.rpc('consume_native_business_api_quota_v1',{p_api_key_id:principal.keyId});if(quota.error||typeof quota.data!=='boolean')throw new NativeDeliveryError(503,'Usage metering unavailable');if(!quota.data)throw new NativeDeliveryError(429,'API quota exceeded');return principal;
}
export function requireSameOrigin(request:Request){const site=process.env.NEXT_PUBLIC_SITE_URL;if(!site)throw new NativeDeliveryError(503,'Public origin unavailable');if(request.headers.get('origin')!==new URL(site).origin)throw new NativeDeliveryError(403,'Same-origin request required');}
