import {createSupabaseServerClient} from "@/lib/supabase/server";
import {getPlanEntitlements} from "@/lib/entitlements";
type AccountClient=NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export async function readAccountEntitlements(supabase:AccountClient,userId:string){
 const profile=await supabase.from("profiles").select("plan").eq("id",userId).maybeSingle();
 if(profile.error)throw new Error("Account plan unavailable");
 return getPlanEntitlements(profile.data?.plan);
}

export async function enforceSaveQuota(supabase:AccountClient,userId:string,table:"favorites"|"calculation_history",limit:number|null){
 if(limit===null)return;
 const result=await supabase.from(table).select("id",{count:"exact",head:true}).eq("user_id",userId);
 if(result.error||!Number.isSafeInteger(result.count)||result.count!<0)throw new Error(table==="favorites"?"Favorite quota unavailable":"History quota unavailable");
 if(result.count!>=limit)throw new Error(table==="favorites"?`Free accounts can save up to ${limit} favorites`:`Free accounts can keep up to ${limit} calculations`);
}
