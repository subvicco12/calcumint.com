import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const source=readFileSync('tests/next-cohort-20261110/source/retained-runtime.mjs','utf8'),body=/export function primeRuntimeEvidenceBatchObjects\(\.\.\.extra\)\{([\s\S]*?)\n\}/.exec(source)?.[1];assert(body);
function fixture(){let calls=0,fail=true;const read=()=>{},git=()=>{};const api=new Function('assert','primeRetainedImmutableObjects','readFileSync','git','let immutableObjectsPreloaded=false,batchObjectsPrimed=false;return{run:function(...extra){'+body+'},flags:()=>({immutableObjectsPreloaded,batchObjectsPrimed})};')(assert,(r,g)=>{assert.equal(r,read);assert.equal(g,git);calls++;if(fail)throw Error('Immutable availability unavailable');},read,git);return{...api,calls:()=>calls,allow:()=>{fail=false;}};}
test('opt-in initialization only primes fixed immutable transport and never marks default authority proof ready',()=>{
 const f=fixture();assert.throws(()=>f.run(),/Immutable availability unavailable/);assert.deepEqual(f.flags(),{immutableObjectsPreloaded:false,batchObjectsPrimed:false});f.allow();f.run();assert.equal(f.calls(),2);assert.deepEqual(f.flags(),{immutableObjectsPreloaded:false,batchObjectsPrimed:true});f.run();assert.equal(f.calls(),2);
 assert.throws(()=>f.run({read:()=>{}}),/Custom immutable batch prewarm inputs are forbidden/);
});
