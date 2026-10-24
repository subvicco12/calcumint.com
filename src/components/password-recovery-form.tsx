"use client";

import {useActionState,useEffect,useId,useRef} from 'react';
import Link from 'next/link';
import {requestPasswordReset,completePasswordReset,signOut} from '@/app/login/actions';
import type {PasswordRecoveryState} from '@/lib/password-recovery';
import {AccountSessionBoundary} from './account-session-boundary';

export function PasswordRecoveryForm({ownerId,sessionId}:{ownerId?:string;sessionId?:string}) {
  const reset=!!ownerId;
  const [state,action,pending]=useActionState(reset?completePasswordReset:requestPasswordReset,{status:'idle',message:''} as PasswordRecoveryState);
  const notice=useRef<HTMLParagraphElement>(null),id=useId();
  useEffect(()=>{if(state.message)notice.current?.focus();},[state]);
  const done=state.status==='updated'||state.status==='uncertain';
  const content=<>
    {state.message&&<p id={`${id}-notice`} ref={notice} tabIndex={-1} role={state.status==='error'||state.status==='uncertain'?'alert':'status'} aria-atomic="true">{state.message}</p>}
    {!done&&<form action={action} className="form-stack" aria-busy={pending}>
      <fieldset disabled={pending} className="form-stack" style={{border:0,padding:0,margin:0,minWidth:0}}>
        <legend className="sr-only">{reset?'Choose a new password':'Request a password reset'}</legend>
        {reset?<>
          <input type="hidden" name="expectedOwnerId" value={ownerId}/><input type="hidden" name="expectedSessionId" value={sessionId}/>
          <label>New password<input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={1024} aria-describedby={`${id}-help`}/></label>
          <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={1024} aria-describedby={`${id}-help`}/></label>
          <p id={`${id}-help`}>Use at least 8 characters. Both passwords must match exactly.</p>
        </>:<label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>}
        <button className="button primary" type="submit" disabled={pending}>{pending?(reset?'Updating…':'Sending…'):(reset?'Update password':'Send reset link')}</button>
      </fieldset>
    </form>}
    {state.needsSignOut&&<form action={signOut}><button className="button secondary" type="submit">Sign out</button></form>}
    {(reset||state.status==='sent')&&<p><Link href="/login/forgot" className="text-link">Request a new reset link</Link></p>}
    <p><Link href="/login" className="text-link">{done?'Sign in':'Back to sign in'}</Link></p>
  </>;
  // Successful/uncertain mutation outcomes outlive local sign-out. Remove all
  // password controls and do not repeat an update whose outcome is unconfirmed.
  return reset&&!done?<AccountSessionBoundary ownerId={ownerId!}>{content}</AccountSessionBoundary>:content;
}
