import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {normalizePlan} from '@/lib/entitlements';
import {CalculatorFactoryPortal} from '@/components/calculator-factory-portal';
export const metadata={title:'Private calculator engineering factory',robots:{index:false,follow:false}};
export default async function CalculatorFactoryPage(){
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <section><h1>Engineering factory unavailable</h1></section>;
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)redirect('/login');
 const {data:admin,error:adminError}=await supabase.from('platform_admins').select('role,active').eq('user_id',user.id).maybeSingle();
 if(adminError||!admin?.active||!['owner','admin','reviewer'].includes(String(admin.role)))return <section><h1>Authorized engineering review access required</h1></section>;
 const {data:profile,error:profileError}=await supabase.from('profiles').select('plan').eq('id',user.id).maybeSingle();
 if(profileError)return <section><h1>Account entitlements unavailable</h1></section>;
 return <main className="container page-top"><h1>Private calculator engineering factory</h1><p>RELEASE HOLD ACTIVE. This workspace does not certify or publish calculators.</p><CalculatorFactoryPortal ownerId={user.id} plan={normalizePlan(profile?.plan)}/></main>;
}
