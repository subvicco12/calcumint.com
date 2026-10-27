import assert from 'node:assert/strict';
import {createServer} from 'node:net';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';

const profile=await mkdtemp(path.join(os.tmpdir(),'cidr-browser-'));
const report={journeys:[],blockedRequests:[],pageErrors:[],limitations:['Synthetic account transport; no real authentication or persistence.','Headless Chromium at mobile/desktop widths; no physical-device verification.','Reviewed CIDR remains non-public.']};
let server,browser,socket;
try {
 const listener=createServer();
 await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));
 const {port}=listener.address();
 await new Promise((resolve,reject)=>listener.close(error=>error?reject(error):resolve()));
 server=await startDraftPreview(port,{fixture:'cidr'});
 const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=spawn(process.env.CHROMIUM_PATH||'/usr/bin/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--no-first-run','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
 let diagnostic='',spawnError;
 browser.on('error',error=>{spawnError=error;});browser.stderr.on('data',data=>{diagnostic+=data;});
 const deadline=Date.now()+30000;
 let endpoint;
 while(Date.now()<deadline&&!spawnError&&browser.exitCode===null){endpoint=diagnostic.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];if(endpoint)break;await new Promise(r=>setTimeout(r,30));}
 assert(endpoint,spawnError?.message??'Chromium debugging endpoint unavailable');
 const target=await (await fetch(`http://127.0.0.1:${new URL(endpoint).port}/json/new?about:blank`,{method:'PUT'})).json();
 socket=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let sequence=0;const pending=new Map();
 function send(method,params={}){return new Promise((resolve,reject)=>{
  const id=++sequence;const timeout=setTimeout(()=>{pending.delete(id);reject(Error(`CDP timeout: ${method}`));},20000);
  pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:error=>{clearTimeout(timeout);reject(error);}});
  socket.send(JSON.stringify({id,method,params}));
 });}
 socket.onmessage=({data})=>{
  const message=JSON.parse(data);
  if(message.id){const handler=pending.get(message.id);pending.delete(message.id);if(handler){if(message.error)handler.reject(Error(message.error.message));else handler.resolve(message.result);}return;}
  if(message.method==='Runtime.exceptionThrown')report.pageErrors.push(message.params.exceptionDetails.text);
  if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')report.pageErrors.push('console.error');
  if(message.method==='Network.responseReceived'&&message.params.response.status>=400)report.pageErrors.push(`HTTP ${message.params.response.status}: ${message.params.response.url}`);
  if(message.method==='Fetch.requestPaused'){
   const {requestId,request}=message.params;const allowed=request.url.startsWith(origin+'/')||request.url.startsWith('data:')||request.url.startsWith('blob:'+origin+'/');
   if(!allowed)report.blockedRequests.push(request.url);
   send(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId}:{requestId,errorReason:'BlockedByClient'}).catch(error=>report.pageErrors.push(error.message));
  }
 };
 async function js(expression){const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description??response.exceptionDetails.text);return response.result.value;}
 async function until(expression,label){const end=Date.now()+15000;while(Date.now()<end){if(await js(expression))return;await new Promise(r=>setTimeout(r,30));}throw Error('Timed out: '+label);}
 async function setInput(value){await js(`(()=>{const el=document.querySelector('.calculator-ui input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);}
 const headline="document.querySelector('.final-calculator-renderer [role=status] strong')?.textContent";
 await send('Runtime.enable');await send('Network.enable');await send('Page.enable');
 await send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 for(const width of [320,1280])for(const plan of ['free','pro','business']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  await send('Page.navigate',{url:`${origin}/tests/cidr-review/?plan=${plan}`});
  await until(`document.querySelector('[data-testid=resolved-plan]')?.textContent===${JSON.stringify(plan)}&&${headline}==='256 addresses'`,'initial result and resolved plan');
  await until(`[...document.querySelectorAll('button')].some(b=>b.textContent==='Save calculation')`,'account controls');
  assert.equal(await js("document.querySelector('.calculator-ui input').getAttribute('step')"),'1');
  assert.equal(await js("document.querySelector('.calculator-ui input').getAttribute('min')"),'0');
  assert.equal(await js("document.querySelector('.final-calculator-renderer [role=status]').getAttribute('aria-live')"),'polite');
  for(const [value,expected] of [['0','4,294,967,296 addresses'],['24','256 addresses'],['31','2 addresses'],['32','1 addresses']]){
   await setInput(value);await until(`${headline}===${JSON.stringify(expected)}`,'boundary '+value);
  }
  for(const value of ['','-1','33','1.5']){
   await setInput(value);
   await until("document.querySelector('.calculator-ui [role=alert]')?.textContent==='Enter a whole-number CIDR prefix from 0 to 32.'",'invalid '+value);
   assert.equal(await js("!!document.querySelector('.final-calculator-renderer')"),false);
   assert.equal(await js("[...document.querySelectorAll('button')].find(b=>b.textContent==='Save calculation').disabled"),true);
   assert.equal(await js("[...document.querySelectorAll('button')].find(b=>b.textContent==='Capture baseline A').disabled"),true);
   await setInput('24');await until(`${headline}==='256 addresses'&&!document.querySelector('.calculator-ui [role=alert]')`,'recovery');
  }
  // Actual keyboard event changes the numeric input, then tabs to a native disclosure.
  await js("document.querySelector('.calculator-ui input').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
  await until(`${headline}==='128 addresses'`,'keyboard increment');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.equal(await js('document.activeElement.textContent'),'Methodology');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  assert(await js("document.querySelector('.final-calculator-renderer details').open"));
  assert(await js("document.querySelector('.final-calculator-renderer details p').textContent.includes('total IPv4 addresses')"));
  await js("document.querySelectorAll('.final-calculator-renderer summary')[1].click()");
  assert(await js("document.querySelectorAll('.final-calculator-renderer details')[1].open"));
  assert.equal(await js("document.querySelector('.final-calculator-renderer a').href"),'https://www.rfc-editor.org/rfc/rfc4632');
  assert.equal(await js('document.documentElement.scrollWidth>innerWidth+1'),false,'horizontal overflow with disclosures open');
  assert.equal(await js("!!document.querySelector('.final-analysis, .final-calculator-renderer table')"),false);
  assert.equal(await js("[...document.querySelectorAll('button')].find(b=>b.textContent==='Capture baseline A').disabled"),plan==='free');
  report.journeys.push({width,plan,boundaries:4,invalidRecoveryCases:4,keyboard:true,trustDisclosures:true,noOverflow:true,entitlementChecked:true});
 }
 assert.deepEqual(report.blockedRequests,[],'unexpected external traffic');
 assert.deepEqual(report.pageErrors,[],'page errors');
 console.log(JSON.stringify(report,null,2));
}finally{
 await writeFile(process.env.CIDR_BROWSER_REPORT||'/tmp/cidr-browser-report.json',JSON.stringify(report,null,2));
 socket?.close();
 if(browser&&browser.exitCode===null){const closed=new Promise(resolve=>browser.once('close',resolve));browser.kill('SIGTERM');await closed;}
 await server?.close();await rm(profile,{recursive:true,force:true});
}
