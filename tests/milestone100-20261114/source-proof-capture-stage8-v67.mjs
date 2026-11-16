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
const predecessorAuthorityRef='5a94dbfffe05936c2517fdf64b044e3313ba9c61';
const retainedPath='docs/parallel-source-20261110/capture-revision133.json';
const retainedSHA256='a2803b77323a1c4d97cbfa41bfcc1848d67db1873ba4a78de80eab8d7fbd5e5c';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V67GuardPaths=Object.freeze([
  "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
  "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
  "tests/construction-ci-recovery-20261116/yield-task-updates.mjs",
  "scripts/publication20-caller-lineage.mjs",
  "tests/completion-wave-20261113/source-authority-preload.test.mjs",
  "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
  "tests/milestone100-20261114/source-stage8-publication-transport.test.mjs",
  "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
  "scripts/product-completion-stage8.mjs",
  "tests/construction-ci-recovery-20261116/immutable-fixture-setup.test.mjs",
  "tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs",
  "tests/construction-ci-recovery-20261116/bounded-immutable-preload.mjs",
  "tests/construction-ci-recovery-20261116/bounded-immutable-preload.test.mjs",
  "scripts/product-completion-lineage.mjs",
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
  "docs/milestone100-20261114/source-qualified-authority133.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v67.mjs"
]);
export function installStage8V67AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority133.mjs'));assert.equal(sha(authorityCopy),'19ad018c941f7932f8e0a645bf15e8624d36676584fc780928859948cc3d0957');
 const capture=JSON.parse(retained),records=stage8V67GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 assert.deepEqual(capture.workflowNonSourceSources.find(row=>row.path===workflowSchedulePolicy.current.path),workflowSchedulePolicy.current);
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V67={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V67GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision134.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V67=Object.freeze([]);').length,2,'Only unarmed additive V67 overlay may be installed');
 source=source.replace('export const acceptedStage8V67=Object.freeze([]);','export const acceptedStage8V67=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V67BootstrapRefs=Object.freeze([]);','export const additionalStage8V67BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,workflowSchedulePolicy.current.ref,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs,...runtimeAuxiliarySupplementalRefs,runtimeAuxiliaryNativeGitSuccessor.ref])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
