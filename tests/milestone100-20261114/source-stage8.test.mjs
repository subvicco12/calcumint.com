import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {predecessorRef,proveCurrentStage8AndHistoricalInputs} from './source-stage8.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
function invalidInput(){const capture={kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef,codeRef:'1'.repeat(40),ancestry:['1'.repeat(40),predecessorRef],rows:[]};const bytes=Buffer.from(JSON.stringify(capture));return {policy:{...capture,paths:[],captureSHA256:sha(bytes)},capturePath:'capture',root:'/unavailable-stage8-test-root',read:p=>{assert.equal(p,'capture');return bytes;},git:()=>{throw new Error('supplied git reached');}};}
test('unarmed or substituted predecessor refuses before retained prover or transport',()=>{const input=invalidInput();input.policy.predecessorRef='0'.repeat(40);let retained=false;assert.throws(()=>proveCurrentStage8AndHistoricalInputs(input,()=>{retained=true;}),/exact predecessor/);assert.equal(retained,false);});
test('capture ancestry substitution refuses before retained prover and transport',()=>{const input=invalidInput();input.policy.ancestry=[predecessorRef];let retained=false;assert.throws(()=>proveCurrentStage8AndHistoricalInputs(input,()=>{retained=true;}),/finite reviewed ancestry/);assert.equal(retained,false);});
test('full proof cannot bypass supplied Git or expose historical inputs after rejection',()=>{const input=invalidInput();let retained=false,preloaded;input.git.preloadCommits=refs=>{preloaded=refs;};assert.throws(()=>proveCurrentStage8AndHistoricalInputs(input,()=>{retained=true;}),/supplied git reached/);assert.deepEqual(preloaded,input.policy.ancestry);assert.equal(retained,false);});
test('explicit retained dependency required; no implicit global proof',()=>{assert.throws(()=>proveCurrentStage8AndHistoricalInputs(invalidInput()),/Explicit supplied-transport/);});

// Positive and row-level adversarial cases require the immutable APP successor.
// They must be installed before Stage8 is armed; these refusal cases grant no admission.
