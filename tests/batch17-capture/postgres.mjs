import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {compare,reconcile} from './descriptor.mjs';
const start=new Date();let db;const artifacts=process.env.CAPTURE_ARTIFACTS||'/tmp/batch17-capture-pg';
await mkdir(artifacts,{recursive:true});
const query=await readFile(new URL('./export.sql',import.meta.url),'utf8');
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const capture=async()=>JSON.parse(await db.sql(query));
 const before=await capture();
 const baseline=reconcile(before,before);assert.equal(baseline.catalogMatches,true);assert.equal(baseline.equal,false);assert.deepEqual(baseline.blockedSections,['effectLedger','migrationLedger']);assert.throws(()=>compare(before,before),/Incomplete/);
 await db.sql('CREATE INDEX batch17_capture_known_mutation ON public.profiles (plan);');
 const after=await capture();const changed=reconcile(before,after);assert.equal(changed.equal,false);assert.deepEqual(changed.differentSections,['indexes']);
 await db.sql('DROP INDEX public.batch17_capture_known_mutation;');
 const restored=await capture();assert.equal(reconcile(before,restored).catalogMatches,true);
 await db.sql('GRANT SELECT(plan) ON public.profiles TO anon;');
 const columnChanged=reconcile(restored,await capture());assert.deepEqual(columnChanged.differentSections,['columns','effectiveColumnGrants']);await db.sql('REVOKE SELECT(plan) ON public.profiles FROM anon;');
 await db.sql('GRANT pg_monitor TO anon WITH INHERIT FALSE, SET FALSE;');const membershipBefore=await capture();await db.sql('GRANT pg_monitor TO anon WITH SET TRUE;');const membershipChanged=reconcile(membershipBefore,await capture());assert.deepEqual(membershipChanged.differentSections,['roleMemberships']);await db.sql('REVOKE pg_monitor FROM anon;');
 const schemaBefore=await capture();await db.sql('REVOKE USAGE ON SCHEMA auth FROM anon;');const schemaChanged=reconcile(schemaBefore,await capture());assert.deepEqual(schemaChanged.differentSections,['effectiveSchemaGrants','schemas']);await db.sql('GRANT USAGE ON SCHEMA auth TO anon;');
 const sequenceBefore=await capture();await db.sql('GRANT USAGE ON SEQUENCE auth.refresh_tokens_id_seq TO anon;');const sequenceChanged=reconcile(sequenceBefore,await capture());assert.deepEqual(sequenceChanged.differentSections,['sequences','effectiveSequenceGrants']);await db.sql('REVOKE USAGE ON SEQUENCE auth.refresh_tokens_id_seq FROM anon;');
 await db.sql('CREATE VIEW public.batch17_unsupported_view AS SELECT 1 AS value;');const unsupported=await capture();assert(unsupported.sections.unsupportedObjects.rows.some(r=>r.id==='relation:public.batch17_unsupported_view'));assert.throws(()=>reconcile(unsupported,unsupported),/Incomplete/);await db.sql('DROP VIEW public.batch17_unsupported_view;');
 await Promise.all([['before.json',before],['after.json',after],['restored.json',restored]].map(([name,value])=>writeFile(artifacts+'/'+name,JSON.stringify(value,null,2)+'\n')));
 const counts=Object.fromEntries(Object.entries(before.sections).map(([s,v])=>[s,v.count]));
 await db.close();db=null;
 const end=new Date();const receipt={task:'DB-FULL-CAPTURE-TOOLING',startUTC:start.toISOString(),endUTC:end.toISOString(),elapsedSeconds:(end-start)/1000,scope:'Genuine local PostgreSQL17.6, GoTrue75-migration full repository model; metadata SELECT only; explicit isolated index mutation/restoration, column ACL grant/revoke PG17 membership SET permission change/revoke, schema/sequence USAGE drift and unsupported-view rejection',counts,baseline,changed,columnChanged,membershipChanged,schemaChanged,sequenceChanged,unsupportedPresentBlocked:true,cleanup:'fixture close completed',hostedCaptureAvailable:false,adoptionAuthorized:false};
 await writeFile(artifacts+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}finally{if(db)await db.close();}
