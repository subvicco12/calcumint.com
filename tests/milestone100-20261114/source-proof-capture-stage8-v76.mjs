import {accepted as previouslyAccepted} from '../parallel-source-20261110/authority.mjs';
import {workflowSchedulePolicy} from '../construction-ci-recovery-20261116/workflow-scheduling-policy.mjs';
import {runtimeAuxiliaryNativeGitSuccessor,runtimeAuxiliarySupplementalRefs} from './source-stage8-runtime-auxiliary.mjs';
import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='26ee9712e27d91a02faa0301b79af33435c30bdc';
const retainedPath='docs/parallel-source-20261110/capture-revision142.json';
const retainedSHA256='ba43a8494248b1b25e4e9006e08fedebd59bff28cba2aa97d86946de7fff3b74';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V76GuardPaths=Object.freeze([
 "tests/construction-ci-recovery-20261116/yield-task-updates.mjs",
 "tests/construction-ci-recovery-20261116/immutable-fixture-setup.test.mjs",
 "tests/source-lineage-bootstrap.test.mjs",
 "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
 "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
  "tests/construction-ci-recovery-20261116/native-git.mjs",
  "tests/execution-recovery-20261109/source-lineage.test.mjs",
  "tests/construction-ci-recovery-20261116/execution-native-transport.mjs",
  "tests/construction-ci-recovery-20261116/execution-native-transport.test.mjs",
  "scripts/fetch-source-lineage.mjs",
  "tests/parallel-source-20261110/bootstrap.mjs",
  "tests/parallel-source-20261110/core.mjs",
  "tests/milestone100-20261114/source-preflight-stage8.mjs",
  "tests/milestone60-20261113/source-cold-preflight.test.mjs",
  "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
  "docs/milestone100-20261114/source-qualified-authority142.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v76.mjs"
]);
export function installStage8V76AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority142.mjs'));assert.equal(sha(authorityCopy),'f18758b0e235115feb8e79d551b739be9e062fc2c06846e6b34341389442bb03');
 const capture=JSON.parse(retained),records=stage8V76GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 assert.deepEqual(capture.workflowNonSourceSources.find(row=>row.path===workflowSchedulePolicy.current.path),workflowSchedulePolicy.current);
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V76={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V76GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision143.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V76=Object.freeze([]);').length,2,'Only unarmed additive V76 overlay may be installed');
 source=source.replace('export const acceptedStage8V76=Object.freeze([]);','export const acceptedStage8V76=Object.freeze('+JSON.stringify([...records,...sourceRecords].filter(row=>!previouslyAccepted.some(prior=>prior.path===row.path&&prior.blob===row.blob&&prior.sha256===row.sha256)).map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V76BootstrapRefs=Object.freeze([]);','export const additionalStage8V76BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,workflowSchedulePolicy.current.ref,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs,...runtimeAuxiliarySupplementalRefs,runtimeAuxiliaryNativeGitSuccessor.ref])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
