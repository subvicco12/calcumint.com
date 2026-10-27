import {verifySourceCalculatorReview} from './source-calculator-review.mjs';
import {ownerPreviewReadyScript} from './owner-preview-readiness.mjs';
import assert from 'node:assert/strict';
import {mkdir,readFile,unlink} from 'node:fs/promises';
import path from 'node:path';
export async function verifyCalculatorReview({db,auth,browser,journey,artifacts}){
 const ready=`!document.body.innerText.includes('Verifying account session')`;
 await journey('Private calculator preview denies ordinary accounts before disclosing engine controls',async()=>{
  await browser.identity(auth.cookie(db.users.outsider));await browser.visit('/account/calculators/power-calculator');await browser.until(`document.body.innerText.includes('Reviewer access required')`);assert(!await browser.js(`!!document.querySelector('form')`));
 });
 await db.sql(`GRANT SELECT ON public.platform_admins TO authenticated;INSERT INTO public.platform_admins(user_id,role,active) VALUES('${db.users.owner.id}','reviewer',true);`);
 await journey('Native reviewer navigates master catalog candidates and calculates the real engine',async()=>{
  await browser.identity(auth.cookie(db.users.owner));await browser.visit('/account/calculators?q=power-calculator');await browser.until(`document.body.innerText.includes('Review candidate: power-calculator') && ${ready}`);
  await browser.click('Review candidate: power-calculator · version 1');await browser.until(`!!document.querySelector('input[aria-label="work"]') && ${ready}`);
  await browser.field('[aria-label="work"]','100');await browser.field('[aria-label="time"]','20');await browser.click('Calculate preview');await browser.until(`document.querySelector('[aria-label="Complete engine output"]')?.textContent.includes('5')`);
  const output=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));assert.deepEqual(output,{value:5,steps:['Power = work / time = 5']});
  await browser.field('[aria-label="time"]','');assert(!await browser.js(`!!document.querySelector('[aria-label="Complete engine output"]')`));await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[role="alert"]')`);assert(!await browser.js(`!![...document.querySelectorAll('button')].find(x=>x.textContent==='Download reviewer JSON')`));
 });
 await journey('Native reviewer preview exports immutable real JSON CSV PDF and fits mobile',async()=>{
  await browser.field('[aria-label="time"]','20');await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);
  const downloads=path.join(artifacts,'reviewer-downloads');await mkdir(downloads,{recursive:true});await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  for(const format of ['JSON','CSV','PDF']){
   await browser.click('Download reviewer '+format);let bytes;const deadline=Date.now()+45000;while(Date.now()<deadline){try{bytes=await readFile(path.join(downloads,'review-power-calculator-v1.'+format.toLowerCase()));if(bytes.length)break;}catch{}await new Promise(r=>setTimeout(r,60));}assert(bytes?.length,'Reviewer '+format+' download did not complete');
   if(format==='JSON')assert.deepEqual(JSON.parse(bytes.toString()),{calculatorSlug:'power-calculator',calculatorVersion:1,input:{work:100,time:20},output:{value:5,steps:['Power = work / time = 5']}});
   if(format==='CSV')assert(bytes.toString().includes('"output","value","5"'));
   if(format==='PDF')assert(bytes.subarray(0,8).toString().startsWith('%PDF-1.7'));
  }
  await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:1000,deviceScaleFactor:1,mobile:true});const layout=await browser.js(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,unlabeled:[...document.querySelectorAll('input:not([type=hidden]),textarea,select')].filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')).length})`);assert(layout.scrollWidth<=layout.width+1,JSON.stringify(layout));assert.equal(layout.unlabeled,0);
  await browser.send('Emulation.clearDeviceMetricsOverride');
 });
 await journey('Native reviewer private contracts use the pinned loan and ratio engines without public registration',async()=>{
  await browser.visit('/account/calculators/private-catalog-10');await browser.until(`!!document.querySelector('[aria-label="principal"]') && ${ready}`);
  await browser.field('[aria-label="principal"]','100');await browser.field('[aria-label="monthlyPayment"]','101');await browser.field('[aria-label="termMonths"]','1');await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);
  const rate=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));assert(Math.abs(rate.nominalAnnualRatePercent-12)<1e-7);
  await browser.visit('/account/calculators/private-catalog-39');await browser.until(`!!document.querySelector('[aria-label="propertyValue"]') && ${ready}`);await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);assert.deepEqual(JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`)),{capitalizationRatePercent:2});
  await browser.visit('/account/calculators/private-catalog-65');await browser.until(`!!document.querySelector('[aria-label="cashFlows"]') && ${ready}`);await browser.field('[aria-label="cashFlows"]','[-100,110]');await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);const irr=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));assert(Math.abs(irr.periodRatePercent-10)<1e-7);assert.equal(irr.selectedBracketOnly,true);

 });
 await journey('Private scientific previews preserve duplicate identities, units and absent polar events',async()=>{
  const outputs=[];
  for(const id of [491,539,495,536,535]){
   await browser.visit('/account/calculators/private-scientific-'+id);await browser.until(`!!document.querySelector('button[type="submit"]') && ${ready}`);await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);
   outputs.push(JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`)));
  }
  assert.deepEqual(outputs[0],outputs[1]);assert(Math.abs(outputs[0].heatIndexF-94.5969412)<1e-9);assert.deepEqual(outputs[2],outputs[3]);assert.equal(outputs[2].azimuthDegrees,null);assert.equal(outputs[4].status,'polar-night');assert.equal(outputs[4].sunriseUtc,null);assert.equal(outputs[4].sunsetUtc,null);
  await browser.visit('/account/calculators/private-scientific-491');await browser.until(`!!document.querySelector('[aria-label="temperature"]') && ${ready}`);await browser.field('[aria-label="temperature"]','70');await browser.click('Calculate preview');await browser.until(`document.querySelector('[aria-label="Complete engine output"]')?.textContent.includes('unsupported')`);const unsupported=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));assert(!('heatIndexF' in unsupported));
 });
 const ownerCases=JSON.parse(await readFile(new URL('./owner-scope-cases.json',import.meta.url),'utf8'));
 for(const model of ownerCases)await journey('Owner-approved bounded calculator #'+model.masterId+' private modes and snapshots',async()=>{
  if(model.masterId===44){await browser.visit('/account/calculators?q=Vacancy%20Impact%20Calculator');await browser.until(`document.body.innerText.includes('OWNER_APPROVED_BOUNDED_SCOPE_IMPLEMENTED_PRIVATE') && ${ready}`);await browser.click('Private scoped implementation: Vacancy Impact Calculator (identity and specialist approval pending)');}else await browser.visit('/account/calculators/'+model.slug);await browser.until(`(${ownerPreviewReadyScript(model)}) && ${ready}`);
  for(let index=0;index<model.examples.length;index++){
   if(index){await browser.js(`(()=>{const s=[...document.querySelectorAll('select')].find(s=>s.labels?.[0]?.textContent.includes('Example and calculation mode'));s.value=${index};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(`!document.querySelector('[aria-label="Complete engine output"]')`);assert(!await browser.js(`!![...document.querySelectorAll('button')].find(x=>x.textContent==='Download reviewer JSON')`));}
   await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);
   const output=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));assert.deepEqual(output,model.examples[index].expected,'Wrong bounded output for '+model.slug+' example '+index);
  }
  const downloads=path.join(artifacts,'owner-downloads');await mkdir(downloads,{recursive:true});await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  for(const format of ['JSON','CSV','PDF']){
   const target=path.join(downloads,'review-'+model.slug+'-v1.'+format.toLowerCase());await unlink(target).catch(error=>{if(error.code!=='ENOENT')throw error;});
   await browser.click('Download reviewer '+format);let bytes;const deadline=Date.now()+45000;while(Date.now()<deadline){try{bytes=await readFile(target);if(bytes.length)break;}catch{}await new Promise(r=>setTimeout(r,60));}assert(bytes?.length,'Owner '+model.slug+' '+format+' export missing');
   if(format==='JSON'){const snapshot=JSON.parse(bytes.toString());assert.equal(snapshot.calculatorSlug,model.slug);assert.equal(snapshot.calculatorVersion,1);assert.deepEqual(snapshot.input,model.examples.at(-1).input);assert.deepEqual(snapshot.output,model.examples.at(-1).expected);}
   if(format==='CSV')assert(bytes.toString().includes('"output"'));
   if(format==='PDF')assert(bytes.subarray(0,8).toString().startsWith('%PDF-1.7'));
  }
 });
 await verifySourceCalculatorReview({browser,journey,artifacts});
 await journey('Private reviewer navigation rejects role revocation and account replacement',async()=>{
  await db.sql(`UPDATE public.platform_admins SET active=false WHERE user_id='${db.users.owner.id}';`);await browser.visit('/account/calculators/power-calculator');await browser.until(`document.body.innerText.includes('Reviewer access required')`);assert(!await browser.js(`!!document.querySelector('[aria-label="work"]')`));
  await browser.visit('/account/calculators/private-owner-145');await browser.until(`document.body.innerText.includes('Reviewer access required')`);assert(!await browser.js("!!document.querySelector('form')"));
  for(const id of [81,85,86,126,469,488,516]){await browser.visit('/account/calculators/private-source-'+id);await browser.until(`document.body.innerText.includes('Reviewer access required')`);assert(!await browser.js("!!document.querySelector('form')"));}
  await browser.identity(auth.cookie(db.users.outsider));await browser.visit('/account/calculators');await browser.until(`document.body.innerText.includes('Reviewer access required')`);
 });
}
