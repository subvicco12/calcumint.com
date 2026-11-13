import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const sourceFiles=['tests/milestone60-20261113/browser-pro-only.mjs','tests/milestone60-20261113/browser-pro.mjs'];
const out=path.resolve(process.env.MILESTONE_PRO_ARTIFACTS||'/workspace/artifacts/milestone60-20261113/pro-only');
const priorDir=path.resolve(process.env.MILESTONE_BUSINESS_ARTIFACTS||'/workspace/artifacts/milestone60-20261113/browser');
const sha=b=>createHash('sha256').update(b).digest('hex');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={kind:'TWENTY_GENUINE_PRO_ONLY_SSR_SCENARIO_HISTORY_EXPORT_GRAPH_AND_REVERSE',rows:[],releaseHold:true,productionWrites:false,canonicalAccepted:false,businessMutationsPerformed:false,registryFixtureUsed:false};let db,next,browser;
try{
 assert.equal(process.env.COMPLETION_DELIVERY_BUILD_WINDOW,'approved');for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External connection selector refused');
 assert.equal(execFileSync('git',['status','--porcelain','--',...sourceFiles],{encoding:'utf8'}).trim(),'','Commit exact Pro producers before invocation');
 await mkdir(out,{recursive:true});const priorBytes=await readFile(path.join(priorDir,'receipt.json')),prior=JSON.parse(priorBytes),pinBytes=await readFile(path.join(priorDir,'build-source-sha256.json')),pins=JSON.parse(pinBytes);
 const cases=JSON.parse(await readFile('docs/milestone60-20261113/business-browser-cases.json','utf8')),ids=cases.map(row=>row.id).sort((a,b)=>a-b);assert.equal(cases.length,20);
 for(const key of ['freeHistory','sharing','embed','api','milestoneBusinessBatch'])assert.deepEqual(prior[key].map(row=>row.catalogId).sort((a,b)=>a-b),ids,'Retained completed '+key);
 for(const row of cases)assert.deepEqual(prior.freeHistory.find(item=>item.catalogId===row.id).recordedOutput,prior.sharing.find(item=>item.catalogId===row.id).comparisonA);
 assert.equal(prior.applicationSourceCommit,'edb2463a87cacb4999762cc797ae546ca6a2b01e');assert.equal(Object.keys(pins).length,2061);
 for(const [file,pin]of Object.entries(pins))assert.equal(sha(await readFile(file)),pin.originalSHA256,'Frozen APP6 source differs: '+file);
 report.applicationSourceCommit=prior.applicationSourceCommit;report.reusedEvidence={receipt:path.join(priorDir,'receipt.json'),sha256:sha(priorBytes),sourcePins:path.join(priorDir,'build-source-sha256.json'),sourcePinsSHA256:sha(pinBytes),pins:2061,sections:['20 Free owned-history/replay','20 Business shared-baseline outputs','20 actual iframe/API and durable batch sections'],outerPriorPassed:prior.passed,qualification:'Per-section completed evidence reused; prior outer failure was Pro producer race, not a passing Pro receipt. No Business actions rerun.'};
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);report.fixture=db.provenance;
 const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}),auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Pro-isolated-'+randomUUID()}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
 await db.sql(`UPDATE public.profiles SET plan='pro' WHERE id='${auth.user.id}';INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','reviewer',true);`);assert.equal(await db.sql(`SELECT plan FROM public.profiles WHERE id='${auth.user.id}'`),'pro');
 let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:values=>{cookies=values;}}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(cookie=>cookie.value));
 next=await startProductionRuntime({root:process.cwd(),auth:{url:db.url},db,artifacts:out,conditionalPublicationFixture:false});report.builtSources=next.builtSources;assert(Object.values(next.builtSources).every(pin=>pin.originalSHA256===pin.builtSHA256));
 browser=await startBrowser(next.url,[db.url]);await browser.send('Accessibility.enable');await browser.send('Network.clearBrowserCookies');for(const cookie of cookies)await browser.send('Network.setCookie',{name:cookie.name,value:cookie.value,url:next.url,httpOnly:false,sameSite:'Lax'});
 const context={db,next,browser,sdk,auth,cases,prior,report,out};
 for(let attempt=1;attempt<=3;attempt++){
  assert.equal(execFileSync('git',['status','--porcelain','--',...sourceFiles],{encoding:'utf8'}).trim(),'','Commit producer correction before operator-requested retry');
  const producerCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sources={};for(const file of sourceFiles){const bytes=await readFile(file);sources[file]=sha(bytes);await writeFile(path.join(out,`attempt-${attempt}-${path.basename(file)}`),bytes);}await writeFile(path.join(out,`attempt-${attempt}-invocation.json`),evidenceJSON({attempt,producerCommit,sources,applicationSourceCommit:report.applicationSourceCommit,recordedBeforeInvocation:true}));
  try{const {runPro}=await import(pathToFileURL(path.resolve(sourceFiles[1])).href+'?pro-only-attempt='+attempt);await runPro(context);break;}
  catch(error){await next.flush();await writeFile(path.join(out,`attempt-${attempt}-failure.json`),evidenceJSON({...report,error:redactText(error.stack),body:await browser.text().catch(()=>null)}));if(report.sourceDrift||attempt===3)throw error;console.log('ASSERTION PAUSED Pro-only; same fixture retained. No automatic mutation retry. Root must review and explicitly request continuation.');const deadline=Date.now()+600000;let retry=false;while(Date.now()<deadline){try{await readFile(path.join(out,'retry-request.json'));await rm(path.join(out,'retry-request.json'));retry=true;break;}catch{}await new Promise(resolve=>setTimeout(resolve,500));}if(!retry)throw error;}
 }
}catch(error){report.passed=false;report.error=redactText(error.stack);throw error;}
finally{await next?.flush();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));await browser?.close();await next?.close();await db?.close();}
console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,graphs:report.rows.filter(row=>row.graph).length,downloads:report.rows.flatMap(row=>row.downloads).length,out}));
