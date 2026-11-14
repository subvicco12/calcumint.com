import {sourceStage8CapturePath,sourceStage8Policy} from '../milestone100-20261114/source-stage8-activation.mjs';
import {readFileSync} from 'node:fs';
import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {resolve} from 'node:path';
import {accepted,verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
const root=resolve(new URL('../../',import.meta.url).pathname),ids=accepted.map(r=>r.blob);
const actual=(args,options={})=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:128*1024*1024,...options});
const fullBatch=actual(['cat-file','--batch'],{input:Buffer.from(ids.join('\n')+'\n'),stdio:['pipe','pipe','pipe']});
const content=new Map(accepted.map(r=>[r.blob,actual(['cat-file','blob',r.blob])])),byPath=new Map(accepted.map(r=>[r.path,r]));
const sourceCapture=JSON.parse(readFileSync(sourceStage8CapturePath)),sourceNames=[sourceStage8CapturePath,...sourceStage8Policy.paths],sourceContent=new Map(sourceNames.map(path=>[path,readFileSync(path)]));
const sourceIDs=[...new Set(sourceCapture.rows.flatMap(row=>[row.predecessor,row.current].filter(Boolean)).map(row=>row.blob))];
const head=actual(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),target='tests/parallel-source-20261110/bootstrap.mjs';
function fixture({preload=true}={}){
 const events=[],sourceReads=new Set(),sourceObjects=makeGitReader(actual);let batches=0,batchOverride=null,pathOverride=false,rawOverride=false,preloadFailure=false,phase='idle',sourceGitReads=0,pendingAuthorityRead,sourceOverride=null;
 const sourceFirst=()=>{assert.equal(sourceReads.size,sourceStage8Policy.paths.length,'Every actual source read must precede authority operations');assert(sourceGitReads>0,'Real source Git proof must precede authority operations');};
 const objects=makeGitReader((args,options)=>{assert.deepEqual(args,['cat-file','--batch']);assert.equal(options.input.toString(),ids.join('\n')+'\n');batches++;return batchOverride?.(batches)??fullBatch;});
 const git=(args,options)=>{
  if(phase==='source'){
   if(JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])&&sourceReads.size===sourceStage8Policy.paths.length){sourceFirst();phase='authority';}
   else{assert(['rev-parse','cat-file','diff','status','ls-tree'].includes(args[0]),'Read-only source Git query required');sourceGitReads++;return sourceObjects(args,options);}
  }
  assert.equal(phase,'authority','Authority operations require a completed source proof');events.push(args[0]);
  if(args[0]==='rev-parse'&&args[1]==='--verify')return Buffer.from(head+'\n');
  if(args[0]==='rev-parse'){const path=args[1].slice(41);assert(byPath.has(path),'Unknown authority path '+path);pendingAuthorityRead=path;return Buffer.from((pathOverride&&path===target?'0'.repeat(40):byPath.get(path).blob)+'\n');}
  assert.equal(args[0],'cat-file');if(rawOverride&&args[2]===byPath.get(target).blob)return Buffer.from('substituted current Git bytes');return preload?objects(args):content.get(args[2]);
 };
 if(preload)git.preloadBlobs=values=>{if(phase==='source'){assert.deepEqual(values,sourceIDs,'Only exact independently pinned source blob IDs may preload');sourceObjects.preloadBlobs(values);return;}sourceFirst();assert.equal(phase,'authority');events.push('preload');assert.deepEqual(values,ids);if(preloadFailure)throw Error('preload rejected');objects.preloadBlobs(values);};
 return{git,events,read:path=>{
  if(path===sourceStage8CapturePath&&pendingAuthorityRead!==path){phase='source';sourceReads.clear();sourceGitReads=0;}
  if(phase==='source'){assert(sourceContent.has(path),'Unknown closed source target '+path);if(path!==sourceStage8CapturePath)sourceReads.add(path);return Buffer.from(sourceOverride&&path===sourceStage8Policy.paths[0]?sourceOverride:sourceContent.get(path));}
  assert(byPath.has(path),'Unknown closed authority target '+path);pendingAuthorityRead=undefined;return Buffer.from(content.get(byPath.get(path).blob));
 },set sourceOverride(v){sourceOverride=v;},get batches(){return batches;},set batchOverride(v){batchOverride=v;},set pathOverride(v){pathOverride=v;},set rawOverride(v){rawOverride=v;},set preloadFailure(v){preloadFailure=v;}};
}
test('only static accepted IDs preload before the first per-record Git read',()=>{const f=fixture();assert.equal(verifyParallelAuthority(f.read,f.git),true);assert.equal(f.batches,1);assert(f.events.indexOf('preload')<f.events.indexOf('cat-file'));assert.equal(verifyParallelAuthority(f.read,f.git),true);assert.equal(f.batches,1);assert.throws(()=>f.read('undeclared-source-target'),/Unknown closed authority target/);});
test('malformed or wrong-content batch cannot establish authority',()=>{const source=fixture();source.sourceOverride=Buffer.from('changed source');assert.throws(()=>verifyParallelAuthority(source.read,source.git),/Current factory bytes differ/);assert.equal(source.batches,0);for(const bytes of [Buffer.from('invalid batch'),(()=>{const b=Buffer.from(fullBatch);b[b.indexOf(10)+1]^=1;return b;})()]){const f=fixture();f.batchOverride=()=>bytes;assert.throws(()=>verifyParallelAuthority(f.read,f.git));}});
test('successful preload never admits mutated or retained-valid reverted current files',()=>{const f=fixture();verifyParallelAuthority(f.read,f.git);const old=actual(['show','f0f6b507a18bf51d7c8925734d854a05120ade10:'+target]);assert(!old.equals(f.read(target)));for(const bytes of [Buffer.from('mutated current file'),old])assert.throws(()=>verifyParallelAuthority(path=>path===target?bytes:f.read(path),f.git),/Independent current target bytes differ/);});
test('fresh HEAD path and raw object checks still reject substitutions after success',()=>{const f=fixture();verifyParallelAuthority(f.read,f.git);f.pathOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/Independent parallel HEAD authority differs/);f.pathOverride=false;f.rawOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git));});
test('preload failure never becomes success and a fresh retry validates every live read',()=>{const f=fixture();f.preloadFailure=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/preload rejected/);f.preloadFailure=false;assert.equal(verifyParallelAuthority(f.read,f.git),true);f.preloadFailure=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git),/preload rejected/);});
test('opaque transports without preload preserve the original fresh per-record behavior',()=>{const f=fixture({preload:false});assert.equal(verifyParallelAuthority(f.read,f.git),true);assert(!f.events.includes('preload'));f.rawOverride=true;assert.throws(()=>verifyParallelAuthority(f.read,f.git));});
