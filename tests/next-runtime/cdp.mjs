import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {startupDiagnostics} from './startup-diagnostics.mjs';
export async function startBrowser(base,allowedOrigins=[],{startupTimeoutMs=20000,executable=process.env.CHROMIUM_PATH||'/usr/bin/chromium',launchArgs=[]}={}){
 const trace=startupDiagnostics(executable,{enabled:process.env.CDP_STARTUP_DIAGNOSTICS==='1'});trace.event('profile-start');
 const profile=await mkdtemp(path.join(os.tmpdir(),'actual-next-chromium-'));let diagnostic='',seq=0,socket,scriptsResumeAt=0,scriptsHeld=false;const heldScripts=[];const pending=new Map(),errors=[],network=[];
 // Headless tests do not need a desktop session bus. An inherited/autolaunched bus
 // can stall both Chromium startup and /json/new while D-Bus authentication waits.
 // A valid unavailable Unix address fails immediately; only this child is isolated.
 const child=spawn(executable,[...launchArgs,'--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{env:{...process.env,DBUS_SESSION_BUS_ADDRESS:'unix:path=/dev/null'},stdio:['ignore','ignore','pipe']});trace.start(child.pid);child.stderr.on('data',v=>diagnostic+=v);child.once('exit',(code,signal)=>trace.event('process-exit',{code,signal}));
 const rejectPending=error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error)}pending.clear()};
 let launchError;child.on('error',error=>{launchError=error});
 const exited=()=>!!launchError||child.exitCode!==null||child.signalCode!==null;
 const waitForExit=timeoutMs=>new Promise(resolve=>{
  if(exited()){resolve(true);return}
  const done=value=>{clearTimeout(timer);child.removeListener('exit',onExit);resolve(value)},onExit=()=>done(true);
  const timer=setTimeout(()=>done(false),timeoutMs);child.once('exit',onExit);if(exited())done(true);
 });
 let closing;
 const close=()=>closing??= (async()=>{
  rejectPending(Error('Chromium CDP cleanup started'));
  try{try{socket?.close()}catch{/* Process termination still runs if a connecting socket refuses close. */}if(!exited()){child.kill('SIGTERM');if(!await waitForExit(5000)){child.kill('SIGKILL');if(!await waitForExit(2000))throw Error('Chromium did not exit after SIGKILL')}}}
  finally{await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100})}
 })();
 try{
 const deadline=Date.now()+startupTimeoutMs;let endpoint;trace.event('readiness-wait',{startupTimeoutMs});
 while(Date.now()<deadline){
  if(launchError)throw launchError;
  if(exited())throw Error('Chromium exited before CDP startup: '+diagnostic);
  // stderr is diagnostic output, not a readiness contract. Chromium also publishes
  // its ephemeral debugging port in the unique profile, even with quiet logging.
  // Ignore incomplete writes and never consume a partial stderr URL.
  try{
   const activePort=await readFile(path.join(profile,'DevToolsActivePort'),'utf8');
   const match=activePort.match(/^(\d+)\r?\n(\/devtools\/browser\/[^\s]+)(?:\r?\n|$)/);
   if(match&&Number(match[1])>0&&Number(match[1])<=65535)endpoint=`ws://127.0.0.1:${match[1]}${match[2]}`;
  }catch(error){if(error.code!=='ENOENT')throw error}
  endpoint??=diagnostic.match(/DevTools listening on (ws:\/\/[^\s]+)\r?\n/)?.[1];
  if(endpoint){trace.event('endpoint-ready');break;}
  await new Promise(r=>setTimeout(r,40));
 }
 if(!endpoint)throw Error('No Chromium CDP '+diagnostic);
 const setupTimeout=()=>{
  const remaining=deadline-Date.now();
  if(remaining<=0)throw Error('Chromium CDP startup timed out');
  return remaining;
 };
 trace.event('target-create');
 const response=await fetch(`http://127.0.0.1:${new URL(endpoint).port}/json/new?about:blank`,{method:'PUT',signal:AbortSignal.timeout(setupTimeout())});
 if(!response.ok)throw Error(`Chromium CDP target creation failed: ${response.status}`);
 const target=await response.json();trace.event('target-ready');socket=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Chromium CDP WebSocket startup timed out')),setupTimeout());
  const finish=(error)=>{clearTimeout(timer);if(error)reject(error);else resolve()};
  socket.onopen=()=>finish();socket.onerror=()=>finish(Error('Chromium CDP WebSocket startup failed'));socket.onclose=()=>finish(Error('Chromium CDP WebSocket closed during startup'));
 });
 trace.event('websocket-ready');
 socket.onclose=()=>rejectPending(Error('Chromium CDP connection closed'));
 socket.onerror=()=>rejectPending(Error('Chromium CDP connection failed'));
 const send=(method,params={},timeoutMs=method==='Page.navigate'?120000:30000)=>new Promise((resolve,reject)=>{
  if(socket.readyState!==WebSocket.OPEN){reject(Error(`Chromium CDP connection is closed: ${method}`));return}
  const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error(`Chromium CDP command timed out: ${method}`))},timeoutMs);
  pending.set(id,{resolve,reject,timer});
  try{socket.send(JSON.stringify({id,method,params}))}catch(error){clearTimeout(timer);pending.delete(id);reject(error)}
 });
 socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);else if(m.method==='Network.webSocketCreated'){const u=new URL(m.params.url);network.push({method:'WEBSOCKET',url:u.origin+u.pathname,allowed:u.host===new URL(base).host})}else if(m.method==='Fetch.requestPaused'){const allowed=[base,...allowedOrigins].some(origin=>m.params.request.url.startsWith(origin+'/'))||m.params.request.url==='about:blank';network.push({method:m.params.request.method,url:m.params.request.url.split('?')[0],allowed});if(allowed&&m.params.resourceType==='Script'&&scriptsHeld){heldScripts.push(m.params.requestId);return}if(allowed&&m.params.resourceType==='Script'&&Date.now()<scriptsResumeAt){setTimeout(()=>send('Fetch.continueRequest',{requestId:m.params.requestId}).catch(()=>{}),scriptsResumeAt-Date.now());return}send(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:'BlockedByClient'}).catch(()=>{})}};
 const js=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const until=async(expression,timeout=45000)=>{const end=Date.now()+timeout;while(Date.now()<end){if(await js(expression))return;await new Promise(r=>setTimeout(r,60))}throw Error('Timed out '+expression+'; body: '+await js('document.body.innerText.slice(-6000)'))};
 await send('Page.enable',{},setupTimeout());await send('Runtime.enable',{},setupTimeout());await send('Network.enable',{},setupTimeout());await send('Fetch.enable',{patterns:[{urlPattern:'*'}]},setupTimeout());
 const visit=async route=>{await send('Page.navigate',{url:base+route});await until('document.readyState==="complete"');await until('!!document.querySelector("main")');};
 const click=async label=>{const point=await js(`(()=>{const e=[...document.querySelectorAll('button,a')].find(e=>e.textContent.trim()===${JSON.stringify(label)});if(!e)throw Error('Missing '+${JSON.stringify(label)});e.scrollIntoView({behavior:'instant',block:'center'});const r=e.getClientRects()[0];return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point})};
 // A visible SSR control can precede React's listener attachment. Send trusted edits only once hydrated.
 const field=async(selector,value)=>{await until(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});return !!e&&!e.matches(':disabled')&&Object.keys(e).some(k=>k.startsWith('__reactProps$'))})()`);await js(`document.querySelector(${JSON.stringify(selector)}).focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',modifiers:2,windowsVirtualKeyCode:65});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',modifiers:2,windowsVirtualKeyCode:65});await send('Input.insertText',{text:String(value)})};

 trace.event('domains-ready');const startupTrace=await trace.finish(child.pid);if(process.env.CDP_STARTUP_DIAGNOSTICS==='1')console.error('CDP startup ready '+JSON.stringify(startupTrace));
 return {startupTrace,send,js,until,visit,click,field,errors,network,delayScripts(ms){scriptsResumeAt=Date.now()+ms},holdScripts(){scriptsHeld=true;return async()=>{scriptsHeld=false;await Promise.all(heldScripts.splice(0).map(requestId=>send('Fetch.continueRequest',{requestId}))) }},text:()=>js('document.body.innerText'),async identity(cookie){
  if(cookie){
   const {cookies}=await send('Network.getCookies',{urls:[base]});
   const session=cookies.filter(current=>current.name===cookie.name||current.name.startsWith(cookie.name+'.'));
   // Selecting the identical fixture session must not create a logged-out gap
   // underneath an in-flight SDK verification. Real replacements still clear it.
   if(session.length===1&&session[0].name===cookie.name&&session[0].value===cookie.value)return;
  }
  await send('Network.clearBrowserCookies');
  if(cookie)await send('Network.setCookie',{...cookie,url:base,httpOnly:false,sameSite:'Lax'});
 },close};
 }catch(error){trace.event('startup-failed',{name:error.name});error.startupTrace=await trace.finish(child.pid);if(process.env.CDP_STARTUP_DIAGNOSTICS==='1')console.error('CDP startup diagnostics '+JSON.stringify(error.startupTrace));try{await close()}catch(cleanupError){throw new AggregateError([error,cleanupError],'Chromium startup and cleanup failed')}throw error}
}
