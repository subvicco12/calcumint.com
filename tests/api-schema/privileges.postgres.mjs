// Disposable PostgreSQL only; no production URL, no host ports, internal network.
import assert from 'node:assert/strict';
import { validateCatalog, verifyDriftDetection } from '../api-schema/validate.mjs';
import { bootstrapSchema, member, committedMutation, verifyDefiners } from '../api-schema/bootstrap.mjs';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const name=`calcumint-embed-test-${randomUUID()}`,network=`${name}-network`;
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const c=spawn('docker',args,{stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';c.stdout.on('data',v=>out+=v);c.stderr.on('data',v=>err+=v);c.on('error',reject);c.on('close',n=>n===0?resolve(out.trim()):reject(new Error(err||out)));c.stdin.on('error',reject);c.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',config='00000000-0000-4000-8000-000000000003';
const quote=v=>`'${JSON.stringify(v).replaceAll("'","''")}'::jsonb`;
let created=false,net=false,count=0;
try {
 await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--name',name,'--network',network,'--label','calcumint.embed-fixture=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let n=0;;n++){try{await sql('SELECT 1;');break;}catch(e){if(n>=60)throw e;await new Promise(r=>setTimeout(r,250));}}
 await bootstrapSchema(sql,{a,b});
 for(const migration of ['002_b4_billing','007_b9_ai','008_b10_admin_factory','008b_b10_alert_automation','013_production_rpc_privilege_hardening_v2','035_split_overlapping_write_policies'])await sql(await readFile(`supabase/migrations/${migration}.sql`,'utf8'));
 console.log('PASS whole later dependencies 002/007/008/008b/013/035');
 const hardening=await readFile('supabase/migrations/038_client_account_billing_privileges.sql','utf8');
 await sql(`CREATE ROLE inherited_client;GRANT inherited_client TO authenticated;GRANT TRUNCATE ON public.profiles TO inherited_client;`);
 await assert.rejects(sql(hardening),/Unexpected inherited client privileges/);
 assert.equal(await sql(`BEGIN;SET ROLE authenticated;TRUNCATE public.profiles CASCADE;ROLLBACK;SELECT count(*) FROM public.profiles;`),'3');
 await sql('REVOKE inherited_client FROM authenticated;REVOKE ALL ON public.profiles FROM inherited_client;DROP ROLE inherited_client;');
 await sql('GRANT UPDATE(plan),REFERENCES(id) ON public.profiles TO authenticated;GRANT SELECT(display_name) ON public.profiles TO anon;GRANT TRIGGER,TRUNCATE ON public.profiles TO authenticated;');
 await sql(hardening);
 await assert.rejects(sql(`SET ROLE authenticated;TRUNCATE public.profiles CASCADE;`),/permission denied/);
 await assert.rejects(sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';UPDATE public.profiles SET plan='free';`),/permission denied/);
 assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';UPDATE public.profiles SET display_name='Reviewed' WHERE id='${a}';SELECT display_name FROM public.profiles WHERE id='${a}';`),'Reviewed');
 for(const [file,message] of [['ATOMIC-API-QUOTA','isolated quota acceptance'],['ATOMIC-BATCH-JOB','isolated batch acceptance'],['ATOMIC-EMBED-LEAD-CONSENT','isolated acceptance']]){
 const proposal=await readFile(`docs/architecture/proposals/${file}.sql`,'utf8');const guard=`DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: ${message} and owner authorization required'; END $$;`;assert.equal(proposal.split(guard).length,2);await assert.rejects(sql(proposal),/PROPOSAL ONLY/);await sql(proposal.replace(guard,''));}
 const catalog=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));validateCatalog(catalog);verifyDriftDetection(catalog,'both');
 for(const privilege of ['TRUNCATE','TRIGGER','REFERENCES']){await sql(`GRANT ${privilege} ON public.profiles TO authenticated;`);const drift=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));assert.throws(()=>validateCatalog(drift),/prohibited/);await sql(`REVOKE ${privilege} ON public.profiles FROM authenticated;`);}
 await sql('GRANT CREATE ON SCHEMA public TO anon;');const schemaDrift=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));assert.throws(()=>validateCatalog(schemaDrift),/schema CREATE/);await sql('REVOKE CREATE ON SCHEMA public FROM anon;');
 console.log('PASS catalog v2 actual PostgreSQL, all three guarded API proposals after whole 038');
 console.log('PASS real inherited TRUNCATE bypass, 038 guard rejection, column update allowlist');
} finally {if(created)await cmd(['rm','-f',name]);if(net)await cmd(['network','rm',network]);}
