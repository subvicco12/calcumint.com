import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {rejectChangedKnownStage5Source} from './source-stage5-negative-current.mjs';import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {appStage5Policy} from '../completion-wave-20261113/source-app-stage5-policy.mjs';import {accepted} from '../parallel-source-20261110/authority.mjs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';import {sourceStage10CapturePath} from './source-stage10-current-policy.mjs';
import {proveCurrentAppStage5AndHistoricalInputs} from '../completion-wave-20261113/source-test-stage6.mjs';
const root=process.cwd();
test('only known actual Stage5 bytes refuse early and opaque transports retain their original proof entry',()=>{
 const paths=appStage5Policy.paths.filter(path=>accepted.some(row=>row.path===path));assert.equal(paths.length,16);const seen=[];
 assert.equal(rejectChangedKnownStage5Source({root,git:sourceGit,read:path=>{seen.push(path);return readFileSync(path);}}),undefined);assert.deepEqual(seen,paths);
 const path=paths[0];assert.throws(()=>rejectChangedKnownStage5Source({root,git:sourceGit,read:file=>file===path?Buffer.from('changed'):readFileSync(file)}),error=>error.message==='Current factory bytes differ: '+path);
 const git=()=>{throw Error('Original opaque Git proof reached');},read=()=>{throw Error('Unexpected early opaque read');};assert.equal(rejectChangedKnownStage5Source({root,git,read}),undefined);assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({root,git,read}),/Original opaque Git proof reached/);
});
test('valid Stage5 negatives never grant admission and still reach the complete supplied source proof',()=>{
 assert.throws(()=>rejectChangedKnownStage5Source({root:root+'/other',git:sourceGit,read:()=>{throw Error('Unexpected redirected read');}}),/Actual workspace root required/);
 assert.throws(()=>proveCurrentAppStage5AndHistoricalInputs({root,git:sourceGit,read:path=>path===sourceStage10CapturePath?Buffer.from('{}'):readFileSync(path)}),/Independent Stage10 capture digest differs/);
});
test('registered Stage8 inputs retain their actual reader and root capability bindings',()=>{
 const seen=[],read=path=>{seen.push(path);return readFileSync(path);},proof=provePinnedSourceStage8({root,read,git:sourceGit});seen.length=0;
 assert.equal(rejectChangedKnownStage5Source(proof.historicalInput),undefined);assert.equal(seen.length,16);seen.length=0;
 assert.throws(()=>rejectChangedKnownStage5Source({...proof.historicalInput,read:readFileSync}),/Historical Stage8 reader capability differs/);assert.equal(seen.length,0);
 assert.throws(()=>rejectChangedKnownStage5Source({...proof.historicalInput,root:root+'/other'}),/Historical Stage8 root differs/);assert.equal(seen.length,0);
});
