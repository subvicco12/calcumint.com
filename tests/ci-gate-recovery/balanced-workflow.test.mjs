import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyBalancedWorkflow,historicalWorkflowBeforeBalance,restoreBalancedLayout} from '../ci-balance-20261113/workflow.mjs';
import {balancePolicy} from '../ci-balance-20261113/policy.mjs';
const source=readFileSync('.github/workflows/ci.yml','utf8');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:8000000});
test('all existing campaigns relocate byte-for-byte while five jobs and deadlines remain mandatory',()=>{
 assert.equal(verifyBalancedWorkflow().current.ref,balancePolicy.codeRef);assert.equal(historicalWorkflowBeforeBalance(source),git(['show',balancePolicy.predecessorRef+':.github/workflows/ci.yml']).toString());
});
test('campaign removal, weakening, duplicate, moved-unit and deadline changes fail closed',()=>{
 for(const candidate of [source.replace('npm run test:final-reference-browser','echo omitted'),source.replace('node tests/canonical-calculus-workbench/browser.mjs','node tests/canonical-calculus-workbench/browser.mjs || true'),source.replace('timeout-minutes: 20','timeout-minutes: 21'),source.replace('run: npm test','run: echo omitted')])assert.throws(()=>historicalWorkflowBeforeBalance(candidate));
});
test('current workflow tamper, retained-valid reversion and substituted proof objects fail closed',()=>{
 const before=git(['show',balancePolicy.predecessorRef+':.github/workflows/ci.yml']);
 for(const b of [before,Buffer.from('tampered workflow')])assert.throws(()=>verifyBalancedWorkflow({read:p=>p==='.github/workflows/ci.yml'?b:readFileSync(p)}));
 assert.throws(()=>verifyBalancedWorkflow({git:args=>args[0]==='rev-parse'&&args[1].includes(':.github/workflows/ci.yml')?Buffer.from('0'.repeat(40)+'\n'):git(args)}));
});

test('legacy layout projection preserves unrelated verification mutations instead of approving them',()=>{
 const changed=source.replace('npm run test:certification','echo omitted');assert(restoreBalancedLayout(changed).includes('echo omitted'));assert.throws(()=>historicalWorkflowBeforeBalance(changed));
});
