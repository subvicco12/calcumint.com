import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
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
const root=process.cwd(),out=process.env.WORKER1_ARTIFACTS||'/tmp/worker1-mechanics-remediation';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={baseline:'50787d4b77914b58b67b33b77473ccf235cbe365',rows:[],checks:[],downloads:[],productionWrites:false,releaseHold:true,publicationFixture:false,canonicalApproval:false,scope:'Disposable repository-model PostgreSQL17/GoTrue/PostgREST; actual private page and existing atomic account actions. Loopback transport is not production equivalence. Business team/native/job capabilities remain blocked.'};
let db,next,browser;
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
try{
 await mkdir(out,{recursive:true});await build({entryPoints:[path.join(root,'src/lib/worker1-mechanics-20261118/cohort.ts')],outfile:path.join(out,'cohort.mjs'),platform:'node',format:'esm',bundle:true,alias:{'@':path.join(root,'src')},logLevel:'silent'});
 const api=await import(pathToFileURL(path.join(out,'cohort.mjs')));const cases=api.mechanicsContracts.map(c=>{const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));return {id:c.catalogId,slug:c.slug,title:c.title,unit:c.unit,first:c.fields[0].key,firstLabel:c.fields[0].label,raw,packet:api.mechanicsWorkflows(c.catalogId).execute(raw)};});
 assert.equal(cases.length,10);
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};for(const [name,plan] of [['pro','pro'],['business','business'],['outsider','business'],['member','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
  if(name!=='outsider')await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:v=>cookies=v}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' mechanics scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,cookies,project};
 }
 const owner=users.business,org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Worker1 isolated mechanics',org_slug:'mechanics-'+randomUUID()}));
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users.member.id}','member');`);
 console.log('Genuine accounts and RLS ready; one production webpack build');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});browser=await startBrowser(next.url);
 const q=(selector,tail='')=>(tail?'':'!!')+'document.querySelector('+JSON.stringify(selector)+')'+tail;
 const visit=async route=>{const n=await browser.send('Page.navigate',{url:next.url+route});assert(n.loaderId);let ready=false;for(let i=0;i<500;i++){if((await browser.send('Page.getFrameTree')).frameTree.frame.loaderId===n.loaderId){try{if(await browser.js('document.readyState==="complete"&&!!document.querySelector("main")')){ready=true;break;}}catch(e){if(!/context|navigat/i.test(String(e)))throw e;}}await new Promise(r=>setTimeout(r,60));}assert(ready,'Fresh authenticated document required');};
 const identity=async user=>{await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});};
 const choose=async id=>{await browser.until(q('select',"&&Object.keys(document.querySelector('select')).some(k=>k.startsWith('__reactProps$'))"));await browser.js(`(()=>{const s=document.querySelector('select');s.value=${JSON.stringify(String(id))};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(q('input[name='+cases.find(c=>c.id===id).first+']'));};
 const route='/admin/worker1-mechanics-20261118';
 await identity(users.member);await visit(route);
 await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 const checkOrg=async text=>{
  await browser.until("[...document.querySelectorAll('input')].some(e=>Object.keys(e).some(k=>k.startsWith('__reactProps$')))");
  const selector=await browser.js(`(()=>{const label=[...document.querySelectorAll('label')].find(e=>e.textContent.startsWith('Business organization ID'));label.querySelector('input').id='fixture-org';return '#fixture-org'})()`);
  await browser.field(selector,org);await browser.click('Check current Business capability');
  await browser.until('document.body.innerText.includes('+JSON.stringify(text)+')');
 };
 await checkOrg('Verified Business role: member');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.member.id}';`);
 const denied='Business workspace access denied.';
 await checkOrg(denied);assert(!(await browser.text()).includes('Verified Business role:'));
 await browser.send('Page.reload');await browser.until('document.readyState==="complete" && !document.querySelector("#fixture-org")');
 await checkOrg(denied);
 await visit('/');await visit(route);await checkOrg(denied);
 await visit(route);await browser.send('Network.clearBrowserCookies');await checkOrg(denied);
 await visit(route);assert.match(await browser.js('location.pathname'),/^\/login/);
 pass('Revoked membership denied with controlled feedback across same session, reload, navigation and lost cookies');
 await identity(users.pro);await visit(route);
 const historyField='section[aria-label="Authenticated mechanics workflows"] label:first-of-type input';
 for(const [id,input,refusal] of [[307,{force:10,distance:3,angleDegrees:90},'exactly zero work'],[309,{mass:1e-200,velocity:1e-200},'magnitude at least']]){
  const c=api.mechanicsContracts.find(row=>row.catalogId===id),output=c.engine.calculate(input,{});
  const expected={calculatorSlug:c.slug,calculatorVersion:1,input,output};
  const v1=randomUUID(),v2=randomUUID();
  for(const [key,version] of [[v1,1],[v2,2]])await ok(users.pro.sdk.rpc('save_calculation_history_atomic',{
   p_expected_owner_id:users.pro.id,p_request_id:key,p_calculator_slug:c.slug,p_calculator_version:version,p_input_data:input,p_output_data:output,
  }));
  assert.deepEqual(await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',v1)),[]);
  await choose(id);await browser.field(historyField,v1);await browser.click('Restore owned history');
  const historical='[aria-label="Verified historical mechanics snapshot"]';
  await browser.until(q(historical));assert.deepEqual(JSON.parse(await browser.js('document.querySelector('+JSON.stringify(historical)+').textContent')),expected);
  assert(!await browser.js(q('[aria-label="Calculation result"]')));
  for(const [key,value] of Object.entries(input))await browser.field('input[name='+key+']',String(value));
  await browser.click('Calculate');await browser.until('document.querySelector("[role=alert]")?.textContent.includes('+JSON.stringify(refusal)+')');
  assert(!await browser.js(q('[aria-label="Calculation result"]')));
  await browser.field(historyField,v2);await browser.click('Restore owned history');
  await browser.until('document.body.innerText.includes("Saved calculation unavailable for this account or version.")');
  assert(!await browser.js(q(historical)));
  report.rows.push({id,output,newCaptureRefused:true,nativeHistoricalReplay:true,wrongVersionDenied:true,foreignHistoryDenied:true});
 }
 report.browserErrors=browser.errors;assert.deepEqual(browser.errors,[]);report.images=db.provenance.images;report.passed=true;
}catch(e){report.passed=false;report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,downloads:report.downloads.length,failure:report.failure}));}
