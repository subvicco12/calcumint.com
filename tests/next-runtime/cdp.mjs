import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
export async function startBrowser(base,allowedOrigins=[]){
 const profile=await mkdtemp(path.join(os.tmpdir(),'actual-next-chromium-'));let diagnostic='',seq=0,socket,scriptsResumeAt=0,scriptsHeld=false;const heldScripts=[];const pending=new Map(),errors=[],network=[];
 const child=spawn(process.env.CHROMIUM_PATH||'/usr/bin/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});child.stderr.on('data',v=>diagnostic+=v);
 const deadline=Date.now()+20000;let endpoint;while(Date.now()<deadline){endpoint=diagnostic.match(/DevTools listening on (ws:\/\/\S+)/)?.[1];if(endpoint)break;await new Promise(r=>setTimeout(r,40))}if(!endpoint)throw Error('No Chromium CDP '+diagnostic);
 const target=await(await fetch(`http://127.0.0.1:${new URL(endpoint).port}/json/new?about:blank`,{method:'PUT'})).json();socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j});
 const rejectPending=error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error)}pending.clear()};
 socket.onclose=()=>rejectPending(Error('Chromium CDP connection closed'));
 socket.onerror=()=>rejectPending(Error('Chromium CDP connection failed'));
 const send=(method,params={},timeoutMs=method==='Page.navigate'?120000:30000)=>new Promise((resolve,reject)=>{
  if(socket.readyState!==WebSocket.OPEN){reject(Error(`Chromium CDP connection is closed: ${method}`));return}
  const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error(`Chromium CDP command timed out: ${method}`))},timeoutMs);
  pending.set(id,{resolve,reject,timer});
  try{socket.send(JSON.stringify({id,method,params}))}catch(error){clearTimeout(timer);pending.delete(id);reject(error)}
 });
 const exited=()=>child.exitCode!==null||child.signalCode!==null;
 const waitForExit=timeoutMs=>new Promise(resolve=>{
  if(exited()){resolve(true);return}
  const done=value=>{clearTimeout(timer);child.removeListener('exit',onExit);resolve(value)},onExit=()=>done(true);
  const timer=setTimeout(()=>done(false),timeoutMs);child.once('exit',onExit);if(exited())done(true);
 });
 let closing;
 const close=()=>closing??= (async()=>{
  rejectPending(Error('Chromium CDP cleanup started'));socket.close();
  try{if(!exited()){child.kill('SIGTERM');if(!await waitForExit(5000)){child.kill('SIGKILL');if(!await waitForExit(2000))throw Error('Chromium did not exit after SIGKILL')}}}
  finally{await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100})}
 })();
 socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);else if(m.method==='Network.webSocketCreated'){const u=new URL(m.params.url);network.push({method:'WEBSOCKET',url:u.origin+u.pathname,allowed:u.host===new URL(base).host})}else if(m.method==='Fetch.requestPaused'){const allowed=[base,...allowedOrigins].some(origin=>m.params.request.url.startsWith(origin+'/'))||m.params.request.url==='about:blank';network.push({method:m.params.request.method,url:m.params.request.url.split('?')[0],allowed});if(allowed&&m.params.resourceType==='Script'&&scriptsHeld){heldScripts.push(m.params.requestId);return}if(allowed&&m.params.resourceType==='Script'&&Date.now()<scriptsResumeAt){setTimeout(()=>send('Fetch.continueRequest',{requestId:m.params.requestId}).catch(()=>{}),scriptsResumeAt-Date.now());return}send(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:'BlockedByClient'}).catch(()=>{})}};
 const js=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const until=async(expression,timeout=45000)=>{const end=Date.now()+timeout;while(Date.now()<end){if(await js(expression))return;await new Promise(r=>setTimeout(r,60))}throw Error('Timed out '+expression+'; body: '+await js('document.body.innerText.slice(-6000)'))};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 const visit=async route=>{await send('Page.navigate',{url:base+route});await until('document.readyState==="complete"');await until('!!document.querySelector("main")');};
 const click=async label=>{const point=await js(`(()=>{const e=[...document.querySelectorAll('button,a')].find(e=>e.textContent.trim()===${JSON.stringify(label)});if(!e)throw Error('Missing '+${JSON.stringify(label)});e.scrollIntoView({behavior:'instant',block:'center'});const r=e.getClientRects()[0];return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point})};
 // A visible SSR control can precede React's listener attachment. Send trusted edits only once hydrated.
 const field=async(selector,value)=>{await until(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});return !!e&&!e.matches(':disabled')&&Object.keys(e).some(k=>k.startsWith('__reactProps$'))})()`);await js(`document.querySelector(${JSON.stringify(selector)}).focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',modifiers:2,windowsVirtualKeyCode:65});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',modifiers:2,windowsVirtualKeyCode:65});await send('Input.insertText',{text:String(value)})};

 return {send,js,until,visit,click,field,errors,network,delayScripts(ms){scriptsResumeAt=Date.now()+ms},holdScripts(){scriptsHeld=true;return async()=>{scriptsHeld=false;await Promise.all(heldScripts.splice(0).map(requestId=>send('Fetch.continueRequest',{requestId}))) }},text:()=>js('document.body.innerText'),async identity(cookie){await send('Network.clearBrowserCookies');if(cookie)await send('Network.setCookie',{...cookie,url:base,httpOnly:false,sameSite:'Lax'})},close};
}
