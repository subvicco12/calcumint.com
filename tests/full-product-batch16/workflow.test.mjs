import {requiredVerificationJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const workflow=readFileSync('.github/workflows/ci.yml','utf8');
test('Batch16 extends the existing genuine auth suite instead of duplicating Docker campaigns',()=>{
 const step=workflow.split('      - name: Genuine full repository schema and Business authorization\n')[1].split('      - name: ')[0];
 assert.match(step,/run: node tests\/gotrue-full-schema\/acceptance\.mjs/);
 assert.match(step,/BATCH16_AUTH: '1'/);
 assert.equal(workflow.split('node tests/gotrue-full-schema/acceptance.mjs').length-1,1);
 assert(!/continue-on-error|\n        if:/.test(step));
});
test('requirement evidence, exact authority requests, malformed-capture guards and native finder are mandatory',()=>{
 const product=workflow.split('\n  full-product:\n')[1].split('\n  validate:\n')[0];
 const marker='      - name: Batch16 requirement, schema comparison and finder acceptance\n';
 assert.equal(product.split(marker).length,2);const step=product.split(marker)[1];
 for(const command of ['node_modules/.bin/vite-node --config vitest.config.ts scripts/batch16-requirement-evidence.ts --check','node scripts/batch16-authority-requests.mjs --check','node --test tests/batch16-auth/schema-comparison.test.mjs tests/full-product-batch16/workflow.test.mjs','node tests/gotrue-runtime/acceptance.mjs','node tests/full-product-batch16/finder-browser.mjs'])assert(step.includes(command),command);
 assert.match(step,/BATCH16_FULL_SCHEMA: '1'/);
 assert(step.includes('node scripts/batch16-contract-groups.mjs --check'));
 assert(step.indexOf('node tests/gotrue-runtime/acceptance.mjs')<step.indexOf('node tests/full-product-batch16/finder-browser.mjs'),'Native auth browser and Docker cleanup precede finder module loading');
 assert(!/continue-on-error|\n        if:/.test(step));
 assert(requiredVerificationJobs(workflow).includes('publication-factory'));
 for(const variable of ['CHECKS','BUILD','FULL_PRODUCT','SOURCE_ACCEPTANCE'])assert(workflow.includes(`test "$${variable}_RESULT" = success`));
});
