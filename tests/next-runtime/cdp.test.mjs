import assert from 'node:assert/strict';
import test from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {startBrowser} from './cdp.mjs';

// Real Chromium on about:blank: no Next server, identity fixture, or external requests.
test('cleanup completes after Chromium has already exited', {timeout:10000}, async()=>{
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

test('CDP commands time out and cleanup rejects outstanding commands', {timeout:10000}, async()=>{
 const browser=await startBrowser('http://127.0.0.1:1');
 try{
  await assert.rejects(browser.send('Runtime.evaluate',{expression:'new Promise(()=>{})',awaitPromise:true},50),/command timed out: Runtime.evaluate/);
  const pending=assert.rejects(browser.send('Runtime.evaluate',{expression:'new Promise(()=>{})',awaitPromise:true}),/cleanup started|connection closed/);
  await browser.close();
  await pending;
 }finally{await browser.close()}
});
