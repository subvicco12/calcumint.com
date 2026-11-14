/** Narrow additive successor producer. Installed A2 evidence stays literal, including its failed full-proof result. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='b5a07bb4b7023dd9427e2edca36c36aebe665737';
const retainedPath='docs/parallel-source-20261110/capture-revision69.json';
const retainedSHA256='6254e8783ce1ae8cb16fd64c30f19664c48970a15171a2b8b39238c0cbd1f2da';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V3GuardPaths=Object.freeze([
 'tests/parallel-source-20261110/core.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.test.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v3.mjs',
 'docs/milestone100-20261114/source-qualified-authority69.mjs',
]);
export function installStage8V3AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority69.mjs'));assert.equal(sha(authorityCopy),'b23f60a4e6b19a73a5eda7f276618a800b53d555707f9095616fd4006cf85ca2');
 const capture=JSON.parse(retained),records=stage8V3GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V3={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V3GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision70.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V3=Object.freeze([]);').length,2,'Only unarmed additive V3 overlay may be installed');
 source=source.replace('export const acceptedStage8V3=Object.freeze([]);','export const acceptedStage8V3=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V3BootstrapRefs=Object.freeze([]);','export const additionalStage8V3BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
