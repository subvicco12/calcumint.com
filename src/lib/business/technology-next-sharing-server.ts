import {createSupabaseAdminClient} from '@/lib/supabase/admin';
import {technologyFiveSharingSession,technologyFiveSharingAccess,TechnologyFiveSharingError} from './technology-five-sharing-server';
import {technologyNextSharingCapabilitySupports,parseTechnologyNextShare} from './technology-next-sharing';
export const technologyNextSharingSession=technologyFiveSharingSession;
export async function technologyNextSharingAccess(context:Awaited<ReturnType<typeof technologyNextSharingSession>>,organizationId:string,write=false,requireCapability=true,calculatorSlug?:string){
 const role=await technologyFiveSharingAccess(context,organizationId,write,false);
 if(!requireCapability)return role;
 const capability=await context.client.rpc('technology_next_sharing_capability',{target_org:organizationId});
 if(capability.error)throw new TechnologyFiveSharingError(503,'Shared snapshot storage is awaiting schema adoption. No snapshot was shared.');
 if(!technologyNextSharingCapabilitySupports(capability.data,calculatorSlug))throw new TechnologyFiveSharingError(403,'This Business workspace is unavailable.');
 return role;
}
export async function storeTechnologyNextShare(raw:unknown){
 const context=await technologyNextSharingSession();
 let payload:ReturnType<typeof parseTechnologyNextShare>;try{payload=parseTechnologyNextShare(raw);}catch{throw new TechnologyFiveSharingError(422,'Use an exact supported cohort-version recorded snapshot with valid finite precision.');}
 await technologyNextSharingAccess(context,payload.organizationId,true,true,payload.snapshot.calculatorSlug);
 const project=await context.client.from('business_projects').select('id,organization_id').eq('id',payload.projectId).eq('organization_id',payload.organizationId).eq('status','active').maybeSingle();
 if(project.error)throw new TechnologyFiveSharingError(503,'Project availability could not be verified.');
 if(!project.data||project.data.organization_id!==payload.organizationId)throw new TechnologyFiveSharingError(404,'Project unavailable.');
 const admin=createSupabaseAdminClient();if(!admin)throw new TechnologyFiveSharingError(503,'Verified sharing is awaiting server configuration. No snapshot was shared.');
 const saved=await admin.rpc('share_technology_next_snapshot',{actor_id:context.user.id,request_payload:payload});
 if(saved.error)throw new TechnologyFiveSharingError(saved.error.code==='PGRST202'?503:409,'The snapshot was not shared. Check current membership, project/client access and request identity; retry preserves any earlier snapshot.');
 if(typeof saved.data!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved.data))throw new TechnologyFiveSharingError(503,'Sharing confirmation is unavailable. Retry the same request.');
 return saved.data;
}
