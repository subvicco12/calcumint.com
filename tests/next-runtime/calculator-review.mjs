import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
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
 await journey('Private reviewer navigation rejects role revocation and account replacement',async()=>{
  await db.sql(`UPDATE public.platform_admins SET active=false WHERE user_id='${db.users.owner.id}';`);await browser.visit('/account/calculators/power-calculator');await browser.until(`document.body.innerText.includes('Reviewer access required')`);assert(!await browser.js(`!!document.querySelector('[aria-label="work"]')`));
  await browser.identity(auth.cookie(db.users.outsider));await browser.visit('/account/calculators');await browser.until(`document.body.innerText.includes('Reviewer access required')`);
 });
}
