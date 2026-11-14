import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const artifacts=process.env.FACTORY_EMBED_ARTIFACTS||'/tmp/factory-nine-embed';await mkdir(artifacts,{recursive:true});await rm(artifacts+'/failure.txt',{force:true});await rm(artifacts+'/receipt.json',{force:true});
const checks=[],hash='a'.repeat(64),other='b'.repeat(64),ids=[[218,'launch-square-calculator','square-calculator'],[219,'launch-cube-calculator','cube-calculator'],[220,'launch-square-root-calculator','square-root-calculator'],[423,'conversion.length','length-converter'],[430,'conversion.energy','energy-converter'],[431,'conversion.power','power-converter'],[432,'conversion.time','time-converter'],[438,'conversion.force','force-converter'],[440,'conversion.frequency','frequency-converter']];
const pass=message=>{checks.push(message);console.log('PASS '+message);};
const unhold=text=>text.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION '[A-Z_]+'; END \$hold\$;/,'-- isolated fixture only');
let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 for(const path of ['docs/native440/quota-readiness-wrapper.sql','docs/native440-remediation/embed-metering.sql'])await db.sql(unhold(await readFile(path,'utf8')));
 const candidate=await readFile('docs/completion-native-20261112/embed-successor.sql','utf8');
 await assert.rejects(db.sql(candidate),/UNAPPLIED_FACTORY_NINE_NATIVE_EMBED/);
 await db.sql(unhold(candidate));
 const owner=randomUUID(),issuer=randomUUID(),org=randomUUID(),key=randomUUID();
 await db.sql(`INSERT INTO auth.users(id,email) VALUES('${owner}','${owner}@example.invalid'),('${issuer}','${issuer}@example.invalid');UPDATE public.profiles SET plan='business' WHERE id IN('${owner}','${issuer}');INSERT INTO public.organizations(id,name,slug,owner_user_id) VALUES('${org}','Nine embed isolated','${org}','${owner}');INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${owner}','owner'),('${org}','${issuer}','admin');INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,scopes,created_by) VALUES('${key}','${org}','Configured key','test','${hash}','["calculations:run"]'::jsonb,'${issuer}');`);
 const configuredLimits=JSON.parse(await db.sql(`SELECT jsonb_build_object('monthlyQuota',monthly_quota,'rateLimit',rate_limit_per_minute) FROM public.business_api_keys WHERE id='${key}';`));
 const grants=new Map();
 async function grant(catalog,engine){const id=randomUUID();await db.sql(`INSERT INTO public.native_embed_grants(id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at) VALUES('${id}','${org}','${issuer}','${key}','${hash}','https://customer.example',${catalog},'${engine}',1,now(),now()+interval '1 hour');`);return id;}
 const debit=(id,request=randomUUID(),input=hash)=>db.sql(`SET ROLE service_role;SELECT public.consume_native_embed_v1('${id}','${request}','${input}','${hash}');`);
 for(const [catalog,engine]of ids){const id=await grant(catalog,engine);grants.set(catalog,id);assert.equal(await debit(id),'denied');}
 assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'0');
 pass('Real hosted publication reader denies every unapproved exact tuple without quota/audit debit');
 const reader=await db.sql("SELECT pg_get_functiondef('public.factory_native_embed_publication_snapshot_v1(text,text,integer)'::regprocedure);");
 const outerGate=await db.sql("SELECT pg_get_functiondef('public.factory_native_embed_publication_v1(integer,integer)'::regprocedure);");
 // Conditional transport composition: only this lower hosted reader is replaced.
 // Actual product publication, certification and applicability remain unapproved.
 await db.sql(`CREATE TABLE public.fixture_factory_publication(engine text NOT NULL,slug text NOT NULL,version integer NOT NULL,PRIMARY KEY(engine,slug,version));INSERT INTO public.fixture_factory_publication VALUES ${ids.map(([,engine,slug])=>`('${engine}','${slug}',1)`).join(',')};CREATE OR REPLACE FUNCTION public.factory_native_embed_publication_snapshot_v1(p_engine text,p_slug text,p_version integer) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$ BEGIN PERFORM engine FROM public.fixture_factory_publication WHERE engine=p_engine AND slug=p_slug AND version=p_version FOR SHARE;RETURN FOUND;END $$;`);
 assert.equal(await db.sql("SELECT pg_get_functiondef('public.factory_native_embed_publication_v1(integer,integer)'::regprocedure);"),outerGate);
 for(const [catalog,version]of [[424,1],[218,2],[440,2]])await assert.rejects(db.sql(`SELECT public.factory_native_embed_publication_v1(${catalog},${version});`),/Exact publication unavailable/);
 for(const column of ['engine','slug','version']){
  const original=column==='engine'?"'conversion.length'":column==='slug'?"'length-converter'":'1';
  const altered=column==='version'?'2':"'foreign'";
  await db.sql(`UPDATE public.fixture_factory_publication SET ${column}=${altered} WHERE engine='conversion.length';`);
  assert.equal(await debit(grants.get(423)),'denied');
  await db.sql(`UPDATE public.fixture_factory_publication SET ${column}=${original} WHERE ${column}=${altered};`);
 }
 for(const role of ['anon','authenticated','service_role']){
  await assert.rejects(db.sql(`SET ROLE ${role};SELECT public.factory_native_embed_publication_snapshot_v1('conversion.length','length-converter',1);`),/permission denied/);
  await assert.rejects(db.sql(`SET ROLE ${role};SELECT public.factory_native_embed_publication_v1(423,1);`),/permission denied/);
 }
 pass('Only lower row-locked snapshot substituted; real nine-tuple/version/PT404 gate and private helper grants remain unchanged');
 for(const [catalog]of ids){const id=grants.get(catalog),request=randomUUID();assert.equal(await debit(id,request),'accepted');assert.equal(await debit(id,request),'replayed');assert.equal(await debit(id,request,other),'conflict');}
 assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'9');
 assert.equal(await db.sql(`SELECT count(*) FROM public.api_usage_events WHERE api_key_id='${key}';`),'9');
 pass('All nine exact grants debit the existing configured key once, with durable attribution and replay/conflict boundaries');
 const invalid=randomUUID();await assert.rejects(db.sql(`INSERT INTO public.native_embed_grants SELECT '${invalid}',organization_id,issuer_id,api_key_id,token_hash,allowed_origin,424,engine_id,technical_version,issued_at,expires_at,revoked_at FROM public.native_embed_grants LIMIT 1;`),/native_embed_grant_exact_tuple/);
 await assert.rejects(db.sql(`UPDATE public.native_embed_grants SET catalog_id=440,engine_id='conversion.frequency' WHERE id='${grants.get(218)}';`),/Immutable native grant identity/);
 for(const role of ['anon','authenticated'])await assert.rejects(db.sql(`SET ROLE ${role};SELECT public.consume_native_embed_v1('${grants.get(218)}','${randomUUID()}','${hash}','${hash}');`),/permission denied/);
 await assert.rejects(db.sql(`SET ROLE service_role;INSERT INTO public.native_embed_usage SELECT * FROM public.native_embed_usage LIMIT 1;`),/permission denied/);
 pass('Unselected tuple, immutable grant tamper, direct audit writes and untrusted RPC calls fail closed');
 await db.sql(`UPDATE public.profiles SET plan='free' WHERE id='${owner}';`);assert.equal(await debit(grants.get(218)),'denied');await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${owner}';UPDATE public.profiles SET plan='free' WHERE id='${issuer}';`);assert.equal(await debit(grants.get(219)),'denied');await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${issuer}';DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${issuer}';`);assert.equal(await debit(grants.get(220)),'denied');await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${issuer}','admin');`);
 pass('Fresh owner and issuer Business plans and membership are rechecked on redemption');
 await db.sql(`UPDATE public.native_embed_grants SET revoked_at=now() WHERE id='${grants.get(423)}';`);assert.equal(await debit(grants.get(423)),'denied');await assert.rejects(db.sql(`UPDATE public.native_embed_grants SET revoked_at=null WHERE id='${grants.get(423)}';`),/monotonic/);
 const expired=randomUUID();await db.sql(`INSERT INTO public.native_embed_grants(id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at) VALUES('${expired}','${org}','${issuer}','${key}','${hash}','https://customer.example',430,'conversion.energy',1,now()-interval '2 hour',now()-interval '1 hour');`);assert.equal(await debit(expired),'denied');
 pass('Revocation is monotonic and expired grants cannot consume quota');
 await db.sql(`UPDATE public.business_api_keys SET monthly_quota=9 WHERE id='${key}';`);assert.equal(await debit(grants.get(431)),'limited');
 await db.sql(`UPDATE public.business_api_keys SET monthly_quota=10 WHERE id='${key}';`);
 const race=await Promise.all([debit(grants.get(430)),debit(grants.get(431))]);assert.deepEqual(race.sort(),['accepted','limited']);assert.equal(await db.sql(`SELECT count(*) FROM public.api_usage_events WHERE api_key_id='${key}';`),'10');
 await db.sql(`UPDATE public.business_api_keys SET monthly_quota=${configuredLimits.monthlyQuota},rate_limit_per_minute=${configuredLimits.rateLimit} WHERE id='${key}';`);
 await db.sql("CREATE FUNCTION public.fixture_abort_native_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic audit unavailable';END $$;CREATE TRIGGER fixture_abort BEFORE INSERT ON public.native_embed_usage FOR EACH ROW EXECUTE FUNCTION public.fixture_abort_native_audit();");
 await assert.rejects(debit(grants.get(432)),/synthetic audit unavailable/);assert.equal(await db.sql(`SELECT count(*) FROM public.api_usage_events WHERE api_key_id='${key}';`),'10');
 await db.sql('DROP TRIGGER fixture_abort ON public.native_embed_usage;DROP FUNCTION public.fixture_abort_native_audit();');
 pass('Configured shared quota limits apply, concurrent last-slot redemptions admit one, and audit failure rolls quota debit back');
 await db.sql(reader);assert.equal(await debit(grants.get(438)),'denied');
 assert.equal(await db.sql("SELECT pg_get_functiondef('public.factory_native_embed_publication_v1(integer,integer)'::regprocedure);"),outerGate);
 const functions=JSON.parse(await db.sql("SELECT jsonb_object_agg(proname,jsonb_build_object('bodySHA256',encode(sha256(convert_to(prosrc,'UTF8')),'hex'),'definitionSHA256',encode(sha256(convert_to(pg_get_functiondef(oid),'UTF8')),'hex'))) FROM pg_proc WHERE oid IN('public.factory_native_embed_publication_snapshot_v1(text,text,integer)'::regprocedure,'public.factory_native_embed_publication_v1(integer,integer)'::regprocedure,'public.consume_native_embed_v1(uuid,uuid,text,text)'::regprocedure,'public.factory_native_embed_identity_v1()'::regprocedure);"));
 const reverse=await readFile('docs/completion-native-20261112/embed-reverse-disable.sql','utf8');await assert.rejects(db.sql(reverse),/UNAPPLIED_FACTORY_NINE_EMBED_DISABLE/);await db.sql(unhold(reverse));await assert.rejects(debit(grants.get(440)),/permission denied/);
 assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'10');pass('Source-bound reverse disables redemption while retaining durable audit rows for all nine identities');
 await writeFile(artifacts+'/receipt.json',JSON.stringify({passed:true,checks,successorSHA256:createHash('sha256').update(candidate).digest('hex'),realHostedReaderInitiallyDenied:true,conditionalSyntheticReaderOnly:true,outerGateUnmodified:true,functions,scope:'Genuine isolated Postgres/auth-schema quota composition; no actual HTTP/browser-origin acceptance, no production equivalence, no approval or publication adoption',productionWrites:false},null,2)+'\n');
}catch(error){await writeFile(artifacts+'/failure.txt',error.stack);throw error;}finally{await db?.close();}
