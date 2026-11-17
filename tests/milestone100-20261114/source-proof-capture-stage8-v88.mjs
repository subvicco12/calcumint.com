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
const predecessorAuthorityRef='09186766358258dd1f2359a99036d490fa43c216';
const retainedPath='docs/parallel-source-20261110/capture-revision154.json';
const retainedSHA256='89f4e3ba58667e605e2256bfbb36f8ab9eed424e21a57d9fd6020273e57583b5';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V88GuardPaths=Object.freeze([
  "scripts/fetch-source-lineage.mjs",
  "tests/completion-first-20261112/personal-stage.mjs",
  "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
  "tests/four-worker-integration-20261115/source-stage9.mjs",
  "tests/four-worker-integration-20261115/source-stage9.test.mjs",
  "tests/milestone100-20261114/source-preflight-stage8.mjs",
  "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
  "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
  "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
  "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
  "tests/milestone60-20261113/source-cold-preflight.test.mjs",
  "tests/parallel-source-20261110/bootstrap.mjs",
  "tests/parallel-source-20261110/core.mjs",
  "tests/source-lineage-bootstrap.test.mjs",
  "docs/milestone100-20261114/source-qualified-authority154.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v88.mjs",
  "docs/statistics-integration-20261117/source-stage9-statistics-revision3.json"
]);
export function installStage8V88AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority154.mjs'));assert.equal(sha(authorityCopy),'1e65085111fc06874f8b274c44eb8eaba1ac88c2d98371c20d9e2b68d4a3a332');
 const capture=JSON.parse(retained),records=stage8V88GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 assert.deepEqual(capture.workflowNonSourceSources.find(row=>row.path===workflowSchedulePolicy.current.path),workflowSchedulePolicy.current);
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V88={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V88GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision155.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V88=Object.freeze([]);').length,2,'Only unarmed additive V88 overlay may be installed');
 source=source.replace('export const acceptedStage8V88=Object.freeze([]);','export const acceptedStage8V88=Object.freeze('+JSON.stringify([...records,...sourceRecords].filter(row=>!previouslyAccepted.some(prior=>prior.path===row.path&&prior.blob===row.blob&&prior.sha256===row.sha256)).map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V88BootstrapRefs=Object.freeze([]);','export const additionalStage8V88BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,workflowSchedulePolicy.current.ref,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs,...runtimeAuxiliarySupplementalRefs,runtimeAuxiliaryNativeGitSuccessor.ref,'0253dc320e6af34afa4ef2f0a1af08bd1812d871','556ca86b38e9f1f28973df07b832ed863f86b4ed','ad4d574296d4684a06f2efd99cf80600d166e3fc','5e69ccc2124b176ff806efdfbfd60427cf1719c9'])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
