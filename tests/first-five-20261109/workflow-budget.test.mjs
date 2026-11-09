import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
const source='b2d72aa66293b752739b7924745a57a51c4b5acb';
test('publication job receives a bounded cumulative budget without deleting or relaxing any individual verification',()=>{
 const before=execFileSync('git',['show',source+':.github/workflows/ci.yml'],{encoding:'utf8'});
 const old='  publication-factory:\n    runs-on: ubuntu-latest\n    timeout-minutes: 18';assert.equal(before.split(old).length,2);
 const successor='  publication-factory:\n    runs-on: ubuntu-latest\n    # Run42648534309 exhausted18min after152 successful journeys; retain every\n    # acceptance step and its own tighter timeout within a bounded25min job.\n    timeout-minutes: 25';
 assert.equal(readFileSync('.github/workflows/ci.yml','utf8'),before.replace(old,successor),'Every other byte, job, command, step timeout and aggregate remains unchanged');
});
