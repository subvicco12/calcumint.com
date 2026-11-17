/** Exact retained SavedActions and two import-only test successors; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='4beb54069f0946ddf9a92328e2b252af371a02ea';
const retainedPath='docs/parallel-source-20261110/capture-revision72.json';
const retainedSHA256='09969f98fba97a655a471073b35d35ba4dbef7ee802a5da4f332aab26cd0c2d4';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V6GuardPaths=Object.freeze([
 'tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs',
 'scripts/product-completion-stage8.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.test.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/shortest-publication-20/caller-lineage.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.test.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/receipt-source-path-stage8.mjs',
 'tests/parallel-five-20261110/verify-composition.mjs',
 'tests/milestone100-20261114/source-stage8-saved-actions-claim.mjs',
 'tests/milestone100-20261114/source-stage8-saved-actions-claim.test.mjs',
 'tests/milestone100-20261114/source-stage8-test-only-successor.mjs',
 'tests/milestone100-20261114/source-stage8-test-only-successor.test.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v6.mjs',
 'docs/milestone100-20261114/source-qualified-authority72.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V6AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority72.mjs'));assert.equal(sha(authorityCopy),'ada789af2ea5af7f53815a6d423b4e4ad6a721f16e00dc89ea59c1a40ef0fd1f');
 const capture=JSON.parse(retained),records=stage8V6GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V6={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V6GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision73.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V6=Object.freeze([]);').length,2,'Only unarmed additive V6 overlay may be installed');
 source=source.replace('export const acceptedStage8V6=Object.freeze([]);','export const acceptedStage8V6=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V6BootstrapRefs=Object.freeze([]);','export const additionalStage8V6BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
