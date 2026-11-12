import Link from 'next/link';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {TechnologyFiveShareForm} from '@/components/technology-five-share-form';
import {TechnologyFiveSharedComparison} from '@/components/technology-five-shared-comparison';
import {technologyFiveSharingSession,technologyFiveSharingAccess,TechnologyFiveSharingError} from '@/lib/business/technology-five-sharing-server';
import {readTechnologyFiveSharedSnapshot,technologyFiveShareSlugs,TECHNOLOGY_FIVE_SHARING_REVISION} from '@/lib/business/technology-five-sharing';
import {technologyNextSharingSession,technologyNextSharingAccess} from '@/lib/business/technology-next-sharing-server';
import {readTechnologyNextSharedSnapshot,technologyNextShareSlugs,technologyNextSharingCapabilitySupports} from '@/lib/business/technology-next-sharing';
import {encodeDraftHistoryCursor,decodeDraftHistoryCursor,draftHistorySeekFilter} from '@/lib/draft-history-pagination';
import {hasMinimumRole} from '@/lib/business/permissions';
export const dynamic='force-dynamic';
export const metadata={title:'Shared Business project',robots:{index:false,follow:false}};
type Query={cursor?:string;templateId?:string;cohort?:'next'};
async function loadProject(rawId:string,rawQuery:Query){
 const id=z.uuid().parse(rawId),query=z.object({cursor:z.string().max(2048).optional(),templateId:z.uuid().optional(),cohort:z.literal('next').optional()}).strict().parse(rawQuery),nextCohort=query.cohort==='next',context=await (nextCohort?technologyNextSharingSession:technologyFiveSharingSession)();
 const access=nextCohort?technologyNextSharingAccess:technologyFiveSharingAccess,readSnapshot=nextCohort?readTechnologyNextSharedSnapshot:readTechnologyFiveSharedSnapshot,shareSlugs=nextCohort?technologyNextShareSlugs:technologyFiveShareSlugs,table=nextCohort?'technology_next_shared_snapshots':'technology_five_shared_snapshots';
 const project=await context.client.from('business_projects').select('id,organization_id,name,status').eq('id',id).maybeSingle();
 if(project.error)throw new TechnologyFiveSharingError(503,'Project availability could not be verified.');
 if(!project.data)throw new TechnologyFiveSharingError(404,'Project unavailable.');
 // Existing containers can prepare a draft before schema adoption; every write requires the adopted capability.
 const role=await access(context,project.data.organization_id,false,false);
 const capability=await context.client.rpc(nextCohort?'technology_next_sharing_capability':'technology_five_sharing_capability',{target_org:project.data.organization_id});
 if(!capability.error&&!(nextCohort?technologyNextSharingCapabilitySupports(capability.data):capability.data===TECHNOLOGY_FIVE_SHARING_REVISION))throw new TechnologyFiveSharingError(403,'This Business organization is unavailable.');
 const cursorOwner=`shared:${context.user.id}:${project.data.organization_id}:${id}${nextCohort?':next':''}`;
 const cursor=query.cursor?decodeDraftHistoryCursor(query.cursor,cursorOwner,'scenario',50):null;
 let sharedQuery=context.client.from(table).select('id,title,calculator_slug,calculator_version,input_data,output_data,client_workspace_id,created_at').eq('organization_id',project.data.organization_id).eq('project_id',id).in('calculator_slug',[...shareSlugs]);
 if(cursor)sharedQuery=sharedQuery.or(draftHistorySeekFilter(cursor));
 const [clients,history,shared]=await Promise.all([
  context.client.from('client_workspaces').select('id,name,project_id').eq('organization_id',project.data.organization_id),
  context.client.from('calculation_history').select('id,calculator_slug,calculator_version,input_data,output_data').eq('user_id',context.user.id).in('calculator_slug',[...shareSlugs]).order('created_at',{ascending:false}).limit(50),
  sharedQuery.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(51),
 ]);
 // A partially rolled-back capability must not expose newer shared results through comparison or templates.
 if(nextCohort&&(shared.data??[]).some(row=>capability.error||!technologyNextSharingCapabilitySupports(capability.data,row.calculator_slug)))throw new TechnologyFiveSharingError(403,'This project contains snapshots outside the currently adopted sharing capability.');
 const recorded=(history.data??[]).flatMap(row=>{try{return[{id:row.id,snapshot:readSnapshot(row)}];}catch{return[];}});
 const visible=(shared.data??[]).slice(0,50),verified=visible.flatMap(row=>{try{return[{id:row.id,title:row.title,snapshot:readSnapshot(row)}];}catch{return[];}});
 const last=visible.at(-1),next=(shared.data?.length??0)>50&&last?encodeDraftHistoryCursor({v:1,owner:cursorOwner,source:'scenario',limit:50,createdAt:last.created_at,id:last.id}):null;
 let template:undefined|{id:string;title:string;snapshot:ReturnType<typeof readTechnologyFiveSharedSnapshot>};
 if(query.templateId){const result=await context.client.from(table).select('id,title,calculator_slug,calculator_version,input_data,output_data').eq('id',query.templateId).eq('organization_id',project.data.organization_id).eq('project_id',id).maybeSingle();if(result.error)throw new TechnologyFiveSharingError(503,'Shared template storage is unavailable.');if(!result.data)throw new TechnologyFiveSharingError(404,'Shared template unavailable in this project.');if(nextCohort&&(capability.error||!technologyNextSharingCapabilitySupports(capability.data,result.data.calculator_slug)))throw new TechnologyFiveSharingError(403,'This shared template requires its adopted sharing capability.');template={id:result.data.id,title:result.data.title,snapshot:readSnapshot(result.data)};}
 return{id,query,context,project:project.data,role,clients,history,shared,recorded,visible,verified,next,template};
}
export default async function Project({params,searchParams}:{params:Promise<{id:string}>;searchParams?:Promise<Query>}){
 let data:Awaited<ReturnType<typeof loadProject>>;
 try{data=await loadProject((await params).id,await searchParams??{});}catch(error){return <section className="container page-top"><h1>Shared project unavailable</h1><p role="status">{error instanceof TechnologyFiveSharingError?error.message:'Choose an available project and verify your Business session.'}</p><Link href="/business">Return to Business workspace</Link></section>;}
 const {id,query,context,project,role,clients,history,shared,recorded,visible,verified,next,template}=data;
 const suffix=query.cohort==='next'?'?cohort=next':'';
 const href=(cursor?:string)=>'/business/projects/'+id+(cursor?'?cursor='+encodeURIComponent(cursor)+(query.cohort==='next'?'&cohort=next':''):suffix);
 return <AccountSessionBoundary key={context.user.id+':'+id+(query.cohort==='next'?':next':'')} ownerId={context.user.id}><section className="container page-top" style={{minWidth:0,overflowWrap:'anywhere'}}><Link href="/business">Business workspace</Link><h1>{project.name}</h1><p>Current role: {role}. These shares retain the exact recorded calculator identity, technical revision and values. Membership is checked on each page load and share request; reload after team permissions change. Already exported files remain with their recipients.</p>
  <nav aria-label="Calculator sharing cohort"><Link href={'/business/projects/'+id}>Original five calculators</Link> · <Link href={'/business/projects/'+id+'?cohort=next'}>Next fifteen calculators</Link></nav><h2>Shared snapshot history</h2><p>Up to 50 immutable records per page, newest first. Personal history choices below show your latest 50 eligible records; exported calculation JSON can also be recovered.</p>{shared.error?<p role="status">Shared snapshot storage is awaiting schema adoption or temporarily unavailable. No records are fabricated; sharing requests fail closed until the guarded contract is adopted.</p>:visible.length?<ul>{visible.map(row=><li key={row.id}><Link href={'/business/shared/'+row.id+suffix}>{row.title}</Link> · {row.calculator_slug} · version {row.calculator_version}<small> · Client workspace: {row.client_workspace_id?(clients.data??[]).find(client=>client.id===row.client_workspace_id)?.name??'Unavailable':'Project only'}</small>{hasMinimumRole(role,'member')&&project.status==='active'&&<> · <Link href={'/business/projects/'+id+'?templateId='+row.id+(query.cohort==='next'?'&cohort=next':'')}>Use as template: {row.title}</Link></>}</li>)}</ul>:<p>No shared snapshots in this project.</p>}
  <nav aria-label="Shared history pagination">{query.cursor&&<Link href={href()}>First shared history page</Link>}{next&&<Link href={href(next)}>Older shared history</Link>}</nav>
  {verified.length<visible.length&&<p role="alert">Some recorded snapshots could not be verified; their raw results are not used for comparison or template capture.</p>}
  <TechnologyFiveSharedComparison cohort={query.cohort} context={context.user.id+':'+project.organization_id+':'+id} rows={verified}/>
  {clients.error||history.error?<p role="alert">Share inputs are temporarily unavailable. Retry this project; earlier records are unchanged.</p>:<TechnologyFiveShareForm cohort={query.cohort} organizationId={project.organization_id} projectId={id} initialRequestId={randomUUID()} canShare={project.status==='active'&&hasMinimumRole(role,'member')} clients={(clients.data??[]).filter(row=>!row.project_id||row.project_id===id)} history={recorded} template={template}/>}
 </section></AccountSessionBoundary>;
}
