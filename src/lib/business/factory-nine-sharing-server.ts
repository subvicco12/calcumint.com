import {z} from 'zod';
import {encodeDraftHistoryCursor,decodeDraftHistoryCursor,draftHistorySeekFilter} from '@/lib/draft-history-pagination';
import {createSupabaseAdminClient} from '@/lib/supabase/admin';
import {technologyFiveSharingSession,technologyFiveSharingAccess} from './technology-five-sharing-server';
import {FACTORY_NINE_SHARING_REVISION,factoryNineShareSlugs,parseFactoryNineShare,readFactoryNineSharedSnapshot,verifyFactoryNineSnapshot} from './factory-nine-sharing';
const scopeSchema=z.object({expectedOwnerId:z.uuid(),organizationId:z.uuid(),projectId:z.uuid(),cursor:z.string().max(2048).optional()}).strict();
async function context(expectedOwnerId:string,organizationId:string,write=false){
 const session=await technologyFiveSharingSession();
 if(session.user.id!==expectedOwnerId)throw Error('Account context changed');
 const role=await technologyFiveSharingAccess(session,organizationId,write,false);
 const capability=await session.client.rpc('factory_nine_sharing_capability',{target_org:organizationId});
 if(capability.error||capability.data!==FACTORY_NINE_SHARING_REVISION)throw Error('Factory shared storage is awaiting guarded adoption, or current Business authority is unavailable');
 return {...session,role};
}
async function scopedProject(ctx:Awaited<ReturnType<typeof context>>,organizationId:string,projectId:string,write=false){
 const result=await ctx.client.from('business_projects').select('id,name,organization_id,status').eq('id',projectId).eq('organization_id',organizationId).maybeSingle();
 if(result.error||!result.data||(write&&result.data.status!=='active'))throw Error('Current Business project unavailable');
 return result.data;
}
export async function loadFactoryNineWorkspace(raw:{expectedOwnerId:string;organizationId:string;projectId:string;cursor?:string}){
 const scope=scopeSchema.parse(raw),ctx=await context(scope.expectedOwnerId,scope.organizationId),project=await scopedProject(ctx,scope.organizationId,scope.projectId);
 const cursorOwner=`factory-shared:${ctx.user.id}:${scope.organizationId}:${scope.projectId}`;
 const cursor=scope.cursor?decodeDraftHistoryCursor(scope.cursor,cursorOwner,'scenario',50):null;
 let recordsQuery=ctx.client.from('technology_next_shared_snapshots').select('id,title,calculator_slug,calculator_version,input_data,output_data,client_workspace_id,created_at').eq('organization_id',scope.organizationId).eq('project_id',scope.projectId).in('calculator_slug',[...factoryNineShareSlugs]);
 if(cursor)recordsQuery=recordsQuery.or(draftHistorySeekFilter(cursor));
 const [clients,records]=await Promise.all([
  ctx.client.from('client_workspaces').select('id,name,project_id').eq('organization_id',scope.organizationId).order('created_at',{ascending:false}).limit(100),
  recordsQuery.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(51)
 ]);
 if(clients.error||records.error)throw Error('Business shared records unavailable');
 // Never silently accept corrupt or out-of-contract stored rows as templates/comparison sources.
 const page=(records.data??[]).slice(0,50),last=page.at(-1),nextCursor=(records.data?.length??0)>50&&last?encodeDraftHistoryCursor({v:1,owner:cursorOwner,source:'scenario',limit:50,createdAt:last.created_at,id:last.id}):null;
 const verified=page.map(row=>({id:row.id,title:row.title,clientWorkspaceId:row.client_workspace_id,snapshot:readFactoryNineSharedSnapshot(row)}));
 return {organizationId:scope.organizationId,project,role:ctx.role,nextCursor,clients:(clients.data??[]).filter(row=>!row.project_id||row.project_id===scope.projectId),records:verified};
}
export async function loadFactoryNineTemplate(raw:{expectedOwnerId:string;organizationId:string;projectId:string;recordId:string}){
 const {recordId,...scope}=z.object({expectedOwnerId:z.uuid(),organizationId:z.uuid(),projectId:z.uuid(),recordId:z.uuid()}).strict().parse(raw),ctx=await context(scope.expectedOwnerId,scope.organizationId);
 await scopedProject(ctx,scope.organizationId,scope.projectId);
 const row=await ctx.client.from('technology_next_shared_snapshots').select('id,title,calculator_slug,calculator_version,input_data,output_data').eq('id',recordId).eq('organization_id',scope.organizationId).eq('project_id',scope.projectId).in('calculator_slug',[...factoryNineShareSlugs]).maybeSingle();
 if(row.error||!row.data)throw Error('Shared template unavailable in this organization and project');
 const verified=verifyFactoryNineSnapshot(readFactoryNineSharedSnapshot(row.data));
 return {recordId:row.data.id,title:row.data.title,...verified};
}
export async function storeFactoryNineShare(expectedOwnerId:string,raw:unknown){
 const payload=parseFactoryNineShare(raw),ctx=await context(z.uuid().parse(expectedOwnerId),payload.organizationId,true);
 await scopedProject(ctx,payload.organizationId,payload.projectId,true);
 if(payload.clientWorkspaceId){const client=await ctx.client.from('client_workspaces').select('id,project_id').eq('id',payload.clientWorkspaceId).eq('organization_id',payload.organizationId).maybeSingle();if(client.error||!client.data||(client.data.project_id&&client.data.project_id!==payload.projectId))throw Error('Current project client workspace unavailable');}
 const admin=createSupabaseAdminClient();if(!admin)throw Error('Business sharing server unavailable');
 const result=await admin.rpc('share_factory_nine_snapshot',{actor_id:ctx.user.id,request_payload:payload});
 if(result.error||!z.uuid().safeParse(result.data).success)throw Error('Snapshot was not shared. Recheck current membership, Business plans, project and request identity; retry preserves any earlier immutable record');
 return result.data as string;
}
export async function listFactoryNineOrganizations(expectedOwnerId:string){
 const owner=z.uuid().parse(expectedOwnerId),session=await technologyFiveSharingSession();if(session.user.id!==owner)throw Error('Account context changed');
 const organizations=await session.client.from('organizations').select('id,name').order('created_at',{ascending:false}).limit(100);if(organizations.error)throw Error('Business organizations unavailable');
 const checked=await Promise.all((organizations.data??[]).map(async row=>{const capability=await session.client.rpc('factory_nine_sharing_capability',{target_org:row.id});if(capability.error)throw Error('Factory shared storage is awaiting guarded adoption');return capability.data===FACTORY_NINE_SHARING_REVISION?row:null;}));
 return {organizations:checked.filter((row):row is NonNullable<typeof row>=>row!==null)};
}
export async function listFactoryNineProjects(raw:{expectedOwnerId:string;organizationId:string}){
 const input=z.object({expectedOwnerId:z.uuid(),organizationId:z.uuid()}).strict().parse(raw),ctx=await context(input.expectedOwnerId,input.organizationId);
 const projects=await ctx.client.from('business_projects').select('id,name,status').eq('organization_id',input.organizationId).order('created_at',{ascending:false}).limit(100);if(projects.error)throw Error('Current organization projects unavailable');return {projects:projects.data??[]};
}
