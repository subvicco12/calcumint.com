import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createBoundedFetch} from './bounded-fetch.mjs';
const helper=new URL('./bounded-fetch.mjs',import.meta.url).href;
function child(source){
 const result=spawnSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import {createBoundedFetch} from ${JSON.stringify(helper)};${source}`],{timeout:2000,encoding:'utf8'});
 assert.equal(result.error,undefined,result.error?.message);assert.equal(result.status,0,result.stderr);
}
test('hanging transport that ignores abort rejects and Node exits',()=>child(`
 const fetcher=createBoundedFetch({deadline:Date.now()+1000,maxRequestMs:25,fetchImpl:()=>new Promise(()=>{})});
 await assert.rejects(fetcher('http://fixture.invalid'),{name:'TimeoutError'});
`));
test('hanging response body is bounded and Node exits',()=>child(`
 const fetcher=createBoundedFetch({deadline:Date.now()+1000,maxRequestMs:25,fetchImpl:async()=>new Response(new ReadableStream({start(){}}))});
 await assert.rejects(fetcher('http://fixture.invalid'),{name:'TimeoutError'});
`));
test('caller abort reason survives and reaches transport; Node exits',()=>child(`
 const controller=new AbortController(),reason=new Error('caller cancellation');let signal;
 const fetcher=createBoundedFetch({deadline:Date.now()+1000,fetchImpl:(_input,init)=>{signal=init.signal;return new Promise(()=>{})}});
 const pending=fetcher('http://fixture.invalid',{signal:controller.signal});controller.abort(reason);
 await assert.rejects(pending,error=>error===reason);assert.equal(signal.reason,reason);
`));
test('deadline exhaustion avoids transport entirely',async()=>{
 let calls=0;const fetcher=createBoundedFetch({deadline:Date.now()-1,fetchImpl:()=>{calls++;}});
 await assert.rejects(fetcher('http://fixture.invalid'),{name:'TimeoutError'});assert.equal(calls,0);
});
test('remaining campaign budget caps request timeout and Node exits',()=>child(`
 const fetcher=createBoundedFetch({deadline:Date.now()+25,maxRequestMs:10000,fetchImpl:()=>new Promise(()=>{})});
 await assert.rejects(fetcher('http://fixture.invalid'),{name:'TimeoutError'});
`));
test('already aborted Request preserves caller reason without transport',async()=>{
 const controller=new AbortController(),reason=new Error('already cancelled');controller.abort(reason);let calls=0;
 const fetcher=createBoundedFetch({deadline:Date.now()+1000,fetchImpl:()=>{calls++;}});
 await assert.rejects(fetcher(new Request('http://fixture.invalid',{signal:controller.signal})),error=>error===reason);assert.equal(calls,0);
});
test('successful JSON response and empty 204 preserve status/headers',async()=>{
 for(const response of [Response.json({ok:true},{status:201,headers:{'x-campaign':'yes'}}),new Response(null,{status:204})]){
  const fetcher=createBoundedFetch({deadline:Date.now()+1000,fetchImpl:async()=>response});const result=await fetcher('http://fixture.invalid');
  assert.equal(result.status,response.status);assert.equal(result.headers.get('x-campaign'),response.headers.get('x-campaign'));
  if(result.status===201)assert.deepEqual(await result.json(),{ok:true});else assert.equal(await result.text(),'');
 }
});
