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
