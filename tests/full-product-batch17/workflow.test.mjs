import {requiredVerificationJobs,workflowJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const workflow=readFileSync('.github/workflows/ci.yml','utf8');
test('the three exact independent task campaigns and receipt checks are mandatory and bounded',()=>{
 const product=workflow.split('\n  full-product:\n')[1].split('\n  validate:\n')[0];
 const marker='      - name: Batch17 independent issuance capture and expiry acceptance\n';
 assert.equal(product.split(marker).length,2);const step=product.split(marker)[1];
 assert.match(step,/^        timeout-minutes: 5\n/);
 for(const command of ['node --test tests/batch17-issuance/*.test.mjs tests/batch17-capture/*.test.mjs tests/batch17-expiry/*.test.mjs tests/full-product-batch17/workflow.test.mjs','node tests/batch17-issuance/acceptance.mjs','node tests/batch17-issuance/verify-receipt.mjs','node tests/batch17-capture/postgres.mjs','node tests/batch17-expiry/acceptance.mjs'])assert(step.includes(command),command);
 for(const variable of ['ISSUANCE_ARTIFACTS','CAPTURE_ARTIFACTS','EXPIRY_ARTIFACTS'])assert.match(step,new RegExp(`          ${variable}: \\$\\{\\{ runner.temp \\}\\}/batch17-`));
 assert.match(step,/ISSUANCE_VALID_RECEIPT: \$\{\{ runner.temp \}\}\/batch17-issuance\/receipt.json/);
 assert(step.indexOf('node tests/batch17-issuance/acceptance.mjs')<step.indexOf('node --test'),'Verifier adversarial tests consume a fresh genuine receipt, never a reconstructed fixture');
 assert(!/continue-on-error|\n        if:/.test(step));
 assert(product.indexOf('node tests/full-product-batch16/finder-browser.mjs')<product.indexOf(marker),'Prior browser cleanup precedes new Docker campaigns');
});
test('strict aggregate outcomes and bounded native acceptance budget remain intact',()=>{
 assert(requiredVerificationJobs(workflow).includes('publication-factory'));
 for(const variable of ['CHECKS','BUILD','FULL_PRODUCT','SOURCE_ACCEPTANCE'])assert(workflow.includes(`test "$${variable}_RESULT" = success`));
 const jobs=workflowJobs(workflow);for(const name of ['checks','build','full-product','source-acceptance'])assert.match(jobs[name],/^    timeout-minutes: 20$/m);const nativeStep=jobs['publication-factory'].split('      - name: Genuine Next frequency history and Business workflow\n')[1];assert(nativeStep,'Native authenticated acceptance stays mandatory');const minutes=Number(nativeStep.match(/^        timeout-minutes: (\d+)$/m)?.[1]);assert.equal(minutes,6);assert.match(jobs['publication-factory'],new RegExp('^    timeout-minutes: '+(12+minutes)+'$','m'));
});
