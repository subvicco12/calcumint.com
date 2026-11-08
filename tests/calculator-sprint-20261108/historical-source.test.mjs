import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
for(const path of ['src/components/final-private-workbench.tsx','src/components/catalog-engineering-review.tsx']){
const original=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+path]);
const claim=createHash('sha256').update(original).digest('hex');
test('admits only the exact captured caller successor',()=>assert.equal(verifyCompletionBinding(path,readFileSync(path),claim,git),true));
test('rejects silent valid-hash historical caller reversion',()=>assert.throws(()=>verifyCompletionBinding(path,original,claim,git),/current successor differs/));
test('rejects unreviewed caller bytes',()=>assert.throws(()=>verifyCompletionBinding(path,Buffer.concat([readFileSync(path),Buffer.from('//tamper')]),claim,git),/current successor differs/));
test('rejects unavailable provenance',()=>assert.throws(()=>verifyCompletionBinding(path,readFileSync(path),claim,()=>Buffer.from('0'.repeat(40))),/source revision unavailable/));
for(const dependency of ['src/lib/final-private-snapshot-text.ts','src/lib/publication-factory-contracts-input.ts'])test('rejects altered serialized-boundary dependency: '+dependency,()=>assert.throws(()=>verifyCompletionBinding(path,readFileSync(path),claim,git,name=>name===dependency?Buffer.from('tamper'):readFileSync(name)),/supplemental source bytes differ/));

}
