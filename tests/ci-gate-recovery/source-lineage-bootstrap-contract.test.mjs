import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {historicalWorkflowWithoutSourceLineageBootstrap as normalize,sourceLineageBootstrapStep as step} from './source-lineage-bootstrap-contract.mjs';
const source=readFileSync('.github/workflows/ci.yml','utf8');
test('exact additive source bootstrap is validated and removed without changing other bytes',()=>{
  const normalized=normalize(source);assert.equal(normalized,source.split(step).join(''));assert.equal(source.split(step).length-1,5);
});
test('source bootstrap deletion, command change, duplicate and post-install movement fail closed',()=>{
  const install='      - name: Install dependencies\n        run: npm ci --no-audit --no-fund\n';
  for(const mutated of [source.replace(step,''),source.replace('node scripts/fetch-source-lineage.mjs','node scripts/fetch-source-lineage.mjs || true'),source.replace(step,step+step),source.replace(step+install,install+step)])assert.throws(()=>normalize(mutated));
});
test('bootstrap normalization never conceals changes to required verification commands',()=>{
  const mutated=source.replace('npm run test:certification','echo omitted');
  assert(normalize(mutated).includes('echo omitted'));assert(!normalize(mutated).includes('npm run test:certification'));
});
