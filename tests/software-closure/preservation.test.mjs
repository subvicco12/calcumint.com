import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyPreservedSource} from '../../scripts/software-closure-evidence.mjs';
const baseline='b96b1ac89971cb8418d2389fbd7c9571a57491f1';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const guarded=[
 'src/calculators/finance/compound-interest.test.ts',
 'src/calculators/finance/compound-interest.ts',
 'src/calculators/finance/loan-payment.ts',
 'src/calculators/precision.ts',
 'src/calculators/source-acceptance-evidence.test.ts',
 'src/calculators/source-driven-evidence.test.ts',
 'src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts'
];
for(const name of guarded){
 const historical=git(['show',`${baseline}:${name}`]),current=readFileSync(name);
 test('preserves historical hash while verifying current successor: '+name,()=>{
  assert.notDeepEqual(current,historical);
  assert.equal(verifyPreservedSource(name,current,historical,git),hash(historical));
 });
 test('rejects predecessor reversion before historical-equality fallback: '+name,()=>{
  assert.throws(()=>verifyPreservedSource(name,historical,historical,git),/current successor differs/);
 });
 test('rejects current successor tamper: '+name,()=>{
  assert.throws(()=>verifyPreservedSource(name,Buffer.concat([current,Buffer.from('\n// unauthorized')]),historical,git),/current successor differs/);
 });
 test('rejects unavailable exact source provenance: '+name,()=>{
  assert.throws(()=>verifyPreservedSource(name,current,historical,()=>{throw Error('missing immutable source');}),/missing immutable source/);
 });
}
test('unknown protected source remains byte-exact without invoking successor exceptions',()=>{
 const name='src/calculators/registry.ts',historical=git(['show',`${baseline}:${name}`]);
 const forbidden=()=>{throw Error('Unexpected successor Git call');};
 assert.equal(verifyPreservedSource(name,historical,historical,forbidden),hash(historical));
 assert.throws(()=>verifyPreservedSource(name,Buffer.from('unauthorized'),historical,forbidden),/Protected source changed/);
});
test('full retained software-closure packets reproduce byte-for-byte with no historical writes',{timeout:120_000},()=>{
 const paths=['docs/software-closure/requirements-540.json','docs/software-closure/preservation.json'];
 const before=paths.map(name=>readFileSync(name));
 const output=JSON.parse(execFileSync(process.execPath,['scripts/software-closure-evidence.mjs','--check'],{stdio:['ignore','pipe','pipe'],encoding:'utf8',timeout:120_000}));
 assert.equal(output.identities,540);assert.equal(output.canonicalPromotions,0);assert.equal(output.classes.CONTRACT_BLOCKED,43);
 paths.forEach((name,i)=>assert.deepEqual(readFileSync(name),before[i]));
});
