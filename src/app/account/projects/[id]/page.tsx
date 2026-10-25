import {randomUUID} from 'node:crypto';
import type {Metadata} from 'next';
import Link from 'next/link';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {AccountMutationForm} from '@/components/account-mutation-form';
import {draftAccountRecordHref} from '@/lib/draft-persistence-contract';
import {decodeProjectCursor,encodeProjectCursor,projectSeekFilter} from '@/lib/project-pagination';
import {getPlanEntitlements} from '@/lib/entitlements';
import {saveProjectScenario,updateProjectScenarioName,deleteProjectScenario,deleteCalculationProject} from '../../actions';
import {projectSchema,scenarioSchema,projectSession,querySchema,selectedHistory,projectHref,Unavailable,signIn} from '../shared';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Calculation project',robots:{index:false,follow:false}};
export default async function ProjectPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{cursor?:string;historyId?:string}>}){
 const id=z.string().uuid().safeParse((await params).id),parsed=querySchema.safeParse(await searchParams);if(!id.success||!parsed.success)return <Unavailable/>;
 const path=`/account/projects/${id.data}`,{cursor,historyId}=parsed.data;
 let session;try{session=await projectSession();}catch{return <Unavailable href={path}/>;}if(!session.user)return signIn();const {supabase,user}=session;
 const loaded=await (async()=>{try{
  const projectResult=await supabase.from('calculation_projects').select('id,name,description,created_at').eq('user_id',user.id).eq('id',id.data).maybeSingle();if(projectResult.error)throw Error();const project=projectSchema.parse(projectResult.data);
  const selected=await selectedHistory(supabase,user.id,historyId);
  const seek=cursor?decodeProjectCursor(cursor,user.id,'scenarios',id.data):undefined;
  let query=supabase.from('saved_scenarios').select('id,name,calculator_slug,calculator_version,created_at').eq('user_id',user.id).eq('project_id',id.data);if(seek)query=query.or(projectSeekFilter(seek));
  const result=await query.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(21);if(result.error)throw Error();const rows=z.array(scenarioSchema).max(21).parse(result.data),records=rows.slice(0,20),last=records.at(-1);
  const next=rows.length>20&&last?encodeProjectCursor({v:1,owner:user.id,kind:'scenarios',projectId:id.data,limit:20,createdAt:last.created_at,id:last.id}):undefined;
  let planAvailable=false,paid=false;
  try{const profile=await supabase.from('profiles').select('plan').eq('id',user.id).maybeSingle();const validPlan=z.enum(['free','pro','business']).safeParse(profile.data?.plan);if(!profile.error&&validPlan.success){planAvailable=true;paid=getPlanEntitlements(validPlan.data).scenarios;}}catch{/* Owned reads remain available during a plan outage. */}
  return {project,selected,records,next,planAvailable,paid};
 }catch{return null;}})();
 if(!loaded)return <Unavailable href={projectHref(path,historyId)}/>;
 const {project,selected,records,next,planAvailable,paid}=loaded;
  return <AccountSessionBoundary key={user.id} ownerId={user.id}><section className="container page-top" style={{overflowWrap:'anywhere',minWidth:0}}><Link href={projectHref('/account/projects',historyId)}>All projects</Link><h1>{project.name}</h1>{project.description&&<p>{project.description}</p>}{!planAvailable&&<p role="status">Plan details are temporarily unavailable. Retry this project to manage saved work.</p>}{selected&&<section><h2>Save calculation as a scenario</h2><p>{selected.calculator_slug} · version {selected.calculator_version}</p>{paid?<AccountMutationForm ownerId={user.id} requestId={randomUUID()} action={saveProjectScenario}><input type="hidden" name="projectId" value={id.data}/><input type="hidden" name="historyId" value={historyId}/><label>Scenario name<input name="name" required maxLength={120}/></label><button type="submit">Save scenario</button></AccountMutationForm>:planAvailable&&<p>Saving scenarios requires Pro or Business.</p>}</section>}<p><Link href="/account/history">Choose a saved calculation</Link></p><h2>Saved scenarios</h2>{records.length?<ul className="clean-list">{records.map(row=><li key={row.id} style={{textTransform:'none',flexDirection:'column',overflowWrap:'anywhere'}}><Link href={draftAccountRecordHref(row.calculator_slug,row.id,'scenario')??`/account/saved?source=scenario&id=${encodeURIComponent(row.id)}`}>{row.name}</Link><p>{row.calculator_slug} · version {row.calculator_version}</p>{paid&&<AccountMutationForm ownerId={user.id} action={updateProjectScenarioName}><input type="hidden" name="scenarioId" value={row.id}/><label>Scenario name<input name="name" defaultValue={row.name} required maxLength={120}/></label><button type="submit">Rename</button></AccountMutationForm>}{planAvailable&&<AccountMutationForm ownerId={user.id} action={deleteProjectScenario}><input type="hidden" name="scenarioId" value={row.id}/><button type="submit">Remove scenario</button></AccountMutationForm>}</li>)}</ul>:<p>No saved scenarios in this project.</p>}<nav aria-label="Scenario pagination">{cursor&&<Link href={projectHref(path,historyId)}>First page</Link>}{next&&<Link href={projectHref(path,historyId,next)}>Next page</Link>}</nav>{planAvailable&&<AccountMutationForm ownerId={user.id} action={deleteCalculationProject}><input type="hidden" name="projectId" value={id.data}/><p>Deleting this project also removes its saved scenarios.</p><button type="submit">Delete project</button></AccountMutationForm>}</section></AccountSessionBoundary>;
}
