import Link from 'next/link';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {SavedCalculationActions} from '@/components/saved-calculation-actions';
import {technologyFiveSharingSession,technologyFiveSharingAccess,TechnologyFiveSharingError} from '@/lib/business/technology-five-sharing-server';
import {readTechnologyFiveSharedSnapshot} from '@/lib/business/technology-five-sharing';
export const dynamic='force-dynamic';
export const metadata={title:'Recorded shared calculation',robots:{index:false,follow:false}};
export default async function Shared({params}:{params:Promise<{id:string}>}){
 try{
  const id=z.uuid().parse((await params).id),context=await technologyFiveSharingSession();
  const result=await context.client.from('technology_five_shared_snapshots').select('id,organization_id,project_id,title,calculator_slug,calculator_version,input_data,output_data').eq('id',id).maybeSingle();
  if(result.error)throw new TechnologyFiveSharingError(503,'Shared snapshot storage is awaiting schema adoption or temporarily unavailable.');
  if(!result.data)throw new TechnologyFiveSharingError(404,'This shared snapshot is unavailable.');
  await technologyFiveSharingAccess(context,result.data.organization_id);
  const snapshot=readTechnologyFiveSharedSnapshot(result.data);
  return <AccountSessionBoundary ownerId={context.user.id}><section className="container page-top" style={{minWidth:0,overflowWrap:'anywhere'}}><Link href={'/business/projects/'+result.data.project_id}>Return to shared project</Link><h1>{result.data.title}</h1><p>{snapshot.calculatorSlug} · version {snapshot.calculatorVersion}</p><p>This is an immutable shared copy, verified against its exact retained engine before display. It does not change personal history, upgrade technical revision, authenticate original authorship, approve methodology or authorize publication. Current organization membership is required on each read. Already exported copies cannot be revoked.</p><h2>Recorded inputs</h2><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(snapshot.input,null,2)}</pre><h2>Recorded outputs</h2><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(snapshot.output,null,2)}</pre><SavedCalculationActions recordKey={'shared:'+id} snapshot={snapshot}/></section></AccountSessionBoundary>;
 }catch(error){return <section className="container page-top"><h1>Shared snapshot unavailable</h1><p role="status">{error instanceof TechnologyFiveSharingError?error.message:'The record could not be verified against its exact supported engine. Earlier saved history is unchanged.'}</p><Link href="/business">Return to Business workspace</Link></section>;}
}
