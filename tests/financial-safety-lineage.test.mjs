import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyFinancialSafetyBinding} from '../scripts/financial-safety-lineage.mjs';
import {assertFrozenCurrentFiles} from '../scripts/frozen-canonical-source.mjs';
import {verifyPublication20CallerLineage} from '../scripts/publication20-caller-lineage.mjs';
const repository=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const predecessor='a955cdad7019a645b7ed2950299d0603ba1784a7';
const successor='af92e4f4fc2a024d50fb2c71271b09e221b2c6fe';
const files=['src/calculators/finance/compound-interest.ts','src/calculators/finance/loan-payment.ts','src/calculators/precision.ts'];
const git=args=>execFileSync('git',args,{cwd:repository,stdio:['ignore','pipe','pipe']});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const name of files){
 const historical=git(['show',predecessor+':'+name]);
 const current=git(['show',successor+':'+name]);
 const claim=hash(historical);
 test('admits exact guard successor and frozen historical source: '+name,()=>{
  for(const ref of ['7eff39b23a52953c028852d50d5571211a3f8a44','2f088187dd395fd26262c32195b427258f44fa44'])assert.deepEqual(git(['show',ref+':'+name]),historical);
  assert.equal(verifyFinancialSafetyBinding(name,current,claim,git),true);
 });
 test('rejects changed or reverted current bytes and false historical claim: '+name,()=>{
  assert.throws(()=>verifyFinancialSafetyBinding(name,Buffer.concat([current,Buffer.from('\n')]),claim,git),/current successor differs/);
  assert.throws(()=>verifyFinancialSafetyBinding(name,historical,claim,git),/current successor differs/);
  assert.throws(()=>verifyFinancialSafetyBinding(name,current,hash(current),git),/historical claim differs/);
 });
 test('rejects missing or substituted predecessor and successor objects: '+name,()=>{
  for(const ref of [predecessor,successor]){
   assert.throws(()=>verifyFinancialSafetyBinding(name,current,claim,args=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]===ref+'^{commit}'?Buffer.from('0'.repeat(40)):git(args)),/unavailable/);
   assert.throws(()=>verifyFinancialSafetyBinding(name,current,claim,args=>args[0]==='rev-parse'&&args[1]===ref+':'+name?Buffer.from('0'.repeat(40)):git(args)),/object differs/);
   const blob=git(['rev-parse',ref+':'+name]).toString().trim();
   assert.throws(()=>verifyFinancialSafetyBinding(name,current,claim,args=>args[0]==='cat-file'&&args[2]===blob?Buffer.from('substituted source'):git(args)),/source differs/);
  }
 });
}
test('unknown and unsafe paths cannot invoke the successor exception',()=>{
 for(const name of ['src/calculators/engine.ts','../src/calculators/precision.ts','src/calculators/finance/precision.ts'])assert.equal(verifyFinancialSafetyBinding(name,Buffer.from('anything'),'0'.repeat(64),()=>{throw Error('must not call git');}),false);
});
test('frozen comparison admits only exact financial successors and still rejects unrelated edits',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'financial-frozen-test-'));
 try{
  for(const name of files){await mkdir(path.dirname(path.join(root,name)),{recursive:true});await writeFile(path.join(root,name),git(['show',predecessor+':'+name]));}
  await assertFrozenCurrentFiles(repository,root,files);
  await mkdir(path.join(root,'src/calculators'),{recursive:true});
  await writeFile(path.join(root,'src/calculators/engine.ts'),'tampered frozen engine');
  await assert.rejects(assertFrozenCurrentFiles(repository,root,['src/calculators/engine.ts']),/Immutable legacy implementation/);
  await writeFile(path.join(root,files[0]),'tampered original');
  await assert.rejects(assertFrozenCurrentFiles(repository,root,[files[0]]),/historical claim differs/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('both publication caller comparisons accept exact pinned precision successor',()=>{
 assert.equal(verifyPublication20CallerLineage(repository).sourceBindings,20);
});
