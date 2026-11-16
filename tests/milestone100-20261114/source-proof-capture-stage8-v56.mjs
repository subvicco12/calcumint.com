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
const predecessorAuthorityRef='114313c93d68f7404b2ee3fd5320c7ed58d77a7e';
const retainedPath='docs/parallel-source-20261110/capture-revision122.json';
const retainedSHA256='36dd8dd8871b3ec9eca5979874e11285810d3c87888a9c2430421837b09d232e';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V56GuardPaths=Object.freeze([
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
  "docs/milestone100-20261114/source-qualified-authority122.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v56.mjs"
]);
export function installStage8V56AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority122.mjs'));assert.equal(sha(authorityCopy),'152e7be765225c5d474021db3a6f178a94a030699b279dab79136e266c30eb91');
 const capture=JSON.parse(retained),records=stage8V56GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V56={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V56GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision123.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V56=Object.freeze([]);').length,2,'Only unarmed additive V56 overlay may be installed');
 source=source.replace('export const acceptedStage8V56=Object.freeze([]);','export const acceptedStage8V56=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V56BootstrapRefs=Object.freeze([]);','export const additionalStage8V56BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs,runtimeAuxiliaryNativeGitSuccessor.ref])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
