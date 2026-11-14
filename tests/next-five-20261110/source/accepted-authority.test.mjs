import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyAcceptedR4Authority} from './accepted-authority.mjs';
test('independent installed R4 authority is actual reviewed Git code',()=>assert.equal(verifyAcceptedR4Authority(),true));
for(const path of ['tests/next-five-20261110/source/fixed-anchor.mjs','tests/next-five-20261110/source/current-proof.mjs','tests/next-cohort-20261110/source/current-caller-stage.mjs','tests/next-cohort-20261110/source/current-anchor.mjs','tests/next-five-20261110/retained23-proof.mjs','tests/next-five-20261110/retained23-proof.d.mts','src/lib/next-cohort-evidence.test.ts','src/lib/remaining-five-evidence.test.ts','tests/next-cohort-20261110/source/runtime-current-anchor.mjs'])test('mutable candidate cannot bypass independent full-code authority '+path,()=>assert.throws(()=>verifyAcceptedR4Authority(name=>name===path?Buffer.from('return true;'):readFileSync(name)),/target bytes differ/));
test('independent authority rejects missing authentic Git source',()=>assert.throws(()=>verifyAcceptedR4Authority(readFileSync,()=>{throw Error('Missing accepted authority Git');}),/Missing accepted authority Git/));
test('independent authority rejects substituted old commit objects',()=>assert.throws(()=>verifyAcceptedR4Authority(readFileSync,()=>Buffer.from('0'.repeat(40))),/provenance differs|object differs/));

test('a genuine older HEAD cannot replace the independently reviewed installed authority',()=>{const actual=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});assert.throws(()=>verifyAcceptedR4Authority(readFileSync,args=>args[0]==='rev-parse'&&args[2]==='HEAD^{commit}'?Buffer.from('23f2860c16310385f6c37f7a2bc3c86890631c98'):actual(args)));});
