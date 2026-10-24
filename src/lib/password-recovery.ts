import type { SupabaseClient } from '@supabase/supabase-js';

export const PASSWORD_RESET_UNCONFIRMED_NOTICE = 'Your password has been updated, but sign-out could not be confirmed. Sign in with your new password, then sign out to end other sessions.';
export const PASSWORD_RESET_COMPLETE_NOTICE = 'Your password has been updated. Sign in with your new password.';
export const PASSWORD_RECOVERY_SENT = 'If an account exists for this email, a password reset link has been sent.';
export const PASSWORD_RECOVERY_INVALID = 'This reset link is invalid or expired. Request a new link.';
export type PasswordRecoveryState = {status:'idle'|'sent'|'error'|'uncertain';message:string};

/** Provider-signed recovery authority, never a decoded cookie or browser event. */
export async function verifiedPasswordRecovery(client:Pick<SupabaseClient,'auth'>,now=Math.floor(Date.now()/1000)) {
  const unavailable=()=>new Error(PASSWORD_RECOVERY_INVALID);
  const user=await client.auth.getUser();
  if(user.error||!user.data.user?.id)throw unavailable();
  const verified=await client.auth.getClaims();
  const claims=verified.data?.claims;
  if(verified.error||!claims||claims.sub!==user.data.user.id||typeof claims.session_id!=='string'||!claims.session_id||!Number.isFinite(claims.exp)||claims.exp<=now)throw unavailable();
  const recovery=Array.isArray(claims.amr)&&claims.amr.some(entry=>typeof entry==='object'&&entry!==null&&entry.method==='recovery'&&typeof entry.timestamp==='number'&&Number.isInteger(entry.timestamp)&&entry.timestamp<=now+30&&entry.timestamp>=now-600);
  if(!recovery)throw unavailable();
  return {ownerId:user.data.user.id,sessionId:claims.session_id};
}
