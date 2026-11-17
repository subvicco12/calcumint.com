import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
import {startNextRuntime} from '../next-runtime/server.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGSERVICE','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External selector refused: '+key);
assert.equal(process.argv.length,2,'No connection arguments accepted');
const artifacts=path.resolve(process.env.FIRST_FIVE_AUTH_ARTIFACTS||'docs/first-five-20261109/authenticated');
await mkdir(artifacts,{recursive:true});await mkdir(artifacts+'/downloads',{recursive:true});
const baseline=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourcePaths=['tests/first-five-20261109/authenticated-browser.mjs','tests/next-runtime/server.mjs','tests/next-runtime/cdp.mjs','tests/next-runtime/recorded-download.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs','src/app/account/calculators/[slug]/page.tsx','src/components/calculator-interactive.tsx','src/components/calculator-account-actions.tsx','src/components/calculator-scenario-workspace.tsx','src/components/scenario-set-recovery.tsx','src/components/saved-calculation-actions.tsx','src/app/account/actions.ts','src/app/account/history/page.tsx','src/app/account/saved/page.tsx','src/app/account/projects/[id]/page.tsx','src/components/technology-five-analysis.tsx','src/lib/technology-five-analysis.ts','src/calculators/technology-computing/catalog-batch-1.ts','src/calculators/technology-computing/catalog-batch-2.ts','src/calculators/technology-computing/catalog-batch-3.ts','src/lib/draft-account-access.ts','src/lib/account-persistence.ts','src/app/login/actions.ts'];
const sha=b=>createHash('sha256').update(b).digest('hex');
// Capture before starting the source-copy server; concurrent integration cannot silently relabel the tested bytes.
const sourceHashes=Object.fromEntries(await Promise.all(sourcePaths.map(async p=>[p,sha(await readFile(p))])));
const cases=[{id:386,slug:'base64-size-calculator',field:'inputBytes',value:1000,expected:1336,alternate:1003,alternateExpected:1340},{id:370,slug:'bandwidth-calculator',field:'dataMegabytes',value:100,expected:80,alternate:200,alternateExpected:160},{id:371,slug:'download-time-calculator',field:'dataMegabytes',value:100,expected:10,alternate:200,alternateExpected:20},{id:372,slug:'upload-time-calculator',field:'dataMegabytes',value:100,expected:10,alternate:200,alternateExpected:20},{id:373,slug:'data-transfer-calculator',field:'bandwidthMbps',value:80,expected:100,alternate:160,alternateExpected:200}];
const checks=[],journeys=[],exports=[];let db,next,browser;const copiedSourceHashes={};
const ok=async q=>{const r=await q;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const pass=message=>{checks.push(message);console.log('PASS '+message);};
const cookie=session=>({name:'sb-127-auth-token',value:'base64-'+Buffer.from(JSON.stringify(session)).toString('base64url')});
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const users=[];
 for(const plan of ['free','pro','business']){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const data=await ok(sdk.auth.signUp({email:plan+'-'+randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));
  if(plan!=='free')await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${data.user.id}';`);
  users.push({plan,sdk,id:data.user.id,session:data.session});
 }
 await db.sql(`GRANT SELECT ON public.platform_admins TO authenticated;INSERT INTO public.platform_admins(user_id,role,active) VALUES ${users.map(u=>`('${u.id}','reviewer',true)`).join(',')};`);
 next=await startNextRuntime({root:process.cwd(),auth:{url:db.url},db,artifacts});
 for(const p of sourcePaths.filter(p=>p.startsWith('src/'))){copiedSourceHashes[p]=sha(await readFile(path.join(next.dir,p)));assert.equal(copiedSourceHashes[p],sourceHashes[p],'Test copy exact source '+p);}
 browser=await startBrowser(next.url,[db.url]);await browser.send('Accessibility.enable');await browser.send('Emulation.setDeviceMetricsOverride',{width:360,height:1000,deviceScaleFactor:1,mobile:true});
 const visit=async route=>{await browser.send('Page.navigate',{url:next.url+route});await browser.until('document.readyState==="complete"');};
 const bodyHas=s=>`document.body.innerText.toLowerCase().includes(${JSON.stringify(s.toLowerCase())})`;
 const enabled=label=>`[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===${JSON.stringify(label)}&&!b.disabled&&b.getClientRects().length)`;
 const reveal=async summary=>{await browser.until(`[...document.querySelectorAll('summary')].some(s=>s.textContent.trim()===${JSON.stringify(summary)}&&Object.keys(s).some(k=>k.startsWith('__reactProps$')))&&!document.body.innerText.includes('Verifying account session')`);if(!await browser.js(`[...document.querySelectorAll('summary')].find(s=>s.textContent.trim()===${JSON.stringify(summary)}).parentElement.open`)){const point=await browser.js(`(()=>{const e=[...document.querySelectorAll('summary')].find(s=>s.textContent.trim()===${JSON.stringify(summary)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await browser.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await browser.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});}};
 const download=async(label,filename,tag)=>{const d=await recordedDownload(browser,{label,filename,directory:artifacts+'/downloads'});const relative=path.relative(artifacts,d.file);exports.push({tag,label,filename,file:relative,sha256:sha(d.bytes),bytes:d.bytes.length,events:d.events.map(event=>Object.fromEntries(Object.entries(event).filter(([key])=>key!=='url')))});return d.bytes;};
 for(const user of users){
  await browser.identity(cookie(user.session));let project;
  if(user.plan!=='free'){
   await visit('/account');await browser.until('!!document.querySelector("input[name=name]")');await browser.field('input[name=name]','First five '+user.plan);await browser.click('Create project');await browser.until(bodyHas('First five '+user.plan));project=await ok(user.sdk.from('calculation_projects').select('*').eq('user_id',user.id).single());
  }
  for(const c of cases){
   const tag=user.plan+':#'+c.id;
   await visit('/account/calculators/'+c.slug);await reveal('Existing website interface, where implemented');
   await browser.until(`document.querySelector('[data-technology-field=${c.field}]')&&${enabled('Save calculation')}`);
   await reveal('Existing website interface, where implemented');await browser.field('[data-technology-field='+c.field+']',String(c.value));
   assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,tag+' mobile layout');
   const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value==='Save calculation'),tag+' accessible save');
   await browser.click('Save calculation');await browser.until(bodyHas('Calculation saved to your history.'));
   const history=await ok(user.sdk.from('calculation_history').select('*').eq('user_id',user.id).eq('calculator_slug',c.slug).single());
   assert.equal(history.calculator_version,1);assert.equal(history.input_data[c.field],c.value);assert.equal(history.output_data.value,c.expected);
   await reveal('Your A/B/C scenarios');
   if(user.plan==='free'){
    assert.equal(await browser.js(enabled('Capture baseline A')),false);assert.equal(await browser.js(enabled('Export JSON')),false);
    pass(tag+' native save, Free export/scenario gates');
   }else{
    await browser.click('Capture baseline A');await browser.until(bodyHas('Captured baseline A from the current calculation.'));
    await browser.field('[data-technology-field='+c.field+']',String(c.alternate));await browser.click('Capture scenario B');await browser.until(bodyHas('Captured scenario B from the current calculation.'));
    const bytes=await download('Export scenario set JSON',c.slug+'-scenarios.json',tag+' local A/B');const set=JSON.parse(bytes);
    assert.equal(set.calculatorSlug,c.slug);assert.equal(set.calculatorVersion,1);assert.deepEqual(set.scenarios.map(s=>[s.slot,s.input[c.field],s.output.value]),[['A',c.value,c.expected],['B',c.alternate,c.alternateExpected]]);
    await browser.click('Clear scenario set');await reveal('Recover an exported scenario set');await browser.field('.scenario-recovery textarea',bytes.toString());await browser.click('Verify and recover scenario set');await browser.until(bodyHas('Recovered 2 verified scenarios as a separate working set.'));
    // A mismatched arithmetic payload must not replace the recovered exact A/B snapshots.
    const tampered=structuredClone(set);tampered.scenarios[0].output.value+=1;await browser.field('.scenario-recovery textarea',JSON.stringify(tampered));await browser.click('Verify and recover scenario set');await browser.until(bodyHas('Recovery unavailable:'));
    const preserved=JSON.parse(await download('Export scenario set JSON',c.slug+'-scenarios.json',tag+' after rejected tamper'));assert.deepEqual(preserved,set);
    await browser.field('[data-technology-field='+c.field+']',String(c.value));pass(tag+' immutable native A/B, actual JSON download/recovery and strict tamper rejection');
   }
   await visit('/account/history');await browser.until(bodyHas(c.slug));await visit('/account/saved?source=history&id='+history.id);await browser.until(bodyHas(c.slug));await browser.until(enabled('Verify exact engine agreement'));await browser.click('Verify exact engine agreement');await browser.until(bodyHas('Exact engine agreement verified'));
   if(user.plan==='free')assert.equal(await browser.js(enabled('Export recorded JSON')),false);
   else{
    for(const format of ['JSON','CSV','PDF']){
     const bytes=await download('Export recorded '+format,c.slug+'-v1.'+format.toLowerCase(),tag+' history '+format);
     if(format==='JSON')assert.deepEqual(JSON.parse(bytes),{calculatorSlug:c.slug,calculatorVersion:1,input:history.input_data,output:history.output_data});
     if(format==='CSV'){const csv=bytes.toString();assert(csv.includes(c.slug));assert(csv.includes('"output","value","'+c.expected+'"'));}
     if(format==='PDF'){assert(bytes.subarray(0,8).toString().startsWith('%PDF-1.7'));const text=execFileSync('pdftotext',['-layout','-','-'],{input:bytes,encoding:'utf8'});assert(text.includes(c.slug));assert(text.replace(/\s+/g,'').includes('Engineversion:1'));assert(text.replace(/\s+/g,'').includes('output["value"]='+c.expected),'PDF exact raw output');}
    }
    await visit('/account/projects/'+project.id+'?historyId='+history.id);await browser.until('!!document.querySelector("input[name=name]")');await browser.field('input[name=name]','First five '+c.id);await browser.click('Save scenario');await browser.until(bodyHas('First five '+c.id));const scenario=await ok(user.sdk.from('saved_scenarios').select('*').eq('user_id',user.id).eq('calculator_slug',c.slug).single());assert.deepEqual(scenario.input_data,history.input_data);assert.deepEqual(scenario.output_data,history.output_data);
    await visit('/account/saved?source=scenario&id='+scenario.id);await browser.until(enabled('Verify exact engine agreement'));await browser.click('Verify exact engine agreement');await browser.until(bodyHas('Exact engine agreement verified'));
    // A different genuine owner, including another paid owner, cannot open either record.
    const other=users.find(u=>u.id!==user.id&&u.plan!=='free');await browser.identity(cookie(other.session));for(const [source,id] of [['history',history.id],['scenario',scenario.id]]){await visit('/account/saved?source='+source+'&id='+id);await browser.until(bodyHas('Saved calculation unavailable'));assert.equal(await browser.js('!!document.querySelector("[aria-label=\\"Saved calculation tools\\"]")'),false);}
    await browser.identity(cookie(user.session));
   }
   const unchanged=await ok(user.sdk.from('calculation_history').select('*').eq('id',history.id).single());assert.deepEqual(unchanged.input_data,history.input_data);assert.deepEqual(unchanged.output_data,history.output_data);
   journeys.push({masterId:c.id,slug:c.slug,version:1,plan:user.plan,input:history.input_data,output:history.output_data,historyRead:true,exactReplay:true,persistedScenario:user.plan!=='free',localAB:user.plan!=='free',nativeRecordedExports:user.plan==='free'?[]:['JSON','CSV','PDF'],crossOwner:user.plan!=='free'});pass(tag+' owned native history/replay'+(user.plan==='free'?'':'/exports/persisted scenario/cross-owner denial'));
  }
 }
 const revoked=users[2];await browser.identity(cookie(revoked.session));await db.sql(`UPDATE public.platform_admins SET active=false WHERE user_id='${revoked.id}';`);for(const c of cases){await visit('/account/calculators/'+c.slug);await browser.until(bodyHas('Reviewer access required'));assert.equal(await browser.js('!!document.querySelector("[data-technology-field]")'),false);}pass('Reviewer role revocation denies all five existing private routes');
 await visit('/account');await browser.until(enabled('Sign out'));await browser.click('Sign out');await browser.until('location.pathname==="/"');
 const sid=JSON.parse(Buffer.from(revoked.session.access_token.split('.')[1],'base64url')).session_id;
 assert.equal(await db.sql(`SELECT count(*) FROM auth.sessions WHERE id='${sid}';`),'0');assert((await revoked.sdk.auth.refreshSession({refresh_token:revoked.session.refresh_token})).error);
 await visit('/account/history');await browser.until('location.pathname==="/login"||document.body.innerText.includes("Sign in to continue")');for(const c of cases)assert(!(await browser.text()).includes(c.slug),'No history disclosed after sign-out');pass('Native sign-out clears browser access, deletes issuer session and rejects old refresh');
 const oldAccess=await fetch(db.url+'/rest/v1/calculation_history',{headers:{authorization:'Bearer '+revoked.session.access_token,apikey:db.anonKey}});assert.equal(oldAccess.status,200);pass('Measured limitation: unexpired signed access JWT still accepted by PostgREST after logout');
 assert.deepEqual(browser.errors,[]);
 await writeFile(artifacts+'/receipt.json',JSON.stringify({kind:'FIVE_GENUINE_AUTHENTICATED_NATIVE_UI_FINITE_ACCEPTANCE',passed:true,testedBaseline:baseline,sourceHashes,copiedSourceHashes,fixture:db.provenance,identities:cases.map(({id,slug})=>({masterId:id,slug,version:1})),plans:['free','pro','business'],journeys,checks,exports,requests:db.requests,limits:['Disposable real GoTrue/PostgREST and source-copy Next dev fixture; no production schema equivalence, publication or source/specialist approval','Reviewer role and Pro/Business plans assigned only by privileged fixture setup; billing not exercised','No synthetic identity or extra application route; existing private reviewer routes render real calculator/account components','Native completed downloads observed via Browser.downloadProgress and files read from disk; no Blob interception','Logout revokes refresh/session and clears native cookie; unexpired signed access JWT remains accepted by PostgREST until expiry, so immediate all-API revocation remains unresolved if governing policy requires it','Finite literal workflow witnesses reuse existing arithmetic; no new whole-domain mathematical proof','Current component source hashes bound before copy; later companion UI integration needs its separate acceptance']},null,2)+'\n');
}catch(error){await writeFile(artifacts+'/failure.txt',error.stack);if(browser)try{await writeFile(artifacts+'/failure.png',Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));await writeFile(artifacts+'/failure-page.txt',await browser.text());}catch{}throw error;}finally{await browser?.close();await next?.close();await db?.close();}
