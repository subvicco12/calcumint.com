import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='71c1ce57dd86675ed8bfdd498e7a4103e61c0a5d';
const retainedPath='docs/parallel-source-20261110/capture-revision99.json';
const retainedSHA256='3e20545de52dcca7b807f18260a790d162d2bcd865f32575e7874abc06073cee';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V33GuardPaths=Object.freeze([
 'tests/milestone100-20261114/workflow-source-evidence-claims.mjs',
 'tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs',
 'tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs',
 'tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs',
 'tests/shortest-publication-20/completion-lineage.test.mjs',
 'tests/shortest-publication-20/frequency-presentation-lineage.test.mjs',
 'scripts/check-shortest-publication20.mjs',
 'tests/next-cohort-20261110/source/retained-runtime.mjs',
 'tests/milestone100-20261114/source-stage8-negative-current-src.mjs',
 'tests/parallel-source-20261110/source-lock-scope.mjs',
 'tests/parallel-source-20261110/source-lock-scope.d.mts',
 'tests/parallel-source-20261110/source-lock-scope.test.mjs',
 'tests/parallel-source-20261110/source-object-lock.mjs',
 'tests/ci-rpc-recovery-20261113/source-node.mjs',
 'tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs',
 'tests/completion-first-20261112/test-stage.test.mjs',
 'tests/completion-first-20261112/non-source-availability.test.mjs',
 'tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs',
 'tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs',
 'tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs',
 'tests/milestone100-20261114/composition-source-evidence-batch.mjs',
 'tests/milestone100-20261114/composition-source-evidence-batch.test.mjs',
 'tests/milestone100-20261114/retained-stage7-preflight.mjs',
 'tests/parallel-five-20261110/verify-composition.mjs',
 'tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs',
 'tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs',
 'tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs',
 'tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs',
 'tests/milestone100-20261114/source-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-authority-scope.mjs',
 'tests/milestone100-20261114/source-stage8-authority-scope.test.mjs',
 'tests/milestone100-20261114/authority-observation-collector.mjs',
 'tests/milestone100-20261114/authority-observation-collector.test.mjs',
 'tests/completion-first-20261112/personal-stage.mjs',
 'tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs',
 'tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs',
 'tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs',
 'tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs',
 'tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs',
 'tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs',
 'tests/completion-first-20261112/personal-stage.test.mjs',
 'tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs',
 'tests/milestone100-20261114/source-stage8-negative-factory.test.mjs',
 'scripts/product-completion-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs',
 'tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.test.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v33.mjs',
 'docs/milestone100-20261114/source-qualified-authority99.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V33AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority99.mjs'));assert.equal(sha(authorityCopy),'94f4c029d26799cb699dc93d4c8caba411fb85bdc32130d6a5ca1c5304631e26');
 const capture=JSON.parse(retained),records=stage8V33GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V33={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V33GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision100.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V33=Object.freeze([]);').length,2,'Only unarmed additive V33 overlay may be installed');
 source=source.replace('export const acceptedStage8V33=Object.freeze([]);','export const acceptedStage8V33=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V33BootstrapRefs=Object.freeze([]);','export const additionalStage8V33BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,...runtimeAuxiliaryImmutableRefs])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
