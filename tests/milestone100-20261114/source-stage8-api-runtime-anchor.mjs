/** Exact API-test successor only; all six original runtime anchor records remain literal. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {provePinnedSourceStage8,sourceStage8Policy} from './source-stage8-activation.mjs';
import {sourceStage8HistoricalView,assertSourceStage8HeadStable} from './source-stage8.mjs';
import {verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
import {sourceStage10Policy as current32Policy,sourceStage10CapturePath as current32CapturePath} from '../next-engineering-20261115/source-stage10-current32-policy.mjs';
export const apiRuntimeAnchor=Object.freeze({fixed:Object.freeze({"path": "src/lib/five-full-contract-evidence.test.ts", "blob": "20658ed565a31a389d3aaac1a21abb68b851e942", "sha256": "1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313"}),predecessor:Object.freeze({"path": "src/lib/five-full-contract-evidence.test.ts", "ref": "eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8", "blob": "20658ed565a31a389d3aaac1a21abb68b851e942", "bytes": 6479, "sha256": "1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313"}),current:Object.freeze({"path": "src/lib/five-full-contract-evidence.test.ts", "ref": "2a59a85c6e935c43e9a5a71ae15c9954e4fcab42", "blob": "9cca36d6924a508b2894b36480976aecf0188c9a", "bytes": 7494, "sha256": "f80688080e71f9e07e8489fea1785ff2c5398943db7be792a0a2df5abf71d9fd"})});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const current32ApiRow=Object.freeze({predecessor:Object.freeze({...apiRuntimeAnchor.current,ref:'3ccdd6d026ca0ec51063ff4501901ac92e8ace6a'}),current:Object.freeze({path:apiRuntimeAnchor.fixed.path,ref:'50240fb1d59a1f8d298718f85e58bd55b4b990c2',blob:'3d25a974c6c821504d1c9df1b3540be1fed6d410',bytes:7882,sha256:'57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150'})});
function current32ApiObjectJoin(git,provedRow){
 const capture=JSON.parse(immutable({path:current32CapturePath,ref:'baf80e18e0fb7a6a961006ee6fea507539363756',blob:'41dcb7e6d85c84b78a9e0d5086a802c2e96b06bd',bytes:23403,sha256:'b1151d655a9e44f8a304c0d81f4c94d3e0a974a12d12a4d51955b4eb8f54488d'},git));
 assert.equal(current32Policy.captureSHA256,'b1151d655a9e44f8a304c0d81f4c94d3e0a974a12d12a4d51955b4eb8f54488d');
 assert.equal(capture.codeRef,current32Policy.codeRef);assert.equal(capture.predecessorRef,current32Policy.predecessorRef);assert.deepEqual(capture.ancestry,current32Policy.ancestry);assert.deepEqual(capture.rows.map(row=>row.path),current32Policy.paths);
 const rows=capture.rows.filter(row=>row.path===apiRuntimeAnchor.fixed.path);assert.equal(rows.length,1);assert.deepEqual(rows[0],{path:apiRuntimeAnchor.fixed.path,...current32ApiRow},'Only the independently pinned current32 API source join is allowed');
 if(provedRow!==undefined)assert.deepEqual(provedRow,current32ApiRow,'The fully verified current32 API row differs');
 const retained=immutable(apiRuntimeAnchor.current,git),previous=immutable(current32ApiRow.predecessor,git),current=immutable(current32ApiRow.current,git);
 assert(retained.equals(previous),'Exact current32 API predecessor must retain the admitted Stage8 successor');return current;
}
function immutable(row,git){
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
 const commit=git(['cat-file','commit',row.ref]);assert(Buffer.isBuffer(commit));assert.equal(createHash('sha1').update(Buffer.from('commit '+commit.length+'\0')).update(commit).digest('hex'),row.ref);
 assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);
 const bytes=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256);return bytes;
}
/** Pure exact-tuple validator; callers cannot nominate a source proof row. */
export function assertApiRuntimeAnchorRow(row){assert.deepEqual(row,{predecessor:apiRuntimeAnchor.predecessor,current:apiRuntimeAnchor.current},'Exact independently pinned API test successor required');}
export function proveApiRuntimeSourceSuccessor({fixed,read,git,root=process.cwd(),...extra}){
 assert.equal(Object.keys(extra).length,0,'Caller-nominated source rows or proof options are forbidden');
 assert.deepEqual(fixed,apiRuntimeAnchor.fixed,'Only the literal fixed API test anchor may advance');
 assert.equal(typeof read,'function','Explicit closed source reader required');assert.equal(typeof git,'function','Explicit source Git transport required');
 const retained=sourceStage8HistoricalView(git);if(retained)assert.equal(read,retained.historicalInput.read,'Historical source reader capability differs');
 const actual=retained?.actualInput??{read,git,root};
 const before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[a-f0-9]{40}$/);
 assert.equal(sourceStage8Policy.codeRef,apiRuntimeAnchor.current.ref,'Independently pinned source version differs');assert.equal(sourceStage8Policy.paths.length,24);
 const proof=provePinnedSourceStage8({read,git,root});assert.equal(proof.actualInput.read,actual.read,'Source proof must retain the same closed reader');
 assertSourceStage8HeadStable(proof);
 verifyParallelAuthority(actual.read,actual.git);
 const row=proof.live.get(apiRuntimeAnchor.fixed.path);assertApiRuntimeAnchorRow(row);
 const previous=immutable(row.predecessor,actual.git),current=immutable(row.current,actual.git);
 assert.equal(sha(previous),apiRuntimeAnchor.fixed.sha256);assert.equal(row.predecessor.blob,apiRuntimeAnchor.fixed.blob);
 assert.equal(sha(current),apiRuntimeAnchor.current.sha256);
 const admitted=proof.stage10Live.get(apiRuntimeAnchor.fixed.path);assert(admitted,'The fully verified current32 API source row is required');
 const current32=current32ApiObjectJoin(actual.git,admitted);
 assert.equal(actual.git(['rev-parse',before+':'+apiRuntimeAnchor.fixed.path]).toString().trim(),current32ApiRow.current.blob,'Exact actual HEAD API test object differs');
 const bytes=actual.read(apiRuntimeAnchor.fixed.path);assert(Buffer.isBuffer(bytes)&&bytes.equals(current32),'Fixed runtime verifier target differs: '+apiRuntimeAnchor.fixed.path);
 assertSourceStage8HeadStable(proof);
 assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during fixed API runtime proof');
 return true;
}

