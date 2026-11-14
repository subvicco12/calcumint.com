import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {assertTestOnlySuccessor as original} from '../parallel-five-20261110/test-only-successor.mjs';
import {importOnlyPredecessor,assertTestOnlySuccessor} from './source-stage8-test-only-successor.mjs';
const rows=JSON.parse(readFileSync('docs/milestone100-20261114/source-stage8.json')).rows;
const paths=['src/lib/cohort22-closure-evidence.test.ts','src/lib/first-five-engineering-evidence.test.ts'];
const claims={'src/lib/cohort22-closure-evidence.test.ts':'0618163ab6146166ca424f37dc5a2f3c3e611958f0a30046b219183bb8d6286a','src/lib/first-five-engineering-evidence.test.ts':'e5e028de15d799d60ee6ee5283ea86027e74bf4a986eaaff22949d04d51c180c'};
const input=file=>({file,row:structuredClone(rows.find(row=>row.path===file)),currentBytes:readFileSync(file),git:sourceGit});
test('both current test bodies differ from exact eac9 only by the reviewed import',async()=>{
 for(const file of paths){const args=input(file),previous=importOnlyPredecessor(args);assert(previous.equals(sourceGit(['cat-file','blob',args.row.predecessor.blob])));const prior=await original(file,claims[file],previous,sourceGit);assert.equal(prior.testOnly,true);await assert.rejects(original(file,claims[file],args.currentBytes,sourceGit));}
});
test('test body tamper, current reversion and wrong helper imports refuse',()=>{
 for(const file of paths){const args=input(file);for(const bytes of [Buffer.from('tamper'),sourceGit(['cat-file','blob',args.row.predecessor.blob]),Buffer.from(args.currentBytes.toString().replace('milestone100-20261114/receipt-source-path-stage8.mjs','unknown/helper.mjs'))])assert.throws(()=>importOnlyPredecessor({...args,currentBytes:bytes}));}
});
test('unknown test paths, false predecessor/current tuples and missing Git refuse',async()=>{
 assert.throws(()=>importOnlyPredecessor({...input(paths[0]),file:'src/lib/unknown.test.ts'}));
 for(const side of ['predecessor','current']){const args=input(paths[0]);args.row[side].blob='0'.repeat(40);assert.throws(()=>importOnlyPredecessor(args));}
 assert.throws(()=>importOnlyPredecessor({...input(paths[0]),git:()=>{throw Error('Missing immutable test provenance');}}),/Missing immutable test provenance/);
 await assert.rejects(assertTestOnlySuccessor('unknown','0'.repeat(64),Buffer.from('x'),()=>{throw Error('Unknown must not use Git');}));
});
test('wrong original F042 claims still fail the unchanged legacy verifier',async()=>{
 for(const file of paths){const previous=importOnlyPredecessor(input(file));await assert.rejects(original(file,'0'.repeat(64),previous,sourceGit));}
});
