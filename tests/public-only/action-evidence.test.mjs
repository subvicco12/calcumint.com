import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertNativeActionDenied} from './action-evidence.mjs';
const error={digest:'12345',name:'FeatureUnavailableError',message:'Feature unavailable in this release',stack:[['requireProductCapability','webpack-internal:///./src/lib/product-mode-server.ts',8,59],['signInWithGoogle','webpack-internal:///./src/app/login/actions.ts',75,27]],env:'Server'};
const serverLog="Error [FeatureUnavailableError]: Feature unavailable in this release\n at requireProductCapability (src/lib/product-mode-server.ts:8:59)\n at signInWithGoogle (src/app/login/actions.ts:75:27)\n digest: '12345'";
const fixture=(changes={})=>({status:500,body:`0:{}\n1:E${JSON.stringify(error)}\n`,serverLog,providerRequests:0,...changes});
test('accepts matched guard evidence for the known action',()=>assert.doesNotThrow(()=>assertNativeActionDenied(fixture())));
for(const [name,input] of [
 ['unknown action lookup',fixture({status:404,body:'Failed to find Server Action',serverLog:'Failed to find Server Action'})],
 ['action decoding error',fixture({body:'1:E'+JSON.stringify({name:'SyntaxError',message:'Unexpected end of JSON input',digest:'12345',stack:[]})})],
 ['unrelated action guard',fixture({body:'1:E'+JSON.stringify({...error,stack:[error.stack[0],['signOut','src/app/login/actions.ts',90,1]]})})],
 ['stale server log',fixture({serverLog:serverLog.replace('12345','98765')})],
 ['missing server guard evidence',fixture({serverLog:'POST /login 500'})],
 ['provider operation despite guard-shaped error',fixture({providerRequests:1})],
 ['successful HTTP response',fixture({status:200})]
])test(`rejects false-positive evidence: ${name}`,()=>assert.throws(()=>assertNativeActionDenied(input)));
import {findKnownLoginAction} from './action-evidence.mjs';
const id='a'.repeat(42);
const registration={filename:'app/login/actions.ts',exportedName:'signInWithGoogle',workers:{'app/login/page':{}}};
test('selects the exact named action rather than the first login worker',()=>{
 assert.equal(findKnownLoginAction({node:{['b'.repeat(42)]:{...registration,exportedName:'signOut'},[id]:registration}}),id);
});
test('rejects absent, ambiguous or wrong-worker action registrations',()=>{
 for(const node of [{},{[id]:{...registration,exportedName:'signOut'}},{[id]:{...registration,workers:{'app/other/page':{}}}},{[id]:registration,['b'.repeat(42)]:registration}])assert.throws(()=>findKnownLoginAction({node}));
});
