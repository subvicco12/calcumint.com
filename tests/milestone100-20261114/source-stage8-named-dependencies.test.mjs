import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {completionBindingDependencies} from '../../scripts/product-completion-stage8.mjs';
import {factoryPolicy,factoryCapturePath} from '../calculator-factory-source-20261112/policy.mjs';
import {completionCapturePath} from '../completion-first-20261112/policy.mjs';
const caller='src/components/calculator-interactive.tsx';
test('named current closure declares all23 exact factory reads and account acceptance auxiliary',()=>{
 const capture=JSON.parse(readFileSync(factoryCapturePath));assert.deepEqual(capture.rows.map(row=>row.path),factoryPolicy.paths);assert.equal(factoryPolicy.paths.length,23);
 const account='tests/calculator-factory-20261112/account-acceptance.mjs';const auxiliary=JSON.parse(readFileSync(completionCapturePath)).auxiliaryRows.find(row=>row.path===account);assert(auxiliary);assert.equal(auxiliary.current.path,account);
 const names=completionBindingDependencies(caller);for(const path of [...factoryPolicy.paths,account])assert(names.includes(path),'Undeclared named core source '+path);assert.equal(new Set(names).size,names.length);
});
test('unknown completion paths gain no named core dependency closure',()=>assert.deepEqual(completionBindingDependencies('unapproved/unknown.mjs'),[]));
