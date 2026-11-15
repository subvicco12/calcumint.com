import assert from 'node:assert/strict';
import {mkdtemp,cp,symlink,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {startBusinessPredecessor,unhold} from '../milestone60-20261113/business-sql-fixture.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const source=process.env.WORKER_A_SOURCE_ROOT||path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const artifacts=process.env.WORKER_A_BROWSER_ARTIFACTS||'/workspace/artifacts/worker-a-intake-20261115/auth-browser-final';
const here=path.dirname(new URL(import.meta.url).pathname);
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
let db,next,browser,overlay;const report={workerCommit:'56844ec40292b010bc89ad7371c2d0340340bafe',checks:[],productionWrites:false,publicationFixture:false,releaseHold:true,limitations:['Disposable additional private fixture route; not production routing or competent approval.','Current shared Business packet/recovery compatibility remains blocked and is not replaced in this fixture.']};
try{
 await mkdir(artifacts,{recursive:true});overlay=await mkdtemp('/tmp/worker-a-intake-overlay-');
 for(const entry of ['src','data','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs'])try{await cp(path.join(source,entry),path.join(overlay,entry),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const entry of ['node_modules','docs','tests','scripts'])await symlink(path.join(source,entry),path.join(overlay,entry));
 const route=path.join(overlay,'src/app/worker-a-intake');await mkdir(route,{recursive:true});
 for(const [from,to]of [['fixtures/page.tsx','page.tsx'],['fixtures/client.tsx','client.tsx'],['fixtures/actions.ts','actions.ts']])await cp(path.join(here,from),path.join(route,to));
 db=await startBusinessPredecessor();registerCredentials(db.anonKey,db.serviceKey);
 for(const file of ['docs/milestone60-20261113/held-business-successor.sql','docs/milestone100-20261114/business-held-successor.sql']){const raw=await readFile(path.join(source,file),'utf8');await assert.rejects(db.sql(raw),/UNAPPLIED/);await db.sql(unhold(raw));}
 await db.sql("NOTIFY pgrst,'reload schema';");
 const users={};for(const plan of ['free','pro','business']){
  const password='Isolated-'+randomUUID();registerCredentials(password);
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));
  registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:values=>cookies=values}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));users[plan]={id:auth.user.id,sdk,cookies};
 }
 const owner=users.business;
 const organization=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Worker A isolated recovery',org_slug:'intake-'+randomUUID()}));
 const project=await ok(owner.sdk.from('business_projects').insert({organization_id:organization,name:'Exact v1 recovery',created_by:owner.id}).select().single());
 const shareClient=createClient(db.url,db.serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const request={organizationId:organization,projectId:project.id,clientWorkspaceId:null,requestId:randomUUID(),title:'Retained v1 exact zero',snapshot:{calculatorSlug:'remainder-calculator',calculatorVersion:1,input:{a:1.5,b:.5},output:{result:0}}};
 const record=await ok(shareClient.rpc('share_factory_nine_snapshot',{actor_id:owner.id,request_payload:request}));
 const recoveryRoute='/worker-a-intake?organization='+organization+'&project='+project.id+'&record='+record;
 console.log('Genuine isolated accounts and Business v1 record ready; starting single webpack build');
 next=await startProductionRuntime({root:overlay,auth:db,db,artifacts,conditionalPublicationFixture:false});
 browser=await startBrowser(next.url);
 await browser.visit('/worker-a-intake');assert.match(await browser.js('location.pathname'),/^\/login/);report.checks.push('Unauthenticated private fixture denied');
 async function identity(user){await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});}
 for(const plan of ['free','pro','business']){
  const user=users[plan];await identity(user);await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await browser.visit('/worker-a-intake');
  await browser.field('input[name=a]','1.5');await browser.field('input[name=b]','.5');await browser.click('Calculate');await browser.until('!!document.querySelector("table")');
  assert.equal(await browser.js('document.querySelector("table tbody td").textContent'),'0');
  const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value==='Dividend'));assert(ax.nodes.some(n=>n.name?.value==='Divisor'));
  assert(await browser.js('document.documentElement.scrollWidth<=innerWidth'),'No horizontal mobile overflow');
  await browser.click('Save calculation');await browser.until('!!document.querySelector("[role=alert]")');
  let rows=await ok(user.sdk.from('calculation_history').select('id,calculator_slug,calculator_version,input_data,output_data'));
  assert.equal(rows.length,1);assert.equal(rows[0].calculator_slug,'remainder-calculator');assert.equal(rows[0].calculator_version,1);assert.equal(rows[0].output_data.result,0);
  await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Verified authenticated history saved")');
  const retry=await ok(user.sdk.from('calculation_history').select('id'));assert.deepEqual(retry.map(r=>r.id),rows.map(r=>r.id));
  const foreign=users[plan==='free'?'business':'free'];assert.equal((await ok(foreign.sdk.from('calculation_history').select('id').eq('id',rows[0].id))).length,0);
  await browser.field('input[name=b]','0');await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js('!!document.querySelector("table")'),false);
  await browser.field('input[name=b]','.5');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await browser.until('!!document.querySelector("table")');
  report.checks.push(`${plan}: exact zero, real authenticated save, post-commit response-loss recovery, atomic deduplication, cross-account RLS denial, mobile/AX labels, invalid-divisor refusal and keyboard recovery`);
 }
 await identity(users.business);await browser.visit(recoveryRoute);await browser.until('!!document.querySelector("pre[aria-label]")');
 const recovered=JSON.parse(await browser.js('document.querySelector("pre[aria-label]").textContent'));assert.deepEqual(recovered,request.snapshot);report.checks.push('Actual authenticated Business template loader recovers immutable v1 exact-zero snapshot');
 await identity(users.free);await browser.visit(recoveryRoute);assert.match(await browser.text(),/Business recovery denied/);report.checks.push('Actual Business template reader denies Free account');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${organization}' AND user_id='${owner.id}';`);
 await identity(owner);await browser.visit(recoveryRoute);assert.match(await browser.text(),/Business recovery denied/);report.checks.push('Actual Business template reader denies revoked membership');
 report.passed=true;
}catch(e){report.passed=false;report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();if(overlay)await rm(overlay,{recursive:true,force:true});await writeFile(path.join(artifacts,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failure:report.failure}));}
