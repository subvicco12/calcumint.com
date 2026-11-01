import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForCachedColumn} from './readiness.mjs';
const spec=column=>({definitions:{user_preferences:{properties:{[column]:{type:'string'}}}}});
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
test('cached OpenAPI column, not successful SQL projection, controls readiness',async()=>{
 let calls=0;const result=await waitForCachedColumn({url:'https://fixture.invalid/rest/v1/',relation:'user_preferences',column:'country_code',pollMs:1,fetchImpl:async(url,options)=>{assert.equal(url,'https://fixture.invalid/rest/v1/');assert.equal(options.headers.Accept,'application/openapi+json');calls++;return response(calls<3?spec('currency'):spec('country_code'));}});
 assert.equal(calls,3);assert.equal(result.attempts,3);
});
test('wrong relation and unrelated column cannot establish readiness',async()=>{
 await assert.rejects(waitForCachedColumn({url:'https://fixture.invalid/',relation:'profiles',column:'country_code',timeoutMs:15,pollMs:1,fetchImpl:async()=>response(spec('country_code'))}),/cache readiness deadline/);
});
test('authorization failure is immediate and not swallowed as reload delay',async()=>{
 let calls=0;await assert.rejects(waitForCachedColumn({url:'https://fixture.invalid/',relation:'user_preferences',column:'country_code',fetchImpl:async()=>{calls++;return response({},403);}}),/HTTP 403/);assert.equal(calls,1);
});
test('a stalled request is aborted within the total readiness budget',async()=>{
 await assert.rejects(waitForCachedColumn({url:'https://fixture.invalid/',relation:'user_preferences',column:'country_code',timeoutMs:20,fetchImpl:(_,options)=>new Promise((_,reject)=>{options.signal.addEventListener('abort',()=>reject(options.signal.reason),{once:true});})}),/cache readiness deadline/);
});
