import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
test('all 540 inherited rows reconcile with bounded deltas and no approval promotion',()=>{
 const result=JSON.parse(execFileSync('python3',['scripts/calculator-sprint-20261108/ledger.py','--check'],{encoding:'utf8'}));
 assert.equal(result.rows,540);assert.equal(result.sharedWorkflowProfilesImproved,65);assert.equal(result.newCanonicalAcceptances,0);
 const ledger=JSON.parse(readFileSync('docs/calculator-sprint-20261108/requirements-540.json'));
 assert.deepEqual(ledger.rows.map(r=>r.masterId),Array.from({length:540},(_,i)=>i+1));assert.equal(Object.values(ledger.counts).reduce((a,b)=>a+b,0),540);
 assert.equal(ledger.newEngineeringCompleteFullProducts,0);assert.equal(ledger.newPublicationEligible,0);assert.equal(ledger.authorityBlockersResolved,0);
 assert(ledger.rows.every(r=>!r.canonicalAccepted&&!r.certificationGranted&&!r.publicationEligibleEstablished));
 assert.equal(ledger.rows.filter(r=>r.privateProfile).length,65);assert.equal(ledger.rows.filter(r=>r.authorityActionRegister).length,43);
});
