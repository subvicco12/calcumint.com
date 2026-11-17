import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
test('540 inherited dispositions reproduce with only source-scoped technical deltas',()=>{
 const output=JSON.parse(execFileSync('python3',['scripts/acceptance-closure-20261108/ledger.py','--check'],{encoding:'utf8'}));assert.equal(output.rows,540);assert.equal(output.newWorkflowProfiles,51);assert.equal(output.newPublicationEligible,0);
 const ledger=JSON.parse(readFileSync('docs/acceptance-closure-20261108/requirements-540.json'));assert.equal(ledger.newFullEngineeringComplete,0);assert.equal(ledger.cumulativePrivateWorkflowProfilesImproved,116);assert.equal(ledger.rows.filter(r=>r.privateTechnicalProfile).length,51);assert.deepEqual(ledger.rows.map(r=>r.masterId),Array.from({length:540},(_,i)=>i+1));assert(ledger.rows.every(r=>!r.canonicalAccepted&&!r.certificationGranted&&!r.publicationEligibleEstablished));
 for(const row of ledger.rows.filter(r=>r.privateTechnicalProfile)){const replay=row.newScopedChecks[1];assert.equal(replay.status,row.masterId===477?'VERIFIED':'PARTIAL');}
});
