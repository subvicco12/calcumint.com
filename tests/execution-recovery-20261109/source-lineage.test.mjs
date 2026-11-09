import '../cohort22-closure-20261109/caller-source.test.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyPublication20CallerLineage} from '../../scripts/publication20-caller-lineage.mjs';
import {verifyCapturedSource} from '../acceptance-closure-20261108/receipt-source-path.mjs';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
const hash=b=>createHash('sha256').update(b).digest('hex');
const old='a7a656f71b04b50192485a49b0b56b3fa6bd86b9',capture='7086b85437b025225f5736fb6b849415e518dc08';
const caller='src/components/calculator-interactive.tsx',outer='src/lib/registered-snapshot-verification.ts';
test('current actual caller retains original20 binding contract through exact successor',()=>assert.equal(verifyPublication20CallerLineage('.').sourceBindings,20));
test('retained and fresh outer receipt claims require exact current captured source',async()=>{
 for(const ref of [old,capture])assert.equal(await verifyCapturedSource({path:outer,sha256:hash(git(['show',ref+':'+outer]))}),outer);
 await assert.rejects(verifyCapturedSource({path:outer,sha256:'0'.repeat(64)}));
 await assert.rejects(verifyCapturedSource({path:outer,sha256:hash(git(['show',old+':'+outer]))},async name=>name===outer?git(['show',old+':'+outer]):readFile(name)),/successor/);
});
for(const name of [caller,outer]){
 const historical=git(['show',old+':'+name]),claim=hash(historical),current=readFileSync(name);
 test('exact capture and hard predecessor refusal '+name,()=>{assert.equal(verifyCompletionBinding(name,current,claim,git),true);assert.throws(()=>verifyCompletionBinding(name,historical,claim,git),/current successor/);assert.throws(()=>verifyCompletionBinding(name,Buffer.from('tamper'),claim,git));assert.throws(()=>verifyCompletionBinding(name,current,claim,()=>{throw Error('missing provenance');}),/missing provenance/);});
 for(const dep of ['src/lib/technology-snapshot-verification.ts','src/calculators/technology-computing/catalog-batch-2.ts'])test('target-tree dependency refusal '+name+' '+dep,()=>assert.throws(()=>verifyCompletionBinding(name,current,claim,git,p=>p===dep?Buffer.from('target drift'):readFileSync(p)),/supplemental source bytes differ/));
}
test('retained software closure reproduces unchanged historical preservation packets',()=>{
 const paths=['docs/software-closure/requirements-540.json','docs/software-closure/preservation.json'];
 const before=paths.map(name=>readFileSync(name));
 const result=JSON.parse(execFileSync(process.execPath,['scripts/software-closure-evidence.mjs','--check'],{encoding:'utf8',timeout:45000,maxBuffer:8*1024*1024}));
 assert.equal(result.identities,540);assert.equal(result.canonicalPromotions,0);assert.equal(result.classes.CONTRACT_BLOCKED,43);
 paths.forEach((name,index)=>assert.deepEqual(readFileSync(name),before[index]));
});
