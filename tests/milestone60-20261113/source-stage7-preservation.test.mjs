import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { acceptedStage6, additionalStage6BootstrapRefs } from '../parallel-source-20261110/authority.mjs';
const base='2d5d105892134f8af46fc2a02edd5932c431b845';
const original=path=>execFileSync('git',['show',base+':'+path],{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
test('Stage6 independent policy, capture and mathematical engines remain literal',()=>{
 for(const path of ['tests/completion-wave-20261113/source-test-stage6-policy.mjs','docs/completion-wave-20261113/source-test-stage6.json','docs/parallel-source-20261110/capture-revision62.json','src/calculators/physics/catalog-batch-3.ts','src/lib/calculator-factory/experimental/physics-scaled.ts'])assert(readFileSync(path).equals(original(path)),path);
});
test('original Stage6 composition body remains exact beneath additive callback adapter',()=>{
 const path='tests/completion-wave-20261113/source-test-stage6.mjs',before=original(path).toString(),current=readFileSync(path,'utf8');
 const body=before.slice(before.indexOf('export function proveCurrentAppStage5AndHistoricalInputs(input){')).replace('export function proveCurrentAppStage5AndHistoricalInputs(input){','export function proveLiteralCurrentAppStage5AndHistoricalInputs(input){');
 assert.equal(current.slice(current.indexOf('export function proveLiteralCurrentAppStage5AndHistoricalInputs(input){')),body);
});
test('all original authority records and additional136 bootstrap refs remain literal',()=>{
 const before=original('tests/parallel-source-20261110/authority.mjs').toString();
 const records=JSON.parse(before.split('export const accepted=Object.freeze(')[1].split('\n]);')[0]+'\n]');
 const refs=JSON.parse(before.split('export const additionalBootstrapRefs=Object.freeze(')[1].split('\n]);')[0]+'\n]');
 assert.deepEqual(acceptedStage6,records);assert.deepEqual(additionalStage6BootstrapRefs,refs);
 const path='tests/completion-wave-20261113/source-preflight.test.mjs';
 const expected=original(path).toString().replace("import {fetchSourceLineage} from '../../scripts/fetch-source-lineage.mjs';","import {fetchStage6SourceLineage as fetchSourceLineage,stage6CompletionSourceRefs as completionSourceRefs} from '../milestone60-20261113/source-preflight-retained-stage6.mjs';").replace("import {completionSourceRefs} from '../../scripts/product-completion-lineage.mjs';\n",'');
 assert.equal(readFileSync(path,'utf8'),expected,'Only explicit historical import adapters may extend retained286 assertions');
 const retained=readFileSync('tests/milestone60-20261113/source-preflight-retained-stage6.mjs','utf8');
 const priorScript=original('scripts/fetch-source-lineage.mjs').toString();
 const body=priorScript.slice(priorScript.indexOf('export function fetchSourceLineage('),priorScript.indexOf('\nif(process.argv[1]')).replace('export function fetchSourceLineage(','export function fetchStage6SourceLineage(');
 assert.equal(retained.slice(retained.indexOf('export function fetchStage6SourceLineage(')).trimEnd(),body.trimEnd(),'Historical fetch algorithm body remains exact');
});
