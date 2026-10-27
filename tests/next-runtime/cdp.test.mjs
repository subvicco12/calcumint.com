import assert from 'node:assert/strict';
import test from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {mkdtemp,writeFile,readFile,access,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {startBrowser} from './cdp.mjs';
import {verifySyntheticIdentityContinuity} from './identity-regression.mjs';

// Preserve exact offline assertion failures in check annotations when private logs are inaccessible.
function checkedTest(name,options,run){return test(name,options,async context=>{try{await run(context)}catch(error){if(process.env.GITHUB_ACTIONS==='true'){const escape=value=>String(value).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A');console.error(`::error title=${escape(name)}::${escape(error?.message||error)}`)}throw error}})}

checkedTest('synthetic same-owner selection preserves SDK verification while owner replacement fails closed',{timeout:45000},verifySyntheticIdentityContinuity);

checkedTest('trusted field edits wait for a visible non-inert account control and preserve outside focus data',{timeout:30000},async()=>{
 let browser;
 try{
  browser=await startBrowser('http://127.0.0.1:1');
  await browser.js(`(()=>{document.body.innerHTML='<input id="outside" value="keep outside"><div id="account" hidden inert><input id="target"></div>';const target=document.querySelector('#target');target['__reactProps$fixture']={};document.querySelector('#outside').focus();window.revealed=false;setTimeout(()=>{const account=document.querySelector('#account');account.hidden=false;account.inert=false;window.revealed=true},1200)})()`);
  await browser.field('#target','captured name');
  assert.deepEqual(await browser.js(`({target:document.querySelector('#target').value,outside:document.querySelector('#outside').value,revealed:window.revealed})`),{target:'captured name',outside:'keep outside',revealed:true});
 }finally{await browser?.close()}
});

checkedTest('headless CDP startup does not depend on the inherited desktop session bus', {timeout:30000}, async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-session-bus-test-'));
 const address=process.platform==='win32'?`\\\\.\\pipe\\calcumint-cdp-bus-${process.pid}`:path.join(dir,'bus'),sockets=new Set();let connections=0;
 // Accept but never authenticate: a real stalled D-Bus connection, not a timer-based mock.
 const server=net.createServer(socket=>{connections++;sockets.add(socket);socket.on('close',()=>sockets.delete(socket))});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(address,resolve)});
 const original=process.env.DBUS_SESSION_BUS_ADDRESS;
 process.env.DBUS_SESSION_BUS_ADDRESS=`unix:path=${address}`;
 let browser;
 try{
  browser=await startBrowser('http://127.0.0.1:1');
  assert.equal(await browser.js('1+1'),2);
  assert.equal(connections,0,'The headless child must not contact the inherited desktop bus');
 }finally{
  if(original===undefined)delete process.env.DBUS_SESSION_BUS_ADDRESS;else process.env.DBUS_SESSION_BUS_ADDRESS=original;
  try{await browser?.close()}finally{for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true})}
 }
});

checkedTest('Chromium startup uses its readiness file when stderr is quiet', {timeout:30000}, async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-quiet-startup-test-'));
 let browser;
 try{
  browser=await startBrowser('http://127.0.0.1:1',[],{captureStderr:false});
  assert.equal(await browser.js('1+1'),2);
  assert(!browser.startupTrace.events.some(event=>event.phase==='stderr-first'),'Readiness must succeed without captured stderr');
  const {profile,pid}=browser.startupTrace;
  await browser.close();
  assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
  await assert.rejects(access(profile),{code:'ENOENT'});
 }finally{await browser?.close();await rm(dir,{recursive:true,force:true})}
});

