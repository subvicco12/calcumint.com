import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {compositionSourceEvidenceClaims,currentCompositionSourceEvidenceClaims} from '../milestone100-20261114/composition-source-evidence-batch.mjs';
import {sourceStage10Policy} from './source-stage10-current26-policy.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
test('current composition preserves every original31 claim and adds exactly the fixed diagnostic test F042 claim',()=>{
 assert.equal(compositionSourceEvidenceClaims.length,31);assert.deepEqual(currentCompositionSourceEvidenceClaims.slice(0,31),compositionSourceEvidenceClaims);assert.equal(currentCompositionSourceEvidenceClaims.length,32);assert.equal(new Set(currentCompositionSourceEvidenceClaims.map(r=>r.path)).size,32);assert(Object.isFrozen(currentCompositionSourceEvidenceClaims));assert(currentCompositionSourceEvidenceClaims.every(Object.isFrozen));
 const claim=currentCompositionSourceEvidenceClaims.at(-1);assert.equal(claim.path,'src/calculators/catalog-reviewed-standard-evidence.test.ts');
 const old=execFileSync('git',['show','f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5:'+claim.path]);assert.equal(hash(old),claim.sha256);assert(old.equals(execFileSync('git',['show','822743dd987bc2f07e52ab07a3c2ef4ab05f625f:'+claim.path])));
 const capture=readFileSync('docs/next-engineering-20261115/source/stage10-current26.json');assert.equal(hash(capture),sourceStage10Policy.captureSHA256);const row=JSON.parse(capture).rows.find(r=>r.path===claim.path);assert.equal(row.predecessor.sha256,claim.sha256);assert.equal(hash(readFileSync(claim.path)),row.current.sha256);assert.equal(row.current.ref,sourceStage10Policy.codeRef);
});
