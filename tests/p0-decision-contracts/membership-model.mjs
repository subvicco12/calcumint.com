// Isolated decision oracle, not a database implementation or policy approval.
// Fact inputs are synthetic preconditions, never authenticated evidence.
export function simulateMembership(contract,alternativeId,s) {
 const base={oracleOnly:true,activationAuthorized:false,members:s.members,role:s.existingRole,event:null};
 const a=contract.alternatives.find(a=>a.id===alternativeId);
 const result=outcome=>({...base,outcome});
 if(!a)return result('BLOCKED_SELECTION');
 if(!Number.isSafeInteger(s.members)||s.members<0||!Number.isSafeInteger(s.otherReservations)||s.otherReservations<0||![s.afterLock,s.commit,s.expiresAt].every(Number.isFinite)||s.commit<s.afterLock||(s.revokedAt!==null&&!Number.isFinite(s.revokedAt))||typeof s.alreadyRedeemed!=='boolean'||typeof s.identityRewrite!=='boolean'||(s.existingRole!==null&&(!['owner','admin','manager','member','viewer'].includes(s.existingRole)||s.members===0)))throw Error('Malformed synthetic scenario');
 if(s.identityVerified!==true||s.issuanceAuthorityVerified!==true||s.invitationRole===undefined||(a.capacity==='members_and_unique_live_reservations'&&s.reservationSubjectsVerified!==true))return result('BLOCKED_PREREQUISITE');
 if(!contract.sourceEstablished.invitationRoles.includes(s.invitationRole))return result('SIMULATED_REJECT_INVITATION_ROLE');
 if(s.members>contract.sourceEstablished.seatCeiling)return result('BLOCKED_LEGACY_STATE');
 if(s.identityRewrite)return result('SIMULATED_REJECT_IDENTITY');
 if(s.alreadyRedeemed)return result(a.replay==='return_prior_no_new_effect'?'SIMULATED_REPLAY_PRIOR':'SIMULATED_REPLAY_REJECT');
 const point=a.expiryPoint==='final_commit_check'?s.commit:s.afterLock;
 if(s.revokedAt!==null&&s.revokedAt<=point)return result('SIMULATED_REJECT_REVOKED');
 if(s.expiresAt<=point)return result('SIMULATED_REJECT_EXPIRY');
 if(s.existingRole){
  if((s.existingRole==='owner'?a.existingOwner:a.existingMember)==='reject')return result('SIMULATED_REJECT_EXISTING');
  return {...result('SIMULATED_NOOP'),event:'invitation.accepted_noop'};
 }
 const occupied=s.members+1+(a.capacity==='members_and_unique_live_reservations'?s.otherReservations:0);
 if(occupied>contract.sourceEstablished.seatCeiling)return result('SIMULATED_REJECT_CAPACITY');
 return {...result('SIMULATED_ADMIT'),members:s.members+1,role:s.invitationRole,event:'member.joined'};
}
