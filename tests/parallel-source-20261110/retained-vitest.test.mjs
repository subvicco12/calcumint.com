import {test} from 'node:test';
import assert from 'node:assert/strict';
import {retainedCases,assertRetainedCase,assertOriginalReport} from './retained-vitest.mjs';
const entry='src/lib/execution-recovery-evidence.test.ts';
const report=()=>({numFailedTests:0,numPassedTests:3,numFailedTestSuites:0,testResults:[{assertionResults:retainedCases[entry].map(title=>({title,status:'passed'}))}]});
test('only finite exact original entry and case identities are admitted',()=>{
 assert.doesNotThrow(()=>assertRetainedCase(entry,retainedCases[entry][0]));
 for(const path of ['../'+entry,'src/lib/unknown.test.ts','toString'])assert.throws(()=>assertRetainedCase(path,retainedCases[entry][0]));
 assert.throws(()=>assertRetainedCase(entry,'unknown case'));
});
test('strict original JSON report requires every exact original case to pass once',()=>{
 assert.equal(assertOriginalReport(entry,report()),true);
 for(const mutate of [r=>r.numFailedTests=1,r=>r.numPassedTests=2,r=>r.numFailedTestSuites=1,r=>r.testResults[0].assertionResults.pop(),r=>r.testResults[0].assertionResults.push(r.testResults[0].assertionResults[0]),r=>r.testResults[0].assertionResults[0].status='pending',r=>r.testResults[0].assertionResults[0].status='failed',r=>r.testResults[0].assertionResults[0].title='replacement']){const r=report();mutate(r);assert.throws(()=>assertOriginalReport(entry,r));}
});
