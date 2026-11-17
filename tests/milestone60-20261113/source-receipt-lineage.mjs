/** Fixed one-helper MJS successor; the existing SRC-stage proof remains independently mandatory. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {extendStage7Lineage} from './source-lineage-stage7.mjs';
export const receiptLineagePolicy=Object.freeze({
  "retainedGraphRef": "9c1a6cae1dd5b8b922cbb23585956b69e5e57d14",
  "predecessor": {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "71f285544bd85b46e51da109897c12bfff7b798f",
    "blob": "4384404c2300dd53428ce95c7308020c6acfd9da",
    "bytes": 4983,
    "sha256": "3288af2f5b62ef1ebc7ea39e8ada8ba4c7ad7ebe6a776e173b97a7672efbf8e0"
  },
  "current": {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "c3aaff5bf19f2d073cf3aeb7ba9d0cdf74719b1c",
    "blob": "0f057d302dd0f273037779f72ba91e73999aaf2a",
    "bytes": 5312,
    "sha256": "333cf6162faae87d5cdd7a521183f5574f87399c50925ea2f0c8dbe2b79cfa81"
  }
});
Object.freeze(receiptLineagePolicy.predecessor);Object.freeze(receiptLineagePolicy.current);
export function verifyReceiptLineageExtension({previous,current,git}){
 const policy=receiptLineagePolicy,path=policy.current.path;
 for(const record of [policy.predecessor,policy.current]){
  assert.equal(git(['rev-parse',record.ref+':'+path]).toString().trim(),record.blob,'Exact receipt helper Git object differs');
  const bytes=git(['cat-file','blob',record.blob]);assert.equal(bytes.length,record.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
 }
 const match=/const bindings=(\[[\s\S]*?\n\]);/.exec(previous);assert(match,'Exact retained graph required');const rows=JSON.parse(match[1]);
 const owned=rows.find(row=>row.path===path);assert(owned,'Retained owned receipt helper is required');
 assert.equal(owned.successorRef,policy.predecessor.ref);assert.equal(owned.successorBlob,policy.predecessor.blob);assert.equal(owned.successorSHA256,policy.predecessor.sha256);
 const owners=rows.filter(row=>row.supplementalSources?.some(dep=>dep.path===path));assert.deepEqual(owners.map(row=>row.path),['scripts/publication20-caller-lineage.mjs']);
 const dependency=owners[0].supplementalSources.find(dep=>dep.path===path);assert.deepEqual(dependency,{path,ref:policy.predecessor.ref,blob:policy.predecessor.blob,sha256:policy.predecessor.sha256});
 const expected=extendStage7Lineage(previous,new Map([[path,{path,predecessor:policy.predecessor,current:policy.current}]]));
 assert.equal(current,expected,'Only the exact reviewed receipt helper successor may extend the qualified SRC graph');
 return true;
}
