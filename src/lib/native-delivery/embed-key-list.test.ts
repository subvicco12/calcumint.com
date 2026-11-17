import {beforeEach,expect,it,vi} from 'vitest';
import {createClient} from '@supabase/supabase-js';
vi.mock('server-only',()=>({}));
const state=vi.hoisted(()=>({client:null as unknown,issuer:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>state.client}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>state.client}));
vi.mock('./authorization',()=>({requireNativeIssuer:state.issuer,requireSameOrigin:vi.fn()}));
import {GET as nativeGet} from '@/app/api/business/native-embeds/route';
import {GET as technologyGet} from '@/app/api/business/technology-embeds/route';
const targets=[{label:'native',GET:nativeGet},{label:'technology',GET:technologyGet}];
import {NativeDeliveryError} from './contract';
const org='00000000-0000-4000-8000-000000000001',owner='00000000-0000-4000-8000-000000000002';
beforeEach(()=>{state.client=null;state.issuer.mockReset();});
it.each(targets)('$label uses JSONB containment through the real SDK, retaining issuer, active-key and organization filters',async({label,GET})=>{
 const requests:URL[]=[];
 const client=createClient('https://fixture.invalid','fixture-anon',{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:async input=>{
  const url=new URL(String(input));requests.push(url);
  if(url.pathname.endsWith('/technology_five_embed_grants'))return new Response('[]',{status:200});
  let scope:unknown;try{scope=JSON.parse((url.searchParams.get('scopes')??'').slice(3));}catch{return new Response(JSON.stringify({code:'22P02',message:'invalid input syntax for type json'}),{status:400});}
  if(!Array.isArray(scope)||scope.length!==1||scope[0]!=='calculations:run')throw Error('Exact required JSONB scope missing');
  return new Response(JSON.stringify([{id:'key-id',name:'Scoped key',rate_limit_per_minute:60,monthly_quota:10000}]),{status:200});
 }}});
 state.client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from:client.from.bind(client)};
 const response=await GET(new Request('https://fixture.invalid/api/business/native-embeds?organizationId='+org));
 expect(response.status).toBe(200);expect((await response.json()).keys).toHaveLength(1);
 expect(state.issuer).toHaveBeenCalledExactlyOnceWith(org,owner);expect(requests).toHaveLength(label==='native'?1:2);
 expect(requests[0].searchParams.get('organization_id')).toBe('eq.'+org);
 expect(requests[0].searchParams.get('created_by')).toBe('eq.'+owner);
 expect(requests[0].searchParams.get('status')).toBe('eq.active');
 expect(response.headers.get('cache-control')).toBe('no-store');
});
it.each(targets)('$label never reads keys for an unauthenticated or unauthorized caller',async({GET})=>{
 const from=vi.fn();state.client={auth:{getUser:async()=>({data:{user:null},error:null})},from};
 expect((await GET(new Request('https://fixture.invalid/?organizationId='+org))).status).toBe(401);
 expect(from).not.toHaveBeenCalled();expect(state.issuer).not.toHaveBeenCalled();
 state.client={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from};
 state.issuer.mockRejectedValue(new NativeDeliveryError(403,'Organization Owner or Admin required'));
 expect((await GET(new Request('https://fixture.invalid/?organizationId='+org))).status).toBe(403);
 expect(from).not.toHaveBeenCalled();
});
