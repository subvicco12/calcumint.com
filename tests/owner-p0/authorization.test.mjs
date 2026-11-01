import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=path=>JSON.parse(readFileSync(new URL('../../'+path,import.meta.url)));
test('new owner instruction authorizes engineering without rewriting old pending evidence or release gates',()=>{
 const a=load('docs/owner-p0/authorization.json'),old=load('docs/p0-decision-contracts/owner-register.json');
 assert.deepEqual(a.decisions.map(d=>d.id),['OC-01-CALCULUS','OPS-01-MEMBERSHIP','OPS-02-WRITERS-ACL','OPS-03-ADOPTION']);
 assert(a.decisions.every(d=>d.status==='ENGINEERING_DESIGN_AUTHORIZED'));
 for(const key of ['canonicalRoutingAuthorized','qualifiedApplicabilityApproved','productionSqlAdoptionAuthorized','certificationAuthorized','publicationAuthorized','mergeAuthorized','deploymentAuthorized','paymentActivationAuthorized'])assert.equal(a[key],false);
 assert.equal(a.releaseHold,true);assert(old.decisions.every(d=>d.status==='PENDING'&&d.ownerAnswer===null));
});
