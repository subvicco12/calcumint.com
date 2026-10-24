import {expect,it} from 'vitest';
import {AuthApiError,AuthRetryableFetchError,AuthSessionMissingError} from '@supabase/supabase-js';
import {requiresSignIn,authFailureMessage,safeAuthErrorNotice,safeAuthConfirmationNotice,AUTH_CONFIRMATION_NOTICE,AUTH_TEMPORARILY_UNAVAILABLE} from './auth-recovery';
it.each(['session_not_found','session_expired','refresh_token_not_found','refresh_token_already_used'])('recognizes SDK terminal code %s without using raw messages',code=>{
 expect(requiresSignIn(new AuthApiError('sensitive detail',400,code))).toBe(true);
});
it('recognizes the SDK missing-session class but not lookalike messages or transient failures',()=>{
 expect(requiresSignIn(new AuthSessionMissingError())).toBe(true);
 for(const error of [null,undefined,true,'session_expired',{message:'Auth session missing!'},{code:'session_expired'},new Error('session_expired'),new AuthRetryableFetchError('private',0),new AuthApiError('private',401,'bad_jwt')])expect(requiresSignIn(error)).toBe(false);
});
it.each(['signin','signup','oauth'] as const)('redacts unknown %s errors and preserves retryable recovery',operation=>{
 expect(authFailureMessage({message:'sensitive detail'},operation)).not.toContain('sensitive');expect(authFailureMessage(new AuthRetryableFetchError('sensitive',0),operation)).toBe(AUTH_TEMPORARILY_UNAVAILABLE);
});
it.each([['invalid_credentials','Invalid credentials'],['email_not_confirmed','Confirm your email before signing in.'],['over_request_rate_limit','Too many attempts. Wait a moment and try again.']])('maps known code %s to controlled copy', (code,copy)=>{
 expect(authFailureMessage(new AuthApiError('sensitive detail',400,code),'signin')).toBe(copy);
});
it('does not echo query-supplied notices or infer successful confirmation from unknown text',()=>{
 expect(safeAuthErrorNotice('sensitive detail')).toBe('Authentication could not finish. Try again.');
 expect(safeAuthConfirmationNotice('sensitive detail')).toBeUndefined();expect(safeAuthConfirmationNotice(AUTH_CONFIRMATION_NOTICE)).toBe(AUTH_CONFIRMATION_NOTICE);
 for(const value of [null,undefined,{},[],['sensitive'],0,''])expect(safeAuthErrorNotice(value)).toBeUndefined();
});

it('allows only the application-owned password reset success notice',()=>{expect(safeAuthConfirmationNotice('Your password has been updated. Sign in with your new password.')).toBe('Your password has been updated. Sign in with your new password.');expect(safeAuthConfirmationNotice('Provider password detail')).toBeUndefined();});
