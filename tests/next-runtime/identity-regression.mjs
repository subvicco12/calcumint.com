import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {mkdtemp,writeFile,symlink,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
import {build} from 'vite';
import {startAuthFixture} from './auth-fixture.mjs';
import {startBrowser} from './cdp.mjs';

// Real installed SDK + application cookie transport + real HTTP + real Chromium.
// Only the CDP cookie-write scheduling is controlled to expose the intermediate state.
export async function verifySyntheticIdentityContinuity(context){
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
 const dir=await mkdtemp(path.join(os.tmpdir(),'cdp-identity-regression-'));
 const db={jwtSecret:randomBytes(48).toString('hex'),users:{owner:{id:'00000000-0000-4000-8000-000000000001',email:'owner@example.invalid'},outsider:{id:'00000000-0000-4000-8000-000000000002',email:'outsider@example.invalid'}}};
 const pendingVerifications=[];
 let auth,browser,server,selection,release=()=>{},releaseUser=()=>{};
 try{
  auth=await startAuthFixture(db);
  await symlink(path.join(root,'node_modules'),path.join(dir,'node_modules'),process.platform==='win32'?'junction':'dir');
  const entry=path.join(dir,'entry.ts');
  await writeFile(entry,`import {createSupabaseBrowserClient} from ${JSON.stringify(path.join(root,'src/lib/supabase/browser.ts'))};
   const client=createSupabaseBrowserClient();
   globalThis.verifyIdentity=async()=>{try{const r=await client.auth.getUser();return {id:r.data.user?.id??null,error:r.error?.name??null,sessionChanged:r.error?.message==='Authentication session changed. Retry.'}}catch(e){return {id:null,error:e.name,sessionChanged:e.message==='Authentication session changed. Retry.'}}};`);
  const result=await build({configFile:false,root:dir,logLevel:'error',resolve:{alias:{'@':path.join(root,'src')}},define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify(auth.url),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-local-anon')},build:{write:false,minify:false,lib:{entry,name:'identityRegression',formats:['iife']}}});
  const code=(Array.isArray(result)?result[0]:result).output.find(value=>value.type==='chunk').code;
  server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/probe.js'?'application/javascript':'text/html');res.end(req.url==='/probe.js'?code:'<main>Isolated SDK identity regression</main><script src="/probe.js"></script>')});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  browser=await startBrowser(base,[auth.url]);
  const cookie=auth.cookie(db.users.owner);
  await browser.identity(cookie);await browser.visit('/');await browser.until('typeof verifyIdentity==="function"');
  assert.deepEqual(await browser.js('verifyIdentity()'),{id:db.users.owner.id,error:null,sessionChanged:false});
  async function pendingVerification(){
   const before=auth.requests.filter(request=>request.path==='/auth/v1/user').length;
   const result=browser.js('verifyIdentity()');
   result.catch(()=>{});pendingVerifications.push(result);
   const deadline=Date.now()+5000;
   while(auth.requests.filter(request=>request.path==='/auth/v1/user').length===before){assert(Date.now()<deadline,'SDK verification did not dispatch');await delay(5)}
   return {result};
  }
  releaseUser=auth.holdUserRequests();const pending=await pendingVerification();
  const nativeSend=WebSocket.prototype.send;let pause;
  const paused=new Promise(resolve=>{pause=resolve});
  context.mock.method(WebSocket.prototype,'send',function(data){
   const message=JSON.parse(String(data));
   if(message.method==='Network.setCookie'){
    release=()=>{release=()=>{};nativeSend.call(this,data)};pause();return;
   }
   return nativeSend.call(this,data);
  });
  selection=browser.identity(cookie);
  // A correct no-op resolves selection; a destructive selection pauses after clearing.
  await Promise.race([paused,selection]);
  releaseUser();
  const sameOwner=await pending.result;release();await selection;context.mock.restoreAll();
  assert.deepEqual(sameOwner,{id:db.users.owner.id,error:null,sessionChanged:false},'Same-owner fixture selection must preserve an in-flight verified SDK read');
  releaseUser=auth.holdUserRequests();const replaced=await pendingVerification();
  await browser.identity(auth.cookie(db.users.outsider));
  releaseUser();
  assert.deepEqual(await replaced.result,{id:null,error:'AuthRetryableFetchError',sessionChanged:true},'A real owner replacement must still discard the pending owner response');
  assert.deepEqual(await browser.js('verifyIdentity()'),{id:db.users.outsider.id,error:null,sessionChanged:false});
 }finally{
  releaseUser();release();context.mock.restoreAll();await selection?.catch(()=>{});
  try{await browser?.close()}finally{await Promise.allSettled(pendingVerifications);if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve))}await auth?.close();await rm(dir,{recursive:true,force:true})}
 }
}
