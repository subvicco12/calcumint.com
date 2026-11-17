import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {expectedStage8PreflightSource,proveSourcePreflightAndHistoricalInputs} from './source-preflight-stage8.mjs';
const old='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8',path='scripts/fetch-source-lineage.mjs';
test('preflight successor changes only the exact policy import and finite ancestry union',()=>{
 assert.equal(expectedStage8PreflightSource(sourceGit(['show',old+':'+path]).toString()),readFileSync(path,'utf8'));
 for(const text of ['unrelated',''])assert.throws(()=>expectedStage8PreflightSource(text),/Exact retained preflight insertion/);
});
test('all five original bootstrap assertions remain literal below a single import successor',()=>{
 const name='tests/source-lineage-bootstrap.test.mjs',before=sourceGit(['show',old+':'+name]).toString(),from="'./completion-wave-20261113/source-preflight-stage.mjs'",to="'./milestone100-20261114/source-preflight-stage8.mjs'";
 assert.equal(before.split(from).length,2);assert.equal(readFileSync(name,'utf8'),before.replace(from,to));
 assert(readFileSync('tests/completion-wave-20261113/source-preflight-stage.mjs').equals(sourceGit(['show',old+':tests/completion-wave-20261113/source-preflight-stage.mjs'])));
});
// Integration cases execute only after exact G7/A6 admission has been installed.
test('current preflight and original five-case audit both execute before historical projection',()=>{
 const result=proveSourcePreflightAndHistoricalInputs({read:readFileSync,git:sourceGit});assert.equal(result.literalAuditRef,old);assert.equal(result.retainedAuditIsCurrentExecution,false);assert.equal(result.livePaths.length,2);
 assert.notEqual(result.historicalInput.read(path).toString(),readFileSync(path,'utf8'));
});
test('current preflight rejects original-valid reversion, tamper and missing immutable Git proof',()=>{
 for(const bytes of [sourceGit(['show',old+':'+path]),Buffer.from('tamper')])assert.throws(()=>proveSourcePreflightAndHistoricalInputs({read:name=>name===path?bytes:readFileSync(name),git:sourceGit}),/current bootstrap source bytes differ/);
 assert.throws(()=>proveSourcePreflightAndHistoricalInputs({read:readFileSync,git:()=>{throw Error('Missing exact bootstrap Git proof');}}),/Missing exact bootstrap Git proof/);
});
