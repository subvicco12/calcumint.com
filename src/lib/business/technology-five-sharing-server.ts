import {createSupabaseServerClient} from '@/lib/supabase/server';
import {createSupabaseAdminClient} from '@/lib/supabase/admin';
import {isBusinessRole,hasMinimumRole} from './permissions';
import {TECHNOLOGY_FIVE_SHARING_REVISION,parseTechnologyFiveShare} from './technology-five-sharing';
export class TechnologyFiveSharingError extends Error{constructor(public status:number,message:string){super(message);}}
export async function technologyFiveSharingSession(){
 const client=await createSupabaseServerClient();if(!client)throw new TechnologyFiveSharingError(503,'Sharing configuration is unavailable.');
 const auth=await client.auth.getUser();if(auth.error||!auth.data.user)throw new TechnologyFiveSharingError(401,'Sign in to use shared snapshots.');
 const profile=await client.from('profiles').select('plan').eq('id',auth.data.user.id).maybeSingle();
 if(profile.error)throw new TechnologyFiveSharingError(503,'Business entitlement could not be verified.');
 if(profile.data?.plan!=='business')throw new TechnologyFiveSharingError(403,'Business workspace access is required.');
 return{client,user:auth.data.user};
}
export async function technologyFiveSharingAccess(context:Awaited<ReturnType<typeof technologyFiveSharingSession>>,organizationId:string,write=false,requireCapability=true){
 const member=await context.client.from('organization_members').select('role').eq('organization_id',organizationId).eq('user_id',context.user.id).maybeSingle();
 if(member.error)throw new TechnologyFiveSharingError(503,'Workspace membership could not be verified.');
 if(!isBusinessRole(member.data?.role)||!hasMinimumRole(member.data.role,write?'member':'viewer'))throw new TechnologyFiveSharingError(403,'Current organization permission is required.');
 if(!requireCapability)return member.data.role;
 const capability=await context.client.rpc('technology_five_sharing_capability',{target_org:organizationId});
 if(capability.error)throw new TechnologyFiveSharingError(503,'Shared snapshot storage is awaiting schema adoption. No snapshot was shared.');
 if(capability.data!==TECHNOLOGY_FIVE_SHARING_REVISION)throw new TechnologyFiveSharingError(403,'This Business workspace is unavailable.');
 return member.data.role;
}
export async function storeTechnologyFiveShare(raw:unknown){
 const context=await technologyFiveSharingSession();
 let payload:ReturnType<typeof parseTechnologyFiveShare>;try{payload=parseTechnologyFiveShare(raw);}catch{throw new TechnologyFiveSharingError(422,'Use an exact supported version-1 recorded snapshot with valid finite precision.');}
 await technologyFiveSharingAccess(context,payload.organizationId,true);
 const project=await context.client.from('business_projects').select('id,organization_id').eq('id',payload.projectId).eq('organization_id',payload.organizationId).eq('status','active').maybeSingle();
 if(project.error)throw new TechnologyFiveSharingError(503,'Project availability could not be verified.');
 if(!project.data||project.data.organization_id!==payload.organizationId)throw new TechnologyFiveSharingError(404,'Project unavailable.');
 const admin=createSupabaseAdminClient();if(!admin)throw new TechnologyFiveSharingError(503,'Verified sharing is awaiting server configuration. No snapshot was shared.');
 const saved=await admin.rpc('share_technology_five_snapshot',{actor_id:context.user.id,request_payload:payload});
 if(saved.error)throw new TechnologyFiveSharingError(saved.error.code==='PGRST202'?503:409,'The snapshot was not shared. Check current membership, project/client access and request identity; retry preserves any earlier snapshot.');
 if(typeof saved.data!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved.data))throw new TechnologyFiveSharingError(503,'Sharing confirmation is unavailable. Retry the same request.');
 return saved.data;
}
