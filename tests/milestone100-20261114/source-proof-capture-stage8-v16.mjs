/** Source verifier process ownership successor; installed evidence stays literal. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const predecessorAuthorityRef='4fb1b82927264f432c16521b1d6437e62a45411d';
const retainedPath='docs/parallel-source-20261110/capture-revision82.json';
const retainedSHA256='329d78ac427278582b45c6c59b8a38b730eb29a29ac3cef8086ebbf95b25a130';
const sha=b=>createHash('sha256').update(b).digest('hex');
// The API caller has a separate actual-only authority record; never upsert it into
// currentSources or the guard selector: capture82 retains its historical SRC claim.
export const stage8V16ActualSourcePaths=Object.freeze(['src/lib/five-full-contract-evidence.test.ts']);
export const stage8V16GuardPaths=Object.freeze([
 'src/lib/parallel-source-evidence.test.ts',
 'tests/next-cohort-20261110/source/retained-runtime.mjs',
 'tests/next-cohort-20261110/source/runtime-evidence-batch.mjs',
 'tests/next-cohort-20261110/source/runtime-evidence-batch.test.mjs',
 'tests/next-cohort-20261110/source/runtime-evidence-batch-api.mjs',
 'tests/next-cohort-20261110/source/runtime-evidence-batch-api.d.mts',
 'tests/next-cohort-20261110/source/runtime-current-anchor.mjs',
 'tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs',
 'tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs',
 'tests/milestone100-20261114/source-stage8-policy-v3.mjs',
 'docs/milestone100-20261114/source-stage8-v3.json',
 'tests/completion-wave-20261113/source-authority-preload.test.mjs',
 'tests/ci-rpc-recovery-20261113/source-node.mjs',
 'tests/ci-rpc-recovery-20261113/source-node.d.mts',
 'tests/ci-rpc-recovery-20261113/source-node.test.mjs',
 'tests/milestone100-20261114/source-stage8-policy-v2.mjs',
 'docs/milestone100-20261114/source-stage8-v2.json',
 'tests/milestone100-20261114/source-stage8-activation.mjs',
 'tests/milestone100-20261114/source-stage8-live.test.mjs',
 'tests/milestone100-20261114/source-stage8-current-ref-join.mjs',
 'tests/milestone100-20261114/source-stage8-saved-actions-claim.mjs',
 'tests/milestone100-20261114/source-stage8-saved-actions-claim.test.mjs',
 'tests/milestone100-20261114/source-stage8-test-only-successor.mjs',
 'tests/milestone100-20261114/source-stage8-test-only-successor.test.mjs',
 'tests/milestone100-20261114/source-preflight-stage8.mjs',
 'tests/source-lineage-bootstrap.test.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.test.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/milestone100-20261114/source-proof-capture-stage8-v16.mjs',
 'docs/milestone100-20261114/source-qualified-authority82.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'scripts/fetch-source-lineage.mjs',
 'tests/milestone60-20261113/source-cold-preflight.test.mjs',
]);
export function installStage8V16AuthorityCandidate({root,guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=(ref,path)=>{const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(readFileSync(resolve(root,path)).equals(bytes),'Commit exact guard before capture: '+path);return {path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const retained=readFileSync(resolve(root,retainedPath));assert.equal(sha(retained),retainedSHA256);assert(retained.equals(git(['show',predecessorAuthorityRef+':'+retainedPath])));
 const authorityCopy=readFileSync(resolve(root,'docs/milestone100-20261114/source-qualified-authority82.mjs'));assert.equal(sha(authorityCopy),'c2bfaeb61ad809f39430ef8e547a220fcebae9bad2b9f3cf8e3935a0765acdd1');
 const capture=JSON.parse(retained),records=stage8V16GuardPaths.map(path=>record(guardRef,path)),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 const sourceCapturePath='docs/milestone100-20261114/source-stage8-v3.json',sourceBytes=readFileSync(resolve(root,sourceCapturePath));assert.equal(sha(sourceBytes),'eb175c257d4b452a036fe1be355b717364b0802eb1c7d3af614972331da02cd7');
 const sourceCapture=JSON.parse(sourceBytes);assert.equal(sourceCapture.codeRef,'2a59a85c6e935c43e9a5a71ae15c9954e4fcab42');assert.equal(sourceCapture.rows.length,24);
 const actualOnlySources=stage8V16ActualSourcePaths.map(path=>{
  assert(!stage8V16GuardPaths.includes(path),'Actual-only SRC must not enter the historical guard selector');
  const current=record(guardRef,path),source=sourceCapture.rows.find(row=>row.path===path);assert(source);assert.deepEqual(record(sourceCapture.codeRef,path),source.current);
  for(const key of ['path','blob','bytes','sha256'])assert.equal(current[key],source.current[key],'Actual authority must join the exact G20 source object');
  const historical=byPath.get(path);assert(historical);for(const key of ['path','blob','bytes','sha256'])assert.equal(historical[key],source.predecessor[key],'Historical capture82 API claim must remain the literal predecessor bytes');
  return {current,source:source.current,historical,sourceCapturePath,sourceCaptureSHA256:sha(sourceBytes)};
 });
 for(const row of records)byPath.set(row.path,row);byPath.set(retainedPath,record(predecessorAuthorityRef,retainedPath));capture.currentSources=[...byPath.values()];
 capture.sourceStage8V16={guardRef,retainedCapturePath:retainedPath,retainedCaptureSHA256:retainedSHA256,predecessorAuthorityRef,guardPaths:stage8V16GuardPaths,actualOnlySources};
 const outputPath='docs/parallel-source-20261110/capture-revision83.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,outputPath),bytes);
 records.push(...actualOnlySources.map(row=>({...row.current,admissionClass:'actual-only-src',sourceRecord:row.source,sourceCapturePath:row.sourceCapturePath,sourceCaptureSHA256:row.sourceCaptureSHA256})));
 records.push({path:outputPath,ref:null,blob:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),bytes:bytes.length,sha256:sha(bytes)});
 const authorityPath=resolve(root,'tests/parallel-source-20261110/authority.mjs');let source=readFileSync(authorityPath,'utf8');
 assert.equal(source.split('export const acceptedStage8V16=Object.freeze([]);').length,2,'Only unarmed additive V16 overlay may be installed');
 source=source.replace('export const acceptedStage8V16=Object.freeze([]);','export const acceptedStage8V16=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage8V16BootstrapRefs=Object.freeze([]);','export const additionalStage8V16BootstrapRefs=Object.freeze('+JSON.stringify([guardRef,predecessorAuthorityRef].sort())+');');
 writeFileSync(authorityPath,source);return records;
}
