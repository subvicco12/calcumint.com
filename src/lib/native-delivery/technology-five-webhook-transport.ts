import {lookup} from 'node:dns/promises';import {isIP} from 'node:net';import {request as httpsRequest} from 'node:https';
export type WebhookAddress={address:string;family:number};
export function isPublicWebhookAddress(address:string):boolean{
 if(address.includes('%'))return false;
 if(isIP(address)===4){const [a,b,c]=address.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||(b===88&&c===99)))||(a===198&&(b===18||b===19||(b===51&&c===100)))||(a===203&&b===0&&c===113));}
 if(isIP(address)!==6)return false;
 const value=new URL('http://['+address+']/').hostname.slice(1,-1).toLowerCase();return /^[23]/.test(value)&&!/^2001:(?:db8:|0:|:|2:|1[0-9a-f]:|2[0-9a-f]:)/.test(value)&&!value.startsWith('2002:')&&!value.startsWith('3fff:');
}
export async function validateTechnologyWebhookTarget(raw:string,resolver:(host:string)=>Promise<WebhookAddress[]>=host=>lookup(host,{all:true,verbatim:true})){
 const url=new URL(raw),host=url.hostname;
 if(url.protocol!=='https:'||url.username||url.password||url.hash||url.port||isIP(host)||host.includes(':')||host==='localhost'||host.endsWith('.localhost'))throw Error('Webhook requires a public DNS HTTPS destination on the default port without credentials or fragment');
 const addresses=await resolver(host);if(!addresses.length||addresses.some(item=>!isPublicWebhookAddress(item.address)||isIP(item.address)!==item.family))throw Error('Webhook destination has a non-public or invalid DNS answer');
 return {url,address:addresses[0].address,family:addresses[0].family};
}
/** Validate every dispatch, pin its DNS address for the TLS socket, never follow redirects.
 * The10-second bound is inherited from the existing webhook worker. */
export async function sendTechnologyWebhook(url:string,body:string,headers:Record<string,string>,beforeSend:()=>Promise<void>):Promise<number>{
 let expired=false;let timer:ReturnType<typeof setTimeout>|undefined,abort:(()=>void)|undefined;
 try{return await Promise.race([new Promise<never>((_,reject)=>{timer=setTimeout(()=>{expired=true;abort?.();reject(Error('Webhook dispatch timed out'));},10000);}), (async()=>{
  const target=await validateTechnologyWebhookTarget(url);if(expired)throw Error('Webhook dispatch timed out');await beforeSend();if(expired)throw Error('Webhook dispatch timed out');
  return await new Promise<number>((resolve,reject)=>{const request=httpsRequest(target.url,{method:'POST',headers:{...headers,'content-length':String(Buffer.byteLength(body))},family:target.family,lookup:(_host,_options,callback)=>callback(null,target.address,target.family),rejectUnauthorized:true},response=>{const status=response.statusCode??0;response.destroy();resolve(status);});abort=()=>request.destroy(Error('Webhook dispatch timed out'));request.on('error',reject);request.end(body);});
 })()]);}finally{if(timer)clearTimeout(timer);}
}
