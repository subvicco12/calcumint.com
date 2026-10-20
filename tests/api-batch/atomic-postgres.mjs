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
 await sql(`INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,created_by) VALUES('${config}','${a}','${a}','synthetic_public_key_123456','Synthetic',true,'Synthetic consent','${a}');`);
 await sql(`INSERT INTO public.business_webhook_endpoints(organization_id,name,endpoint_url,secret_ciphertext,event_types,created_by) VALUES('${a}','Synthetic','https://example.invalid/hook','synthetic-not-a-secret','["lead.created"]','${a}');`);
 const definition={name:'Synthetic',fields:[{key:'x',label:'Value',type:'number'}],outputs:[{key:'answer',label:'Answer',formula:'x*2'}]};
 await sql(`INSERT INTO public.custom_calculator_versions(calculator_id,version,definition,created_by) VALUES('${a}',1,${quote(definition)},'${a}');INSERT INTO public.business_api_keys(id,organization_id,name,key_prefix,key_hash,monthly_quota,rate_limit_per_minute,created_by,scopes) VALUES('${b}','${a}','Synthetic','test','synthetic-hash',10,10,'${a}','["calculations:batch"]');`);
 const quotaProposal=await readFile('docs/architecture/proposals/ATOMIC-API-QUOTA.sql','utf8');
 const quotaGuard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated quota acceptance and owner authorization required'; END $$;";
 assert.equal(quotaProposal.split(quotaGuard).length,2);await sql(quotaProposal.replace(quotaGuard,''));
 const proposal=await readFile('docs/architecture/proposals/ATOMIC-BATCH-JOB.sql','utf8');const guard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated batch acceptance and owner authorization required'; END $$;";
 assert.equal(proposal.split(guard).length,2);await assert.rejects(sql(proposal),/PROPOSAL ONLY/);await sql(proposal.replace(guard,''));
 await verifyDefiners(sql,['submit_verified_batch_job_v1','read_verified_batch_job_v1']);
 const catalog=JSON.parse(await sql(await readFile('tests/api-schema/catalog.sql','utf8')));
 validateCatalog(catalog,{lane:'batch'});
 verifyDriftDetection(catalog,'batch');
 console.log('PASS sanitized catalog contract and required-evidence drift rejections');
 const rows=[{x:3}],outputs=[{index:0,ok:true,output:{answer:6}}];
 const submit=(id,{input=rows,output=outputs,version=1,org=a,hash='synthetic-hash',def=definition}={})=>`SET ROLE service_role;SELECT public.submit_verified_batch_job_v1('${b}','${hash}','${org}','${id}','${a}',${quote(input)},${version===null?'NULL':version},${def===null?'NULL':quote(def)},${output===null?'NULL':quote(output)});`;
 const recover=id=>`SET ROLE service_role;SELECT public.read_verified_batch_job_v1('${b}','synthetic-hash','${a}','${id}');`;
 const snapshot=()=>sql("SELECT jsonb_build_array((SELECT count(*) FROM public.batch_calculation_jobs),(SELECT count(*) FROM public.batch_request_receipts),(SELECT count(*) FROM public.api_usage_events));");
 const clear=async()=>{await sql("TRUNCATE public.batch_request_receipts,public.batch_calculation_jobs,public.api_usage_events;UPDATE public.business_api_keys SET monthly_quota=10,rate_limit_per_minute=10,status='active',scopes='[\"calculations:batch\"]';UPDATE public.profiles SET plan='business';UPDATE public.custom_calculators SET status='published',published_version=1;");};
 const check=async(label,fn)=>{await clear();await fn();count++;console.log(`PASS ${label}`);};
 await check('missing probe is read-only and new job plus request debit persist together',async()=>{const id=randomUUID();assert.equal(JSON.parse(await sql(submit(id,{version:null,def:null,output:null}))).status,'missing');assert.equal(await snapshot(),'[0, 0, 0]');const reply=JSON.parse(await sql(submit(id)));assert.equal(reply.status,'completed');assert.notEqual(reply.job.id,id);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('concurrent identical retries share one job and retain per-POST request charging',async()=>{const id=randomUUID();const replies=await Promise.all([sql(submit(id)),sql(submit(id))]);assert.deepEqual(replies.map(r=>JSON.parse(r).duplicate).sort(),[false,true]);assert.equal(JSON.parse(replies[0]).job.id,JSON.parse(replies[1]).job.id);assert.equal(await snapshot(),'[1, 1, 2]');});
 await check('conflicting concurrent payload is rejected without an extra debit',async()=>{const id=randomUUID();const replies=await Promise.allSettled([sql(submit(id)),sql(submit(id,{input:[{x:9}]}))]);assert.equal(replies.filter(r=>r.status==='fulfilled').length,1);assert.match(replies.find(r=>r.status==='rejected').reason.message,/Conflicting batch request/);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('quota boundary serializes distinct jobs and preserves no partial debit/job',async()=>{await sql('UPDATE public.business_api_keys SET monthly_quota=1;');const replies=await Promise.allSettled([sql(submit(randomUUID())),sql(submit(randomUUID()))]);assert.equal(replies.filter(r=>r.status==='fulfilled').length,1);assert.match(replies.find(r=>r.status==='rejected').reason.message,/quota exceeded/);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('minute quota independently serializes concurrent new jobs',async()=>{await sql('UPDATE public.business_api_keys SET monthly_quota=10,rate_limit_per_minute=1;');const replies=await Promise.allSettled([sql(submit(randomUUID())),sql(submit(randomUUID()))]);assert.equal(replies.filter(r=>r.status==='fulfilled').length,1);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('legacy metering and new batch share the key lock at the quota boundary',async()=>{await sql('UPDATE public.business_api_keys SET monthly_quota=1;');const replies=await Promise.allSettled([sql(`SET ROLE service_role;SELECT public.consume_business_api_quota('${b}');`),sql(submit(randomUUID()))]);const legacy=replies[0],batch=replies[1];assert.equal(await sql('SELECT sum(units) FROM public.api_usage_events;'),'1');if(batch.status==='fulfilled'){assert.equal(legacy.status,'fulfilled');assert.equal(legacy.value,'f');assert.equal(await snapshot(),'[1, 1, 1]');}else{assert.equal(legacy.status,'fulfilled');assert.equal(legacy.value,'t');assert.match(batch.reason.message,/quota exceeded/);assert.equal(await snapshot(),'[0, 0, 1]');}});
 await check('lost commit reply recovers read-only at exhausted quota and retains historical version',async()=>{const id=randomUUID();await sql('UPDATE public.business_api_keys SET monthly_quota=1;');await sql(submit(id));await sql("UPDATE public.custom_calculators SET status='draft',published_version=2;");assert.equal(JSON.parse(await sql(recover(id))).job.calculator_version,1);assert.equal(await snapshot(),'[1, 1, 1]');await assert.rejects(sql(submit(id,{version:null,def:null,output:null})),/quota exceeded/);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('definition, publication and owner changes cannot create a new job',async()=>{for(const options of [{org:b},{hash:'other'},{version:2},{def:{...definition,name:'changed'}},{output:[{}]},{output:[{index:3,ok:true,output:{answer:6}}]}])await assert.rejects(sql(submit(randomUUID(),options)));await sql("UPDATE public.custom_calculators SET status='draft';");await assert.rejects(sql(submit(randomUUID())));assert.equal(await snapshot(),'[0, 0, 0]');});
 await check('job/receipt/usage late failures roll back all persistence and explicit retry succeeds',async()=>{await sql("CREATE FUNCTION public.batch_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic batch failure';END $$;");for(const table of ['batch_calculation_jobs','batch_request_receipts','api_usage_events']){await sql(`CREATE TRIGGER batch_failure AFTER INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.batch_failure();`);const id=randomUUID();try{await assert.rejects(sql(submit(id)),/synthetic batch failure/);assert.equal(await snapshot(),'[0, 0, 0]');}finally{await sql(`DROP TRIGGER batch_failure ON public.${table};`);}assert.equal(JSON.parse(await sql(submit(id))).status,'completed');await clear();}await sql('DROP FUNCTION public.batch_failure();');});
 await check('revoked key, removed scope and non-Business owner fail closed',async()=>{const id=randomUUID();await sql(submit(id));for(const mutation of ["UPDATE public.business_api_keys SET status='revoked';","UPDATE public.business_api_keys SET scopes='[]';","UPDATE public.profiles SET plan='free';"]){await sql(mutation);await assert.rejects(sql(recover(id)),/authority unavailable/);await assert.rejects(sql(submit(id,{version:null,def:null,output:null})),/authority unavailable/);await sql("UPDATE public.business_api_keys SET status='active',scopes='[\"calculations:batch\"]';UPDATE public.profiles SET plan='business';");}});
 await check('client role permissions and unsupported isolation reject before writes',async()=>{for(const role of ['anon','authenticated']){await assert.rejects(sql(submit(randomUUID()).replace('SET ROLE service_role',`SET ROLE ${role}`)),/permission denied/);await assert.rejects(sql(`SET ROLE ${role};SELECT * FROM public.batch_request_receipts;`),/permission denied/);}for(const level of ['REPEATABLE READ','SERIALIZABLE'])await assert.rejects(sql(`BEGIN ISOLATION LEVEL ${level};${submit(randomUUID())}COMMIT;`),/requires READ COMMITTED/);assert.equal(await snapshot(),'[0, 0, 0]');});
 await check('tampered receipt payload cannot rebind an immutable job to different inputs',async()=>{const id=randomUUID();await sql(submit(id));await sql(`UPDATE public.batch_request_receipts SET payload=${quote({calculator_id:a,input_rows:[{x:99}]})};`);await assert.rejects(sql(recover(id)),/changed batch evidence/);await assert.rejects(sql(submit(id,{input:[{x:99}],version:null,def:null,output:null})),/changed batch evidence/);assert.equal(await snapshot(),'[1, 1, 1]');});
 await check('tampered immutable job snapshot is not accepted and timezones do not break recovery',async()=>{const id=randomUUID();await sql(submit(id));assert.equal(JSON.parse(await sql("SET timezone='Asia/Kolkata';"+recover(id))).status,'completed');await sql("UPDATE public.batch_calculation_jobs SET output_rows='[]';");await assert.rejects(sql(recover(id)),/changed batch evidence/);});
 await check('real membership isolates durable jobs across organizations',async()=>{
  await sql(submit(randomUUID()));
  for(const [user,expected] of [[a,'1'],[member,'1'],[b,'0']])assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${user}';SELECT count(*) FROM public.batch_calculation_jobs;`),expected);
  await sql(`DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';`);
  try {assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${member}';SELECT count(*) FROM public.batch_calculation_jobs;`),'0');}
  finally {await sql(`INSERT INTO public.organization_members VALUES('${a}','${member}','member',now());`);}
  await assert.rejects(sql('SET ROLE anon;SELECT * FROM public.batch_calculation_jobs;'),/permission denied/);
 });
 await check('concurrent owner plan downgrade is observed after row lock waits',async()=>{
  await committedMutation(sql,`UPDATE public.profiles SET plan='free' WHERE id='${a}'`,async()=>{
   await assert.rejects(sql(submit(randomUUID())),/authority unavailable/);
  });assert.equal(await snapshot(),'[0, 0, 0]');
 });
 await check('concurrent calculator tenant transfer rejects original binding after lock wait',async()=>{
  try {await committedMutation(sql,`UPDATE public.custom_calculators SET organization_id='${b}' WHERE id='${a}'`,async()=>{
   await assert.rejects(sql(submit(randomUUID())),/Published batch version changed/);
  });assert.equal(await snapshot(),'[0, 0, 0]');}
  finally {await sql(`UPDATE public.custom_calculators SET organization_id='${a}' WHERE id='${a}';`);}
 });
 if(process.argv.includes('--http')){const {verifyHttp}=await import('./http-contract.mjs');await verifyHttp({cmd,sql,name,network,clear,snapshot,a,b,definition});}
 console.log(`${count} durable atomic batch PostgreSQL cases passed; proposals remain unapplied outside fixture.`);

} finally {try{if(created)await cmd(['rm','-f',name]);}finally{if(net)await cmd(['network','rm',network]);}}
