/** Exactly two reviewed test-only import successors. Original test-only verifier stays literal. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {assertTestOnlySuccessor as retainedAssert,testOnlySuccessorPaths} from '../parallel-five-20261110/test-only-successor.mjs';
import {provePinnedSourceStage8} from './source-stage8-activation.mjs';
import {assertSourceStage8HeadStable} from './source-stage8.mjs';
import {verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
export {testOnlySuccessorPaths};
const policies=[
  {
    "path": "src/lib/cohort22-closure-evidence.test.ts",
    "predecessor": {
      "path": "src/lib/cohort22-closure-evidence.test.ts",
      "ref": "eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8",
      "blob": "26f76364d8307043beb8f94351901281916509ab",
      "bytes": 4269,
      "sha256": "cbb6549c7c06674683ea2f622a59ac88476a4a91a5aad62ab45dccfe4258469f"
    },
    "current": {
      "path": "src/lib/cohort22-closure-evidence.test.ts",
      "ref": "b1dccffe1cc9e0515030d5e7ea4bad8a72756080",
      "blob": "713e1f9104d91410d41e832ceee173a85322f3ba",
      "bytes": 4270,
      "sha256": "6765566485439e27e8fe321a89e545aa6fc2909ba00d1e3c2f11c206196902d8"
    }
  },
  {
    "path": "src/lib/first-five-engineering-evidence.test.ts",
    "predecessor": {
      "path": "src/lib/first-five-engineering-evidence.test.ts",
      "ref": "eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8",
      "blob": "e3b20ddff2e4972c0b91038012e512ed5ebc7f9b",
      "bytes": 5399,
      "sha256": "190b29e0bb2a54b8f4900b17df252b2cf760066af1951e1ff0920caf42749752"
    },
    "current": {
      "path": "src/lib/first-five-engineering-evidence.test.ts",
      "ref": "b1dccffe1cc9e0515030d5e7ea4bad8a72756080",
      "blob": "68e643ed61af4b42593479b9b7e8ad858e14eca0",
      "bytes": 5400,
      "sha256": "d5dbfe4de18355d595b0ea0ca5563e33440b79fb4472b889fffaa1bef1c7a879"
    }
  }
];
for(const row of policies){Object.freeze(row.predecessor);Object.freeze(row.current);Object.freeze(row);}Object.freeze(policies);
const oldImport="'../../tests/acceptance-closure-20261108/receipt-source-path.mjs'",nextImport="'../../tests/milestone100-20261114/receipt-source-path-stage8.mjs'",sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(record,git){assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);const bytes=git(['cat-file','blob',record.blob]);assert.equal(bytes.length,record.bytes);assert.equal(sha(bytes),record.sha256);return bytes;}
export function importOnlyPredecessor({file,row,currentBytes,git}){
 const expected=policies.find(item=>item.path===file);assert(expected,'Only the two reviewed import-only test paths');
 assert.deepEqual(row?.predecessor,expected.predecessor,'Exact eac9 test predecessor required');assert.deepEqual(row?.current,expected.current,'Exact reviewed current test required');
 const previous=immutable(expected.predecessor,git),current=immutable(expected.current,git);assert(Buffer.isBuffer(currentBytes)&&currentBytes.equals(current),'Current import-only test bytes differ');
 const text=previous.toString('utf8');assert.equal(text.split(oldImport).length,2,'Exactly one old helper import required');assert(Buffer.from(text.replace(oldImport,nextImport)).equals(current),'Only the reviewed helper import may change');return previous;
}
export async function assertTestOnlySuccessor(file,recordedSHA256,currentBytes,git=sourceGit,read=readFileSync){
 if(!policies.some(row=>row.path===file))return retainedAssert(file,recordedSHA256,currentBytes,git);
 const proof=provePinnedSourceStage8({read,git,root:process.cwd()});verifyParallelAuthority(read,git);
 const predecessor=importOnlyPredecessor({file,row:proof.live.get(file),currentBytes,git});
 const retained=await retainedAssert(file,recordedSHA256,predecessor,git);
 assertSourceStage8HeadStable(proof);return {...retained,sourceStage8Current:proof.live.get(file).current,importOnlySuccessor:true};
}
