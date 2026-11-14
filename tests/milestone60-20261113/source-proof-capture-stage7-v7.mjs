/** Deterministic guard-capture candidate producer; independent review owns authority installation. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { stage7GuardPaths as retainedGuardPaths } from './source-proof-capture-stage7-v6.mjs';
export const stage7GuardPaths=Object.freeze([...retainedGuardPaths,
 'tests/milestone60-20261113/source-proof-capture-stage7-v7.mjs',
 'docs/milestone60-20261113/source-stage7-qualified-authority65.mjs',
 'docs/milestone60-20261113/source-immutable-prefetch-hints.json',
 'docs/parallel-source-20261110/capture-revision65.json',
]);
export function captureStage7Proof({ root, guardRef, outputPath='docs/parallel-source-20261110/capture-revision66.json' }) {
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
 assert.match(guardRef,/^[a-f0-9]{40}$/);
 const record=path=>{
  const blob=git(['rev-parse',guardRef+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);
  assert(readFileSync(resolve(root,path)).equals(bytes),'Commit guard candidate bytes before capture: '+path);
  return {path,ref:guardRef,blob,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
 };
 const retainedPath='docs/parallel-source-20261110/capture-revision65.json';
 const retainedBytes=readFileSync(resolve(root,retainedPath));
 assert.equal(createHash('sha256').update(retainedBytes).digest('hex'),'ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c','Literal qualified Stage7 capture65 must remain unchanged');
 const retained=JSON.parse(retainedBytes),capture=structuredClone(retained),guards=stage7GuardPaths.map(record);
 const sourcePath='docs/milestone60-20261113/source-stage7-v6.json',sourceCapture=JSON.parse(readFileSync(resolve(root,sourcePath)));
 const sources=sourceCapture.rows.map(row=>{const expected=row.current;assert.equal(expected.ref,sourceCapture.codeRef);const blob=git(['rev-parse',expected.ref+':'+row.path]).toString().trim();assert.equal(blob,expected.blob);const bytes=git(['cat-file','blob',blob]);assert.equal(bytes.length,expected.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),expected.sha256);assert(readFileSync(resolve(root,row.path)).equals(bytes));return expected;});
 const records=[...guards,...sources],byPath=new Map(records.map(row=>[row.path,row]));assert.equal(byPath.size,records.length,'Finite guard/source paths must be disjoint');
 capture.currentSources=capture.currentSources.map(row=>byPath.get(row.path)??row);
 for(const row of records)if(!capture.currentSources.some(current=>current.path===row.path))capture.currentSources.push(row);
 capture.retainedSourceStage7Stages=[...(retained.retainedSourceStage7Stages??[retained.retainedSourceStage7]).filter(Boolean),structuredClone(retained.sourceStage7)];
 capture.sourceStage7={guardRef,applicationCodeRef:sourceCapture.codeRef,applicationSourcePaths:sourceCapture.rows.map(row=>row.path),retainedCapturePath:retainedPath,retainedCaptureSHA256:createHash('sha256').update(retainedBytes).digest('hex'),guardPaths:stage7GuardPaths};
 writeFileSync(resolve(root,outputPath),JSON.stringify(capture,null,2)+'\n');
 return records;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const[root,guardRef]=process.argv.slice(2);assert(root&&guardRef,'Arguments: root guardRef');console.log(JSON.stringify(captureStage7Proof({root,guardRef}),null,2));}
