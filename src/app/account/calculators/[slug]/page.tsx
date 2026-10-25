import type {Metadata} from 'next';
import Link from 'next/link';
import {calculatorRegistry} from '@/calculators/registry';
import {requireDraftAccountAccess} from '@/lib/draft-account-access';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {CalculatorInteractive} from '@/components/calculator-interactive';
import {CalculatorReviewWorkbench} from '@/components/calculator-review-workbench';
import {ReviewerDenied} from '../shared';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Private calculator preview',robots:{index:false,follow:false}};
export default async function Detail({params}:{params:Promise<{slug:string}>}){
 let account;try{account=await requireDraftAccountAccess();}catch{return <ReviewerDenied/>;}
 const {slug}=await params,definition=calculatorRegistry.getBySlug(slug);
 if(!definition)return <section className="container page-top"><h1>Preview unavailable</h1><Link href="/account/calculators">Calculator review directory</Link></section>;
 return <AccountSessionBoundary key={account.user.id} ownerId={account.user.id}><section className="container page-top" style={{minWidth:0,overflowWrap:'anywhere'}}><Link href="/account/calculators">Calculator review directory</Link><h1>{definition.title}</h1><p>Private reviewer testing only. RELEASE HOLD remains active.</p><CalculatorReviewWorkbench key={slug} slug={slug}/><details open={!definition.examples.length}><summary>Existing website interface, where implemented</summary><CalculatorInteractive key={slug} slug={slug}/></details></section></AccountSessionBoundary>;
}
