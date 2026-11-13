import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {acceptedStage7,acceptedStage7V6,acceptedStage7V7} from '../parallel-source-20261110/authority.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalRef='f00acbfdb882688eb1d0c22bc68305eb4984ac41';
const original=path=>execFileSync('git',['show',originalRef+':'+path],{maxBuffer:32*1024*1024});
test('v6 retains qualified capture64, canonical Stage7 capture and policy byte for byte',()=>{
 for(const [path,digest] of [
 ['docs/parallel-source-20261110/capture-revision64.json','3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466'],
 ['docs/milestone60-20261113/source-stage7.json','599f8d6d88519cd0051d656dd9756b8880d19008ed5bc0f28a99ac1f1fc467a7'],
 ]){const bytes=readFileSync(path);assert.equal(hash(bytes),digest);assert(bytes.equals(original(path)));}
 const policy='tests/milestone60-20261113/source-stage7-policy.mjs';assert(readFileSync(policy).equals(original(policy)));
 const retained65='docs/parallel-source-20261110/capture-revision65.json',bytes65=readFileSync(retained65);assert.equal(hash(bytes65),'ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c');assert(bytes65.equals(execFileSync('git',['show','49cac9941e81646aca6ef4a7e70acd7374e15d92:'+retained65],{maxBuffer:32*1024*1024})));
 const retained66='docs/parallel-source-20261110/capture-revision66.json',bytes66=readFileSync(retained66);assert.equal(hash(bytes66),'d7ef794bebb51be6d27cd17432db51ee13fd73d19c47ab9f6e53740de06a4a4b');assert(bytes66.equals(execFileSync('git',['show','36434788baf38632ca6e04d9b8867dc92e7ef1b8:'+retained66],{maxBuffer:32*1024*1024})));
 const policyV6='tests/milestone60-20261113/source-stage7-policy-v6.mjs';assert(readFileSync(policyV6).equals(execFileSync('git',['show','49cac9941e81646aca6ef4a7e70acd7374e15d92:'+policyV6],{maxBuffer:32*1024*1024})));
});
test('all66 qualified Stage7 authority records remain literal beneath the additive v6 overlay',()=>{
 const retainedPath='docs/milestone60-20261113/source-stage7-qualified-authority64.mjs';
 const retained=readFileSync(retainedPath);assert.equal(hash(retained),'c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2');assert(retained.equals(original('tests/parallel-source-20261110/authority.mjs')));
 const literal=JSON.parse(retained.toString().split('export const acceptedStage7=Object.freeze(')[1].split('\n]);')[0]+'\n]');
 assert.equal(literal.length,66);assert.deepEqual(acceptedStage7,literal);
 const retained65=readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority65.mjs');assert.equal(hash(retained65),'7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691');assert(retained65.equals(execFileSync('git',['show','49cac9941e81646aca6ef4a7e70acd7374e15d92:tests/parallel-source-20261110/authority.mjs'],{maxBuffer:32*1024*1024})));
 const literal75=JSON.parse(retained65.toString().split('export const acceptedStage7V6=Object.freeze(')[1].split('\n]);')[0]+'\n]');assert.equal(literal75.length,75);assert.deepEqual(acceptedStage7V6,literal75);
 const retained66=readFileSync('docs/milestone60-20261113/source-stage7-qualified-authority66.mjs');assert.equal(hash(retained66),'6d7592f29200b26a498c333b0876452fe9a305660d9caf245b72243ac9d232e2');assert(retained66.equals(execFileSync('git',['show','36434788baf38632ca6e04d9b8867dc92e7ef1b8:tests/parallel-source-20261110/authority.mjs'],{maxBuffer:32*1024*1024})));
 const literal79=JSON.parse(retained66.toString().split('export const acceptedStage7V7=Object.freeze(')[1].split('\n]);')[0]+'\n]');assert.equal(literal79.length,79);assert.deepEqual(acceptedStage7V7,literal79);
});
