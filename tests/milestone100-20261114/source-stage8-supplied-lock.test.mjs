import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {ensureNonSourceObjects,ensureTestStageObjects,ensureAppStage5Objects,ensureTestStage6Objects,ensureSourceStage7Objects,ensureParallelSources} from '../parallel-source-20261110/bootstrap.mjs';
import {withSourceObjectLock,sourceObjectLockName} from '../parallel-source-20261110/source-object-lock.mjs';
import {nonSourcePolicy} from '../completion-first-20261112/non-source-policy.mjs';
import {testStagePolicy} from '../completion-first-20261112/test-stage-policy.mjs';
import {appStage5Policy} from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import {testStage6Policy} from '../completion-wave-20261113/source-test-stage6-policy.mjs';
import {sourceStage7Policy} from '../milestone60-20261113/source-stage7-policy-v6.mjs';
import {capturePath} from '../parallel-source-20261110/core.mjs';
const root=process.cwd(),actual=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
const common=resolve(root,actual(['rev-parse','--git-common-dir']).toString().trim()),lock=join(common,sourceObjectLockName),origin='https://github.com/subvicco12/calcumint.com.git\n';

test('every supplied finite-stage transport runs under the actual lock and remains uncached',()=>{
 for(const [ensure,policy] of [[ensureNonSourceObjects,nonSourcePolicy],[ensureTestStageObjects,testStagePolicy],[ensureAppStage5Objects,appStage5Policy],[ensureTestStage6Objects,testStage6Policy],[ensureSourceStage7Objects,sourceStage7Policy]]){
  let origins=0,identities=0;const allowed=new Set(policy.ancestry);
  const git=args=>{assert(existsSync(lock),'Supplied transport ran outside the actual source lock');if(args[0]==='remote'){origins++;return Buffer.from(origin);}assert.deepEqual(args.slice(0,2),['rev-parse','--verify']);const ref=args[2].slice(0,40);assert(allowed.has(ref));identities++;return Buffer.from(ref+'\n');};
  assert.equal(ensure(git),true);assert.equal(ensure(git),true);assert.equal(origins,2);assert.equal(identities,policy.ancestry.length*4);
 }
});
test('a supplied transport exception propagates and releases only the owned lock',()=>{
 assert.throws(()=>ensureAppStage5Objects(()=>{assert(existsSync(lock));throw Error('Exact supplied availability failure');}),/Exact supplied availability failure/);
 let reacquired=false;withSourceObjectLock(common,()=>{reacquired=true;assert(existsSync(lock));});assert(reacquired);
});
test('the wrapped parallel availability callback is locked on every invocation',()=>{
 const capture=JSON.parse(readFileSync(capturePath)),original=actual(['show',capture.baselineRef+':scripts/product-completion-lineage.mjs']);let origins=0,identities=0;
 const git=args=>{assert(existsSync(lock),'Wrapped parallel callback bypassed source coordination');if(args[0]==='remote'){origins++;return Buffer.from(origin);}if(args[0]==='show'){assert.deepEqual(args,['show',capture.baselineRef+':scripts/product-completion-lineage.mjs']);return original;}assert.deepEqual(args.slice(0,2),['rev-parse','--verify']);identities++;return Buffer.from(args[2].slice(0,40)+'\n');};
 assert.equal(ensureParallelSources(capture,git),true);assert.equal(ensureParallelSources(capture,git),true);assert.equal(origins,2);assert(identities>100);
});
