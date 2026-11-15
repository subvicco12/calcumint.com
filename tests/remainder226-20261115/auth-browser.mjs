import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {startBusinessPredecessor,unhold} from '../milestone60-20261113/business-sql-fixture.mjs';
import {startProductionRuntime} from '../completion-delivery-20261112/runtime.mjs';
import {registerCredentials,redactText,evidenceJSON} from '../completion-delivery-20261112/evidence.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
const root=process.cwd(),out=process.env.REMAINDER226_ARTIFACTS||'/tmp/remainder226-evidence/authenticated';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External connection selector refused');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const sha=b=>createHash('sha256').update(b).digest('hex');
const report={catalogId:226,revision:'private.remainder-exact-zero.20261114.2',checks:[],exports:[],productionWrites:false,releaseHold:true,publicationAuthorityFixture:false,scope:'Actual private portal, actual application server actions and unchanged RLS on disposable PostgreSQL17/GoTrue/PostgREST. Loopback auth transport; not production qualification.'};
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
let db,next,browser;
try{
 await mkdir(out,{recursive:true});db=await startBusinessPredecessor();registerCredentials(db.anonKey,db.serviceKey);
 for(const f of ['docs/milestone60-20261113/held-business-successor.sql','docs/milestone100-20261114/business-held-successor.sql']){const sql=await readFile(f,'utf8');await assert.rejects(db.sql(sql),/UNAPPLIED/);await db.sql(unhold(sql));}
 await db.sql("NOTIFY pgrst,'reload schema';");
 const users={};for(const [name,plan] of [['free','free'],['pro','pro'],['owner','business'],['admin','business'],['member','business'],['outsider','business']]){
  const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),password='Isolated-'+randomUUID();registerCredentials(password);
  const auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password}));registerCredentials(auth.session.access_token,auth.session.refresh_token);
  await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';INSERT INTO public.platform_admins(user_id,role,active) VALUES('${auth.user.id}','admin',true);`);
  let cookies=[];const ssr=createServerClient(db.url,db.anonKey,{cookies:{getAll:()=>cookies,setAll:value=>cookies=value}});await ok(ssr.auth.setSession(auth.session));registerCredentials(cookies.map(c=>c.value));
  const project=plan==='free'?null:await ok(sdk.from('calculation_projects').insert({user_id:auth.user.id,name:name+' exact-zero scenarios'}).select('id').single());
  users[name]={sdk,id:auth.user.id,cookies,project};
 }
 const owner=users.owner,org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Remainder private acceptance',org_slug:'remainder-'+randomUUID()}));
 const project=await ok(owner.sdk.from('business_projects').insert({organization_id:org,name:'Exact zero immutable team',created_by:owner.id}).select().single());
 for(const role of ['admin','member'])await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users[role].id}','${role}');`);
 console.log('Disposable genuine accounts ready; building unchanged production-mode application');
 next=await startProductionRuntime({root,auth:db,db,artifacts:out,conditionalPublicationFixture:false});
 browser=await startBrowser(next.url);
 const press=async(key,code,text)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code,...(text?{text}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});};
 const select=async(selector,value)=>{await browser.until(`!!document.querySelector(${JSON.stringify(selector)})&&Object.keys(document.querySelector(${JSON.stringify(selector)})).some(k=>k.startsWith('__reactProps$'))`);await browser.js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);};
 const selectLabel=async(label,value)=>{const selector=await browser.js(`(()=>{const l=[...document.querySelectorAll('label')].find(l=>l.textContent.startsWith(${JSON.stringify(label)}));const e=l?.querySelector('select');if(!e)throw Error('Missing labeled select');e.setAttribute('data-accept-select','active');return '[data-accept-select=active]'})()`);await select(selector,value);await browser.js(`document.querySelector('[data-accept-select=active]')?.removeAttribute('data-accept-select')`);};
 const identity=async user=>{await browser.send('Network.clearBrowserCookies');for(const c of user.cookies)await browser.send('Network.setCookie',{name:c.name,value:c.value,url:next.url,httpOnly:false,sameSite:'Lax'});};
 const portal=async user=>{await identity(user);await browser.visit('/admin/calculator-factory');await browser.until('!!document.querySelector("select")');await selectLabel('Engineering contract','226');await browser.until('!!document.querySelector("input[name=a]")');await browser.field('input[name=a]','1.5');await browser.field('input[name=b]','.5');await browser.click('Calculate');await browser.until('!!document.querySelector('+JSON.stringify('table[aria-label="Exact signed remainder"]')+')');};
 const text=()=>browser.text();
 await browser.visit('/admin/calculator-factory');await browser.until('location.pathname.startsWith("/login")');pass('Unauthenticated private portal denied');
 for(const name of ['free','pro','owner']){
  const user=users[name];await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await portal(user);
  assert.equal(await browser.js('document.querySelector("table tbody td").textContent'),'0');assert(await browser.js('document.documentElement.scrollWidth<=innerWidth'));
  const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value==='Dividend'));assert(ax.nodes.some(n=>n.name?.value==='Divisor'));
  await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Saved to your authenticated calculation history.")');
  const history=await ok(user.sdk.from('calculation_history').select('*').eq('calculator_slug','remainder-calculator'));assert.equal(history.length,1);assert.deepEqual(history[0].input_data,{a:1.5,b:.5});assert.equal(history[0].output_data.result,0);assert.equal(history[0].calculator_version,1);
  await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Saved to your authenticated calculation history.")');assert.equal((await ok(user.sdk.from('calculation_history').select('id'))).length,1);
  assert.equal((await ok(users.outsider.sdk.from('calculation_history').select('id').eq('id',history[0].id))).length,0);
  pass(name+': exact zero, AX labels/mobile, actual history persistence, same-request deduplication and foreign RLS denial');
  if(name==='free'){
   await browser.click('Export JSON');await browser.until('!!document.querySelector("[role=alert]")');assert.match(await text(),/Pro/);
   assert.equal(await browser.js('!!document.querySelector('+JSON.stringify('section[aria-label="Persisted project scenarios"]')+')'),false);pass('Free export and scenario affordances denied');
  }else{
   for(const format of ['json','csv','pdf']){
    const download=await recordedDownload(browser,{label:'Download '+format.toUpperCase(),filename:'remainder-calculator-v1.'+format,directory:out});
    if(format==='json'){const packet=JSON.parse(download.bytes);assert.equal(packet.identity.catalogId,226);assert(packet.identity.sourceVersion.endsWith(report.revision));assert.equal(packet.snapshot.output.result,0);}
    if(format==='csv')assert.match(download.bytes.toString(),/result/);
    if(format==='pdf')assert.equal(download.bytes.subarray(0,5).toString(),'%PDF-');
    report.exports.push({plan:name,format,bytes:download.bytes.length,sha256:sha(download.bytes),file:path.relative(out,download.file)});
   }
   await browser.click('Load owned projects');await browser.until('document.body.innerText.includes("Owned projects loaded.")');
   await browser.field('section[aria-label="Persisted project scenarios"] input[maxlength="120"]','Exact zero scenario');
   await browser.click('Save project scenario');await browser.until('/Saved scenario [a-f0-9-]{36}\\./.test(document.body.innerText)');
   const scenarios=await ok(user.sdk.from('saved_scenarios').select('*'));assert.equal(scenarios.length,1);assert.deepEqual(scenarios[0].input_data,{a:1.5,b:.5});assert.equal(scenarios[0].output_data.result,0);
   await browser.field('input[name=a]','17');await browser.click('Calculate');await browser.click('Restore saved scenario');await browser.until('document.querySelector("input[name=a]").value==="1.5"');assert.equal(await browser.js('document.querySelector("table tbody td").textContent'),'0');
   assert.equal((await ok(users.outsider.sdk.from('saved_scenarios').select('id').eq('id',scenarios[0].id))).length,0);
   pass(name+': JSON/CSV/PDF native download readback and genuine persisted scenario restore/foreign denial');
  }
  await browser.field('input[name=b]','0');await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js('!!document.querySelector('+JSON.stringify('table[aria-label="Exact signed remainder"]')+')'),false);
  await browser.field('input[name=b]','.5');await press('Enter',13,'\r');await browser.until('!!document.querySelector('+JSON.stringify('table[aria-label="Exact signed remainder"]')+')');pass(name+': invalid divisor hides stale output; trusted keyboard recovery succeeds');
 }
 for(const name of ['owner','admin','member']){
  const user=users[name];await portal(user);await browser.click('Load Business organizations');await browser.until('document.body.innerText.includes("Current Business organizations loaded.")');await selectLabel('Business organization',org);
  await browser.click('Load organization projects');await browser.until('document.body.innerText.includes("Current organization projects loaded.")');await selectLabel('Business project',project.id);
  await browser.click('Load shared workspace');await browser.until('document.body.innerText.includes("Current membership and shared workspace verified.")');
  await browser.field('section[aria-label="Factory shared Business workspace"] input[maxlength="240"]',name+' exact-zero shared');await browser.click('Share current verified snapshot');await browser.until('document.body.innerText.includes("Immutable shared record ")');
  const rows=await ok(user.sdk.from('technology_next_shared_snapshots').select('*').eq('project_id',project.id).eq('title',name+' exact-zero shared'));assert.equal(rows.length,1);assert.equal(rows[0].output_data.result,0);assert.deepEqual(rows[0].input_data,{a:1.5,b:.5});
  await browser.click('Load shared workspace');await browser.until('document.body.innerText.includes("Current membership and shared workspace verified.")');
  await browser.click('Open shared record as template');await browser.until('document.body.innerText.includes("Verified shared snapshot opened as an independent working template.")');
  assert.equal(await browser.js('document.querySelector('+JSON.stringify('table[aria-label="Exact signed remainder"] tbody td')+').textContent'),'0');
  assert.equal((await ok(users.outsider.sdk.from('technology_next_shared_snapshots').select('id').eq('id',rows[0].id))).length,0);
  pass(name+': actual Business share, template restore, exact v1 zero and cross-tenant isolation');
 }
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.member.id}';`);
 // Current page retains the selected organization/project but the server must recheck membership.
 await browser.click('Load shared workspace');await browser.until('!document.body.innerText.includes("Working…")');assert.match(await text(),/permission|unavailable|adoption/i);pass('Revoked member denied by actual server action despite retained UI selection');
 // Authenticated clients cannot call the service-only shared write RPC.
 const denied=await users.owner.sdk.rpc('share_factory_nine_snapshot',{actor_id:owner.id,request_payload:{}});assert(denied.error);pass('Authenticated role cannot bypass server-only shared writer RPC');
 const publication=await fetch(next.url+'/calculators/remainder-calculator');report.publicRouteStatus=publication.status;assert.equal(publication.status,404);pass('Private integration does not publish #226');
 assert.deepEqual(browser.errors,[]);report.images=db.provenance.images;report.passed=true;
}catch(error){report.passed=false;report.failure=redactText(error.stack||String(error));process.exitCode=1;}
finally{if(browser)await browser.close();if(next)await next.close();if(db)await db.close();await mkdir(out,{recursive:true});await writeFile(path.join(out,'receipt.json'),evidenceJSON(report));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,exports:report.exports.length,failure:report.failure}));}
