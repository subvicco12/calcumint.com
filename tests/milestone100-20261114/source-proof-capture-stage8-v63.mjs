import {workflowSchedulePolicy} from '../construction-ci-recovery-20261116/workflow-scheduling-policy.mjs';
import {runtimeAuxiliaryNativeGitSuccessor} from './source-stage8-runtime-auxiliary.mjs';
import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='e2631759b72ec1597adef9c7722358f571a51178';
const retainedPath='docs/parallel-source-20261110/capture-revision129.json';
const retainedSHA256='b8e331d894f5f1b19be05973c7c46e749128cd25794dc76730e851d6e68ee260';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V63GuardPaths=Object.freeze([
  "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
  "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
  "tests/construction-ci-recovery-20261116/yield-task-updates.mjs",
  "scripts/publication20-caller-lineage.mjs",
  "tests/completion-wave-20261113/source-authority-preload.test.mjs",
  "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
  "tests/milestone100-20261114/source-stage8-publication-transport.test.mjs",
  "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
  "scripts/product-completion-stage8.mjs",
  ".github/workflows/ci.yml",
  "tests/construction-ci-recovery-20261116/workflow-scheduling-policy.mjs",
  "tests/construction-ci-recovery-20261116/workflow-scheduling.mjs",
  "tests/construction-ci-recovery-20261116/workflow-scheduling.test.mjs",
  "tests/ci-balance-20261113/workflow.mjs",
  "tests/ci-gate-recovery/balanced-workflow.test.mjs",
  "tests/ci-gate-recovery/balanced-yaml.test.mjs",
  "tests/parallel-source-20261110/core.mjs",
  "tests/parallel-source-20261110/baseline-runtime.mjs",
  "tests/construction-ci-recovery-20261116/native-git.mjs",
  "tests/construction-ci-recovery-20261116/native-git-child.mjs",
  "tests/construction-ci-recovery-20261116/native-git.test.mjs",
  "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
  "tests/next-cohort-20261110/source/retained-runtime.mjs",
  "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
  "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
  "tests/milestone100-20261114/source-preflight-stage8.mjs",
  "tests/parallel-source-20261110/bootstrap.mjs",
  "scripts/fetch-source-lineage.mjs",
  "tests/milestone60-20261113/source-cold-preflight.test.mjs",
  "tests/source-lineage-bootstrap.test.mjs",
  "docs/milestone100-20261114/source-qualified-authority129.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v63.mjs"
]);
export function installStage8V63AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority129.mjs'));assert.equal(sha(authorityCopy),'2f8961a3da6050ec96e2e2ef2d45074737e5cd8444c802e6b625950647ddd69c');
 const capture=JSON.parse(retained),records=stage8V63GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 const oldWorkflow=capture.workflowNonSourceSources.filter(row=>row.path===workflowSchedulePolicy.predecessor.path);assert.equal(oldWorkflow.length,1);assert.equal(oldWorkflow[0].ref,'6016a500d429680401370a255fc7064d40e35cb9');for(const key of ['blob','bytes','sha256'])assert.equal(oldWorkflow[0][key],workflowSchedulePolicy.predecessor[key]);
 capture.workflowNonSourceSources=capture.workflowNonSourceSources.map(row=>row.path===workflowSchedulePolicy.predecessor.path?{...workflowSchedulePolicy.current}:row);
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V63={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V63GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision130.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V63=Object.freeze([]);').length,2,'Only unarmed additive V63 overlay may be installed');
 source=source.replace('export const acceptedStage8V63=Object.freeze([]);','export const acceptedStage8V63=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V63BootstrapRefs=Object.freeze([]);','export const additionalStage8V63BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,workflowSchedulePolicy.current.ref,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs,runtimeAuxiliaryNativeGitSuccessor.ref])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
