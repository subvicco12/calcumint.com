// Disposable PostgreSQL acceptance: repo migrations unchanged, synthetic engine inputs only.
// Models Supabase auth.uid() and platform grants; does not attest deployed auth/RLS.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const name=`calcumint-draft-persistence-${randomUUID()}`,network=`${name}-network`;
const env={...process.env};for(const key of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[key];
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const child=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';child.stdout.on('data',v=>out+=v);child.stderr.on('data',v=>err+=v);child.on('error',reject);child.on('close',code=>code===0?resolve(out.trim()):reject(new Error(err||out)));child.stdin.on('error',reject);child.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','--set=VERBOSITY=verbose','-v','ON_ERROR_STOP=1'],q);
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
const owner=(id,q)=>`SET ROLE authenticated;SET request.jwt.claim.sub='${id}';${q}`;
const literal=s=>`'${s.replaceAll("'","''")}'`,json=v=>`${literal(JSON.stringify(v))}::jsonb`;
let created=false,net=false,loader;
try {
 // Refuse pulls or inherited remote daemons; all fixtures derive from existing engines.
 await cmd(['image','inspect',image,'--format','{{.Id}}']);
 loader=await createServer({configFile:false,envFile:false,root:process.cwd(),resolve:{alias:{'@':path.resolve('src')}},server:{middlewareMode:true},appType:'custom'});
 const {draftPreviewDefinitions,calculateDraftPreview}=await loader.ssrLoadModule('/src/calculators/final-framework/draft-preview-catalog.ts');
 const captures=draftPreviewDefinitions.map(d=>({id:d.masterId,snapshot:JSON.parse(JSON.stringify(calculateDraftPreview(d.masterId,d.initialInput).snapshot))}));
 assert.deepEqual(captures.map(c=>c.id),[205,206,232,233,435,441,481,484,487,498,517,518,529,531]);
 await loader.close();loader=null;
 await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--pull=never','--name',name,'--network',network,'--label','calcumint.draft-persistence-fixture=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let attempt=0;;attempt++){try{await sql('SELECT 1;');break;}catch(error){if(attempt>=60)throw error;await new Promise(r=>setTimeout(r,250));}}
 await sql(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY,raw_user_meta_data jsonb DEFAULT '{}'::jsonb);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;`);
 for(const migration of ['001_b3_accounts','010_b7_pro_workspace','029_account_rls_auth_initplan','033_pro_workspace_rls_auth_initplan'])await sql(await readFile(`supabase/migrations/${migration}.sql`,'utf8'));
 // Platform table privileges are explicit fixture dependencies, not added migration behavior.
 await sql(`GRANT SELECT ON public.profiles TO authenticated;
 GRANT SELECT,INSERT,UPDATE,DELETE ON public.calculation_history,public.calculation_projects,public.saved_scenarios TO authenticated;
 INSERT INTO auth.users(id) VALUES('${a}'),('${b}');UPDATE public.profiles SET plan='pro';`);
 assert.equal(await sql("SELECT count(*) FROM pg_class WHERE oid IN ('public.calculation_history'::regclass,'public.saved_scenarios'::regclass,'public.calculation_projects'::regclass) AND relrowsecurity;"),'3');
 const project=await sql(owner(a,`INSERT INTO public.calculation_projects(user_id,name) VALUES('${a}','Synthetic owner A') RETURNING id;`));
 const foreign=await sql(owner(b,`INSERT INTO public.calculation_projects(user_id,name) VALUES('${b}','Synthetic owner B') RETURNING id;`));
 for(const {id,snapshot:s} of captures){
  const history=await sql(owner(a,`INSERT INTO public.calculation_history(user_id,calculator_slug,calculator_version,input_data,output_data) VALUES('${a}',${literal(s.calculatorSlug)},${s.calculatorVersion},${json(s.input)},${json(s.output)}) RETURNING id;`));
  const columns="jsonb_build_object('calculatorSlug',calculator_slug,'calculatorVersion',calculator_version,'input',input_data,'output',output_data)";
  assert.deepEqual(JSON.parse(await sql(owner(a,`SELECT ${columns} FROM public.calculation_history WHERE id='${history}';`))),s);
  assert.equal(await sql(owner(b,`SELECT count(*) FROM public.calculation_history WHERE id='${history}';`)),'0');
  const scenario=await sql(owner(a,`INSERT INTO public.saved_scenarios(user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data) SELECT user_id,'${project}','Synthetic ${id}',calculator_slug,calculator_version,input_data,output_data FROM public.calculation_history WHERE id='${history}' RETURNING id;`));
  assert.deepEqual(JSON.parse(await sql(owner(a,`SELECT ${columns} FROM public.saved_scenarios WHERE id='${scenario}';`))),s);
  assert.equal(await sql(owner(b,`SELECT count(*) FROM public.saved_scenarios WHERE id='${scenario}';`)),'0');
  assert.equal(await sql(owner(b,`WITH copied AS (INSERT INTO public.saved_scenarios(user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data) SELECT '${b}','${foreign}','Forbidden copy',calculator_slug,calculator_version,input_data,output_data FROM public.calculation_history WHERE id='${history}' RETURNING id) SELECT count(*) FROM copied;`)),'0');
  await sql(owner(a,`UPDATE public.calculation_history SET calculator_version=99,output_data='{}' WHERE id='${history}';`));
  assert.deepEqual(JSON.parse(await sql(owner(a,`SELECT ${columns} FROM public.calculation_history WHERE id='${history}';`))),s);
  await sql(owner(a,`UPDATE public.saved_scenarios SET name='Renamed synthetic ${id}' WHERE id='${scenario}';`));
  assert.deepEqual(JSON.parse(await sql(owner(a,`SELECT ${columns} FROM public.saved_scenarios WHERE id='${scenario}';`))),s);
  console.log(`PASS ${id}: owner history/scenario roundtrip, outsider isolation, immutable history and scenario rename snapshot`);
 }
 const insert=(user,projectId,version=1)=>`INSERT INTO public.saved_scenarios(user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data) VALUES('${user}','${projectId}','Synthetic','basic-calculator',${version},'{}','{}');`;
 await assert.rejects(sql(owner(b,insert(a,project))),/row-level security/);
 await assert.rejects(sql(owner(b,insert(b,project))),/row-level security/);
 await assert.rejects(sql(owner(b,`INSERT INTO public.calculation_history(user_id,calculator_slug,calculator_version) VALUES('${a}','basic-calculator',1);`)),/row-level security/);
 await assert.rejects(sql(owner(a,insert(a,project,0))),/check constraint/);
 await assert.rejects(sql('SET ROLE anon;SELECT * FROM public.calculation_history;'),/permission denied/);
 assert.equal(await sql("SET ROLE authenticated;SELECT count(*) FROM public.calculation_history;"),'0');
 const counts=()=>sql('SELECT jsonb_build_array((SELECT count(*) FROM public.calculation_history),(SELECT count(*) FROM public.saved_scenarios));');
 assert.equal(await counts(),'[14, 14]');
 await assert.rejects(sql(owner(a,`BEGIN;INSERT INTO public.calculation_history(user_id,calculator_slug,calculator_version) VALUES('${a}','synthetic-rollback',1);${insert(a,project,0)}COMMIT;`)),/check constraint/);
 assert.equal(await counts(),'[14, 14]');
 // Existing primary key supplies duplicate detection; reconciliation is explicitly owner filtered.
 const retrySnapshot=captures[0].snapshot;
 const columns="jsonb_build_object('calculatorSlug',calculator_slug,'calculatorVersion',calculator_version,'input',input_data,'output',output_data)";
 const historyInsert=(user,id,s=retrySnapshot)=>`INSERT INTO public.calculation_history(id,user_id,calculator_slug,calculator_version,input_data,output_data) VALUES('${id}','${user}',${literal(s.calculatorSlug)},${s.calculatorVersion},${json(s.input)},${json(s.output)});`;
 const ownedSnapshot=(user,id)=>sql(owner(user,`SELECT ${columns} FROM public.calculation_history WHERE id='${id}' AND user_id='${user}';`));
 const retryId=randomUUID();
 // Hold the winning transaction open so the competing INSERT waits on the same UUID.
 const winner=sql(owner(a,`SET application_name='draft-retry-winner';BEGIN;${historyInsert(a,retryId)}SELECT pg_sleep(1);COMMIT;`));
 for(let attempt=0;;attempt++){
  if(await sql("SELECT count(*) FROM pg_stat_activity WHERE application_name='draft-retry-winner' AND wait_event='PgSleep';")==='1')break;
  if(attempt>=100)throw new Error('Retry winner never reached transaction barrier');
  await new Promise(r=>setTimeout(r,10));
 }
 const duplicate=assert.rejects(sql(owner(a,historyInsert(a,retryId))),/23505/);
 await Promise.all([winner,duplicate]);
 assert.deepEqual(JSON.parse(await ownedSnapshot(a,retryId)),retrySnapshot);
 assert.equal(await sql(owner(a,`SELECT count(*) FROM public.calculation_history WHERE id='${retryId}';`)),'1');
 const conflict={...retrySnapshot,output:{conflictingSyntheticPayload:true}};
 await assert.rejects(sql(owner(a,historyInsert(a,retryId,conflict))),/23505/);
 assert.notDeepEqual(JSON.parse(await ownedSnapshot(a,retryId)),conflict);
 assert.deepEqual(JSON.parse(await ownedSnapshot(a,retryId)),retrySnapshot);
 await assert.rejects(sql(owner(b,historyInsert(b,retryId))),/23505/);
 assert.equal(await ownedSnapshot(b,retryId),'');
 // Unique violations can reveal UUID existence; no other owner's payload is returned.
 // Simulate a lost response after COMMIT by discarding the original insert result.
 const interruptedId=randomUUID();
 await sql(owner(a,`BEGIN;${historyInsert(a,interruptedId)}COMMIT;`));
 await assert.rejects(sql(owner(a,historyInsert(a,interruptedId))),/23505/);
 assert.deepEqual(JSON.parse(await ownedSnapshot(a,interruptedId)),retrySnapshot);
 const rolledBackId=randomUUID();
 await sql(owner(a,`BEGIN;${historyInsert(a,rolledBackId)}ROLLBACK;`));
 assert.equal(await ownedSnapshot(a,rolledBackId),'');
 await sql(owner(a,historyInsert(a,rolledBackId)));
 assert.deepEqual(JSON.parse(await ownedSnapshot(a,rolledBackId)),retrySnapshot);
 await sql(owner(a,`UPDATE public.calculation_history SET output_data='{}' WHERE id='${retryId}';`));
 assert.deepEqual(JSON.parse(await ownedSnapshot(a,retryId)),retrySnapshot);
 const scenarioId=await sql(owner(a,`SELECT id FROM public.saved_scenarios ORDER BY id LIMIT 1;`));
 const beforeRename=await sql(owner(a,`SELECT ${columns} FROM public.saved_scenarios WHERE id='${scenarioId}';`));
 const [,duringRename]=await Promise.all([
  sql(owner(a,`BEGIN;UPDATE public.saved_scenarios SET name='Concurrent rename' WHERE id='${scenarioId}';SELECT pg_sleep(0.25);COMMIT;`)),
  sql(owner(a,`SELECT ${columns} FROM public.saved_scenarios WHERE id='${scenarioId}';`))
 ]);
 assert.equal(duringRename,beforeRename);
 assert.equal(await sql(owner(a,`SELECT ${columns} FROM public.saved_scenarios WHERE id='${scenarioId}';`)),beforeRename);
 console.log('PASS concurrent UUID duplicate 23505, owner-filtered reconciliation, conflicting payload rejection, cross-owner payload isolation, discarded-response recovery, rollback retry, immutable history and parallel rename/read');
 // Reproduce the legacy count-then-insert race under the unchanged schema, in an isolated owner.
 const quotaOwner=randomUUID();
 await sql(`INSERT INTO auth.users(id) VALUES('${quotaOwner}');INSERT INTO public.calculation_history(user_id,calculator_slug,calculator_version) SELECT '${quotaOwner}','synthetic-quota',1 FROM generate_series(1,19);`);
 const quotaAttempt=id=>sql(owner(quotaOwner,`BEGIN;SELECT count(*) FROM public.calculation_history WHERE user_id='${quotaOwner}';SELECT pg_sleep(1);${historyInsert(quotaOwner,id)}COMMIT;`));
 const quotaCounts=await Promise.all([quotaAttempt(randomUUID()),quotaAttempt(randomUUID())]);
 assert.deepEqual(quotaCounts,['19','19']);
 assert.equal(await sql(owner(quotaOwner,'SELECT count(*) FROM public.calculation_history;')),'21');
 console.log('OPEN GAP: unchanged legacy Free history count-then-insert admits two different UUIDs from count 19, resulting in 21 rows; this fixture does not establish an atomic quota or validate the new backend Free-write gate.');
 await sql(`DELETE FROM auth.users WHERE id='${quotaOwner}';`);
 await sql(`UPDATE public.profiles SET plan='free' WHERE id='${a}';`);
 await assert.rejects(sql(owner(a,insert(a,project))),/row-level security/);
 assert.equal(await sql(owner(a,'SELECT count(*) FROM public.saved_scenarios;')),'14');
 await sql(owner(a,'DELETE FROM public.saved_scenarios;'));assert.equal(await sql(owner(a,'SELECT count(*) FROM public.saved_scenarios;')),'0');
 console.log('PASS cross-owner inserts/project binding, invalid versions, anonymous denial, transaction rollback, Free scenario write gate and downgraded-owner reads/deletes');
 console.log('14 serialized DRAFT snapshots passed disposable PostgreSQL RLS acceptance. No production connections or host ports; browser login remains unverified.');
} finally {try{if(loader)await loader.close();if(created)await cmd(['rm','-f',name]);}finally{if(net)await cmd(['network','rm',network]);}}
