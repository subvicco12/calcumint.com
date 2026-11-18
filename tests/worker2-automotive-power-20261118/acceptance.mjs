import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { createClient } from '@supabase/supabase-js';
import { startGoTrueFixture } from '../gotrue-runtime/fixture.mjs';
import { initializeFullSchema } from '../gotrue-full-schema/schema.mjs';

for (const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGPORT','PGUSER','PGPASSWORD','PGDATABASE']) {
 assert(!process.env[key], 'External database selector refused: ' + key);
}
const temp=await mkdtemp(join(tmpdir(),'automotive-power-'));
let fixture;
const ok=async request=>{const {data,error}=await request;assert.equal(error,null,error?.message);return data;};
try {
 const bundle=join(temp,'actions.mjs');
 await build({
  stdin:{contents:`
   export * from './src/app/admin/worker2-automotive-power-20261118/actions';
   export {powerWorkflows,powerContract} from './src/lib/worker2-automotive-power-20261118/cohort';
  `,resolveDir:process.cwd(),loader:'ts'},
  alias:{'@':resolve('src')},bundle:true,platform:'node',format:'esm',outfile:bundle,logLevel:'silent',
  plugins:[{name:'isolated-next-transport',setup(plugin){
   plugin.onResolve({filter:/^(?:@\/lib\/supabase\/server|next\/cache|next\/navigation)$/},
    ({path})=>({path,namespace:'fixture'}));
   plugin.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`
    export async function createSupabaseServerClient(){return globalThis.automotiveFixtureClient;}
    export function revalidatePath(){}
    export function redirect(){throw Error('Sign in to continue');}
   `}));
  }}],
 });
 const app=await import(pathToFileURL(bundle));
 fixture=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 async function signup(plan,reviewer=true){
  const client=createClient(fixture.url,fixture.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {user}=await ok(client.auth.signUp({email:randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID()}));
  await fixture.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${user.id}';`);
  if(reviewer)await fixture.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${user.id}','reviewer',true);`);
  return {client,id:user.id};
 }
 const accounts={free:await signup('free'),pro:await signup('pro'),business:await signup('business')};
 const outsider=await signup('pro',false);
 const outcomes=[];
 for(const [plan,{client,id}] of Object.entries(accounts)){
  globalThis.automotiveFixtureClient=client;
  const project=plan==='free'?null:await ok(client.from('calculation_projects').insert({user_id:id,name:'Automotive test'}).select('id').single());
  for(const catalogId of [475,476]){
   const c=app.powerContract(catalogId);
   const packet=app.powerWorkflows(catalogId).execute(Object.fromEntries(c.fields.map(field=>[field.key,field.defaultValue])));
   const write={expectedOwnerId:id,requestId:randomUUID(),packet};
   const history=await app.saveHistory(write);
   assert.equal((await app.saveHistory(write)).id,history.id);
   assert.deepEqual((await app.readHistory({expectedOwnerId:id,historyId:history.id})).snapshot,packet.snapshot);
   assert.deepEqual(await ok(outsider.client.from('calculation_history').select('id').eq('id',history.id)),[]);
   const scenario={...write,projectId:project?.id??randomUUID(),name:'Scenario',requestId:randomUUID()};
   if(project){
    const saved=await app.saveScenario(scenario);
    assert.deepEqual((await app.restoreScenario({expectedOwnerId:id,scenarioId:saved.scenarioId})).snapshot,packet.snapshot);
    assert.deepEqual(await ok(outsider.client.from('saved_scenarios').select('id').eq('id',saved.scenarioId)),[]);
   }else await assert.rejects(app.saveScenario(scenario),/Pro or Business/);
   await assert.rejects(app.saveHistory({...write,expectedOwnerId:outsider.id}),/Account context changed/);
   outcomes.push({catalogId,plan,history:true,scenario:project?'saved and restored':'denied'});
  }
 }
 const packet=app.powerWorkflows(475).execute({kilowatts:'100'});
 globalThis.automotiveFixtureClient=outsider.client;
 await assert.rejects(app.saveHistory({expectedOwnerId:outsider.id,requestId:randomUUID(),packet}),/engineering review access/i);
 globalThis.automotiveFixtureClient=accounts.pro.client;
 await fixture.sql(`UPDATE public.platform_admins SET active=false WHERE user_id='${accounts.pro.id}';`);
 await assert.rejects(app.saveHistory({expectedOwnerId:accounts.pro.id,requestId:randomUUID(),packet}),/engineering review access/i);
 console.log(JSON.stringify({passed:true,outcomes,fixtureImages:fixture.provenance.images,
  boundary:'Actual account actions with real GoTrue/PostgREST/PostgreSQL. Next cookie transport and cache refresh substituted. No browser or hosted equivalence.'},null,2));
} finally {
 delete globalThis.automotiveFixtureClient;
 try{if(fixture)await fixture.close();}finally{await rm(temp,{recursive:true,force:true});}
}
