import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {execFileSync} from 'node:child_process';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';

const root=process.cwd(),out=path.resolve(process.env.WORKER3_EVERYDAY_ARTIFACTS||'/tmp/worker3-everyday-sports-20261118');
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External database selector refused');
const sha=b=>createHash('sha256').update(b).digest('hex');
const ok=async promise=>{const r=await promise;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const report={kind:'GENUINE_DISPOSABLE_EVERYDAY_SPORTS_ACCEPTANCE_NOT_QUALIFICATION',baselineCommit:'a802d36db823c67fcea24ec001a7dfa27d43aca5',implementationCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),executionCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),startedUTC:new Date().toISOString(),rows:[],checks:[],downloads:[],negativeControls:[],historical:[],productionWrites:false,releaseHold:true,publicationFixture:false,canonicalApproval:false,limitations:['Genuine disposable PostgreSQL17.6/GoTrue/PostgREST with candidate repository schema plus locally adopted guarded review bundle, not current production equivalence.','Unchanged private admin page, server actions, engines, Next production build and CSP; loopback same-origin identity proxy only.','Fixture-only privileged plan/reviewer/membership setup is not billing, reviewer appointment or canonical approval.','Shared everyday writes/API/embed/jobs/webhooks remain capability-blocked; membership evidence concerns the existing generic Business reader.','Browser mobile emulation, not physical mobile hardware or complete WCAG attestation.']};
let db,next,browser,api,cases;
const checkpoint=async()=>writeFile(path.join(out,'progress.json'),evidenceJSON(report));
const pass=async value=>{report.checks.push(value);console.log('PASS '+value);await checkpoint();};
const route='/admin/worker3-everyday-sports-20261118';
const resultPresent='!!document.querySelector('+JSON.stringify('[aria-label="Calculation result"]')+')';
const workflowStatuses='[...document.querySelectorAll('+JSON.stringify('section[aria-label="Authenticated everyday workflows"] [role=status]')+')]';
try{
 await mkdir(out,{recursive:true});
 await build({entryPoints:[path.join(root,'src/lib/worker3-everyday-sports-20261118/cohort.ts')],outfile:path.join(out,'cohort.mjs'),platform:'node',format:'esm',bundle:true,alias:{'@':path.join(root,'src')},logLevel:'silent'});
 api=await import(pathToFileURL(path.join(out,'cohort.mjs')));
 cases=api.everydayContracts.map(c=>{const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));return {id:c.catalogId,slug:c.slug,title:c.title,unit:c.unit,fields:c.fields,raw,packet:api.everydayWorkflows(c.catalogId).execute(raw)};});
 assert.deepEqual(cases.map(c=>c.id),[508,513,514,515,519,520,521,523,524]);
 report.identities=cases.map(c=>({catalogId:c.id,...c.packet.identity,engineFile:c.id===508?'src/calculators/travel/catalog-batch-2.ts':c.id<=515?'src/calculators/travel/catalog-batch-1.ts':c.id<=520?'src/calculators/travel/catalog-batch-3.ts':'src/calculators/sports/catalog-batch-1.ts'}));
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});registerCredentials(db.anonKey,db.serviceKey);
 const users={};
 for(const [name,plan] of [['free','free'],['pro','pro'],['business','business'],['outsider','business'],['member','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
  if(name!=='outsider')await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:v=>cookies=v}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' everyday scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,cookies,project};
 }
 const owner=users.business,org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Worker3 isolated everyday',org_slug:'everyday-'+randomUUID()}));
 const businessProject=await ok(owner.sdk.from('business_projects').insert({organization_id:org,created_by:owner.id,name:'Membership visibility witness'}).select('id').single());
 report.fixture=db.provenance;
 console.log('Genuine accounts ready; building unchanged application once');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});browser=await startBrowser(next.url);
 await browser.send('Accessibility.enable');
 const visit=async pathname=>{
  const n=await browser.send('Page.navigate',{url:next.url+pathname});assert(n.loaderId);let ready=false;
  for(let i=0;i<500;i++){
   if((await browser.send('Page.getFrameTree')).frameTree.frame.loaderId===n.loaderId)try{if(await browser.js('document.readyState==="complete"&&!!document.querySelector("main")')){ready=true;break;}}catch(e){if(!/context|navigat/i.test(String(e)))throw e;}
   await new Promise(r=>setTimeout(r,60));
  }assert(ready,'Fresh authenticated document required');
 };
 const identity=async user=>{await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});};
 const press=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r'}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const choose=async c=>{
  await browser.until(`(()=>{const s=document.querySelector('select');return !!s&&Object.keys(s).some(k=>k.startsWith('__reactProps$'))})()`);
  await browser.js("document.querySelector('select').focus()");await press('Home','Home',36);
  for(let i=0;i<cases.indexOf(c);i++)await press('ArrowDown','ArrowDown',40);await press('Tab','Tab',9);
  await browser.until('document.querySelector("select").value==='+JSON.stringify(String(c.id))+'&&!!document.querySelector('+JSON.stringify('input[name='+c.fields[0].key+']')+')');
 };
 const byLabel=async text=>browser.js(`(()=>{const l=[...document.querySelectorAll('label')].find(l=>l.textContent.startsWith(${JSON.stringify(text)}));if(!l)throw Error('Missing label');const e=l.querySelector('input,textarea');e.setAttribute('data-worker3-field',${JSON.stringify(text)});return '[data-worker3-field='+JSON.stringify(${JSON.stringify(text)})+']'})()`);
 const field=async(text,value)=>browser.field(await byLabel(text),value);
 const status=()=>browser.js(workflowStatuses+'.map(e=>e.textContent).join("\\n")');
 const waitStatus=async text=>browser.until('[...document.querySelectorAll("[role=status]")].some(e=>e.textContent.includes('+JSON.stringify(text)+'))');
 const screenshot=async name=>writeFile(path.join(out,name),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await visit(route);assert.match(await browser.js('location.pathname'),/^\/login/);await pass('Unauthenticated private route denied');
 await identity(users.outsider);await visit(route);assert.match(await browser.text(),/Authorized.*access required/);await pass('Authenticated non-reviewer private route denied');

 // A complete representative precedes extension. One reusable fixture/build is retained.
 for(const c of cases){
  const histories={};
  for(const plan of ['free','pro','business']){
   const user=users[plan];await identity(user);await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:1000,deviceScaleFactor:1,mobile:true});await visit(route);await choose(c);
   await browser.click('Calculate');await browser.until(resultPresent);
   assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);assert(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),'Mobile overflow');
   const ax=await browser.send('Accessibility.getFullAXTree');for(const f of c.fields)assert(ax.nodes.some(n=>!n.ignored&&n.name?.value?.includes(f.label)),f.label+' accessible name');
   const targets=await browser.js(`(()=>[...document.querySelectorAll('.worker3-everyday-controls input,.worker3-everyday-controls select,.worker3-everyday-controls button,.worker3-everyday-controls textarea')].filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,name:e.getAttribute('name'),height:e.getBoundingClientRect().height})))()`);assert(targets.length>=c.fields.length+1,'Nonempty profile-scoped controls required');assert(targets.every(t=>t.height>=44),'44px visible controls');
   await browser.click('Save calculation');await waitStatus('Authenticated immutable history saved:');
   let history=await ok(user.sdk.from('calculation_history').select('*').eq('calculator_slug',c.slug));assert.equal(history.length,1);history=history[0];histories[plan]=history;
   assert.deepEqual(history.input_data,c.packet.snapshot.input);assert.deepEqual(history.output_data,c.packet.snapshot.output);
   await browser.click('Save calculation');await waitStatus('Authenticated immutable history saved:');assert.equal((await ok(user.sdk.from('calculation_history').select('id').eq('calculator_slug',c.slug))).length,1);
   assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',history.id))).length,0);
   const forged=await users.outsider.sdk.from('calculation_history').insert({user_id:user.id,calculator_slug:c.slug,calculator_version:1,input_data:c.packet.snapshot.input,output_data:c.packet.snapshot.output});assert(forged.error,'Foreign owner INSERT must fail');
   const foreignUpdate=await users.outsider.sdk.from('calculation_history').update({output_data:{value:999}}).eq('id',history.id).select('id');assert(foreignUpdate.error||foreignUpdate.data?.length===0);assert.deepEqual((await ok(user.sdk.from('calculation_history').select('output_data').eq('id',history.id).single())).output_data,c.packet.snapshot.output);
   const row={catalogId:c.id,plan,width:320,historyId:history.id,mathematicalParity:true,idempotentHistory:true,mobileAndAX:true,minimumTargetHeight:Math.min(...targets.map(t=>t.height)),foreignHistoryReadAndWriteDenied:true};
   await field('Saved history ID',history.id);await browser.click('Restore owned history');await waitStatus('Verified owned snapshot restored');row.ownedHistoryRestore=true;
   if(plan==='free'){
    await browser.click('Export JSON');await browser.until('!!document.querySelector("[role=alert]")');assert.match(await browser.text(),/Pro/);assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Save project scenario")'),false);row.freeEntitlementDenied=true;
   }else{
    await browser.click('Load owned projects');await waitStatus('Owned projects loaded');await field('Scenario name','Case '+c.id);await browser.click('Save project scenario');await waitStatus('Saved scenario ');
    const scenarios=await ok(user.sdk.from('saved_scenarios').select('*').eq('calculator_slug',c.slug));assert.equal(scenarios.length,1);const scenario=scenarios[0];
    assert.deepEqual(scenario.input_data,c.packet.snapshot.input);assert.deepEqual(scenario.output_data,c.packet.snapshot.output);row.scenarioId=scenario.id;
    assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenario.id))).length,0);
    const first=c.fields[0].key;await browser.field('input[name='+first+']',String(Number(c.raw[first])*2+1));await browser.click('Calculate');await browser.click('Restore saved scenario');await browser.until('document.querySelector('+JSON.stringify('input[name='+first+']')+').value==='+JSON.stringify(c.raw[first]));
    row.scenarioRestore=true;row.foreignScenarioReadDenied=true;
    if(plan==='pro'){
     // The other genuine account's identifiers reach the real server action, not a mocked transport.
     await field('Saved history ID',histories.free.id);await browser.click('Restore owned history');await browser.until(workflowStatuses+'.some(e=>e.textContent&&!/Working/.test(e.textContent)&&!e.textContent.includes("Verified owned snapshot restored"))');assert(!(await status()).includes('Verified owned snapshot restored'));row.foreignHistoryActionDenied=true;
     for(const format of ['json','csv','pdf']){
      const d=await recordedDownload(browser,{label:'Download '+format.toUpperCase(),filename:c.slug+'-v1.'+format,directory:out});
      if(format==='json')assert.deepEqual(api.everydayWorkflows(c.id).replay(d.bytes.toString()),c.packet);
      if(format==='csv'){assert.match(d.bytes.toString(),/outputUnit/);assert(d.bytes.toString().includes(c.unit));}
      if(format==='pdf'){const text=execFileSync('pdftotext',['-','-'],{input:d.bytes,encoding:'utf8',timeout:10000});assert(text.includes(c.title));assert(text.replace(/\s+/g,' ').includes('Result unit: '+c.unit));await writeFile(path.join(out,c.id+'-pdf-text.txt'),text);}
      report.downloads.push({catalogId:c.id,format,file:path.relative(out,d.file),bytes:d.bytes.length,sha256:sha(d.bytes),nativeCompleted:d.events.some(e=>e.state==='completed')});
     }
     await writeFile(path.join(out,c.id+'-ax.json'),evidenceJSON(ax));await screenshot(c.id+'-mobile.png');
     // A real downloaded packet goes through the native browser replay control.
     await field('Packet JSON to replay',api.everydayWorkflows(c.id).exportPacket(c.packet,'json','pro'));await browser.click('Replay packet');await browser.until(resultPresent);
     // Genuine native batch refusal/correction and A/B scenarios, without changing the shared workbench.
     await field('Batch rows',JSON.stringify(c.raw)+'\n'+JSON.stringify({...c.raw,[c.fields[0].key]:''}));await browser.click('Run batch');await browser.until('document.querySelectorAll(\'[aria-label="Batch results"] li\').length===2');
     await browser.click('Export batch JSON');await browser.until('!!document.querySelector("[role=alert]")');
     await field('Batch rows',JSON.stringify(c.raw)+'\n'+JSON.stringify(c.raw));await browser.click('Run batch');await browser.until('document.querySelectorAll(\'[aria-label="Batch results"] li\').length===2');await browser.click('Export batch JSON');
     await browser.until('!!document.querySelector(\'textarea[readonly]\')');const batchText=await browser.js('document.querySelector(\'textarea[readonly]\').value');const replayed=api.everydayWorkflows(c.id).replayBatch(batchText);assert.equal(replayed.length,2);for(const row of replayed)assert.deepEqual(row.packet,c.packet);await writeFile(path.join(out,c.id+'-native-batch.json'),batchText);row.nativeBatchRefusalCorrectionReplay=true;
     await browser.click('Capture scenario A');await browser.field('input[name='+c.fields[0].key+']',String(Number(c.raw[c.fields[0].key])*2+1));await browser.click('Calculate');await browser.click('Capture scenario B');
     const captured=await browser.js('Array.from(document.querySelectorAll(\'[aria-label="Captured scenarios"] pre\'),e=>JSON.parse(e.textContent))');assert.equal(captured.length,2);assert.notEqual(captured[0].value,captured[1].value);await writeFile(path.join(out,c.id+'-native-scenarios.json'),JSON.stringify(captured,null,2)+'\n');row.nativeScenarioAB=true;
     const altered=structuredClone(c.packet);altered.snapshot.output.value+=1;await field('Packet JSON to replay',JSON.stringify(altered));await browser.click('Replay packet');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js(resultPresent),false);
     row.nativeReplayAndTamperRefusal=true;
    }
   }
   await browser.field('input[name='+c.fields[0].key+']','');await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js(resultPresent),false);
   await browser.field('input[name='+c.fields[0].key+']',c.raw[c.fields[0].key]);await press('Enter','Enter',13);await browser.until(resultPresent);row.keyboardErrorRecovery=true;
   report.rows.push(row);await pass(plan+' #'+c.id);
  }
  await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users.member.id}','member');`);
  assert.equal((await ok(users.member.sdk.from('business_projects').select('id').eq('id',businessProject.id))).length,1);
  await identity(users.member);await visit(route);await choose(c);await field('Business organization ID',org);await browser.click('Check current Business capability');await waitStatus('Verified Business role: member');assert.match(await browser.text(),/require separately reviewed/);
  await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.member.id}';`);
  assert.equal((await ok(users.member.sdk.from('business_projects').select('id').eq('id',businessProject.id))).length,0);
  await browser.click('Check current Business capability');await browser.until(workflowStatuses+'.some(e=>e.textContent&&!/Working/.test(e.textContent)&&!e.textContent.includes("Verified Business role"))');assert(!(await status()).includes('Verified Business role'));
  report.negativeControls.push({catalogId:c.id,currentMemberReader:true,revokedMembershipRlsReadDenied:true,revokedMembershipActionDenied:true,everydayDeliveryStillBlocked:true});
  // Exact dispatch and immutable historical recovery are not conflated with current capture.
  const flow=api.everydayWorkflows(c.id);
  for(const mutate of [p=>p.identity.sourceVersion+='tampered',p=>p.identity.calculatorVersion=2,p=>p.snapshot.output.value+=1]){const p=structuredClone(c.packet);mutate(p);assert.throws(()=>flow.replay(JSON.stringify(p)));}
  assert.throws(()=>api.verifyEverydaySnapshot({...c.packet.snapshot,calculatorVersion:2}));
  if([513,514,515].includes(c.id)){
   const contract=api.everydayContract(c.id),input=Object.fromEntries(contract.fields.map(f=>[f.key,Number(f.defaultValue)]));input.people=1.5;
   const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:contract.engine.calculate(input,{})};assert.throws(()=>flow.execute(Object.fromEntries(Object.entries(input).map(([k,v])=>[k,String(v)]))),/whole/);assert.equal(api.prepareEverydayRecovery(snapshot).currentCaptureAvailable,false);
   // Owned persisted historical v1 remains viewable in the real browser, without recapture.
   const h=await ok(users.pro.sdk.from('calculation_history').insert({user_id:users.pro.id,calculator_slug:c.slug,calculator_version:1,input_data:input,output_data:snapshot.output}).select('id').single());
   await identity(users.pro);await visit(route);await choose(c);await field('Saved history ID',h.id);await browser.click('Restore owned history');await waitStatus('Verified historical snapshot opened read-only');
   const rendered=JSON.parse(await browser.js('document.querySelector('+JSON.stringify('[aria-label="Verified historical everyday snapshot"]')+').textContent'));assert.deepEqual(rendered,snapshot);
   const d=await recordedDownload(browser,{label:'Export recorded everyday JSON',filename:c.slug+'-v1-recorded.json',directory:out});assert.deepEqual(JSON.parse(d.bytes.toString()),snapshot);
   report.historical.push({catalogId:c.id,recordedV1Value:snapshot.output.value,newCaptureRefused:true,ownedReadOnlyBrowser:true,recordedDownload:path.relative(out,d.file),sha256:sha(d.bytes)});
  }
  await checkpoint();
  if(c.id===508){report.representativeComplete=true;await writeFile(path.join(out,'representative-508.json'),evidenceJSON(report));console.log('REPRESENTATIVE #508 COMPLETE; extending same proven pattern to remaining eight');}
 }
 assert.equal(report.rows.length,27);assert.equal(report.downloads.length,27);assert.equal(report.negativeControls.length,9);assert.equal(report.historical.length,3);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.sourceBindings={};for(const file of ['tests/worker3-everyday-sports-20261118/auth-browser.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs','tests/completion-delivery-20261112/runtime.mjs','tests/next-runtime/cdp.mjs','tests/next-runtime/recorded-download.mjs','src/lib/worker3-everyday-sports-20261118/cohort.ts','src/lib/worker3-everyday-sports-20261118/account.ts','src/components/worker3-everyday-sports-20261118/portal.tsx','src/components/worker3-everyday-sports-20261118/persistence.tsx','src/app/admin/worker3-everyday-sports-20261118/actions.ts','src/app/admin/worker3-everyday-sports-20261118/page.tsx',...new Set(report.identities.map(x=>x.engineFile))])report.sourceBindings[file]=sha(await readFile(path.join(root,file)));
 report.requests=db.requests;report.passed=true;
}catch(e){report.passed=false;report.failure=redactText(e.stack||String(e));process.exitCode=1;if(browser)try{await writeFile(path.join(out,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));await writeFile(path.join(out,'failure-body.txt'),redactText(await browser.text()));}catch{}}
finally{report.finishedUTC=new Date().toISOString();if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,rows:report.rows.length,downloads:report.downloads.length,failure:report.failure}));}
