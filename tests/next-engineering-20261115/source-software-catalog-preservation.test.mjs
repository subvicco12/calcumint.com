import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyPreservedSource} from '../../scripts/software-closure-evidence.mjs';
const name='src/calculators/catalog-reviewed-standard-evidence.test.ts';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
const historical=git(['show','b96b1ac89971cb8418d2389fbd7c9571a57491f1:'+name]),current=readFileSync(name);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
test('preserves the original software corpus hash while proving the exact reviewed catalog diagnostic successor',()=>{
 assert.notDeepEqual(current,historical);
 assert.equal(hash(historical),'ee95ed2dfaad9660c4e1891bd2013b6a3629969ab0905deb463850a5c13d0fc2');
 assert.equal(verifyPreservedSource(name,current,historical,git),hash(historical));
});
test('refuses valid predecessor reversion, changed diagnostics, and invented historical claims before equality fallback',()=>{
 for(const bytes of [historical,Buffer.concat([current,Buffer.from('\n// unrelated drift')])])assert.throws(()=>verifyPreservedSource(name,bytes,historical,git),/current successor differs/);
 assert.throws(()=>verifyPreservedSource(name,current,Buffer.from('invented history'),git),/historical claim differs/);
});
test('the catalog successor requires actual immutable source provenance and does not broaden other calculator paths',()=>{
 assert.throws(()=>verifyPreservedSource(name,current,historical,()=>{throw Error('missing catalog provenance');}),/missing catalog provenance/);
 const other='src/calculators/registry.ts',old=git(['show','b96b1ac89971cb8418d2389fbd7c9571a57491f1:'+other]);
 const forbidden=()=>{throw Error('Unexpected successor Git call');};
 assert.equal(verifyPreservedSource(other,old,old,forbidden),hash(old));
 assert.throws(()=>verifyPreservedSource(other,Buffer.from('unreviewed'),old,forbidden),/Protected source changed/);
});
