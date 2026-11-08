import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {requiredVerificationJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
const workflow=readFileSync('.github/workflows/ci.yml','utf8');
const step=(source,name)=>{const marker='      - name: '+name+'\n';assert.equal(source.split(marker).length,2);return source.split(marker)[1].split('\n      - name:')[0].split('\n  publication-factory:')[0];};
function verify(source){
 assert.deepEqual(requiredVerificationJobs(source).sort(),['build','checks','full-product','publication-factory','source-acceptance']);
 const acceptance=step(source,'Batch21 calculator wave exact evidence and browser acceptance');
 assert.match(acceptance,/^        timeout-minutes: 20\n/);assert(!/continue-on-error|\n        if:/.test(acceptance));
 for(const command of ['node --test tests/batch21-calculator-wave/failure-diagnostics.test.mjs','node scripts/batch21-calculator-wave/evidence.mjs --check','node tests/batch21-calculator-wave/browser.mjs'])assert(acceptance.includes(command));
 const artifact=step(source,'Preserve Batch21 primary failure and browser evidence');assert.match(artifact,/^        if: always\(\)\n/);assert.match(artifact,/actions\/upload-artifact@v4/);assert(!/run:|continue-on-error/.test(artifact));assert(artifact.includes('${{ runner.temp }}/batch21-browser/report.json'));
 assert(source.includes('node tests/first-pilot1536/singleton.mjs'));
}
test('all five gates remain mandatory while diagnostics are retained on acceptance failure',()=>verify(workflow));
for(const flag of ['        if: false\n','        continue-on-error: true\n'])test('acceptance skip/bypass is rejected: '+flag.trim(),()=>assert.throws(()=>verify(workflow.replace('      - name: Batch21 calculator wave exact evidence and browser acceptance\n','      - name: Batch21 calculator wave exact evidence and browser acceptance\n'+flag))));
