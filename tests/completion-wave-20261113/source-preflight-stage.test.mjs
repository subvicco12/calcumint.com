import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
import{sourceGit as git}from'../parallel-source-20261110/baseline-runtime.mjs';
import{proveSourcePreflightAndHistoricalInputs as prove,expectedPreflightSource,expectedPreflightAudit}from'./source-preflight-stage.mjs';
import{sourcePreflightPolicy as policy,sourcePreflightCapturePath}from'./source-preflight-policy.mjs';
const script='scripts/fetch-source-lineage.mjs',audit='tests/source-lineage-bootstrap.test.mjs',input={read:readFileSync,git};
test('only exact two-line script and minimal historical audit wrapper derive from immutable predecessor',()=>{
 for(const[path,derive]of[[script,expectedPreflightSource],[audit,expectedPreflightAudit]]){const old=git(['show',policy.predecessorRef+':'+path]).toString();assert.equal(readFileSync(path,'utf8'),derive(old));assert.throws(()=>derive(old.replace('import {','import altered {')));}
});
test('both current paths prove before two historical inputs; unknown read and Git requests remain live',()=>{
 const marked=path=>path==='unknown-retained-input'?Buffer.from('delegated'):readFileSync(path);const p=prove({...input,read:marked});assert.deepEqual(p.livePaths,[script,audit]);for(const path of p.livePaths){assert(p.historicalInput.read(path).equals(git(['show',policy.predecessorRef+':'+path])));assert.equal(p.historicalInput.git(['rev-parse','HEAD:'+path]).toString().trim(),git(['rev-parse',policy.predecessorRef+':'+path]).toString().trim());}
 assert.equal(p.historicalInput.read('unknown-retained-input').toString(),'delegated');assert(p.historicalInput.git(['rev-parse','HEAD:src/calculators/registry.ts']).equals(git(['rev-parse','HEAD:src/calculators/registry.ts'])));assert(p.historicalInput.git(['rev-parse','--verify','HEAD^{commit}']).equals(git(['rev-parse','--verify','HEAD^{commit}'])));
});
test('old-valid reversion and arbitrary current substitutions remain rejected after a successful proof',()=>{
 prove(input);for(const path of[script,audit])for(const bytes of[git(['show',policy.predecessorRef+':'+path]),Buffer.from('tampered bootstrap')])assert.throws(()=>prove({...input,read:name=>name===path?bytes:readFileSync(name)}),/current bootstrap source bytes differ/);
});
test('current HEAD path substitution, raw commit corruption, capture edit and missing Git fail closed',()=>{
 for(const path of[script,audit])assert.throws(()=>prove({...input,git:args=>args[0]==='rev-parse'&&args[1]==='HEAD:'+path?Buffer.from('0'.repeat(40)+'\n'):git(args)}),/Exact current HEAD source object differs/);
 assert.throws(()=>prove({...input,git:args=>args[0]==='cat-file'&&args[1]==='commit'?Buffer.from('substituted commit'):git(args)}),/commit content address differs/);assert.throws(()=>prove({...input,read:path=>path===sourcePreflightCapturePath?Buffer.from('{}'):readFileSync(path)}),/capture digest differs/);assert.throws(()=>prove({...input,git:()=>{throw Error('Missing exact bootstrap Git proof');}}),/Missing exact bootstrap Git proof/);
});
test('central authority receives original current inputs before granting any historical projection',()=>{
 prove(input);const path='tests/parallel-source-20261110/core.mjs';assert.throws(()=>prove({...input,read:name=>name===path?Buffer.from('changed actual proof core'):readFileSync(name)}),/Independent current target bytes differ/);
});
