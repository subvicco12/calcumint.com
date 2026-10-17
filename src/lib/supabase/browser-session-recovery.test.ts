// @vitest-environment jsdom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
let client:SupabaseClient|null=null;
let currentId='00000000-0000-4000-8000-000000000001';
let large=false;
let rejectRefresh=false;
let interruptPassword=false;
let requests:string[]=[];
const key='sb-synthetic-auth-token';
function clearCookies(){for(const entry of document.cookie.split(';'))document.cookie=entry.split('=')[0].trim()+'=; Max-Age=0; Path=/';}
async function browserClient(){const {createSupabaseBrowserClient}=await import('./browser');client=createSupabaseBrowserClient();return client!;}
function claims(token:string){return JSON.parse(atob(token.split('.')[1].replaceAll('-','+').replaceAll('_','/')));}
beforeEach(()=>{
 vi.resetModules();clearCookies();currentId='00000000-0000-4000-8000-000000000001';large=false;rejectRefresh=false;interruptPassword=false;requests=[];
 vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://synthetic.invalid');vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','synthetic-anon');
 // Isolate tabs in jsdom; real cross-tab behavior is a separate browser check.
 vi.stubGlobal('BroadcastChannel',undefined);vi.spyOn(console,'error').mockImplementation(()=>{});vi.spyOn(console,'warn').mockImplementation(()=>{});
 vi.stubGlobal('fetch',vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{
  const url=String(input);expect(new URL(url).origin).toBe('https://synthetic.invalid');requests.push(url);
  if(interruptPassword&&url.includes('grant_type=password'))throw new TypeError('Synthetic interrupted connection');
  if(rejectRefresh&&url.includes('grant_type=refresh_token'))return new Response(JSON.stringify({code:'refresh_token_not_found',message:'Synthetic expired session'}),{status:400,headers:{'Content-Type':'application/json'}});
  if(url.includes('/logout'))return new Response(null,{status:204});
  const auth=new Headers(init?.headers).get('authorization');const id=url.endsWith('/user')?claims(auth!.split(' ')[1]).sub:currentId;
  const user={id,aud:'authenticated',email:'synthetic@example.invalid',app_metadata:{},user_metadata:{note:large?'x'.repeat(8000):'synthetic'},created_at:'2026-10-17T00:00:00Z'};
  const encoded=(value:unknown)=>btoa(JSON.stringify(value)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
  return new Response(JSON.stringify(url.endsWith('/user')?user:{access_token:encoded({alg:'HS256',typ:'JWT'})+'.'+encoded({sub:id,exp:Math.floor(Date.now()/1000)+3600})+'.synthetic',refresh_token:'synthetic-refresh',expires_in:3600,token_type:'bearer',user}),{status:200,headers:{'Content-Type':'application/json'}});
 }));
});
afterEach(async()=>{if(client)await client.auth.stopAutoRefresh();client=null;clearCookies();vi.restoreAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();});
it.each(['base64-!!!!','base64-_w'])('fails closed and permits explicit recovery from unreadable browser cookie %s',async(value)=>{
 document.cookie=key+'='+value+'; Path=/';document.cookie=key+'-code-verifier=preserved; Path=/';document.cookie='preferences=preserved; Path=/';
 const sdk=await browserClient();const result=await sdk.auth.getUser();expect(result.data.user).toBeNull();expect(requests).toHaveLength(0);
 const signedIn=await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});expect(signedIn.error).toBeNull();
 expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);expect(document.cookie).toContain('preferences=preserved');expect(document.cookie).toContain('code-verifier=preserved');
});
it('recovers browser sign-in from incomplete JSON session without stale initialization clearing it',async()=>{
 document.cookie=key+'='+encodeURIComponent(JSON.stringify({user:{id:'untrusted'}}))+'; Path=/';
 const sdk=await browserClient();const result=await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});expect(result.error).toBeNull();
 expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});

