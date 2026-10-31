import assert from 'node:assert/strict';

// The sole reviewed historical-workflow substitution: setup-node may reuse
// npm's downloaded package cache. npm ci still verifies the committed lockfile
// and creates fresh node_modules on every run, including cache hits.
export function historicalWorkflowWithoutNpmCache(source) {
  const cachedSetup = '          node-version: 22\n          cache: npm\n          cache-dependency-path: package-lock.json\n';
  assert.equal(source.split(cachedSetup).length - 1, 4,
    'All four mandatory jobs must use the exact lockfile-keyed npm download cache');
  return source.replaceAll(cachedSetup, '          node-version: 22\n');
}
