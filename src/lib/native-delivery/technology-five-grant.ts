import {technologyNativeTupleShape,isTechnologyNativeTuple} from './technology-native-schema';
import {createHmac,timingSafeEqual} from 'node:crypto';import {z} from 'zod';import {NativeDeliveryError} from './contract';import {technologyFiveIdentity} from './technology-five-catalog';
import {nativeOriginSchema} from './grant';

const claims=z.object({purpose:z.literal('calcumint-technology-five-embed-v1'),grantId:z.uuid(),apiKeyId:z.uuid(),organizationId:z.uuid(),issuerId:z.uuid(),...technologyNativeTupleShape,allowedOrigin:nativeOriginSchema,issuedAt:z.number().int().nonnegative(),expiresAt:z.number().int().positive()}).strict().refine(isTechnologyNativeTuple,'Unsupported exact Technology tuple');
export type TechnologyFiveEmbedGrant=z.infer<typeof claims>;
function signature(body:string,secret:string){if(secret.length<32)throw new NativeDeliveryError(503,'Embed service unavailable');return createHmac('sha256',secret).update(body).digest();}
export function issueTechnologyFiveGrant(input:Omit<TechnologyFiveEmbedGrant,'purpose'|'issuedAt'|'expiresAt'|'catalogId'|'version'>&{catalogId:number;version:number},secret:string,now=Math.floor(Date.now()/1000)){if(!technologyFiveIdentity(input.catalogId,input.version))throw new NativeDeliveryError(422,'Unsupported exact Technology identity/version');const data=claims.parse({...input,purpose:'calcumint-technology-five-embed-v1',issuedAt:now,expiresAt:now+3600});const body=Buffer.from(JSON.stringify(data)).toString('base64url');return body+'.'+signature(body,secret).toString('base64url');}
export function readTechnologyFiveGrant(token:string,secret:string,now=Math.floor(Date.now()/1000)):TechnologyFiveEmbedGrant{
 if(token.length>2048||!token.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/))throw new NativeDeliveryError(403,'Embed grant rejected');
 const [body,mac]=token.split('.'),expected=signature(body,secret),actual=Buffer.from(mac,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new NativeDeliveryError(403,'Embed grant rejected');
 let data:TechnologyFiveEmbedGrant;try{data=claims.parse(JSON.parse(Buffer.from(body,'base64url').toString('utf8')));}catch{throw new NativeDeliveryError(403,'Embed grant rejected');}
 if(data.issuedAt>now+30||data.expiresAt<=now||data.expiresAt-data.issuedAt>3600||data.expiresAt<=data.issuedAt)throw new NativeDeliveryError(403,'Embed grant expired or invalid');return data;
}
