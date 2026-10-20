import {spawn} from 'node:child_process';
import {mkdtemp, mkdir, writeFile, readFile, readdir, rm, rename} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {startDraftPreview} from './draft-preview.mjs';
const artifacts=process.env.DRAFT_PREVIEW_ARTIFACTS||'/workspace/review-artifacts/authenticated-draft-persistence-2026-10-20/browser';
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
 await send('Page.navigate',{url:'http://127.0.0.1:4183/tests/draft-preview/?accountFixture=1'});
 await until(`!![...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('DRAFT calculator'))`,'preview UI');
 const ids=[205,206,232,233,435,441,481,484,487,498,517,518,529,531];
 async function snapshot(){return js(`JSON.parse([...document.querySelectorAll('.calculator-scenarios details')].find(d=>d.querySelector('summary')?.textContent.startsWith('Complete snapshot A')).querySelector('pre').textContent)`);}
 let downloadIndex=0;
 async function downloaded(ending,prior){const end=Date.now()+10000;while(Date.now()<end){const name=(await readdir(downloads)).find(n=>n.endsWith(ending)&&!prior.includes(n));if(name){const raw=await readFile(path.join(downloads,name),'utf8');await rename(path.join(downloads,name),path.join(downloads,`${++downloadIndex}-${name}`));return ending==='.csv'?raw:JSON.parse(raw);}await new Promise(r=>setTimeout(r,40));}throw Error('Missing download '+ending);}
 for(const width of [320,1280]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  for(const masterId of ids){
   await select('DRAFT calculator',String(masterId));await click('Load example');await click('Calculate');await until(`!!document.querySelector('.result-box')`,'calculation');
   await js(`document.querySelector('.calculator-scenarios details').open=true`);await click('Capture baseline A');const original=await snapshot();
   const before=await js(`window.__draftAccountFixture.rows.length`);await click('Save to account');await until(`document.querySelector('[role=status]')?.textContent.includes('Snapshot saved')`,'saved');
   const row=await js(`window.__draftAccountFixture.rows.at(-1)`);assert.deepEqual(row.capture.snapshot.input,original.input);assert.deepEqual(row.capture.snapshot.output,original.output);assert.equal(row.capture.snapshot.calculatorVersion,1);assert.equal(row.capture.masterId,masterId);assert.equal(row.owner,'synthetic-account-a');assert.equal(await js(`window.__draftAccountFixture.rows.length`),before+1);
   await click('Load example');assert.deepEqual(await snapshot(),original,'saved scenario immutable while form changes');await click('Reopen account snapshot');await until(`document.querySelector('[role=status]')?.textContent.includes('Reopened')`,'reopened');
   await click('Replace baseline A');assert.deepEqual(await snapshot(),original,'raw reopen snapshot');
   const prior=await readdir(downloads);await click('Export calculation JSON');const exported=await downloaded('-draft.json',prior);assert.deepEqual(exported.input,original.input);assert.deepEqual(exported.output,original.output);assert.equal(exported.calculatorVersion,1);await click('Export calculation CSV');const csv=await downloaded('.csv',prior);assert(csv.startsWith('"section","field","value"'));const csvRows=csv.split('\n').map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));for(const section of ['input','output'])for(const [field,value] of Object.entries(original[section])){const row=csvRows.find(r=>r[0]===section&&r[1]===field);assert(row);const raw=typeof value==='object'&&value!==null?JSON.stringify(value):String(value);assert.equal(row[2],typeof value==='string'&&/^[\s]*[=+\-@]/u.test(value)?"'"+raw:raw);}
   if(masterId===205)assert.equal(exported.output.result,'0.3');if(masterId===232)assert.equal(exported.output.result,'9007199254740994');if(masterId===517)assert(Array.isArray(exported.input.assessments));if(masterId===531)assert.equal(exported.output.weightNewtons,70*9.80665);
   assert(await js(`document.documentElement.scrollWidth<=innerWidth+1`),'no overflow');
   assert.equal(await js(`[...document.querySelectorAll('input,select')].filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')).length`),0);
   report.checks.push({masterId,width,saveReopen:true,rawSnapshotMatches:true,actualJsonDownload:true,serverTypePreserved:true});
  }
  await writeFile(path.join(artifacts,`synthetic-account-${width}.png`),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
 }
 await select('DRAFT calculator','205');await click('Load example');await click('Calculate');
 const count=await js(`window.__draftAccountFixture.rows.length`);
 await js(`window.__draftAccountFixture.mode='commit-error'`);await click('Save to account');
 await until(`!!document.querySelector('[role=alert]')`,'ambiguous error');await until(`document.activeElement===document.querySelector('[role=alert]')`,'error focus');
 assert.equal(await js(`window.__draftAccountFixture.rows.length`),count+1);await click('Save to account');await until(`document.querySelector('[role=status]')?.textContent.includes('Snapshot saved')`,'retry');
 const calls=await js(`window.__draftAccountFixture.calls.filter(c=>c.operation==='save').slice(-2)`);assert.equal(calls[0].requestId,calls[1].requestId);assert.match(calls[0].requestId,/^[0-9a-f-]{36}$/);assert.equal(await js(`window.__draftAccountFixture.rows.length`),count+1);report.checks.push({ambiguousCommitRetrySameUuid:true,noDuplicate:true,errorFocus:true});
 await click('Load example');await click('Calculate');await js(`window.__draftAccountFixture.mode='pending'`);await click('Save to account');await until(`window.__draftAccountFixture.pending.length===1`,'pending save');
 await select('Fixture owner','synthetic-account-b');await js(`window.__draftAccountFixture.release()`);await until(`!document.querySelector('.result-box')`,'owner reset');assert(!(await js(`document.body.innerText`)).includes('Snapshot saved to your account.'));assert.equal(await js(`[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot')).options.length`),1);report.checks.push({pendingSaveOwnerSwitchIgnored:true,ownerRecordsIsolated:true});
 await select('Fixture owner','synthetic-account-a');await select('DRAFT calculator','205');
 await js(`(()=>{const s=[...document.querySelectorAll('select')].find(e=>e.labels?.[0]?.textContent.includes('Saved account snapshot'));Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,s.options[1].value);s.dispatchEvent(new Event('change',{bubbles:true}));window.__draftAccountFixture.mode='pending'})()`);
 await click('Reopen account snapshot');await until(`window.__draftAccountFixture.pending.length===1`,'pending reopen');await select('Fixture owner','synthetic-account-b');await js(`window.__draftAccountFixture.release()`);assert(!(await js(`document.body.innerText`)).includes('Reopened saved account snapshot.'));assert(!(await js(`!!document.querySelector('.result-box')`)));report.checks.push({pendingReopenOwnerSwitchIgnored:true});
 await js(`document.querySelector('[data-field=left] input').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert.equal(await js(`document.activeElement.id`),'draft-205-operation');report.checks.push({keyboardTabFocus:true});
 assert(report.network.every(r=>r.allowed),'loopback only');report.passed=true;report.physicalDevice='UNKNOWN';report.saveReopenCases=28;report.actualJsonDownloads=28;report.actualCsvDownloads=28;
 await writeFile(path.join(artifacts,'browser-regressions.json'),JSON.stringify(report,null,2));console.log(`PASS ${report.checks.length} synthetic browser checks; 28 save/reopen cases; physical device UNKNOWN`);
} catch(error){report.passed=false;report.error=String(error.stack||error);await writeFile(path.join(artifacts,'browser-regressions.json'),JSON.stringify(report,null,2));throw error;}
finally{socket?.close();browser.kill('SIGTERM');await server.close();await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}
