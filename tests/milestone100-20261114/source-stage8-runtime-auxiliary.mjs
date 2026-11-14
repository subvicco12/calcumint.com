import {replayActualAuthorityWitness} from './source-stage8-authority-scope.mjs';
/** One immutable auxiliary evolution; the original personal policy stays literal. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {provePinnedSourceStage8,sourceStage8Policy} from './source-stage8-activation.mjs';
import {sourceStage8HistoricalView,assertSourceStage8HeadStable} from './source-stage8.mjs';
import {accepted,verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
export const runtimeAuxiliarySource=Object.freeze({prior:Object.freeze({"path": "tests/next-cohort-20261110/source/retained-runtime.mjs", "ref": "054854bceed263ba59e8cd0052f1f3e9b1ea8e30", "blob": "99666fd1d09a2b7f782b05d4dbd9f9656be08eea", "bytes": 24134, "sha256": "a6b0b939f5e5cee3072cc2776bc3dbf6663a7c70731419a3905d7904a2f87f0c"}),current:Object.freeze({"path": "tests/next-cohort-20261110/source/retained-runtime.mjs", "ref": "2a59a85c6e935c43e9a5a71ae15c9954e4fcab42", "blob": "15ba13c6dda37bf18bb5ecee22e948daeefc4280", "bytes": 26117, "sha256": "6556bcf9ffb5bcaf7873a6d66718933343cf46c311f8895b27aee3386bcf6676"})});
export const runtimeAuxiliaryBatchPredecessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"9fa7614e903ef0027298ee6ac63be93bbae5eb47","blob":"c729ed47e4feb489bc3eea33db8b6cef518c6154","bytes":29084,"sha256":"7a436834029725c7922bb8ee0500c4fd033d6ad00c3d56a301568ba9b2cd524e"});
export const runtimeAuxiliaryBoundHeadPredecessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"88de7068ba2674aab85df5611840c4b029ef68c0","blob":"777f9b68d5a0b41d5c21d2650f7199867d1dc503","bytes":29359,"sha256":"e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"});
export const runtimeAuxiliaryBatchSuccessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"257a18f2ebab091410129a2fcd58bd7edff843e9","blob":"92c537d1fcc2b307f1799c4b474627de49e0358b","bytes":30516,"sha256":"f9f1a86538710d60b49baa562a198226cf5f005f32e8b6c85b3bb3203ed96fb4"});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(row,git){
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
 const commit=git(['cat-file','commit',row.ref]);assert(Buffer.isBuffer(commit));assert.equal(createHash('sha1').update(Buffer.from('commit '+commit.length+'\0')).update(commit).digest('hex'),row.ref);
 assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);
 const bytes=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256);return bytes;
}
export function proveRuntimeAuxiliarySuccessor({record,currentBytes,input,witness,...extra}){
 assert.equal(Object.keys(extra).length,0,'Caller-nominated current records or proof options are forbidden');
 assert.deepEqual(record,runtimeAuxiliarySource.prior,'Only the literal personal auxiliary record may advance');
 assert.equal(typeof input?.read,'function','Explicit source reader required');assert.equal(typeof input?.git,'function','Explicit source Git required');
 const retained=sourceStage8HistoricalView(input.git);if(retained)assert.equal(input.read,retained.historicalInput.read,'Historical source reader capability differs');
 const actual=retained?.actualInput??input,root=actual.root??process.cwd();
 const before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[a-f0-9]{40}$/);
 assert.equal(sourceStage8Policy.codeRef,runtimeAuxiliarySource.current.ref);assert.equal(sourceStage8Policy.paths.length,24);
 let proof;
 if(witness===undefined){proof=provePinnedSourceStage8({...input,root});assert.equal(proof.actualInput.read,actual.read,'The same registered actual source reader is required');assertSourceStage8HeadStable(proof);verifyParallelAuthority(actual.read,actual.git);}
 else replayActualAuthorityWitness(witness,input);
 const next=runtimeAuxiliaryBatchSuccessor;assert.equal(next.path,runtimeAuxiliarySource.current.path);
 const authority=accepted.find(row=>row.path===next.path);assert(authority,'Independently admitted runtime guard required');assert.equal(authority.blob,next.blob);assert.equal(authority.sha256,next.sha256);
 immutable(runtimeAuxiliarySource.prior,actual.git);immutable(runtimeAuxiliarySource.current,actual.git);immutable(runtimeAuxiliaryBatchPredecessor,actual.git);immutable(runtimeAuxiliaryBoundHeadPredecessor,actual.git);const bytes=immutable(next,actual.git),path=next.path;
 assert.equal(actual.git(['rev-parse',before+':'+path]).toString().trim(),next.blob,'Exact actual HEAD runtime object differs');
 const target=resolve(root,path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular actual runtime source required');assert.equal(realpathSync(target),target,'Redirected runtime source');
 const fresh=actual.read(path);assert(Buffer.isBuffer(fresh)&&fresh.equals(bytes)&&Buffer.isBuffer(currentBytes)&&currentBytes.equals(fresh),'Current personal auxiliary source bytes differ');
 if(proof)assertSourceStage8HeadStable(proof);assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during runtime auxiliary proof');
 return true;
}
