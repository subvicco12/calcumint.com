import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeTargetShape} from '../adoption1528/initializer.mjs';
import {snapshot,prepareApply,prepareRollback,bindExpectedPostimage} from '../adoption1528/bundle.mjs';
import {tables} from '../adoption1528/catalog.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGSERVICE','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector rejected: '+key);
assert.equal(process.argv.length,2,'No connection arguments accepted');
const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
const docker=(args,input)=>execFileSync('docker',['--host=unix:///var/run/docker.sock',...args],{env,input,encoding:'utf8',timeout:30000,maxBuffer:16*1024*1024,stdio:['pipe','pipe','pipe']});
const hash=x=>createHash('sha256').update(x).digest('hex');
const open=x=>x.replace(/^DO \$hold\$ BEGIN RAISE EXCEPTION '[^']+'; END \$hold\$;$/m,'-- isolated owned fixture only');
const checks=[],pass=x=>{checks.push(x);console.log('PASS '+x);};let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeTargetShape});
 const marker='fixture_identity_'+randomUUID().replaceAll('-','');await db.sql('CREATE SCHEMA '+marker);
 let container;
 try{const names=docker(['ps','--format','{{.Names}}']).trim().split('\n').filter(x=>/^calcumint-gotrue-[a-f0-9-]+-db$/.test(x));const matches=names.filter(n=>docker(['exec',n,'psql','-h','127.0.0.1','-U','postgres','-XAt','-c',"SELECT EXISTS(SELECT FROM pg_namespace WHERE nspname='"+marker+"')"]).trim()==='t');assert.equal(matches.length,1);container=matches[0];}finally{await db.sql('DROP SCHEMA '+marker);}
 const owner='11111111-1111-4111-8111-111111111111',calc='22222222-2222-4222-8222-222222222222';
 // Synthetic historical sentinel reconstruction, not an authorized lifecycle transition.
 await db.sql("INSERT INTO auth.users(id) VALUES('"+owner+"');BEGIN;SET LOCAL session_replication_role=replica;INSERT INTO public.calculator_catalog_admin(id,calculator_key,slug,title,category,created_by,lifecycle) VALUES('"+calc+"','fixture.recovery','fixture-recovery','Synthetic recovery sentinel','math','"+owner+"','published');INSERT INTO public.calculator_review_events(id,calculator_id,actor_id,event_type,from_state,to_state) VALUES(333,'"+calc+"','"+owner+"','fixture_recovery','certified','published');COMMIT;");
 const before=await snapshot(db.sql),core=await prepareApply(before);await db.sql(open(core.sql));const after=await snapshot(db.sql);const reverse=prepareRollback(before,after).sql;
 const rowsSQL='SELECT jsonb_build_array('+tables.map(t=>"(SELECT coalesce(jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text),'[]'::jsonb) FROM public."+t+" r)").join(',')+');';
 const expectedRows=await db.sql(rowsSQL);
 const schema=docker(['exec',container,'pg_dump','-h','127.0.0.1','-U','postgres','--section=pre-data','--no-comments','postgres']);
 const data=docker(['exec',container,'pg_dump','-h','127.0.0.1','-U','postgres','--data-only','--schema=public','postgres']);
 const post=docker(['exec',container,'pg_dump','-h','127.0.0.1','-U','postgres','--section=post-data','--no-comments','postgres']);
 const dump=schema+"\nINSERT INTO auth.users(id) VALUES('"+owner+"');\n"+data+"\n"+post;
 // No auth/session/token data or role passwords are dumped, logged or persisted.
 assert(!/COPY auth\./.test(dump));pass('Actual pg_dump schema and public synthetic data captured without auth data or role credentials');
 const target='recovery_'+randomUUID().replaceAll('-','');await db.sql('CREATE DATABASE '+target+' TEMPLATE template0;');
 const sql=q=>docker(['exec','-i',container,'psql','-h','127.0.0.1','-U','postgres','-d',target,'-XqAt','-v','ON_ERROR_STOP=1'],q).trim();
 try{
  assert.throws(()=>sql('BEGIN;'+dump+'\nSELECT 1/0;COMMIT;'),/failed/);
  assert.equal(sql("SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r';"),'0');
  pass('Injected late restore failure rolls back schema and data atomically in separate empty database');
  sql('BEGIN;'+dump+'\nCOMMIT;');
  assert.equal((await snapshot(async q=>sql(q))).sha256,after.sha256);assert.equal(sql(rowsSQL),expectedRows);
  assert.equal(sql("SELECT lifecycle FROM public.calculator_catalog_admin WHERE id='"+calc+"'"),'published');
  assert.equal(sql('SELECT count(*) FROM public.calculator_review_events'),'1');
  assert.throws(()=>sql("INSERT INTO public.admin_alerts(calculator_id,severity,alert_type,message) VALUES('99999999-9999-4999-8999-999999999999','info','fixture','invalid FK')"),/failed/);
  assert.throws(()=>sql('SET ROLE anon;SELECT count(*) FROM public.calculator_review_events;'),/permission denied/);
  pass('Actual restore preserves exact core metadata/ACL/RLS/constraints and all seven-table rows including publication/audit sentinel; FK and anonymous denial enforced');
  sql(open(reverse));assert.equal((await snapshot(async q=>sql(q))).sha256,before.sha256);assert.equal(sql(rowsSQL),expectedRows);
  sql(open(bindExpectedPostimage(core,after).sql));assert.equal((await snapshot(async q=>sql(q))).sha256,after.sha256);assert.equal(sql(rowsSQL),expectedRows);
  pass('Restored database supports exact reversal and reapplication while preserving committed publication/audit state');
 }finally{await db.sql('DROP DATABASE '+target+' WITH (FORCE);');}
 const report=resolve(process.env.OPERATIONS_REPORT||'/tmp/calcumint-operations-restore.json');await mkdir(dirname(report),{recursive:true});
 const sourceHashes={};for(const p of ['tests/execution-recovery-20261109/operations-restore.mjs','tests/adoption1528/initializer.mjs','tests/adoption1528/bundle.mjs'])sourceHashes[p]=hash(await readFile(p));
 await writeFile(report,JSON.stringify({passed:true,observedAt:new Date().toISOString(),checks,sourceHashes,dumpSha256:hash(dump),dumpPersisted:false,syntheticOnly:true,productionRestoreEstablished:false,productionWrites:false,corePreimage:before.sha256,corePostimage:after.sha256,provenance:db.provenance},null,2)+'\n');
}finally{await db?.close();}
