/** Fresh HEAD stability and normalized immutable-query successor; all installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='a058ff261af1678854c79ecc725c54f2fc2273a1';
const retainedPath='docs/parallel-source-20261110/capture-revision71.json';
const retainedSHA256='7869617bcc27fe17938f48a471f7b1b7489006515d3ddeb161cb42364297a74d';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V5GuardPaths=Object.freeze([
 'scripts/product-completion-stage8.mjs',
 'tests/milestone100-20261114/source-stage8.mjs',
 'tests/milestone100-20261114/source-stage8-live.test.mjs',
 'tests/milestone100-20261114/source-immutable-queries.mjs',
 'tests/milestone100-20261114/source-immutable-queries.test.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v5.mjs',
 'docs/milestone100-20261114/source-qualified-authority71.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V5AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority71.mjs'));assert.equal(sha(authorityCopy),'ce5085cee2bda7b18858c7a902c9f7a1cffe54207fb54b74ae0b2db187b63250');
 const capture=JSON.parse(retained),records=stage8V5GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V5={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V5GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision72.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V5=Object.freeze([]);').length,2,'Only unarmed additive V5 overlay may be installed');
 source=source.replace('export const acceptedStage8V5=Object.freeze([]);','export const acceptedStage8V5=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V5BootstrapRefs=Object.freeze([]);','export const additionalStage8V5BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
