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

checkedTest('headless CDP startup does not depend on the inherited desktop session bus', {timeout:30000}, async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-session-bus-test-'));
 const address=path.join(dir,'bus'),sockets=new Set();let connections=0;
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
 const launcher=path.join(dir,'launcher.sh'),evidence=path.join(dir,'child.txt');
 // exec preserves the process identity, so cleanup must terminate Chromium itself.
 await writeFile(launcher,`browser=$1\nshift\nprintf '%s\\n' "$$" "$@" > ${JSON.stringify(evidence)}\nexec "$browser" "$@" 2>/dev/null\n`);
 let browser;
 try{
  browser=await startBrowser('http://127.0.0.1:1',[],{executable:'/bin/sh',launchArgs:[launcher,process.env.CHROMIUM_PATH||'/usr/bin/chromium']});
  assert.equal(await browser.js('1+1'),2);
  const [pid,...args]=(await readFile(evidence,'utf8')).trim().split('\n');
  const profile=args.find(arg=>arg.startsWith('--user-data-dir=')).slice(16);
  await browser.close();
  assert.throws(()=>process.kill(Number(pid),0),{code:'ESRCH'});
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
 await writeFile(launcher,`import {writeFileSync} from 'node:fs';writeFileSync(${JSON.stringify(evidence)},JSON.stringify({pid:process.pid,profile:process.argv.find(arg=>arg.startsWith('--user-data-dir=')).slice(16)}));setInterval(()=>{},1000);`);
 try{
  await assert.rejects(startBrowser('http://127.0.0.1:1',[],{executable:process.execPath,launchArgs:[launcher],startupTimeoutMs:200}),/No Chromium CDP/);
  const child=JSON.parse(await readFile(evidence,'utf8'));
  assert.throws(()=>process.kill(child.pid,0),{code:'ESRCH'});
  await assert.rejects(access(child.profile),{code:'ENOENT'});
 }finally{await rm(dir,{recursive:true,force:true})}
});
