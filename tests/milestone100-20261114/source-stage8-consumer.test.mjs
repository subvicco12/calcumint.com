import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {verifyCompletionBinding,completionBindingDependencies} from '../../scripts/product-completion-stage8.mjs';
const name='src/components/calculator-interactive.tsx',sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const claim=sha(sourceGit(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+name]));
test('explicit current adapter admits exact current caller through literal original binding',()=>{assert.equal(verifyCompletionBinding(name,readFileSync(name),claim,sourceGit),true);});
test('current caller adapter accepts complete supplied dependency map only',()=>{const names=completionBindingDependencies(name),target=new Map(names.map(path=>[path,readFileSync(path)])),seen=new Set();assert.equal(verifyCompletionBinding(name,readFileSync(name),claim,sourceGit,path=>{assert(target.has(path),'Undeclared dependency '+path);seen.add(path);return target.get(path);}),true);for(const path of names)assert(seen.has(path),'Missing dependency '+path);});
test('current adapter refuses actual changed source tamper and retained-valid source reversion',()=>{const path='src/lib/calculator-factory/registry.ts',old=sourceGit(['show','eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8:'+path]);for(const bytes of [Buffer.from('tamper'),old])assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,sourceGit,p=>p===path?bytes:readFileSync(p)),/Current factory bytes differ/);});
test('caller byte and historical claim tamper still refuse through unchanged original assertions',()=>{assert.throws(()=>verifyCompletionBinding(name,Buffer.from('tamper'),claim,sourceGit),/current successor differs/);assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),'0'.repeat(64),sourceGit),/predecessor claim differs/);});
test('unknown bindings keep literal refusal without any Git access',()=>{assert.equal(verifyCompletionBinding('../unsafe',Buffer.from('tamper'),'0'.repeat(64),()=>{throw Error('No Git allowed');}),false);});

test('direct current caller entry rejects missing or altered independently pinned new guard dependencies',()=>{
 for(const path of ['tests/milestone100-20261114/receipt-source-path-stage8.mjs','tests/milestone100-20261114/source-stage8-activation.mjs','tests/milestone100-20261114/source-stage8-policy.mjs','tests/milestone100-20261114/source-stage8-guard-policy.mjs','scripts/product-completion-stage8.mjs']){
  assert(completionBindingDependencies(name).includes(path),'Guard dependency must be declared: '+path);
  assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,sourceGit,p=>p===path?Buffer.from('matching-looking modified guard'):readFileSync(p)),/Independent current target bytes differ/);
  assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,sourceGit,p=>{if(p===path)throw Error('Supplied guard unavailable');return readFileSync(p);}),/Supplied guard unavailable/);
 }
});
