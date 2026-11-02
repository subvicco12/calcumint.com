import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startStatisticsPreview} from '../../scripts/statistics-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const directory=process.env.DECIMAL50_BROWSER_RECEIPT||'/tmp/decimal50-statistics-browser';
await mkdir(directory,{recursive:true});
const report={scope:'Local Basic-auth isolated preview; actual module Worker and exact-decimal core; synthetic plan context, no account persistence/certification',journeys:[],passed:false};
let fixture,browser;
const button=label=>'[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==='+JSON.stringify(label)+')';
const click=async label=>{await browser.until(button(label)+'&&!'+button(label)+'.disabled');await browser.js(button(label)+'.click()');};
const query=selector=>'document.querySelector('+JSON.stringify(selector)+')';
const current=query('section[aria-label="Statistics result"] h2')+'?.textContent==="Current result"';
const data=async text=>{await browser.field('#data',text);};
const metric=key=>browser.js('[...document.querySelectorAll("tbody tr")].find(r=>r.querySelector("th")?.textContent==='+JSON.stringify(key)+')?.querySelector("td")?.textContent');
try{
 fixture=await startStatisticsPreview();
 assert.equal((await fetch(fixture.origin+'/tests/statistics-workbench/')).status,401);
 browser=await startBrowser(fixture.origin,[fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')]);
 for(const width of [320,1440])for(const id of [282,283])for(const plan of ['free','pro','business']){
  console.log(JSON.stringify({width,id,plan}));
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+`/tests/statistics-workbench/?id=${id}&plan=${plan}&capture=1`});
  await browser.until('!!'+query('section[aria-label="Private statistics workbench"]'));
  assert.equal(await browser.js('document.querySelector("textarea").value'),'');
  assert.equal(await browser.js('document.querySelectorAll("input[type=radio]:checked").length'),0);
  await browser.js('document.querySelector("textarea").id="data";[...document.querySelectorAll("label")].find(l=>l.textContent.startsWith("Observation unit")).querySelector("input").id="unit";document.querySelector("select").id="encoding"');
  await click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
  assert.equal(await browser.js('document.activeElement?.getAttribute("role")'),'alert');
  await browser.js('[...document.querySelectorAll("label")].find(l=>l.textContent.startsWith("Sample (")).querySelector("input").click()');
  await data('1\n2\n3');await browser.field('#unit','m');
  const start=Date.now();await click('Calculate');await browser.until(current);
  assert.equal(await metric('variance'),'1');assert.equal(await metric('standardDeviation'),'1');assert.equal(await metric('effectiveN'),'3');
  const primary=await browser.js(query('section[aria-label="Statistics result"]>p')+'.textContent');
  assert.match(primary,id===282?/Standard deviation: 1 m$/:/Variance: 1 m\^2$/);
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,'No horizontal overflow');
  const sampleText=await browser.js('document.querySelector("tbody").textContent');
  if(plan==='free')assert.equal(await browser.js('!!'+button('Export JSON')),false);
  else{
   await click('Capture A');await click('Export JSON');await browser.until('window.__statisticsDownloads.length===1');
   const exported=await browser.js('window.__statisticsDownloads[0].text');const snapshot=JSON.parse(exported);
   assert.equal(snapshot.artifact.catalogId,id);assert.equal(snapshot.artifact.inputs['0'],'{"value":"1"}');assert.equal(snapshot.artifact.outcome.values.primary.raw,'1');
   await data('2\n4\n6');await click('Calculate');await browser.until(current);assert.equal(await metric('variance'),'4');await click('Restore A');assert.equal(await metric('variance'),'1');
   await browser.js('[...document.querySelectorAll("label")].find(l=>l.textContent.startsWith("Snapshot JSON")).querySelector("textarea").id="snapshot"');
   await browser.field('#snapshot',exported);await click('Verify and replay JSON');await browser.until('document.querySelector("[role=status]").textContent.includes("worker recomputation verified")');
   const forged=structuredClone(snapshot);forged.artifact.outcome.values.primary.raw='123';
   await browser.field('#snapshot',JSON.stringify(forged));await click('Verify and replay JSON');await browser.until('!!document.querySelector("[role=alert]")');
   assert.match(await browser.js('document.querySelector("[role=alert]").textContent'),/digest mismatch/);
  }
  await data('1\n\n3');await click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
  await browser.js('document.querySelector("input[type=checkbox]").click()');await click('Calculate');await browser.until(current);assert.equal(await metric('omittedRows'),'1');assert.equal(await metric('effectiveN'),'2');assert.equal(await metric('variance'),'2');
  await browser.js('document.querySelector("input[type=checkbox]").click();[...document.querySelectorAll("label")].find(l=>l.textContent.startsWith("Population (")).querySelector("input").click()');
  await browser.js('document.querySelector("#encoding").focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await data('0.1,5000000\n0.3,5000000');await click('Calculate');await browser.until(current);
  assert.equal(await metric('effectiveN'),'10000000');assert.equal(await metric('variance'),'0.01');assert.equal(await metric('standardDeviation'),'0.1');
  report.journeys.push({width,catalogId:id,plan,emptyExplicitMode:true,sample:{variance:'1',standardDeviation:'1',effectiveN:3,unit:id===282?'m':'m^2',tableText:sampleText},frequency:{effectiveN:10000000,variance:'0.01',standardDeviation:'0.1'},explicitOmission:true,errorFocus:true,scenariosAndJSON:plan!=='free',tamperRejected:plan!=='free',elapsedMs:Date.now()-start});
 }
 await browser.js('document.querySelector("#encoding").focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
 // CDP insertText with 10k line breaks stalled the browser command, so load the
 // bounded stress fixture through the native setter/input event; not a paste receipt.
 const large=Array.from({length:10000},()=> '1').join('\n');
 await browser.js('(()=>{const e=document.querySelector("#data");Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(e,'+JSON.stringify(large)+');e.dispatchEvent(new Event("input",{bubbles:true}));})()');
 await browser.js(button('Calculate')+'.click();setTimeout(()=>{'+button('Cancel')+'?.click()},0);void 0');
 await browser.until('document.querySelector("[role=status]").textContent.includes("cancelled")');
 const cancelledAudit=await browser.js('window.__statisticsWorkerAudit');assert.equal(cancelledAudit.created,cancelledAudit.terminated,'No worker survives cancellation');assert.equal(cancelledAudit.rowCounts.at(-1),10000);
 await data('0\n2');await click('Calculate');await browser.until(current);assert.equal(await metric('variance'),'1');
 report.cancellation={inputRows:10000,stressFixtureEntry:'Native DOM setter/input event; not trusted paste acceptance',terminatedBeforeCompletion:true,retryVariance:'1',audit:cancelledAudit};
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(path.join(directory,'receipt.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,journeys:report.journeys.length,directory}));
}catch(error){await writeFile(path.join(directory,'failure.txt'),String(error));await writeFile(path.join(directory,'request-statuses.json'),JSON.stringify(fixture?.requests,null,2));if(browser)try{await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{/* Preserve original failure if screenshot diagnostics are unavailable. */}throw error;}
finally{await browser?.close();await fixture?.close();}
