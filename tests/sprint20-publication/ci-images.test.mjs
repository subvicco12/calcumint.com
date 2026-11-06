import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {images} from '../gotrue-runtime/fixture.mjs';
const workflow=readFileSync('.github/workflows/ci.yml','utf8');
test('fresh publication-factory runner provisions every fixture image before acceptance',()=>{
 const job=workflow.split('  publication-factory:\n')[1]?.split('\n  validate:')[0];assert(job);
 const setup=job.indexOf('- name: Prepare pinned provisioning runtime');
 assert(setup>=0,'Provisioning runtime setup is required on this separate runner');
 assert(setup<job.indexOf('- name: Guarded atomic draft inventory acceptance'));
 const step=job.slice(setup,job.indexOf('\n      - name:',setup+1));
 assert(step.includes('tests/gotrue-runtime/fixture.mjs'));
 assert(step.includes('Object.values(images)'));
 assert(step.includes('["pull", image]'));
 assert.deepEqual(Object.keys(images).sort(),['gotrue','postgres','postgrest']);
 for(const image of Object.values(images))assert.match(image,/@sha256:[a-f0-9]{64}$/);
});
