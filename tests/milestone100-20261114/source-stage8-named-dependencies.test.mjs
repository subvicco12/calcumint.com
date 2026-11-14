import {runtimeAuxiliarySource,runtimeAuxiliaryBatchPredecessor} from './source-stage8-runtime-auxiliary.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {completionBindingDependencies} from '../../scripts/product-completion-stage8.mjs';
import {verifyCompletionBinding} from '../../scripts/product-completion-stage8.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {factoryPolicy,factoryCapturePath} from '../calculator-factory-source-20261112/policy.mjs';
import {completionCapturePath} from '../completion-first-20261112/policy.mjs';
const caller='src/components/calculator-interactive.tsx';
test('named current closure declares all23 exact factory reads and account acceptance auxiliary',()=>{
 const capture=JSON.parse(readFileSync(factoryCapturePath));assert.deepEqual(capture.rows.map(row=>row.path),factoryPolicy.paths);assert.equal(factoryPolicy.paths.length,23);
 const account='tests/calculator-factory-20261112/account-acceptance.mjs';const auxiliary=JSON.parse(readFileSync(completionCapturePath)).auxiliaryRows.find(row=>row.path===account);assert(auxiliary);assert.equal(auxiliary.current.path,account);
 const names=completionBindingDependencies(caller);for(const path of [caller,...factoryPolicy.paths,account])assert(names.includes(path),'Undeclared named core source '+path);assert.equal(new Set(names).size,names.length);
});
test('unknown completion paths gain no named core dependency closure',()=>assert.deepEqual(completionBindingDependencies('unapproved/unknown.mjs'),[]));
test('unchanged caller has full current proof without being falsely required in the changed-path roster',()=>{
 const capture=JSON.parse(readFileSync('docs/milestone100-20261114/source-stage8.json'));assert.equal(capture.rows.some(row=>row.path===caller),false);
 const claim='46903cd272e5e8a9b7ff37e338a6d9e149bf8956c4d5bed7afec7f9539d2c123';
 const names=completionBindingDependencies(caller),closed=new Map(names.map(path=>[path,readFileSync(path)]));
 const read=path=>{assert(closed.has(path),'Undeclared named reader dependency '+path);return closed.get(path);};
 assert.equal(verifyCompletionBinding(caller,readFileSync(caller),claim,sourceGit,read),true);
 const runtime='tests/next-cohort-20261110/source/retained-runtime.mjs',old=sourceGit(['cat-file','blob','99666fd1d09a2b7f782b05d4dbd9f9656be08eea']);
 for(const bytes of [Buffer.from('tampered runtime supplemental'),old,...[runtimeAuxiliarySource.current,runtimeAuxiliaryBatchPredecessor].map(row=>sourceGit(['cat-file','blob',row.blob]))])assert.throws(()=>verifyCompletionBinding(caller,readFileSync(caller),claim,sourceGit,path=>path===runtime?bytes:read(path)),/Independent current target bytes differ|Current personal auxiliary source bytes differ/);
 assert.throws(()=>verifyCompletionBinding(caller,Buffer.from('unbound caller argument'),claim,sourceGit),/Completion current successor differs/);
});
