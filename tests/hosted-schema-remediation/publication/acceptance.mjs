import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import path from 'node:path';
const image='postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94';
const env={...process.env};for(const key of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[key];
const docker=(args,input='')=>new Promise((resolve,reject)=>{const p=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';p.stdout.on('data',v=>out+=v);p.stderr.on('data',v=>err+=v);p.on('error',reject);p.on('close',code=>code===0?resolve(out.trim()):reject(Error(err||out)));p.stdin.on('error',reject);p.stdin.end(input);});
const name='calcumint-date-'+randomUUID(),checks=[],start=new Date();let running=false;
const sql=q=>docker(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
const read=file=>readFile(new URL(file,import.meta.url),'utf8');
const original=await read('captured-function.sql'),proposal=await read('review-only-correction.sql'),manifest=JSON.parse(await read('manifest.json'));
const sha=x=>createHash('sha256').update(x).digest('hex');
assert.equal(sha(original),manifest.beforeSha256);
const localOnly=proposal.replace("DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_HOSTED_DATE_REPAIR: review only'; END $unapplied$;",'-- Guard removed only in disposable acceptance.');
assert.notEqual(localOnly,proposal);
const pass=x=>{checks.push(x);console.log('PASS '+x);};
const id='00000000-0000-4000-8000-000000000001';
const literal=x=>"'"+JSON.stringify(x).replaceAll("'","''")+"'::jsonb";
const base={jurisdiction:{country:'GB'},ruleVersion:'synthetic-fixture-only',effectiveFrom:'2024-02-29',lastVerifiedAt:'2026-11-01',officialSources:[{label:'Synthetic test source',url:'https://example.invalid/source'}]};
const metadata=async(rule=base)=>sql(`UPDATE public.calculator_catalog_admin SET metadata=${literal({rulePackRequired:true,ruleMetadata:[rule]})};`);
const result=async()=>JSON.parse(await sql(`SELECT row_to_json(r) FROM public.validate_calculator_publish_gate('${id}') r;`));
try {
 await docker(['run','-d','--rm','--pull=never','--network','none','--name',name,'--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);running=true;
 const deadline=Date.now()+30000;for(;;){try{await sql('SELECT 1;');break;}catch(e){if(Date.now()>deadline)throw e;await new Promise(r=>setTimeout(r,100));}}
 assert.match(await sql('SHOW server_version;'),/^17\.6/);
 await sql(`CREATE SCHEMA auth; CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
 CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT coalesce(nullif(current_setting('fixture.role',true),''),'service_role') $$;
 CREATE FUNCTION public.is_platform_admin() RETURNS boolean LANGUAGE sql AS $$ SELECT false $$;
 CREATE TABLE public.calculator_catalog_admin(id uuid PRIMARY KEY, metadata jsonb, risk_class text, reviewer_id uuid);
 CREATE TABLE public.calculator_source_evidence(calculator_id uuid);
 CREATE TABLE public.platform_admins(user_id uuid,active boolean,role text);
 CREATE TABLE public.calculator_qa_checks(calculator_id uuid,check_type text,status text);
 INSERT INTO public.calculator_catalog_admin VALUES('${id}','{}','general',NULL);
 INSERT INTO public.calculator_source_evidence VALUES('${id}');`);
 await sql(original+';');
 assert.equal(await sql("SELECT encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex');"),manifest.beforeSha256);
 await metadata();
 const before=await result();assert.equal(before.ok,false);assert(before.failures.includes('Regulatory rule metadata is incomplete'));pass('Exact captured function rejects valid leap-day/ISO metadata before correction');
 await assert.rejects(sql(proposal),/UNAPPLIED_HOSTED_DATE_REPAIR/);pass('Proposal abort guard prevents installation');
 await sql('\\set ON_ERROR_STOP off\n'+proposal);
 assert.equal(await sql("SELECT encode(sha256(convert_to(pg_get_functiondef('public.validate_calculator_publish_gate(uuid)'::regprocedure),'UTF8')),'hex');"),manifest.beforeSha256);
 pass('Guard inside transaction also prevents installation when SQL client continues after errors');
 await sql("REVOKE ALL ON FUNCTION public.validate_calculator_publish_gate(uuid) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.validate_calculator_publish_gate(uuid) TO service_role;");
 const identityQuery="SELECT json_build_object('owner',proowner,'acl',proacl,'definer',prosecdef,'config',proconfig)::text FROM pg_proc WHERE oid='public.validate_calculator_publish_gate(uuid)'::regprocedure;";
 const identity=await sql(identityQuery);
 await sql(localOnly);assert.equal(await sql(identityQuery),identity);pass('Only date literals and optional NULL check change; owner, SECURITY DEFINER, search_path and ACL preserved');
 await assert.rejects(sql(localOnly),/source hash mismatch/);pass('Exact source hash rejects reapplication or changed predecessor');
 const after=await result();assert.equal(after.ok,false);assert(!after.failures.some(x=>/Regulatory/.test(x)));assert(after.failures.includes('engine-tests must pass'));pass('Valid dates no longer fail metadata, while missing QA remains blocked');
 const required=['engine-tests','formula-review','sources','methodology','reverse-solve','visualization-reconciliation','schedule-reconciliation','scenario-reconciliation','sensitivity-validation','entitlement-validation','ux-responsive','performance','security','seo-content','accessibility','rule-pack-validation'];
 await sql(`INSERT INTO public.calculator_qa_checks SELECT '${id}',x,'passed' FROM unnest(ARRAY[${required.map(x=>"'"+x+"'").join(',')}]) x;`);
 assert.equal((await result()).ok,true);pass('Synthetic complete positive fixture passes predicate only, without lifecycle transition');
 for(const field of ['effectiveFrom','lastVerifiedAt'])for(const value of [null,'','2023-02-29','2024-02-30','2026-13-01','2026-1-01','2026-11-01x',' 2026-11-01','２０２６-１１-０１']){await metadata({...base,[field]:value});assert.equal((await result()).ok,false,field+':'+value);}
 pass('Both required dates reject null, malformed, impossible, nonpadded and non-ASCII dates');
 for(const value of ['2024-02-28','2024-02-30','2026-13-01','2026-1-01',null,'']){await metadata({...base,effectiveTo:value});assert.equal((await result()).ok,false,String(value));}
 for(const value of ['2024-02-29','2026-12-31']){await metadata({...base,effectiveTo:value});assert.equal((await result()).ok,true);}
 pass('Optional effectiveTo accepts equal/later real dates and rejects reversed, null and invalid periods');
 for(const rule of [{...base,officialSources:[]},{...base,officialSources:[{label:'',url:'x'}]},{...base,jurisdiction:{}},{...base,ruleVersion:''}]){await metadata(rule);assert.equal((await result()).ok,false);}
 pass('Source labels, source presence, jurisdiction and version requirements remain fail-closed');
 await metadata();await sql("UPDATE public.calculator_catalog_admin SET risk_class='health';");assert((await result()).failures.includes('Active review-capable YMYL reviewer is required'));pass('Qualified reviewer gate remains blocked without synthetic reviewer');
 await sql(`DELETE FROM public.calculator_source_evidence;`);assert((await result()).failures.includes('At least one reviewed source evidence record is required'));pass('Independent source evidence gate remains blocked');
 await assert.rejects(sql(`SET fixture.role='authenticated'; SELECT * FROM public.validate_calculator_publish_gate('${id}');`),/Platform admin required/);pass('Nonadmin authorization remains blocked');
 const receipt={scope:'Sanitized PostgreSQL17.6 fixture; exact captured publication function, minimal dependency tables and explicit auth stub; NOT GoTrue/provider, lifecycle certification or production acceptance',startUTC:start.toISOString(),endUTC:new Date().toISOString(),image,manifest,checks,productionChanges:false,activationAuthorized:false};
 if(process.env.PUBLICATION_ARTIFACTS){const out=path.resolve(process.env.PUBLICATION_ARTIFACTS);assert(!out.startsWith(path.resolve(new URL('../../../',import.meta.url).pathname)+path.sep),'Artifacts must be outside repository');await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');}
 console.log(JSON.stringify(receipt,null,2));
}finally{if(running)await docker(['rm','-f',name]);}
