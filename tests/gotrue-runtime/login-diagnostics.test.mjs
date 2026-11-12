import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {installLoginDiagnostics,loginDiagnostics,summarizeLoginNetwork,summarizeLoginAuth} from './login-diagnostics.mjs';
function fixture(){
 const dom=new JSDOM('<main><form><input name="email" type="email" required><input name="password" type="password" required><button type="submit">Sign in</button></form></main>',{url:'http://127.0.0.1/login',runScripts:'outside-only'});
 dom.window.document.elementFromPoint=()=>dom.window.document.querySelector('button');
 const browser={js:async expression=>dom.window.eval(expression)};
 return {dom,browser};
}
test('diagnostics observe original event cancellation without canceling or reading credentials',async()=>{
 const {dom,browser}=fixture();try{
  await installLoginDiagnostics(browser);
  const {document,Event}=dom.window;
  document.querySelector('[name=email]').value='private@example.invalid';
  document.querySelector('[name=password]').value='SecretNeverRecord';
  const form=document.querySelector('form');let submitted=0;
  form.addEventListener('submit',event=>{submitted++;event.preventDefault();});
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await Promise.resolve();
  const state=await loginDiagnostics(browser),serialized=JSON.stringify(state);
  assert.equal(submitted,1);assert.equal(state.events[0].defaultPrevented,true);
  assert.equal(state.events[0].trusted,false);
  assert(!serialized.includes('private@example.invalid'));assert(!serialized.includes('SecretNeverRecord'));
  assert.equal(state.controls[0].valid,true);assert.equal(state.controls[1].valueLength,17);
 }finally{dom.window.close();}
});
test('diagnostics report actual invalid fields without triggering validation events',async()=>{
 const {dom,browser}=fixture();try{
  await installLoginDiagnostics(browser);const state=await loginDiagnostics(browser);
  assert.equal(state.events.length,0);assert.equal(state.controls[0].valueMissing,true);assert.equal(state.controls[1].valid,false);
 }finally{dom.window.close();}
});

test('network summary cannot persist credentials in URLs headers payloads or arbitrary fields',()=>{
 const secret='NeverPersistToken';
 const result=summarizeLoginNetwork([{method:'POST',url:'http://local/login?access_token='+secret,headers:{authorization:secret},body:secret},{method:'GET',url:'http://local/account',cookie:secret},{method:secret,url:'http://local/'+secret}]);
 assert.deepEqual(result,{loginPosts:1,accountRequests:1});assert(!JSON.stringify(result).includes(secret));
});

test('auth summary records only numeric token response statuses after browser start',()=>{
 const secret='NeverPersistToken';
 const result=summarizeLoginAuth([{method:'POST',path:'/auth/v1/token',status:200,body:secret},{method:'POST',path:'/auth/v1/token',status:secret},{method:'POST',path:secret,status:401}]);
 assert.deepEqual(result,{tokenStatuses:[200]});assert(!JSON.stringify(result).includes(secret));
});
