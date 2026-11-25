import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {normalizePlan} from '@/lib/entitlements';
import {LinearSystemsPortal} from '@/components/sole-linear-systems-20261119/portal';
export const metadata={title:'Private Linear systems cohort review',robots:{index:false,follow:false}};
export default async function LinearSystemsPage(){
 const client=await createSupabaseServerClient();if(!client)return <main><h1>Engineering review unavailable</h1></main>;
 const {data:{user},error}=await client.auth.getUser();if(error||!user)redirect('/login');
 const admin=await client.from('platform_admins').select('role,active').eq('user_id',user.id).maybeSingle();
 if(admin.error||!admin.data?.active||!['owner','admin','reviewer'].includes(String(admin.data.role)))return <main><h1>Authorized engineering review access required</h1></main>;
 const profile=await client.from('profiles').select('plan').eq('id',user.id).maybeSingle();if(profile.error)return <main><h1>Account entitlements unavailable</h1></main>;
 return <main className="container page-top"><h1>Private Linear systems engineering review</h1><p>RELEASE HOLD ACTIVE. No certification or public publication authority.</p><LinearSystemsPortal ownerId={user.id} plan={normalizePlan(profile.data?.plan)}/></main>;
}
