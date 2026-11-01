import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {workflowJobs,requiredVerificationJobs,aggregateVerificationContract} from './verification-jobs-contract.mjs';
import { historicalWorkflowWithoutNpmCache } from './npm-cache-contract.mjs';

const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');

test('all mandatory jobs reuse npm downloads while always installing the exact lockfile', () => {
  historicalWorkflowWithoutNpmCache(workflow);
  const jobs=workflowJobs(workflow),required=requiredVerificationJobs(workflow);
  for (const name of required) {
    const body=jobs[name];
    assert.match(body, /uses: actions\/setup-node@v5\n        with:\n          node-version: 22\n          cache: npm\n          cache-dependency-path: package-lock.json\n/, name);
    assert.match(body, /      - name: Install dependencies\n        run: npm ci --no-audit --no-fund\n/, name);
    assert.doesNotMatch(body, /cache-hit|actions\/cache@|continue-on-error/, name);
  }
});

test('historical comparison accepts only the exact reviewed cache substitution', () => {
  for (const mutation of [
    workflow.replace('cache: npm', 'cache: yarn'),
    workflow.replace('cache-dependency-path: package-lock.json', 'cache-dependency-path: package.json'),
    workflow.replace('          cache: npm\n', ''),
  ]) assert.throws(() => historicalWorkflowWithoutNpmCache(mutation));
  const changedCommand = workflow.replace('npm run lint', 'true');
  assert.match(historicalWorkflowWithoutNpmCache(changedCommand), /run: true/,
    'Historical comparison must still see and reject changed verification commands');
});

for(const name of requiredVerificationJobs(workflow))test('cache mutation is rejected for '+name,()=>{const body=workflowJobs(workflow)[name];for(const replacement of ['cache: yarn','cache: false'])assert.throws(()=>historicalWorkflowWithoutNpmCache(workflow.replace(body,body.replace('cache: npm',replacement))));});

test('unrecognized or ungated extra jobs cannot evade derived coverage',()=>{
 for(const name of ['quality_v2','quality2'])assert.throws(()=>requiredVerificationJobs(workflow.replace('  validate:\n',`  ${name}:\n    runs-on: ubuntu-latest\n`+'  validate:\n')));
 assert.throws(()=>requiredVerificationJobs(workflow.replace('  validate:\n','  "quoted-job":\n    runs-on: ubuntu-latest\n  validate:\n')));
});

test('a future correctly cached and gated job is derived without a stale ordinal count',()=>{
 const expanded=workflow.replace('  validate:\n','  quality_v2:\n'+workflowJobs(workflow).build+'  validate:\n')
  .replace('source-acceptance, publication-factory]','source-acceptance, publication-factory, quality_v2]')
  .replace('          PUBLICATION_FACTORY_RESULT: ${{ needs.publication-factory.result }}','          PUBLICATION_FACTORY_RESULT: ${{ needs.publication-factory.result }}\n          QUALITY_V2_RESULT: ${{ needs.quality_v2.result }}')
  .replace('          test "$PUBLICATION_FACTORY_RESULT" = success','          test "$PUBLICATION_FACTORY_RESULT" = success\n          test "$QUALITY_V2_RESULT" = success');
 historicalWorkflowWithoutNpmCache(expanded);assert.equal(aggregateVerificationContract(expanded).names.length,requiredVerificationJobs(workflow).length+1);
});
