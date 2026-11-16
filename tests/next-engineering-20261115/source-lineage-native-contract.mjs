/** One exact fixture successor; the original five supplemental guard tuples stay literal. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {accepted,acceptedStage10FixtureBindings} from '../parallel-source-20261110/authority.mjs';
import {guardSuccessors} from '../milestone100-20261114/source-stage8-guard-policy.mjs';
import {sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';

export const lineageNativePath='tests/execution-recovery-20261109/source-lineage.test.mjs';
export const lineageNativeCapturePath='docs/next-engineering-20261115/source/guard-capture-fixture-bindings.json';
export const lineageNativePredecessor=Object.freeze({path:lineageNativePath,ref:'11d38597565922ac12d1a06678288ee7d6daf863',blob:'32eee95f25bc65b45bebca56ba9c257be916c918',bytes:3120,sha256:'525b189319aea2f96d44b8277a1cfa5561dbff2ed8696d4b2427be726446cc80'});
export const lineageNativeCurrent=Object.freeze({path:lineageNativePath,ref:'99e7bd0de151456e78fe49dfbf55511e7df98c5f',blob:'6df550e6f20142ce54abb61d6054eed96d19749b',bytes:3233,sha256:'c9c38742eb1b0c714dbce70d82401eb504510406f2caa8c562f23d21721ccefc'});
const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const captureRef='1369c6d81f13ad1866c991b1ca53c6ff287a13c1';
const capturePin=Object.freeze({path:lineageNativeCapturePath,blob:'e7a3418e2ca5eab3b51f902138f517e3b218aeb0',sha256:'137bdb62b7fe11ff609b3121c74cc6ef9ec9ef280a80de337970e53dd31eab59'});
const ownerPaths=Object.freeze(['scripts/fetch-source-lineage.mjs',lineageNativePath,'tests/milestone100-20261114/source-preflight-stage8.mjs','tests/milestone100-20261114/source-stage8-guard-selection.test.mjs','tests/milestone100-20261114/source-stage8-runtime-current-selection.mjs','tests/milestone100-20261114/source-stage8-runtime-current-selection.test.mjs','tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs','tests/next-engineering-20261115/source-admission-fixture-bindings.mjs','tests/next-engineering-20261115/source-availability.test.mjs','tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs','tests/next-engineering-20261115/source-lineage-fixture.test.mjs','tests/parallel-source-20261110/bootstrap.mjs','tests/parallel-source-20261110/core.mjs']);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(row,git){
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref,'Exact lineage immutable commit differs');
 assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob,'Exact lineage immutable path differs');
 const supplied=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(supplied));const bytes=Buffer.from(supplied);
 assert.equal(bytes.length,row.bytes,'Exact lineage immutable length differs');assert.equal(sha(bytes),row.sha256,'Exact lineage immutable digest differs');
 assert.equal(createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),row.blob,'Exact lineage object address differs');return bytes;
}
function physical(path,expected){
 const target=resolve(root,path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current lineage source required');
 assert.equal(realpathSync(target),target,'Redirected current lineage source');assert(readFileSync(target).equals(expected),'Physical current lineage bytes differ');
}
export function expectedLineageNativeFixture(previous){
 assert.equal(typeof previous,'string');assert.equal(sha(Buffer.from(previous)),lineageNativePredecessor.sha256,'Literal lineage fixture predecessor required');
 const before="const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});",after="const git=makeGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],...options}));";
 const anchor="import {verifyCompletionBinding} from '../../scripts/product-completion-stage8.mjs';\n";
 assert.equal(previous.split(before).length,2);assert.equal(previous.split(anchor).length,2);assert(!previous.includes('import {makeGitReader}'));
 return previous.replace(anchor,anchor+"import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';\n").replace(before,after);
}
/** Argument bytes only; no current-source or publication capability is granted. */
export function lineageNativeArgumentBytes(git){
 assert.equal(arguments.length,1,'Only explicit lineage Git is allowed');assert.equal(typeof git,'function');
 assert.deepEqual(guardSuccessors.find(row=>row.path===lineageNativePath),lineageNativePredecessor,'Literal lineage guard5 tuple differs');
 return Buffer.from(expectedLineageNativeFixture(immutable(lineageNativePredecessor,git).toString()));
}
/** The caller must first execute its unchanged complete current-source and authority proofs. */
export function proveLineageNativeSuccessor(git,read){
 assert.equal(arguments.length,2,'Only explicit lineage Git/read inputs allowed');assert.equal(typeof git,'function');assert.equal(typeof read,'function');
 const view=sourceStage8HistoricalView(git);if(view)assert.equal(read,view.historicalInput.read,'Historical lineage reader capability differs');
 const actual=view?.actualInput??{git,read,root};assert.equal(resolve(actual.root??root),root,'Actual lineage root differs');
 assert.equal(realpathSync(process.cwd()),root,'Actual lineage workspace root required');
 assert.equal(resolve(actual.git(['rev-parse','--show-toplevel']).toString().trim()),root,'Actual lineage Git root differs');
 const head=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 const expected=lineageNativeArgumentBytes(actual.git);
 assert.deepEqual(acceptedStage10FixtureBindings.filter(row=>row.path===lineageNativeCapturePath),[capturePin],'Independent retained1369 lineage capture required');
 const supplied=actual.read(lineageNativeCapturePath);assert(Buffer.isBuffer(supplied));const captureBytes=Buffer.from(supplied);
 assert.equal(sha(captureBytes),capturePin.sha256,'Independent current lineage capture differs');
 // Fixed digest is checked before parsed fields may select any dependency or Git identity.
 const capture=JSON.parse(captureBytes),owner=capture.sourceStage10FixtureBindings;
 assert.equal(owner.guardRef,lineageNativeCurrent.ref,'Exact lineage capture owner differs');assert.deepEqual(owner.guardPaths,ownerPaths,'Exact lineage owner roster differs');
 assert(Array.isArray(capture.currentSources)&&capture.currentSources.length===1294,'Exact retained1369 lineage roster required');
 assert.equal(new Set(capture.currentSources.map(row=>row.path)).size,capture.currentSources.length,'Unique lineage capture paths required');
 assert.deepEqual(capture.currentSources.filter(row=>row.path===lineageNativePath),[lineageNativeCurrent],'Exact captured lineage tuple differs');
 const authority={path:lineageNativePath,blob:lineageNativeCurrent.blob,sha256:lineageNativeCurrent.sha256};
 assert.deepEqual(acceptedStage10FixtureBindings.filter(row=>row.path===lineageNativePath),[authority],'Fixed lineage authority differs');
 assert.deepEqual(accepted.filter(row=>row.path===lineageNativePath),[authority],'Current lineage authority differs');
 assert.equal(actual.git(['rev-parse','--verify',captureRef+'^{commit}']).toString().trim(),captureRef,'Exact lineage capture commit differs');
 assert.equal(actual.git(['rev-parse',captureRef+':'+lineageNativeCapturePath]).toString().trim(),capturePin.blob,'Exact lineage capture object differs');
 const retained=actual.git(['cat-file','blob',capturePin.blob]);assert(Buffer.isBuffer(retained)&&retained.equals(captureBytes),'Retained1369 lineage capture bytes differ');physical(lineageNativeCapturePath,captureBytes);
 const current=immutable(lineageNativeCurrent,actual.git);assert(current.equals(expected),'Only the exact lineage native fixture may change');
 assert.equal(actual.git(['rev-parse',head+':'+lineageNativePath]).toString().trim(),lineageNativeCurrent.blob,'Actual current lineage HEAD object differs');
 const fresh=actual.read(lineageNativePath);assert(Buffer.isBuffer(fresh)&&fresh.equals(current),'Completion supplemental source bytes differ: '+lineageNativePath);physical(lineageNativePath,current);
 assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),head,'Actual HEAD moved during lineage native fixture proof');
 return Buffer.from(current);
}
