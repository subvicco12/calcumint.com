import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const artifacts=process.env.BATCH16_FINDER_ARTIFACTS||os.tmpdir();
await mkdir(artifacts,{recursive:true});
const directory=await mkdtemp(path.join(artifacts,'finder-'));
const journeys=[];
let server,browser;
const item={slug:'percentage-of-value-calculator',category:'math',description:'Percentage calculator',url:'/calculators/math/percentage-of-value-calculator'};
try{
 const reserve=net.createServer();
 await new Promise((resolve,reject)=>{reserve.once('error',reject);reserve.listen(0,'127.0.0.1',resolve);});
 const port=reserve.address().port;
 await new Promise((resolve,reject)=>reserve.close(error=>error?reject(error):resolve()));
 server=await startDraftPreview(port,{fixture:'reference-six'});
 const origin=`http://127.0.0.1:${port}`;
 const headers={Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')};
 assert.equal((await fetch(origin+'/tests/full-product-batch16/finder/')).status,401);
 assert.equal((await fetch(origin+'/tests/full-product-batch16/finder/',{headers,method:'POST'})).status,405);
 for(const width of [320,1280]){
  browser=await startBrowser(origin);
  await browser.send('Network.setExtraHTTPHeaders',{headers});
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===320});
  await browser.visit('/tests/full-product-batch16/finder/');
  await browser.until('!!document.querySelector("textarea")&&!!window.__finderFixture');
  const respond=async(index,payload,status=200)=>browser.js(`window.__finderFixture.respond(${index},${JSON.stringify(payload)},${status})`);
  const search=async query=>{await browser.field('textarea',query);await browser.click('Find the right calculator');};
  const count=async n=>browser.until(`window.__finderFixture.requests().length===${n}`);
  const hasLink='!!document.querySelector(".ai-results a")';
  await search('percentage');await count(1);
  await respond(0,{recommendations:[item],usedAi:false});await browser.until(hasLink);
  assert.equal(await browser.js('document.querySelector(".ai-results a").getAttribute("href")'),item.url);
  assert.match(await browser.js('document.querySelector("[role=status]").textContent'),/percentage/);
  await search('old query');await count(2);
  assert.equal(await browser.js(hasLink),false,'old actionable results removed at new submission');
  await browser.field('textarea','conversion');
  assert.equal(await browser.js('window.__finderFixture.requests()[1].aborted'),true,'native edits abort pending query');
  await browser.click('Find the right calculator');await count(3);
  await respond(2,{recommendations:[],usedAi:false});
  await browser.until('document.querySelector("[role=status]")?.textContent.includes("No calculators matched")');
  await respond(1,{recommendations:[item]});
  // Flush the synthetic transport's microtasks before reading final React state.
  await browser.js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  assert.equal(await browser.js(hasLink),false,'late response cannot restore obsolete results');
  assert.match(await browser.js('document.querySelector("[role=status]").textContent'),/conversion/);
  await search('percentage');await count(4);
  await respond(3,{recommendations:[{...item,reason:{malformed:true}}]});
  await browser.until('document.querySelector("[role=alert]")?.textContent.includes("invalid response")');
  assert.equal(await browser.js(hasLink),false);
  assert.equal(await browser.js('document.querySelector("textarea").value'),'percentage');
  await browser.click('Find the right calculator');await count(5);
  await respond(4,{error:'AI assistance is temporarily unavailable. Please try again.'},503);
  await browser.until('document.querySelector("[role=alert]")?.textContent.includes("temporarily unavailable")');
  await browser.click('Find the right calculator');await count(6);
  await respond(5,{recommendations:[item],usedAi:false,warning:'AI ranking is temporarily unavailable. Showing verified catalog matches.'});
  await browser.until(hasLink);
  assert.equal(await browser.js('document.querySelector(".ai-results a").getAttribute("href")'),item.url);
  assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);
  const label=await browser.js('document.querySelector("label").htmlFor');
  assert.equal(await browser.js(`document.getElementById(${JSON.stringify(label)}).tagName`),'TEXTAREA');
  assert.equal(await browser.js('document.querySelector("textarea").getAttribute("aria-describedby")'),await browser.js('document.querySelector("[role=status]").id'));
  // A trusted Tab moves from the query to its submit control.
  await browser.field('textarea','keyboard query');
  for(const type of ['keyDown','keyUp'])await browser.send('Input.dispatchKeyEvent',{type,key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.equal(await browser.js('document.activeElement?.tagName'),'BUTTON');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,'narrow layout contained');
  assert.deepEqual(browser.errors,[]);
  assert.deepEqual(browser.network.filter(request=>!request.allowed),[]);
  await writeFile(path.join(directory,`finder-${width}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  journeys.push({width,checks:['native query edits and submissions','captured-query status','prior result removal','abort and stale response exclusion','malformed payload recovery','503 retry','canonical relative result href','persistent labels and live feedback','trusted keyboard traversal','viewport containment'],passed:true});
  await browser.close();browser=null;
 }
 await writeFile(path.join(directory,'report.json'),JSON.stringify({journeys,issues:0,scope:'Actual AiFinder with synthetic endpoint; no paid calls, production publication or account acceptance.'},null,2)+'\n');
 console.log(JSON.stringify({journeys:journeys.length,issues:0,directory}));
}catch(error){await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),journeys,pageErrors:browser?.errors},null,2));throw error;}
finally{await browser?.close();await server?.close();}
