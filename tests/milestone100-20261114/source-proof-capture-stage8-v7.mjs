/** Exact retained SavedActions and two import-only test successors; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='f3d53bb69754646618d56cb47e42727ed712fa59';
const retainedPath='docs/parallel-source-20261110/capture-revision73.json';
const retainedSHA256='e8db6d2370a932666f88e85dbc1f7e4acc21ef99443d698b6930a0f5cbbba76d';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V7GuardPaths=Object.freeze([
 'scripts/product-completion-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v7.mjs',
 'docs/milestone100-20261114/source-qualified-authority73.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V7AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority73.mjs'));assert.equal(sha(authorityCopy),'77a1f01b8d4e98501065a12aa3f07743e45ab37b3143e083d8ff675db4e788b1');
 const capture=JSON.parse(retained),records=stage8V7GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V7={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V7GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision74.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V7=Object.freeze([]);').length,2,'Only unarmed additive V7 overlay may be installed');
 source=source.replace('export const acceptedStage8V7=Object.freeze([]);','export const acceptedStage8V7=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V7BootstrapRefs=Object.freeze([]);','export const additionalStage8V7BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