for(const {name,delayMs,startupTimeoutMs,expected} of [
 {name:'failed target creation from a readiness file still cleans the child and profile',delayMs:0,startupTimeoutMs:1000,expected:/target creation failed: 503/},
 {name:'target creation can use the remaining startup budget beyond five seconds',delayMs:5500,startupTimeoutMs:10000,expected:/target creation failed: 503/},
 {name:'target creation still aborts at the shared startup deadline and cleans up',delayMs:10000,startupTimeoutMs:5000,expected:/operation was aborted due to timeout/}
])checkedTest(name, {timeout:30000}, async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-file-failure-test-'));
 const launcher=path.join(dir,'launcher.mjs'),evidence=path.join(dir,'child.json');
 await writeFile(launcher,`
  import {createServer} from 'node:http';
  import {writeFileSync} from 'node:fs';
  import path from 'node:path';
  const profile=process.argv.find(arg=>arg.startsWith('--user-data-dir=')).slice(16);
  writeFileSync(${JSON.stringify(evidence)},JSON.stringify({pid:process.pid,profile}));
  const server=createServer((req,res)=>setTimeout(()=>{res.writeHead(503);res.end('Target unavailable')},${delayMs}));
  server.listen(0,'127.0.0.1',()=>writeFileSync(path.join(profile,'DevToolsActivePort'),server.address().port+'\\n/devtools/browser/test-browser\\n'));
 `);
 try{
  await assert.rejects(startBrowser('http://127.0.0.1:1',[],{executable:process.execPath,launchArgs:[launcher],startupTimeoutMs}),expected);
  const child=JSON.parse(await readFile(evidence,'utf8'));
  assert.throws(()=>process.kill(child.pid,0),{code:'ESRCH'});
  await assert.rejects(access(child.profile),{code:'ENOENT'});
 }finally{await rm(dir,{recursive:true,force:true})}
});

// Real Chromium on about:blank: no Next server, identity fixture, or external requests.
checkedTest('cleanup completes after Chromium has already exited', {timeout:30000}, async()=>{
 const browser=await startBrowser('http://127.0.0.1:1');
 try{
  await browser.send('Browser.close');
  await delay(1000); // Reproduce cleanup after the process exit event has already fired.
  const start=Date.now();
  await browser.close();
  assert(Date.now()-start<2000,'Already-exited Chromium cleanup must finish promptly');
  await browser.close();
  await assert.rejects(browser.send('Runtime.evaluate',{expression:'1'}),/connection is closed/);
 }finally{await browser.close()}
});

checkedTest('CDP commands time out and cleanup rejects outstanding commands', {timeout:30000}, async()=>{
 const browser=await startBrowser('http://127.0.0.1:1');
 try{
  await assert.rejects(browser.send('Runtime.evaluate',{expression:'new Promise(()=>{})',awaitPromise:true},50),/command timed out: Runtime.evaluate/);
  const pending=assert.rejects(browser.send('Runtime.evaluate',{expression:'new Promise(()=>{})',awaitPromise:true}),/cleanup started|connection closed/);
  await browser.close();
  await pending;
 }finally{await browser.close()}
});


checkedTest('failed startup terminates a launcher that never exposes CDP and removes its profile', {timeout:30000}, async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-no-endpoint-test-'));
 const launcher=path.join(dir,'launcher.mjs'),evidence=path.join(dir,'child.json');
 await writeFile(launcher,`import {writeFileSync} from 'node:fs';await new Promise(resolve=>setTimeout(resolve,1000));writeFileSync(${JSON.stringify(evidence)},JSON.stringify({pid:process.pid,profile:process.argv.find(arg=>arg.startsWith('--user-data-dir=')).slice(16)}));setInterval(()=>{},1000);`);
 let child;
 try{
  await assert.rejects(startBrowser('http://127.0.0.1:1',[],{executable:process.execPath,launchArgs:[launcher],startupTimeoutMs:200}),error=>{
   assert.match(error.message,/No Chromium CDP/);
   assert(Array.isArray(error.startupTrace?.events),'Startup failure must retain bounded phase evidence');
   const phases=error.startupTrace.events.map(event=>event.phase);
   assert(phases.includes('readiness-wait'));
   assert(error.startupTrace.events.some(event=>event.phase==='readiness-file'&&event.state==='absent'));
   assert(phases.includes('startup-failed'));
   assert(phases.includes('process-exit'),'Failed launch must still record process termination');
   assert(!phases.includes('endpoint-ready'),'A never-ready launcher cannot be reported ready');
   child=error.startupTrace;
   assert(Number.isInteger(child.pid),'The parent must retain its actual spawned PID');
   assert.equal(typeof child.profile,'string');
   assert(phases.includes('profile-removed'),'Failed launch must record profile cleanup');
   return true;
  });
  // The deadline can kill Node before its launcher executes. Parent-owned
  // process/profile evidence must not depend on a child-written startup file.
  assert.throws(()=>process.kill(child.pid,0),{code:'ESRCH'});
  await assert.rejects(access(child.profile),{code:'ENOENT'});
 }finally{await rm(dir,{recursive:true,force:true})}
});
