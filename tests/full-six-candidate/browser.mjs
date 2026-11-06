import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {startSixCandidatePreview} from '../../scripts/full-six-candidate-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const directory=process.env.SIX_CANDIDATE_BROWSER_RECEIPT||'/tmp/six-candidate-browser';await mkdir(directory,{recursive:true});
const manifestBytes=await readFile('docs/publication-candidate-closure/implementation-manifest.json');
const report={sourceManifestSHA256:createHash('sha256').update(manifestBytes).digest('hex'),scope:'Basic-auth local private preview; actual experimental engines/module workers; synthetic plan selection; no real account persistence/certification/publication',journeys:[],passed:false};
let fixture,browser;const button=n=>'[...document.querySelectorAll("button")].find(e=>e.textContent.trim()==='+JSON.stringify(n)+')';
const click=async n=>{await browser.until(button(n)+'&&!'+button(n)+'.disabled');await browser.js(button(n)+'.click()');};
async function importFile(text,name){const file=path.join(directory,name);await writeFile(file,text);const doc=await browser.send('DOM.getDocument');const found=await browser.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'[data-field="replay-file"]'});await browser.send('DOM.setFileInputFiles',{nodeId:found.nodeId,files:[file]});}
const current='document.querySelector("section[aria-label=\\"Candidate result\\"] h2")?.textContent==="Current result"';
try{
 fixture=await startSixCandidatePreview();assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/')).status,401);
 assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/',{headers:{Authorization:fixture.authorization,Origin:'https://foreign.invalid'}})).status,403);
 browser=await startBrowser(fixture.origin,[fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')]);const parity=new Map(),tableParity=new Map();
 for(const id of [276,275,282,283,251,235])for(const plan of ['free','pro','business']){
  console.log(JSON.stringify({id,plan,stage:'begin'}));const width=plan==='business'?1440:320;await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+`/tests/full-six-candidate/?id=${id}&plan=${plan}&capture=1`});
  await browser.until('!!document.querySelector("section[aria-label=\\"Private six calculator workbench\\"]")');
  await click('Use example');await click('Calculate');
  await browser.until(current,25000);assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,'Mobile page has no horizontal overflow');
  const metricText=await browser.js('document.querySelector("section[aria-label=\\"Candidate result\\"] tbody").textContent');assert(metricText.length>0);if(tableParity.has(id))assert.equal(metricText,tableParity.get(id),'Free/Pro/Business complete table parity');else tableParity.set(id,metricText);if(id===282||id===283)assert.equal(await browser.js('document.querySelector("[data-primary-result]").textContent'),id===282?'Standard deviation: 1 m':'Variance: 1 m^2');
  if(plan==='free'){assert.equal(await browser.js('!!'+button('Export JSON')),false);}
  else{
   await click('Capture A');await click('Capture B');assert.equal(await browser.js('!![...document.querySelectorAll("caption")].find(e=>e.textContent.includes("Scenario comparison"))'),true);
   await click('Export JSON');await browser.until('window.__sixCandidateDownloads.length===1');const text=await browser.js('window.__sixCandidateDownloads[0].text'),snapshot=JSON.parse(text);
   assert.equal(snapshot.artifact.catalogId,id);assert.equal(snapshot.artifact.scope,'PRIVATE_EXPERIMENTAL');
   const key=id;if(parity.has(key))assert.equal(snapshot.sha256,parity.get(key),'Pro/Business complete mathematical artifact parity');else parity.set(key,snapshot.sha256);
   if(id===235||id===251)await importFile(text,`valid-${id}-${plan}.json`);else{await browser.field('[data-field="replay"]',text);await click('Verify and replay JSON');}await browser.until('document.querySelector("[role=status]").textContent.includes("recomputation verified")');
   const forged=structuredClone(snapshot);forged.artifact.output.forged=true;if(id===235||id===251)await importFile(JSON.stringify(forged),`forged-${id}-${plan}.json`);else{await browser.field('[data-field="replay"]',JSON.stringify(forged));await click('Verify and replay JSON');}await browser.until('!!document.querySelector("[role=alert]")');assert.match(await browser.js('document.querySelector("[role=alert]").textContent'),/digest/);assert.equal(await browser.js('document.activeElement?.getAttribute("role")'),'alert');
   await click('Use example');await click('Calculate');await browser.until(current);
  }
  report.journeys.push({id,plan,width,workerResult:true,noHorizontalOverflow:true,scenarios:plan!=='free',immutableExportReplay:plan!=='free',importMechanism:(id===235||id===251)?'Native file input (no large trusted-paste acceptance claim)':'Trusted text input',tamperRejection:plan!=='free',resultTextSha256:createHash('sha256').update(metricText).digest('hex')});
 }
 // Exact vertical, inverse, zero and malformed recovery exercise real controls.
 await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+'/tests/full-six-candidate/?id=276&plan=pro&capture=1'});await browser.until('!!document.querySelector("[data-field=x2]")');
 await browser.field('[data-field="x2"]','0');await click('Calculate');await browser.until(current);assert.match(await browser.js('document.querySelector("section[aria-label=\\"Candidate result\\"]").textContent'),/vertical-line/);
 await browser.field('[data-field="x2"]','');await click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js(button('Export JSON')+'.disabled'),true);
 await click('Use example');await browser.field('[data-field="y2"]','0');await click('Calculate');await browser.until(current);assert.match(await browser.js('document.querySelector("section[aria-label=\\"Candidate result\\"]").textContent'),/slope/);
 await browser.js('document.querySelector("[data-field=slope-operation]").focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await browser.until('!!document.querySelector("[data-field=inverse-x1]")');await click('Calculate');await browser.until(current);
 // Volume inverse is exposed through real controls, not merely a library call.
 await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+'/tests/full-six-candidate/?id=275&plan=pro&capture=1'});await browser.until('!!document.querySelector("[data-field=mode]")');
 await browser.js('document.querySelector("[data-field=mode]").focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await browser.until('!!document.querySelector("[data-field=targetVolume]")');await click('Calculate');await browser.until(current);
 assert.match(await browser.js('document.querySelector("section[aria-label=\\"Candidate result\\"]").textContent'),/solvedParameter/);
 // A requested derivative refusal remains visible even when the plot is valid.
 await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+'/tests/full-six-candidate/?id=235&plan=pro&capture=1'});await browser.until('!!document.querySelector("[data-field=derivativeAt]")');await browser.field('[data-field="expressions"]','abs(x)');await browser.field('[data-field="derivativeAt"]','0');await click('Calculate');await browser.until(current);assert.match(await browser.js('document.querySelector("section[aria-label=\\"Point derivative results\\"]").textContent'),/domain-error|precision-unavailable/);
 // Genuine worker interruption, followed by successful recovery.
 await click('Use example');const beforeCancellation=await browser.js('window.__sixWorkerAudit');await browser.js(button('Calculate')+'.click();setTimeout(()=>{'+button('Cancel')+'?.click()},0);void 0');await browser.until('document.querySelector("[role=status]").textContent.includes("cancelled")');const afterCancellation=await browser.js('window.__sixWorkerAudit');assert.equal(afterCancellation.created,beforeCancellation.created+1);assert.equal(afterCancellation.terminated,afterCancellation.created);await click('Calculate');await browser.until(current);
 report.additional={verticalClassification:true,blankDenialRecovery:true,slopeInverse:true,volumeInverse:true,derivativeRefusalVisible:true,workerCancellationRecovery:true};
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(path.join(directory,'receipt.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,journeys:report.journeys.length,directory}));
}catch(error){await writeFile(path.join(directory,'failure.txt'),String(error));if(browser)try{await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{}throw error;}
finally{await browser?.close();await fixture?.close();}
