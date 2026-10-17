// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {createSessionBoundFetch} from './session-bound-fetch';
const origin='https://synthetic.invalid';const endpoint=origin+'/auth/v1/user';const key='sb-synthetic-auth-token';
function cookie(value:string){document.cookie=key+'='+value+'; Path=/';}
afterEach(()=>{for(const entry of document.cookie.split(';'))document.cookie=entry.split('=')[0].trim()+'=; Max-Age=0; Path=/';});
it.each([200,401])('discards a delayed %i response after another tab changes session cookies',async status=>{
 cookie('old');let finish!:(response:Response)=>void;const fetcher=vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;}));
 const bound=createSessionBoundFetch(origin,fetcher);const response=bound(endpoint);cookie('new');finish(new Response('{}',{status}));
 await expect(response).rejects.toMatchObject({name:'AbortError',message:'Authentication session changed. Retry.'});expect(fetcher).toHaveBeenCalledTimes(1);
});
it('checks again when the body arrives after response headers',async()=>{
 cookie('old');let finish!:()=>void;
 const body=new ReadableStream({start(controller){finish=()=>{controller.enqueue(new TextEncoder().encode('{"code":"session_not_found"}'));controller.close();};}});
 const response=new Response(body,{status:401});const reading=vi.spyOn(response,'arrayBuffer');
 const bound=createSessionBoundFetch(origin,vi.fn(async()=>response));const request=bound(endpoint);
 await vi.waitFor(()=>expect(reading).toHaveBeenCalledOnce());cookie('new');finish();await expect(request).rejects.toMatchObject({name:'AbortError'});
});
it('preserves an authoritative current-session error and headers without inventing a success',async()=>{
 cookie('unchanged');const headers={'Content-Type':'application/json','X-Supabase-Api-Version':'2024-01-01'};
 const body=JSON.stringify({code:'session_not_found',message:'Synthetic revoked session'});
 const bound=createSessionBoundFetch(origin,vi.fn(async()=>new Response(body,{status:401,headers})));
 const response=await bound(endpoint);expect(response.status).toBe(401);expect(response.headers.get('x-supabase-api-version')).toBe('2024-01-01');expect(await response.text()).toBe(body);
});
it.each([
 [origin+'/rest/v1/profiles','GET'],[origin+'/auth/v1/logout','POST'],[origin+'/auth/v1/user','PUT'],['https://other.invalid/auth/v1/user','GET']
])('leaves unrelated request %s %s unchanged',async(url,method)=>{
 cookie('old');const original=new Response('unchanged');const fetcher=vi.fn(async()=>{cookie('new');return original;});
 const init={method,headers:{authorization:'Bearer synthetic'},signal:new AbortController().signal};const bound=createSessionBoundFetch(origin,fetcher);
 expect(await bound(url,init)).toBe(original);expect(fetcher).toHaveBeenCalledWith(url,init);
});
it('ignores PKCE, preferences and other project cookies while a valid identity read is pending',async()=>{
 cookie('stable');let finish!:(response:Response)=>void;const bound=createSessionBoundFetch(origin,vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;})));
 const request=bound(endpoint);document.cookie=key+'-code-verifier=updated; Path=/';document.cookie='preferences=updated; Path=/';document.cookie='sb-other-auth-token=updated; Path=/';finish(new Response('{"id":"synthetic"}'));
 expect(await (await request).json()).toEqual({id:'synthetic'});
});
it('binds Request inputs and detects replacement of a canonical session chunk',async()=>{
 document.cookie=key+'.0=old; Path=/';let finish!:(response:Response)=>void;const bound=createSessionBoundFetch(origin,vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;})));
 const request=bound(new Request(endpoint));document.cookie=key+'.0=new; Path=/';finish(new Response('{}'));await expect(request).rejects.toMatchObject({name:'AbortError'});
});
it('preserves interruption and caller cancellation rather than manufacturing an auth result',async()=>{
 const interrupted=new DOMException('Synthetic interruption','AbortError');const fetcher=vi.fn(async()=>{throw interrupted;});const bound=createSessionBoundFetch(origin,fetcher);
 const signal=new AbortController().signal;await expect(bound(endpoint,{signal})).rejects.toBe(interrupted);expect(fetcher).toHaveBeenCalledWith(endpoint,{signal});
});

