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
const root=process.cwd(),out=process.env.WORKER1_ARTIFACTS||'/tmp/worker1-calendar-evidence/authenticated';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const sha=b=>createHash('sha256').update(b).digest('hex');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={baseline:'49ea243b5be7e1ee9f3cd8af7f936ab784402cf7',rows:[],checks:[],downloads:[],productionWrites:false,releaseHold:true,publicationFixture:false,canonicalApproval:false,scope:'Disposable repository-model PostgreSQL17/GoTrue/PostgREST; actual private page and existing atomic account actions. Loopback transport is not production equivalence. Business team/native/job capabilities remain blocked.'};
let db,next,browser;
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
try{
 await mkdir(out,{recursive:true});await build({entryPoints:[path.join(root,'src/lib/worker1-calendar-20261119/cohort.ts')],outfile:path.join(out,'cohort.mjs'),platform:'node',format:'esm',bundle:true,alias:{'@':path.join(root,'src')},logLevel:'silent'});
 const api=await import(pathToFileURL(path.join(out,'cohort.mjs')));const cases=api.calendarContracts.map(c=>{const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));return {id:c.catalogId,slug:c.slug,title:c.title,unit:c.unit,first:c.fields[0].key,firstLabel:c.fields[0].label,raw,packet:api.calendarWorkflows(c.catalogId).execute(raw)};});
 assert.equal(cases.length,9);
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};for(const [name,plan] of [['free','free'],['pro','pro'],['business','business'],['outsider','business'],['member','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
  if(name!=='outsider')await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:v=>cookies=v}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' calendar scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,cookies,project};
 }
 const owner=users.business,org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Worker1 isolated calendar',org_slug:'calendar-'+randomUUID()}));
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users.member.id}','member');`);
 console.log('Genuine accounts and RLS ready; one production webpack build');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});browser=await startBrowser(next.url);
 const q=(selector,tail='')=>(tail?'':'!!')+'document.querySelector('+JSON.stringify(selector)+')'+tail;
 const visit=async route=>{const n=await browser.send('Page.navigate',{url:next.url+route});assert(n.loaderId);let ready=false;for(let i=0;i<500;i++){if((await browser.send('Page.getFrameTree')).frameTree.frame.loaderId===n.loaderId){try{if(await browser.js('document.readyState==="complete"&&!!document.querySelector("main")')){ready=true;break;}}catch(e){if(!/context|navigat/i.test(String(e)))throw e;}}await new Promise(r=>setTimeout(r,60));}assert(ready,'Fresh authenticated document required');};
 const identity=async user=>{await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});};
 const choose=async id=>{await browser.until(q('select',"&&Object.keys(document.querySelector('select')).some(k=>k.startsWith('__reactProps$'))"));await browser.js(`(()=>{const s=document.querySelector('select');s.value=${JSON.stringify(String(id))};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(q('input[name='+cases.find(c=>c.id===id).first+']'));};
 await visit('/admin/worker1-calendar-20261119');assert.match(await browser.js('location.pathname'),/^\/login/);pass('Unauthenticated private route denied');
 await identity(users.outsider);await visit('/admin/worker1-calendar-20261119');assert.match(await browser.text(),/Authorized.*access required/);pass('Authenticated non-reviewer private route denied');
 for(const plan of ['free','pro','business']){
  const user=users[plan];await identity(user);await visit('/admin/worker1-calendar-20261119');await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const c of cases){
   await choose(c.id);await browser.click('Calculate');await browser.until(q('[aria-label="Calculation result"]'));
   assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);assert(await browser.js('document.documentElement.scrollWidth<=innerWidth'),'Mobile width');
   const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value?.includes(c.firstLabel)));
   await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Authenticated immutable history saved:")');
   const history=await ok(user.sdk.from('calculation_history').select('*').eq('calculator_slug',c.slug));assert.equal(history.length,1);assert.deepEqual(history[0].input_data,c.packet.snapshot.input);assert.deepEqual(history[0].output_data,c.packet.snapshot.output);
   await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Authenticated immutable history saved:")');assert.equal((await ok(user.sdk.from('calculation_history').select('id').eq('calculator_slug',c.slug))).length,1);
   assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',history[0].id))).length,0);
   const historyField='section[aria-label="Authenticated calendar workflows"] label:first-of-type input';
   await browser.field('input[name='+c.first+']','');
   await browser.field(historyField,history[0].id);
   await browser.click('Restore owned history');
   await browser.until(q('input[name='+c.first+']','.value===')+JSON.stringify(c.raw[c.first]));
   const row={id:c.id,plan,historyId:history[0].id,mathematicalParity:true,mobileAndAX:true,foreignHistoryDenied:true,historyRestore:true};
   if(plan==='free'){
    await browser.click('Export JSON');await browser.until(q('[role=alert]'));assert.match(await browser.text(),/Pro/);
    assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Save project scenario")'),false);
   }else{
    await browser.click('Load owned projects');await browser.until('document.body.innerText.includes("Owned projects loaded")');
    await browser.field('section[aria-label="Authenticated calendar workflows"] input[maxlength="120"]','Case '+c.id);await browser.click('Save project scenario');await browser.until('/Saved scenario [a-f0-9-]{36}/.test(document.body.innerText)');
    const scenarios=await ok(user.sdk.from('saved_scenarios').select('*').eq('calculator_slug',c.slug));assert.equal(scenarios.length,1);assert.deepEqual(scenarios[0].input_data,c.packet.snapshot.input);assert.deepEqual(scenarios[0].output_data,c.packet.snapshot.output);
    assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenarios[0].id))).length,0);
    await browser.field('input[name='+c.first+']','2001-01-01');await browser.click('Calculate');await browser.click('Restore saved scenario');await browser.until(q('input[name='+c.first+']','.value===')+JSON.stringify(c.raw[c.first]));
    row.scenarioRestore=true;row.foreignScenarioDenied=true;
    if(plan==='pro')for(const format of ['json','csv','pdf']){
     const d=await recordedDownload(browser,{label:'Download '+format.toUpperCase(),filename:c.slug+'-v1.'+format,directory:out});
     if(format==='json')assert.deepEqual(api.calendarWorkflows(c.id).replay(d.bytes.toString()),c.packet);
     if(format==='csv'){assert.match(d.bytes.toString(),/outputUnit/);assert(d.bytes.toString().includes(c.unit));}
     if(format==='pdf'){const text=execFileSync('pdftotext',['-','-'],{input:d.bytes,encoding:'utf8',timeout:10000});assert(text.includes(c.title));assert(text.replace(/\s+/g,' ').includes('Result unit: '+c.unit));}
     report.downloads.push({id:c.id,format,file:path.relative(out,d.file),bytes:d.bytes.length,sha256:sha(d.bytes)});
    }
    if(plan==='business'){
     // Labels, not positional input assumptions, identify the Business field.
     const selector=await browser.js(`(()=>{const l=[...document.querySelectorAll('label')].find(l=>l.textContent.startsWith('Business organization ID'));l.querySelector('input').setAttribute('data-worker1-org','true');return '[data-worker1-org]'})()`);
     await browser.field(selector,org);await browser.click('Check current Business capability');await browser.until('document.body.innerText.includes("Verified Business role: owner")');assert.match(await browser.text(),/require separately reviewed/);row.businessCapability='AUTHENTIC_OWNER_READ_WRITE_BLOCKED';
    }
   }
   await browser.field('input[name='+c.first+']','');await browser.click('Calculate');await browser.until(q('[role=alert]'));assert.equal(await browser.js('!!'+q('[aria-label="Calculation result"]')),false);
   await browser.field('input[name='+c.first+']',c.raw[c.first]);await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await browser.until(q('[aria-label="Calculation result"]'));
   row.keyboardRecovery=true;report.rows.push(row);console.log('PASS '+plan+' #'+c.id);await writeFile(path.join(out,'progress.json'),evidenceJSON(report));
  }
 }
 await identity(users.member);await visit('/admin/worker1-calendar-20261119');await choose(443);
 const orgField=await browser.js(`(()=>{const l=[...document.querySelectorAll('label')].find(l=>l.textContent.startsWith('Business organization ID'));l.querySelector('input').id='fixture-org';return '#fixture-org'})()`);
 await browser.field(orgField,org);await browser.click('Check current Business capability');
 await browser.until('document.body.innerText.includes("Verified Business role: member")');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.member.id}';`);
 await browser.click('Check current Business capability');
 await browser.until('document.body.innerText.includes("Business workspace access denied.")');
 assert(!(await browser.text()).includes('Verified Business role:'));
 pass('Same browser cookie denied after membership revocation');
 report.browserErrors=browser.errors;
 report.expectedRows=27;assert.equal(report.rows.length,27);assert.equal(report.downloads.length,27);assert.deepEqual(browser.errors,[]);report.images=db.provenance.images;report.passed=true;
}catch(e){report.passed=false;report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,downloads:report.downloads.length,failure:report.failure}));}
