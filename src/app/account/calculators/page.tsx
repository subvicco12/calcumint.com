import type {Metadata} from 'next';
import Link from 'next/link';
import crosswalk from '../../../../data/catalog/crosswalk-2026-10-20/crosswalk.json';
import {draftPreviewDefinitions} from '@/calculators/final-framework/draft-preview-catalog';
import {calculatorRegistry} from '@/calculators/registry';
import {requireDraftAccountAccess} from '@/lib/draft-account-access';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {ReviewerDenied} from './shared';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Private calculator review',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string;view?:string;page?:string}>}){
 let account;try{account=await requireDraftAccountAccess();}catch{return <ReviewerDenied/>;}
 const query=await searchParams,raw=query.q,q=typeof raw==='string'?raw.trim().slice(0,120).toLowerCase():'',view=query.view==='engines'?'engines':'catalog';
 const page=typeof query.page==='string'&&/^[1-9][0-9]{0,4}$/.test(query.page)?Number(query.page):1,start=(page-1)*40;
 const definitions=calculatorRegistry.list().filter(d=>!q||`${d.title} ${d.slug} ${d.category}`.toLowerCase().includes(q)).sort((a,b)=>a.title.localeCompare(b.title));
 const masters=crosswalk.rows.filter(d=>!q||`${d.masterId} ${d.title} ${d.domain} ${d.candidates.map(c=>c.slug).join(' ')}`.toLowerCase().includes(q));
 const count=view==='engines'?definitions.length:masters.length;
 const href=(p:number)=>'/account/calculators?'+new URLSearchParams({q,view,page:String(p)}).toString();
 return <AccountSessionBoundary ownerId={account.user.id}><section className="container page-top"><Link href="/account">Account</Link><h1>Private calculator review</h1><p>Unpublished reviewer access. Registry presence is not catalog mapping approval, specialist certification or public publication. RELEASE HOLD remains active.</p><p><Link href="/account/drafts">Open the 14 private DRAFT calculators</Link></p><nav aria-label="Calculator inventory view"><Link href="/account/calculators">540-entry intended catalog</Link>{' · '}<Link href="/account/calculators?view=engines">All registered engines</Link></nav><form method="get"><input type="hidden" name="view" value={view}/><label>Find a calculator<input name="q" defaultValue={q} maxLength={120}/></label><button type="submit">Search calculators</button></form><p>{count} {view==='engines'?'registered engines':'master catalog entries'} match. Page {page}; up to 40 entries per page.</p><ul className="clean-list">{view==='engines'?definitions.slice(start,start+40).map(d=><li key={d.id} style={{textTransform:'none',flexDirection:'column',overflowWrap:'anywhere'}}><Link href={`/account/calculators/${d.slug}`}>{d.title}</Link><span>{d.category} · version {d.version} · {d.reviewStatus}</span></li>):masters.slice(start,start+40).map(d=>{const draft=draftPreviewDefinitions.find(x=>x.masterId===d.masterId);return <li key={d.masterId} style={{textTransform:'none',flexDirection:'column',overflowWrap:'anywhere'}}><h2>#{d.masterId} {d.title}</h2><p>{d.domain} · {d.linkageState}</p>{draft&&<Link href="/account/drafts">Private DRAFT workspace: {draft.title}</Link>}{d.candidates.map(c=><Link key={c.slug} href={`/account/calculators/${c.slug}`}>Review candidate: {c.slug} · version {c.version}</Link>)}{!d.candidates.length&&!draft&&<p>Engine linkage unresolved. This catalog title does not establish an implemented formula; scope and existing engine aliases require review.</p>}</li>;})}</ul>{!count&&<p>No entries match. Try another title, ID or engine slug.</p>}<nav aria-label="Calculator review pagination">{page>1&&<Link href={href(1)}>First page</Link>}{start+40<count&&<Link href={href(page+1)}>Next page</Link>}</nav></section></AccountSessionBoundary>;
}
