import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {requiresSignIn} from '@/lib/auth-recovery';
import {calculatorRegistry} from '@/calculators/registry';
import {draftAccountRecordHref} from '@/lib/draft-persistence-contract';
import {decodeDraftHistoryCursor,encodeDraftHistoryCursor,draftHistorySeekFilter,type DraftHistorySource} from '@/lib/draft-history-pagination';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Saved history',robots:{index:false,follow:false}};
const querySchema=z.object({source:z.enum(['history','scenario']).default('history'),cursor:z.string().max(2048).optional()});
const recordSchema=z.object({id:z.string().uuid(),calculator_slug:z.string().trim().min(1),calculator_version:z.number().int().positive(),created_at:z.iso.datetime({offset:true}),name:z.string().min(1).max(120).optional()});
function Unavailable({source='history'}:{source?:DraftHistorySource}){return <section className="container page-top"><h1>Saved history unavailable</h1><p role="status">We could not open this page of saved records.</p><p><Link className="text-link" href={`/account/history?source=${source}`}>Retry saved history</Link></p><Link href="/account">Return to account</Link></section>;}
function AuthenticationUnavailable({signIn=false}:{signIn?:boolean}){return <section className="container page-top"><h1>{signIn?'Sign in to continue':'Account temporarily unavailable'}</h1><p role="status">We could not verify your session.</p>{signIn&&<p><Link href="/login">Sign in</Link></p>}<Link href="/account">Retry account</Link></section>;}

/** Read owned metadata in stable keyset order. Snapshot content is read only on explicit reopen. */
export default async function HistoryPage({searchParams}:{searchParams:Promise<{source?:string;cursor?:string}>}){
 const parsed=querySchema.safeParse(await searchParams);
 if(!parsed.success)return <Unavailable/>;
 const {source,cursor}=parsed.data;
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <AuthenticationUnavailable/>;
 let auth;
 try{auth=await supabase.auth.getUser();}catch{return <AuthenticationUnavailable/>;}
 if(auth.error)return <AuthenticationUnavailable signIn={requiresSignIn(auth.error)}/>;
 const user=auth.data.user;
 if(!user)redirect('/login');
 let records:z.infer<typeof recordSchema>[],nextCursor:string|undefined;
 try{
  const seek=cursor===undefined?undefined:decodeDraftHistoryCursor(cursor,user.id,source,20);
  let query=supabase.from(source==='history'?'calculation_history':'saved_scenarios').select(source==='history'?'id,calculator_slug,calculator_version,created_at':'id,calculator_slug,calculator_version,created_at,name').eq('user_id',user.id);
  if(seek)query=query.or(draftHistorySeekFilter(seek));
  const result=await query.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(21);
  if(result.error)throw new Error('Saved history unavailable');
  const rows=z.array(recordSchema).max(21).parse(result.data);
  // Validate every returned identity, including the lookahead, against cursor timestamp precision.
  for(const row of rows){
   encodeDraftHistoryCursor({v:1,owner:user.id,source,limit:20,createdAt:row.created_at,id:row.id});
   if(source==='scenario'&&!row.name)throw new Error('Saved scenario metadata unavailable');
  }
  records=rows.slice(0,20);
  const last=records.at(-1);
  if(rows.length>20&&last)nextCursor=encodeDraftHistoryCursor({v:1,owner:user.id,source,limit:20,createdAt:last.created_at,id:last.id});
 }catch{return <Unavailable source={source}/>;}
 return <AccountSessionBoundary key={user.id} ownerId={user.id}><section className="container page-top"><Link href="/account" className="text-link">Return to account</Link><h1>Saved history</h1><nav aria-label="Saved record type"><Link href="/account/history?source=history" aria-current={source==='history'?'page':undefined}>Calculations</Link>{' · '}<Link href="/account/history?source=scenario" aria-current={source==='scenario'?'page':undefined}>Scenarios</Link></nav><h2>{source==='history'?'Saved calculations':'Saved scenarios'}</h2>{records.length?<ul className="clean-list">{records.map(row=><li key={row.id}><Link className="text-link" href={draftAccountRecordHref(row.calculator_slug,row.id,source)??`/account/saved?source=${source}&id=${encodeURIComponent(row.id)}`}>{source==='scenario'?row.name:calculatorRegistry.getBySlug(row.calculator_slug)?.title??row.calculator_slug}</Link><p>{row.calculator_slug} · version {row.calculator_version} · <time dateTime={row.created_at}>{row.created_at}</time></p></li>)}</ul>:<p>{source==='history'?'No saved calculations yet.':'No saved scenarios yet.'}</p>}<nav aria-label="Saved history pagination">{cursor&&<Link className="text-link" href={`/account/history?source=${source}`}>First page</Link>}{cursor&&nextCursor&&' · '}{nextCursor&&<Link className="text-link" href={`/account/history?source=${source}&cursor=${encodeURIComponent(nextCursor)}`}>Next page</Link>}</nav></section></AccountSessionBoundary>;
}
