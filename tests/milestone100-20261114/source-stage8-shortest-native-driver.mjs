/** Exact one-path native immutable transport relation; original guard5 stays literal. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {accepted} from '../parallel-source-20261110/authority.mjs';
import {guardSuccessors} from './source-stage8-guard-policy.mjs';
import {selectStage8GuardSuccessor} from './source-stage8-guard-selection.mjs';
import {sourceStage8HistoricalView} from './source-stage8.mjs';
export const shortestNativeDriverPath='scripts/check-shortest-publication20.mjs';
const driverRoot=fileURLToPath(new URL('../../',import.meta.url)),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function expectedShortestNativeDriver(previous){
 const before="const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});",after="const immutableNativeGit=makeGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],...options}));\nconst git=immutableNativeGit;";
 assert.equal(previous.split(before).length,2,'Exactly the literal G2 checker constructor is required');assert(!previous.includes('import {makeGitReader}'),'Only one new checker transport import is allowed');
 return "import {makeGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';\n"+previous.replace(before,after);
}
export function shortestNativeArgumentBytes(git){
 const old=guardSuccessors.find(row=>row.path===shortestNativeDriverPath);assert(old,'Literal shortest checker guard required');assert.equal(old.ref,'11d38597565922ac12d1a06678288ee7d6daf863');
 assert.equal(git(['rev-parse','--verify',old.ref+'^{commit}']).toString().trim(),old.ref);assert.equal(git(['rev-parse',old.ref+':'+old.path]).toString().trim(),old.blob);
 const bytes=git(['cat-file','blob',old.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,old.bytes);assert.equal(sha(bytes),old.sha256);return Buffer.from(expectedShortestNativeDriver(bytes.toString()));
}
/** The adapter must first execute its unchanged full current-source and authority proofs. */
export function proveShortestNativeDriverSuccessor(git,read){
 const view=sourceStage8HistoricalView(git);if(view)assert.equal(read,view.historicalInput.read,'Historical shortest source reader capability differs');
 const actual=view?.actualInput??{git,read,root:driverRoot},before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[0-9a-f]{40}$/);
 const expected=shortestNativeArgumentBytes(actual.git),captures=accepted.filter(row=>/^docs\/parallel-source-20261110\/capture-revision[0-9]+\.json$/.test(row.path)).sort((a,b)=>Number(/revision([0-9]+)/.exec(b.path)[1])-Number(/revision([0-9]+)/.exec(a.path)[1]));assert(captures.length>0&&captures.length<=256,'Finite independently admitted current captures required');assert.equal(new Set(captures.map(row=>row.path)).size,captures.length);
 const nominated=captures[0],supplied=actual.read(nominated.path);assert(Buffer.isBuffer(supplied));const captureBytes=Buffer.from(supplied);assert.equal(sha(captureBytes),nominated.sha256,'Independent current checker capture differs');
 const row=selectStage8GuardSuccessor(JSON.parse(captureBytes),shortestNativeDriverPath),authority=accepted.find(record=>record.path===shortestNativeDriverPath);assert(row&&authority,'Independently admitted shortest checker required');assert.equal(row.path,shortestNativeDriverPath);assert.equal(row.blob,authority.blob);assert.equal(row.sha256,authority.sha256);assert.match(row.ref,/^[0-9a-f]{40}$/);assert.match(row.blob,/^[0-9a-f]{40}$/);assert(Number.isSafeInteger(row.bytes)&&row.bytes>=0);
 assert.equal(actual.git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(actual.git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert.equal(actual.git(['rev-parse',before+':'+row.path]).toString().trim(),row.blob);
 const current=actual.git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(current));assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert(current.equals(expected),'Only the exact shortest checker native transport may change');
 const path=resolve(actual.root??driverRoot,row.path),stat=lstatSync(path);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current shortest checker required');assert.equal(realpathSync(path),path,'Redirected current shortest checker');const fresh=actual.read(row.path);assert(Buffer.isBuffer(fresh)&&fresh.equals(current),'Completion supplemental source bytes differ: '+row.path);
 assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during shortest native driver proof');return Buffer.from(current);
}

