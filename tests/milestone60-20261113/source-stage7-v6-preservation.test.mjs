import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {acceptedStage7} from '../parallel-source-20261110/authority.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalRef='f00acbfdb882688eb1d0c22bc68305eb4984ac41';
const original=path=>execFileSync('git',['show',originalRef+':'+path],{maxBuffer:32*1024*1024});
test('v6 retains qualified capture64, canonical Stage7 capture and policy byte for byte',()=>{
 for(const [path,digest] of [
 ['docs/parallel-source-20261110/capture-revision64.json','3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466'],
 ['docs/milestone60-20261113/source-stage7.json','599f8d6d88519cd0051d656dd9756b8880d19008ed5bc0f28a99ac1f1fc467a7'],
 ]){const bytes=readFileSync(path);assert.equal(hash(bytes),digest);assert(bytes.equals(original(path)));}
 const policy='tests/milestone60-20261113/source-stage7-policy.mjs';assert(readFileSync(policy).equals(original(policy)));
});
test('all66 qualified Stage7 authority records remain literal beneath the additive v6 overlay',()=>{
 const retainedPath='docs/milestone60-20261113/source-stage7-qualified-authority64.mjs';
 const retained=readFileSync(retainedPath);assert.equal(hash(retained),'c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2');assert(retained.equals(original('tests/parallel-source-20261110/authority.mjs')));
 const literal=JSON.parse(retained.toString().split('export const acceptedStage7=Object.freeze(')[1].split('\n]);')[0]+'\n]');
 assert.equal(literal.length,66);assert.deepEqual(acceptedStage7,literal);
});
