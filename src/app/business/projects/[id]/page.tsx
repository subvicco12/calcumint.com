import Link from 'next/link';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {TechnologyFiveShareForm} from '@/components/technology-five-share-form';
import {technologyFiveSharingSession,technologyFiveSharingAccess,TechnologyFiveSharingError} from '@/lib/business/technology-five-sharing-server';
import {readTechnologyFiveSharedSnapshot,technologyFiveShareSlugs} from '@/lib/business/technology-five-sharing';
import {hasMinimumRole} from '@/lib/business/permissions';
export const dynamic='force-dynamic';
export const metadata={title:'Shared Business project',robots:{index:false,follow:false}};
export default async function Project({params}:{params:Promise<{id:string}>}){
 try{
  const id=z.uuid().parse((await params).id),context=await technologyFiveSharingSession();
  const project=await context.client.from('business_projects').select('id,organization_id,name,status').eq('id',id).maybeSingle();
  if(project.error)throw new TechnologyFiveSharingError(503,'Project availability could not be verified.');
  if(!project.data)throw new TechnologyFiveSharingError(404,'Project unavailable.');
  // Existing containers remain usable for preparation; the write endpoint separately requires the adopted capability.
  const role=await technologyFiveSharingAccess(context,project.data.organization_id,false,false);
  const [clients,history,shared]=await Promise.all([
   context.client.from('client_workspaces').select('id,name,project_id').eq('organization_id',project.data.organization_id),
   context.client.from('calculation_history').select('id,calculator_slug,calculator_version,input_data,output_data').eq('user_id',context.user.id).in('calculator_slug',[...technologyFiveShareSlugs]).order('created_at',{ascending:false}).limit(50),
   context.client.from('technology_five_shared_snapshots').select('id,title,calculator_slug,calculator_version').eq('organization_id',project.data.organization_id).eq('project_id',id).order('created_at',{ascending:false}).limit(50),
  ]);
  const recorded=(history.data??[]).flatMap(row=>{try{return[{id:row.id,snapshot:readTechnologyFiveSharedSnapshot(row)}];}catch{return[];}});
  return <AccountSessionBoundary ownerId={context.user.id}><section className="container page-top" style={{minWidth:0,overflowWrap:'anywhere'}}><Link href="/business">Business workspace</Link><h1>{project.data.name}</h1><p>Current role: {role}. These shares retain the exact recorded calculator identity, technical revision and values. Membership is checked on each page load and share request; reload after team permissions change. Already exported files remain with their recipients.</p>
   <h2>Shared snapshots</h2>{shared.error?<p role="status">Shared snapshot storage is awaiting schema adoption or temporarily unavailable. No records are fabricated; sharing requests fail closed until the guarded contract is adopted.</p>:shared.data?.length?<ul>{shared.data.map(row=><li key={row.id}><Link href={'/business/shared/'+row.id}>{row.title}</Link> · {row.calculator_slug} · version {row.calculator_version}</li>)}</ul>:<p>No shared snapshots in this project.</p>}
   {clients.error||history.error?<p role="alert">Share inputs are temporarily unavailable. Retry this project; earlier records are unchanged.</p>:<TechnologyFiveShareForm organizationId={project.data.organization_id} projectId={id} initialRequestId={randomUUID()} canShare={project.data.status==='active'&&hasMinimumRole(role,'member')} clients={(clients.data??[]).filter(row=>!row.project_id||row.project_id===id)} history={recorded}/>}
  </section></AccountSessionBoundary>;
 }catch(error){return <section className="container page-top"><h1>Shared project unavailable</h1><p role="status">{error instanceof TechnologyFiveSharingError?error.message:'Choose an available project and verify your Business session.'}</p><Link href="/business">Return to Business workspace</Link></section>;}
}
