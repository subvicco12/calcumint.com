/** Verified immutable commit-object reader successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='0d25c657424e9aa66d253d43f45f2c27e9b44d0f';
const retainedPath='docs/parallel-source-20261110/capture-revision78.json';
const retainedSHA256='96f89c6a74fbb3d1ce2db33d21b52f76496723511474c4af96cb70124c8b830c';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V12GuardPaths=Object.freeze([
 'tests/parallel-source-20261110/git-reader.mjs',
 'tests/milestone100-20261114/source-stage8-direct-commit-cache.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v12.mjs',
 'docs/milestone100-20261114/source-qualified-authority78.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V12AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority78.mjs'));assert.equal(sha(authorityCopy),'0bb8d4c4ed6dc1a62aed07cfd01f06f15de68e8fc03313d4cfcd6c3559071890');
 const capture=JSON.parse(retained),records=stage8V12GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V12={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V12GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision79.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V12=Object.freeze([]);').length,2,'Only unarmed additive V12 overlay may be installed');
 source=source.replace('export const acceptedStage8V12=Object.freeze([]);','export const acceptedStage8V12=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V12BootstrapRefs=Object.freeze([]);','export const additionalStage8V12BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
