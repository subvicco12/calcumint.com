import {workflowJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const yaml=readFileSync('.github/workflows/ci.yml','utf8'),job=workflowJobs(yaml)['full-product'];
test('genuine-auth and private sensitivity are mandatory bounded sequential CI steps',()=>{
 assert.match(job,/timeout-minutes: 20/);assert(job.includes('docker pull supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b'));
 const commands=['node tests/full-product-batch12/private-browser.mjs','node tests/full-product-batch12/account-browser.mjs','node scripts/check-batch13-evidence.mjs','node --test tests/next-runtime/cdp-network-diagnostics.test.mjs','node tests/full-product-batch13/private-browser.mjs','node tests/gotrue-runtime/acceptance.mjs'];let position=-1;for(const command of commands){const next=job.indexOf(command);assert(next>position,command+' must execute in sequence');position=next;}
 assertMandatoryAcceptance(job);
});
test('immutable native evidence source is fetched before unchanged strict reconciliation',()=>{
 const fetch=yaml.indexOf('git fetch --no-tags --depth=1 origin 50f307c67e3a5e5d289d2b83e2a285029151f866');assert(fetch>0);assert(yaml.indexOf('python3 scripts/reconcile-native-blueprint.py --check')>fetch);
});

function assertMandatoryAcceptance(job){
 assert(!/^    if:|continue-on-error/m.test(job),'Verification job cannot be skipped or ignored');
 const steps=[...job.matchAll(/^      - [\s\S]*?(?=^      - |$(?![\s\S]))/gm)].map(m=>m[0]);
 for(const step of steps.filter(step=>/^        if:/m.test(step))){assert(step.startsWith('      - name: Preserve Batch21 primary failure and browser evidence\n'));assert.match(step,/^        if: always\(\)\n/m);assert.match(step,/uses: actions\/upload-artifact@v4/);assert(!/^        run:/m.test(step));}
 const acceptance=steps.filter(step=>/^        run:/m.test(step));assert(acceptance.length>0);
 for(const step of acceptance)assert(!/^        if:|continue-on-error|\s&\s*$/m.test(step),'Acceptance may not be skipped, ignored or backgrounded');
}
for(const flag of ['        if: false\n','        continue-on-error: true\n'])test('actual acceptance rejects '+flag.trim(),()=>assert.throws(()=>assertMandatoryAcceptance(job.replace('      - name: Exact Batch13 540-ID requirement deltas\n','      - name: Exact Batch13 540-ID requirement deltas\n'+flag))));
test('conditional artifact preservation cannot weaken acceptance or background its commands',()=>{
 assertMandatoryAcceptance(job);
 assert.throws(()=>assertMandatoryAcceptance(job.replace('          node scripts/check-batch13-evidence.mjs','          node scripts/check-batch13-evidence.mjs &')));
 assert.throws(()=>assertMandatoryAcceptance('    if: false\n'+job));
 assert.throws(()=>assertMandatoryAcceptance(job.replace('      - name: Checkout\n','      - name: Checkout\n        if: false\n')));
});
