import {createSupabaseServerClient} from '@/lib/supabase/server';
import type {AdminRole} from '@/lib/admin/publishing';
const draftRoles:readonly AdminRole[]=['owner','admin','reviewer'];

/** Rendered owner IDs may deny stale requests; only server auth and platform roles grant access. */
export async function requireDraftAccountAccess(expectedOwnerId?:string){
 const supabase=await createSupabaseServerClient();
 if(!supabase)throw new Error('Draft access unavailable');
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user||(expectedOwnerId!==undefined&&expectedOwnerId!==user.id))throw new Error('Draft access unavailable');
 const role=await supabase.from('platform_admins').select('role,active').eq('user_id',user.id).maybeSingle();
 if(role.error||role.data?.active!==true||!draftRoles.includes(role.data.role))throw new Error('Draft access unavailable');
 return {supabase,user};
}
