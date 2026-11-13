/** Actual pinned-stage checks; intentionally fail until frozen APP capture and authority are installed. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sourceGit } from '../parallel-source-20261110/baseline-runtime.mjs';
import { proveCurrentAppStage5AndHistoricalInputs } from '../completion-wave-20261113/source-test-stage6.mjs';
import { sourceStage7Policy, sourceStage7CapturePath } from './source-stage7-policy.mjs';
import { appStage5Policy } from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import { testStage6Policy } from '../completion-wave-20261113/source-test-stage6-policy.mjs';
const root=resolve(new URL('../../',import.meta.url).pathname);
const input={read:readFileSync,git:sourceGit,root};
test('actual Stage7 rows match the finite exact policy while historical Stage6 retains literal20',()=>{
 const proved=proveCurrentAppStage5AndHistoricalInputs(input);
 assert.equal(proved.actualCurrent.size,20);
 assert.equal(proved.live.size,19);assert.equal(proved.testOnly.size,1);
 assert.deepEqual([...proved.stage7.keys()],sourceStage7Policy.paths);
 assert.deepEqual([...proved.stage7Actual.keys()].sort(),[...new Set([...appStage5Policy.paths,...testStage6Policy.paths,...sourceStage7Policy.paths])].sort());
 for(const path of sourceStage7Policy.paths){const row=proved.stage7Actual.get(path);assert.equal(row.current.ref,sourceStage7Policy.codeRef);assert(readFileSync(path).equals(sourceGit(['cat-file','blob',row.current.blob])));}
});
test('every new live row rejects current mutation or retained-valid reversion before projection',()=>{
 const capture=JSON.parse(readFileSync(sourceStage7CapturePath));
 for(const row of capture.rows){
  const replacements=[Buffer.from('Stage7 current tamper')];
  if(row.predecessor)replacements.push(sourceGit(['cat-file','blob',row.predecessor.blob]));
  for(const bytes of replacements)assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({...input,read:path=>path===row.path?bytes:readFileSync(path)}),/Current factory bytes differ/);
 }
});