/** Object relation only: the public core owns fresh source/authority and HEAD-end proof. */
export function assertApiRuntimeHistoricalObjectJoin({file,recordedSHA256,row,currentBytes,git,...extra}){
 assert.equal(Object.keys(extra).length,0,'Only the fixed API historical object relation is supported');
 assert.equal(file,apiRuntimeAnchor.fixed.path,'Only the exact API test historical claim is supported');
 assert.equal(recordedSHA256,apiRuntimeAnchor.predecessor.sha256,'Exact original API source claim required');
 if(row?.current?.ref===current32ApiRow.current.ref)assert.deepEqual(row,current32ApiRow,'Only the independently pinned current32 API source join is allowed');else assertApiRuntimeAnchorRow(row);
 const actual=sourceStage8HistoricalView(git)?.actualInput.git??git,before=actual(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[a-f0-9]{40}$/);
 const recorded=immutable({...apiRuntimeAnchor.predecessor,ref:'f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5'},actual),previous=immutable(apiRuntimeAnchor.predecessor,actual),retained=immutable(apiRuntimeAnchor.current,actual);
 assert(recorded.equals(previous),'F042 API source must join the exact eac9 predecessor');
 assert.equal(sha(retained),apiRuntimeAnchor.current.sha256);
 const current=current32ApiObjectJoin(actual);
 assert.equal(actual(['rev-parse',before+':'+apiRuntimeAnchor.fixed.path]).toString().trim(),current32ApiRow.current.blob,'Exact actual HEAD API test object differs');
 assert(Buffer.isBuffer(currentBytes)&&currentBytes.equals(current),'Current exact API test source bytes differ');
 assert.equal(actual(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during fixed API historical object join');
}
