import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {verifyCompletionBinding} from '../scripts/product-completion-lineage.mjs';
import {verifyCurrentCandidateBinding} from '../scripts/check-current-six-candidate-evidence.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
const old='a955cdad7019a645b7ed2950299d0603ba1784a7';
const firstCorruptedBlob=Object.freeze({
 'src/calculators/finance/compound-interest.test.ts':'e765f88bb6e044c5ac435219c3274aac862556d3',
 'src/components/full-six/candidate-workbench.tsx':'435b6e2537a3d6d0154ee576f51dbd80b12bda68',
 '.github/workflows/ci.yml':'81f68542a0757edffc604a30f8ad99df8d00b65d',
});
for(const path of ['src/calculators/finance/compound-interest.test.ts','src/components/full-six/candidate-workbench.tsx','.github/workflows/ci.yml']){
 const historical=git(['show',old+':'+path]);
 const claim=createHash('sha256').update(historical).digest('hex');
 const current=readFileSync(path);
 test('admits exact committed successor: '+path,()=>assert.equal(verifyCompletionBinding(path,current,claim,git),true));
 test('rejects uncommitted successor tamper: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,Buffer.concat([current,Buffer.from('\n// tamper')]),claim,git),/current successor/));
 test('rejects rewritten historical claim: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,'0'.repeat(64),git),/predecessor claim/));
 test('rejects silent predecessor reversion: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,historical,claim,git),/current successor/));
 test('rejects unavailable or replaced Git provenance: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,claim,args=>args[0]==='rev-parse'?Buffer.from('0'.repeat(40)):git(args)),error=>error instanceof Error&&error.message==='Git commit identity differs'));
 test('rejects corrupted source object: '+path,()=>assert.throws(()=>verifyCompletionBinding(path,current,claim,args=>args[0]==='cat-file'?Buffer.from('corrupt'):git(args)),error=>error instanceof Error&&error.message==='Git blob content address differs: '+firstCorruptedBlob[path]));
}
test('does not admit any unrelated engine, UI or unsafe path',()=>{
 for(const path of ['src/calculators/registry.ts','src/calculators/finance/loan-payment.ts','../outside'])assert.equal(verifyCompletionBinding(path,Buffer.from('anything'),'0'.repeat(64),()=>{throw Error('Must not read Git for an unknown path');}),false);
});
for(const path of ['src/calculators/finance/compound-interest.ts','src/components/full-six/candidate-workbench.tsx','.github/workflows/ci.yml']){
 test('integrated checker rejects a predecessor reversion even with its valid old hash: '+path,()=>{
  const historical=git(['show',old+':'+path]);
  const claim=createHash('sha256').update(historical).digest('hex');
  assert.throws(()=>verifyCurrentCandidateBinding(path,claim,name=>name===path?historical:readFileSync(name),git),/current successor differs/);
 });
}
test('integrated checker rejects unrelated source tamper without new approval',()=>{
 const path='src/calculators/core/percentage.ts',bytes=readFileSync(path),claim=createHash('sha256').update(bytes).digest('hex');
 assert.throws(()=>verifyCurrentCandidateBinding(path,claim,()=>Buffer.from('tamper'),git),/source binding changed/);
});
for(const dependency of ['src/lib/full-six/candidate/scenario-comparison.ts','src/components/full-six/candidate-scenario-comparison.tsx']){
 test('workbench binding rejects supplemental comparison tamper: '+dependency,()=>{
  const path='src/components/full-six/candidate-workbench.tsx',claim=createHash('sha256').update(git(['show',old+':'+path])).digest('hex');
  assert.throws(()=>verifyCompletionBinding(path,readFileSync(path),claim,git,name=>name===dependency?Buffer.from('tamper'):readFileSync(name)),/supplemental source bytes differ/);
 });
}
