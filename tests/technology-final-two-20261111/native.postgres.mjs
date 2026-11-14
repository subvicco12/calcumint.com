import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {shapeQuery,fingerprintQuery} from './native-shape.mjs';
for(const k of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[k],'External selector refused '+k);
assert(process.argv.slice(2).every(x=>x==='--capture'));
const dir='docs/technology-final-two-20261111/native';await mkdir(dir,{recursive:true});
const sha=s=>createHash('sha256').update(s).digest('hex');
const q=s=>"'"+String(s).replaceAll("'","''")+"'";
const json=s=>q(JSON.stringify(s))+'::jsonb';
const unhold=s=>s.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION '[A-Z_]+'; END \$hold\$;/,'-- disposable fixture only');
const rows=[[368,'technology.ip-subnet','ip-subnet-calculator'],[376,'technology.screen-ppi','screen-ppi-calculator']];
const tables=['technology_five_embed_grants','technology_five_embed_usage','technology_five_jobs'];
const checks=[];const pass=s=>{checks.push(s);console.log('PASS '+s);};let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});assert.match(await db.sql('SHOW server_version;'),/^17\.6/);
 const sources={};for(const file of ['docs/native440/quota-readiness-wrapper.sql','docs/first-five-native-20261109/embed-metering-proposal.sql','docs/first-five-native-20261109/jobs-webhooks-proposal.sql','docs/first-five-native-20261109/embed-integrity-successor.sql','docs/next-cohort-native-20261110/contract-successor.sql','docs/parallel-five-20261110/native/contract-successor.sql']){const raw=await readFile(file,'utf8');sources[file]=sha(raw);await db.sql(unhold(raw));}
 const preShape=await db.sql(shapeQuery+'::text;');const preHash=await db.sql(fingerprintQuery);
 const signatures=['public.technology_five_require_publication_v1(integer,integer)','public.submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)'];
 const oldDefs=await Promise.all(signatures.map(s=>db.sql(`SELECT pg_get_functiondef(${q(s)}::regprocedure);`)));
 const newDefs=oldDefs.map((s,i)=>{const anchor=i===0?"(387,'technology.password-entropy','password-entropy-calculator',1)":"(387,'technology.password-entropy')";assert.equal(s.split(anchor).length,2);return s.replace(anchor,anchor+','+rows.map(([id,engine,slug])=>i===0?`(${id},'${engine}','${slug}',1)`:`(${id},'${engine}')`).join(','));});
 // Generate changed checks from the retained exact18-tuple source, then inspect actual catalog result.
 const oldRaw=await readFile('docs/parallel-five-20261110/native/contract-successor.sql','utf8');
 const addConstraints=tables.map(t=>{const line=oldRaw.split('\n').find(l=>l.startsWith(`ALTER TABLE public.${t} ADD CONSTRAINT`));assert(line);const anchor="(387,'technology.password-entropy',1)";assert.equal(line.split(anchor).length,2);return `ALTER TABLE public.${t} DROP CONSTRAINT ${t}_exact_native_tuple_check;\n`+line.replace(anchor,anchor+','+rows.map(([id,e])=>`(${id},'${e}',1)`).join(','));}).join('\n');
 const locks=`LOCK TABLE ${tables.map(t=>'public.'+t).join(',')} IN SHARE ROW EXCLUSIVE MODE;`;
 const make=(hold,hash,body)=>`-- HELD exact-preimage-bound 18-to-20 native scope qualification; no activation authority.\nBEGIN;\nDO $hold$ BEGIN RAISE EXCEPTION '${hold}'; END $hold$;\nSET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='30s';\nDO $role$ BEGIN IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required'; END IF; END $role$;\n${locks}\nDO $pre$ BEGIN IF (${fingerprintQuery.slice(7,-1)}) IS DISTINCT FROM '${hash}' THEN RAISE EXCEPTION 'Exact native schema preimage differs'; END IF; END $pre$;\n${body}\nCOMMIT;\n`;
 const forward=make('UNAPPLIED_FINAL_TWO_NATIVE_SUCCESSOR',preHash,addConstraints+'\n'+newDefs.join(';\n')+';');
 const successorPath=dir+'/contract-successor.sql',reversePath=dir+'/contract-reverse.sql';
 if(process.argv.includes('--capture'))await writeFile(successorPath,forward);else assert.equal(await readFile(successorPath,'utf8'),forward,'Held successor must match independently reconstructed exact preimage');
 // Seed nonempty historical records through the unchanged protected RPCs.
 const owner=randomUUID(),org=randomUUID(),key=randomUUID(),hash='a'.repeat(64),grant=randomUUID();
 await db.sql(`INSERT INTO auth.users(id,email) VALUES('${owner}','${owner}@example.invalid');UPDATE public.profiles SET plan='business' WHERE id='${owner}';INSERT INTO public.organizations(id,name,slug,owner_user_id) VALUES('${org}','Native18 fixture','${org}','${owner}');INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${owner}','owner');INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,scopes,created_by,rate_limit_per_minute,monthly_quota) VALUES('${key}','${org}','Fixture','fixture','${hash}','["calculations:batch","calculations:run"]','${owner}',1000,10000);`);
 const reader=await db.sql("SELECT pg_get_functiondef('public.technology_five_publication_snapshot_v1(text,text,integer)'::regprocedure);");
 const fixtureReader=reader.replace("PERFORM id FROM public.calculator_catalog_admin WHERE calculator_key=p_engine AND slug=p_slug AND version=p_version AND lifecycle='published' FOR SHARE; RETURN FOUND;",'RETURN true;');assert.notEqual(reader,fixtureReader);
 const service=s=>db.sql('SET ROLE service_role;'+s);
 const submit=(id,engine,version=1,request=randomUUID())=>service(`SELECT public.submit_technology_five_job_v1('${key}','${hash}','${org}','${request}',${id},${version},'[{}]',${json([{index:0,ok:true,result:{catalogId:id,engineId:engine,version,output:{fixture:true}}}])},NULL);`).then(JSON.parse);
 await db.sql(fixtureReader);
 await db.sql(`INSERT INTO public.technology_five_embed_grants(id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at) VALUES('${grant}','${org}','${owner}','${key}','${hash}','https://customer.example',370,'technology.bandwidth',1,now(),now()+interval '1 hour');`);
 await service(`SELECT public.consume_technology_five_embed_v1('${grant}','${randomUUID()}','${hash}','${hash}');`);const retained=[...oldDefs[0].matchAll(/\((\d+),'(technology[^']+)','[^']+',(\d+)\)/g)];assert.equal(retained.length,18);for(const [,id,e,v] of retained)assert.equal((await submit(Number(id),e,Number(v))).status,'completed');
 for(const [id,e] of rows)await assert.rejects(submit(id,e),/publication unavailable/);
 await db.sql(reader);
 const snapshotQuery=`SELECT jsonb_build_object(${tables.map(t=>`${q(t)},(SELECT jsonb_agg(to_jsonb(x) ORDER BY to_jsonb(x)::text) FROM public.${t} x)`).join(',')})::text;`;
 const historical=await db.sql(snapshotQuery);const preRows=JSON.parse(historical);for(const value of Object.values(preRows))assert(value.length>0);pass('All original18 exact tuples pass protected jobs; old18 rejects new2 with nonempty historical jobs/grants/usage');
 await assert.rejects(db.sql(forward),/UNAPPLIED_FINAL_TWO_NATIVE_SUCCESSOR/);assert.equal(await db.sql(snapshotQuery),historical);
 await db.sql(`COMMENT ON FUNCTION ${signatures[0]} IS 'intentional non-source metadata does not change definition';`);
 const original=oldDefs[0];await db.sql(original.replace('BEGIN','BEGIN\n-- injected source drift'));
 await assert.rejects(db.sql(unhold(forward)),/Exact native schema preimage differs/);await db.sql(original);assert.equal(await db.sql(snapshotQuery),historical);pass('Injected function-source drift refuses adoption without changing seeded rows');
 await assert.rejects(db.sql('SET ROLE service_role;'+unhold(forward)),/Reviewed postgres operator/);assert.equal(await db.sql(fingerprintQuery),preHash);
 assert.equal(await db.sql("SELECT has_table_privilege('authenticated','public.technology_five_jobs','TRUNCATE');"),'f');
 await db.sql('GRANT TRUNCATE ON public.technology_five_jobs TO authenticated;');await assert.rejects(db.sql(unhold(forward)),/Exact native schema preimage differs/);await db.sql('REVOKE TRUNCATE ON public.technology_five_jobs FROM authenticated;');assert.equal(await db.sql(fingerprintQuery),preHash);await db.sql('GRANT INSERT(catalog_id) ON public.technology_five_jobs TO authenticated;');await assert.rejects(db.sql(unhold(forward)),/Exact native schema preimage differs/);await db.sql('REVOKE INSERT(catalog_id) ON public.technology_five_jobs FROM authenticated;');assert.equal(await db.sql(fingerprintQuery),preHash);pass('Wrong operator, table and column writer privilege drift refuse adoption before effects');
 await db.sql(unhold(forward).replace(/COMMIT;\n$/,'ROLLBACK;\n'));assert.equal(await db.sql(fingerprintQuery),preHash);assert.equal(await db.sql(snapshotQuery),historical);pass('Explicit forward transaction rollback restores exact metadata and nonempty historical bytes');
 await db.sql(unhold(forward));const postHash=await db.sql(fingerprintQuery),postShape=await db.sql(shapeQuery+'::text;');assert.notEqual(postHash,preHash);assert.equal(await db.sql(snapshotQuery),historical);
 await assert.rejects(db.sql(unhold(forward)),/Exact native schema preimage differs/);assert.equal(await db.sql(fingerprintQuery),postHash);pass('Held adoption preserves historical row bytes and refuses reapplication');
 const reverseBody=`DO $rows$ BEGIN IF EXISTS (SELECT 1 FROM public.technology_five_embed_grants WHERE catalog_id IN (368,376)) OR EXISTS (SELECT 1 FROM public.technology_five_embed_usage WHERE catalog_id IN (368,376)) OR EXISTS (SELECT 1 FROM public.technology_five_jobs WHERE catalog_id IN (368,376)) THEN RAISE EXCEPTION 'New-two durable rows prevent exact reverse; no audit deletion authorized'; END IF; END $rows$;\n`+tables.map(t=>`ALTER TABLE public.${t} DROP CONSTRAINT ${t}_exact_native_tuple_check;\n`+oldRaw.split('\n').find(l=>l.startsWith(`ALTER TABLE public.${t} ADD CONSTRAINT`))).join('\n')+'\n'+oldDefs.join(';\n')+';';
 const reverse=make('UNAPPLIED_FINAL_TWO_NATIVE_REVERSE',postHash,reverseBody);
 if(process.argv.includes('--capture'))await writeFile(reversePath,reverse);else assert.equal(await readFile(reversePath,'utf8'),reverse);
 await assert.rejects(db.sql(reverse),/UNAPPLIED_FINAL_TWO_NATIVE_REVERSE/);
 await db.sql(unhold(reverse));assert.equal(await db.sql(fingerprintQuery),preHash);assert.equal(await db.sql(snapshotQuery),historical);await assert.rejects(db.sql(unhold(reverse)),/Exact native schema preimage differs/);pass('Exact reverse restores source/constraint/ACL/RLS/trigger metadata and all nonempty historical bytes; reapply refuses');
 await db.sql(unhold(forward));assert.equal(await db.sql(fingerprintQuery),postHash);pass('Restored exact old18 schema permits repeat forward adoption');
 await db.sql(fixtureReader);
 for(const [id,e] of rows){const request=randomUUID();const [first,again]=await Promise.all([submit(id,e,1,request),submit(id,e,1,request)]);assert.equal(first.status,'completed');assert(first.duplicate||again.duplicate);assert.deepEqual(again.job,first.job);await assert.rejects(submit(id,e,2),/publication unavailable/);}
 for(const [id,e,v] of [[383,'technology.website-bandwidth',1],[368,'technology.screen-ppi',1],[440,'conversion.frequency',1],[376,'technology.ip-subnet',1]])await assert.rejects(submit(id,e,v),/publication unavailable|Exact engine differs/);
 for(const role of ['anon','authenticated'])await assert.rejects(db.sql(`SET ROLE ${role};SELECT public.technology_five_require_publication_v1(368,1);`),/permission denied/);
 await assert.rejects(service('INSERT INTO public.technology_five_jobs DEFAULT VALUES;'),/permission denied/);pass('Exact new2 jobs pass with duplicate stability; wrong identity/version, unrelated IDs and untrusted roles refuse');
 for(const [id,e] of rows){const g=randomUUID(),request=randomUUID();await service(`INSERT INTO public.technology_five_embed_grants(id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at) VALUES('${g}','${org}','${owner}','${key}','${hash}','https://customer.example',${id},'${e}',1,now(),now()+interval '1 hour');`);assert.equal(await service(`SELECT public.consume_technology_five_embed_v1('${g}','${request}','${hash}','${hash}');`),'accepted');assert.equal(await service(`SELECT public.consume_technology_five_embed_v1('${g}','${request}','${hash}','${hash}');`),'replayed');}
 pass('All new-two exact embed grants debit protected quotas and retain durable duplicate identity');
 await db.sql(reader);
 const nonempty=await db.sql(snapshotQuery);await assert.rejects(db.sql(reverse),/UNAPPLIED_FINAL_TWO_NATIVE_REVERSE/);await assert.rejects(db.sql(unhold(reverse)),/New-two durable rows prevent exact reverse/);assert.equal(await db.sql(snapshotQuery),nonempty);assert.equal(await db.sql(fingerprintQuery),postHash);pass('Reverse refuses new-two durable rows without deleting or mutating audit');
 const pre=JSON.parse(preShape),post=JSON.parse(postShape);for(const f of pre.functions){const changed=signatures.some(s=>s.replaceAll('public.','')===f.signature.replaceAll('public.',''));const after=post.functions.find(x=>x.signature===f.signature);assert(after);assert.equal(after.owner,f.owner);assert.equal(after.acl,f.acl);if(!changed)assert.equal(after.definition,f.definition);}
 for(const before of pre.tables){const after=post.tables.find(t=>t.name===before.name);assert(after);assert.deepEqual({...after,constraints:undefined},{...before,constraints:undefined});}
 pass('Every unchanged function and all table ownership/ACL/RLS/columns/indexes/policies/triggers retain exact metadata');
 await writeFile(dir+'/preimage.json',JSON.stringify({preHash,postHash,preimage:pre,postimage:post,sources},null,2)+'\n');
 await writeFile(dir+'/receipt.json',JSON.stringify({passed:true,kind:'FINAL_TWO_NATIVE_ISOLATED_SQL_MODEL_NOT_PRODUCTION',producerSHA256:sha(await readFile('tests/technology-final-two-20261111/native.postgres.mjs')),checks,preHash,postHash,historicalRowsSHA256:sha(historical),nonemptyHistoricalCounts:Object.fromEntries(Object.entries(preRows).map(([k,v])=>[k,v.length])),sources,successorSHA256:sha(forward),reverseSHA256:sha(reverse),productionWrites:false,sqlActivated:false,syntheticLowerPublication:true,fixtureOutputs:true,certificationGranted:false},null,2)+'\n');
}finally{await db?.close();}
