import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import * as receipt from '../acceptance-closure-20261108/receipt-source-path.mjs';
const caller='src/components/calculator-interactive.tsx',old='811bbd67bfcc635808101a351fa15eb133331369',previous='3c2b768ecc9e6e0821df8e74c779d134e99c4f48',current='56763645c091743508c1b7a163c7c59dcb7f4b7d';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const sha=value=>createHash('sha256').update(value).digest('hex');
for(const ref of [old,previous,current,'d1ea2fd979fa02e1d107e48aedcba72086115f6e'])test('exact known UI receipt claim requires current successor '+ref,()=>assert.equal(receipt.verifyCapturedCurrentCaller({path:caller,sha256:sha(git(['show',ref+':'+caller]))}),caller));
test('known old UI claim cannot allow old valid caller bytes or invented claims',()=>{
 const bytes=git(['show',old+':'+caller]),binding={path:caller,sha256:sha(bytes)};
 assert.throws(()=>receipt.verifyCapturedCurrentCaller(binding,name=>name===caller?bytes:readFileSync(name)),/current successor/);
 assert.throws(()=>receipt.verifyCapturedCurrentCaller({...binding,sha256:'0'.repeat(64)}),/historical claim/);
 assert.throws(()=>receipt.verifyCapturedCurrentCaller(binding,readFileSync,()=>{throw Error('Missing exact UI provenance');}),/Missing exact UI provenance/);
});
for(const dep of ['src/lib/technology-capture-trust.ts','src/lib/presentation-entitlements.ts','src/components/technology-worked-example.tsx'])test('same target UI dependency drift refused '+dep,async()=>{
 const binding={path:caller,sha256:sha(git(['show',old+':'+caller]))};
 assert.throws(()=>receipt.verifyCapturedCurrentCaller(binding,name=>name===dep?Buffer.from('tampered target dependency'):readFileSync(name)),/supplemental source bytes differ/);
 await assert.rejects(receipt.verifyCapturedSource(binding,async name=>name===dep?Buffer.from('tampered async target dependency'):readFile(name)),/supplemental source bytes differ/);
});

test('exact567 caller byte reversion is refused despite legitimate retained receipt claim',()=>{const bytes=git(['show',current+':'+caller]);assert.throws(()=>receipt.verifyCapturedCurrentCaller({path:caller,sha256:sha(bytes)},name=>name===caller?bytes:readFileSync(name)),/current successor/);});
