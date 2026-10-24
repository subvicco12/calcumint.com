import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import type {Metadata} from 'next';
import Link from 'next/link';
import {loadDraftWorkspace} from './actions';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {AuthenticatedDraftWorkspace} from '@/components/authenticated-draft-workspace';
export const dynamic='force-dynamic';
const fullMetadata:Metadata={title:'Private DRAFT workspace',robots:{index:false,follow:false}};
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}

export default async function PrivateDraftPage({searchParams}:{searchParams?:Promise<{id?:string;source?:string}>}){
  if (!getProductPolicy().capabilities.savedData) return <FeatureUnavailable/>;

 const query=await searchParams;
 let workspace:Awaited<ReturnType<typeof loadDraftWorkspace>>;
 try{workspace=await loadDraftWorkspace(undefined,query?.id&&(query.source==='history'||query.source==='scenario')?{id:query.id,source:query.source}:undefined);}
 catch{return <section className="container page-top"><h1>Private DRAFT workspace unavailable</h1><p role="alert">A verified authorized reviewer account is required. Access or account data could not be verified; no saved calculations have been loaded.</p><Link href="/login">Sign in</Link><p><Link href="/account/drafts">Retry private workspace</Link></p></section>;}
 const initialRecord=workspace.records.find(r=>r.id===query?.id&&r.source===query?.source);
 return <AccountSessionBoundary key={workspace.ownerId} ownerId={workspace.ownerId}><section className="container page-top"><p>Private unpublished reviewer workspace. RELEASE HOLD remains active.</p><p>Saving requires the reviewed atomic history storage contract. If it is unavailable, saves fail closed; existing snapshots remain readable.</p>{query?.id&&!initialRecord&&<p role="alert">This saved reference is unavailable in your owner-scoped recent list.</p>}<AuthenticatedDraftWorkspace {...workspace} initialRecord={initialRecord}/></section></AccountSessionBoundary>;
}
