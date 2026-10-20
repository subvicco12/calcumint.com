// Disposable PostgreSQL only; no production URL, no host ports, internal network.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const name=`calcumint-embed-test-${randomUUID()}`,network=`${name}-network`;
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const c=spawn('docker',args,{stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';c.stdout.on('data',v=>out+=v);c.stderr.on('data',v=>err+=v);c.on('error',reject);c.on('close',n=>n===0?resolve(out.trim()):reject(new Error(err||out)));c.stdin.on('error',reject);c.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',config='00000000-0000-4000-8000-000000000003';
const payload={consentText:'Synthetic consent',privacyUrl:null,name:'Synthetic',email:'synthetic@example.invalid',consented:true,input:{x:1},output:{answer:2}};
const quote=v=>`'${JSON.stringify(v).replaceAll("'","''")}'::jsonb`;
const call=(id,{body=payload,org=a,version=1,expires="(extract(epoch FROM now())*1000+300000)::bigint"}={})=>`SET ROLE service_role; SELECT public.capture_verified_embed_lead_v1('synthetic_public_key_123456', '${config}','${org}','${a}',${version},${expires},'${id}',${quote(body)});`;
const reset=()=>sql('TRUNCATE public.embed_lead_receipts,public.lead_consents,public.embed_leads,public.embed_events,public.webhook_deliveries;');
const state=()=>sql("SELECT jsonb_build_array((SELECT count(*) FROM public.embed_leads),(SELECT count(*) FROM public.lead_consents),(SELECT count(*) FROM public.embed_lead_receipts),(SELECT count(*) FROM public.webhook_deliveries));");
let created=false,net=false,count=0;
const test=async(label,run)=>{await reset();await run();count++;console.log(`PASS ${label}`);};
try {
 await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--name',name,'--network',network,'--label','calcumint.embed-fixture=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let n=0;;n++){try{await sql('SELECT 1;');break;}catch(e){if(n>=60)throw e;await new Promise(r=>setTimeout(r,250));}}
 await sql(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 CREATE TABLE public.profiles(id uuid PRIMARY KEY,plan text);CREATE TABLE public.organizations(id uuid PRIMARY KEY);CREATE TABLE public.custom_calculators(id uuid PRIMARY KEY,organization_id uuid REFERENCES public.organizations,status text,published_version integer);
 CREATE TABLE public.custom_calculator_runs(id uuid,organization_id uuid,calculator_id uuid,calculator_version integer,input_data jsonb,output_data jsonb,created_at timestamptz);
 CREATE FUNCTION public.is_org_member(uuid) RETURNS boolean LANGUAGE sql STABLE AS $$ SELECT $1=auth.uid() $$;
 CREATE FUNCTION public.has_org_role(uuid,text[]) RETURNS boolean LANGUAGE sql STABLE AS $$ SELECT $1=auth.uid() $$;
 GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
 INSERT INTO auth.users VALUES('${a}'),('${b}');INSERT INTO public.profiles VALUES('${a}','business'),('${b}','free');INSERT INTO public.organizations VALUES('${a}'),('${b}');INSERT INTO public.custom_calculators VALUES('${a}','${a}','published',1);`);
 await sql(await readFile('supabase/migrations/005_b7_delivery.sql','utf8'));
 await sql(await readFile('supabase/migrations/006_b8_api_automation.sql','utf8'));
 await sql(`INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,created_by) VALUES('${config}','${a}','${a}','synthetic_public_key_123456','Synthetic',true,'Synthetic consent','${a}');`);
 await sql(`INSERT INTO public.business_webhook_endpoints(organization_id,name,endpoint_url,secret_ciphertext,event_types,created_by) VALUES('${a}','Synthetic','https://example.invalid/hook','synthetic-not-a-secret','["lead.created"]','${a}');`);
 // Reproduce the original two-transaction failure without retaining fixture data.
 await sql(`INSERT INTO public.embed_leads(organization_id,embed_config_id,calculator_id,email) VALUES('${a}','${config}','${a}','synthetic@example.invalid');`);
 await assert.rejects(sql("INSERT INTO public.lead_consents(lead_id,consent_text,consented) SELECT id,NULL,true FROM public.embed_leads;"),/null value/);
 assert.equal(await sql('SELECT count(*) FROM public.embed_leads;'),'1');console.log('PASS reproduced orphan lead after separate consent failure');await sql('TRUNCATE public.lead_consents,public.embed_leads,public.embed_events,public.webhook_deliveries;');
 const proposal=await readFile('docs/architecture/proposals/ATOMIC-EMBED-LEAD-CONSENT.sql','utf8');const guard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated acceptance and owner authorization required'; END $$;";
 assert.equal(proposal.split(guard).length,2);await assert.rejects(sql(proposal),/PROPOSAL ONLY/);await sql(proposal.replace(guard,''));
 // Synthetic explicit service grants only; proposed function remains definer-owned.
 await sql('GRANT SELECT ON public.embed_configs,public.embed_leads,public.lead_consents TO authenticated;');
 await test('concurrent identical captures yield one lead, consent and receipt',async()=>{const id=randomUUID();const replies=await Promise.all([sql(call(id)),sql(call(id))]);assert.deepEqual(replies.map(r=>JSON.parse(r).status).sort(),['created','duplicate']);assert.equal(await state(),'[1, 1, 1, 1]');});
 await test('same request with different payload conflicts without overwriting original',async()=>{const id=randomUUID();await sql(call(id));await assert.rejects(sql(call(id,{body:{...payload,email:'other@example.invalid'}})),/Conflicting lead request/);assert.equal(await state(),'[1, 1, 1, 1]');});
 await test('concurrent conflicting requests retain one immutable capture',async()=>{const id=randomUUID();const replies=await Promise.allSettled([sql(call(id)),sql(call(id,{body:{...payload,email:'conflicting@example.invalid'}}))]);assert.equal(replies.filter(r=>r.status==='fulfilled').length,1);assert.match(replies.find(r=>r.status==='rejected').reason.message,/Conflicting lead request/);assert.equal(await state(),'[1, 1, 1, 1]');});
 await test('optional phone/company fields retain existing accepted inputs',async()=>{await sql("UPDATE public.embed_configs SET lead_fields=ARRAY['email','phone','company'];");try{assert.equal(JSON.parse(await sql(call(randomUUID()))).status,'created');}finally{await sql("UPDATE public.embed_configs SET lead_fields=ARRAY['name','email'];");}});
 await test('ownership, version, expiry and consent fail closed before writes',async()=>{for(const options of [{org:b},{version:2},{expires:'0'},{body:{...payload,consented:false}}])await assert.rejects(sql(call(randomUUID(),options)));assert.equal(await state(),'[0, 0, 0, 0]');});
 await test('consent and receipt failures roll back the lead and trigger side effects',async()=>{
  await sql("CREATE FUNCTION public.fixture_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$;");
  for(const table of ['lead_consents','embed_lead_receipts']){
   await sql(`CREATE TRIGGER fixture_failure AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.fixture_failure();`);
   try{await assert.rejects(sql(call(randomUUID())),/synthetic failure/);assert.equal(await state(),'[0, 0, 0, 0]');}finally{await sql(`DROP TRIGGER fixture_failure ON public.${table};`);}
  }
  await sql('DROP FUNCTION public.fixture_failure();');
 });
 await test('lost reply reconciles through explicit same-key retry',async()=>{const id=randomUUID();await sql(call(id));const result=JSON.parse(await sql(call(id)));assert.equal(result.status,'duplicate');assert.equal(await state(),'[1, 1, 1, 1]');});
 await test('paused config and changed publication reject captures',async()=>{await sql(`UPDATE public.embed_configs SET status='paused';`);await assert.rejects(sql(call(randomUUID())));await sql("UPDATE public.embed_configs SET status='active';UPDATE public.custom_calculators SET status='draft';");try{await assert.rejects(sql(call(randomUUID())));}finally{await sql("UPDATE public.custom_calculators SET status='published';");}assert.equal(await state(),'[0, 0, 0, 0]');});
 await test('client roles cannot execute RPC or access receipts; RLS isolates leads',async()=>{await sql(call(randomUUID()));for(const role of ['anon','authenticated']){await assert.rejects(sql(call(randomUUID()).replace('SET ROLE service_role',`SET ROLE ${role}`)),/permission denied/);await assert.rejects(sql(`SET ROLE ${role}; SELECT * FROM public.embed_lead_receipts;`),/permission denied/);}
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${b}';SELECT count(*) FROM public.embed_leads;`),'0');assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';SELECT count(*) FROM public.embed_leads;`),'1');});
 await test('new capture cannot record terms the stale widget did not display',async()=>{
  await sql("UPDATE public.embed_configs SET consent_text='Changed terms',privacy_url='https://example.invalid/new-privacy';");
  try {await assert.rejects(sql(call(randomUUID())),/Consent evidence changed/);assert.equal(await state(),'[0, 0, 0, 0]');}
  finally {await sql("UPDATE public.embed_configs SET consent_text='Synthetic consent',privacy_url=NULL;");}
 });
 await test('committed retry retains its exact original consent after current terms change',async()=>{
  const id=randomUUID();await sql(call(id));
  await sql("UPDATE public.embed_configs SET consent_text='Changed terms';");
  try {assert.equal(JSON.parse(await sql(call(id))).status,'duplicate');assert.equal(await sql('SELECT consent_text FROM public.lead_consents;'),'Synthetic consent');}
  finally {await sql("UPDATE public.embed_configs SET consent_text='Synthetic consent';");}
 });
 await test('corrupted tenant, payload or consent cannot acknowledge a duplicate',async()=>{
  const id=randomUUID();await sql(call(id));
  for(const [alter,restore] of [
   [`UPDATE public.embed_leads SET organization_id='${b}';`,`UPDATE public.embed_leads SET organization_id='${a}';`],
   ["UPDATE public.embed_leads SET email='corrupted@example.invalid';","UPDATE public.embed_leads SET email='synthetic@example.invalid';"],
   ["UPDATE public.lead_consents SET consent_text='Never displayed';","UPDATE public.lead_consents SET consent_text='Synthetic consent';"]
  ]) {await sql(alter);try{await assert.rejects(sql(call(id)),/Incomplete or conflicting lead receipt/);}finally{await sql(restore);}}
 });
 await test('RPC rejects non-object calculation captures and unknown payload fields',async()=>{
  for(const body of [{...payload,input:[]},{...payload,output:'not an object'},{...payload,extraPersonalData:'not allowlisted'}])await assert.rejects(sql(call(randomUUID(),{body})),/Invalid lead payload/);
  assert.equal(await state(),'[0, 0, 0, 0]');
 });
 await test('existing API quota and Business owner gates remain independent and enforced sequentially',async()=>{
  const key='00000000-0000-4000-8000-000000000009';
  await sql(`INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,monthly_quota,rate_limit_per_minute,created_by) VALUES('${key}','${a}','Synthetic','test','synthetic-hash',1,1,'${a}');`);
  assert.equal(await sql(`SET ROLE service_role;SELECT public.consume_business_api_quota('${key}');`),'t');
  assert.equal(await sql(`SET ROLE service_role;SELECT public.consume_business_api_quota('${key}');`),'f');
  await sql(`UPDATE public.profiles SET plan='free' WHERE id='${a}';DELETE FROM public.api_usage_events;`);
  assert.equal(await sql(`SET ROLE service_role;SELECT public.consume_business_api_quota('${key}');`),'f');
 });

 // Deterministic proof: both legacy callers finish window reads before either
 // INSERT can proceed. An advisory barrier is fixture-only, not a production lock.
 await test('reproduces legacy quota race then verifies serialized proposal',async()=>{
  const key='00000000-0000-4000-8000-000000000010';
  await sql(`UPDATE public.profiles SET plan='business' WHERE id='${a}';INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,monthly_quota,rate_limit_per_minute,created_by) VALUES('${key}','${a}','Race','race','race-synthetic-hash',1,10,'${a}');
    CREATE FUNCTION public.quota_barrier() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock_shared(92731);RETURN NEW;END $$;CREATE TRIGGER quota_barrier BEFORE INSERT ON public.api_usage_events FOR EACH ROW EXECUTE FUNCTION public.quota_barrier();`);
  const gate=sql('SELECT pg_advisory_lock(92731);SELECT pg_sleep(20);').then(()=>null,error=>error);
  const wait=async query=>{for(let n=0;n<100;n++){if(await sql(query)==='t')return;await new Promise(r=>setTimeout(r,20));}throw new Error('Quota concurrency barrier not reached');};
  await wait("SELECT EXISTS(SELECT FROM pg_locks WHERE locktype='advisory' AND objid=92731 AND granted);");
  const consume=()=>sql(`SET ROLE service_role;SELECT public.consume_business_api_quota('${key}');`);
  const legacy=Promise.all([consume(),consume()]);
  try {await wait("SELECT count(*)=2 FROM pg_locks WHERE locktype='advisory' AND objid=92731 AND NOT granted;");}
  finally {await sql("SELECT pg_terminate_backend(pid) FROM pg_locks WHERE locktype='advisory' AND objid=92731 AND granted;");await gate;}
  assert.deepEqual(await legacy,['t','t']);assert.equal(await sql(`SELECT sum(units) FROM public.api_usage_events WHERE api_key_id='${key}';`),'2');
  await sql('DROP TRIGGER quota_barrier ON public.api_usage_events;DROP FUNCTION public.quota_barrier();DELETE FROM public.api_usage_events;');
  const proposal=await readFile('docs/architecture/proposals/ATOMIC-API-QUOTA.sql','utf8');const guard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated quota acceptance and owner authorization required'; END $$;";
  assert.equal(proposal.split(guard).length,2);await assert.rejects(sql(proposal),/PROPOSAL ONLY/);await sql(proposal.replace(guard,''));
  assert.deepEqual((await Promise.all([consume(),consume()])).sort(),['f','t']);
  assert.equal(await sql(`SELECT sum(units) FROM public.api_usage_events WHERE api_key_id='${key}';`),'1');
  await sql(`DELETE FROM public.api_usage_events;UPDATE public.business_api_keys SET monthly_quota=10,rate_limit_per_minute=1 WHERE id='${key}';`);
  assert.deepEqual((await Promise.all([consume(),consume()])).sort(),['f','t']);
  await sql(`DELETE FROM public.api_usage_events;CREATE FUNCTION public.quota_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic quota failure';END $$;CREATE TRIGGER quota_failure AFTER INSERT ON public.api_usage_events FOR EACH ROW EXECUTE FUNCTION public.quota_failure();`);
  try{await assert.rejects(consume(),/synthetic quota failure/);assert.equal(await sql('SELECT count(*) FROM public.api_usage_events;'),'0');}
  finally{await sql('DROP TRIGGER quota_failure ON public.api_usage_events;DROP FUNCTION public.quota_failure();');}
  assert.equal(await consume(),'t');
  for(const role of ['anon','authenticated'])await assert.rejects(sql(`SET ROLE ${role};SELECT public.consume_business_api_quota('${key}');`),/permission denied/);
  await sql(`UPDATE public.business_api_keys SET status='revoked' WHERE id='${key}';`);assert.equal(await consume(),'f');
 });
 await test('quota proposal rejects unsupported snapshot isolation before any debit',async()=>{
  const before=await sql('SELECT count(*) FROM public.api_usage_events;');
  for(const isolation of ['REPEATABLE READ','SERIALIZABLE'])await assert.rejects(sql(`BEGIN ISOLATION LEVEL ${isolation};SET LOCAL ROLE service_role;SELECT public.consume_business_api_quota('00000000-0000-4000-8000-000000000010');COMMIT;`),/requires READ COMMITTED/);
  assert.equal(await sql('SELECT count(*) FROM public.api_usage_events;'),before);
 });
 console.log(`${count} atomic embed PostgreSQL cases passed; proposal remains unapplied outside fixture.`);
} finally {try{if(created)await cmd(['rm','-f',name]);}finally{if(net)await cmd(['network','rm',network]);}}
