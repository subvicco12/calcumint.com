/** Only three unchanged byte identities join the reviewed source ownership revision. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const sourceOwnershipRef='e3b91f869b9b218e7a24e2ae5c3cbddba1297780';
const records=[
  {
    "path": "src/components/saved-calculation-actions.tsx",
    "ref": "b1dccffe1cc9e0515030d5e7ea4bad8a72756080",
    "blob": "6ed37e10bc37e802ccc2aaf03a7a9b8e9af8eb52",
    "bytes": 5333,
    "sha256": "c93c78822427b99490cec057f0b62abd2c22a55b03f56ef38682c15caedbd994"
  },
  {
    "path": "src/lib/cohort22-closure-evidence.test.ts",
    "ref": "b1dccffe1cc9e0515030d5e7ea4bad8a72756080",
    "blob": "713e1f9104d91410d41e832ceee173a85322f3ba",
    "bytes": 4270,
    "sha256": "6765566485439e27e8fe321a89e545aa6fc2909ba00d1e3c2f11c206196902d8"
  },
  {
    "path": "src/lib/first-five-engineering-evidence.test.ts",
    "ref": "b1dccffe1cc9e0515030d5e7ea4bad8a72756080",
    "blob": "68e643ed61af4b42593479b9b7e8ad858e14eca0",
    "bytes": 5400,
    "sha256": "d5dbfe4de18355d595b0ea0ca5563e33440b79fb4472b889fffaa1bef1c7a879"
  }
];
for(const row of records)Object.freeze(row);Object.freeze(records);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(row,git){
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
 const commit=git(['cat-file','commit',row.ref]);assert(Buffer.isBuffer(commit));assert.equal(createHash('sha1').update(Buffer.from('commit '+commit.length+'\0')).update(commit).digest('hex'),row.ref,'Source join commit content address differs');
 assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);
 const bytes=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256);return bytes;
}
export function retainedStage8CurrentRecord({file,current,retained,currentBytes,git}){
 const expected=records.find(row=>row.path===file);assert(expected,'Only the three exact retained Stage8 byte identities may join');
 assert.deepEqual(retained,expected,'Literal b1 claim must remain exact');
 if(current?.ref===expected.ref)return current;
 const successor={...expected,ref:sourceOwnershipRef};assert.deepEqual(current,successor,'Only the exact source ownership ref-only successor may join');
 const previous=immutable(expected,git),actual=immutable(successor,git);assert(actual.equals(previous),'Source ref-only bytes differ');
 assert(Buffer.isBuffer(currentBytes)&&currentBytes.equals(actual),'Fresh current source join bytes differ');
 return expected;
}
