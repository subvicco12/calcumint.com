import assert from 'node:assert/strict';
import test from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {mkdtemp,writeFile,readFile,access,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {startBrowser} from './cdp.mjs';

// Preserve exact offline assertion failures in check annotations when private logs are inaccessible.
function checkedTest(name,options,run){return test(name,options,async context=>{try{await run(context)}catch(error){if(process.env.GITHUB_ACTIONS==='true'){const escape=value=>String(value).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A');console.error(`::error title=${escape(name)}::${escape(error?.message||error)}`)}throw error}})}

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
