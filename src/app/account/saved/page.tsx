import Link from 'next/link';
import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {readPersistedCalculationSnapshot} from '@/lib/persisted-calculation';
import {calculatorRegistry} from '@/calculators/registry';
import {draftMasterIdForSlug} from '@/lib/draft-persistence-contract';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {requiresSignIn} from '@/lib/auth-recovery';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Saved calculation',robots:{index:false,follow:false}};

const reference=z.object({source:z.enum(['history','scenario']),id:z.string().uuid()});
function Unavailable(){return <section className="container page-top"><h1>Saved calculation unavailable</h1><p role="status">This saved record could not be opened. Return to your account and try again.</p><Link href="/account" className="text-link">Return to account</Link></section>;}
function AuthenticationUnavailable({signIn=false}:{signIn?:boolean}){return <section className="container page-top"><h1>{signIn?'Sign in to continue':'Account temporarily unavailable'}</h1><p role="status">We could not verify your session.</p>{signIn&&<p><Link href="/login">Sign in</Link></p>}<Link href="/account" className="text-link">Retry account</Link></section>;}

/** Owned recorded data only. Never evaluate a current engine or apply current display metadata. */
export default async function SavedCalculationPage({searchParams}:{searchParams:Promise<{source?:string;id?:string}>}){
 const parsed=reference.safeParse(await searchParams);
 if(!parsed.success)return <Unavailable/>;
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <AuthenticationUnavailable/>;
 let auth;
 try{auth=await supabase.auth.getUser();}catch{return <AuthenticationUnavailable/>;}
 if(auth.error)return <AuthenticationUnavailable signIn={requiresSignIn(auth.error)}/>;
 const user=auth.data.user;
 if(!user)redirect('/login');
 let snapshot;
 try{
  const result=await supabase.from(parsed.data.source==='history'?'calculation_history':'saved_scenarios').select('calculator_slug,calculator_version,input_data,output_data').eq('user_id',user.id).eq('id',parsed.data.id).maybeSingle();
  if(result.error||!result.data)throw new Error('Saved record unavailable');
  snapshot=readPersistedCalculationSnapshot(result.data);
  // Private previews retain their separate reviewer access and strict v1 reader.
  if(draftMasterIdForSlug(snapshot.calculatorSlug)!==undefined)throw new Error('Saved record unavailable');
 }catch{return <Unavailable/>;}
 const title=calculatorRegistry.getBySlug(snapshot.calculatorSlug)?.title??snapshot.calculatorSlug;
 return <AccountSessionBoundary key={user.id} ownerId={user.id}><section className="container page-top"><Link href="/account" className="text-link">Return to account</Link><h1>Saved {parsed.data.source==='history'?'calculation':'scenario'}: {title}</h1><p>{snapshot.calculatorSlug} · version {snapshot.calculatorVersion}</p><p>This is the recorded calculation. Inputs and results are shown exactly as saved, without recalculation. Field names are retained from that version; current labels and units are not applied.</p><section aria-labelledby="saved-inputs"><h2 id="saved-inputs">Saved inputs</h2><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(snapshot.input,null,2)}</pre></section><section aria-labelledby="saved-outputs"><h2 id="saved-outputs">Saved results</h2><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(snapshot.output,null,2)}</pre></section></section></AccountSessionBoundary>;
}
