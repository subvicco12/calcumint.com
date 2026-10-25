import type {Metadata} from 'next';
import Link from 'next/link';
import {z} from 'zod';
import {AccountSessionBoundary} from '@/components/account-session-boundary';
import {decodeProjectCursor,encodeProjectCursor,projectSeekFilter} from '@/lib/project-pagination';
import {projectSchema,projectSession,querySchema,selectedHistory,projectHref,Unavailable,signIn} from './shared';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Calculation projects',robots:{index:false,follow:false}};
export default async function ProjectsPage({searchParams}:{searchParams:Promise<{cursor?:string;historyId?:string}>}){
 const parsed=querySchema.safeParse(await searchParams);if(!parsed.success)return <Unavailable/>;
 let session;try{session=await projectSession();}catch{return <Unavailable/>;}if(!session.user)return signIn();
 const {supabase,user}=session;const {cursor,historyId}=parsed.data;
 const loaded=await (async()=>{try{
  const selected=await selectedHistory(supabase,user.id,historyId);
  const seek=cursor?decodeProjectCursor(cursor,user.id,'projects'):undefined;
  let query=supabase.from('calculation_projects').select('id,name,description,created_at').eq('user_id',user.id);
  if(seek)query=query.or(projectSeekFilter(seek));
  const result=await query.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(21);if(result.error)throw Error();
  const rows=z.array(projectSchema).max(21).parse(result.data),records=rows.slice(0,20),last=records.at(-1);
  const next=rows.length>20&&last?encodeProjectCursor({v:1,owner:user.id,kind:'projects',limit:20,createdAt:last.created_at,id:last.id}):undefined;
  return {selected,records,next};
 }catch{return null;}})();
 if(!loaded)return <Unavailable href={projectHref('/account/projects',historyId)}/>;
 const {selected,records,next}=loaded;
  return <AccountSessionBoundary key={user.id} ownerId={user.id}><section className="container page-top"><Link href="/account">Return to account</Link><h1>Calculation projects</h1>{selected&&<p>Choose a project for {selected.calculator_slug} · version {selected.calculator_version}.</p>}{records.length?<ul className="clean-list">{records.map(row=><li key={row.id}><Link href={projectHref(`/account/projects/${row.id}`,historyId)}>{row.name}</Link>{row.description&&<p>{row.description}</p>}</li>)}</ul>:<p>No projects yet. Create a project from your account.</p>}<nav aria-label="Project pagination">{cursor&&<Link href={projectHref('/account/projects',historyId)}>First page</Link>}{next&&<Link href={projectHref('/account/projects',historyId,next)}>Next page</Link>}</nav></section></AccountSessionBoundary>;
}
