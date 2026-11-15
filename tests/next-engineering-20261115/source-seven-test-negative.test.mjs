import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {rejectWrongSevenTestArguments} from './source-seven-test-negative.mjs';import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';import {assertSevenTestSuccessor} from '../parallel-source-20261110/core.mjs';import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';import {sourceStage10CapturePath} from './source-stage10-current-policy.mjs';
const root=process.cwd(),capturePath='docs/parallel-source-20261110/capture-revision68.json',capture=JSON.parse(readFileSync(capturePath)),input={root,read:readFileSync,git:sourceGit};
test('fixed three original claims use the latest exact current bytes and can only refuse',()=>{
 for(const row of capture.sevenTestSuccessors){const bytes=readFileSync(row.path);assert.equal(rejectWrongSevenTestArguments(input,row.path,row.predecessor.sha256,bytes),undefined);assert.throws(()=>rejectWrongSevenTestArguments(input,row.path,row.predecessor.sha256,Buffer.concat([bytes,Buffer.from('changed')])),/Exact seven-failure current test bytes required/);assert.throws(()=>rejectWrongSevenTestArguments(input,row.path,'0'.repeat(64),bytes),/Exact immutable test predecessor claim required/);}
 assert.throws(()=>rejectWrongSevenTestArguments(input,'src/lib/unknown.test.ts','0'.repeat(64),Buffer.alloc(0)),/Only three exact/);
});
test('capture substitution refuses before parsing, while opaque transports preserve full original Git-first proof',()=>{
 const row=capture.sevenTestSuccessors[0];assert.throws(()=>rejectWrongSevenTestArguments({...input,read:path=>{assert.equal(path,capturePath);return Buffer.from('malformed');}},row.path,row.predecessor.sha256,readFileSync(row.path)),/Independent current target bytes differ/);
 const git=()=>{throw Error('Opaque full source proof reached');},read=()=>{throw Error('Unexpected opaque early read');};assert.equal(rejectWrongSevenTestArguments({root,read,git},row.path,'wrong',Buffer.alloc(0)),undefined);assert.throws(()=>assertSevenTestSuccessor(row.path,'wrong',Buffer.alloc(0),read,git),/Opaque full source proof reached/);
 assert.throws(()=>assertSevenTestSuccessor(row.path,row.predecessor.sha256,readFileSync(row.path),path=>path===sourceStage10CapturePath?Buffer.from('{}'):readFileSync(path),sourceGit),/Independent Stage10 capture digest differs/);
});
test('private historical inputs retain their same actual capture reader and root bindings',()=>{
 const seen=[],read=path=>{seen.push(path);return readFileSync(path);},proof=provePinnedSourceStage8({root,read,git:sourceGit}),row=capture.sevenTestSuccessors[0];seen.length=0;
 assert.equal(rejectWrongSevenTestArguments(proof.historicalInput,row.path,row.predecessor.sha256,readFileSync(row.path)),undefined);assert.deepEqual(seen,[capturePath]);seen.length=0;
 assert.throws(()=>rejectWrongSevenTestArguments({...proof.historicalInput,read:readFileSync},row.path,'wrong',Buffer.alloc(0)),/Historical Stage8 reader capability differs/);assert.equal(seen.length,0);
 assert.throws(()=>rejectWrongSevenTestArguments({...proof.historicalInput,root:root+'/other'},row.path,'wrong',Buffer.alloc(0)),/Historical Stage8 root differs/);assert.equal(seen.length,0);
});
