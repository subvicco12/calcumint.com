import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {startBrowser} from './cdp.mjs';
import {recordedDownload} from './recorded-download.mjs';

test('native download waits for hydrated enabled control and verifies its own GUID bytes',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'recorded-download-test-'));
 const server=http.createServer((req,res)=>{res.setHeader('content-type','text/html');res.end(`<main><button disabled>Export recorded JSON</button><script>const b=document.querySelector('button');b.__reactProps$test={};window.enableExport=()=>b.disabled=false;b.onclick=()=>{window.clicks=(window.clicks||0)+1;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['{"fresh":true}'],{type:'application/json'}));a.download='recorded.json';a.click()};</script></main>`)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  await writeFile(path.join(directory,'stale.json'),'stale bytes');
  browser=await startBrowser(`http://127.0.0.1:${server.address().port}`);await browser.visit('/');
  // Reproduce the previous helper's silent click on the initial free-plan state.
  await browser.click('Export recorded JSON');assert.equal(await browser.js('window.clicks||0'),0);
  const release=setTimeout(()=>{void browser.js('window.enableExport()')},200);
  const first=await recordedDownload(browser,{label:'Export recorded JSON',filename:'recorded.json',directory});
  clearTimeout(release);
  const second=await recordedDownload(browser,{label:'Export recorded JSON',filename:'recorded.json',directory});
  assert.equal(first.bytes.toString(),'{"fresh":true}');assert.equal(second.bytes.toString(),'{"fresh":true}');assert.notEqual(first.guid,second.guid);assert.notEqual(first.file,second.file);assert.equal(await browser.js('window.clicks'),2);assert(first.events.some(e=>e.state==='completed'));
  await assert.rejects(recordedDownload(browser,{label:'Export recorded JSON',filename:'wrong.json',directory}),/Unexpected download filename/);
  assert.equal(await browser.js('window.clicks'),3);
 }finally{await browser?.close();await new Promise(r=>server.close(r));await rm(directory,{recursive:true,force:true})}
});

test('observer setup rejects an unanswered command or socket failure within its bound',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'recorded-download-bound-'));
 const NativeWebSocket=globalThis.WebSocket;
 try{
  await writeFile(path.join(directory,'DevToolsActivePort'),'12345\n/devtools/browser/test\n');
  for(const failure of ['timeout','error','close']){
   let clicks=0;
   globalThis.WebSocket=class {
    static OPEN=1;readyState=1;
    constructor(){queueMicrotask(()=>this.onopen?.())}
    send(){if(failure!=='timeout')queueMicrotask(()=>failure==='error'?this.onerror?.():this.onclose?.())}
    close(){this.readyState=3;this.onclose?.()}
   };
   const browser={until:async()=>{},startupTrace:{profile:directory},click:async()=>{clicks++}};
   await assert.rejects(recordedDownload(browser,{label:'Export recorded JSON',filename:'recorded.json',directory,timeoutMs:25}),failure==='timeout'?/command timed out/:failure==='error'?/observer failed/:/observer closed/);
   assert.equal(clicks,0,'setup failure must prevent the trusted click');
  }
 }finally{globalThis.WebSocket=NativeWebSocket;await rm(directory,{recursive:true,force:true})}
});
