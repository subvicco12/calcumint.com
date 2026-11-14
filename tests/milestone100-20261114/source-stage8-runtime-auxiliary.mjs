/** One immutable auxiliary evolution; the original personal policy stays literal. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {provePinnedSourceStage8,sourceStage8Policy} from './source-stage8-activation.mjs';
import {sourceStage8HistoricalView,assertSourceStage8HeadStable} from './source-stage8.mjs';
import {accepted,verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
export const runtimeAuxiliarySource=Object.freeze({prior:Object.freeze({"path": "tests/next-cohort-20261110/source/retained-runtime.mjs", "ref": "054854bceed263ba59e8cd0052f1f3e9b1ea8e30", "blob": "99666fd1d09a2b7f782b05d4dbd9f9656be08eea", "bytes": 24134, "sha256": "a6b0b939f5e5cee3072cc2776bc3dbf6663a7c70731419a3905d7904a2f87f0c"}),current:Object.freeze({"path": "tests/next-cohort-20261110/source/retained-runtime.mjs", "ref": "2a59a85c6e935c43e9a5a71ae15c9954e4fcab42", "blob": "15ba13c6dda37bf18bb5ecee22e948daeefc4280", "bytes": 26117, "sha256": "6556bcf9ffb5bcaf7873a6d66718933343cf46c311f8895b27aee3386bcf6676"})});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(row,git){
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
 const commit=git(['cat-file','commit',row.ref]);assert(Buffer.isBuffer(commit));assert.equal(createHash('sha1').update(Buffer.from('commit '+commit.length+'\0')).update(commit).digest('hex'),row.ref);
 assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);
 const bytes=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256);return bytes;
}
export function proveRuntimeAuxiliarySuccessor({record,currentBytes,input,...extra}){
 assert.equal(Object.keys(extra).length,0,'Caller-nominated current records or proof options are forbidden');
 assert.deepEqual(record,runtimeAuxiliarySource.prior,'Only the literal personal auxiliary record may advance');
 assert.equal(typeof input?.read,'function','Explicit source reader required');assert.equal(typeof input?.git,'function','Explicit source Git required');
 const retained=sourceStage8HistoricalView(input.git);if(retained)assert.equal(input.read,retained.historicalInput.read,'Historical source reader capability differs');
 const actual=retained?.actualInput??input,root=actual.root??process.cwd();
 const before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[a-f0-9]{40}$/);
 assert.equal(sourceStage8Policy.codeRef,runtimeAuxiliarySource.current.ref);assert.equal(sourceStage8Policy.paths.length,24);
 const proof=provePinnedSourceStage8({...input,root});assert.equal(proof.actualInput.read,actual.read,'The same registered actual source reader is required');assertSourceStage8HeadStable(proof);
 verifyParallelAuthority(actual.read,actual.git);
 const authority=accepted.find(row=>row.path===runtimeAuxiliarySource.current.path);assert(authority,'Independently admitted runtime guard required');assert.equal(authority.blob,runtimeAuxiliarySource.current.blob);assert.equal(authority.sha256,runtimeAuxiliarySource.current.sha256);
 immutable(runtimeAuxiliarySource.prior,actual.git);const bytes=immutable(runtimeAuxiliarySource.current,actual.git),path=runtimeAuxiliarySource.current.path;
 assert.equal(actual.git(['rev-parse',before+':'+path]).toString().trim(),runtimeAuxiliarySource.current.blob,'Exact actual HEAD runtime object differs');
 const target=resolve(root,path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular actual runtime source required');assert.equal(realpathSync(target),target,'Redirected runtime source');
 const fresh=actual.read(path);assert(Buffer.isBuffer(fresh)&&fresh.equals(bytes)&&Buffer.isBuffer(currentBytes)&&currentBytes.equals(fresh),'Current personal auxiliary source bytes differ');
 assertSourceStage8HeadStable(proof);assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during runtime auxiliary proof');
 return true;
}
