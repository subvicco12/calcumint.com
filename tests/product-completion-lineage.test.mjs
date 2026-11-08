import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {verifyCompletionBinding} from '../scripts/product-completion-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
const old='a955cdad7019a645b7ed2950299d0603ba1784a7';
for(const path of ['src/calculators/finance/compound-interest.test.ts','src/components/full-six/candidate-workbench.tsx']){
 const historical=git(['show',old+':'+path]);
 const claim=createHash('sha256').update(historical).digest('hex');
 const current=readFileSync(path);
 test('admits exact committed successor: '+path,()=>assert.equal(verifyCompletionBinding(path,current,claim,git),true));
 test('rejects uncommitted successor tamper: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,Buffer.concat([current,Buffer.from('\n// tamper')]),claim,git),/current successor/));
 test('rejects rewritten historical claim: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,'0'.repeat(64),git),/predecessor claim/));
 test('rejects silent predecessor reversion: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,historical,claim,git),/current successor/));
 test('rejects unavailable or replaced Git provenance: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,claim,args=>args[0]==='rev-parse'?Buffer.from('0'.repeat(40)):git(args)),/source revision unavailable/));
 test('rejects corrupted source object: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,claim,args=>args[0]==='cat-file'?Buffer.from('corrupt'):git(args)),/source bytes differ/));
}
test('does not admit any unrelated engine, UI or unsafe path',()=>{
 for(const path of ['src/calculators/registry.ts','src/calculators/finance/loan-payment.ts','../outside'])assert.equal(verifyCompletionBinding(path,Buffer.from('anything'),'0'.repeat(64),()=>{throw Error('Must not read Git for an unknown path');}),false);
});
