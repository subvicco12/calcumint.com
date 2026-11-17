import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {normalizePlan} from '@/lib/entitlements';
import {IntakeClient} from './client';
import {loadFactoryNineTemplate} from '@/lib/business/factory-nine-sharing-server';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function IntakePage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const client=await createSupabaseServerClient();if(!client)throw Error('Fixture account unavailable');
 const {data:{user},error}=await client.auth.getUser();if(error||!user)redirect('/login');
 const {data:admin}=await client.from('platform_admins').select('role,active').eq('user_id',user.id).maybeSingle();
 if(!admin?.active||admin.role!=='admin')return <main><h1>Engineering fixture authorization required</h1></main>;
 const {data:profile,error:profileError}=await client.from('profiles').select('plan').eq('id',user.id).single();if(profileError)throw Error('Entitlements unavailable');
 const query=await searchParams;
 if(query.organization&&query.project&&query.record){
  let recovered;
  try{recovered=await loadFactoryNineTemplate({expectedOwnerId:user.id,organizationId:query.organization,projectId:query.project,recordId:query.record});}catch{/* Render denial after the awaited authorization check. */}
  if(!recovered)return <main><h1>Business recovery denied</h1><p role="alert">Current account, membership, project and exact snapshot must be authorized.</p></main>;
  return <main><h1>Authenticated Business template recovery</h1><pre aria-label="Authenticated Business snapshot">{JSON.stringify(recovered.snapshot)}</pre></main>;
 }
 return <main><h1>Isolated Worker A capture acceptance</h1><IntakeClient owner={user.id} plan={normalizePlan(profile.plan)}/></main>;
}
