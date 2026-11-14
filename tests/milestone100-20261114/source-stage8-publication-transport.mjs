import {accepted} from '../parallel-source-20261110/authority.mjs';
import {selectStage8GuardSuccessor} from './source-stage8-guard-selection.mjs';
import {sourceStage8HistoricalView} from './source-stage8.mjs';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
/** One exact native Git transport successor; literal G2 guard policy is retained. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guardSuccessors} from './source-stage8-guard-policy.mjs';
export const publicationTransportPath='scripts/publication20-caller-lineage.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function expectedPublicationTransport(previous){
 const before="const git=args=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe']});";
 const after="const git=completionGitReader((args,options={})=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe'],...options}));";
 assert.equal(previous.split(before).length,2,'Exactly the literal G2 Git constructor is required');
 assert(!previous.includes("import {completionGitReader}"),'Transport import must be the single new import');
 const membership=" if(JSON.stringify(Object.keys(m.sourceHashes??{}).sort())!==JSON.stringify(expectedPaths))throw Error('Caller source binding membership differs');\n";
 assert.equal(previous.split(membership).length,2,'Exactly the literal source membership check is required');
 const preflight=" // Reject unsafe declared source paths before deeper successor dependencies are read.\n // This preflight grants no source/hash admission; every original proof still follows.\n for(const name of [...expectedPaths,frequencyPresentationSupplementalPath,n1PublicationSupplementalPath])safe(directory,name);\n rejectPublication20CallerEvidence(m,name=>safe(directory,name));\n";
 return "import {rejectPublication20CallerEvidence} from '../tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs';\nimport {completionGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';\n"+previous.replace(before,after).replace(membership,membership+preflight);
}
export function publicationTransportArgumentBytes(git){
 const old=guardSuccessors.find(row=>row.path===publicationTransportPath);assert(old);
 assert.equal(git(['rev-parse','--verify',old.ref+'^{commit}']).toString().trim(),old.ref);assert.equal(git(['rev-parse',old.ref+':'+old.path]).toString().trim(),old.blob);
 const bytes=git(['cat-file','blob',old.blob]);assert.equal(bytes.length,old.bytes);assert.equal(sha(bytes),old.sha256);
 return Buffer.from(expectedPublicationTransport(bytes.toString()));
}
/** Caller must first prove the complete current source and independent authority. */
export function provePublicationTransportSuccessor(git,read){
 const view=sourceStage8HistoricalView(git);if(view)assert.equal(read,view.historicalInput.read,'Historical publication source reader capability differs');const actual=view?.actualInput??{git,read,root:fileURLToPath(new URL('../../',import.meta.url))};
 const before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[0-9a-f]{40}$/);const expected=publicationTransportArgumentBytes(actual.git);
 const oldPath='docs/parallel-source-20261110/capture-revision78.json',oldPin=accepted.find(row=>row.path===oldPath);assert(oldPin,'Independent V11 publication capture required');const oldSupplied=actual.read(oldPath);assert(Buffer.isBuffer(oldSupplied));const oldCaptureBytes=Buffer.from(oldSupplied);assert.equal(sha(oldCaptureBytes),oldPin.sha256);const oldCapture=JSON.parse(oldCaptureBytes);assert(oldCapture.sourceStage8V11.guardPaths.includes(publicationTransportPath));const old=oldCapture.currentSources.find(row=>row.path===publicationTransportPath);assert(old);assert.equal(old.ref,oldCapture.sourceStage8V11.guardRef);
 assert.equal(actual.git(['rev-parse','--verify',old.ref+'^{commit}']).toString().trim(),old.ref);assert.equal(actual.git(['rev-parse',old.ref+':'+old.path]).toString().trim(),old.blob);const intermediate=actual.git(['cat-file','blob',old.blob]);assert(Buffer.isBuffer(intermediate));assert.equal(intermediate.length,old.bytes);assert.equal(sha(intermediate),old.sha256);
 const importLine="import {rejectPublication20CallerEvidence} from '../tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs';\n",callLine=' rejectPublication20CallerEvidence(m,name=>safe(directory,name));\n';assert.equal(expected.toString().split(importLine).length,2);assert.equal(expected.toString().split(callLine).length,2);assert.equal(intermediate.toString(),expected.toString().replace(importLine,'').replace(callLine,''),'Literal V11 native-only publication transport must remain proved');
 const captures=accepted.filter(row=>/^docs\/parallel-source-20261110\/capture-revision[0-9]+\.json$/.test(row.path)).sort((a,b)=>Number(/revision([0-9]+)/.exec(b.path)[1])-Number(/revision([0-9]+)/.exec(a.path)[1]));assert(captures.length>0&&captures.length<=256,'Finite independently admitted publication captures required');const pin=captures[0],supplied=actual.read(pin.path);assert(Buffer.isBuffer(supplied));const bytes=Buffer.from(supplied);assert.equal(sha(bytes),pin.sha256,'Independent current publication capture differs');
 const row=selectStage8GuardSuccessor(JSON.parse(bytes),publicationTransportPath),authority=accepted.find(record=>record.path===publicationTransportPath);assert(row&&authority);assert.equal(row.path,publicationTransportPath);assert.equal(row.blob,authority.blob);assert.equal(row.sha256,authority.sha256);assert.match(row.ref,/^[0-9a-f]{40}$/);assert(Number.isSafeInteger(row.bytes)&&row.bytes>=0);
 assert.equal(actual.git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(actual.git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert.equal(actual.git(['rev-parse',before+':'+row.path]).toString().trim(),row.blob);
 const current=actual.git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(current));assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert(current.equals(expected),'Only the exact transport and negative caller preflights may change');const target=resolve(actual.root,row.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current publication transport required');assert.equal(realpathSync(target),target,'Redirected current publication transport');assert(actual.read(row.path).equals(current),'Completion supplemental source bytes differ: '+row.path);assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during publication transport proof');return Buffer.from(current);
}
