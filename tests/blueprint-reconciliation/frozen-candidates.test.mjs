import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('native Blueprint historical candidate hashes remain reproducible after independent fixture engineering',()=>{
 const matrix=JSON.parse(readFileSync('docs/blueprint-reconciliation/blueprint-to-540.json','utf8'));
 const retained=matrix.architectureGroups.flatMap(g=>g.repositoryCandidateEvidence).find(e=>e.path==='tests/next-runtime/auth-fixture.mjs');
 assert.notEqual(createHash('sha256').update(readFileSync(retained.path)).digest('hex'),retained.sha256,'The regression must exercise the legitimately changed auth fixture');
 const run=spawnSync('python3',['scripts/reconcile-native-blueprint.py','--check'],{encoding:'utf8'});assert.ifError(run.error);assert.equal(run.status,0,run.stderr);assert.match(run.stdout,/540identitytraces/);
});
