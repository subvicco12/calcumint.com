import {factoryDeliveryIdentity} from './factory-delivery-catalog';
import {createHmac,timingSafeEqual} from 'node:crypto';import {z} from 'zod';import {NativeDeliveryError} from './contract';
export const nativeOriginSchema=z.string().url().max(512).refine(value=>{try{const u=new URL(value);return u.origin===value&&!u.username&&!u.password&&(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)));}catch{return false;}},'Use an exact HTTPS origin, or loopback HTTP for local testing');
const claims=z.object({purpose:z.literal('calcumint-native-embed-v1'),grantId:z.uuid(),apiKeyId:z.uuid(),organizationId:z.uuid(),issuerId:z.uuid(),catalogId:z.number().int().refine(id=>!!factoryDeliveryIdentity(id,1)),version:z.literal(1),allowedOrigin:nativeOriginSchema,issuedAt:z.number().int().nonnegative(),expiresAt:z.number().int().positive()}).strict();
export type NativeEmbedGrant=z.infer<typeof claims>;
function signature(body:string,secret:string){if(secret.length<32)throw new NativeDeliveryError(503,'Embed service unavailable');return createHmac('sha256',secret).update(body).digest();}
export function issueNativeGrant(input:Omit<NativeEmbedGrant,'purpose'|'issuedAt'|'expiresAt'>,secret:string,now=Math.floor(Date.now()/1000)){const data=claims.parse({...input,purpose:'calcumint-native-embed-v1',issuedAt:now,expiresAt:now+3600});const body=Buffer.from(JSON.stringify(data)).toString('base64url');return body+'.'+signature(body,secret).toString('base64url');}
export function readNativeGrant(token:string,secret:string,now=Math.floor(Date.now()/1000)):NativeEmbedGrant{
 if(token.length>2048||!token.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/))throw new NativeDeliveryError(403,'Embed grant rejected');
 const [body,mac]=token.split('.'),expected=signature(body,secret),actual=Buffer.from(mac,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new NativeDeliveryError(403,'Embed grant rejected');
 let data:NativeEmbedGrant;try{data=claims.parse(JSON.parse(Buffer.from(body,'base64url').toString('utf8')));}catch{throw new NativeDeliveryError(403,'Embed grant rejected');}
 if(data.issuedAt>now+30||data.expiresAt<=now||data.expiresAt-data.issuedAt>3600||data.expiresAt<=data.issuedAt)throw new NativeDeliveryError(403,'Embed grant expired or invalid');return data;
}
