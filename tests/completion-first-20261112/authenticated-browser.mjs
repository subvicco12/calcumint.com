import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const root=process.cwd(),artifacts=process.env.FACTORY_AUTH_BROWSER_ARTIFACTS||'/workspace/artifacts/completion-first-20261112/business/authenticated-browser';
await mkdir(artifacts,{recursive:true});
const report={kind:'GENUINE_NEXT_PRODUCTION_BROWSER_ACCOUNT_ACTION_ACCEPTANCE',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),buildId:(await readFile('.next/BUILD_ID','utf8')).trim(),journeys:[],checks:[],productionWrites:false,releaseHold:true,limitations:['Existing final Next production build/start with disposable local genuine GoTrue/PostgREST/Postgres. No rebuild or source adapters.','Local privileged plan and active reviewer access setup only; no billing, certification, publication or production equivalence acceptance.']};
const ok=async query=>{const r=await query;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const cases=[[218,{x:'12'}],[219,{x:'5'}],[220,{x:'144'}],[423,{value:'1',fromUnit:'mi',toUnit:'km'}],[430,{value:'1',fromUnit:'kwh',toUnit:'mj'}],[431,{value:'1',fromUnit:'kw',toUnit:'w'}],[432,{value:'2',fromUnit:'h',toUnit:'min'}],[438,{value:'1',fromUnit:'kn',toUnit:'n'}],[440,{value:'2.4',fromUnit:'ghz',toUnit:'mhz'}]];
let db,app,browser;let logs='';
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const signup=async plan=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));assert(auth.user&&auth.session);await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','reviewer',true);`);let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:values=>{cookies=values;}}});await ok(ssr.auth.setSession(auth.session));const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:'Genuine browser '+plan}).select('id').single());return{sdk,id:auth.user.id,cookies,project};};
 const users={free:await signup('free'),pro:await signup('pro'),business:await signup('business')};
 const port=await new Promise(resolve=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const p=server.address().port;server.close(()=>resolve(p));});});const origin='http://127.0.0.1:'+port;
 app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:root,env:{...process.env,NODE_ENV:'production',NEXT_PUBLIC_SUPABASE_URL:db.url,NEXT_PUBLIC_SUPABASE_ANON_KEY:db.anonKey,SUPABASE_SERVICE_ROLE_KEY:db.serviceKey,NEXT_PUBLIC_SITE_URL:origin},stdio:['ignore','pipe','pipe']});app.stdout.on('data',x=>logs+=x);app.stderr.on('data',x=>logs+=x);
 const deadline=Date.now()+30000;while(Date.now()<deadline){try{if((await fetch(origin+'/login')).status===200)break;}catch{}await new Promise(r=>setTimeout(r,100));}assert(app.exitCode===null,logs);
 browser=await startBrowser(origin,[db.url]);
 const identify=async user=>{await browser.send('Network.clearBrowserCookies');for(const cookie of user.cookies)await browser.send('Network.setCookie',{name:cookie.name,value:cookie.value,url:origin,httpOnly:false,sameSite:'Lax'});};
 await identify(users.free);await browser.visit('/admin/calculator-factory');assert((await browser.text()).includes('Private calculator engineering factory'),'Existing build must support runtime GoTrue server authentication: '+await browser.text());report.checks.push('Actual production page authenticates real GoTrue SSR cookies at runtime');
 const choose=async id=>{await browser.until('!!document.querySelector("select")');await browser.js(`(()=>{const s=document.querySelector('select');s.value='${id}';s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(`document.querySelector('select').value==='${id}'`);};
 const setField=async(key,value)=>{const selector='[name="'+key+'"]';if(await browser.js(`document.querySelector(${JSON.stringify(selector)}).tagName==='SELECT'`)){await browser.js(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);}else await browser.field(selector,value);};
 for(const plan of ['free','pro','business']){
  const user=users[plan];await identify(user);await browser.visit('/admin/calculator-factory');
  for(const [id,input] of cases){
   await choose(id);for(const [key,value] of Object.entries(input))await setField(key,value);await browser.click('Calculate');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');
   const before=await db.sql(`SELECT count(*) FROM public.calculation_history WHERE user_id='${user.id}';`);await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Saved to your authenticated calculation history.")');
   assert.equal(Number(await db.sql(`SELECT count(*) FROM public.calculation_history WHERE user_id='${user.id}';`)),Number(before)+1);
   let scenarioId=null;
   if(plan==='free')assert.equal(await browser.js('!!document.querySelector(`[aria-label="Persisted project scenarios"]`)'),false);
   else{
    await browser.click('Load owned projects');await browser.until('document.querySelector(`[aria-label="Owned project"]`).value!==""');await browser.field('[aria-label="Persisted project scenarios"] label:nth-of-type(2) input','Genuine '+id);await browser.click('Save project scenario');await browser.until('document.body.innerText.includes("Saved scenario ")');scenarioId=await browser.js('document.querySelector(`[aria-label="Persisted project scenarios"] label:nth-of-type(3) input`).value');assert.match(scenarioId,/^[0-9a-f-]{36}$/);
    const row=await ok(user.sdk.from('saved_scenarios').select('*').eq('id',scenarioId).single());assert.equal(row.user_id,user.id);assert.equal(row.project_id,user.project.id);
    await browser.visit('/admin/calculator-factory');await choose(id);await browser.field('[aria-label="Persisted project scenarios"] label:nth-of-type(3) input',scenarioId);await browser.click('Restore saved scenario');await browser.until('document.body.innerText.includes("Verified saved snapshot restored.")');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');for(const [key,value] of Object.entries(input))assert.equal(await browser.js(`document.querySelector('[name="${key}"]').value`),value);
   }
   report.journeys.push({catalogId:id,plan,genuineHistoryAction:true,scenarioId,documentReloadRestore:!!scenarioId,freePaidUIAbsent:plan==='free'});console.log('PASS genuine Next/browser '+id+' '+plan);
  }
 }
 // Keep rendered owner A, replace only genuine cookies with B, then submit A's form.
 await identify(users.pro);await browser.visit('/admin/calculator-factory');await choose(218);await setField('x','9');await browser.click('Calculate');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');const previous=await db.sql(`SELECT count(*) FROM public.calculation_history WHERE user_id IN('${users.pro.id}','${users.business.id}');`);await identify(users.business);await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Account context changed")');assert.equal(await db.sql(`SELECT count(*) FROM public.calculation_history WHERE user_id IN('${users.pro.id}','${users.business.id}');`),previous);report.checks.push('Rendered-owner mismatch after genuine cookie account switch rejected actual history server action without persistence');
 assert.equal(report.journeys.length,27);report.passed=true;report.requests=db.requests;report.fixture=db.provenance;report.browserErrors=browser.errors;
 const sources={};for(const file of ['tests/completion-first-20261112/authenticated-browser.mjs','src/components/calculator-factory-portal.tsx','src/components/calculator-factory-persisted-scenario.tsx','src/app/admin/calculator-factory/actions.ts','src/app/account/actions.ts'])sources[file]=createHash('sha256').update(await readFile(path.join(root,file))).digest('hex');report.sourceHashes=sources;
 await writeFile(path.join(artifacts,'receipt.json'),JSON.stringify(report,null,2)+'\n');
}catch(error){await writeFile(path.join(artifacts,'failure.json'),JSON.stringify({...report,error:error.stack},null,2));throw error;}finally{await writeFile(path.join(artifacts,'next.log'),logs);await browser?.close();if(app){app.kill('SIGTERM');await new Promise(r=>app.exitCode!==null?r():app.once('exit',r));}await db?.close();}