async function storedSession(token:string,format:'raw'|'base64'|'chunked'='base64'){
 const {createChunks,stringToBase64URL,serializeCookieHeader}=await import('@supabase/ssr');
 const json=JSON.stringify({access_token:token,refresh_token:'synthetic',expires_at:9999999999,note:format==='chunked'?'x'.repeat(8000):''});
 const value=format==='raw'?json:'base64-'+stringToBase64URL(json);
 for(const chunk of createChunks(key,value))document.cookie=serializeCookieHeader(chunk.name,chunk.value,{path:'/'});
}
it.each(['raw','base64','chunked'] as const)('forwards matching opaque token in %s SDK session storage',async format=>{
 await storedSession('current-token',format);const init={headers:{Authorization:'Bearer current-token'}};const fetcher=vi.fn(async()=>new Response('{"id":"synthetic"}'));
 expect(await (await createSessionBoundFetch(origin,fetcher)(endpoint,init)).json()).toEqual({id:'synthetic'});expect(fetcher).toHaveBeenCalledWith(endpoint,init);
});
it('rejects an already-selected old token before network dispatch without clearing replacement cookies',async()=>{
 await storedSession('new-token');const before=document.cookie;const fetcher=vi.fn(async()=>new Response('{}'));
 await expect(createSessionBoundFetch(origin,fetcher)(endpoint,{headers:{authorization:'Bearer old-token'}})).rejects.toMatchObject({name:'AbortError'});
 expect(fetcher).not.toHaveBeenCalled();expect(document.cookie).toBe(before);
});
it.each(['absent','malformed','incomplete'])('fails closed before dispatch with %s session storage',async mode=>{
 if(mode==='malformed')cookie('base64-!!!!');if(mode==='incomplete')cookie(encodeURIComponent('{"user":{"id":"untrusted"}}'));
 const fetcher=vi.fn(async()=>new Response('{}'));
 await expect(createSessionBoundFetch(origin,fetcher)(endpoint,{headers:{authorization:'Bearer stale-token'}})).rejects.toMatchObject({name:'AbortError'});expect(fetcher).not.toHaveBeenCalled();
});
it('rechecks cookie state after asynchronous chunk decoding before dispatch',async()=>{
 await storedSession('old-token','chunked');const fetcher=vi.fn(async()=>new Response('{}'));
 const request=createSessionBoundFetch(origin,fetcher)(endpoint,{headers:{authorization:'Bearer old-token'}});cookie('replacement');
 await expect(request).rejects.toMatchObject({name:'AbortError'});expect(fetcher).not.toHaveBeenCalled();
});
it('uses Request authorization and honors init header overrides',async()=>{
 await storedSession('current-token');const request=new Request(endpoint,{headers:{authorization:'Bearer current-token'}});const fetcher=vi.fn(async()=>new Response('{}'));const bound=createSessionBoundFetch(origin,fetcher);
 expect((await bound(request)).status).toBe(200);
 await expect(bound(request,{headers:{authorization:'Bearer stale-token'}})).rejects.toMatchObject({name:'AbortError'});expect(fetcher).toHaveBeenCalledTimes(1);
});
it('preserves a current provider revocation response when bearer and storage agree',async()=>{
 await storedSession('current-token');const provider=new Response('{"code":"session_not_found"}',{status:401,headers:{'X-Supabase-Api-Version':'2024-01-01'}});
 const response=await createSessionBoundFetch(origin,vi.fn(async()=>provider))(endpoint,{headers:{authorization:'Bearer current-token'}});
 expect(response.status).toBe(401);expect(await response.json()).toEqual({code:'session_not_found'});
});
it('ignores new PKCE and unrelated cookies during preflight validation',async()=>{
 await storedSession('current-token');const fetcher=vi.fn(async()=>new Response('{}'));
 const request=createSessionBoundFetch(origin,fetcher)(endpoint,{headers:{authorization:'Bearer current-token'}});
 document.cookie=key+'-code-verifier=fresh; Path=/';document.cookie='preferences=fresh; Path=/';document.cookie='sb-other-auth-token=fresh; Path=/';
 expect((await request).status).toBe(200);expect(fetcher).toHaveBeenCalledOnce();expect(document.cookie).toContain('code-verifier=fresh');
});
