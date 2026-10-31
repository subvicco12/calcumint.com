import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { historicalWorkflowWithoutNpmCache } from './npm-cache-contract.mjs';

const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');

test('all mandatory jobs reuse npm downloads while always installing the exact lockfile', () => {
  historicalWorkflowWithoutNpmCache(workflow);
  const jobs = [...workflow.matchAll(/^  (checks|source-acceptance|build|full-product):\n([\s\S]*?)(?=^  [a-z][a-z-]*:|$(?![\s\S]))/gm)];
  assert.equal(jobs.length, 4);
  for (const [, name, body] of jobs) {
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
