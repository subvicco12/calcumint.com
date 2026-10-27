import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForDocument} from './navigation-ready.mjs';

test('navigation readiness requires DOMContentLoaded for the exact new loader',async()=>{
 const events=[{method:'Page.lifecycleEvent',params:{name:'DOMContentLoaded',loaderId:'previous'}}];
 let finished=false;
 const waiting=waitForDocument(events,'current',{timeoutMs:1000}).then(()=>{finished=true;});
 await new Promise(resolve=>setTimeout(resolve,40));
 assert.equal(finished,false,'a previous document cannot release the UI checks');
 events.push({method:'Page.lifecycleEvent',params:{name:'DOMContentLoaded',loaderId:'current'}});
 await waiting;
});

test('missing document readiness fails at its bounded deadline without renavigation',async()=>{
 await assert.rejects(waitForDocument([], 'missing',{timeoutMs:20}),/Document did not finish loading: missing/);
});
