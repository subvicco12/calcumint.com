/** Test-only current binding: retained77 metadata and runtime tree authority stay fixed. */
import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {acceptedStage10Stage9Fixture,acceptedStage10RuntimeTrees} from '../parallel-source-20261110/authority.mjs';
import {runtimeAuxiliaryTreeAvailabilitySuccessor} from './source-stage8-runtime-auxiliary.mjs';
import {selectStage8GuardSuccessor} from './source-stage8-guard-selection.mjs';
const capturePath='docs/next-engineering-20261115/source/guard-capture-stage9-fixture.json',captureRef='77eb196e5606bf87ee3cf67326d9fc4354cfef45';
const runtimePath='tests/next-cohort-20261110/source/retained-runtime.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
export function assertCurrentRuntimeGuard(input){
 assert.deepEqual(Object.keys(input).sort(),['git','read','root'],'Only fixed current runtime inputs allowed');const {git,read}=input,root=resolve(input.root);
 // Authenticate the entire exact retained roster before any selected row can nominate Git reads.
 const capturePin=acceptedStage10Stage9Fixture.find(row=>row.path===capturePath);assert(capturePin,'Independent retained77 runtime capture required');
 const supplied=read(capturePath);assert(Buffer.isBuffer(supplied)&&sha(supplied)===capturePin.sha256,'Independent current runtime capture differs');
 const capture=JSON.parse(supplied);assert.equal(new Set(capture.currentSources.map(row=>row.path)).size,capture.currentSources.length,'Unique captured runtime roster required');
 const rows=capture.currentSources.filter(row=>row.path===runtimePath);assert.equal(rows.length,1);const row=selectStage8GuardSuccessor(capture,runtimePath);assert.deepEqual(row,rows[0]);
 assert(capture.sourceStage10RuntimeTrees.guardPaths.includes(runtimePath));assert.equal(row.ref,capture.sourceStage10RuntimeTrees.guardRef);
 assert.deepEqual(row,{...runtimeAuxiliaryTreeAvailabilitySuccessor,ref:capture.sourceStage10RuntimeTrees.guardRef},'Only the fixed runtime tree ownership join is allowed');
 const authority=acceptedStage10RuntimeTrees.find(row=>row.path===runtimePath);assert(authority);assert.equal(row.blob,authority.blob);assert.equal(row.sha256,authority.sha256);
 assert.equal(resolve(git(['rev-parse','--show-toplevel']).toString().trim()),root,'Actual runtime workspace root differs');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 assert.equal(git(['rev-parse',captureRef+':'+capturePath]).toString().trim(),capturePin.blob,'Retained77 runtime capture path differs');
 const retained=git(['cat-file','blob',capturePin.blob]);assert(Buffer.isBuffer(retained)&&retained.equals(supplied),'Retained77 runtime capture bytes differ');
 for(const current of [runtimeAuxiliaryTreeAvailabilitySuccessor,row]){
  assert.equal(git(['rev-parse',current.ref+':'+runtimePath]).toString().trim(),current.blob,'Current runtime immutable path differs');
  const bytes=git(['cat-file','blob',current.blob]);assert(Buffer.isBuffer(bytes)&&bytes.length===current.bytes&&sha(bytes)===current.sha256,'Current runtime immutable bytes differ');
  assert.equal(createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),current.blob,'Current runtime object address differs');
 }
 assert.equal(git(['rev-parse',head+':'+runtimePath]).toString().trim(),row.blob,'Actual current runtime HEAD object differs');
 const current=read(runtimePath);assert(Buffer.isBuffer(current)&&current.length===row.bytes&&sha(current)===row.sha256,'Current runtime reader bytes differ');
 const target=resolve(root,runtimePath),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink()&&realpathSync(target)===target,'Regular physical current runtime required');
 assert(readFileSync(target).equals(current),'Physical current runtime bytes differ');
 assert.equal(git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),head,'Actual HEAD moved during current runtime proof');
}
