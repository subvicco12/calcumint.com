import {beforeEach,afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({jar:new Map<string,string>(),writeError:false,writeCalls:0,failAt:0,large:false,signupPending:false,requests:0,refreshRequests:0,rejectRefresh:false,userId:'00000000-0000-4000-8000-000000000001'}));
vi.mock('@/lib/env',()=>({publicEnv:{NEXT_PUBLIC_SITE_URL:'https://app.example.invalid',NEXT_PUBLIC_SUPABASE_URL:'https://synthetic.invalid',NEXT_PUBLIC_SUPABASE_ANON_KEY:'synthetic-anon'}}));
vi.mock('next/headers',()=>({cookies:async()=>{const jar=state.jar;return {getAll:()=>Array.from(jar,([name,value])=>({name,value})),set:(name:string,value:string)=>{state.writeCalls++;if(state.writeError||state.failAt===state.writeCalls)throw new Error('Synthetic cookie write failure');if(value)jar.set(name,value);else jar.delete(name);}};}}));
vi.mock('next/navigation',()=>({redirect:(url:string)=>{throw Error(`REDIRECT:${url}`);}}));
import {signIn,signOut,signInWithGoogle,signUp} from '@/app/login/actions';
import {GET} from '@/app/auth/callback/route';
import {createSupabaseServerClient} from './server';
const form=()=>{const f=new FormData();f.set('email','synthetic@example.invalid');f.set('password','synthetic-password');return f;};
const failure='REDIRECT:/login?error=Authentication%20is%20temporarily%20unavailable.%20Try%20again.';
beforeEach(()=>{
 Object.assign(state,{jar:new Map(),writeError:false,writeCalls:0,failAt:0,large:false,signupPending:false,requests:0,refreshRequests:0,rejectRefresh:false,userId:'00000000-0000-4000-8000-000000000001'});
 vi.spyOn(console,'error').mockImplementation(()=>{});
 vi.stubGlobal('fetch',vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{
  const url=String(input);expect(new URL(url).origin).toBe('https://synthetic.invalid');state.requests++;
  if(state.rejectRefresh&&url.includes('grant_type=refresh_token')){state.refreshRequests++;return new Response(JSON.stringify({code:'refresh_token_not_found',message:'Synthetic expired session'}),{status:400,headers:{'Content-Type':'application/json'}});}
  if(url.includes('/logout'))return new Response(null,{status:204});
  const header=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const payload=Buffer.from(JSON.stringify({sub:state.userId,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
  const user={id:state.userId,aud:'authenticated',email:'synthetic@example.invalid',app_metadata:{},user_metadata:{note:state.large?'x'.repeat(8000):'synthetic'},created_at:'2026-10-17T00:00:00Z'};
  if(url.endsWith('/user')){const token=new Headers(init?.headers).get('authorization')?.split(' ')[1];const sub=JSON.parse(Buffer.from(token!.split('.')[1],'base64url').toString()).sub;return new Response(JSON.stringify({...user,id:sub}),{status:200,headers:{'Content-Type':'application/json'}});}
  return new Response(JSON.stringify(state.signupPending?{user}:{access_token:`${header}.${payload}.synthetic`,refresh_token:'synthetic-refresh',expires_in:3600,token_type:'bearer',user}),{status:200,headers:{'Content-Type':'application/json'}});
 }));
});
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
it('does not redirect to account when the real SSR SDK cannot persist sign-in cookies',async()=>{
 state.writeError=true;await expect(signIn(form())).rejects.toThrow(failure);expect(state.jar.size).toBe(0);
});
it('does not start OAuth navigation when its PKCE cookie cannot be persisted',async()=>{
 state.writeError=true;await expect(signInWithGoogle()).rejects.toThrow(failure);expect(state.requests).toBe(0);
});
it('reports a callback failure when a successful synthetic exchange cannot persist cookies',async()=>{
 state.jar.set('sb-synthetic-auth-token-code-verifier',JSON.stringify('synthetic-verifier'));state.writeError=true;
 const response=await GET(new Request('https://app.example.invalid/auth/callback?code=synthetic-code'));
 expect(response.headers.get('location')).toBe('https://app.example.invalid/login?error=Authentication%20callback%20failed.');
});
it('does not report successful logout when local cookie deletion fails',async()=>{
 await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');expect(state.jar.size).toBeGreaterThan(0);
 state.writeError=true;await expect(signOut()).rejects.toThrow(failure);
});
it('fails the auth success path on a partial chunk write',async()=>{
 state.large=true;state.failAt=2;await expect(signIn(form())).rejects.toThrow(failure);
 expect(state.writeCalls).toBe(2);expect(state.jar.size).toBe(1);
});
it('can retry sign-in after cookie persistence becomes available',async()=>{
 state.writeError=true;await expect(signIn(form())).rejects.toThrow(failure);
 state.writeError=false;await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');expect(state.jar.size).toBeGreaterThan(0);
});
it('keeps valid sign-in/logout cookie persistence and provider operations intact',async()=>{
 await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');expect(state.jar.size).toBeGreaterThan(0);
 await expect(signOut()).rejects.toThrow('REDIRECT:/');expect(state.jar.size).toBe(0);
});
it('preserves confirmation-pending signup with writable PKCE cookies and no session',async()=>{
 state.signupPending=true;await expect(signUp(form())).rejects.toThrow('REDIRECT:/login?message=');expect(state.writeCalls).toBeGreaterThan(0);
});
it('does not claim confirmation setup succeeded if signup PKCE cookies cannot persist',async()=>{
 state.signupPending=true;state.writeError=true;await expect(signUp(form())).rejects.toThrow(failure);
});
it('keeps Server Component cookie refresh best-effort by default',async()=>{
 state.writeError=true;const client=await createSupabaseServerClient();
 const result=await client!.auth.signInWithPassword({email:'synthetic@example.invalid',password:'synthetic-password'});
 expect(result.error).toBeNull();expect(state.jar.size).toBe(0);
});

it('does not authenticate an expired session when refresh is rejected and read-only cookies cannot clear',async()=>{
 await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');
 for(const [name,value] of state.jar){
  if(!name.endsWith('auth-token'))continue;
  const session=JSON.parse(Buffer.from(value.slice('base64-'.length),'base64url').toString());session.expires_at=1;const token=session.access_token.split('.');const claims=JSON.parse(Buffer.from(token[1],'base64url').toString());claims.exp=1;token[1]=Buffer.from(JSON.stringify(claims)).toString('base64url');session.access_token=token.join('.');
  state.jar.set(name,'base64-'+Buffer.from(JSON.stringify(session)).toString('base64url'));
 }
 state.rejectRefresh=true;state.writeError=true;
 const client=await createSupabaseServerClient();const response=await client!.auth.getUser();
 expect(response.data.user).toBeNull();expect(response.error).toBeTruthy();expect(state.refreshRequests).toBeGreaterThan(0);
});
it('isolates current identity across separate cookie stores and interleaved account requests',async()=>{
 await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');const clientA=await createSupabaseServerClient();
 state.jar=new Map();state.userId='00000000-0000-4000-8000-000000000002';
 await expect(signIn(form())).rejects.toThrow('REDIRECT:/account');const clientB=await createSupabaseServerClient();
 const [a,b]=await Promise.all([clientA!.auth.getUser(),clientB!.auth.getUser()]);
 expect(a.data.user?.id).toBe('00000000-0000-4000-8000-000000000001');expect(b.data.user?.id).toBe(state.userId);
});
