import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {runtimeAuxiliaryImmutableRefs} from './source-stage8-runtime-auxiliary.mjs';
/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='3ab3bb701dc3c3dacfba0e88cdff00b7e5d02e37';
const retainedPath='docs/parallel-source-20261110/capture-revision119.json';
const retainedSHA256='37f68a370fbe7bb55506a47a570f55dda6d06e84b740d61e6f3289fdb2105efa';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V53GuardPaths=Object.freeze([
  "docs/construction-qualification-20261116/source-stage9-construction.json",
  "docs/worker1-construction-20261116/source-policy.json",
  "docs/worker1-construction-20261116/source-successor.json",
  "docs/worker1-construction-20261116/retained-bindings.json",
  "tests/worker1-construction-20261116/source-admission.mjs",
  "tests/worker1-construction-20261116/auth-browser.mjs",
  "tests/coordinator-construction-20261116/admit-source.py",
  "tests/coordinator-construction-20261116/held-joins.test.ts",
  "tests/coordinator-construction-20261116/vitest.config.ts",
  "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
  "tests/four-worker-integration-20261115/source-stage9.mjs",
  "tests/four-worker-integration-20261115/source-stage9.test.mjs",
  "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
  "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
  "tests/milestone100-20261114/source-preflight-stage8.mjs",
  "tests/parallel-source-20261110/core.mjs",
  "tests/parallel-source-20261110/bootstrap.mjs",
  "scripts/fetch-source-lineage.mjs",
  "tests/milestone60-20261113/source-cold-preflight.test.mjs",
  "docs/milestone100-20261114/source-qualified-authority117.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v50.mjs",
  "tests/source-lineage-bootstrap.test.mjs",
  "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
  "docs/construction-qualification-20261116/source-stage9-construction-final.json",
  "tests/milestone100-20261114/source-proof-capture-stage8-v51.mjs",
  "docs/milestone100-20261114/source-qualified-authority118.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v52.mjs",
  "docs/milestone100-20261114/source-qualified-authority119.mjs",
  "tests/completion-first-20261112/personal-stage.mjs",
  "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
  "tests/milestone100-20261114/source-proof-capture-stage8-v53.mjs"
]);
export function installStage8V53AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const fresh=proveSourceStage9({root,read:path=>readFileSync(resolve(root,path)),git});const sourceRecords=[...fresh.live.values()].map(row=>row.current);assert.deepEqual(sourceRecords.map(row=>row.path),sourceStage9Policy.paths);
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority119.mjs'));assert.equal(sha(authorityCopy),'204bf12dfc05b7c44c213e7270ea8ca6b7486f0cac3fe8980a318a97fa46df63');
 const capture=JSON.parse(retained),records=stage8V53GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage9Authority={capturePath:sourceStage9CapturePath,captureSHA256:sourceStage9Policy.captureSHA256,codeRef:sourceStage9Policy.codeRef,predecessorRef:sourceStage9Policy.predecessorRef,paths:sourceStage9Policy.paths};
 capture.sourceStage8V53={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V53GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision120.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V53=Object.freeze([]);').length,2,'Only unarmed additive V53 overlay may be installed');
 source=source.replace('export const acceptedStage8V53=Object.freeze([]);','export const acceptedStage8V53=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V53BootstrapRefs=Object.freeze([]);','export const additionalStage8V53BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,predecessorAuthorityRef,...sourceStage9Policy.ancestry,...runtimeAuxiliaryImmutableRefs])].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
