/** Local test binding rename successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='7ef48c91767b955269a481ef3fa1822d80dfd1d3';
const retainedPath='docs/parallel-source-20261110/capture-revision81.json';
const retainedSHA256='41f015c69c50e517690a646e28d9e443e8c0cf2c52a890ac89127a0e92d93d4d';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8V15GuardPaths=Object.freeze([
 'tests/milestone100-20261114/source-stage8-authority-availability.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v15.mjs',
 'docs/milestone100-20261114/source-qualified-authority81.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V15AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority81.mjs'));assert.equal(sha(authorityCopy),'d9d2726a697022f6ba6618e303a22fcccdafd334b0421404c7c8be50b5415b34');
 const capture=JSON.parse(retained),records=stage8V15GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V15={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V15GuardPaths};
 const outputPath='docs/parallel-source-20261110/capture-revision82.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V15=Object.freeze([]);').length,2,'Only unarmed additive V15 overlay may be installed');
 source=source.replace('export const acceptedStage8V15=Object.freeze([]);','export const acceptedStage8V15=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V15BootstrapRefs=Object.freeze([]);','export const additionalStage8V15BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
