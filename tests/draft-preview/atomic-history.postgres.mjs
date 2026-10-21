// Disposable PostgreSQL/PostgREST only: actual 001/002/008/010/029/033/038,
// explicitly fixture-repaired historical 011, and guarded atomic proposal.
// Supabase auth and platform grants are modeled; deployed roles are not attested.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const name=`calcumint-atomic-history-${randomUUID()}`,network=`${name}-network`;
const env={...process.env};for(const key of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[key];
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const child=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';child.stdout.on('data',v=>out+=v);child.stderr.on('data',v=>err+=v);child.on('error',reject);child.on('close',code=>code===0?resolve(out.trim()):reject(new Error(err||out)));child.stdin.on('error',reject);child.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','--set=VERBOSITY=verbose','-v','ON_ERROR_STOP=1'],q);
const a=randomUUID(),b=randomUUID(),c=randomUUID();
const owner=(id,q)=>`SET ROLE authenticated;SET request.jwt.claim.sub='${id}';${q}`;
const rpc=(id,output='{"nested":{"value":3},"list":[1,null,true]}')=>`SELECT public.save_calculation_history_atomic('${id}','synthetic',1,'{"input":1}','${output}',auth.uid());`;
const direct=(user,id=randomUUID())=>`INSERT INTO public.calculation_history(id,user_id,calculator_slug,calculator_version,input_data,output_data) VALUES('${id}','${user}','synthetic',1,'{"input":1}','{"nested":{"value":3},"list":[1,null,true]}');`;
const count=id=>sql(owner(id,'SELECT count(*) FROM public.calculation_history;'));
const barrier=async label=>{for(let n=0;n<200;n++){if(await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='${label}' AND wait_event='PgSleep';`)==='1')return;await new Promise(r=>setTimeout(r,10));}throw Error('Transaction barrier failed');};
const rest=`${name}-rest`;
const restImage='postgrest/postgrest:v12.2.3@sha256:729bf65c733b73f5b52777f0e4b853f22ed73aa67a22d38269d289779b0a8401';
let created=false,net=false,restCreated=false;
try{
 await cmd(['image','inspect',image,'--format','{{.Id}}']);
 await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--pull=never','--name',name,'--network',network,'--label','calcumint.atomic-history-fixture=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let i=0;;i++){try{await sql('SELECT 1;');break;}catch(e){if(i>=60)throw e;await new Promise(r=>setTimeout(r,250));}}
 await sql(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY,raw_user_meta_data jsonb DEFAULT '{}'::jsonb);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$SELECT coalesce(nullif(current_setting('request.jwt.claim.sub',true),''),nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;`);
 for(const m of ['001_b3_accounts','002_b4_billing','008_b10_admin_factory','010_b7_pro_workspace','029_account_rls_auth_initplan','033_pro_workspace_rls_auth_initplan','038_client_account_billing_privileges'])await sql(await readFile(`supabase/migrations/${m}.sql`,'utf8'));
 await sql(`GRANT SELECT ON public.profiles TO authenticated;GRANT SELECT,INSERT,UPDATE,DELETE ON public.calculation_history,public.calculation_projects,public.saved_scenarios TO authenticated;INSERT INTO auth.users(id) VALUES('${a}'),('${b}'),('${c}');`);
 const legacyQuota=await readFile('supabase/migrations/011_b8_free_save_quotas.sql','utf8');
 await assert.rejects(sql(legacyQuota),/unterminated dollar-quoted string/);
 assert.equal(legacyQuota.split('end $;').length,2);
 // Fixture-only syntax repair; unchanged historical 011 is a deployment blocker.
 await sql(legacyQuota.replace('end $;',()=> 'end $$;'));
 console.log('PASS reproduced unchanged historical 011 syntax failure; exercised terminator-repaired fixture-only copy plus actual 002/008/038 (production application unknown)');
 const proposal=await readFile('docs/architecture/proposals/ATOMIC-ACCOUNT-HISTORY.sql','utf8');
 await assert.rejects(sql(proposal),/UNAPPLIED_ATOMIC_ACCOUNT_HISTORY_PROPOSAL/);
 // Even clients that continue after errors cannot execute DDL in the aborted transaction.
 await cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=0'],proposal);
 assert.equal(await sql("SELECT count(*) FROM pg_proc WHERE proname='save_calculation_history_atomic';"),'0');
 const guard=/DO \$proposal_guard\$ BEGIN[\s\S]*?END \$proposal_guard\$;/;
 assert.equal((proposal.match(/DO \$proposal_guard\$/g)||[]).length,1);
 await sql(proposal.replace(guard,'-- Guard removed ONLY inside this disposable database.'));
 await assert.rejects(sql('SET ROLE anon;SELECT public.save_calculation_history_atomic(null,null,null,null,null,null);'),/permission denied/);
 await assert.rejects(sql('SET ROLE authenticated;SELECT public.save_calculation_history_atomic(null,null,null,null,null,null);'),/HISTORY_WRITE_REJECTED/);
 await assert.rejects(sql(owner(a,direct(b))),/HISTORY_WRITE_REJECTED/);
 await assert.rejects(sql(owner(b,`SELECT public.save_calculation_history_atomic('${randomUUID()}','synthetic',1,'{}','{}','${a}');`)),/HISTORY_WRITE_REJECTED/);
 await assert.rejects(sql(owner(b,`SELECT public.save_project_scenario_atomic('${randomUUID()}',null,'${randomUUID()}','No','${a}');`)),/SCENARIO_WRITE_REJECTED/);
 assert.equal(await count(b),'0');
 await assert.rejects(sql(owner(a,`SELECT public.atomic_account_plan('${a}');`)),/permission denied/);
 for(let i=0;i<19;i++)await sql(owner(a,i%2?rpc(randomUUID()):direct(a)));
 const winnerId=randomUUID(),loserId=randomUUID();
 const winner=sql(owner(a,`SET application_name='atomic-quota';BEGIN;${rpc(winnerId)}SELECT pg_sleep(0.5);COMMIT;`));
 await barrier('atomic-quota');
 await Promise.all([winner,assert.rejects(sql(owner(a,direct(a,loserId))),/HISTORY_QUOTA_EXCEEDED/)]);
 assert.equal(await count(a),'20');
 assert.equal(await sql(owner(a,rpc(winnerId))),winnerId);
 await sql(owner(a,direct(a,winnerId)));assert.equal(await count(a),'20');
 await assert.rejects(sql(owner(a,rpc(winnerId,'{"different":true}'))),/HISTORY_REQUEST_CONFLICT/);
 await assert.rejects(sql(owner(b,rpc(winnerId))),/HISTORY_WRITE_REJECTED/);
 assert.equal(await sql(owner(b,`SELECT count(*) FROM public.calculation_history WHERE id='${winnerId}';`)),'0');
 await sql(`UPDATE public.profiles SET plan='pro' WHERE id='${a}';`);
 for(let i=0;i<3;i++)await sql(owner(a,direct(a)));
 await sql(`UPDATE public.profiles SET plan='free' WHERE id='${a}';`);
 assert.equal(await sql(owner(a,rpc(winnerId))),winnerId);
 await assert.rejects(sql(owner(a,rpc(randomUUID()))),/HISTORY_QUOTA_EXCEEDED/);
 console.log('PASS mixed RPC/legacy concurrent 19→20, exact replay at/above quota, UUID payload conflicts, foreign UUID isolation, auth and helper grants');
 for(const plan of ['pro','business']){
  await sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${b}';`);
  for(let i=0;i<22;i++)await sql(owner(b,rpc(randomUUID())));
 }
 assert.equal(await count(b),'44');
 const retryId=randomUUID();
 const duplicateWinner=sql(owner(b,`SET application_name='atomic-retry';BEGIN;${rpc(retryId)}SELECT pg_sleep(0.5);COMMIT;`));
 await barrier('atomic-retry');
 const duplicate=sql(owner(b,rpc(retryId)));
 const [first,second]=await Promise.all([duplicateWinner,duplicate]);
 assert.equal(first,retryId);assert.equal(second,retryId);assert.equal(await count(b),'45');
 const rollback=randomUUID();await sql(owner(b,`BEGIN;${rpc(rollback)}ROLLBACK;`));
 assert.equal(await sql(owner(b,`SELECT count(*) FROM public.calculation_history WHERE id='${rollback}';`)),'0');
 assert.equal(await sql(owner(b,rpc(rollback))),rollback);
 const failed=randomUUID();await assert.rejects(sql(owner(b,`BEGIN;${rpc(failed)}SELECT 1/0;COMMIT;`)),/division by zero/);
 assert.equal(await sql(owner(b,`SELECT count(*) FROM public.calculation_history WHERE id='${failed}';`)),'0');
 assert.equal(await sql(owner(b,rpc(failed))),failed);
 const immutableBefore=await sql(owner(b,`SELECT output_data FROM public.calculation_history WHERE id='${retryId}';`));
 await sql(owner(b,`UPDATE public.calculation_history SET output_data='{}' WHERE id='${retryId}';`));
 assert.equal(await sql(owner(b,`SELECT output_data FROM public.calculation_history WHERE id='${retryId}';`)),immutableBefore);
 await assert.rejects(sql(`UPDATE public.calculation_history SET output_data='{}' WHERE id='${retryId}';`),/HISTORY_SNAPSHOT_IMMUTABLE/);
 for(const bad of ["'[]'","'null'","'{\"nested\":{\"x\":1e309}}'"]){await assert.rejects(sql(owner(b,`SELECT public.save_calculation_history_atomic('${randomUUID()}','synthetic',1,'{}',${bad},auth.uid());`)),/INVALID_HISTORY_SNAPSHOT/);}
 await assert.rejects(sql(owner(b,`SELECT public.save_calculation_history_atomic('${randomUUID()}','synthetic',0,'{}','{}',auth.uid());`)),/INVALID_HISTORY_SNAPSHOT/);
 console.log('PASS Pro/Business beyond 20, concurrent exact retries, discarded-response retry, rollback/failure retry, immutable and finite object snapshots');
 // Downgrade wins first: writer waits on the exact profile row then sees Free.
 const down=sql(`SET application_name='atomic-downgrade';BEGIN;UPDATE public.profiles SET plan='free' WHERE id='${b}';SELECT pg_sleep(0.5);COMMIT;`);
 await barrier('atomic-downgrade');
 await Promise.all([down,assert.rejects(sql(owner(b,direct(b))),/HISTORY_QUOTA_EXCEEDED/)]);
 // Save wins first: downgrade waits until the paid write commits.
 await sql(`UPDATE public.profiles SET plan='pro' WHERE id='${b}';`);
 const paid=sql(owner(b,`SET application_name='atomic-paid';BEGIN;${rpc(randomUUID())}SELECT pg_sleep(0.5);COMMIT;`));
 await barrier('atomic-paid');await Promise.all([paid,sql(`UPDATE public.profiles SET plan='free' WHERE id='${b}';`)]);
 await assert.rejects(sql(owner(b,rpc(randomUUID()))),/HISTORY_QUOTA_EXCEEDED/);
 // REPEATABLE READ cannot count a stale snapshot after profile serialization.
 const stale=sql(owner(c,`SET application_name='atomic-stale';BEGIN ISOLATION LEVEL REPEATABLE READ;SELECT count(*) FROM public.calculation_history;SELECT pg_sleep(0.5);${rpc(randomUUID())}COMMIT;`));
 const staleFailure=assert.rejects(stale,/could not serialize access/);
 await barrier('atomic-stale');await sql(owner(c,rpc(randomUUID())));await staleFailure;
 assert.equal(await count(c),'1');
 console.log('PASS downgrade-before-save/save-before-downgrade profile serialization and stale higher-isolation abort');
 await sql(`UPDATE public.profiles SET plan='pro' WHERE id='${b}';`);
 const project=await sql(owner(b,`INSERT INTO public.calculation_projects(user_id,name) VALUES('${b}','Fixture') RETURNING id;`));
 const scenarioId=randomUUID();
 const scenario=`SELECT public.save_project_scenario_atomic('${scenarioId}','${project}','${retryId}','Copy',auth.uid());`;
 assert.equal(await sql(owner(b,scenario)),scenarioId);assert.equal(await sql(owner(b,scenario)),scenarioId);
 const source=await sql(owner(b,`SELECT jsonb_build_array(calculator_slug,calculator_version,input_data,output_data) FROM public.calculation_history WHERE id='${retryId}';`));
 assert.equal(await sql(owner(b,`SELECT jsonb_build_array(calculator_slug,calculator_version,input_data,output_data) FROM public.saved_scenarios WHERE id='${scenarioId}';`)),source);
 await sql(owner(b,`UPDATE public.saved_scenarios SET name='Rename' WHERE id='${scenarioId}';`));
 await assert.rejects(sql(owner(b,`UPDATE public.saved_scenarios SET input_data='{}' WHERE id='${scenarioId}';`)),/SCENARIO_SNAPSHOT_IMMUTABLE/);
 await assert.rejects(sql(owner(c,`SELECT public.save_project_scenario_atomic('${randomUUID()}','${project}','${retryId}','No',auth.uid());`)),/SCENARIO_PLAN_REQUIRED/);
 await sql(`UPDATE public.profiles SET plan='pro' WHERE id='${c}';`);
 await assert.rejects(sql(owner(c,`SELECT public.save_project_scenario_atomic('${randomUUID()}','${project}','${retryId}','No',auth.uid());`)),/SCENARIO_WRITE_REJECTED/);
 const scenarioDown=sql(`SET application_name='atomic-scenario-down';BEGIN;UPDATE public.profiles SET plan='free' WHERE id='${b}';SELECT pg_sleep(0.5);COMMIT;`);
 await barrier('atomic-scenario-down');
 await Promise.all([scenarioDown,assert.rejects(sql(owner(b,`UPDATE public.saved_scenarios SET name='Denied' WHERE id='${scenarioId}';`)),/SCENARIO_PLAN_REQUIRED/)]);
 assert.equal(await sql(owner(b,`SELECT count(*) FROM public.saved_scenarios;`)),'1');
 await sql(owner(b,`DELETE FROM public.saved_scenarios WHERE id='${scenarioId}';`));
 console.log('PASS atomic scenario copy/replay, owned history/project binding, name-only snapshot immutability, downgrade serialization, downgraded read/delete');
 await sql("CREATE ROLE history_fixture_authenticator LOGIN NOINHERIT PASSWORD 'synthetic-fixture-only';GRANT anon,authenticated TO history_fixture_authenticator;GRANT SELECT ON public.platform_admins TO authenticated;");
 await cmd(['image','inspect',restImage,'--format','{{.Id}}']);
 await cmd(['run','-d','--rm','--pull=never','--name',rest,'--network',network,'-e',`PGRST_DB_URI=postgresql://history_fixture_authenticator:synthetic-fixture-only@${name}:5432/postgres`,'-e','PGRST_DB_SCHEMAS=public','-e','PGRST_DB_ANON_ROLE=anon','-e','PGRST_JWT_SECRET=synthetic-history-transport-jwt-secret-not-production',restImage]);restCreated=true;
 const address=await cmd(['inspect','--format','{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}',rest]);assert.match(address,/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)[0-9.]+$/);
 const restUrl=`http://${address}:3000`;
 for(let n=0;;n++){try{const reply=await fetch(restUrl,{signal:AbortSignal.timeout(1000)});if(!reply.ok)throw Error('PostgREST not ready');break;}catch(error){if(n>=60)throw error;await new Promise(r=>setTimeout(r,250));}}
 await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['node_modules/vitest/vitest.mjs','run','--config','tests/draft-preview/vitest.history.config.ts'],{stdio:'inherit',env:{...env,HISTORY_TEST_CONTAINER:name,HISTORY_TEST_REST_URL:restUrl},timeout:120000});child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(`History HTTP acceptance failed: ${code}`)));});
 console.log('Disposable proposal acceptance passed. Proposal remains guarded and unapplied; production owners/grants/auth are unverified.');
}finally{try{if(restCreated)await cmd(['rm','-f',rest]);}finally{try{if(created)await cmd(['rm','-f',name]);}finally{if(net)await cmd(['network','rm',network]);}}}
