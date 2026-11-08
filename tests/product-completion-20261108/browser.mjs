/** Actual private worker and native-download acceptance; no production/account claims. */
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {startSixCandidatePreview} from '../../scripts/full-six-candidate-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const output=process.env.PRODUCT_COMPLETION_BROWSER||'/tmp/calcumint-product-completion-browser';
await mkdir(output,{recursive:true});const downloads=path.join(output,'downloads');await mkdir(downloads,{recursive:true});
const report={scope:'Private basic-auth local preview, actual workers and native completed files, synthetic plan contexts; not genuine account or publication approval',journeys:[],passed:false};
let fixture,browser;
const button=name=>'[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==='+JSON.stringify(name)+')';
async function click(name){await browser.until(button(name)+'&&!'+button(name)+'.disabled');await browser.js(button(name)+'.click()');}
async function completed(file){for(let i=0;i<100;i++){try{const s=await stat(file);if(s.size>0){const bytes=await readFile(file);await delay(50);if((await stat(file)).size===bytes.length)return bytes;}}catch{}await delay(100);}throw Error('Native download did not complete: '+path.basename(file));}
try{
 fixture=await startSixCandidatePreview();browser=await startBrowser(fixture.origin,[fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')]);
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads,eventsEnabled:true});
 const parity=new Map();
 const ready='document.querySelector('+JSON.stringify('section[aria-label="Candidate result"] h2')+')?.textContent==="Current result"';
 for(const id of [282,283])for(const plan of ['free','pro','business']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width:plan==='business'?1440:320,height:1000,deviceScaleFactor:1,mobile:plan!=='business'});
  await browser.send('Page.navigate',{url:fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@')+`/tests/full-six-candidate/?id=${id}&plan=${plan}`});
  await browser.until('!!document.querySelector('+JSON.stringify('section[aria-label="Private six calculator workbench"]')+')');
  await click('Use example');await click('Calculate');await browser.until(ready,25000);
  const result=await browser.js('document.querySelector("[data-primary-result]").textContent');
  if(parity.has(id))assert.equal(result,parity.get(id));else parity.set(id,result);
  assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true);
  if(plan==='free'){assert.equal(await browser.js('!!'+button('Export statistics CSV')),false);report.journeys.push({id,plan,denied:true,result});continue;}
  const planDownloads=path.join(downloads,`${id}-${plan}`);await mkdir(planDownloads,{recursive:true});
  await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:planDownloads,eventsEnabled:true});
  await click('Export statistics CSV');const file=path.join(planDownloads,`private-${id}-statistics.csv`);
  const bytes=await completed(file),text=bytes.toString('utf8');
  assert(text.startsWith('"section","path","type","value"\r\n'));
  assert(text.includes('"summary","/output/summary/metrics/'+(id===282?'standardDeviation':'variance')+'","string","1"'));
  assert(text.includes('/output/contributions/2/weightedSquaredDeviation/numerator'));
  assert(text.includes('"implementation-binding","/implementationRevision","string","six-private-workflows-20261106.1"'));
  assert(text.includes('Import value column as text'));
  await browser.field('[data-field="unit"]','cm');
  assert.equal(await browser.js(button('Export statistics CSV')+'.disabled'),true,'Edited result cannot be exported');
  await click('Use example');await click('Calculate');await browser.until(ready,25000);
  report.journeys.push({id,plan,result,nativeCompletedBytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),staleDenied:true,recovered:true});
 }
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(path.join(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,journeys:report.journeys.length,output}));
}catch(error){await writeFile(path.join(output,'failure.txt'),String(error));if(browser)try{await writeFile(path.join(output,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{}throw error;}
finally{await browser?.close();await fixture?.close();}
