import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const old=readFileSync('docs/partial16-ci-recovery/ci-at-9edc900.yml','utf8'),current=readFileSync('.github/workflows/ci.yml','utf8');
const jobs=source=>Object.fromEntries([...source.split('\njobs:\n')[1].matchAll(/^  ([a-z][a-z-]*):\n([\s\S]*?)(?=^  [a-z][a-z-]*:\n|$(?![\s\S]))/gm)].map(m=>[m[1],m[2]]));
const steps=job=>[...job.matchAll(/^      - ([\s\S]*?)(?=^      - |$(?![\s\S]))/gm)].map(m=>'      - '+m[1]);
test('all original checks remain byte-for-byte with20minute per-job budgets',()=>{
 const before=jobs(old),after=jobs(current);assert.deepEqual(Object.keys(after).sort(),['build','checks','validate']);
 const originalSteps=steps(before.validate),build=originalSteps.find(s=>s.startsWith('      - name: Production build\n'));assert(build);
 assert.deepEqual(steps(after.checks).slice(0,originalSteps.length-1),originalSteps.filter(s=>s!==build));
 assert.deepEqual(steps(after.build),[...originalSteps.slice(0,3),build]);
 for(const name of ['checks','build'])assert.match(after[name],/^    timeout-minutes: 20$/m);
 assert.equal(current.split('\njobs:')[0],old.split('\njobs:')[0],'Triggers,concurrency,permissions unchanged');
});
test('required validate runs after both jobs,including skipped/cancelled/failure paths',()=>{
 const gate=jobs(current).validate;assert.match(gate,/^    needs: \[checks, build\]$/m);assert.match(gate,/^    if: \$\{\{ always\(\) \}\}$/m);assert.match(gate,/CHECKS_RESULT: \$\{\{ needs\.checks\.result \}\}/);assert.match(gate,/BUILD_RESULT: \$\{\{ needs\.build\.result \}\}/);
});
for(const checks of ['success','failure','cancelled','skipped','timed_out','','unknown'])for(const build of ['success','failure','cancelled','skipped','timed_out','','unknown'])test(`actual aggregate shell fails closed for checks=${checks||'empty'},build=${build||'empty'}`,()=>{
 const gate=jobs(current).validate;assert(gate,'Missing required aggregate');const block=gate.match(/        run: \|\n([\s\S]*)$/);assert(block,'Missing aggregate shell');const script=block[1].split('\n').filter(Boolean).map(s=>s.slice(10)).join('\n');
 const run=spawnSync('bash',['-e','-c',script],{env:{PATH:process.env.PATH,CHECKS_RESULT:checks,BUILD_RESULT:build},encoding:'utf8'});assert.ifError(run.error);assert.equal(run.status===0,checks==='success'&&build==='success');
});
