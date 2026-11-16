import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Execute the actual finite join expression against the retained hosted capture.
// This isolates the failed join without running the preceding provenance graph.
const source=readFileSync('tests/milestone100-20261114/source-preflight-stage8.mjs','utf8');
const expression=/const successor=(\[[^;]+);assert.equal\(row.ref,([^;]+)\);/.exec(source);
assert(expression,'Exact current preflight guard join required');
const expectedRef=Function('capture','path',`const successor=${expression[1]};return ${expression[2]};`);
const capture=JSON.parse(readFileSync('docs/next-engineering-20261115/source/guard-capture-receipt-fixture.json'));
test('preflight joins the admitted receipt guard in the real hosted capture',()=>{
 const path='scripts/fetch-source-lineage.mjs',row=capture.currentSources.find(row=>row.path===path);
 assert.equal(row.ref,capture.sourceStage10ReceiptFixture.guardRef);
 assert.equal(expectedRef(capture,path),row.ref);
});
test('preflight keeps the original bootstrap test at its V45 historical guard',()=>{
 const path='tests/source-lineage-bootstrap.test.mjs',row=capture.currentSources.find(row=>row.path===path);
 assert.equal(row.ref,capture.sourceStage8V45.guardRef);
 assert.equal(expectedRef(capture,path),row.ref);
});
