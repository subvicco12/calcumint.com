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
const root=process.cwd(),out=path.join(root,'docs/worker1-statistics-a-20261117/validation/authenticated.json');
const report={baseline:'6fa8f87433ee8434d1d89aaf93deea0216eb17cb',scope:'Genuine disposable PostgreSQL17/GoTrue/PostgREST with actual account-action composition; fixture SDK session adapter replaces server cookie transport only. next/cache revalidation is a no-op. This is NOT native browser/cookie transport, hosted or production acceptance.',rows:[],negativeChecks:[],passed:false,productionWrites:false,releaseHold:true};
let db,temporary;
const ok=async p=>{const r=await p;assert.equal(r.error,null,redactText(JSON.stringify(r.error)));return r.data;};
try{
 temporary=await mkdtemp(path.join(tmpdir(),'worker1-statistics-auth-'));
 const target=path.join(temporary,'actions.cjs');
 await build({stdin:{contents:"export * from './src/lib/worker1-statistics-a-20261117/account';export * from './src/lib/worker1-statistics-a-20261117/cohort';",resolveDir:root},outfile:target,bundle:true,format:'cjs',platform:'node',alias:{'@':path.join(root,'src')},external:['react','react-dom'],logLevel:'silent',plugins:[{name:'fixture-session-and-next-cache-only',setup(b){
  b.onResolve({filter:/^(?:@\/lib\/supabase\/server|.*\/supabase\/server)$/},()=>({path:'session',namespace:'fixture'}));
  b.onResolve({filter:/^next\/(?:cache|navigation)$/},args=>({path:args.path,namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='session'?"export async function createSupabaseServerClient(){return globalThis.__worker1StatisticsClient??null;}":args.path==='next/cache'?"export function revalidatePath(){}":"export function redirect(){throw Error('Sign in to continue');}",loader:'js'}));
 }}]});
 await symlink(path.join(root,'node_modules'),path.join(temporary,'node_modules'),'dir');
 const api=createRequire(target)(target);
 report.adapterSHA256=createHash('sha256').update(await readFile(target)).digest('hex');
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};
 for(const plan of ['free','pro','business','outsider']){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const a=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(a.session.access_token,a.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan==='outsider'?'business':plan}' WHERE id='${a.user.id}';`);
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:a.user.id,name:'Statistics fixture'}).select('id').single());users[plan]={sdk,id:a.user.id,project};
 }
 for(const plan of ['free','pro','business'])for(const c of api.statisticsContracts){
  const u=users[plan],packet=api.statisticsWorkflows(c.catalogId).execute(Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]))),request=randomUUID();globalThis.__worker1StatisticsClient=u.sdk;
  assert.deepEqual(await api.saveStatisticsHistory({expectedOwnerId:u.id,requestId:request,packet}),{id:request});
  assert.deepEqual(await api.saveStatisticsHistory({expectedOwnerId:u.id,requestId:request,packet}),{id:request});
  assert.deepEqual(await Promise.all([api.saveStatisticsHistory({expectedOwnerId:u.id,requestId:request,packet}),api.saveStatisticsHistory({expectedOwnerId:u.id,requestId:request,packet})]),[{id:request},{id:request}]);
  assert.equal((await ok(u.sdk.from('calculation_history').select('id').eq('id',request))).length,1);
  assert.deepEqual((await api.readStatisticsHistory({expectedOwnerId:u.id,historyId:request})).snapshot,packet.snapshot);
  assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',request))).length,0);
  const row={catalogId:c.catalogId,plan,historyPersistence:true,historyIdempotency:true,historyRLS:true,exactReplay:true};
  if(plan==='free')await assert.rejects(()=>api.statisticsProjects(u.id),/Pro or Business/);
  else{
   const scenario=randomUUID();await api.saveStatisticsScenario({expectedOwnerId:u.id,projectId:u.project.id,requestId:scenario,name:'Case',packet});
   assert.deepEqual((await api.restoreStatisticsScenario({expectedOwnerId:u.id,scenarioId:scenario})).snapshot,packet.snapshot);
   assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenario))).length,0);row.scenarioPersistence=true;row.scenarioRLS=true;
   await assert.rejects(()=>api.saveStatisticsScenario({expectedOwnerId:u.id,projectId:users.outsider.project.id,requestId:randomUUID(),name:'foreign',packet}),/Owned project/);
  }
  globalThis.__worker1StatisticsClient=users.outsider.sdk;await assert.rejects(()=>api.readStatisticsHistory({expectedOwnerId:u.id,historyId:request}),/Account context changed/);
  globalThis.__worker1StatisticsClient=u.sdk;await assert.rejects(()=>api.saveStatisticsHistory({expectedOwnerId:u.id,requestId:randomUUID(),packet:{...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,count:999}}}}));
  report.rows.push(row);console.log('PASS '+plan+' #'+c.catalogId);
 }
 const owner=users.business,member=users.outsider;globalThis.__worker1StatisticsClient=owner.sdk;
 const org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Statistics isolated organization',org_slug:'statistics-'+randomUUID()}));
 const capability=await api.statisticsBusinessProjects({expectedOwnerId:owner.id,organizationId:org});assert.equal(capability.role,'owner');assert.equal(capability.delivery.available,false);
 globalThis.__worker1StatisticsClient=member.sdk;await assert.rejects(()=>api.statisticsBusinessProjects({expectedOwnerId:member.id,organizationId:org}));
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${member.id}','member');`);
 assert.equal((await api.statisticsBusinessProjects({expectedOwnerId:member.id,organizationId:org})).role,'member');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${member.id}';`);
 await assert.rejects(()=>api.statisticsBusinessProjects({expectedOwnerId:member.id,organizationId:org}));
 report.business={ownerRead:true,memberRead:true,nonmemberDenied:true,revocationDenied:true,sharedDeliveryAvailable:false};
 globalThis.__worker1StatisticsClient=null;await assert.rejects(()=>api.statisticsProjects(users.pro.id),/Authentication unavailable/);report.negativeChecks.push('missing-session','stale-owner','foreign-history-RLS','foreign-scenario-RLS','foreign-project','forged-output','free-scenario-denial');
 report.images=db.provenance.images;report.passed=true;
}catch(e){report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{delete globalThis.__worker1StatisticsClient;if(db)await db.close();if(temporary)await rm(temporary,{recursive:true,force:true});await mkdir(path.dirname(out),{recursive:true});await writeFile(out,evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,failure:report.failure}));}
