/** Producer only. Root must independently review immutable G before installing authority. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {stage7GuardPaths} from '../milestone60-20261113/source-proof-capture-stage7-v9.mjs';
import {sourceStage8Policy,sourceStage8CapturePath} from './source-stage8-policy.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const stage8GuardPaths=Object.freeze([...new Set([...stage7GuardPaths,
 'tests/five-full-contract-20261109/verify-batch.mjs','tests/next-cohort-auth-20261110/verify-current-successor.mjs','tests/cohort22-closure-20261109/caller-source.test.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs','tests/acceptance-closure-20261108/receipt-source-path.test.mjs','tests/acceptance-closure-20261108/first-two-receipt.test.mjs','tests/milestone100-20261114/source-stage8-consumer.test.mjs','scripts/product-completion-stage8.mjs','scripts/publication20-caller-lineage.mjs','scripts/check-shortest-publication20.mjs','scripts/check-current-six-candidate-evidence.mjs','scripts/software-closure-evidence.mjs','tests/milestone100-20261114/receipt-source-path-stage8.mjs','tests/milestone100-20261114/receipt-source-path-stage8.d.mts','tests/milestone100-20261114/source-stage8.mjs','tests/milestone100-20261114/source-stage8-activation.mjs','tests/milestone100-20261114/source-stage8-policy.mjs','tests/milestone100-20261114/source-stage8.test.mjs','tests/milestone100-20261114/source-stage8-live.test.mjs','tests/milestone100-20261114/source-proof-capture-stage8.mjs',
 'tests/completion-first-20261112/test-stage.mjs','tests/completion-first-20261112/non-source-stage2.mjs',
 'docs/milestone100-20261114/source-qualified-authority68.mjs','docs/milestone100-20261114/source-stage7-live-retained.mjs','docs/milestone100-20261114/source-current-retained.mjs',sourceStage8CapturePath,'docs/parallel-source-20261110/capture-revision68.json'])]);
export function captureStage8Proof({root,guardRef}){
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024}),record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit candidate before guard capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const retainedPath='docs/parallel-source-20261110/capture-revision68.json',retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),'e9bc59cd40b54da57bef70ccba322b22fc2bab255b31261a3a65d72cd2744fd3');
 const capture=JSON.parse(retained),sourceCapture=JSON.parse(readFileSync(resolve(root,sourceStage8CapturePath)));
 assert.equal(sha(readFileSync(resolve(root,sourceStage8CapturePath))),sourceStage8Policy.captureSHA256);
 const records=[...stage8GuardPaths.map(path=>record(guardRef,path)),...sourceCapture.rows.map(row=>{const r=record(sourceStage8Policy.codeRef,row.path);assert.deepEqual(r,row.current);return r;})];
 const current=new Map(capture.currentSources.map(row=>[row.path,row]));for(const row of records)current.set(row.path,row);capture.currentSources=[...current.values()];
 capture.sourceStage8={guardRef,applicationCodeRef:sourceStage8Policy.codeRef,applicationSourcePaths:sourceStage8Policy.paths,retainedCapturePath:retainedPath,retainedCaptureSHA256:sha(retained),guardPaths:stage8GuardPaths};
 const path='docs/parallel-source-20261110/capture-revision69.json';writeFileSync(resolve(root,path),JSON.stringify(capture,null,2)+'\n');records.push(recordBytes(null,path,readFileSync(resolve(root,path))));
 const guardSuccessors=['scripts/publication20-caller-lineage.mjs','tests/cohort22-closure-20261109/caller-source.test.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs'].map(path=>record(guardRef,path));
 const guardPolicyPath='tests/milestone100-20261114/source-stage8-guard-policy.mjs';
 writeFileSync(resolve(root,guardPolicyPath),'// Independently review immutable G records before admission.\nexport const guardSuccessors=Object.freeze('+JSON.stringify(guardSuccessors,null,2)+'.map(Object.freeze));\n');
 records.push(recordBytes(null,guardPolicyPath,readFileSync(resolve(root,guardPolicyPath))));
 return records;
}
function recordBytes(ref,path,bytes){const blob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};}

export function installStage8AuthorityCandidate({root,guardRef}){
 const records=captureStage8Proof({root,guardRef}),path=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(path,'utf8');
 const rows=records.map(({path,blob,sha256})=>({path,blob,sha256}));
 assert.equal(source.split('export const acceptedStage8=Object.freeze([]);').length,2,'Only unarmed independent overlay may be populated');
 source=source.replace('export const acceptedStage8=Object.freeze([]);','export const acceptedStage8=Object.freeze('+JSON.stringify(rows,null,2)+');');
 source=source.replace('export const additionalStage8BootstrapRefs=Object.freeze([]);','export const additionalStage8BootstrapRefs=Object.freeze('+JSON.stringify([guardRef])+');');
 writeFileSync(path,source);return rows;
}
