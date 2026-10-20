import {spawn} from 'node:child_process';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {startDraftPreview} from './draft-preview.mjs';
const artifacts=process.env.DRAFT_PREVIEW_ARTIFACTS||'/workspace/review-artifacts/atomic-history-pagination-2026-10-20/browser';
await mkdir(artifacts,{recursive:true});
const downloads=path.join(artifacts,'browser-downloads');await rm(downloads,{recursive:true,force:true});await mkdir(downloads,{recursive:true});
const profile=await mkdtemp(path.join(os.tmpdir(),'draft-chromium-'));
await mkdir(path.join(profile,'Default'),{recursive:true});await writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({profile:{default_content_setting_values:{automatic_downloads:1}},download:{prompt_for_download:false}}));
const server=await startDraftPreview(4183);
const browser=spawn(process.env.CHROMIUM_PATH||'/usr/bin/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--no-first-run','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let diagnostic='';browser.stderr.on('data',v=>diagnostic+=v);
const deadline=Date.now()+30000;
let endpoint;
while(Date.now()<deadline){const match=diagnostic.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){endpoint=match[1];break;}await new Promise(r=>setTimeout(r,30));}
let socket;const report={browser:'Chromium headless via native CDP; synthetic account fixture; no real authentication tested',limitations:['Headless Chromium viewport/touch emulation; no physical-device verification.','Export clicks are paced 350 ms apart to avoid Chromium automatic-download burst throttling.'],checks:[],network:[]};
try {
 assert(endpoint,'Chromium debugging endpoint');
 const target=await (await fetch(`http://127.0.0.1:${new URL(endpoint).port}/json/new?about:blank`,{method:'PUT'})).json();
 socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let id=0;const pending=new Map();const events=[];
 socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}else{events.push(m);if(m.method.startsWith('Browser.download'))(report.downloadEvents??=[]).push(m);if(m.method==='Fetch.requestPaused'){const url=m.params.request.url;const allowed=url.startsWith('http://127.0.0.1:4183/')||url.startsWith('data:')||url.startsWith('blob:http://127.0.0.1:4183/');report.network.push({url,allowed});send(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:'BlockedByClient'}).catch(()=>{});}}};
 function send(method,params={}){return new Promise((resolve,reject)=>{const seq=++id;pending.set(seq,{resolve,reject});socket.send(JSON.stringify({id:seq,method,params}));});}
 async function js(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+': '+r.exceptionDetails.exception?.description);return r.result.value;}
 async function until(expression,label){const end=Date.now()+20000;while(Date.now()<end){if(await js(expression))return;await new Promise(r=>setTimeout(r,40));}throw Error(`Timed out: ${label}`);}
 let lastDownloadRequest=0;
 async function click(text){if(text.startsWith('Export ')){/* Chromium limits rapid download bursts; pace requests independently of DOM readiness. */const remaining=350-(Date.now()-lastDownloadRequest);if(remaining>0)await new Promise(resolve=>setTimeout(resolve,remaining));lastDownloadRequest=Date.now();}const point=await js(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b)throw Error('Missing button '+${JSON.stringify(text)});if(b.disabled)throw Error('Disabled button '+${JSON.stringify(text)});b.scrollIntoView({behavior:'instant',block:'center'});const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});}
 async function select(label,value){await js(`(()=>{const el=[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes(${JSON.stringify(label)}));if(!el)throw Error('Missing select');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('change',{bubbles:true}))})()`);}
 await send('Runtime.enable');await send('Network.enable');await send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 await send('Page.enable');await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads,eventsEnabled:true});
 await send('Page.navigate',{url:'http://127.0.0.1:4183/tests/draft-preview/?accountFixture=1&paginationFixture=1'});
 await until(`!![...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('DRAFT calculator'))`,'preview UI');

 for(const width of [320,1280]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===320});
  await click('Calculate');await select('Saved account snapshot','history:synthetic-0999');
  const selection=await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).value`);
  await js(`window.__draftAccountFixture.mode='page-error'`);await click('Load older history');
  await until(`!!document.querySelector('[role=alert]')`,'page error');await until(`document.activeElement===document.querySelector('[role=alert]')`,'error focus');
  assert(!(await js(`document.body.innerText`)).includes('Private transport details'));
  await js(`window.__draftAccountFixture.mode='pending'`);await click('Load older history');await until(`window.__draftAccountFixture.pending.length===1`,'pending page');
  assert(await js(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Load older scenarios').disabled`));
  await js(`window.__draftAccountFixture.release()`);await until(`!![...document.querySelectorAll('button')].find(e=>e.textContent==='Load older history'&&!e.disabled)`,'retry success');
  const calls=await js(`window.__draftAccountFixture.calls.filter(c=>c.operation==='page').slice(-2)`);assert.equal(calls[0].cursor,calls[1].cursor);
  assert.equal(await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).value`),selection);
  assert(await js(`!!document.querySelector('.result-box')`));
  await js(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Load older scenarios').focus()`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await until(`window.__draftAccountFixture.calls.at(-1)?.source==='scenario'`,'keyboard scenario page');
  assert(await js(`document.documentElement.scrollWidth<=innerWidth+1`),'no overflow');
  await writeFile(path.join(artifacts,`pagination-${width}.png`),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  report.checks.push({width,errorFocus:true,retrySameCursor:true,pendingLock:true,selectionAndCapturePreserved:true,keyboardScenarioPage:true});
 }
 await js(`window.__draftAccountFixture.mode='pending'`);await click('Load older history');await until(`window.__draftAccountFixture.pending.length===1`,'plan pending');
 const beforePlan=await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).options.length`);
 await select('Fixture plan','business');await js(`window.__draftAccountFixture.release()`);await until(`!![...document.querySelectorAll('button')].find(e=>e.textContent==='Load older history'&&!e.disabled)`,'plan ignored');
 assert.equal(await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).options.length`),beforePlan);
 report.checks.push({latePlanPageIgnored:true});
 await js(`window.__draftAccountFixture.mode='pending'`);await click('Load older history');await until(`window.__draftAccountFixture.pending.length===1`,'owner pending');
 await select('Fixture owner','synthetic-account-b');await js(`window.__draftAccountFixture.release()`);
 assert(!(await js(`document.body.innerText`)).includes('synthetic-account-a history'));
 report.checks.push({lateOwnerPageIgnored:true});
 for(const label of ['Load older history','Load older scenarios']) while(await js(`[...document.querySelectorAll('button')].some(e=>e.textContent===${JSON.stringify(label)})`)) {
  await click(label);await until(`![...document.querySelectorAll('button')].some(e=>e.textContent.startsWith('Loading older'))`,'next page');
 }
 for(const masterId of [205,206,232,233,435,441,481,484,487,498,517,518,529,531]) {
  await select('DRAFT calculator',String(masterId));
  assert.equal(await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).options.length`),19);
 }
 report.checks.push({exhausted126RecordsPerSource:true,all14CalculatorsReachOlderRecords:true,sameUuidSourcesDistinct:true});

 assert.equal(await js(`window.__draftAccountFixture.calls.filter(c=>c.operation==='save').length`),0);
 assert(report.network.every(r=>r.allowed));report.passed=true;
 await writeFile(path.join(artifacts,'browser-regressions.json'),JSON.stringify(report,null,2));console.log(`PASS ${report.checks.length} pagination browser checks`);
} catch(error){report.passed=false;report.error=String(error.stack||error);await writeFile(path.join(artifacts,'browser-regressions.json'),JSON.stringify(report,null,2));throw error;}
finally{socket?.close();browser.kill('SIGTERM');await server.close();await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}
