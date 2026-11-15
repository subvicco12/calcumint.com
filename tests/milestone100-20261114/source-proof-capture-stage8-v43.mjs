import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='7d76c01533944bd6b904f44939693f7795913880';
const retainedPath='docs/parallel-source-20261110/capture-revision109.json';
const retainedSHA256='85c81a658601ddd172ff8670a7fbb9c82f198d742099f81f9eefe4fec2018b65';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V43GuardPaths=Object.freeze([
 'tests/calculator-sprint-20261108/first-two-packet.test.mjs',
 'tests/milestone60-20261113/source-stage7-live.test.mjs',
 'tests/milestone100-20261114/source-stage8-live.test.mjs',
 'tests/acceptance-closure-20261108/receipt-source-path.test.mjs',
 'tests/milestone100-20261114/receipt-source-path-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-authority-availability.test.mjs',
 'tests/completion-wave-20261113/source-authority-preload.test.mjs',
 'tests/milestone100-20261114/source-stage8-activation.mjs',
 'docs/four-worker-integration-20261115/source-stage9.json',
 'tests/four-worker-integration-20261115/source-stage9-policy.mjs',
 'tests/four-worker-integration-20261115/source-stage9.mjs',
 'tests/four-worker-integration-20261115/source-stage9.test.mjs',
 'tests/worker-a-intake-20261115/auth-browser.mjs',
 'tests/worker-a-intake-20261115/fixtures/actions.ts',
 'tests/worker-a-intake-20261115/fixtures/client.tsx',
 'tests/worker-a-intake-20261115/fixtures/page.tsx',
 'tests/worker-a-intake-20261115/source-and-compatibility.mjs',
 'tests/worker-a-intake-20261115/successor-admission.mjs',
 'tests/worker-d-shared-delivery-20261115/acceptance.mjs',

 'scripts/publication20-caller-lineage.mjs',
 'tests/milestone100-20261114/source-stage8-publication-transport.mjs',
 'tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs',
 'tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs',
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
 'tests/milestone100-20261114/source-proof-capture-stage8-v43.mjs',
 'docs/milestone100-20261114/source-qualified-authority109.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V43AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority109.mjs'));assert.equal(sha(authorityCopy),'80f3aa6c272b147a5ae5b6df42e7cb7979300a8d98b1a4721831264a61441345');
 const capture=JSON.parse(retained),records=stage8V43GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V43={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V43GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision110.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V43=Object.freeze([]);').length,2,'Only unarmed additive V43 overlay may be installed');
 source=source.replace('export const acceptedStage8V43=Object.freeze([]);','export const acceptedStage8V43=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V43BootstrapRefs=Object.freeze([]);','export const additionalStage8V43BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
