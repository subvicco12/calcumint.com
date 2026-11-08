import {mkdtemp,mkdir,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const ids=[139,140,141,142,143,144,148,149,151,152,153,164,165,166,167,169,171,174,175,176,178,180,182,183,185,186,187,188,189,190,192,193,196,197,202,207];
const temporary=await mkdtemp(path.join(os.tmpdir(),'cohort-business-browser-'));
const downloads=path.join(temporary,'downloads');await mkdir(downloads);
const server=await startDraftPreview(0);
const base=`http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={kind:'PRIVATE_36_BUSINESS_PROFILE_CALLER_BOUNDARY_BROWSER_REGRESSION',productionWrites:false,browser:'Chromium headless native CDP',checks:[],profiles:[],limitations:['Loopback synthetic reviewer only; no live authentication/account storage or canonical acceptance.']};
try{
 browser=await startBrowser(base);
 const {send,js,click}=browser;
 async function field(id,value){await js(`(()=>{const e=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);}
 await send('Network.setExtraHTTPHeaders',{headers:{Authorization:`Basic ${Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}`}});
 await send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
 assert.equal((await fetch(base+'/tests/calculator-sprint-20261108/cohort-business-browser.html')).status,401);
 await browser.visit('/tests/calculator-sprint-20261108/cohort-business-browser.html');
 report.checks.push('Unauthorized preview GET refused; actual source component rendered');
 for(const id of ids){
  await field('catalog-identity',String(id));await click('Calculate');
  await browser.until(`!!document.querySelector('[data-testid="business-result"]')`);
  const displayed=await js(`document.querySelector('[data-testid="business-output"]').textContent`);
  if(id===139)assert.equal(await js(`document.querySelector('[data-testid="business-result"]').textContent`),'30');
  await click('Export JSON');
  const name=`private-business-${id}-v1.json`;
  const downloadEnd=Date.now()+10_000;while(!(await readdir(downloads)).includes(name)&&Date.now()<downloadEnd)await pause(30);
  const raw=await readFile(path.join(downloads,name),'utf8'),snapshot=JSON.parse(raw);
  assert.equal(snapshot.masterId,id);assert.equal(snapshot.profileId,`private.business.${id}`);assert.equal(snapshot.calculation.calculatorVersion,1);assert.deepEqual(snapshot.calculation.output,JSON.parse(displayed));
  await field('business-import',raw);await click('Verify and restore snapshot');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),false);
  const forged=raw.replace('"calculatorVersion": 1','"calculatorVersion": 1.0000000000000001');assert.notEqual(forged,raw);
  await field('business-import',forged);await click('Verify and restore snapshot');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),true);
  assert.equal(await js(`!!document.querySelector('[data-testid="business-result"]')`),false);
  await field('business-import',raw);await click('Verify and restore snapshot');
  assert.equal(await js(`document.querySelector('[data-testid="business-output"]').textContent`),displayed);
  report.profiles.push({id,actualProfileId:snapshot.profileId,calculatorSlug:snapshot.calculation.calculatorSlug,calculatorVersion:snapshot.calculation.calculatorVersion,downloadOutputEqualsRenderedOutput:true,canonicalReplayPreserved:true,lossyRevisionRejected:true,recoveryPreserved:true});
  await pause(350);
 }
 await field('catalog-identity','139');
 const initial=await js(`document.getElementById('business-json').value`);
 for(const token of ['1e-400','0.10000000000000001']){
  const text=initial.replace('"directCosts": 70',`"directCosts": ${token}`);assert.notEqual(text,initial);
  await field('business-json',text);await click('Calculate');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),true);
 }
 await field('catalog-identity','166');
 const membership=await js(`document.getElementById('business-json').value`);
 const lossyMembership=membership.replace('"lostCustomers": 5','"lostCustomers": 5.0000000000000001');assert.notEqual(lossyMembership,membership);
 await field('business-json',lossyMembership);await click('Calculate');
 assert.equal(await js(`!!document.querySelector('[role="alert"]')`),true);
 await field('catalog-identity','139');await click('Calculate');await click('Save scenario');
 await field('business-json','{}');await click('Restore scenario 1');
 assert.equal(await js(`document.querySelector('[data-testid="business-result"]').textContent`),'30');
 report.checks.push('All 36 actual JSON downloads reconcile rendered deterministic output; canonical replay and recovery preserved','Two lossy money tokens and fractional integer-membership token rejected','Independent golden (100-70)/100*100=30 retained through save/restore');
 assert.deepEqual(browser.errors,[],'No browser runtime exceptions');
 assert(browser.network.every(request=>request.allowed),'No external browser network requests');
 const reportPath=process.env.COHORT_BUSINESS_BROWSER_REPORT||path.join(os.tmpdir(),'calcumint-cohort-business-browser-report.json');
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({profiles:report.profiles.length,checks:report.checks,status:'passed'},null,2));
}finally{
 await browser?.close();await server.close();await rm(temporary,{recursive:true,force:true});
}
