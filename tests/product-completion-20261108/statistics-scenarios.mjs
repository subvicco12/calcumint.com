/** Native bounded-worker scenario regression. Local synthetic plans, no account/publication claims. */
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startSixCandidatePreview} from '../../scripts/full-six-candidate-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const output=process.env.STATISTICS_SCENARIOS_ARTIFACTS||'/tmp/calcumint-statistics-scenarios';
await mkdir(output,{recursive:true});let fixture,browser;
const report={scope:'Private local candidate, actual bounded worker, synthetic paid contexts; no authenticated persistence or certification claim',journeys:[],passed:false};
const button=name=>'[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==='+JSON.stringify(name)+')';
async function keyboard(name){await browser.until(button(name)+'&&!'+button(name)+'.disabled');await browser.js(button(name)+'.focus()');assert.equal(await browser.js('document.activeElement==='+button(name)),true);await browser.send('Page.bringToFront');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});}
const ready='document.querySelector("section[aria-label=\\"Candidate result\\"] h2")?.textContent==="Current result"';
try{
 fixture=await startSixCandidatePreview();const origin=fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@');browser=await startBrowser(fixture.origin,[origin]);
 for(const id of [282,283])for(const plan of ['pro','business']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width:plan==='pro'?320:1440,height:1000,deviceScaleFactor:1,mobile:plan==='pro'});
  await browser.send('Page.navigate',{url:origin+`/tests/full-six-candidate/?id=${id}&plan=${plan}`});await browser.until('!!document.querySelector("[data-field=\\"unit\\"]")');
  await keyboard('Use example');await browser.until('document.querySelector("[data-field=\\"estimand\\"]").value==="sample"');await keyboard('Calculate');await browser.until(ready,25000);const primary=await browser.js('document.querySelector("[data-primary-result]").textContent');await keyboard('Capture A');
  await browser.field('[data-field="unit"]','cm');await browser.js('const e=document.querySelector("[data-field=\\"estimand\\"]");if(!e)throw Error("Missing estimand");e.value="population";e.dispatchEvent(new Event("change",{bubbles:true}));');
  await keyboard('Calculate');await browser.until(ready,25000);await keyboard('Capture B');
  const context='document.querySelector("section[aria-label=\\"Statistics scenario comparison\\"]")';await browser.until(context+'?.textContent.includes("not directly comparable")');const warning=await browser.js(context+'.textContent');assert(warning.includes('Population/sample estimands differ.'));assert(warning.includes('no unit conversion is inferred'));assert.equal(await browser.js(context+'.querySelectorAll("table").length'),1);
  await keyboard('Restore A');assert.equal(await browser.js('document.querySelector("[data-field=\\"unit\\"]").value'),'m');assert.equal(await browser.js('document.querySelector("[data-primary-result]").textContent'),primary);
  await keyboard('Restore B');assert.equal(await browser.js('document.querySelector("[data-field=\\"unit\\"]").value'),'cm');
  await keyboard('Restore A');await keyboard('Capture B');await browser.until(context+'?.textContent.includes("Compatible statistics scenarios")');assert.equal(await browser.js(context+'.querySelectorAll("table").length'),2);assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true);
  report.journeys.push({id,plan,width:plan==='pro'?320:1440,keyboard:true,estimandAndUnitMismatchDenied:true,recordedContextVisible:true,restoreExact:true,compatibleRecovery:true,primary});
 }
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(path.join(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,journeys:report.journeys.length,output}));
}catch(e){await writeFile(path.join(output,'failure.txt'),String(e));throw e;}finally{await browser?.close();await fixture?.close();}
