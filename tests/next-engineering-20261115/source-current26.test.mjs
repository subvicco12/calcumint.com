import test from 'node:test';
import assert from 'node:assert/strict';
import {runLiteralCurrent26Audit} from './source-current26-historical-audit.mjs';
test('current32 authentication precedes the exact original three-case current26 audit',()=>{
 const result=runLiteralCurrent26Audit();
 assert.equal(result.literalAuditRef,'41dd08636532c4930666c76b109526d293186699');
 assert.equal(result.currentPaths,32);assert.equal(result.historicalTests,3);
});
