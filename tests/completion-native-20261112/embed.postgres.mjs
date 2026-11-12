import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const artifacts=process.env.FACTORY_EMBED_ARTIFACTS||'/tmp/factory-nine-embed';await mkdir(artifacts,{recursive:true});
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
 const grants=new Map();
 async function grant(catalog,engine){const id=randomUUID();await db.sql(`INSERT INTO public.native_embed_grants(id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at) VALUES('${id}','${org}','${issuer}','${key}','${hash}','https://customer.example',${catalog},'${engine}',1,now(),now()+interval '1 hour');`);return id;}
 const debit=(id,request=randomUUID(),input=hash)=>db.sql(`SET ROLE service_role;SELECT public.consume_native_embed_v1('${id}','${request}','${input}','${hash}');`);
 for(const [catalog,engine]of ids){const id=await grant(catalog,engine);grants.set(catalog,id);assert.equal(await debit(id),'denied');}
 assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'0');
 pass('Real hosted publication reader denies every unapproved exact tuple without quota/audit debit');
 const reader=await db.sql("SELECT pg_get_functiondef('public.factory_native_embed_publication_v1(integer,integer)'::regprocedure);");
 // Conditional transport composition: only this lower hosted reader is replaced.
 // Actual product publication, certification and applicability remain unapproved.
 await db.sql(`CREATE TABLE public.fixture_factory_publication(catalog integer PRIMARY KEY,version integer NOT NULL);INSERT INTO public.fixture_factory_publication VALUES ${ids.map(([id])=>`(${id},1)`).join(',')};CREATE OR REPLACE FUNCTION public.factory_native_embed_publication_v1(p_catalog integer,p_version integer) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$ BEGIN PERFORM catalog FROM public.fixture_factory_publication WHERE catalog=p_catalog AND version=p_version FOR SHARE;IF NOT FOUND THEN RAISE EXCEPTION 'Isolated synthetic publication unavailable' USING ERRCODE='PT404';END IF;END $$;`);
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
 await db.sql(`UPDATE public.business_api_keys SET monthly_quota=10000,rate_limit_per_minute=10000 WHERE id='${key}';`);
 await db.sql("CREATE FUNCTION public.fixture_abort_native_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic audit unavailable';END $$;CREATE TRIGGER fixture_abort BEFORE INSERT ON public.native_embed_usage FOR EACH ROW EXECUTE FUNCTION public.fixture_abort_native_audit();");
 await assert.rejects(debit(grants.get(432)),/synthetic audit unavailable/);assert.equal(await db.sql(`SELECT count(*) FROM public.api_usage_events WHERE api_key_id='${key}';`),'9');
 await db.sql('DROP TRIGGER fixture_abort ON public.native_embed_usage;DROP FUNCTION public.fixture_abort_native_audit();');
 pass('Existing configured shared quota limits apply and audit failure rolls the quota debit back');
 await db.sql(reader);assert.equal(await debit(grants.get(438)),'denied');
 const reverse=await readFile('docs/completion-native-20261112/embed-reverse-disable.sql','utf8');await assert.rejects(db.sql(reverse),/UNAPPLIED_FACTORY_NINE_EMBED_DISABLE/);await db.sql(unhold(reverse));await assert.rejects(debit(grants.get(440)),/permission denied/);
 assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'9');pass('Source-bound reverse disables redemption while retaining all nine durable audit rows');
 await writeFile(artifacts+'/receipt.json',JSON.stringify({passed:true,checks,successorSHA256:createHash('sha256').update(candidate).digest('hex'),realHostedReaderInitiallyDenied:true,conditionalSyntheticReaderOnly:true,scope:'Genuine isolated Postgres/auth-schema quota composition; no actual HTTP/browser-origin acceptance, no production equivalence, no approval or publication adoption',productionWrites:false},null,2)+'\n');
}catch(error){await writeFile(artifacts+'/failure.txt',error.stack);throw error;}finally{await db?.close();}
