import {mkdtemp,mkdir,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const ids=[21,32,35,36,43,46,49,80,81,82,84,85,86,88,89,90,91,96,125,126,127,133,134,468,469,470,472,488,516];
const temporary=await mkdtemp(path.join(os.tmpdir(),'cohort-browser-'));
const downloads=path.join(temporary,'downloads');await mkdir(downloads);
const server=await startDraftPreview(0);
const base=`http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={kind:'PRIVATE_29_PROFILE_CALLER_BOUNDARY_BROWSER_REGRESSION',productionWrites:false,browser:'Chromium headless native CDP',checks:[],profiles:[],limitations:['Loopback synthetic reviewer only; no live authentication/account storage or canonical acceptance.']};
try{
 browser=await startBrowser(base);
 const {send,js,click}=browser;
 async function field(id,value){await js(`(()=>{const e=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);}
 await send('Network.setExtraHTTPHeaders',{headers:{Authorization:`Basic ${Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}`}});
 await send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
 assert.equal((await fetch(base+'/tests/calculator-sprint-20261108/cohort-browser.html')).status,401);
 await browser.visit('/tests/calculator-sprint-20261108/cohort-browser.html');
 report.checks.push('Unauthorized preview GET refused; actual source component rendered');
 for(const id of ids){
  await field('workbench-contract',String(id));await click('Calculate');
  await browser.until(`!!document.querySelector('[data-testid="workbench-result"]')`);
  const displayed=await js(`document.querySelector('[data-testid="workbench-output"]').textContent`);
  if(id===81)assert.equal(await js(`document.querySelector('[data-testid="workbench-result"]').textContent`),'120');
  await click('Export JSON');
  const name=`private-workbench-${id}-v1.json`;
  const downloadEnd=Date.now()+10_000;while(!(await readdir(downloads)).includes(name)&&Date.now()<downloadEnd)await pause(30);
  const raw=await readFile(path.join(downloads,name),'utf8'),snapshot=JSON.parse(raw);
  assert.equal(snapshot.masterId,id);assert.deepEqual(snapshot.payload.calculation.output,JSON.parse(displayed));
  await field('workbench-import',raw);await click('Verify and restore snapshot');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),false);
  const forged=raw.replace('"calculatorVersion": 1','"calculatorVersion": 1.0000000000000001');assert.notEqual(forged,raw);
  await field('workbench-import',forged);await click('Verify and restore snapshot');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),true);
  assert.equal(await js(`!!document.querySelector('[data-testid="workbench-result"]')`),false);
  await field('workbench-import',raw);await click('Verify and restore snapshot');
  assert.equal(await js(`document.querySelector('[data-testid="workbench-output"]').textContent`),displayed);
  report.profiles.push({id,downloadOutputEqualsRenderedOutput:true,canonicalReplayPreserved:true,lossyRevisionRejected:true,recoveryPreserved:true});
  await pause(350);
 }
 await field('workbench-contract','82');
 const initial=await js(`document.getElementById('workbench-json').value`);
 for(const token of ['1e-400','9007199254740993','0.10000000000000001']){
  await field('workbench-json',initial.replace('"initial": 100',`"initial": ${token}`));await click('Calculate');
  assert.equal(await js(`!!document.querySelector('[role="alert"]')`),true);
 }
 await field('workbench-contract','81');await click('Calculate');await click('Save scenario');
 await field('workbench-json','{}');await click('Restore scenario 1');
 assert.equal(await js(`document.querySelector('[data-testid="workbench-result"]').textContent`),'120');
 report.checks.push('All 29 actual JSON downloads reconcile rendered deterministic output; canonical replay and recovery preserved','Three lossy numeric scenario tokens rejected','Independent golden 100×1.1+10=120 retained through save/restore');
 assert.deepEqual(browser.errors,[],'No browser runtime exceptions');
 assert(browser.network.every(request=>request.allowed),'No external browser network requests');
 const reportPath=process.env.COHORT_BROWSER_REPORT||path.join(os.tmpdir(),'calcumint-cohort-browser-report.json');
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({profiles:report.profiles.length,checks:report.checks,status:'passed'},null,2));
}finally{
 await browser?.close();await server.close();await rm(temporary,{recursive:true,force:true});
}
