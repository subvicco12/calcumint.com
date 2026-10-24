import type {Metadata} from 'next';
import Link from 'next/link';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {verifiedPasswordRecovery,PASSWORD_RECOVERY_INVALID} from '@/lib/password-recovery';
import {PasswordRecoveryForm} from '@/components/password-recovery-form';
export const metadata:Metadata={title:'Choose a new password',robots:{index:false,follow:true}};
export const dynamic='force-dynamic';
export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{invalid?:string}>}){
  let context;
  try{if((await searchParams).invalid)throw new Error();const client=await createSupabaseServerClient();if(!client)throw new Error();context=await verifiedPasswordRecovery(client);}catch{
    return <section className="container page-top auth-page"><div className="card auth-card"><h1>Reset link unavailable</h1><p role="alert">{PASSWORD_RECOVERY_INVALID}</p><p>Use the browser where you requested the link.</p><p><Link className="text-link" href="/login/forgot">Request a new reset link</Link></p><Link className="text-link" href="/login">Back to sign in</Link></div></section>;
  }
  return <section className="container page-top auth-page"><div className="card auth-card"><h1>Choose a new password</h1><p>Your reset session has been verified. For your security, this form is available for ten minutes after recovery.</p><PasswordRecoveryForm ownerId={context.ownerId} sessionId={context.sessionId}/></div></section>;
}
