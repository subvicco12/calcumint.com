import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {requiredVerificationJobs,workflowJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
const workflow=readFileSync('.github/workflows/ci.yml','utf8');
function check(source){
 assert.deepEqual(requiredVerificationJobs(source).slice().sort(),['checks','build','source-acceptance','full-product','publication-factory'].sort());
 const factory=workflowJobs(source)['publication-factory'];
 const marker='      - name: Shared exact-version atomic publication batch acceptance\n';
 assert.equal(factory.split(marker).length,2);
 const step=factory.split(marker)[1].split('\n      - name:')[0];
 assert.match(step,/^        timeout-minutes: 3$/m);
 assert(!/continue-on-error|(?:^|\n)        if:/.test(step));
 for(const command of ["python3 -m unittest discover -s tests/publication540-shared -p 'reconcile_test.py'",'node --test tests/publication540-shared/workflow.test.mjs','node tests/publication540-shared/database.mjs'])assert(step.includes(command),command);
}
test('all required jobs and held atomic batch acceptance stay mandatory',()=>check(workflow));
test('deletion or conditional skipping of shared database acceptance is rejected',()=>{
 assert.throws(()=>check(workflow.replace('          node tests/publication540-shared/database.mjs\n','')));
 assert.throws(()=>check(workflow.replace('      - name: Shared exact-version atomic publication batch acceptance\n','      - name: Shared exact-version atomic publication batch acceptance\n        if: false\n')));
});
