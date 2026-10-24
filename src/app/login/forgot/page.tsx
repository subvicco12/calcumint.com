import type {Metadata} from 'next';
import {PasswordRecoveryForm} from '@/components/password-recovery-form';
export const metadata:Metadata={title:'Reset your password',robots:{index:false,follow:true}};
export default function ForgotPasswordPage(){return <section className="container page-top auth-page"><div className="card auth-card"><h1>Reset your password</h1><p>Enter your email to request a reset link. Open it in the browser where you made this request.</p><PasswordRecoveryForm/></div></section>}
