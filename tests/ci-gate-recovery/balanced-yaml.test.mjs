import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import yaml from 'js-yaml';
import {balancePolicy} from '../ci-balance-20261113/policy.mjs';
import {verifyBalancedWorkflow} from '../ci-balance-20261113/workflow.mjs';
verifyBalancedWorkflow();
const before=execFileSync('git',['show',balancePolicy.predecessorRef+':.github/workflows/ci.yml'],{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:8000000});
const current=readFileSync('.github/workflows/ci.yml','utf8');
function exactGraph(source){
 const a=yaml.load(before),b=yaml.load(source);assert.deepEqual(Object.keys(b),Object.keys(a));
 assert.deepEqual(Object.keys(b.jobs),Object.keys(a.jobs));
 for(const name of Object.keys(a.jobs)){
  const {steps:prior,...controls}=a.jobs[name],{steps:now,...actualControls}=b.jobs[name];
  assert.deepEqual(actualControls,controls,name+' preserves needs, condition, timeout, permissions and every other job control');
  if(name==='source-acceptance')assert.deepEqual(now,prior.slice(0,-10));
  else if(name==='build')assert.deepEqual(now,[...prior,a.jobs['source-acceptance'].steps.find(s=>s.name==='Require independent PDF reader and renderer'),...a.jobs['source-acceptance'].steps.slice(-10)]);
  else assert.deepEqual(now,prior,name+' preserves all step objects and ordering');
 }
}
test('parsed YAML proves exact five-job graph and every original step/run/env/condition with exact tail relocation',()=>exactGraph(current));
test('parsed graph rejects the concatenated invalid YAML and skipped or weakened commands',()=>{
 assert.throws(()=>exactGraph(current.replace('SCALE_EVIDENCE: ${{ runner.temp }}\n','SCALE_EVIDENCE: ${{ runner.temp }}')));
 for(const command of ['npm run test:certification','node tests/canonical-calculus-workbench/browser.mjs','node --test tests/ci-gate-recovery/*.test.mjs'])assert.throws(()=>exactGraph(current.replace(command,'echo skipped')));
});
