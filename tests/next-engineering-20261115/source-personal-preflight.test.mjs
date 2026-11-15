import {proveNamedCurrentContext} from '../parallel-source-20261110/core.mjs';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {rejectChangedPersonalWorkflowSourceBytes} from '../completion-first-20261112/personal-stage.mjs';
const personal='src/components/calculator-factory-persisted-scenario.tsx',workflow='src/lib/native-delivery/technology-five-job-storage.ts',ns='tests/gotrue-runtime/acceptance.mjs';
test('fixed53 negative preflight accepts actual current bytes without returning a proof or invoking Git',()=>{
 assert.equal(rejectChangedPersonalWorkflowSourceBytes(readFileSync),undefined);
 assert.equal(rejectChangedPersonalWorkflowSourceBytes(readFileSync,personal,readFileSync(personal)),undefined);
});
test('personal workflow and NS byte substitutions retain their exact diagnostic before positive source proof',()=>{
 for(const path of [personal,workflow,ns])assert.throws(()=>rejectChangedPersonalWorkflowSourceBytes(name=>name===path?Buffer.from('altered bytes'):readFileSync(name)),error=>error.message===(path.startsWith('src/')?'Current factory bytes differ: ':'Current NS source bytes differ: ')+path);
});
test('known wrong current argument bytes reject and unknown argument paths retain the full-proof fallback',()=>{
 assert.throws(()=>rejectChangedPersonalWorkflowSourceBytes(readFileSync,workflow,Buffer.from('wrong entered bytes')),/Current named application successor differs/);
 assert.equal(rejectChangedPersonalWorkflowSourceBytes(readFileSync,'undeclared/argument',Buffer.from('not a verdict')),undefined);
});

test('raw opaque transport keeps Git-first refusal without invoking a supplied read',()=>{
 let reads=0;assert.throws(()=>proveNamedCurrentContext(()=>{reads++;throw Error('Unexpected opaque read');},()=>{throw Error('Opaque provenance refusal');}),/Opaque provenance refusal/);assert.equal(reads,0);
});
test('memoized reader tamper rejects early while valid bytes still execute the complete positive proof',()=>{
 let queries=0;const git=completionGitReader(()=>{queries++;throw Error('Original positive source proof reached Git');});
 assert.throws(()=>proveNamedCurrentContext(path=>path===personal?Buffer.from('tampered personal source'):readFileSync(path),git),error=>error.message==='Current factory bytes differ: '+personal);assert.equal(queries,0);
 assert.throws(()=>proveNamedCurrentContext(readFileSync,git),/Original positive source proof reached Git/);assert(queries>0);
});
