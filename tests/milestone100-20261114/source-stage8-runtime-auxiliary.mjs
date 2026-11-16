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
export const runtimeAuxiliaryPrimePredecessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"257a18f2ebab091410129a2fcd58bd7edff843e9","blob":"92c537d1fcc2b307f1799c4b474627de49e0358b","bytes":30516,"sha256":"f9f1a86538710d60b49baa562a198226cf5f005f32e8b6c85b3bb3203ed96fb4"});
export const runtimeAuxiliaryBatchSuccessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"64c86e4fe5f77816f2b5b45ea2177ed56520b292","blob":"9994a48ea83a831a0159123da5bc377901fbe5ce","bytes":30546,"sha256":"1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"});
export const runtimeAuxiliaryNativeGitSuccessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"bdf5f656a6917c222d15daf3eef410368ea93aff","blob":"60dd2cf54efd56e9f2bcc00795a6ce3bee3e6ea4","bytes":30563,"sha256":"69e02449bb9998c985e8b4c6bc8f2d313bd018f82a4e3c1265556aa399be3433"});
export const runtimeAuxiliaryBoundedPreloadSuccessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"5f6c82af79fb2a956abaaa295bcca11f76f34ea5","blob":"0023190c2b8d8976c3cd84cedc10acb4680b1ca4","bytes":30617,"sha256":"197821d0e147369d9ac54f9df5ed3a5e25e4d6d8cc49c4f1529e039a254772b2"});
export const runtimeAuxiliaryFixtureSuccessor=Object.freeze({"path":"tests/next-cohort-20261110/source/retained-runtime.mjs","ref":"10fc06bb0d08b853876daeda639d0c5942d7259b","blob":"466445b2827f2739ace48def4eb7160800ed081d","bytes":30762,"sha256":"cba14612a3a40f341aaf3bc075a93983b74d3cd468643657ddf249f51a18c4a9"});
export const runtimeAuxiliarySupplementalRefs=Object.freeze([runtimeAuxiliaryNativeGitSuccessor.ref,runtimeAuxiliaryBoundedPreloadSuccessor.ref,runtimeAuxiliaryFixtureSuccessor.ref]);
export const runtimeAuxiliaryImmutableChain=Object.freeze([runtimeAuxiliarySource.prior,runtimeAuxiliarySource.current,runtimeAuxiliaryBatchPredecessor,runtimeAuxiliaryBoundHeadPredecessor,runtimeAuxiliaryPrimePredecessor,runtimeAuxiliaryBatchSuccessor]);
export const runtimeAuxiliaryImmutableRefs=Object.freeze([...new Set(runtimeAuxiliaryImmutableChain.map(row=>row.ref))].sort());
function preloadRuntimeAuxiliaryObjects(git){
 if(typeof git.preloadCommits==='function')git.preloadCommits(runtimeAuxiliaryImmutableRefs);
 if(typeof git.preloadPaths==='function')git.preloadPaths(runtimeAuxiliaryImmutableChain.map(({ref,path,blob})=>({ref,path,blob})));
 if(typeof git.preloadBlobs==='function')git.preloadBlobs(runtimeAuxiliaryImmutableChain.map(row=>row.blob));
}
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
 const next=runtimeAuxiliaryFixtureSuccessor;assert.equal(next.path,runtimeAuxiliarySource.current.path);
 const authority=accepted.find(row=>row.path===next.path);assert(authority,'Independently admitted runtime guard required');assert.equal(authority.blob,next.blob);assert.equal(authority.sha256,next.sha256);
 preloadRuntimeAuxiliaryObjects(actual.git);
 const originalTransport=immutable(runtimeAuxiliaryBatchSuccessor,actual.git),nativeTransport=immutable(runtimeAuxiliaryNativeGitSuccessor,actual.git);
 const oldNative=originalTransport.toString(),nativeImport="import {execNativeGit} from '../../construction-ci-recovery-20261116/native-git.mjs';\n";
 assert.equal(oldNative.split("import {execFileSync} from 'node:child_process';\n").length,2,'Exact original native Git import required');
 assert.equal(oldNative.split("execFileSync('git',").length,5,'Only four native Git calls may advance');
 const expectedNative=nativeImport+oldNative.replace("import {execFileSync} from 'node:child_process';\n",'').replaceAll("execFileSync('git',",'execNativeGit(');
 assert(nativeTransport.equals(Buffer.from(expectedNative)),'Only exact native Git transport may change; historical rows and proof checks remain literal');
 const beforeImport="import {completionGitReader} from '../../parallel-source-20261110/git-reader.mjs';",afterImport="import {boundedCompletionGitReader as completionGitReader} from '../../construction-ci-recovery-20261116/bounded-immutable-preload.mjs';";assert.equal(expectedNative.split(beforeImport).length,2,'Exact bounded preload import preimage required');assert(immutable(runtimeAuxiliaryBoundedPreloadSuccessor,actual.git).equals(Buffer.from(expectedNative.replace(beforeImport,afterImport))),'Only explicit native immutable preload may change');
 assert(immutable(next,actual.git).equals(Buffer.from(expectedNative+"\n/** Immutable fixture availability only; every current-source proof remains fresh in the caller. */\nexport function primeRuntimeImmutableFixtures(){primeRetainedImmutableObjects(readFileSync,git);}\n")), 'Only explicit immutable fixture preparation may extend native runtime');
 immutable(runtimeAuxiliarySource.prior,actual.git);immutable(runtimeAuxiliarySource.current,actual.git);immutable(runtimeAuxiliaryBatchPredecessor,actual.git);immutable(runtimeAuxiliaryBoundHeadPredecessor,actual.git);immutable(runtimeAuxiliaryPrimePredecessor,actual.git);const bytes=immutable(next,actual.git),path=next.path;
 assert.equal(actual.git(['rev-parse',before+':'+path]).toString().trim(),next.blob,'Exact actual HEAD runtime object differs');
 const target=resolve(root,path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular actual runtime source required');assert.equal(realpathSync(target),target,'Redirected runtime source');
 const fresh=actual.read(path);assert(Buffer.isBuffer(fresh)&&fresh.equals(bytes)&&Buffer.isBuffer(currentBytes)&&currentBytes.equals(fresh),'Current personal auxiliary source bytes differ');
 if(proof)assertSourceStage8HeadStable(proof);assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during runtime auxiliary proof');
 return true;
}
