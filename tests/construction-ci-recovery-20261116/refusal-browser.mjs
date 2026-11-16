import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),out=process.env.CONSTRUCTION_REFUSAL_ARTIFACTS||'/tmp/construction-ci-recovery-20261116/refusal-browser';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const sha=b=>createHash('sha256').update(b).digest('hex');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),historicalRows:'SYNTHETIC_EXACT_V1_FIXTURE_ROWS_NOT_CUSTOMER_RECORDS',baseline:'8296454dc7244205ef4cf0b6e0b41c38f90af20f',rows:[],checks:[],downloads:[],productionWrites:false,releaseHold:true,publicationFixture:false,canonicalApproval:false,scope:'Disposable repository-model PostgreSQL17/GoTrue/PostgREST; actual private page and existing atomic account actions. Loopback transport is not production equivalence. Focused Tile/Drywall refusal and read-only historical recovery; no publication capability.'};
let db,next,browser;
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
try{
 await mkdir(out,{recursive:true});await build({entryPoints:[path.join(root,'src/lib/worker1-construction-20261116/cohort.ts')],outfile:path.join(out,'cohort.mjs'),platform:'node',format:'esm',bundle:true,alias:{'@':path.join(root,'src')},logLevel:'silent'});
 const api=await import(pathToFileURL(path.join(out,'cohort.mjs')));const cases=api.constructionContracts.map(c=>{const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));return {id:c.catalogId,slug:c.slug,title:c.title,unit:c.unit,first:c.fields[0].key,firstLabel:c.fields[0].label,raw,packet:api.constructionWorkflows(c.catalogId).execute(raw)};});
 assert.equal(cases.length,10);
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};for(const [name,plan] of [['free','free'],['pro','pro'],['business','business'],['outsider','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
  if(name!=='outsider')await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:v=>cookies=v}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' construction scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,cookies,project};
 }
 console.log('Genuine accounts and RLS ready; one production webpack build');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});browser=await startBrowser(next.url);
 const q=(selector,tail='')=>(tail?'':'!!')+'document.querySelector('+JSON.stringify(selector)+')'+tail;
 const visit=async route=>{const n=await browser.send('Page.navigate',{url:next.url+route});assert(n.loaderId);let ready=false;for(let i=0;i<500;i++){if((await browser.send('Page.getFrameTree')).frameTree.frame.loaderId===n.loaderId){try{if(await browser.js('document.readyState==="complete"&&!!document.querySelector("main")')){ready=true;break;}}catch(e){if(!/context|navigat/i.test(String(e)))throw e;}}await new Promise(r=>setTimeout(r,60));}assert(ready,'Fresh authenticated document required');};
 const identity=async user=>{await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});};
 const choose=async id=>{await browser.until(q('select',"&&Object.keys(document.querySelector('select')).some(k=>k.startsWith('__reactProps$'))"));await browser.js(`(()=>{const s=document.querySelector('select');s.value=${JSON.stringify(String(id))};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(q('input[name='+cases.find(c=>c.id===id).first+']'));};
 await visit('/admin/worker1-construction-20261116');assert.match(await browser.js('location.pathname'),/^\/login/);pass('Unauthenticated private route denied');
 await identity(users.outsider);await visit('/admin/worker1-construction-20261116');assert.match(await browser.text(),/Authorized.*access required/);pass('Authenticated non-reviewer private route denied');

 const witnesses={348:{areaSquareMeters:'22.5',tileLengthCm:'50',tileWidthCm:'25',wastePercent:'10'},349:{surfaceAreaSquareFeet:'5760',sheetLengthFeet:'8',sheetWidthFeet:'4',wastePercent:'10'}};

 const fieldForLabel=async text=>browser.js(`(()=>{const l=[...document.querySelectorAll('label')].find(l=>l.textContent.startsWith(${JSON.stringify(text)}));if(!l)throw Error('Missing labelled field');for(const old of document.querySelectorAll('[data-refusal-field]'))old.removeAttribute('data-refusal-field');l.querySelector('input').setAttribute('data-refusal-field','true');return 'input[data-refusal-field]'})()`);
 for(const plan of ['free','pro','business']){
  const user=users[plan];await identity(user);await visit('/admin/worker1-construction-20261116');
  await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const c of cases.filter(c=>[348,349].includes(c.id))){
   await choose(c.id);const contract=api.constructionContract(c.id),raw=witnesses[c.id],input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)])),output=contract.engine.calculate(input,{});
   assert.equal(output.value,199);const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output};
   assert.deepEqual(api.verifyConstructionSnapshot(snapshot).snapshot,snapshot);assert.throws(()=>api.constructionWorkflows(c.id).execute(raw),/Whole-unit rounding/);
   for(const [key,value]of Object.entries(raw))await browser.field('input[name='+key+']',value);
   await browser.click('Calculate');await browser.until('document.querySelector("[role=alert]")?.textContent.includes("Whole-unit rounding")');
   assert.equal(await browser.js(q("[aria-label=\"Calculation result\"]")),false);
   assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>["Save calculation","Export JSON","Download JSON"].includes(b.textContent.trim()))'),false,'Refused capture exposes no save or export');
   const historyId=randomUUID();assert.equal(await ok(user.sdk.rpc('save_calculation_history_atomic',{p_expected_owner_id:user.id,p_request_id:historyId,p_calculator_slug:c.slug,p_calculator_version:1,p_input_data:input,p_output_data:output})),historyId);
   assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',historyId))).length,0);
   await browser.field(await fieldForLabel('Saved history ID'),historyId);await browser.click('Restore owned history');
   await browser.until(q('[aria-label="Verified historical construction snapshot"]','?.textContent.includes("199")'));
   const historical=()=>browser.js('JSON.parse(document.querySelector('+JSON.stringify('[aria-label="Verified historical construction snapshot"]')+').textContent)');
   assert.deepEqual(await historical(),snapshot);assert.match(await browser.text(),/read-only.*original v1 result is preserved/);
   assert.equal(await browser.js(q("[aria-label=\"Calculation result\"]")),false,'Historical199 must not become a new capture');
   const row={id:c.id,plan,refusal:'EXACT_NORMALIZED_CEILING198_RETAINED_V1_199',historical199ReadOnly:true,foreignHistoryDenied:true};
   if(plan==='free')assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Export recorded construction JSON")'),false);
   else{
    const d=await recordedDownload(browser,{label:'Export recorded construction JSON',filename:c.slug+'-v1-recorded.json',directory:out});assert.deepEqual(JSON.parse(d.bytes.toString()),snapshot);
    report.downloads.push({id:c.id,plan,format:'recorded-json',file:path.relative(out,d.file),bytes:d.bytes.length,sha256:sha(d.bytes)});
    const scenarioId=randomUUID();assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic',{p_expected_owner_id:user.id,p_request_id:scenarioId,p_project_id:user.project.id,p_history_id:historyId,p_name:'Retained v1 witness'})),scenarioId);
    assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenarioId))).length,0);
    // A fresh document prevents the preceding identical history199 pane/status
    // from satisfying a scenario operation that never executed.
    await visit('/admin/worker1-construction-20261116');await choose(c.id);
    assert.equal(await browser.js(q("[aria-label=\"Verified historical construction snapshot\"]")),false);
    assert(!/Verified historical snapshot opened read-only/.test(await browser.text()));
    await browser.field(await fieldForLabel('Saved scenario ID'),scenarioId);await browser.click('Restore saved scenario');
    await browser.until('document.body.innerText.includes("Verified historical snapshot opened read-only")');assert.deepEqual(await historical(),snapshot);row.scenario199ReadOnly=true;
   }
   for(const [key,value]of Object.entries(c.raw))await browser.field('input[name='+key+']',value);
   await browser.click('Calculate');await browser.until(q('[aria-label="Calculation result"]'));assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);
   const stored=await ok(user.sdk.from('calculation_history').select('input_data,output_data').eq('id',historyId).single());assert.deepEqual(stored,{input_data:input,output_data:output});row.validInputRecovery=true;row.historyUnmodified=true;
   assert(await browser.js('document.documentElement.scrollWidth<=innerWidth'));report.rows.push(row);console.log('PASS refusal/read-only '+plan+' #'+c.id);
  }
 }
 assert.equal(report.rows.length,6);assert.equal(report.downloads.length,4);assert.deepEqual(browser.errors,[]);report.images=db.provenance.images;report.passed=true;
}catch(e){report.failure=redactText(e.stack||e);throw e;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,downloads:report.downloads.length,failure:report.failure}));}
