import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyCompletionBinding,completionBindingDependencies} from '../../scripts/product-completion-stage8.mjs';
import {acceptedStage8} from '../parallel-source-20261110/authority.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
const original=readFileSync('scripts/product-completion-lineage.mjs','utf8'),bindings=JSON.parse(original.match(/const bindings=(\[[\s\S]*?\n\]);/)[1]);
test('every exact legacy binding declares the new current guard modules',()=>{
 assert.equal(bindings.length,28);
 for(const row of bindings)for(const path of ['tests/milestone100-20261114/receipt-source-path-stage8.mjs','tests/milestone100-20261114/source-stage8-policy.mjs','scripts/product-completion-stage8.mjs'])assert(completionBindingDependencies(row.path).includes(path),row.path+' missing '+path);
});
test('unarmed guard phase refuses unchanged legacy positives; installed phase must prove them',()=>{
 const row=bindings.find(row=>row.path==='src/lib/registered-snapshot-verification.ts');
 if(acceptedStage8.length===0)assert.throws(()=>verifyCompletionBinding(row.path,readFileSync(row.path),row.predecessorSHA256,sourceGit),/authority is not installed/);
 else assert.equal(verifyCompletionBinding(row.path,readFileSync(row.path),row.predecessorSHA256,sourceGit),true);
});
test('all unknown bindings refuse without accessing Git, including newly added Stage8 files',()=>{
 for(const name of ['../unsafe','src/lib/wave100-history-verification.ts'])assert.equal(verifyCompletionBinding(name,Buffer.from('arbitrary'),'0'.repeat(64),()=>{throw Error('Unexpected Git access');}),false);
});
