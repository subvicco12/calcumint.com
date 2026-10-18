import { createHmac } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { beforeAll, afterAll, beforeEach, expect, it, vi } from 'vitest';

const fixture=vi.hoisted(()=>({admin:null as SupabaseClient|null,providerUrl:''}));
vi.mock('@/lib/env',()=>({publicEnv:{NEXT_PUBLIC_PADDLE_ENV:'sandbox'},serverEnv:{PADDLE_WEBHOOK_SECRET:'synthetic-http-secret',PADDLE_PRO_MONTHLY_PRICE_ID:'pri_pro',PADDLE_BUSINESS_YEARLY_PRICE_ID:'pri_business'}}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>fixture.admin}));
vi.mock('@/lib/billing/paddle',async original=>({...await original<typeof import('../../src/lib/billing/paddle')>(),
  paddleRequest:async(path:string)=>{const response=await fetch(`${fixture.providerUrl}${path}`);if(!response.ok)throw new Error('Synthetic provider unavailable');return response.json();}
}));
import { POST } from '../../src/app/api/billing/webhook/route';
const exec=promisify(execFile);
const container=process.env.CALCUMINT_BILLING_TEST_CONTAINER;
const restUrl=process.env.CALCUMINT_BILLING_TEST_REST_URL;
if(!container||!/^calcumint-billing-test-[0-9a-f-]{36}$/.test(container)||!restUrl||!/^http:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)[0-9.]+:3000$/.test(restUrl))throw new Error('Local disposable PostgreSQL/PostgREST fixture required');
const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002';
function jwt(role:string,sub=a,key='synthetic-isolated-billing-jwt-secret-not-production') {
  const head=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const body=Buffer.from(JSON.stringify({role,sub,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
  return `${head}.${body}.${createHmac('sha256',key).update(`${head}.${body}`).digest('base64url')}`;
}
async function sql(query:string) {
  return (await exec('docker',['exec',container!,'psql','-h','127.0.0.1','-U','postgres','-qAt','-X','-v','ON_ERROR_STOP=1','-c',query],{timeout:10000})).stdout.trim();
}
function client(role='service_role',sub=a,transport:typeof fetch=fetch) {
  return createClient(supabaseUrl,jwt(role,sub),{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:transport}});
}
const snapshot=(status='active',owner=a)=>({id:'sub_a',customer_id:owner===a?'ctm_a':'ctm_b',status,custom_data:{calcumint_user_id:owner},items:[{price_id:'pri_pro'}],current_billing_period:{starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-11-01T00:00:00Z'}});
let provider:()=>Promise<unknown>,providerCalls=0,baseUrl='',supabaseUrl='',http:Server,providerServer:Server,gateway:Server;
async function listen(server:Server) {server.listen(0,'127.0.0.1');await once(server,'listening');const address=server.address();if(!address||typeof address==='string')throw new Error('Loopback listener unavailable');return `http://127.0.0.1:${address.port}`;}
function signed(id:string,{owner=a,type='subscription.updated'}={}) {
  const body=JSON.stringify({event_id:id,event_type:type,occurred_at:'2026-10-18T00:00:00Z',notification_id:'delivery-only',data:{id:'sub_a',custom_data:{calcumint_user_id:owner}}});
  const timestamp=Math.floor(Date.now()/1000);
  return {body,headers:{'paddle-signature':`ts=${timestamp};h1=${createHmac('sha256','synthetic-http-secret').update(`${timestamp}:${body}`).digest('hex')}`}};
}
const send=(id:string,options?:Parameters<typeof signed>[1])=>fetch(baseUrl,{method:'POST',...signed(id,options),signal:AbortSignal.timeout(5000)});
const state=()=>sql(`SELECT jsonb_build_array(${['billing_customers','subscriptions','profiles','billing_webhook_events','billing_account_fences','billing_atomic_completions'].map(t=>`(SELECT coalesce(jsonb_agg(r ORDER BY to_jsonb(r)::text),'[]') FROM public.${t} r)`).join(',')});`);
beforeAll(async()=>{
  const network=(await exec('docker',['inspect','--format','{{.HostConfig.NetworkMode}}',container!])).stdout.trim();
  expect(network).toBe(`${container}-network`);expect((await exec('docker',['network','inspect','--format','{{.Internal}}',network])).stdout.trim()).toBe('true');
  providerServer=createServer(async(req,res)=>{
    if(req.method!=='GET'||req.url!=='/subscriptions/sub_a'){res.writeHead(404).end();return;}
    providerCalls++;
    try {res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify(await provider()));}catch {res.writeHead(503).end();}
  });
  const expectedIp=(await exec('docker',['inspect','--format','{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}',`${container}-rest`])).stdout.trim();
  expect(restUrl).toBe(`http://${expectedIp}:3000`);
  expect((await exec('docker',['inspect','--format','{{.HostConfig.NetworkMode}}',`${container}-rest`])).stdout.trim()).toBe(network);
  const ports=JSON.parse((await exec('docker',['inspect','--format','{{json .NetworkSettings.Ports}}',`${container}-rest`])).stdout);
  expect(Object.values(ports).every(binding=>binding===null||Array.isArray(binding)&&binding.length===0)).toBe(true);
  // Supabase JS uses /rest/v1; PostgREST itself serves /rpc and tables at root.
  // This local path adapter stands in for the Supabase gateway, without auth bypass.
  gateway=createServer(async(req,res)=>{
    if(!req.url?.startsWith('/rest/v1/')){res.writeHead(404).end();return;}
    try {
      const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));
      const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value&& !['host','connection','content-length'].includes(key))headers.set(key,Array.isArray(value)?value.join(','):value);
      const response=await fetch(`${restUrl}${req.url.slice('/rest/v1'.length)}`,{method:req.method,headers,body:['GET','HEAD'].includes(req.method??'GET')?undefined:Buffer.concat(chunks)});
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
    }catch {res.writeHead(503).end();}
  });
  supabaseUrl=await listen(gateway);
  fixture.providerUrl=await listen(providerServer);
  http=createServer(async(req,res)=>{
    try {
      const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));
      const response=await POST(new Request('http://127.0.0.1/api/billing/webhook',{method:req.method,headers:req.headers as Record<string,string>,body:Buffer.concat(chunks)}));
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
    }catch {res.writeHead(500).end();}
  });
  baseUrl=await listen(http);
});
afterAll(async()=>{for(const server of [http,providerServer,gateway])if(server){server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}});
beforeEach(async()=>{await sql("TRUNCATE public.billing_atomic_completions,public.billing_webhook_events,public.billing_account_fences,public.subscriptions,public.billing_customers; UPDATE public.profiles SET plan='free';");fixture.admin=client();provider=async()=>snapshot();providerCalls=0;});
it('uses real HTTP/Supabase/PostgREST to apply and deduplicate one signed receipt',async()=>{
  const first=await send('evt_http');expect(first.status).toBe(200);expect(await first.json()).toEqual({ok:true});
  const before=await state();provider=async()=>{throw new Error('offline');};
  const duplicate=await send('evt_http');expect(await duplicate.json()).toEqual({ok:true,duplicate:true});expect(providerCalls).toBe(1);expect(await state()).toBe(before);
});
it('rejects tampering before any PostgREST dispatch',async()=>{
  let calls=0;fixture.admin=client('service_role',a,async(input,init)=>{calls++;return fetch(input,init);});
  const request=signed('evt_bad');const response=await fetch(baseUrl,{method:'POST',...request,body:`${request.body} `});
  expect(response.status).toBe(400);expect(calls).toBe(0);expect(providerCalls).toBe(0);
});
it('handles simultaneous HTTP duplicates with a single revision and completion',async()=>{
  const replies=await Promise.all([send('evt_concurrent'),send('evt_concurrent')]);expect(replies.map(r=>r.status)).toEqual([200,200]);
  const bodies=await Promise.all(replies.map(r=>r.json()));expect(bodies.filter(r=>r.duplicate)).toHaveLength(1);
  expect(await sql('SELECT revision FROM public.billing_account_fences;')).toBe('1');expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('1');
});
it('fences a delayed active HTTP response and refetches canceled provider state',async()=>{
  let release!:(value:unknown)=>void;
  provider=()=>providerCalls===1?new Promise(resolve=>{release=resolve;}):Promise.resolve(snapshot('canceled'));
  const old=send('evt_old');await vi.waitFor(()=>expect(release).toBeTypeOf('function'));
  try {expect((await send('evt_new')).status).toBe(200);} finally {release(snapshot());}
  expect((await old).status).toBe(200);
  expect(providerCalls).toBe(3);expect(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`)).toBe('free');expect(await sql('SELECT status FROM public.subscriptions;')).toBe('canceled');
});
it('recovers a lost PostgREST commit response through verified completion, never a second apply',async()=>{
  let writes=0;
  fixture.admin=client('service_role',a,async(input,init)=>{const response=await fetch(input,init);if(String(input).endsWith('/rpc/apply_verified_billing_event_v1')){writes++;throw new Error('Synthetic response loss after commit');}return response;});
  const response=await send('evt_lost');expect(response.status).toBe(200);expect(await response.json()).toEqual({ok:true,duplicate:true});expect(writes).toBe(1);expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('1');
});
it('rolls back all effects on an HTTP late-write failure and recovers on explicit retry',async()=>{
  await sql("CREATE FUNCTION public.http_billing_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic late failure'; END $$; CREATE TRIGGER http_billing_failure AFTER INSERT ON public.billing_atomic_completions FOR EACH ROW EXECUTE FUNCTION public.http_billing_failure();");
  try {const before=await state();expect((await send('evt_rollback')).status).toBe(409);expect(await state()).toBe(before);}
  finally {await sql('DROP TRIGGER http_billing_failure ON public.billing_atomic_completions; DROP FUNCTION public.http_billing_failure();');}
  expect((await send('evt_rollback')).status).toBe(200);
});
it('rejects cross-account adoption and conflicting event identity without writes',async()=>{
  expect((await send('evt_owner')).status).toBe(200);const before=await state();
  expect((await send('evt_owner',{type:'subscription.canceled'})).status).toBe(409);
  provider=async()=>snapshot('active',b);expect((await send('evt_other',{owner:b})).status).toBe(409);expect(await state()).toBe(before);
});
it('enforces real JWT signatures and client-role RPC denial without REST fallback',async()=>{
  const invalid=await fetch(`${restUrl}/rpc/read_billing_fence_v1`,{method:'POST',headers:{Authorization:`Bearer ${jwt('service_role',a,'wrong-synthetic-key')}`,'Content-Type':'application/json'},body:JSON.stringify({p_user_id:a})});expect(invalid.status).toBe(401);
  for(const role of ['anon','authenticated']){fixture.admin=client(role);expect((await send(`evt_${role}`)).status).toBe(503);}
  expect(providerCalls).toBe(0);expect(await sql('SELECT count(*) FROM public.billing_webhook_events;')).toBe('0');
});
it('fails closed when RPC execution is revoked, with no provider call or separate writes',async()=>{
  await sql('REVOKE EXECUTE ON FUNCTION public.read_verified_billing_completion_v1(uuid,jsonb) FROM service_role;');
  try {const before=await state();expect((await send('evt_revoked')).status).toBe(503);expect(providerCalls).toBe(0);expect(await state()).toBe(before);}
  finally {await sql('GRANT EXECUTE ON FUNCTION public.read_verified_billing_completion_v1(uuid,jsonb) TO service_role;');}
});
it('keeps owner visibility isolated through real PostgREST JWT claims and existing RLS',async()=>{
  expect((await send('evt_a')).status).toBe(200);
  const otherRows=await client('authenticated',b).from('subscriptions').select('user_id');expect(otherRows.error).toBeNull();expect(otherRows.data).toEqual([]);
  const ownRows=await client('authenticated',a).from('subscriptions').select('user_id');expect(ownRows.error).toBeNull();expect(ownRows.data).toEqual([{user_id:a}]);
});
it('retains signed receipt-only non-subscription handling without entitlement effects',async()=>{
  expect((await send('evt_transaction',{type:'transaction.completed'})).status).toBe(200);
  const again=await send('evt_transaction',{type:'transaction.completed'});expect(await again.json()).toEqual({ok:true,duplicate:true});
  expect(providerCalls).toBe(0);expect(await sql('SELECT count(*) FROM public.billing_account_fences;')).toBe('0');expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('0');expect(await sql('SELECT count(*) FROM public.subscriptions;')).toBe('0');expect(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`)).toBe('free');
});

