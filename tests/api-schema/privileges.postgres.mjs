// Disposable PostgreSQL only; no production URL, no host ports, internal network.
import assert from 'node:assert/strict';
import { verifyHelperCompatibility } from './helper-compat.mjs';
import { validateCatalog, verifyDriftDetection } from '../api-schema/validate.mjs';
import { bootstrapSchema, member, verifyDefiners } from '../api-schema/bootstrap.mjs';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const name=`calcumint-embed-test-${randomUUID()}`,network=`${name}-network`;
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const c=spawn('docker',args,{stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';c.stdout.on('data',v=>out+=v);c.stderr.on('data',v=>err+=v);c.on('error',reject);c.on('close',n=>n===0?resolve(out.trim()):reject(new Error(err||out)));c.stdin.on('error',reject);c.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',config='00000000-0000-4000-8000-000000000003';
const quote=v=>`'${JSON.stringify(v).replaceAll("'","''")}'::jsonb`;
let created=false,net=false;
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
 const definition={name:'Synthetic',fields:[{key:'x',label:'Value',type:'number'}],outputs:[{key:'answer',label:'Answer',formula:'x*2'}]};
 await sql(`INSERT INTO public.custom_calculator_versions(calculator_id,version,definition,created_by) VALUES('${a}',1,${quote(definition)},'${a}');INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,monthly_quota,rate_limit_per_minute,created_by,scopes) VALUES('${b}','${a}','Synthetic','test','synthetic-hash',10,10,'${a}','["calculations:batch"]');INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,created_by) VALUES('${config}','${a}','${a}','synthetic_public_key_123456','Synthetic',true,'Synthetic consent','${a}');`);
 await verifyDefiners(sql,['submit_verified_batch_job_v1','read_verified_batch_job_v1','capture_verified_embed_lead_v1']);
 const submit=id=>`SET ROLE service_role;SELECT public.submit_verified_batch_job_v1('${b}','synthetic-hash','${a}','${id}','${a}','[{"x":3}]',1,${quote(definition)},'[{"index":0,"ok":true,"output":{"answer":6}}]');`;
 const recover=id=>`SET ROLE service_role;SELECT public.read_verified_batch_job_v1('${b}','synthetic-hash','${a}','${id}');`;
 const batchState=()=>sql('SELECT jsonb_build_array((SELECT count(*) FROM public.batch_calculation_jobs),(SELECT count(*) FROM public.batch_request_receipts),(SELECT count(*) FROM public.api_usage_events));');
 const batchId=randomUUID(),first=JSON.parse(await sql(submit(batchId)));
 assert.equal(first.status,'completed');assert.equal(first.duplicate,false);
 assert.equal(JSON.parse(await sql(recover(batchId))).job.id,first.job.id);assert.equal(await batchState(),'[1, 1, 1]');
 const duplicate=JSON.parse(await sql(submit(batchId)));assert.equal(duplicate.duplicate,true);assert.equal(duplicate.job.id,first.job.id);assert.equal(await batchState(),'[1, 1, 2]');
 const payload={consentText:'Synthetic consent',privacyUrl:null,name:'Synthetic',email:'synthetic@example.invalid',consented:true,input:{x:1},output:{answer:2}};
 const capture=(id,org=a)=>`SET ROLE service_role;SELECT public.capture_verified_embed_lead_v1('synthetic_public_key_123456','${config}','${org}','${a}',1,(extract(epoch FROM now())*1000+300000)::bigint,'${id}',${quote(payload)});`;
 const embedState=()=>sql('SELECT jsonb_build_array((SELECT count(*) FROM public.embed_leads),(SELECT count(*) FROM public.lead_consents),(SELECT count(*) FROM public.embed_lead_receipts));');
 const embedId=randomUUID();assert.equal(JSON.parse(await sql(capture(embedId))).status,'created');assert.equal(JSON.parse(await sql(capture(embedId))).status,'duplicate');assert.equal(await embedState(),'[1, 1, 1]');
 await assert.rejects(sql(capture(randomUUID(),b)));assert.equal(await embedState(),'[1, 1, 1]');
 for(const role of ['anon','authenticated'])for(const call of [submit(randomUUID()),recover(batchId),capture(randomUUID())])await assert.rejects(sql(call.replace('SET ROLE service_role',`SET ROLE ${role}`)),/permission denied/);
 await assert.rejects(sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';SELECT count(*) FROM public.batch_calculation_jobs;`),/permission denied for function is_org_member/);
 console.log('PASS reproduced whole 013 missing authenticated helper EXECUTE: owner RLS SELECT blocked');
 const helperProposal=await readFile('docs/architecture/proposals/API-RLS-HELPER-EXECUTE.sql','utf8');
 const helperGuard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated helper acceptance and owner authorization required'; END $$;";
 assert.equal(helperProposal.split(helperGuard).length,2);await assert.rejects(sql(helperProposal),/PROPOSAL ONLY/);
 await assert.rejects(sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';SELECT count(*) FROM public.batch_calculation_jobs;`),/permission denied for function is_org_member/);
 await sql(helperProposal.replace(helperGuard,''));
 for(const fn of [`is_org_member('${a}')`,`has_org_role('${a}',ARRAY['owner'])`,`org_role('${a}')`])await assert.rejects(sql(`SET ROLE anon;SELECT public.${fn};`),/permission denied/);
 await assert.rejects(sql(`SET ROLE authenticated;SELECT public.org_role('${a}');`),/permission denied/);
 for(const [user,expected] of [[a,'t'],[member,'f'],[b,'f']])assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${user}';SELECT public.has_org_role('${a}',ARRAY['owner','admin']);`),expected);
 for(const [user,expected] of [[a,'1'],[member,'1'],[b,'0']])for(const table of ['batch_calculation_jobs','embed_leads','lead_consents'])assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${user}';SELECT count(*) FROM public.${table};`),expected);
 await verifyHelperCompatibility(sql,{a,b,member,config,proposal:helperProposal,serviceRead:async()=>assert.equal(JSON.parse(await sql(recover(batchId))).job.id,first.job.id)});
 await sql("CREATE FUNCTION public.privilege_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic late fault';END $$;");
 for(const [table,call,state,expected] of [['batch_request_receipts',()=>submit(randomUUID()),batchState,'[1, 1, 2]'],['embed_lead_receipts',()=>capture(randomUUID()),embedState,'[1, 1, 1]']]){
 await sql(`CREATE TRIGGER privilege_failure AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.privilege_failure();`);try{await assert.rejects(sql(call()),/synthetic late fault/);assert.equal(await state(),expected);}finally{await sql(`DROP TRIGGER privilege_failure ON public.${table};`);}}
 await sql('DROP FUNCTION public.privilege_failure();');
 console.log('PASS after 038: service batch submit/recover/duplicate quota, embed capture/duplicate, client execute denial, owner/outsider RLS, late receipt rollback');
 // Membership proposal acceptance uses its own disposable database so its triggers
 // cannot influence this catalog fixture. Keep this lane on the native CI command.
 await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['tests/api-schema/membership.postgres.mjs'],{stdio:'inherit',timeout:120000});
  child.on('error',reject);child.on('close',code=>code===0?resolve():reject(new Error(`Membership acceptance exited ${code}`)));
 });
 const catalog=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));validateCatalog(catalog);verifyDriftDetection(catalog,'both');
 for(const privilege of ['TRUNCATE','TRIGGER','REFERENCES']){await sql(`GRANT ${privilege} ON public.profiles TO authenticated;`);const drift=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));assert.throws(()=>validateCatalog(drift),/prohibited/);await sql(`REVOKE ${privilege} ON public.profiles FROM authenticated;`);}
 await sql('GRANT CREATE ON SCHEMA public TO anon;');const schemaDrift=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));assert.throws(()=>validateCatalog(schemaDrift),/schema CREATE/);await sql('REVOKE CREATE ON SCHEMA public FROM anon;');
 console.log('PASS catalog v2 actual PostgreSQL, all three guarded API proposals after whole 038');
 console.log('PASS real inherited TRUNCATE bypass, 038 guard rejection, column update allowlist');
} finally {if(created)await cmd(['rm','-f',name]);if(net)await cmd(['network','rm',network]);}
