/** Exact two-path retained evidence bridge, only after complete current source proof. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {proveNamedCurrentContext} from '../parallel-source-20261110/core.mjs';
const bindings=[
  {
    "path": "src/lib/native-delivery/technology-five-job-storage.ts",
    "ref": "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
    "blob": "9831531b3c87bdadd8146ce566451d86f140bdd1",
    "sha256": "32ae836e0ab3dfa6e3ce7bc82107e05bc89a031fe1c04f7e371b9f0ef11c32f0",
    "bytes": 3900
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-worker.ts",
    "ref": "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
    "blob": "55072e75b8246480639d842ded1a7cd05a71bdcf",
    "sha256": "9ea8e2235cce7924a58fffee2eaa8c5e71f4c0090fb80f3ced4ec734d15ecea1",
    "bytes": 3380
  }
];
export function readStage2HistoricalRuntime(path,read,git){
 const row=bindings.find(value=>value.path===path);if(!row)return undefined;
 const proof=proveNamedCurrentContext(read,git).get(path);
 assert(proof,'Explicit current Stage2 source proof required');
 assert.equal(proof.recordedSHA256,row.sha256,'Exact retained5008 source claim required');
 const current=read(path);assert(current.equals(git(['cat-file','blob',proof.current.blob])),'Current runtime source changed after proof');
 assert.equal(git(['rev-parse','HEAD:'+path]).toString().trim(),proof.current.blob,'Current runtime HEAD differs');
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
 assert.equal(git(['rev-parse',row.ref+':'+path]).toString().trim(),row.blob);
 const historical=git(['cat-file','blob',row.blob]);assert.equal(historical.length,row.bytes);assert.equal(createHash('sha256').update(historical).digest('hex'),row.sha256);
 return historical;
}