it('blocks legacy receipts without completion before fetching provider state',async()=>{
  const event=JSON.parse(signed('evt_legacy').body);delete event.notification_id;
  const payload=JSON.stringify(event).replaceAll("'","''");
  await sql(`INSERT INTO public.billing_webhook_events(event_id,event_type,payload) VALUES('evt_legacy','subscription.updated','${payload}'::jsonb);`);
  const before=await state();expect((await send('evt_legacy')).status).toBe(409);expect(providerCalls).toBe(0);expect(await state()).toBe(before);
});
it('persists configured Business/yearly evidence through the same guarded transport',async()=>{
  provider=async()=>({...snapshot(),items:[{price_id:'pri_business'}]});
  expect((await send('evt_business')).status).toBe(200);
  expect(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`)).toBe('business');
  expect(await sql('SELECT plan || \':\' || billing_interval FROM public.subscriptions;')).toBe('business:yearly');
});

it('returns a distinct PT409 application fence conflict over PostgREST without replay',async()=>{
  expect((await send('evt_fence_current')).status).toBe(200);
  const before=await state(),event=JSON.parse(signed('evt_fence_stale').body);delete event.notification_id;
  const reply=await client().rpc('apply_verified_billing_event_v1',{
    p_user_id:a,p_expected_revision:'0',p_event:event,p_snapshot:snapshot(),p_price_id:'pri_pro',p_plan:'pro',p_interval:'monthly'
  });
  expect(reply.status).toBe(409);expect(reply.error?.code).toBe('PT409');expect(await state()).toBe(before);
});
