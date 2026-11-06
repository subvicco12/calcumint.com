import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const directory=process.env.CRITICAL440_BROWSER_ARTIFACTS||'/tmp/critical440-browser';await mkdir(directory,{recursive:true});
const report={scope:'Actual private caller and engine; synthetic account/plan transport. No production or reviewer approval.',checks:[],passed:false};let fixture,browser;
const click=async text=>{await browser.until('[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==='+JSON.stringify(text)+'&&!b.disabled)');await browser.click(text);};
const key=async name=>{for(const type of ['keyDown','keyUp'])await browser.send('Input.dispatchKeyEvent',{type,key:name,code:name,windowsVirtualKeyCode:name==='Enter'?13:9,...(type==='keyDown'&&name==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});};
try{
 fixture=await startShortestPublicationPreview();const origin=fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@');browser=await startBrowser(fixture.origin,[origin]);
 for(const plan of ['free','pro','business']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:1000,deviceScaleFactor:1,mobile:true});await browser.send('Page.navigate',{url:origin+'/tests/shortest-publication-20/?id=440&plan='+plan});await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan)+'&&window.__first20Snapshot?.output');
  if(plan==='free'){assert.equal(await browser.js('!!document.querySelector("[aria-label=\\\"Batch conversion\\\"]")'),false);report.checks.push({plan,batchDenied:true});continue;}
  await browser.js('document.querySelector("[aria-label=\\\"Batch conversion\\\"] textarea").id="batch-values"');await browser.field('#batch-values','0.01001\n0\n-3');
  await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Calculate batch").focus()');await key('Enter');await browser.until('document.querySelector("[aria-label=\\\"Batch conversion\\\"] [role=status]")?.textContent.includes("3 valid, 0 invalid")');
  assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,'320px batch table fits');
  assert.equal(await browser.js('document.querySelector("[aria-label=\\\"Use row 1 in calculator\\\"]").disabled'),false);
  await browser.js('document.querySelector("[aria-label=\\\"Use row 1 in calculator\\\"]").focus()');await key('Enter');await browser.until('window.__first20Snapshot.input.value===0.01001');
  const before=await browser.js('window.__shortestDownloads.length');await click('Export batch JSON');await browser.until('window.__shortestDownloads.length>'+before);const batch=await browser.js('window.__shortestDownloads['+before+'].text');assert.equal(JSON.parse(batch).rows[0].raw,'0.01001');
  await browser.js('document.querySelector("[aria-label=\\\"Batch conversion\\\"] details").open=true;document.querySelector("[aria-label=\\\"Batch conversion\\\"] details textarea").id="batch-replay"');await browser.field('#batch-replay',batch);await click('Validate batch replay');await browser.until('document.querySelector("[aria-label=\\\"Batch conversion\\\"] [role=status]")?.textContent.includes("3 valid")');
  const bad=JSON.parse(batch);bad.rows[0].snapshot.output.result+=1;await browser.field('#batch-replay',JSON.stringify(bad));await click('Validate batch replay');await browser.until('!!document.querySelector("[aria-label=\\\"Batch conversion\\\"] [role=alert]")');assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Export batch JSON").disabled'),true);
  await browser.field('#batch-values','1\ninvalid\n0');await click('Calculate batch');await browser.until('document.querySelector("[aria-label=\\\"Batch conversion\\\"] [role=status]")?.textContent.includes("2 valid, 1 invalid")');assert.equal(await browser.js('document.querySelector("[aria-label=\\\"Use row 2 in calculator\\\"]").disabled'),true);assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Export batch JSON").disabled'),true);
  await browser.field('#batch-values','2\n3');await click('Calculate batch');await browser.until('document.querySelector("[aria-label=\\\"Batch conversion\\\"] [role=status]")?.textContent.includes("2 valid, 0 invalid")');await browser.field('#batch-values','4');assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Export batch JSON").disabled'),true);
  await browser.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true);
  report.checks.push({plan,keyboardCalculateAndSelect:true,rawExportReplay:true,tamperRejected:true,invalidRowDenied:true,dirtyExportDenied:true,mobile320:true,desktop1440:true});
 }
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(directory+'/receipt.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}catch(e){await writeFile(directory+'/failure.txt',String(e));if(browser)try{await writeFile(directory+'/failure.png',Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{}throw e;}finally{await browser?.close();await fixture?.close();}
