import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';import {startBrowser} from '../next-runtime/cdp.mjs';
const base=path.resolve(process.env.SOFTWARE_CLOSURE_ARTIFACTS||os.tmpdir());await mkdir(base,{recursive:true});const directory=await mkdtemp(path.join(base,'recovery-lifecycle-')),journeys=[];let browser,server;
try{
 const reserve=net.createServer();await new Promise((r,j)=>{reserve.once('error',j);reserve.listen(0,'127.0.0.1',r);});const port=reserve.address().port;await new Promise((r,j)=>reserve.close(e=>e?j(e):r()));server=await startDraftPreview(port);const origin=`http://127.0.0.1:${port}`;
 browser=await startBrowser(origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 async function click(name){await browser.click(name);}
 async function openSummary(text){const selector=`summary[data-browser-summary]`;await browser.js(`(()=>{const e=[...document.querySelectorAll('summary')].find(e=>e.textContent===${JSON.stringify(text)});if(!e)throw Error('Missing disclosure');e.setAttribute('data-browser-summary','');})()`);const point=await browser.js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await browser.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await browser.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});await browser.js('document.querySelector("[data-browser-summary]").removeAttribute("data-browser-summary")');}
 async function upload(file){const {root}=await browser.send('DOM.getDocument');const {nodeId}=await browser.send('DOM.querySelector',{nodeId:root.nodeId,selector:'input[type=file]'});await browser.send('DOM.setFileInputFiles',{nodeId,files:[file]});await browser.until('[...document.querySelectorAll("[role=status]")].some(e=>e.textContent.includes("File read."))');}
 const first=path.join(directory,'first.json'),second=path.join(directory,'second.json');
 const payload=notes=>JSON.stringify({schemaVersion:1,calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,baseline:'A',scenarios:[{slot:'A',notes,input:{percentage:25,value:200},output:{result:50}}]});
 await writeFile(first,payload('Retained native import'));await writeFile(second,payload('Late native import'));
 for(const width of [320,1280])for(const transition of ['cancel','access','identity']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  const nav=await browser.send('Page.navigate',{url:origin+'/tests/software-closure/recovery/'});assert.equal(nav.errorText,undefined);await browser.until('document.querySelector("[data-testid=context]")!==null');
  await openSummary('Recover an exported scenario set');await upload(first);
  await click('Verify and recover scenario set');await browser.until('document.querySelector("[data-testid=recovered]").textContent.includes("Retained native import")');
  const before=await browser.js('document.querySelector("[data-testid=recovered]").textContent');
  await click('Defer next native read');
  const {root}=await browser.send('DOM.getDocument');const {nodeId}=await browser.send('DOM.querySelector',{nodeId:root.nodeId,selector:'input[type=file]'});await browser.send('DOM.setFileInputFiles',{nodeId,files:[second]});
  await browser.until('[...document.querySelectorAll("[role=status]")].some(e=>e.textContent.includes("Reading scenario file"))');
  await click(transition==='cancel'?'Cancel scenario file read':transition==='access'?'Toggle access':'Toggle identity');
  await click('Release native read');await browser.until('Number(document.documentElement.dataset.completedReads)>=2');
  if(transition==='access')await click('Toggle access');
  if(transition==='identity')await click('Toggle identity');
  assert.equal(await browser.js('document.querySelector("textarea").value'),payload('Retained native import'));
  assert.equal(await browser.js('document.querySelector("[data-testid=recovered]").textContent'),before);
  assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Cancel scenario file read").disabled'),true);
  await upload(second);await click('Verify and recover scenario set');await browser.until('document.querySelector("[data-testid=recovered]").textContent.includes("Late native import")');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);journeys.push({width,transition,nativeLateCompletionIgnored:true,retryRecovered:true,passed:true});
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(n=>!n.allowed),[]);await writeFile(path.join(directory,'report.json'),JSON.stringify({journeys,issues:0,scope:'Private fixture with native FileReader; dispatch deferred explicitly to exercise pending-state transitions. Synthetic access and identity, no authenticated or canonical claims.'},null,2));console.log(JSON.stringify({journeys:journeys.length,issues:0,directory}));
}catch(error){await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),journeys,pageErrors:browser?.errors},null,2));throw error;}finally{await browser?.close();await server?.close();}
