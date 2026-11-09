import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
import {verifyPreservedSource} from '../../scripts/software-closure-evidence.mjs';
const caller='src/components/calculator-interactive.tsx',current='00651cc382be5dcbd596882071787fd6702c13d3',former='955e2ed5df93e646275c4d94d33548cac5925380';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=x=>createHash('sha256').update(x).digest('hex');
test('every current crossed caller dependency binds exact application source',()=>{
 const source=readFileSync('scripts/product-completion-lineage.mjs','utf8'),start=source.indexOf('const bindings=')+'const bindings='.length,bindings=JSON.parse(source.slice(start,source.indexOf('\n];')+2));let count=0;
 for(const binding of bindings)for(const dependency of binding.supplementalSources??[])if(dependency.path===caller){count++;assert.equal(dependency.ref,current);assert.equal(dependency.blob,git(['rev-parse',current+':'+caller]).toString().trim());assert.equal(dependency.sha256,hash(readFileSync(caller)));}
 assert.equal(count,2);
});
for(const [name,old] of [['tests/acceptance-closure-20261108/receipt-source-path.mjs','7086b85437b025225f5736fb6b849415e518dc08'],['src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts','b96b1ac89971cb8418d2389fbd7c9571a57491f1']]){
 test('unchanged retained claim crosses to current caller dependency '+name,()=>{
  const historical=git(['show',old+':'+name]),bytes=readFileSync(name);assert.equal(verifyCompletionBinding(name,bytes,hash(historical),git),true);
  assert.throws(()=>verifyCompletionBinding(name,bytes,hash(historical),git,path=>path===caller?git(['show',former+':'+caller]):readFileSync(path)),/supplemental source bytes differ/);
  assert.equal(verifyPreservedSource(name,bytes,historical,git),hash(historical));
 });
}
