/** Exact synchronous source-authority observation and replay successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='9082899332cd5bafce60cf6114fb4a23ffb5ffc5';
const retainedPath='docs/parallel-source-20261110/capture-revision88.json';
const retainedSHA256='6b5498f9598bf70c11b7ddefe94856db2076f3936cca41975b7c708646d68eff';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V22GuardPaths=Object.freeze([
 'tests/next-cohort-20261110/source/retained-runtime.mjs',
 'tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs',
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
 'tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.test.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v22.mjs',
 'docs/milestone100-20261114/source-qualified-authority88.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V22AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority88.mjs'));assert.equal(sha(authorityCopy),'3ada91ea9af64f8e73e3b061cc6e13ba10a35a0686d9664b1c86910f85985f86');
 const capture=JSON.parse(retained),records=stage8V22GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V22={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V22GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision89.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V22=Object.freeze([]);').length,2,'Only unarmed additive V22 overlay may be installed');
 source=source.replace('export const acceptedStage8V22=Object.freeze([]);','export const acceptedStage8V22=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V22BootstrapRefs=Object.freeze([]);','export const additionalStage8V22BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
