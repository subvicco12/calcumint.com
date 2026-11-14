import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-activation.mjs';
/** Actual pinned-stage checks; intentionally fail until frozen APP capture and authority are installed. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sourceGit } from '../parallel-source-20261110/baseline-runtime.mjs';
import { proveCurrentAppStage5AndHistoricalInputs } from '../completion-wave-20261113/source-test-stage6.mjs';
import { sourceStage7Policy, sourceStage7CapturePath } from './source-stage7-policy-v6.mjs';
import { appStage5Policy } from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import { testStage6Policy } from '../completion-wave-20261113/source-test-stage6-policy.mjs';
const root=resolve(new URL('../../',import.meta.url).pathname);
const input={read:readFileSync,git:sourceGit,root};
test('actual Stage7 rows match the finite exact policy while historical Stage6 retains literal20',()=>{
 const proved=proveCurrentAppStage5AndHistoricalInputs(input);
 for(const [path,row]of proved.stage8){assert(readFileSync(path).equals(sourceGit(['cat-file','blob',row.current.blob])));}
 assert.equal(proved.actualCurrent.size,20);
 assert.equal(proved.live.size,19);assert.equal(proved.testOnly.size,1);
 assert.deepEqual([...proved.stage7.keys()],sourceStage7Policy.paths);
 assert.deepEqual([...proved.stage7Actual.keys()].sort(),[...new Set([...appStage5Policy.paths,...testStage6Policy.paths,...sourceStage7Policy.paths])].sort());
 for(const path of sourceStage7Policy.paths){const row=proved.stage7Actual.get(path);assert.equal(row.current.ref,sourceStage7Policy.codeRef);assert(proved.stage8HistoricalInput.read(path).equals(sourceGit(['cat-file','blob',row.current.blob])));}
});
test('every new live row rejects current mutation or retained-valid reversion before projection',()=>{
 // Mandatory original case count remains exact; this reviewed successor also covers
 // every newly admitted Stage8 path before retaining the unchanged Stage7 checks.
 const nextCapture=JSON.parse(readFileSync(sourceStage8CapturePath));
 for(const row of nextCapture.rows)for(const bytes of [Buffer.from('Stage8 current tamper'),...(row.predecessor?[sourceGit(['cat-file','blob',row.predecessor.blob])]:[])])assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({...input,read:path=>path===row.path?bytes:readFileSync(path)}),/Current factory bytes differ/);
 const names=[sourceStage8CapturePath,...sourceStage8Policy.paths],target=new Map(names.map(path=>[path,readFileSync(path)]));
 const read=path=>{assert(target.has(path),'Undeclared Stage8 dependency '+path);return target.get(path);};
 const first=provePinnedSourceStage8({...input,read});
 target.set(sourceStage8Policy.paths[0],Buffer.from('mutated after proof'));
 assert.throws(()=>provePinnedSourceStage8(first.historicalInput),/Current factory bytes differ/);
 assert.throws(()=>provePinnedSourceStage8({...first.historicalInput,read:()=>Buffer.from('forged')}),/reader capability differs/);
 for(const mutation of ['head','status']){
  let changed=false;const git=(args,options)=>changed&&mutation==='head'&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(sourceStage8Policy.predecessorRef+'\n'):changed&&mutation==='status'&&args[0]==='status'?Buffer.from('?? src/unknown.ts\n'):sourceGit(args,options);
  const prior=provePinnedSourceStage8({...input,git});changed=true;assert.throws(()=>provePinnedSourceStage8(prior.historicalInput),/Unreviewed current source delta|Dirty or unknown current source/);
 }

 const capture=JSON.parse(readFileSync(sourceStage7CapturePath));
 for(const row of capture.rows){
  const replacements=[Buffer.from('Stage7 current tamper')];
  if(row.predecessor)replacements.push(sourceGit(['cat-file','blob',row.predecessor.blob]));
  for(const bytes of replacements)assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({...input,read:path=>path===row.path?bytes:readFileSync(path)}),/Current factory bytes differ/);
 }
});
