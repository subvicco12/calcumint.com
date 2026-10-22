// Disposable aggregate acceptance only. No production database/credentials/ports.
// Hosted auth, platform ACLs and migration history are models, never attestations.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const name=`calcumint-migration-contract-${randomUUID()}`,network=`${name}-network`;
const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const p=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';p.stdout.on('data',v=>out+=v);p.stderr.on('data',v=>err+=v);p.on('error',reject);p.on('close',code=>code===0?resolve(out.trim()):reject(Error(err||out)));p.stdin.on('error',reject);p.stdin.end(input);});
const sql=(q,db='combined')=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-d',db,'-X','-qAt','-v','ON_ERROR_STOP=1','--set=VERBOSITY=verbose'],q);
const json=v=>`'${JSON.stringify(v).replaceAll("'","''")}'::jsonb`;
const report={model:'disposable; production provenance unknown',lanes:[],cases:[],blockers:[]};
const test=async(label,fn)=>{await fn();report.cases.push(label);console.log(`PASS ${label}`);};
const platform=async db=>sql(`CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}'::jsonb);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$SELECT coalesce(nullif(current_setting('request.jwt.claim.sub',true),''),nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$SELECT coalesce(nullif(current_setting('request.jwt.claim.role',true),''),nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'role')$$;GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;`,db);
const files=(await readdir('supabase/migrations')).filter(f=>f.endsWith('.sql')).sort();
const numeric=[...files].sort((a,b)=>Number(a.match(/^\d+/)[0])-Number(b.match(/^\d+/)[0])||(a<b?-1:a>b?1:0));
async function lane(db,order,{repair011=false,omit009=false}={}){
 await sql(`CREATE DATABASE ${db};`,'postgres');await platform(db);
 const applied=[];let failure=null;
 for(const file of order){if(omit009&&file==='009_country_preferences.sql')continue;let source=await readFile(`supabase/migrations/${file}`,'utf8');if(repair011&&file==='011_b8_free_save_quotas.sql'){
   if(repair011==='additive'){
    source=await readFile('docs/architecture/proposals/20261020-v1-legacy-save-quota-repair.sql','utf8');
    await assert.rejects(sql(source,db),/UNAPPLIED_LEGACY_SAVE_QUOTA_REPAIR_V1/);
    assert.equal(await sql("SELECT to_regprocedure('public.enforce_calcumint_save_quotas()') IS NULL;",db),'t');
    const guard=source.match(/DO \$proposal_guard\$ BEGIN[\s\S]*?END \$proposal_guard\$;/)?.[0];assert.ok(guard);source=source.replace(guard,'-- disposable-only guard removal');
   }else{assert.equal(source.split('end $;').length,2);source=source.replace('end $;',()=> 'end $$;');}
  }
  try{await sql(source,db);applied.push(repair011==='additive'&&file==='011_b8_free_save_quotas.sql'?'PROPOSAL:20261020-v1-legacy-save-quota-repair.sql (replaces omitted 011)':file);}catch(error){failure={file,error:error.message.split('\n').slice(0,4).join('\n')};break;}}
 const result={database:db,order,repair011,omit009,applied,failure};report.lanes.push(result);if(failure)report.blockers.push({lane:db,...failure});console.log(`LANE ${db}: ${applied.length}/${order.length-(omit009?1:0)} applied; ${failure?`BLOCKED ${failure.file}: ${failure.error}`:'candidate graph accepted'}`);return result;
}
let created=false,net=false;
try{
 await cmd(['image','inspect',image,'--format','{{.Id}}']);await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--pull=never','--name',name,'--network',network,'--label','calcumint.migration-contract=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let n=0;;n++){try{await sql('SELECT 1;','postgres');break;}catch(error){if(n>=60)throw error;await new Promise(r=>setTimeout(r,250));}}
 await sql('CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;','postgres');
 const raw=await lane('raw_fresh',files);assert.equal(raw.failure?.file,'011_b8_free_save_quotas.sql');assert.match(raw.failure.error,/unterminated dollar-quoted string/);
 const candidate=await lane('candidate_fresh',numeric,{repair011:'additive'});
 const additive=await readFile('docs/architecture/proposals/20261020-v1-legacy-save-quota-repair.sql','utf8');
 const additiveUnguarded=additive.replace(/DO \$proposal_guard\$ BEGIN[\s\S]*?END \$proposal_guard\$;/,'-- disposable-only guard removal');
 const candidateFunction=await sql("SELECT pg_get_functiondef('public.enforce_calcumint_save_quotas()'::regprocedure);",'candidate_fresh');
 await assert.rejects(sql(additiveUnguarded,'candidate_fresh'),/LEGACY_QUOTA_REPAIR_EXISTING_CONTRACT_REQUIRES_OWNER_COMPARISON/);
 assert.equal(await sql("SELECT pg_get_functiondef('public.enforce_calcumint_save_quotas()'::regprocedure);",'candidate_fresh'),candidateFunction);
 const upgrade=await lane('candidate_upgrade',numeric,{repair011:true,omit009:true});
 const upgradeFunction=await sql("SELECT pg_get_functiondef('public.enforce_calcumint_save_quotas()'::regprocedure);",'candidate_upgrade');
 await assert.rejects(sql(additiveUnguarded,'candidate_upgrade'),/LEGACY_QUOTA_REPAIR_EXISTING_CONTRACT_REQUIRES_OWNER_COMPARISON/);
 await test('additive legacy repair guard/missing installation succeeds; reapply and existing contract refuse unchanged',async()=>{
  assert.equal(await sql("SELECT pg_get_functiondef('public.enforce_calcumint_save_quotas()'::regprocedure);",'candidate_upgrade'),upgradeFunction);
  assert.equal(await sql("SELECT count(*) FROM pg_trigger WHERE NOT tgisinternal AND tgname IN ('favorites_free_quota','calculation_history_free_quota');",'candidate_fresh'),'2');
 });
 assert.equal(await sql("SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='user_preferences' AND column_name='country_code';",'candidate_upgrade'),'0');
 // Continue aggregate proposal boundaries only on an explicitly modeled graph.
 // A blocked graph is never called a successful fresh install.
 if(candidate.failure)throw Error(`Candidate graph blocker requires explicit prerequisite review: ${candidate.failure.file}`);
 await sql('ALTER DATABASE candidate_upgrade RENAME TO combined;','postgres');
 if(upgrade.failure)throw Error(`Upgrade graph blocker requires explicit prerequisite review: ${upgrade.failure.file}`);
 console.log(`ORDER ${JSON.stringify(numeric)}`);

 const as=(id,q)=>sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${id}';${q}`);
 const service=q=>sql(`SET ROLE service_role;${q}`);
 const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',member='00000000-0000-4000-8000-000000000003';
 const project=randomUUID(),config=randomUUID(),key=randomUUID(),saved=randomUUID(),firstHistory=randomUUID();
 const catalog=()=>sql(`SELECT md5(jsonb_build_array((SELECT jsonb_agg(jsonb_build_array(oid::regprocedure::text,pg_get_functiondef(oid),proacl::text) ORDER BY oid::regprocedure::text) FROM pg_proc WHERE pronamespace='public'::regnamespace),(SELECT jsonb_agg(jsonb_build_array(relname,relacl::text,relrowsecurity) ORDER BY relname) FROM pg_class WHERE relnamespace='public'::regnamespace),(SELECT jsonb_agg(jsonb_build_array(polname,pg_get_expr(polqual,polrelid),pg_get_expr(polwithcheck,polrelid)) ORDER BY polname,polrelid) FROM pg_policy))::text);`);
 const billingMd=await readFile('docs/architecture/proposals/ATOMIC-BILLING-TRANSACTION-PROPOSAL.md','utf8');
 const proposals=[['ATOMIC-BILLING-TRANSACTION-PROPOSAL.md',billingMd.match(/```sql\n([\s\S]*?)\n```/)?.[1]],...await Promise.all(['ATOMIC-ACCOUNT-HISTORY.sql','ATOMIC-API-QUOTA.sql','ATOMIC-BATCH-JOB.sql','ATOMIC-EMBED-LEAD-CONSENT.sql','API-RLS-HELPER-EXECUTE.sql','MEMBERSHIP-ADMIN-FENCING.sql'].map(async file=>[file,await readFile(`docs/architecture/proposals/${file}`,'utf8')]))];
 // Guards must roll back the complete proposal, including clients that continue
 // after a SQL error. Never mutate the review artifacts or historical migrations.
 for(const [file,source]of proposals){
  assert.ok(source,`SQL block required: ${file}`);
  const guard=source.match(/DO (\$[a-z_]*\$) BEGIN\s*RAISE EXCEPTION[\s\S]*?END \1;/i)?.[0];assert.ok(guard,`one leading guard required: ${file}`);
  const before=await catalog();await assert.rejects(sql(source),/PROPOSAL ONLY|UNAPPLIED_ATOMIC/);assert.equal(await catalog(),before);
  await cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-d','combined','-X','-qAt','-v','ON_ERROR_STOP=0'],source);assert.equal(await catalog(),before);
  const unguarded=source.replace(guard,'-- Guard stripped only for this disposable acceptance.');
  if(file==='API-RLS-HELPER-EXECUTE.sql'){
   assert.equal(await sql("SELECT has_function_privilege('authenticated','public.is_org_member(uuid)','EXECUTE');"),'f');
   await assert.rejects(sql(unguarded.replace('COMMIT;','SELECT public.combined_missing_prerequisite();\nCOMMIT;')),/does not exist/);
   assert.equal(await sql("SELECT has_function_privilege('authenticated','public.is_org_member(uuid)','EXECUTE');"),'f');
  }
  await sql(unguarded);console.log(`PROPOSAL disposable-only ${file}`);
 }
 await test('all seven proposal guards preserve catalog; partial helper grant rolls back',async()=>{assert.equal(proposals.length,7);});
 // Explicit platform ACL fixture dependencies, not grants claimed from migrations.
 await sql(`GRANT SELECT,INSERT,UPDATE,DELETE ON public.calculation_history,public.calculation_projects,public.saved_scenarios TO authenticated;GRANT SELECT ON public.organizations,public.organization_members,public.custom_calculators,public.embed_configs,public.embed_leads,public.lead_consents TO authenticated;GRANT UPDATE,DELETE ON public.organization_members TO authenticated;GRANT UPDATE ON public.organizations TO authenticated;
 INSERT INTO auth.users(id,email) VALUES('${a}','owner@example.invalid'),('${b}','outsider@example.invalid'),('${member}','member@example.invalid');`);
 const billing=(eventId,revision,status='active')=>{const event={event_id:eventId,event_type:'subscription.updated',occurred_at:'2026-10-20T00:00:00Z',data:{id:'combined_subscription',custom_data:{calcumint_user_id:a}}};const snapshot={id:'combined_subscription',customer_id:'combined_customer',status,custom_data:{calcumint_user_id:a},items:[{price:{id:'combined_business'}}],current_billing_period:{starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-11-01T00:00:00Z'}};return `SELECT public.apply_verified_billing_event_v1('${a}',${revision},${json(event)},${json(snapshot)},'combined_business','business','monthly');`;};
 const history=(id=randomUUID())=>`SELECT public.save_calculation_history_atomic('${id}','combined-synthetic',1,'{}','{"saved":true}','${a}');`;
 const scenario=(id=randomUUID())=>`SELECT public.save_project_scenario_atomic('${id}','${project}','${firstHistory}','Copy','${a}');`;
 await service(billing('combined_paid',0));
 await as(a,history(firstHistory));for(let i=0;i<19;i++)await as(a,history());
 await sql(`INSERT INTO public.organizations(id,name,slug,owner_user_id) VALUES('${a}','Combined owner','combined-owner','${a}'),('${b}','Outsider','combined-outsider','${b}');INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${a}','${a}','owner'),('${a}','${member}','admin'),('${b}','${b}','owner');
 INSERT INTO public.custom_calculators(id,organization_id,name,slug,status,published_version,created_by) VALUES('${a}','${a}','Combined synthetic','combined-synthetic','published',1,'${a}');
 INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,created_by) VALUES('${config}','${a}','${a}','combined_synthetic_public_key_123456','Combined',true,'Combined synthetic consent','${a}');
 INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,monthly_quota,rate_limit_per_minute,created_by,scopes) VALUES('${key}','${a}','Combined','combined','combined-hash',2,2,'${a}','["calculations:batch"]');`);
 await as(a,`INSERT INTO public.calculation_projects(id,user_id,name) VALUES('${project}','${a}','Combined');${scenario(saved)}`);
 const barrier=async label=>{for(let n=0;n<100;n++){if(await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='${label}' AND wait_event='PgSleep';`)==='1')return;await new Promise(r=>setTimeout(r,10));}throw Error(`Missing barrier ${label}`);};
 await test('billing downgrade profile lock fences concurrent history and scenario writers',async()=>{
  const downgrade=service(`SET application_name='combined-downgrade';BEGIN;${billing('combined_canceled',1,'canceled')}SELECT pg_sleep(0.5);COMMIT;`);await barrier('combined-downgrade');
  await Promise.all([downgrade,assert.rejects(as(a,history()),/HISTORY_QUOTA_EXCEEDED/),assert.rejects(as(a,`UPDATE public.saved_scenarios SET name='Forbidden stale paid rename' WHERE id='${saved}';`),/SCENARIO_PLAN_REQUIRED/)]);
  assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`),'free');assert.equal(await as(a,'SELECT count(*) FROM public.calculation_history;'),'20');
 });
 await test('billing paid duplicate acknowledges without undoing Free quota and workspace/API gates',async()=>{
  assert.equal(JSON.parse(await service(billing('combined_paid',0))).status,'duplicate');
  assert.equal(await as(a,history(firstHistory)),firstHistory);await assert.rejects(as(a,history()),/HISTORY_QUOTA_EXCEEDED/);await assert.rejects(as(a,scenario()),/SCENARIO_PLAN_REQUIRED/);
  assert.equal(await service(`SELECT public.consume_business_api_quota('${key}');`),'f');assert.equal(await sql(`SELECT revision FROM public.billing_account_fences WHERE user_id='${a}';`),'2');
 });
 await test('late billing completion failure rolls back plan and fence across account/API boundaries',async()=>{
  await sql("CREATE FUNCTION public.combined_billing_fail() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN RAISE EXCEPTION 'combined late billing failure';END$$;CREATE TRIGGER combined_billing_fail AFTER INSERT ON public.billing_atomic_completions FOR EACH ROW EXECUTE FUNCTION public.combined_billing_fail();");
  try{await assert.rejects(service(billing('combined_failed_upgrade',2)),/combined late billing failure/);}finally{await sql('DROP TRIGGER combined_billing_fail ON public.billing_atomic_completions;DROP FUNCTION public.combined_billing_fail();');}
  assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`),'free');assert.equal(await sql(`SELECT revision FROM public.billing_account_fences WHERE user_id='${a}';`),'2');assert.equal(await service(`SELECT public.consume_business_api_quota('${key}');`),'f');assert.equal(await sql("SELECT count(*) FROM public.billing_webhook_events WHERE event_id='combined_failed_upgrade';"),'0');
 });
 await service(billing('combined_restored',2));
 const definition={name:'Combined',fields:[{key:'x',label:'Value',type:'number'}],outputs:[{key:'answer',label:'Answer',formula:'x*2'}]};
 await sql(`INSERT INTO public.custom_calculator_versions(calculator_id,version,definition,created_by) VALUES('${a}',1,${json(definition)},'${a}');`);
 const batch=(id=randomUUID())=>`SELECT public.submit_verified_batch_job_v1('${key}','combined-hash','${a}','${id}','${a}','[{"x":3}]',1,${json(definition)},'[{"index":0,"ok":true,"output":{"answer":6}}]');`;
 await test('API quota and batch proposals share the same two-unit budget after billing restoration',async()=>{
  assert.equal(await service(`SELECT public.consume_business_api_quota('${key}');`),'t');assert.equal(JSON.parse(await service(batch())).status,'completed');assert.equal(await service(`SELECT public.consume_business_api_quota('${key}');`),'f');
  await assert.rejects(service(batch()),/quota exceeded/);assert.equal(await sql('SELECT sum(units) FROM public.api_usage_events;'),'2');assert.equal(await sql('SELECT count(*) FROM public.batch_request_receipts;'),'1');
 });
 const payload={name:'Combined',email:'combined@example.invalid',consented:true,consentText:'Combined synthetic consent',privacyUrl:null,input:{x:1},output:{answer:2}};
 const capture=(id=randomUUID())=>`SELECT public.capture_verified_embed_lead_v1('combined_synthetic_public_key_123456','${config}','${a}','${a}',1,(extract(epoch FROM now())*1000+300000)::bigint,'${id}',${json(payload)});`;
 const embedState=()=>sql('SELECT jsonb_build_array((SELECT count(*) FROM public.embed_leads),(SELECT count(*) FROM public.lead_consents),(SELECT count(*) FROM public.embed_lead_receipts));');
 await test('membership fences reject admin owner edits and cross-identity moves with aggregate RLS intact',async()=>{
  assert.equal(await as(member,`WITH changed AS (UPDATE public.organization_members SET role='member' WHERE organization_id='${a}' AND user_id='${a}' RETURNING user_id) SELECT count(*) FROM changed;`),'0');
  await assert.rejects(as(member,`UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';`),/ownership requires owner/);
  await assert.rejects(as(a,`UPDATE public.organization_members SET user_id='${b}' WHERE organization_id='${a}' AND user_id='${member}';`),/membership identity is immutable/);
  assert.equal(await as(b,'SELECT count(*) FROM public.embed_configs;'),'0');assert.equal(await as(member,'SELECT count(*) FROM public.embed_configs;'),'1');
 });
 await test('embed consent/receipt late failures roll back after membership and billing proposals coexist',async()=>{
  await sql("CREATE FUNCTION public.combined_embed_fail() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN RAISE EXCEPTION 'combined embed late failure';END$$;");
  try{for(const table of ['lead_consents','embed_lead_receipts']){await sql(`CREATE TRIGGER combined_embed_fail AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.combined_embed_fail();`);try{await assert.rejects(service(capture()),/combined embed late failure/);assert.equal(await embedState(),'[0, 0, 0]');}finally{await sql(`DROP TRIGGER combined_embed_fail ON public.${table};`);}}}finally{await sql('DROP FUNCTION public.combined_embed_fail();');}
  const id=randomUUID();assert.equal(JSON.parse(await service(capture(id))).status,'created');assert.equal(JSON.parse(await service(capture(id))).status,'duplicate');assert.equal(await embedState(),'[1, 1, 1]');
  await as(a,`DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';`);assert.equal(await as(member,'SELECT count(*) FROM public.embed_leads;'),'0');assert.equal(await as(a,'SELECT count(*) FROM public.embed_leads;'),'1');
 });
 await test('combined owner, JWT binding, private receipt RLS and actual 038 grants remain restrictive',async()=>{
  await assert.rejects(as(b,history()),/HISTORY_WRITE_REJECTED/);assert.equal(await as(b,'SELECT count(*) FROM public.calculation_history;'),'0');
  await assert.rejects(as(a,"UPDATE public.profiles SET plan='business';"),/permission denied/);await as(a,"UPDATE public.profiles SET display_name='Combined reviewer';");
  for(const role of ['anon','authenticated']){await assert.rejects(sql(`SET ROLE ${role};SELECT * FROM public.embed_lead_receipts;`),/permission denied/);await assert.rejects(sql(`SET ROLE ${role};SELECT public.read_billing_fence_v1('${a}');`),/permission denied/);}
  assert.equal(await sql("SELECT has_schema_privilege('authenticated','public','CREATE');"),'f');
 });
 await test('aggregate proposed RPC owners, fixed paths and effective execution matrix survive all proposals',async()=>{
  const serviceNames=['read_billing_fence_v1','read_verified_billing_completion_v1','apply_verified_billing_event_v1','consume_business_api_quota','read_verified_batch_job_v1','submit_verified_batch_job_v1','capture_verified_embed_lead_v1'];
  const clientNames=['save_calculation_history_atomic','save_project_scenario_atomic','is_org_member','has_org_role'];
  const rows=JSON.parse(await sql(`SELECT jsonb_agg(jsonb_build_object('name',proname,'owner',pg_get_userbyid(proowner),'definer',prosecdef,'config',proconfig,'anon',has_function_privilege('anon',oid,'EXECUTE'),'authenticated',has_function_privilege('authenticated',oid,'EXECUTE'),'service',has_function_privilege('service_role',oid,'EXECUTE')) ORDER BY proname) FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname=ANY(ARRAY[${[...serviceNames,...clientNames].map(v=>`'${v}'`).join(',')}]);`));
  assert.equal(rows.length,11);for(const row of rows){assert.equal(row.owner,'postgres');assert.equal(row.definer,true);assert.equal(row.anon,false);assert.equal(row.authenticated,clientNames.includes(row.name));assert.equal(row.service,serviceNames.includes(row.name));assert.ok(row.config.some(v=>/^search_path=(pg_catalog(?:, public)?|public)$/.test(v)));}
  assert.equal(await sql("SELECT has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');"),'f');
  assert.equal(await sql("SELECT rolbypassrls FROM pg_roles WHERE rolname='service_role';"),'t');
 });
 await test('owner metadata script compiles read-only with an explicit empty synthetic ledger and no mutations',async()=>{
  const evidence=await readFile('tests/migration-contract/owner-readonly-evidence.sql','utf8');
  await assert.rejects(sql(evidence),/schema_migrations.*does not exist/);
  await sql('CREATE SCHEMA supabase_migrations;CREATE TABLE supabase_migrations.schema_migrations(version text,name text,statements text[]);');
  const before=await catalog();const output=JSON.parse(await sql(evidence));
  assert.equal(output.evidence_kind,'OWNER_READONLY_METADATA_NOT_APPROVAL');assert.equal(output.schema_version,1);
  assert.equal(await sql('SELECT count(*) FROM supabase_migrations.schema_migrations;'),'0');assert.equal(await catalog(),before);
  assert.ok(output.functions.some(f=>f.schema==='auth'&&f.name==='uid'));assert.ok(output.tables.some(t=>t.name==='profiles'));
 });
 console.log(`${report.cases.length} combined-boundary cases passed. Candidate fresh uses 41 repo files plus additive replacement proposal; upgrade uses 41 repo files with fixture-only corrected 011; raw fresh remains blocked. Production history, grants and auth remain UNKNOWN.`);

}finally{
 await writeFile('/tmp/migration-contract-combined.json',JSON.stringify(report,null,2)+'\n');
 try{if(created)await cmd(['rm','-f',name]);}finally{if(net)await cmd(['network','rm',network]);}
}
