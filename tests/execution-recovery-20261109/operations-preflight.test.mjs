import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess,requirements} from './operations-preflight.mjs';
test('missing operational evidence stays blocked',()=>{assert.equal(assess({}).missing.length,requirements.length);});
test('even complete references do not manufacture factual verification or execution authority',()=>{const x=Object.fromEntries(requirements.map(k=>[k,{responsibleParty:'Synthetic test custodian',evidenceRef:'receipt:synthetic-'+k}]));const r=assess(x);assert.equal(r.status,'BLOCKED_PENDING_INDEPENDENT_OPERATOR_ADJUDICATION');assert.equal(r.productionExecutionAuthorized,false);});
test('secret/configuration fields and value-bearing references are refused',()=>{assert.throws(()=>assess({password:'synthetic'}),/Unknown fields/);assert.throws(()=>assess({writerRoster:{responsibleParty:'Fixture',evidenceRef:'https://example.invalid/?token=synthetic'}}),/reference handle/);assert.throws(()=>assess({writerRoster:{responsibleParty:'Fixture',evidenceRef:'receipt:fixture',value:'synthetic'}}),/Only party/);});
