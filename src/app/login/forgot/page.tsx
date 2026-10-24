import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import type {Metadata} from 'next';
import {PasswordRecoveryForm} from '@/components/password-recovery-form';
const fullMetadata:Metadata={title:'Reset your password',robots:{index:false,follow:true}};
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}

export default function ForgotPasswordPage(){
  if (!getProductPolicy().capabilities.accounts) return <FeatureUnavailable/>;
return <section className="container page-top auth-page"><div className="card auth-card"><h1>Reset your password</h1><p>Enter your email to request a reset link. Open it in the browser where you made this request.</p><PasswordRecoveryForm/><p>Delivery may be delayed. If the link does not arrive or no longer works, wait a moment and request a new one.</p></div></section>}
