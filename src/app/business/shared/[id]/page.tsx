import Link from 'next/link';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {SavedCalculationActions} from '@/components/saved-calculation-actions';
import {technologyFiveSharingSession,technologyFiveSharingAccess,TechnologyFiveSharingError} from '@/lib/business/technology-five-sharing-server';
import {readTechnologyFiveSharedSnapshot} from '@/lib/business/technology-five-sharing';
import {technologyNextSharingSession,technologyNextSharingAccess} from '@/lib/business/technology-next-sharing-server';
import {readTechnologyNextSharedSnapshot} from '@/lib/business/technology-next-sharing';
export const dynamic='force-dynamic';
export const metadata={title:'Recorded shared calculation',robots:{index:false,follow:false}};
type Query={cohort?:'next'};
async function loadShared(rawId:string,rawQuery:Query){
  const id=z.uuid().parse(rawId),query=z.object({cohort:z.literal('next').optional()}).strict().parse(rawQuery),nextCohort=query.cohort==='next',context=await(nextCohort?technologyNextSharingSession:technologyFiveSharingSession)();
  const result=await context.client.from(nextCohort?'technology_next_shared_snapshots':'technology_five_shared_snapshots').select('id,organization_id,project_id,title,calculator_slug,calculator_version,input_data,output_data').eq('id',id).maybeSingle();
  if(result.error)throw new TechnologyFiveSharingError(503,'Shared snapshot storage is awaiting schema adoption or temporarily unavailable.');
  if(!result.data)throw new TechnologyFiveSharingError(404,'This shared snapshot is unavailable.');
  await(nextCohort?technologyNextSharingAccess:technologyFiveSharingAccess)(context,result.data.organization_id);
  const snapshot=(nextCohort?readTechnologyNextSharedSnapshot:readTechnologyFiveSharedSnapshot)(result.data);
 return{id,context,query,row:result.data,snapshot};
}
export default async function Shared({params,searchParams}:{params:Promise<{id:string}>;searchParams?:Promise<Query>}){
 let data:Awaited<ReturnType<typeof loadShared>>;
 try{data=await loadShared((await params).id,await searchParams??{});}catch(error){return <section className="container page-top"><h1>Shared snapshot unavailable</h1><p role="status">{error instanceof TechnologyFiveSharingError?error.message:'The record could not be verified against its exact supported engine. Earlier saved history is unchanged.'}</p><Link href="/business">Return to Business workspace</Link></section>;}
 const {id,context,query,row,snapshot}=data;
  return <AccountSessionBoundary key={context.user.id+(query.cohort==='next'?':next':'')} ownerId={context.user.id}><section className="container page-top" style={{minWidth:0,overflowWrap:'anywhere'}}><Link href={'/business/projects/'+row.project_id+(query.cohort==='next'?'?cohort=next':'')}>Return to shared project</Link><h1>{row.title}</h1><p>{snapshot.calculatorSlug} · version {snapshot.calculatorVersion}</p><p>This is an immutable shared copy, verified against its exact retained engine before display. It does not change personal history, upgrade technical revision, authenticate original authorship, approve methodology or authorize publication. Current organization membership is required on each read. Already exported copies cannot be revoked.</p><h2>Recorded inputs</h2><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(snapshot.input,null,2)}</pre><h2>Recorded outputs</h2><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(snapshot.output,null,2)}</pre><SavedCalculationActions recordKey={'shared:'+id+(query.cohort==='next'?':next':'')} snapshot={snapshot}/></section></AccountSessionBoundary>;
}
