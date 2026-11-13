import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {resolve} from 'node:path';
import {accepted,verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
const root=resolve(new URL('../../',import.meta.url).pathname),ids=accepted.map(r=>r.blob);
const actual=(args,options={})=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:128*1024*1024,...options});
const fullBatch=actual(['cat-file','--batch'],{input:Buffer.from(ids.join('\n')+'\n'),stdio:['pipe','pipe','pipe']});
const content=new Map(accepted.map(r=>[r.blob,actual(['cat-file','blob',r.blob])])),byPath=new Map(accepted.map(r=>[r.path,r]));
const head=actual(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),target='tests/parallel-source-20261110/bootstrap.mjs';
function fixture({preload=true}={}){
 const events=[];let batches=0,batchOverride=null,pathOverride=false,rawOverride=false,preloadFailure=false;
 const objects=makeGitReader((args,options)=>{assert.deepEqual(args,['cat-file','--batch']);assert.equal(options.input.toString(),ids.join('\n')+'\n');batches++;return batchOverride?.(batches)??fullBatch;});
 const git=args=>{events.push(args[0]);if(args[0]==='rev-parse'&&args[1]==='--verify')return Buffer.from(head+'\n');if(args[0]==='rev-parse'){const path=args[1].slice(41);return Buffer.from((pathOverride&&path===target?'0'.repeat(40):byPath.get(path).blob)+'\n');}assert.equal(args[0],'cat-file');if(rawOverride&&args[2]===byPath.get(target).blob)return Buffer.from('substituted current Git bytes');return preload?objects(args):content.get(args[2]);};
 if(preload)git.preloadBlobs=values=>{events.push('preload');assert.deepEqual(values,ids);if(preloadFailure)throw Error('preload rejected');objects.preloadBlobs(values);};
 return{git,events,read:path=>Buffer.from(content.get(byPath.get(path).blob)),get batches(){return batches;},set batchOverride(v){batchOverride=v;},set pathOverride(v){pathOverride=v;},set rawOverride(v){rawOverride=v;},set preloadFailure(v){preloadFailure=v;}};
}
test('only static accepted IDs preload before the first per-record Git read',()=>{const f=fixture();assert.equal(verifyParallelAuthority(f.read,f.git),true);assert.equal(f.batches,1);assert(f.events.indexOf('preload')<f.events.indexOf('cat-file'));assert.equal(verifyParallelAuthority(f.read,f.git),true);assert.equal(f.batches,1);});
test('malformed or wrong-content batch cannot establish authority',()=>{for(const bytes of [Buffer.from('invalid batch'),(()=>{const b=Buffer.from(fullBatch);b[b.indexOf(10)+1]^=1;return b;})()]){const f=fixture();f.batchOverride=()=>bytes;assert.throws(()=>verifyParallelAuthority(f.read,f.git));}});
test('successful preload never admits mutated or retained-valid reverted current files',()=>{const f=fixture();verifyParallelAuthority(f.read,f.git);const old=actual(['show','f0f6b507a18bf51d7c8925734d854a05120ade10:'+target]);assert(!old.equals(f.read(target)));for(const bytes of [Buffer.from('mutated current file'),old])assert.throws(()=>verifyParallelAuthority(path=>path===target?bytes:f.read(path),f.git),/Independent current target bytes differ/);});
test('fresh HEAD path and raw object checks still reject substitutions after success',()=>{const f=fixture();verifyParallelAuthority(f.read,f.git);f.pathOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/Independent parallel HEAD authority differs/);f.pathOverride=false;f.rawOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git));});
test('preload failure never becomes success and a fresh retry validates every live read',()=>{const f=fixture();f.preloadFailure=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/preload rejected/);f.preloadFailure=false;assert.equal(verifyParallelAuthority(f.read,f.git),true);f.preloadFailure=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/preload rejected/);});
test('opaque transports without preload preserve the original fresh per-record behavior',()=>{const f=fixture({preload:false});assert.equal(verifyParallelAuthority(f.read,f.git),true);assert(!f.events.includes('preload'));f.rawOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git));});
