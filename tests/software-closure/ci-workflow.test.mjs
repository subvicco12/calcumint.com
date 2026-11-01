import {requiredVerificationJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('software closure evidence and both recovery browsers remain mandatory after prior acceptance', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  const fullProduct = workflow.split('\n  full-product:\n')[1].split('\n  validate:\n')[0];
  const marker = '      - name: Software closure evidence and recovery lifecycle browser acceptance\n';
  assert.equal(fullProduct.split(marker).length, 2);
  const step = fullProduct.split(marker)[1];
  assert.match(step, /^        run: \|\n          node scripts\/software-closure-evidence\.mjs --check\n          node --test tests\/software-closure\/ci-workflow\.test\.mjs\n          node tests\/calculus-recovery-workbench\/browser\.mjs\n          node tests\/software-closure\/recovery-browser\.mjs\n/);
  assert.doesNotMatch(step, /continue-on-error|\n        if:/);
  assert(fullProduct.indexOf('node tests/gotrue-full-schema/acceptance.mjs') < fullProduct.indexOf(marker));
  assert(requiredVerificationJobs(workflow).includes('publication-factory'));
  assert.match(workflow, /test "\$FULL_PRODUCT_RESULT" = success/);
});
