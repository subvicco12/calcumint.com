import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ensureCanonicalSource,canonicalSourceCommit} from './source-bootstrap.mjs';
const origin='https://github.com/subvicco12/calcumint.com.git';
test('exact present predecessor is reused without network or source substitution',()=>{
 const calls=[];const result=ensureCanonicalSource(args=>{calls.push(args);if(args[0]==='remote')return Buffer.from(origin+'\n');assert.deepEqual(args,['rev-parse','--verify',canonicalSourceCommit+'^{commit}']);return Buffer.from(canonicalSourceCommit+'\n');});
 assert.equal(result.fetched,0);assert.equal(result.sourceRevisions,1);assert.equal(result.productionWrites,false);assert.equal(calls.length,3);
});
test('one missing literal predecessor is fetched once and reverified',()=>{
 let available=false;const fetches=[];
 const result=ensureCanonicalSource(args=>{if(args[0]==='remote')return Buffer.from(origin.slice(0,-4)+'\n');if(args[0]==='fetch'){fetches.push(args);available=true;return Buffer.from('');}assert.deepEqual(args,['rev-parse','--verify',canonicalSourceCommit+'^{commit}']);if(!available)throw Error('missing');return Buffer.from(canonicalSourceCommit);});
 assert.deepEqual(fetches,[['fetch','--no-tags','--depth=1','origin','3c9fc6bdcedf053d2315470f8c0ee549d53bd5de']]);assert.equal(result.fetched,1);
});
test('wrong, local, credential-bearing or multiple origins fail before any object lookup or fetch',()=>{
 for(const url of ['file:///tmp/repo','/tmp/repo','http://github.com/subvicco12/calcumint.com.git','git@github.com:subvicco12/calcumint.com.git','https://github.com/other/calcumint.com.git','https://github.com/subvicco12/calcumint.com.evil','https://token@github.com/subvicco12/calcumint.com.git',origin+'\n'+origin]){
  let count=0;assert.throws(()=>ensureCanonicalSource(args=>{count++;assert.equal(args[0],'remote');return Buffer.from(url);}),/Exact HTTPS/);assert.equal(count,1);
 }
});
test('substituted present commit cannot nominate a different object or trigger a fallback fetch',()=>{
 assert.throws(()=>ensureCanonicalSource(args=>{if(args[0]==='remote')return Buffer.from(origin);assert.equal(args[0],'rev-parse');return Buffer.from('0'.repeat(40));}),/Substituted canonical source commit/);
});
test('fetch failure propagates without retries or fallback bytes',()=>{
 let fetches=0;assert.throws(()=>ensureCanonicalSource(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='rev-parse')throw Error('missing');fetches++;throw Error('network unavailable');}),/network unavailable/);assert.equal(fetches,1);
});
test('missing or substituted post-fetch object fails closed',()=>{
 for(const substituted of [false,true]){let fetched=false;assert.throws(()=>ensureCanonicalSource(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch'){assert.equal(fetched,false);fetched=true;return Buffer.from('');}if(fetched&&substituted)return Buffer.from('f'.repeat(40));throw Error('missing');}),substituted?/Substituted canonical/:/unavailable after bounded fetch/);assert.equal(fetched,true);}
});
