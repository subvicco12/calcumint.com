import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,mkdir,writeFile,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const root=process.cwd(),out=path.join(root,'docs/coordinator-statistics-a-20261117/validation/shared-actions.json');
const report={workerCommit:'0253dc320e6af34afa4ef2f0a1af08bd1812d871',scope:'Only newly affected shared factory actions, genuine disposable PostgreSQL17/GoTrue/PostgREST. Fixture SDK replaces server cookie transport; Next cache invalidation is a no-op. Not native browser, hosted or production acceptance.',rows:[],passed:false,productionWrites:false,releaseHold:true};
let db,temporary;
const ok=async p=>{const r=await p;assert.equal(r.error,null,redactText(JSON.stringify(r.error)));return r.data;};
try{
 temporary=await mkdtemp(path.join(tmpdir(),'coordinator-statistics-a-'));
 const target=path.join(temporary,'shared.cjs');
 await build({stdin:{contents:"export * from './src/app/admin/calculator-factory/actions';export * from './src/lib/calculator-factory/registry';export * from './src/lib/registered-snapshot-verification';export * from './src/lib/calculator-factory/completion/business';",resolveDir:root},outfile:target,bundle:true,format:'cjs',platform:'node',alias:{'@':path.join(root,'src')},external:['react','react-dom'],logLevel:'silent',plugins:[{name:'fixture-session-and-cache-only',setup(b){
  b.onResolve({filter:/^(?:@\/lib\/supabase\/server|.*\/supabase\/server)$/},()=>({path:'session',namespace:'fixture'}));
  b.onResolve({filter:/^next\/(?:cache|navigation)$/},args=>({path:args.path,namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='session'?"export async function createSupabaseServerClient(){return globalThis.__statisticsSharedClient??null;}":args.path==='next/cache'?"export function revalidatePath(){}":"export function redirect(){throw Error('Sign in to continue');}",loader:'js'}));
 }}]});
 await symlink(path.join(root,'node_modules'),path.join(temporary,'node_modules'),'dir');const api=createRequire(target)(target);
 report.adapterSHA256=createHash('sha256').update(await readFile(target)).digest('hex');
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};for(const name of ['business','outsider','free']){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const a=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(a.session.access_token,a.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${name==='free'?'free':'business'}' WHERE id='${a.user.id}';`);
  const project=name==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:a.user.id,name:'Shared statistics fixture'}).select('id').single());users[name]={sdk,id:a.user.id,project};
 }
 for(const id of [292,293,294,295]){
  const u=users.business,c=api.getFactoryContract(id),raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)])),packet=api.getFactoryWorkflows(id).execute(raw),request=randomUUID();globalThis.__statisticsSharedClient=u.sdk;
  const input={expectedOwnerId:u.id,projectId:u.project.id,name:'Shared factory case',requestId:request,packet};
  const saved=await api.factorySaveScenario(input);assert.equal(saved.historyId,request);assert.equal(saved.scenarioId,request);
  const recovered=await api.factoryRestoreScenario({expectedOwnerId:u.id,scenarioId:request});assert.equal(recovered.catalogId,id);assert.deepEqual(recovered.snapshot,packet.snapshot);assert.deepEqual(api.verifyRegisteredSnapshot(recovered.snapshot).snapshot,packet.snapshot);
  assert.deepEqual(await api.factorySaveScenario(input),saved);
  assert.equal((await ok(u.sdk.from('calculation_history').select('id').eq('id',request))).length,1);assert.equal((await ok(u.sdk.from('saved_scenarios').select('id').eq('id',request))).length,1);
  assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',request))).length,0);
  await assert.rejects(()=>api.factorySaveScenario({...input,requestId:randomUUID(),projectId:users.outsider.project.id}),/Owned project/);
  await assert.rejects(()=>api.factorySaveScenario({...input,requestId:randomUUID(),packet:{...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,count:999}}}}));
  globalThis.__statisticsSharedClient=users.outsider.sdk;await assert.rejects(()=>api.factoryRestoreScenario({expectedOwnerId:u.id,scenarioId:request}),/Account context changed/);await assert.rejects(()=>api.factoryRestoreScenario({expectedOwnerId:users.outsider.id,scenarioId:request}),/Owned scenario/);
  globalThis.__statisticsSharedClient=users.free.sdk;await assert.rejects(()=>api.factoryProjects(users.free.id),/Pro or Business/);
  report.rows.push({catalogId:id,sharedActionScenarioRecovery:true,arrayInputAndOriginalNamespacePreserved:true,idempotency:true,negativeOwnerProjectRLS:true,forgedPacketDenied:true,freePlanDenied:true});console.log('PASS shared factory #'+id);
 }
 globalThis.__statisticsSharedClient=null;await assert.rejects(()=>api.factoryProjects(users.business.id),/Authentication unavailable/);
 report.images=db.provenance.images;report.passed=true;
}catch(e){report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{delete globalThis.__statisticsSharedClient;if(db)await db.close();if(temporary)await rm(temporary,{recursive:true,force:true});await mkdir(path.dirname(out),{recursive:true});await writeFile(out,evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,failure:report.failure}));}
