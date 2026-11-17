import {verifyCurrentRuntimeContext} from '../next-cohort-20261110/source/retained-runtime.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyParallelSource,capturePath,assertSevenTestSuccessor,sevenTestPaths} from './core.mjs';
import {sourceGit} from './baseline-runtime.mjs';
import {verifyComposition} from '../parallel-five-20261110/verify-composition.mjs';
const predecessor='cef0352fca135b252b981b959c3529170b1f0c81',app='25b56970c05aaffaad2dd856809aaf077ab70554',historical='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
test('the exact reviewed final-two app is current while mathematical engines remain immutable',()=>{
 assert.equal(sourceGit(['rev-parse','HEAD:src/components/calculator-interactive.tsx']).toString().trim(),sourceGit(['rev-parse',app+':src/components/calculator-interactive.tsx']).toString().trim());
 assert.equal(sourceGit(['diff','--name-only',predecessor,app,'--','src/calculators']).toString().trim(),'');
 assert.equal(verifyParallelSource(),true);
 for(const file of sevenTestPaths){const before=file==='src/lib/thirteen-program-evidence.test.ts'?'05129e2a74e70e23160578c63a984c4bf035ed0f':historical;const bytes=readFileSync(file),old=sourceGit(['show',before+':'+file]);const record=JSON.parse(readFileSync(capturePath)).sevenTestSuccessors.find(r=>r.path===file);assert.equal(assertSevenTestSuccessor(file,record.predecessor.sha256,bytes).testOnly,true);assert.throws(()=>assertSevenTestSuccessor(file,record.predecessor.sha256,old));assert.throws(()=>assertSevenTestSuccessor(file,'0'.repeat(64),bytes));assert.throws(()=>assertSevenTestSuccessor(file,record.predecessor.sha256,Buffer.concat([bytes,Buffer.from('unreviewed')])));}
 assert.throws(()=>assertSevenTestSuccessor('src/lib/unknown.test.ts','0'.repeat(64),Buffer.from('')));
 for(const file of ['tests/next-cohort-20261110/source/retained-runtime.mjs','tests/next-cohort-20261110/source/runtime-current-anchor.mjs']){const current=readFileSync(file,'utf8'),original=sourceGit(['show',predecessor+':'+file]).toString();const start=file.endsWith('retained-runtime.mjs')?'const prior=':'const fixed=';const end=file.endsWith('retained-runtime.mjs')?'const immutableObjects=':'const sourceGit=';assert.equal(current.slice(current.indexOf(start),current.indexOf(end)),original.slice(original.indexOf(start),original.indexOf(end)),'Original historical rows and fixed records remain byte-identical');}
});
test('original valid F042 application bytes cannot masquerade as the new current app',()=>{
 const path='src/components/calculator-interactive.tsx',old=sourceGit(['show',historical+':'+path]);assert.throws(()=>verifyCurrentRuntimeContext(name=>name===path?old:readFileSync(name)),/current context target differs/);
 assert.throws(()=>verifyParallelSource(name=>name===path?old:readFileSync(name)),/Current target source differs|Independent current target bytes differ/);
});
test('the newly introduced native catalog is a live source requirement, not an unbound addition',()=>{
 const path='src/lib/native-delivery/technology-final-two-catalog.ts';
 assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('export const technologyFinalTwoCatalog=[];'):readFileSync(name)),/Current target source differs|Independent current target bytes differ/);
});
test('coordinated app succession nomination cannot replace the independently fixed capture',()=>{
 const altered=JSON.parse(readFileSync(capturePath));altered.applicationSuccessorRef='0'.repeat(40);
 assert.throws(()=>verifyParallelSource(name=>name===capturePath?Buffer.from(JSON.stringify(altered)):readFileSync(name)),/Independent current target bytes differ/);
});
test('current mathematical dependencies outside the approved app delta remain checked',()=>{
 const path='src/calculators/technology-computing/catalog-batch-1.ts';
 assert.throws(()=>verifyParallelSource(name=>name===path?Buffer.from('export const definitions=[];'):readFileSync(name)),/Current target source differs|Independent current target bytes differ/);
});
test('mutable current-source cleanliness is rechecked rather than cached as an immutable object',()=>{
 let statuses=0,dirty=false;const git=args=>args[0]==='status'?(statuses++,Buffer.from(dirty?'?? src/app/unreviewed/route.ts\n':'')):sourceGit(args);
 assert.equal(verifyParallelSource(readFileSync,git),true);
 const firstReads=statuses;assert(firstReads>=2,'Every fresh status read in the first invocation must remain clean');dirty=true;
 assert.throws(()=>verifyParallelSource(readFileSync,git),/Committed current src required/);
 assert(statuses>firstReads,'The next invocation must read current cleanliness again');
});
test('retained genuine artifacts keep their original application claim and disclose the current successor',async()=>{
 const result=await verifyComposition();assert.equal(result.downloads,95);assert.equal(result.recordedApplicationGit,historical);assert.equal(result.currentApplicationGit,app);assert.equal(result.currentApplicationIdenticalToRecorded,false);assert.equal(result.retainedArtifactsAreFreshCurrentExecution,false);assert.equal(result.priorFailedRunPromoted,false);
});
