import assert from 'node:assert/strict';
import {mkdtemp,readFile,stat} from 'node:fs/promises';
import path from 'node:path';

// A dedicated browser socket observes native download lifecycle events without
// changing the historical page CDP harness or synthesizing application clicks.
export async function recordedDownload(browser,{label,filename,directory,timeoutMs=30000}){
 await browser.until(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(label)});return !!b&&!b.disabled&&!!b.getClientRects().length&&Object.keys(b).some(k=>k.startsWith('__reactProps$'))})()`);
 const destination=await mkdtemp(path.join(directory,'invocation-'));
 const [port,endpoint]=(await readFile(path.join(browser.startupTrace.profile,'DevToolsActivePort'),'utf8')).trim().split(/\r?\n/);
 const socket=new WebSocket(`ws://127.0.0.1:${port}${endpoint}`);
 let sequence=0,active,finished=false,timer;const pending=new Map();const events=[];
 let resolveDownload,rejectDownload;
 const completion=new Promise((resolve,reject)=>{resolveDownload=resolve;rejectDownload=reject});
 // Observe rejection immediately, including failure while the trusted click awaits CDP.
 completion.catch(()=>{});
 const rejectPending=error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error)}pending.clear()};
 const fail=error=>{rejectPending(error);if(!finished){finished=true;rejectDownload(error)}};
 try{
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('Download observer connection timed out')),timeoutMs);socket.onopen=()=>{clearTimeout(t);resolve()};socket.onerror=()=>{clearTimeout(t);reject(Error('Download observer connection failed'))};socket.onclose=()=>{clearTimeout(t);reject(Error('Download observer closed during connection'))}});
  socket.onclose=()=>fail(Error('Download observer closed before completion'));
  socket.onerror=()=>fail(Error('Download observer failed'));
  socket.onmessage=({data})=>{
   const message=JSON.parse(data);
   if(message.id){const p=pending.get(message.id);if(p){clearTimeout(p.timer);pending.delete(message.id);if(message.error)p.reject(Error(message.error.message));else p.resolve(message.result)}return}
   if(message.method==='Browser.downloadWillBegin'){
    events.push({event:'begin',...message.params});
    if(active){fail(Error('Unexpected additional native download'));return}
    if(message.params.suggestedFilename!==filename){fail(Error('Unexpected download filename: '+message.params.suggestedFilename));return}
    active=message.params.guid;
   }else if(message.method==='Browser.downloadProgress'){
    const event=message.params;events.push({event:'progress',...event});
    if(event.guid!==active)return;
    if(event.state==='canceled'){fail(Error('Native download canceled: '+active));return}
    if(event.state==='completed'&&!finished){finished=true;resolveDownload(event)}
   }
  };
  const send=(method,params)=>new Promise((resolve,reject)=>{
   if(socket.readyState!==WebSocket.OPEN){reject(Error('Download observer is closed: '+method));return}
   const id=++sequence,commandTimer=setTimeout(()=>{pending.delete(id);reject(Error('Download observer command timed out: '+method))},timeoutMs);
   pending.set(id,{resolve,reject,timer:commandTimer});
   try{socket.send(JSON.stringify({id,method,params}))}catch(error){clearTimeout(commandTimer);pending.delete(id);reject(error)}
  });
  await send('Browser.setDownloadBehavior',{behavior:'allowAndName',downloadPath:destination,eventsEnabled:true});
  timer=setTimeout(()=>fail(Error('Native download did not complete: '+JSON.stringify(events))),timeoutMs);
  await browser.click(label); // One trusted user gesture; no retry or DOM anchor interception.
  const completed=await completion;
  assert(active&&/^[a-zA-Z0-9-]+$/.test(active),'Native download GUID');
  assert.equal(completed.receivedBytes,completed.totalBytes,'Complete native byte count');
  const file=path.join(destination,active),metadata=await stat(file),bytes=await readFile(file);
  assert(metadata.isFile());assert.equal(bytes.length,completed.receivedBytes);assert(bytes.length>0);
  return {bytes,guid:active,filename,file,events};
 }finally{clearTimeout(timer);finished=true;rejectPending(Error('Download observer cleanup'));socket.close();}
}
