/** Exact retained SavedActions and two import-only test successors; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='34a22620e62c4321dfbeda2a8fe0a6cea032daed';
const retainedPath='docs/parallel-source-20261110/capture-revision75.json';
const retainedSHA256='8c5c8170c3f9af6bc15b30aebf6d7125fede00e7a8a08f0f75af132b2bc9da49';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V9GuardPaths=Object.freeze([
 'tests/milestone100-20261114/source-stage8-shortest-fixture.mjs',
 'tests/milestone100-20261114/source-stage8-shortest-fixture.test.mjs',
 'tests/shortest-publication-20/caller-lineage.test.mjs',
 'scripts/product-completion-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v9.mjs',
 'docs/milestone100-20261114/source-qualified-authority75.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V9AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority75.mjs'));assert.equal(sha(authorityCopy),'e5578b7fdc8ab69fbedd627b643b0addeb0a610555b6167790be9ec46840545c');
 const capture=JSON.parse(retained),records=stage8V9GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V9={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V9GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision76.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V9=Object.freeze([]);').length,2,'Only unarmed additive V9 overlay may be installed');
 source=source.replace('export const acceptedStage8V9=Object.freeze([]);','export const acceptedStage8V9=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V9BootstrapRefs=Object.freeze([]);','export const additionalStage8V9BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
