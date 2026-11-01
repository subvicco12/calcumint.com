import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {simulateMembership} from './membership-model.mjs';
const contract=JSON.parse(readFileSync(new URL('../../docs/p0-decision-contracts/membership.json',import.meta.url)));
const scenario={members:4,existingRole:null,otherReservations:0,afterLock:100,commit:120,expiresAt:150,revokedAt:null,alreadyRedeemed:false,identityRewrite:false,identityVerified:true,invitationRole:'member',issuanceAuthorityVerified:true,reservationSubjectsVerified:true};
test('unselected or unknown policy never falls back to recommendation',()=>{
 assert.equal(simulateMembership(contract,null,scenario).outcome,'BLOCKED_SELECTION');
 assert.equal(simulateMembership(contract,'unknown',scenario).outcome,'BLOCKED_SELECTION');
 assert.equal(contract.selected,null);assert.equal(contract.policyApproved,false);
});
test('existing owner/member alternatives preserve identity, role and seat at capacity',()=>{
 for(const existingRole of ['owner','viewer']){
  const s={...scenario,members:5,existingRole};
  assert.equal(simulateMembership(contract,'M-REJECT-EXISTING',s).outcome,'SIMULATED_REJECT_EXISTING');
  const r=simulateMembership(contract,'M-IDEMPOTENT',s);assert.equal(r.outcome,'SIMULATED_NOOP');assert.equal(r.members,5);assert.equal(r.role,existingRole);assert.equal(r.event,'invitation.accepted_noop');assert.equal(r.activationAuthorized,false);
 }
});
test('new distinct user and live reservations follow the selected capacity rule',()=>{
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,members:5}).outcome,'SIMULATED_REJECT_CAPACITY');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,otherReservations:1}).outcome,'SIMULATED_ADMIT');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT-RESERVATIONS',{...scenario,otherReservations:1}).outcome,'SIMULATED_REJECT_CAPACITY');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT-RESERVATIONS',{...scenario,otherReservations:0}).outcome,'SIMULATED_ADMIT');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT-RESERVATIONS',{...scenario,reservationSubjectsVerified:false}).outcome,'BLOCKED_PREREQUISITE');
});
test('replay alternatives never append a joined audit or another seat',()=>{
 for(const id of ['M-IDEMPOTENT','M-REJECT-EXISTING']){const r=simulateMembership(contract,id,{...scenario,alreadyRedeemed:true});assert.equal(r.members,4);assert.equal(r.event,null);assert.match(r.outcome,/REPLAY/);}
});
test('lock-point and final-commit guarantees differ and equality is expired',()=>{
 const between={...scenario,expiresAt:110};assert.equal(simulateMembership(contract,'M-IDEMPOTENT',between).outcome,'SIMULATED_ADMIT');assert.equal(simulateMembership(contract,'M-IDEMPOTENT-COMMIT-CHECK',between).outcome,'SIMULATED_REJECT_EXPIRY');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,expiresAt:100}).outcome,'SIMULATED_REJECT_EXPIRY');
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,revokedAt:100}).outcome,'SIMULATED_REJECT_REVOKED');
});
test('missing identity/writer facts and identity rewrites fail closed in every model',()=>{
 for(const a of contract.alternatives){assert.equal(simulateMembership(contract,a.id,{...scenario,identityRewrite:true}).outcome,'SIMULATED_REJECT_IDENTITY');assert.equal(simulateMembership(contract,a.id,{...scenario,identityVerified:false}).outcome,'BLOCKED_PREREQUISITE');assert.equal(simulateMembership(contract,a.id,{...scenario,issuanceAuthorityVerified:false}).outcome,'BLOCKED_PREREQUISITE');}
});

test('verified invitation roles are preserved; absent/unsupported roles never default',()=>{
 for(const invitationRole of ['admin','manager','member','viewer']){const r=simulateMembership(contract,'M-IDEMPOTENT',{...scenario,invitationRole});assert.equal(r.outcome,'SIMULATED_ADMIT');assert.equal(r.role,invitationRole);}
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,invitationRole:undefined}).outcome,'BLOCKED_PREREQUISITE');
 for(const invitationRole of ['owner','superadmin'])assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,invitationRole}).outcome,'SIMULATED_REJECT_INVITATION_ROLE');
});
test('contradictory synthetic states reject rather than being treated as valid policy evidence',()=>{
 for(const patch of [{members:-1},{members:0,existingRole:'owner'},{existingRole:'unknown'},{commit:99}])assert.throws(()=>simulateMembership(contract,'M-IDEMPOTENT',{...scenario,...patch}));
 assert.equal(simulateMembership(contract,'M-IDEMPOTENT',{...scenario,members:6}).outcome,'BLOCKED_LEGACY_STATE');
});
