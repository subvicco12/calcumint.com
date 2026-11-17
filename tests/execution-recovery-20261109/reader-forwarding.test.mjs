import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';import {verifyFinancialSafetyBinding} from '../../scripts/financial-safety-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});
const source=readFileSync('scripts/product-completion-lineage.mjs','utf8'),start=source.indexOf('const bindings=')+'const bindings='.length,end=source.indexOf('\n];\nexport const completionSourceRefs')+2,bindings=JSON.parse(source.slice(start,end));
function wrapper(file,name){
 // Isolate the exact exported function body; underlying Git and both provenance verifiers are real.
 // Whole-module CLI/source-manifest execution is also required separately by the existing CI jobs.
 const body=readFileSync(file,'utf8').match(new RegExp('export function '+name+'\\([^]*?^\\}','m'))?.[0];assert(body,'Exact wrapper source required');
 return new Function('readFileSync','git','createHash','verifyFinancialSafetyBinding','verifyCompletionBinding','return '+body.replace(/^export /,''))(readFileSync,git,createHash,verifyFinancialSafetyBinding,verifyCompletionBinding);
}
for(const [file,name,selected,dependency] of [
 ['scripts/check-current-six-candidate-evidence.mjs','verifyCurrentCandidateBinding','src/components/full-six/candidate-workbench.tsx','src/lib/full-six/candidate/scenario-comparison.ts'],
 ['scripts/check-shortest-publication20.mjs','verifyShortestSourceBinding','scripts/publication20-caller-lineage.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs']
])test(name+' rejects dependency tamper from the same supplied target reader',()=>{
 const binding=bindings.find(row=>row.path===selected);assert(binding.supplementalSources.some(row=>row.path===dependency));
 const verify=wrapper(file,name),reads=[];
 assert.throws(()=>verify(selected,binding.predecessorSHA256,path=>{reads.push(path);return path===dependency?Buffer.from('changed target dependency'):readFileSync(path);},git),/supplemental source bytes differ/);
 assert(reads.includes(selected));assert(reads.includes(dependency));
});