it('keeps the browser singleton across consumers',async()=>{
 const sdk=await browserClient();expect(await browserClient()).toBe(sdk);
});
it('round-trips large chunked sessions and removes all session chunks on logout',async()=>{
 large=true;const sdk=await browserClient();expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();
 expect(document.cookie.split(';').filter(c=>c.trim().startsWith(key+'.')).length).toBeGreaterThan(3);
 expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
 expect((await sdk.auth.signOut()).error).toBeNull();expect(document.cookie).not.toContain(key);
 expect((await sdk.auth.getUser()).data.user).toBeNull();
});
it.each(['first','middle','last'])('fails closed on a missing %s chunk and permits fresh sign-in',async(part)=>{
 large=true;const sdk=await browserClient();await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});
 const names=document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(n=>n.startsWith(key+'.'));
 const missing=part==='first'?names[0]:part==='middle'?names[1]:names.at(-1)!;document.cookie=missing+'=; Max-Age=0; Path=/';
 expect((await sdk.auth.getUser()).data.user).toBeNull();large=false;
 expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();
 expect(document.cookie).not.toContain(key+'.');expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});
it('preserves unrelated project cookies during malformed-session recovery and logout',async()=>{
 document.cookie=key+'=base64-!!!!; Path=/';document.cookie='sb-other-auth-token=other; Path=/';document.cookie='preferences=preserved; Path=/';
 const sdk=await browserClient();expect((await sdk.auth.getUser()).data.user).toBeNull();
 expect((await sdk.auth.signOut()).error).toBeNull();expect(document.cookie).toContain('sb-other-auth-token=other');expect(document.cookie).toContain('preferences=preserved');
});
it('recovers after an interrupted password request without authenticating or deleting a PKCE verifier',async()=>{
 const sdk=await browserClient();await sdk.auth.getUser();document.cookie=key+'-code-verifier=preserved; Path=/';interruptPassword=true;
 const failed=await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});expect(failed.error).toBeTruthy();expect(failed.data.session).toBeNull();
 expect((await sdk.auth.getUser()).data.user).toBeNull();expect(document.cookie).toContain('code-verifier=preserved');
 interruptPassword=false;expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();
 expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});
it('does not reuse the previous owner after logout and explicit account switching',async()=>{
 const sdk=await browserClient();await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});
 expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);expect((await sdk.auth.signOut()).error).toBeNull();
 expect((await sdk.auth.getUser()).data.user).toBeNull();currentId='00000000-0000-4000-8000-000000000002';
 expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});
it('recovers after a partial browser cookie write throws',async()=>{
 const sdk=await browserClient();await sdk.auth.getUser();large=true;
 const descriptor=Object.getOwnPropertyDescriptor(Document.prototype,'cookie')!;let writes=0;
 const setter=vi.spyOn(document,'cookie','set').mockImplementation(value=>{writes++;if(writes===2)throw Error('Synthetic browser cookie failure');descriptor.set!.call(document,value);});
 await expect(sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).rejects.toThrow('Synthetic browser cookie failure');
 expect(writes).toBe(2);setter.mockRestore();expect((await sdk.auth.getUser()).data.user).toBeNull();large=false;
 expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();expect(document.cookie).not.toContain(key+'.');
});
it('rejects an expired session whose refresh token is rejected and permits retry',async()=>{
 const sdk=await browserClient();await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});
 const {parseCookieHeader,stringFromBase64URL,stringToBase64URL}=await import('@supabase/ssr');
 const encoded=parseCookieHeader(document.cookie).find(c=>c.name===key)!.value!;
 const session=JSON.parse(stringFromBase64URL(encoded.slice('base64-'.length)));session.expires_at=1;
 const parts=session.access_token.split('.');const payload=claims(session.access_token);payload.exp=1;parts[1]=stringToBase64URL(JSON.stringify(payload));session.access_token=parts.join('.');
 document.cookie=key+'=base64-'+stringToBase64URL(JSON.stringify(session))+'; Path=/';rejectRefresh=true;
 expect((await sdk.auth.getUser()).data.user).toBeNull();expect(requests.some(url=>url.includes('grant_type=refresh_token'))).toBe(true);
 rejectRefresh=false;expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});
it('fails closed on invalid bytes in a middle chunk without erasing a PKCE verifier',async()=>{
 large=true;const sdk=await browserClient();await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});
 document.cookie=key+'.1=!!!!; Path=/';document.cookie=key+'-code-verifier=preserved; Path=/';
 expect((await sdk.auth.getUser()).data.user).toBeNull();expect(document.cookie).toContain('code-verifier=preserved');
 large=false;expect((await sdk.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'})).error).toBeNull();
 expect(document.cookie).not.toContain(key+'.');expect((await sdk.auth.getUser()).data.user?.id).toBe(currentId);
});
