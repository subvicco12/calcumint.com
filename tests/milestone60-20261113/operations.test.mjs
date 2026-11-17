import {test} from 'node:test';
import assert from 'node:assert/strict';
import {qualify} from './operations.mjs';
import {assess,requirements} from '../execution-recovery-20261109/operations-preflight.mjs';
test('retained source bytes, unchanged holds and unsigned controls qualify offline',async()=>{const r=await qualify();assert.equal(r.status,'OFFLINE_QUALIFIED_RELEASE_HELD');assert.equal(r.unsignedControls,10);assert.equal(r.productionExecutionAuthorized,false);assert.equal(r.referenceAssessment.missing.length,10);});
test('complete reference syntax never authorizes execution; invalid credentials and unstructured claims refuse',()=>{const input=Object.fromEntries(requirements.map(key=>[key,{responsibleParty:'Synthetic test party',evidenceRef:'receipt:synthetic-fixture-only'}]));assert.equal(assess(input).status,'BLOCKED_PENDING_INDEPENDENT_OPERATOR_ADJUDICATION');assert.equal(assess(input).productionExecutionAuthorized,false);assert.throws(()=>assess({...input,credential:'secret'}));assert.throws(()=>assess({...input,credentialCustody:{responsibleParty:'test',evidenceRef:'https://example.invalid/token'}}));assert.throws(()=>assess({...input,writerRoster:true}));});
