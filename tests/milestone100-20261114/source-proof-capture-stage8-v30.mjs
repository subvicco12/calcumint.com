import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='3c33f2d57145225c59d6c5068b0fe25254bd95fc';
const retainedPath='docs/parallel-source-20261110/capture-revision96.json';
const retainedSHA256='32ca653bdadb605738e4a6b48d0389cd28896a6666e8146d688625c375900473';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V30GuardPaths=Object.freeze([
 'tests/next-cohort-20261110/source/retained-runtime.mjs',
 'tests/milestone100-20261114/source-stage8-negative-current-src.mjs',
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
 'tests/milestone100-20261114/source-proof-capture-stage8-v30.mjs',
 'docs/milestone100-20261114/source-qualified-authority96.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V30AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority96.mjs'));assert.equal(sha(authorityCopy),'0abf65235770d5042f56c31127cb5a0c1cd41726852d85c42a1fe73b8e3ef013');
 const capture=JSON.parse(retained),records=stage8V30GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V30={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V30GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision97.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V30=Object.freeze([]);').length,2,'Only unarmed additive V30 overlay may be installed');
 source=source.replace('export const acceptedStage8V30=Object.freeze([]);','export const acceptedStage8V30=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V30BootstrapRefs=Object.freeze([]);','export const additionalStage8V30BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,...runtimeAuxiliaryImmutableRefs])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