export const shortestNativeTestRecords=Object.freeze([
 Object.freeze({path:'tests/shortest-publication-20/completion-lineage.test.mjs',ref:'80d18305104a9db4a015ea26199f8b916370467c',blob:'fc1cb0e2caabcd7ca814d3f2305833e802f23ef5',bytes:1952,sha256:'af234ca45348e71d04d046af11de30db5119f84f0f71191ed4c413d300559468'}),
 Object.freeze({path:'tests/shortest-publication-20/frequency-presentation-lineage.test.mjs',ref:'11d38597565922ac12d1a06678288ee7d6daf863',blob:'fbf6102cc8f77dca994545119895428edf148a01',bytes:1506,sha256:'54f259f8ff069eb2aae5e04f4006659d603df7de47c5646d3aace4ff9fba4151'})
]);
export function expectedShortestNativeTest(file,previous){
 assert(shortestNativeTestRecords.some(row=>row.path===file),'Only two exact shortest test transports may advance');
 const before=file.endsWith('/frequency-presentation-lineage.test.mjs')?"const git=args=>execFileSync('git',args);":"const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});";
 assert.equal(previous.split(before).length,2,'Exactly the literal shortest test constructor is required');assert(!previous.includes('import {makeGitReader}'),'Only one new shortest test transport import is allowed');
 const after=file.endsWith('/frequency-presentation-lineage.test.mjs')?"const immutableNativeGit=makeGitReader((args,options={})=>execFileSync('git',args,{...options}));\nconst git=immutableNativeGit;":"const immutableNativeGit=makeGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],...options}));\nconst git=immutableNativeGit;";
 return "import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';\n"+previous.replace(before,after);
}
function proveShortestNativeTestBytes(file,expected,git,read){
 assert(shortestNativeTestRecords.some(row=>row.path===file),'Only two exact shortest test transports may advance');const shortestNativeDriverPath=file;
 const view=sourceStage8HistoricalView(git);if(view)assert.equal(read,view.historicalInput.read,'Historical shortest source reader capability differs');
 const actual=view?.actualInput??{git,read,root:driverRoot},before=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(before,/^[0-9a-f]{40}$/);
 const captures=accepted.filter(row=>/^docs\/parallel-source-20261110\/capture-revision[0-9]+\.json$/.test(row.path)).sort((a,b)=>Number(/revision([0-9]+)/.exec(b.path)[1])-Number(/revision([0-9]+)/.exec(a.path)[1]));assert(captures.length>0&&captures.length<=256,'Finite independently admitted current captures required');assert.equal(new Set(captures.map(row=>row.path)).size,captures.length);
 const nominated=captures[0],supplied=actual.read(nominated.path);assert(Buffer.isBuffer(supplied));const captureBytes=Buffer.from(supplied);assert.equal(sha(captureBytes),nominated.sha256,'Independent current checker capture differs');
 const row=selectStage8GuardSuccessor(JSON.parse(captureBytes),shortestNativeDriverPath),authority=accepted.find(record=>record.path===shortestNativeDriverPath);assert(row&&authority,'Independently admitted shortest checker required');assert.equal(row.path,shortestNativeDriverPath);assert.equal(row.blob,authority.blob);assert.equal(row.sha256,authority.sha256);assert.match(row.ref,/^[0-9a-f]{40}$/);assert.match(row.blob,/^[0-9a-f]{40}$/);assert(Number.isSafeInteger(row.bytes)&&row.bytes>=0);
 assert.equal(actual.git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(actual.git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert.equal(actual.git(['rev-parse',before+':'+row.path]).toString().trim(),row.blob);
 const current=actual.git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(current));assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert(current.equals(expected),'Only the exact shortest checker native transport may change');
 const path=resolve(actual.root??driverRoot,row.path),stat=lstatSync(path);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current shortest checker required');assert.equal(realpathSync(path),path,'Redirected current shortest checker');const fresh=actual.read(row.path);assert(Buffer.isBuffer(fresh)&&fresh.equals(current),'Completion supplemental source bytes differ: '+row.path);
 assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),before,'Actual HEAD moved during shortest native driver proof');return Buffer.from(current);
}
export function shortestNativeSupplementalPredecessor(file,git,read){
 const row=shortestNativeTestRecords.find(row=>row.path===file);assert(row,'Only two exact shortest test transports may advance');
 const view=sourceStage8HistoricalView(git);if(view)assert.equal(read,view.historicalInput.read,'Historical shortest source reader capability differs');const actual=view?.actualInput??{git,read};
 assert.equal(actual.git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(actual.git(['rev-parse',row.ref+':'+file]).toString().trim(),row.blob);
 const supplied=actual.git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(supplied));const previous=Buffer.from(supplied);assert.equal(previous.length,row.bytes);assert.equal(sha(previous),row.sha256);
 proveShortestNativeTestBytes(file,Buffer.from(expectedShortestNativeTest(file,previous.toString())),git,read);return Buffer.from(previous);
}

/** Negative-only counterexample pin from immutable capture68, not a new current-source verdict. */
export const shortestCallerArgumentRecord=Object.freeze({path:'src/components/calculator-interactive.tsx',ref:'25b56970c05aaffaad2dd856809aaf077ab70554',blob:'db0c1d614cbafbc9468bafdd1fda5f064176fcad',bytes:202736,sha256:'017a01294f2980d25deca43ff8dddb9ab6ea87ec1271dcb4755e91223ec8d142'});
export function rejectShortestCallerArgument(name,bytes,git){
 if(name!==shortestCallerArgumentRecord.path||sourceStage8HistoricalView(git))return;
 assert(Buffer.isBuffer(bytes)&&bytes.length===shortestCallerArgumentRecord.bytes&&sha(bytes)===shortestCallerArgumentRecord.sha256,'Completion current successor differs');
}
