import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),out=process.env.WORKER2_POWER_BROWSER_ARTIFACTS||'/tmp/worker2-power-native';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused');
const stage=process.env.WORKER2_POWER_BROWSER_STAGE??'all';
assert(['all','history','revocation'].includes(stage));
const sha=b=>createHash('sha256').update(b).digest('hex');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={baseline:'8d0c1df303ff8b2551e73aa1fe742f70e1fcc5ca',rows:[],checks:[],downloads:[],productionWrites:false,releaseHold:true,publicationFixture:false,canonicalApproval:false,scope:'Disposable repository-model PostgreSQL17/GoTrue/PostgREST; actual private page and existing atomic account actions. Loopback transport is not production equivalence. Business team/native/job capabilities remain blocked.'};
let db,next,browser;
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
try{
 await mkdir(out,{recursive:true});await build({entryPoints:[path.join(root,'src/lib/worker2-automotive-power-20261118/cohort.ts')],outfile:path.join(out,'cohort.mjs'),platform:'node',format:'esm',bundle:true,alias:{'@':path.join(root,'src')},logLevel:'silent'});
 const api=await import(pathToFileURL(path.join(out,'cohort.mjs')));const cases=api.powerContracts.map(row=>{const c=api.powerContract(row.catalogId);const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));return {id:c.catalogId,slug:c.slug,title:c.title,unit:c.unit,first:c.fields[0].key,firstLabel:c.fields[0].label,raw,packet:api.powerWorkflows(c.catalogId).execute(raw)};});
 assert.equal(cases.length,2);
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};for(const [name,plan] of [['free','free'],['pro','pro'],['business','business'],['outsider','business'],['member','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const email=randomUUID()+'@example.invalid';registerCredentials(email);
  const auth=await ok(sdk.auth.signUp({email,password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
  if(name!=='outsider')await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' power scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,email,password,project};
 }
 const owner=users.business,org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Worker2 isolated power',org_slug:'automotive-'+randomUUID()}));
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users.member.id}','member');`);
 console.log('Genuine accounts and RLS ready; one production webpack build');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});browser=await startBrowser(next.url);
 const q=(selector,tail='')=>(tail?'':'!!')+'document.querySelector('+JSON.stringify(selector)+')'+tail;
 const visit=async route=>{const n=await browser.send('Page.navigate',{url:next.url+route});assert(n.loaderId);let ready=false;for(let i=0;i<500;i++){if((await browser.send('Page.getFrameTree')).frameTree.frame.loaderId===n.loaderId){try{if(await browser.js('document.readyState==="complete"&&!!document.body')){ready=true;break;}}catch(e){if(!/context|navigat/i.test(String(e)))throw e;}}await new Promise(r=>setTimeout(r,60));}assert(ready,'Fresh authenticated document required');};
 const identity=async user=>{
  await browser.send('Network.clearBrowserCookies');
  await visit('/login');
  await browser.field('input[name="email"]',user.email);
  await browser.field('input[name="password"]',user.password);
  const position=await browser.js(`(()=>{const button=document.querySelector('input[name="password"]').form.querySelector('button[type="submit"]');button.scrollIntoView({behavior:'instant',block:'center'});const r=button.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  for(const type of ['mousePressed','mouseReleased'])await browser.send('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...position});
  await browser.until('location.pathname==="/account"',120000);
  const cookies=await browser.send('Network.getCookies',{urls:[next.url]});
  assert(cookies.cookies.some(cookie=>cookie.name.startsWith('sb-')&&cookie.name.includes('-auth-token')));
 };
 const choose=async id=>{await browser.until(q('select',"&&Object.keys(document.querySelector('select')).some(k=>k.startsWith('__reactProps$'))"));await browser.js(`(()=>{const s=document.querySelector('select');s.value=${JSON.stringify(String(id))};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(q('input[name='+cases.find(c=>c.id===id).first+']'));};
 await visit('/admin/worker2-automotive-power-20261118');assert.match(await browser.js('location.pathname'),/^\/login/);pass('Unauthenticated private route denied');
 await identity(users.outsider);await visit('/admin/worker2-automotive-power-20261118');assert.match(await browser.text(),/Authorized.*access required/);pass('Authenticated non-reviewer private route denied');
 if(stage==='all')for(const plan of ['free','pro','business']){
  const user=users[plan];await identity(user);await visit('/admin/worker2-automotive-power-20261118');await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const c of cases){
   await choose(c.id);await browser.click('Calculate');await browser.until(q('[aria-label="Calculation result"]'));
   assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);assert(await browser.js('document.documentElement.scrollWidth<=innerWidth'),'Mobile width');
   const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value?.includes(c.firstLabel)));
   await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Authenticated immutable history saved:")');
   const history=await ok(user.sdk.from('calculation_history').select('*').eq('calculator_slug',c.slug));assert.equal(history.length,1);assert.deepEqual(history[0].input_data,c.packet.snapshot.input);assert.deepEqual(history[0].output_data,c.packet.snapshot.output);
   await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Authenticated immutable history saved:")');assert.equal((await ok(user.sdk.from('calculation_history').select('id').eq('calculator_slug',c.slug))).length,1);
   assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',history[0].id))).length,0);
   const historySelector=await browser.js(`(()=>{const label=[...document.querySelectorAll('label')].find(x=>x.textContent.startsWith('Saved history ID'));label.querySelector('input').setAttribute('data-power-history','true');return '[data-power-history]'})()`);
   await browser.field('input[name='+c.first+']','7');
   await browser.field(historySelector,history[0].id);
   await browser.click('Restore owned history');
   await browser.until(q('input[name='+c.first+']','.value===')+JSON.stringify(c.raw[c.first]));
   await browser.until(q('[aria-label="Calculation result"]'));
   const row={id:c.id,plan,ownedHistoryRestored:true,historyId:history[0].id,mathematicalParity:true,mobileAndAX:true,foreignHistoryDenied:true};
   if(plan==='free'){
    await browser.click('Export JSON');await browser.until(q('[role=alert]'));assert.match(await browser.text(),/Pro/);
    assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Save project scenario")'),false);
   }else{
    await browser.click('Load owned projects');await browser.until('document.body.innerText.includes("Owned projects loaded")');
    await browser.field('section[aria-label="Authenticated automotive power workflows"] input[maxlength="120"]','Case '+c.id);await browser.click('Save project scenario');await browser.until('/Saved scenario [a-f0-9-]{36}/.test(document.body.innerText)');
    const scenarios=await ok(user.sdk.from('saved_scenarios').select('*').eq('calculator_slug',c.slug));assert.equal(scenarios.length,1);assert.deepEqual(scenarios[0].input_data,c.packet.snapshot.input);assert.deepEqual(scenarios[0].output_data,c.packet.snapshot.output);
    assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenarios[0].id))).length,0);
    await browser.field('input[name='+c.first+']','7');await browser.click('Calculate');await browser.click('Restore saved scenario');await browser.until(q('input[name='+c.first+']','.value===')+JSON.stringify(c.raw[c.first]));
    row.scenarioRestore=true;row.foreignScenarioDenied=true;
    if(plan==='pro')for(const format of ['json','csv','pdf']){
     const d=await recordedDownload(browser,{label:'Download '+format.toUpperCase(),filename:c.slug+'-v1.'+format,directory:out});
     if(format==='json')assert.deepEqual(api.powerWorkflows(c.id).replay(d.bytes.toString()),c.packet);
     if(format==='csv'){assert.match(d.bytes.toString(),/scopedMetadata/);assert(d.bytes.toString().includes(c.unit));}
     if(format==='pdf'){const text=execFileSync('pdftotext',['-','-'],{input:d.bytes,encoding:'utf8',timeout:10000});assert(text.includes(c.title));assert(text.replace(/\s+/g,' ').includes(c.unit));}
     report.downloads.push({id:c.id,format,file:path.relative(out,d.file),bytes:d.bytes.length,sha256:sha(d.bytes)});
    }

   }
   await browser.field('input[name='+c.first+']','');await browser.click('Calculate');await browser.until(q('[role=alert]'));assert.equal(await browser.js('!!'+q('[aria-label="Calculation result"]')),false);
   await browser.field('input[name='+c.first+']',c.raw[c.first]);await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await browser.until(q('[aria-label="Calculation result"]'));
   row.keyboardRecovery=true;report.rows.push(row);console.log('PASS '+plan+' #'+c.id);await writeFile(path.join(out,'progress.json'),evidenceJSON(report));
  }
 }
 if(stage!=='revocation'){
 const power=api.powerContract(475),input={kilowatts:1e-70},output=power.engine.calculate(input,{});
 const older=await ok(users.pro.sdk.from('calculation_history').insert({user_id:users.pro.id,calculator_slug:power.slug,calculator_version:1,input_data:input,output_data:output}).select('id').single());
 const unknown=await ok(users.pro.sdk.from('calculation_history').insert({user_id:users.pro.id,calculator_slug:power.slug,calculator_version:2,input_data:input,output_data:output}).select('id').single());
 await identity(users.pro);await visit('/admin/worker2-automotive-power-20261118');await choose(475);
 const historyInput='section[aria-label="Authenticated automotive power workflows"] label:first-of-type input';
 await browser.field(historyInput,unknown.id);await browser.click('Restore owned history');
 await browser.until('/Exact historical automotive power identity unavailable|Minified React error #441/.test(document.body.innerText)');
 assert.equal(await browser.js(q('[aria-label="Verified historical automotive power snapshot"]')),false);
 assert.equal(await browser.js(q('[aria-label="Calculation result"]')),false);
 await browser.field(historyInput,older.id);await browser.click('Restore owned history');
 await browser.until(q('[aria-label="Verified historical automotive power snapshot"]'));
 const recorded={calculatorSlug:power.slug,calculatorVersion:1,input,output};
 assert.deepEqual(JSON.parse(await browser.js(q('[aria-label="Verified historical automotive power snapshot"]','.textContent'))),recorded);
 assert.equal(await browser.js(q('[aria-label="Calculation result"]')),false);
 const historical=await recordedDownload(browser,{label:'Export recorded automotive power JSON',filename:power.slug+'-v1-recorded.json',directory:out});
 assert.deepEqual(JSON.parse(historical.bytes.toString()),recorded);
 report.downloads.push({id:475,format:'historical-json',file:path.relative(out,historical.file),bytes:historical.bytes.length,sha256:sha(historical.bytes)});
 pass('Older #475 v1 opens read-only and downloads exactly; unknown v2 denied');
 }
 if(stage!=='history'){
 const project=await ok(owner.sdk.from('business_projects').insert({organization_id:org,created_by:owner.id,name:'Revocation witness project'}).select('id').single());
 const projectRoute='/business/projects/'+project.id;
 await identity(users.outsider);await visit(projectRoute);await browser.until('document.body.innerText.includes("Shared project unavailable")');
 await identity(users.member);await visit(projectRoute);await browser.until('document.body.innerText.includes("Revocation witness project")');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.member.id}';`);
 await visit(projectRoute);await browser.until('document.body.innerText.includes("Shared project unavailable")');
 assert.doesNotMatch(await browser.text(),/Revocation witness project/);
 await identity(owner);await visit(projectRoute);await browser.until('document.body.innerText.includes("Revocation witness project")');
 pass('Foreign Business user denied; same-session membership revocation removes project access; owner retains access');
 await identity(users.pro);await visit('/admin/worker2-automotive-power-20261118');await choose(475);await browser.click('Calculate');await browser.until(q('[aria-label="Calculation result"]'));
 const historyBefore=await ok(users.pro.sdk.from('calculation_history').select('id'));
 await db.sql(`DELETE FROM public.platform_admins WHERE user_id='${users.pro.id}';`);
 await browser.click('Save calculation');await browser.until(q('[role=alert]'));
 assert.equal((await ok(users.pro.sdk.from('calculation_history').select('id'))).length,historyBefore.length);
 pass('Revoked reviewer cannot save through the already-loaded private server action');
 }
 report.stage=stage;report.expectedRows=stage==='all'?6:0;assert.equal(report.rows.length,report.expectedRows);assert.equal(report.downloads.length,stage==='all'?7:stage==='history'?1:0);assert.deepEqual(browser.errors,[]);report.images=db.provenance.images;report.runtime=process.version;const built=JSON.parse(await readFile(path.join(out,'build-source-sha256.json'),'utf8'));report.sourceFingerprintCount=Object.keys(built).length;assert(Object.values(built).every(row=>row.originalSHA256===row.builtSHA256));report.passed=true;
}catch(e){report.passed=false;report.failure=redactText(e.stack||String(e));process.exitCode=1;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,downloads:report.downloads.length,failure:report.failure}));}
