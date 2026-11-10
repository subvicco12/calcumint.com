import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ensureThirteenProgramSources,thirteenProgramSourceCommits as refs} from './source-bootstrap.mjs';
const origin='https://github.com/subvicco12/calcumint.com.git';
test('exact two present source commits are reused and reverified without fetch',()=>{
 const calls=[];const result=ensureThirteenProgramSources(args=>{calls.push(args);if(args[0]==='remote')return Buffer.from(origin+'\n');assert.equal(args[0],'rev-parse');const ref=args[2].replace('^{commit}','');assert(refs.includes(ref));return Buffer.from(ref+'\n');});
 assert.equal(result.fetched,0);assert.equal(result.sourceRevisions,2);assert.deepEqual(result.sourceCommits,refs);assert.equal(result.productionWrites,false);assert.equal(result.releaseHold,true);assert.equal(calls.length,5);
});
test('both missing literal refs are fetched once each and reverified',()=>{
 const available=new Set(),fetches=[];const result=ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin.slice(0,-4));if(args[0]==='fetch'){fetches.push(args);available.add(args[4]);return Buffer.from('');}const ref=args[2].replace('^{commit}','');if(!available.has(ref))throw Error('missing');return Buffer.from(ref);});
 assert.deepEqual(fetches,refs.map(ref=>['fetch','--no-tags','--depth=1','origin',ref]));assert.equal(result.fetched,2);
});
test('mixed cache fetches only its missing exact ref',()=>{
 let fetched=false;const result=ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch'){assert.deepEqual(args,['fetch','--no-tags','--depth=1','origin',refs[1]]);assert.equal(fetched,false);fetched=true;return Buffer.from('');}const ref=args[2].replace('^{commit}','');if(ref===refs[1]&&!fetched)throw Error('missing');return Buffer.from(ref);});assert.equal(result.fetched,1);
});
test('unsafe, credential-bearing, wrong or multiple origins refuse before object lookup',()=>{
 for(const url of ['file:///tmp/repo','/tmp/repo','ext::sh anything','http://github.com/subvicco12/calcumint.com.git','git@github.com:subvicco12/calcumint.com.git','https://github.com/other/calcumint.com.git','https://github.com/subvicco12/calcumint.com.evil','https://token@github.com/subvicco12/calcumint.com.git',origin+'\n'+origin]){let calls=0;assert.throws(()=>ensureThirteenProgramSources(args=>{calls++;assert.equal(args[0],'remote');return Buffer.from(url);}),/Exact HTTPS/);assert.equal(calls,1);}
});
test('substituted present commit refuses without fallback fetch',()=>{
 let fetches=0;assert.throws(()=>ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch')fetches++;return Buffer.from('0'.repeat(40));}),/Substituted thirteen-program source commit/);assert.equal(fetches,0);
});
test('fetch failure propagates once without retries or further ref fetches',()=>{
 let fetches=0;assert.throws(()=>ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='rev-parse')throw Error('missing');fetches++;throw Error('network unavailable');}),/network unavailable/);assert.equal(fetches,1);
});
test('missing post-fetch object refuses instead of continuing to second ref',()=>{
 let fetches=0;assert.throws(()=>ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch'){fetches++;return Buffer.from('');}throw Error('missing');}),/unavailable after bounded fetch/);assert.equal(fetches,1);
});
test('substituted post-fetch object refuses',()=>{
 let fetched=false;assert.throws(()=>ensureThirteenProgramSources(args=>{if(args[0]==='remote')return Buffer.from(origin);if(args[0]==='fetch'){fetched=true;return Buffer.from('');}if(!fetched)throw Error('missing');return Buffer.from('f'.repeat(40));}),/Substituted thirteen-program source commit/);assert.equal(fetched,true);
});
