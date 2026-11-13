/** Deterministic guard-capture candidate producer; independent review owns authority installation. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const stage7GuardPaths = Object.freeze([
  'scripts/fetch-source-lineage.mjs',
  'scripts/product-completion-lineage.mjs',
  'tests/completion-wave-20261113/source-preflight-stage.mjs',
  'tests/completion-wave-20261113/source-preflight.test.mjs',
  'tests/milestone60-20261113/source-cold-preflight.test.mjs',
  'tests/milestone60-20261113/source-preflight-retained-stage6.mjs',
  'tests/completion-wave-20261113/source-test-stage6.mjs',
  'tests/parallel-source-20261110/bootstrap.mjs',
  'tests/parallel-source-20261110/core.mjs',
  'tests/parallel-source-20261110/git-reader.mjs',
  'tests/milestone60-20261113/source-capture-stage7.mjs',
  'tests/milestone60-20261113/source-lineage-stage7.mjs',
  'tests/milestone60-20261113/source-proof-capture-stage7.mjs',
  'tests/milestone60-20261113/source-stage7.mjs',
  'tests/milestone60-20261113/source-stage7-historical.mjs',
  'docs/parallel-source-20261110/capture-revision62.json',
  'docs/milestone60-20261113/source-attempts/local-only-capture63-inactive.json',
  'docs/milestone60-20261113/source-stage7-v5.json',
  'docs/milestone60-20261113/source-attempts/app6-local-only-stage7-policy-v5.mjs',
  'tests/milestone60-20261113/source-stage7-activation.mjs',
  'tests/milestone60-20261113/source-stage7-policy.mjs',
  'tests/milestone60-20261113/source-stage7.test.mjs',
  'tests/milestone60-20261113/source-stage7-live.test.mjs',
  'tests/milestone60-20261113/source-stage7-preservation.test.mjs',
  'tests/milestone60-20261113/math-vectors.json',
  'docs/milestone60-20261113/math-next-extra-cases.json',
  'docs/milestone60-20261113/business-account-cases.json',
  'docs/milestone60-20261113/business-browser-cases.json',
  'docs/milestone60-20261113/sources/nist-international-acre.html',
  'docs/milestone60-20261113/sources/nist-international-acre.md',
  'docs/milestone60-20261113/sources/nist-international-acre-manifest.json',
  'docs/milestone60-20261113/sources/nist-international-acre-metadata.json',
  'docs/milestone60-20261113/source-stage7.json',
  'docs/milestone60-20261113/source-stage7-v1.json',
  'docs/milestone60-20261113/source-stage7-v2.json',
  'docs/milestone60-20261113/source-stage7-v3.json',
  'docs/milestone60-20261113/source-stage7-v4.json',
  'docs/milestone60-20261113/source-attempts/app5-g2-capture63-unqualified.json',
  'docs/milestone60-20261113/source-attempts/app5-g2-authority-candidate-unqualified.mjs',
  'docs/milestone60-20261113/source-attempts/app5-stage7-policy-v4.mjs',
  'docs/milestone60-20261113/source-attempts/app4-g1-capture63-unqualified.json',
  'docs/milestone60-20261113/source-attempts/app4-g1-authority-candidate-unqualified.mjs',
  'docs/milestone60-20261113/source-attempts/app4-stage7-policy-v3.mjs',
  'tests/milestone60-20261113/source-stage7-policy-v1.mjs',
]);
export function captureStage7Proof({ root, guardRef, outputPath='docs/parallel-source-20261110/capture-revision64.json' }) {
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const record=path=>{
  const blob=git(['rev-parse',guardRef+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);
  assert(readFileSync(resolve(root,path)).equals(bytes),'Commit guard candidate bytes before capture: '+path);
  return {path,ref:guardRef,blob,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
 };
 const retainedPath='docs/parallel-source-20261110/capture-revision62.json';
 const retainedBytes=readFileSync(resolve(root,retainedPath));
 assert.equal(createHash('sha256').update(retainedBytes).digest('hex'),'3961a6783bf142bf278c851dcb3c52a75604c7e6c3d13b80e5f4f4962c23a926','Literal published Stage6 capture must remain unchanged');
 const retained=JSON.parse(retainedBytes),capture=structuredClone(retained),guards=stage7GuardPaths.map(record);
 const sourcePath='docs/milestone60-20261113/source-stage7.json',sourceCapture=JSON.parse(readFileSync(resolve(root,sourcePath)));
 const sources=sourceCapture.rows.map(row=>{const expected=row.current;assert.equal(expected.ref,sourceCapture.codeRef);const blob=git(['rev-parse',expected.ref+':'+row.path]).toString().trim();assert.equal(blob,expected.blob);const bytes=git(['cat-file','blob',blob]);assert.equal(bytes.length,expected.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),expected.sha256);assert(readFileSync(resolve(root,row.path)).equals(bytes));return expected;});
 const records=[...guards,...sources],byPath=new Map(records.map(row=>[row.path,row]));assert.equal(byPath.size,records.length,'Finite guard/source paths must be disjoint');
 capture.currentSources=capture.currentSources.map(row=>byPath.get(row.path)??row);
 for(const row of records)if(!capture.currentSources.some(current=>current.path===row.path))capture.currentSources.push(row);
 capture.sourceStage7={guardRef,applicationCodeRef:sourceCapture.codeRef,applicationSourcePaths:sourceCapture.rows.map(row=>row.path),retainedCapturePath:retainedPath,retainedCaptureSHA256:createHash('sha256').update(retainedBytes).digest('hex'),guardPaths:stage7GuardPaths};
 writeFileSync(resolve(root,outputPath),JSON.stringify(capture,null,2)+'\n');
 return records;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const[root,guardRef]=process.argv.slice(2);assert(root&&guardRef,'Arguments: root guardRef');console.log(JSON.stringify(captureStage7Proof({root,guardRef}),null,2));}
