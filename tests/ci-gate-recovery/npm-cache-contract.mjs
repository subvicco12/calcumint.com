import assert from 'node:assert/strict';
import {workflowJobs,requiredVerificationJobs} from './verification-jobs-contract.mjs';

// The sole reviewed historical-workflow substitution: setup-node may reuse
// npm's downloaded package cache. npm ci still verifies the committed lockfile
// and creates fresh node_modules on every run, including cache hits.
export function historicalWorkflowWithoutNpmCache(source) {
  const cachedSetup = '          node-version: 22\n          cache: npm\n          cache-dependency-path: package-lock.json\n';
  const jobs=workflowJobs(source),required=requiredVerificationJobs(source);
  for(const name of required)assert.equal(jobs[name].split(cachedSetup).length-1,1,
    'Mandatory job '+name+' must use the exact lockfile-keyed npm download cache');
  assert.equal(source.split(cachedSetup).length-1,required.length,'No unaccounted cached setup');
  return source.replaceAll(cachedSetup, '          node-version: 22\n');
}
