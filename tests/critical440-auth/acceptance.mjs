import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const directory=process.env.CRITICAL440_AUTH_ARTIFACTS||'docs/critical440-auth';await mkdir(directory,{recursive:true});
const temporary=await mkdtemp('/tmp/critical440-auth-');
const bundled=await build({entryPoints:['tests/critical440-auth/adapter.ts'],bundle:true,platform:'node',format:'esm',outfile:temporary+'/adapter.mjs',metafile:true});
const math=await import(temporary+'/adapter.mjs');
const checks=[],artifacts=[],negativeReceipts=[];let db;
const pass=name=>{checks.push(name);console.log('PASS '+name)};
const ok=async query=>{const r=await query;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async query=>{const r=await query;assert(r.error,'explicit denial expected');negativeReceipts.push({code:r.error.code,message:r.error.message});return r.error.message;};
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});assert.equal(await db.sql('SHOW server_version;'),'17.6');
 const client=()=>createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const signup=async plan=>{const sdk=client();const signed=await ok(sdk.auth.signUp({email:plan+'-'+randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID(),options:{data:{plan:'business'}}}));const id=signed.user.id;assert.equal((await math.readAccountEntitlements(sdk,id)).historyLimit,20);if(plan!=='free')await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${id}';`);return {sdk,id,plan};};
 const users=await Promise.all(['free','pro','business'].map(signup));
 const vectors=JSON.parse(await readFile('docs/shortest-publication-20/browser-cases.json','utf8'));assert.equal(vectors.length,20);
 const focus=vectors.find(x=>x.catalogId===440);assert.equal(focus.slug,'frequency-converter');
 for(const user of users){
  for(const vector of vectors){
   const snapshot=math.validateHistoricalCalculationSnapshot(math.generate(vector.catalogId,vector.input));assert.equal(snapshot.calculatorVersion,1);const id=randomUUID();
   assert.deepEqual(await math.saveHistoryAtomically(user.sdk,id,snapshot,user.id),{id});
   // Simulate a lost acknowledgement by retrying the same request after the first write.
   assert.deepEqual(await math.saveHistoryAtomically(user.sdk,id,snapshot,user.id),{id});
   const row=await ok(user.sdk.from('calculation_history').select('*').eq('id',id).single());const restored=math.readPersistedCalculationSnapshot(row);assert.deepEqual(restored,snapshot);assert.deepEqual(math.verifyRegisteredSnapshot(restored).snapshot,snapshot);
   artifacts.push({plan:user.plan,catalogId:vector.catalogId,id,snapshot,sha256:createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')});
  }
  pass(user.plan+': twenty actual v1 engine snapshots saved, exact request retry, owned read and registered replay');
 }
 for(const vector of vectors)assert.equal(new Set(artifacts.filter(x=>x.catalogId===vector.catalogId).map(x=>x.sha256)).size,1);
 pass('Free/Pro/Business mathematical artifacts are identical for each of twenty engines');
 const free=users[0],pro=users[1],business=users[2],snapshot=math.generate(440,focus.input),saved=artifacts.find(x=>x.plan==='pro'&&x.catalogId===440);
 await assert.rejects(math.saveHistoryAtomically(free.sdk,randomUUID(),snapshot,free.id),/Could not save/);
 await math.saveHistoryAtomically(pro.sdk,randomUUID(),snapshot,pro.id);await math.saveHistoryAtomically(business.sdk,randomUUID(),snapshot,business.id);
 pass('Free twenty-history quota enforced; paid twenty-first history accepted');
 await assert.rejects(math.saveHistoryAtomically(pro.sdk,saved.id,{...snapshot,output:{...snapshot.output,result:999}},pro.id));
 await assert.rejects(math.saveHistoryAtomically(business.sdk,randomUUID(),snapshot,pro.id));
 assert.equal(await ok(business.sdk.from('calculation_history').select('id').eq('id',saved.id).maybeSingle()),null);
 const foreignUpdate=await ok(business.sdk.from('calculation_history').update({output_data:{result:999}}).eq('id',saved.id).select());assert.deepEqual(foreignUpdate,[]);
 pass('#440 immutable retry conflict, stale owner/account-switch denial, foreign read/update isolation');
 await denied(free.sdk.from('calculation_projects').insert({user_id:free.id,name:'Free denied'}));
 for(const user of [pro,business]){
  const project=await ok(user.sdk.from('calculation_projects').insert({user_id:user.id,name:'Frequency fixture'}).select().single());
  const source=artifacts.find(x=>x.plan===user.plan&&x.catalogId===440);const args={p_expected_owner_id:user.id,p_request_id:randomUUID(),p_project_id:project.id,p_history_id:source.id,p_name:'Immutable frequency'};
  assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic',args)),args.p_request_id);assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic',args)),args.p_request_id);
  const row=await ok(user.sdk.from('saved_scenarios').select('*').eq('id',args.p_request_id).single());assert.deepEqual(math.readPersistedCalculationSnapshot(row),snapshot);assert.deepEqual(math.verifyRegisteredSnapshot(math.readPersistedCalculationSnapshot(row)).snapshot,snapshot);
  await denied(free.sdk.rpc('save_project_scenario_atomic',args));assert.equal(await ok(free.sdk.from('saved_scenarios').select('id').eq('id',args.p_request_id).maybeSingle()),null);
 }
 pass('#440 Pro/Business atomic scenario exact retry/copy/replay; Free and foreign scenario denial');
 await db.sql(`UPDATE public.profiles SET plan='free' WHERE id='${pro.id}';`);
 await denied(pro.sdk.from('calculation_projects').insert({user_id:pro.id,name:'Downgrade denied'}));assert.equal((await ok(pro.sdk.from('saved_scenarios').select('*'))).length,1);
 pass('Entitlement revocation denies new paid workspace while existing owned scenario remains readable');
 const token=(await pro.sdk.auth.getSession()).data.session;await ok(pro.sdk.auth.signOut());assert.equal((await pro.sdk.auth.getSession()).data.session,null);
 assert.deepEqual(await ok(pro.sdk.from('calculation_history').select('id')),[]);await assert.rejects(math.saveHistoryAtomically(pro.sdk,randomUUID(),snapshot,pro.id));
 const refresh=await client().auth.refreshSession({refresh_token:token.refresh_token});assert(refresh.error);
 // Stateless access tokens retain DB authority until expiry; logout revokes refresh, not signed JWTs.
 const retained=createClient(db.url,db.anonKey,{global:{headers:{Authorization:'Bearer '+token.access_token}},auth:{persistSession:false,autoRefreshToken:false}});
 assert.equal((await ok(retained.from('calculation_history').select('id'))).length,21);
 pass('SDK logout clears session and denies anonymous saves; revoked refresh rejected; retained JWT lifetime explicitly observed');
 const sources=[];for(const file of [...new Set(['tests/critical440-auth/acceptance.mjs','tests/critical440-auth/adapter.ts','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs','src/app/account/actions.ts',...Object.keys(bundled.metafile.inputs)])].sort())sources.push({path:file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});
 await writeFile(directory+'/receipt.json',JSON.stringify({passed:true,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checks,artifacts,negativeReceipts,sources,provenance:db.provenance,requests:db.requests,limits:['Disposable internal Docker repository candidate schema; production equivalence UNKNOWN','Real Supabase SDK / GoTrue JWT / PostgREST / PG17.6 and actual persistence/validation helpers; not full Next server-action or browser acceptance','Privileged local plan setup only, no billing-provider claims','Logout revokes refresh token; existing stateless access JWT remains valid until expiry','No production environment or credentials used; no public certification or release authorization']},null,2)+'\n');
}catch(e){await writeFile(directory+'/failure.json',JSON.stringify({checks,error:e.stack,provenance:db?.provenance},null,2));throw e;}finally{await db?.close();await rm(temporary,{recursive:true,force:true});}
