import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const historicalCommit='b1c606efd06930ae8363e98aa369298ed0c404aa';
const successorCommit='804028a913ee33021b14e67d0f40ee7893d896b6';
const pins={
 'src/app/admin/actions.ts':{historical:{blob:'5f9fbe3c554cf5e0de3e343dea70fe358ebe5b72',sha:'ae34b461575451a5665b00aad3d8327cb36805ac2e3a1c3ef7d9ac5dd01ff57c'},successor:{blob:'daf021de403f6eb02cf34020d89bdbbd305011cd',sha:'ccaa94152b33b7daf64ddc531f6e103ffb2daf2b45825ab1f0fc954f6b3fe247'}},
 'src/app/admin/calculators/page.tsx':{historical:{blob:'cd8365d1d646db2aec109ccd2a418bab27313403',sha:'2385778cc80320a74ca85dfdb93479d8456d2cad5f32476a027d316d408a2adc'},successor:{blob:'ab462716ba9247fde375e194ee081a833e968e8c',sha:'d89ac5d4426e5e494925f9176acebd9f6129ac11040537ce75f21e6104ca78a7'}}
};
export const callerPaths=Object.freeze(Object.keys(pins));
const root=new URL('../../',import.meta.url);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function verifiedBlob(path,commit,pin){
 const spec=commit+':'+path;
 assert.equal(execFileSync('git',['rev-parse','--verify',spec],{cwd:root,encoding:'utf8'}).trim(),pin.blob,'Pinned caller Git object');
 const bytes=execFileSync('git',['cat-file','blob',pin.blob],{cwd:root});
 assert.equal(hash(bytes),pin.sha,'Pinned caller Git bytes');
 return bytes;
}
// Historical decisions remain unchanged. Only the exact draft-safety caller/UI
// successors are admitted; all other closure entries retain their original hash.
export function verifyCallerSuccessor(path,bytes,claimedHistoricalHash){
 assert(callerPaths.includes(path),'Explicit caller successor path required');
 const {historical,successor}=pins[path];
 assert.equal(claimedHistoricalHash,historical.sha,'Original decision caller binding');
 verifiedBlob(path,historicalCommit,historical);
 const expected=verifiedBlob(path,successorCommit,successor);
 assert.equal(hash(bytes),successor.sha,'Exact draft-safety caller successor');
 assert.deepEqual(Buffer.from(bytes),expected,'Caller equals pinned successor Git blob');
}
