import {requiredVerificationJobs,aggregateVerificationContract} from './verification-jobs-contract.mjs';
import { historicalWorkflowWithoutPdfTools } from '../ci-gate-recovery/pdf-tools-contract.mjs';
import { historicalWorkflowWithoutNpmCache } from '../ci-gate-recovery/npm-cache-contract.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const old=readFileSync('docs/partial16-ci-recovery/ci-at-9edc900.yml','utf8'),current=historicalWorkflowWithoutPdfTools(historicalWorkflowWithoutNpmCache(readFileSync('.github/workflows/ci.yml','utf8')));
const jobs=source=>Object.fromEntries([...source.split('\njobs:\n')[1].matchAll(/^  ([a-z][a-z-]*):\n([\s\S]*?)(?=^  [a-z][a-z-]*:\n|$(?![\s\S]))/gm)].map(m=>[m[1],m[2]]));
const steps=job=>[...job.matchAll(/^      - ([\s\S]*?)(?=^      - |$(?![\s\S]))/gm)].map(m=>'      - '+m[1]);
test('all original checks remain byte-for-byte with20minute per-job budgets',()=>{
 const before=jobs(old),after=jobs(current);assert.deepEqual(Object.keys(after).sort(),[...requiredVerificationJobs(current),'validate'].sort());
 const originalSteps=steps(before.validate),build=originalSteps.find(s=>s.startsWith('      - name: Production build\n'));assert(build);
 assert.deepEqual([...steps(after.checks),...steps(after['source-acceptance']).slice(5)].slice(0,originalSteps.length-1),originalSteps.filter(s=>s!==build));
 // Preserve every original byte and require the exact three additional verification steps.
 const additions=["      - name: Provision pinned isolated browser for contract acceptance\n        timeout-minutes: 4\n        run: |\n          browser=$(sh scripts/install-ci-browser.sh \"$RUNNER_TEMP\")\n          echo \"CHROMIUM_PATH=$browser\" >> \"$GITHUB_ENV\"\n          \"$browser\" --version\n", "      - name: Reusable private canonical contract evidence and browser acceptance\n        run: |\n          python3 scripts/canonical-validation-source.py --check\n          node scripts/canonical-validation-evidence.mjs --check\n          node tests/canonical-validation/browser.mjs\n          node tests/canonical-validation/workflow-browser.mjs\n        env:\n          VALIDATION_EVIDENCE: ${{ runner.temp }}\n", "      - name: Expanded immutable validation revision and source acceptance\n        run: |\n          python3 scripts/scale-validation-source.py --check\n          python3 tests/validation-scale/source.test.py\n          node scripts/scale-validation-evidence.mjs --check\n          node tests/validation-scale/browser.mjs\n          node tests/validation-scale/workflow-browser.mjs\n        env:\n          SCALE_EVIDENCE: ${{ runner.temp }}\n"];
 assert.deepEqual(steps(after.build),[...originalSteps.slice(0,3),build,...additions]);
 for(const name of ['checks','build','full-product','source-acceptance'])assert.match(after[name],/^    timeout-minutes: 20$/m);
 assert.equal(current.split('\njobs:')[0],old.split('\njobs:')[0],'Triggers,concurrency,permissions unchanged');
});
const aggregate=aggregateVerificationContract(current);
test('required validate checks every workflow verification job including the publication factory',()=>{assert.equal(aggregate.names.length,Object.keys(jobs(current)).length-1);assert.equal(aggregate.bindings.length,aggregate.names.length);});
const execute=env=>{const run=spawnSync('bash',['-e','-c',aggregate.script],{env:{PATH:process.env.PATH,...env},encoding:'utf8'});assert.ifError(run.error);return run.status===0;};
const allSuccess=Object.fromEntries(aggregate.bindings.map(b=>[b.variable,'success']));
test('actual aggregate succeeds only when every required job succeeds',()=>assert.equal(execute(allSuccess),true));
for(const {job,variable}of aggregate.bindings)for(const status of ['failure','cancelled','skipped','timed_out','','unknown'])test(`actual aggregate refuses ${job}=${status||'empty'}`,()=>assert.equal(execute({...allSuccess,[variable]:status}),false));
for(const {job,variable}of aggregate.bindings)test('aggregate rejects deletion of the '+job+' guard',()=>assert.throws(()=>aggregateVerificationContract(current.replace(`          test "$${variable}" = success\n`,''))));

test('full-product job requires both functional browser campaigns and exact aggregate result',()=>{
 const j=jobs(current);for(const command of ['node tests/full-product-batch12/private-browser.mjs','node tests/full-product-batch12/account-browser.mjs'])assert(j['full-product'].includes(command));
 assert.match(j.validate,/FULL_PRODUCT_RESULT: \$\{\{ needs\.full-product\.result \}\}/);
 assert(!/continue-on-error/.test(current));
});
