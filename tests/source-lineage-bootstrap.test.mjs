import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fetchSourceLineage} from '../scripts/fetch-source-lineage.mjs';
test('reuses verified revisions without redundant network fetch',()=>{
 let calls=0;const result=fetchSourceLineage(args=>{assert.equal(args[0],'rev-parse');calls++;return Buffer.from(args[2].slice(0,40));});
 assert.equal(result.fetched,0);assert.equal(calls,result.sourceRevisions*2);assert.equal(result.releaseHold,true);
});
test('fetches only exact missing commits and re-verifies them',()=>{
 const available=new Set(),fetches=[];
 const result=fetchSourceLineage(args=>{if(args[0]==='fetch'){assert.deepEqual(args.slice(0,4),['fetch','--no-tags','--depth=1','origin']);for(const ref of args.slice(4)){assert.match(ref,/^[a-f0-9]{40}$/);available.add(ref);}fetches.push(args);return Buffer.from('');}const ref=args[2].slice(0,40);if(!available.has(ref))throw Error('missing');return Buffer.from(ref);});
 assert.equal(fetches.length,1);assert.equal(result.fetched,result.sourceRevisions);assert.equal(result.productionWrites,false);
});
test('fails closed on absent or substituted revisions after fetch',()=>{
 assert.throws(()=>fetchSourceLineage(args=>args[0]==='fetch'?Buffer.from(''):Buffer.from('0'.repeat(40))),/unavailable/);
 assert.throws(()=>fetchSourceLineage(()=>{throw Error('network denied');}),/network denied/);
});
