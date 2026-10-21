// Actual HTTP -> Next route -> Supabase JS -> PostgREST -> disposable PG16.
import { createHmac, randomUUID } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { beforeAll, afterAll, beforeEach, expect, it, vi } from 'vitest';
import { signEmbedSession, type EmbedSessionClaims } from '../../src/lib/embeds/session';
const fixture=vi.hoisted(()=>({admin:null as SupabaseClient|null}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>fixture.admin}));
import { POST } from '../../src/app/api/embed/[key]/leads/route';
const exec=promisify(execFile),container=process.env.CALCUMINT_EMBED_TEST_CONTAINER,restUrl=process.env.CALCUMINT_EMBED_TEST_REST_URL;
if(!container||!/^calcumint-embed-test-[0-9a-f-]{36}$/.test(container)||!restUrl||!/^http:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)[0-9.]+:3000$/.test(restUrl))throw new Error('Disposable internal embed fixture required');
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',config='00000000-0000-4000-8000-000000000003';
const key='synthetic_public_key_123456',secret='synthetic-embed-session-secret-not-production';
const payload={consentText:'Synthetic consent',privacyUrl:null,name:'Synthetic',email:'synthetic@example.invalid',consented:true,input:{x:1},output:{answer:2}};
const claims={configId:config,organizationId:a,calculatorId:a,version:1};
const sql=async(query:string)=>(await exec('docker',['exec',container!,'psql','-h','127.0.0.1','-U','postgres','-qAt','-X','-v','ON_ERROR_STOP=1','-c',query],{timeout:10000})).stdout.trim();
const state=()=>sql("SELECT jsonb_build_array((SELECT count(*) FROM public.embed_leads),(SELECT count(*) FROM public.lead_consents),(SELECT count(*) FROM public.embed_lead_receipts),(SELECT count(*) FROM public.webhook_deliveries),(SELECT count(*) FROM public.embed_events));");
function jwt(role:string,sub=a,signingKey='synthetic-isolated-embed-jwt-secret-not-production'){
 const head=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),body=Buffer.from(JSON.stringify({role,sub,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
 return `${head}.${body}.${createHmac('sha256',signingKey).update(`${head}.${body}`).digest('base64url')}`;
}
let gateway:Server,http:Server,supabaseUrl='',baseUrl='';
async function listen(server:Server){server.listen(0,'127.0.0.1');await once(server,'listening');const address=server.address();if(!address||typeof address==='string')throw new Error('No loopback address');return `http://127.0.0.1:${address.port}`;}
const client=(role='service_role',sub=a,transport:typeof fetch=fetch)=>createClient(supabaseUrl,jwt(role,sub),{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:transport}});
const token=(override:Partial<EmbedSessionClaims>={})=>signEmbedSession({...claims,expiresAt:Date.now()+300000,...override},secret);
function send(id:string=randomUUID(),body:unknown=payload,session=token(),path=key,headers:Record<string,string>={}){
 return fetch(`${baseUrl}/${path}`,{method:'POST',headers:{'content-type':'application/json','Idempotency-Key':id,'x-embed-session':session,...headers},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
}
const rpcArgs=(id=randomUUID())=>({p_public_key:key,p_config_id:config,p_organization_id:a,p_calculator_id:a,p_version:1,p_expires_at:Date.now()+300000,p_request_id:id,p_payload:payload});
beforeAll(async()=>{
 const inspect=async(format:string,target:string)=>(await exec('docker',['inspect','--format',format,target])).stdout.trim();
 const network=`${container}-network`;
 expect(await inspect('{{.HostConfig.NetworkMode}}',container!)).toBe(network);
 expect((await exec('docker',['network','inspect','--format','{{.Internal}}',network])).stdout.trim()).toBe('true');
 expect(await inspect('{{.HostConfig.NetworkMode}}',`${container}-rest`)).toBe(network);
 expect(restUrl).toBe(`http://${await inspect('{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}',`${container}-rest`)}:3000`);
 for(const target of [container!,`${container}-rest`]){const ports=JSON.parse(await inspect('{{json .NetworkSettings.Ports}}',target));expect(Object.values(ports??{}).every(v=>v===null||Array.isArray(v)&&v.length===0)).toBe(true);}
 gateway=createServer(async(req,res)=>{
  if(!req.url?.startsWith('/rest/v1/')){res.writeHead(404).end();return;}
  try{const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));const headers=new Headers();for(const [k,v] of Object.entries(req.headers))if(v&&!['host','connection','content-length'].includes(k))headers.set(k,Array.isArray(v)?v.join(','):v);
   const reply=await fetch(`${restUrl}${req.url.slice('/rest/v1'.length)}`,{method:req.method,headers,body:['GET','HEAD'].includes(req.method??'GET')?undefined:Buffer.concat(chunks)});res.writeHead(reply.status,Object.fromEntries(reply.headers));res.end(Buffer.from(await reply.arrayBuffer()));
  }catch{res.writeHead(503).end();}
 });supabaseUrl=await listen(gateway);
 http=createServer(async(req,res)=>{try{const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));const reply=await POST(new NextRequest(`http://127.0.0.1/api/embed${req.url}/leads`,{method:'POST',headers:req.headers as Record<string,string>,body:Buffer.concat(chunks)}),{params:Promise.resolve({key:req.url!.slice(1)})});res.writeHead(reply.status,Object.fromEntries(reply.headers));res.end(Buffer.from(await reply.arrayBuffer()));}catch{res.writeHead(500).end();}});baseUrl=await listen(http);
});
afterAll(async()=>{delete process.env.EMBED_SESSION_SECRET;for(const server of [http,gateway])if(server){server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}});
beforeEach(async()=>{
 process.env.EMBED_SESSION_SECRET=secret;fixture.admin=client();
 await sql(`TRUNCATE public.embed_lead_receipts,public.lead_consents,public.embed_leads,public.embed_events,public.webhook_deliveries;UPDATE public.embed_configs SET status='active',lead_capture_enabled=true,lead_fields=ARRAY['name','email'],consent_text='Synthetic consent',privacy_url=NULL,public_key='${key}',organization_id='${a}',calculator_id='${a}';UPDATE public.custom_calculators SET status='published',published_version=1,organization_id='${a}';UPDATE public.profiles SET plan='business' WHERE id='${a}';`);
});
it('commits one exact consent, receipt, webhook and event with private JSON response',async()=>{
 const reply=await send();expect(reply.status).toBe(200);expect(reply.headers.get('content-type')).toContain('application/json');expect(reply.headers.get('cache-control')).toBe('no-store');expect(await reply.json()).toEqual({ok:true});expect(await state()).toBe('[1, 1, 1, 1, 1]');
 expect(JSON.parse(await sql('SELECT jsonb_build_array(consent_text,privacy_url,consented) FROM public.lead_consents;'))).toEqual(['Synthetic consent',null,true]);
});
it('deduplicates concurrent matching HTTP submissions without exposing lead IDs',async()=>{const id=randomUUID();const replies=await Promise.all([send(id),send(id)]);expect(replies.map(r=>r.status)).toEqual([200,200]);expect(await Promise.all(replies.map(r=>r.json()))).toEqual(expect.arrayContaining([{ok:true},{ok:true,duplicate:true}]));expect(await state()).toBe('[1, 1, 1, 1, 1]');});
it('rejects concurrent conflicting payloads as JSON 409 and preserves the winner',async()=>{const id=randomUUID();const replies=await Promise.all([send(id),send(id,{...payload,email:'other@example.invalid'})]);expect(replies.map(r=>r.status).sort()).toEqual([200,409]);expect(await state()).toBe('[1, 1, 1, 1, 1]');const failed=replies.find(r=>r.status===409)!;expect(await failed.json()).toEqual({error:'Lead request conflicts with existing evidence'});});
it('rolls back consent and receipt failures including webhook effects, then accepts explicit retry',async()=>{
 await sql("CREATE FUNCTION public.http_embed_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic late failure'; END $$;");
 try{for(const table of ['lead_consents','embed_lead_receipts']){const id=randomUUID();await sql(`CREATE TRIGGER http_embed_failure AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.http_embed_failure();`);try{expect((await send(id)).status).toBe(503);expect(await state()).toBe('[0, 0, 0, 0, 0]');}finally{await sql(`DROP TRIGGER http_embed_failure ON public.${table};`);}expect((await send(id)).status).toBe(200);await sql('TRUNCATE public.embed_lead_receipts,public.lead_consents,public.embed_leads,public.embed_events,public.webhook_deliveries;');}}finally{await sql('DROP FUNCTION public.http_embed_failure();');}
});
it('never acknowledges response loss; explicit same-key retry reconciles committed evidence',async()=>{
 let writes=0;fixture.admin=client('service_role',a,async(input,init)=>{const reply=await fetch(input,init);if(String(input).endsWith('/rpc/capture_verified_embed_lead_v1')){writes++;await reply.arrayBuffer();throw new Error('Synthetic committed response loss');}return reply;});const id=randomUUID();expect((await send(id)).status).toBe(503);expect(writes).toBe(1);expect(await state()).toBe('[1, 1, 1, 1, 1]');fixture.admin=client();const retry=await send(id);expect(await retry.json()).toEqual({ok:true,duplicate:true});expect(await state()).toBe('[1, 1, 1, 1, 1]');
});
it('rejects stale text and privacy literals, while committed retries retain their displayed terms',async()=>{
 const id=randomUUID();expect((await send(id)).status).toBe(200);await sql("UPDATE public.embed_configs SET consent_text='Changed terms',privacy_url='https://example.invalid/privacy';");
 const stale=await send();expect(stale.status).toBe(409);expect(await stale.json()).toEqual({error:'Consent information changed; reload before submitting',code:'CONSENT_CHANGED'});expect(await (await send(id)).json()).toEqual({ok:true,duplicate:true});expect(await state()).toBe('[1, 1, 1, 1, 1]');
});
it('requires applicable affirmative consent and required fields before any capture',async()=>{for(const body of [{...payload,consented:false},{...payload,consentText:undefined},{...payload,email:undefined},{...payload,input:[]}])expect((await send(randomUUID(),body)).status).toBe(400);expect(await state()).toBe('[0, 0, 0, 0, 0]');});
it('rejects malformed JSON, missing identity and forged or expired tokens before PostgREST',async()=>{
 let calls=0;fixture.admin=client('service_role',a,async(input,init)=>{calls++;return fetch(input,init);});
 expect((await send(randomUUID(),payload,token()+'x')).status).toBe(403);expect((await send(randomUUID(),payload,token({expiresAt:Date.now()-1000}))).status).toBe(403);expect((await send('invalid')).status).toBe(400);
 const reply=await fetch(`${baseUrl}/${key}`,{method:'POST',headers:{'content-type':'application/json','Idempotency-Key':randomUUID(),'x-embed-session':token()},body:'{'});expect(reply.status).toBe(400);expect(calls).toBe(0);
});
it('binds real config/key, organization, calculator and publication version reads',async()=>{
 for(const override of [{organizationId:b},{calculatorId:b},{configId:b},{version:2}])expect((await send(randomUUID(),payload,token(override))).status).toBe(404);
 expect((await send(randomUUID(),payload,token(),'other_public_key')).status).toBe(404);
 for(const change of ["UPDATE public.embed_configs SET status='paused';","UPDATE public.embed_configs SET lead_capture_enabled=false;","UPDATE public.custom_calculators SET status='draft';"]){await sql(change);expect((await send()).status).toBe(404);await sql("UPDATE public.embed_configs SET status='active',lead_capture_enabled=true;UPDATE public.custom_calculators SET status='published';");}expect(await state()).toBe('[0, 0, 0, 0, 0]');
});
it('fails closed if execution is revoked and performs no separate fallback writes',async()=>{
 const signature='public.capture_verified_embed_lead_v1(text,uuid,uuid,uuid,integer,bigint,uuid,jsonb)';await sql(`REVOKE EXECUTE ON FUNCTION ${signature} FROM service_role;`);try{expect((await send()).status).toBe(503);expect(await state()).toBe('[0, 0, 0, 0, 0]');}finally{await sql(`GRANT EXECUTE ON FUNCTION ${signature} TO service_role;`);}
});
it('uses real JWT verification and denies client-role RPC and receipt access',async()=>{
 const invalid=await fetch(`${restUrl}/rpc/capture_verified_embed_lead_v1`,{method:'POST',headers:{Authorization:`Bearer ${jwt('service_role',a,'wrong-synthetic-key')}`,'Content-Type':'application/json'},body:JSON.stringify(rpcArgs())});expect(invalid.status).toBe(401);
 for(const role of ['anon','authenticated']){const reply=await client(role).rpc('capture_verified_embed_lead_v1',rpcArgs());expect(reply.error?.code).toBe('42501');expect((await client(role).from('embed_lead_receipts').select('*')).error?.code).toBe('42501');}expect(await state()).toBe('[0, 0, 0, 0, 0]');
});
it('isolates lead and consent visibility through actual owner JWTs and RLS',async()=>{
 expect((await send()).status).toBe(200);for(const table of ['embed_leads','lead_consents']){const other=await client('authenticated',b).from(table).select('*');expect(other.error).toBeNull();expect(other.data).toEqual([]);const own=await client('authenticated',a).from(table).select('*');expect(own.error).toBeNull();expect(own.data).toHaveLength(1);}
});
it('refuses corrupt receipt/lead/consent evidence rather than acknowledging duplicates',async()=>{
 const id=randomUUID();expect((await send(id)).status).toBe(200);
 for(const [alter,restore] of [[`UPDATE public.embed_lead_receipts SET organization_id='${b}';`,`UPDATE public.embed_lead_receipts SET organization_id='${a}';`],["UPDATE public.embed_leads SET email='corrupt@example.invalid';","UPDATE public.embed_leads SET email='synthetic@example.invalid';"],["UPDATE public.lead_consents SET consent_text='Never displayed';","UPDATE public.lead_consents SET consent_text='Synthetic consent';"]]){await sql(alter);try{expect([409,503]).toContain((await send(id)).status);}finally{await sql(restore);}}expect(await state()).toBe('[1, 1, 1, 1, 1]');
});
it('validates direct RPC payload shape, bindings and expiry without any HTTP route assumptions',async()=>{
 for(const override of [{p_public_key:'wrong'},{p_organization_id:b},{p_calculator_id:b},{p_version:2},{p_expires_at:0},{p_payload:{...payload,extraPersonalData:'forbidden'}},{p_payload:{...payload,output:[]}}]){const reply=await client().rpc('capture_verified_embed_lead_v1',{...rpcArgs(),...override});expect(reply.error).not.toBeNull();expect(reply.data).toBeNull();}expect(await state()).toBe('[0, 0, 0, 0, 0]');
});
it('pins service-only definer ownership and search path in the database catalog',async()=>{
 const routine=JSON.parse(await sql("SELECT json_build_object('owner',r.rolname,'definer',p.prosecdef,'config',p.proconfig,'anon',has_function_privilege('anon',p.oid,'EXECUTE'),'authenticated',has_function_privilege('authenticated',p.oid,'EXECUTE'),'service',has_function_privilege('service_role',p.oid,'EXECUTE')) FROM pg_proc p JOIN pg_roles r ON r.oid=p.proowner WHERE p.proname='capture_verified_embed_lead_v1';"));expect(routine).toMatchObject({owner:'postgres',definer:true,anon:false,authenticated:false,service:true});expect(routine.config).toContain('search_path=pg_catalog, public');
});
it('treats privacy URL changes alone and blank configured consent as unavailable evidence',async()=>{
 await sql("UPDATE public.embed_configs SET privacy_url='https://example.invalid/changed';");const stale=await send();expect(stale.status).toBe(409);expect((await stale.json()).code).toBe('CONSENT_CHANGED');
 await sql("UPDATE public.embed_configs SET privacy_url=NULL,consent_text='   ';");expect((await send(randomUUID(),{...payload,consentText:'   '})).status).toBe(503);expect(await state()).toBe('[0, 0, 0, 0, 0]');
});
it('keeps the same UUID independent across valid configs but rejects cross-config token reuse',async()=>{
 const second='00000000-0000-4000-8000-000000000004',secondKey='synthetic_second_public_key';
 await sql(`INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,created_by) VALUES('${second}','${a}','${a}','${secondKey}','Second synthetic',true,'Synthetic consent','${a}');`);
 try{const id=randomUUID();expect((await send(id)).status).toBe(200);expect((await send(id,payload,token(),secondKey)).status).toBe(404);expect((await send(id,payload,token({configId:second}),secondKey)).status).toBe(200);expect(await state()).toBe('[2, 2, 2, 2, 2]');}
 finally{await sql(`DELETE FROM public.embed_lead_receipts WHERE embed_config_id='${second}';DELETE FROM public.lead_consents WHERE lead_id IN (SELECT id FROM public.embed_leads WHERE embed_config_id='${second}');DELETE FROM public.embed_leads WHERE embed_config_id='${second}';DELETE FROM public.embed_events WHERE embed_config_id='${second}';DELETE FROM public.embed_configs WHERE id='${second}';`);}
});
it('keeps best-effort analytics failure separate from mandatory committed evidence',async()=>{
 await sql("CREATE FUNCTION public.http_analytics_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic analytics failure'; END $$;CREATE TRIGGER http_analytics_failure BEFORE INSERT ON public.embed_events FOR EACH ROW EXECUTE FUNCTION public.http_analytics_failure();");
 try{expect((await send()).status).toBe(200);expect(await state()).toBe('[1, 1, 1, 1, 0]');}finally{await sql('DROP TRIGGER http_analytics_failure ON public.embed_events;DROP FUNCTION public.http_analytics_failure();');}
});
it('denies direct service mutation of private receipt storage',async()=>{
 const reply=await client().from('embed_lead_receipts').insert({request_id:randomUUID()});expect(reply.error?.code).toBe('42501');expect(await state()).toBe('[0, 0, 0, 0, 0]');
});
