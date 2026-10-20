import {requiresSignIn} from "@/lib/auth-recovery";
import {z} from "zod";
import type {createSupabaseServerClient} from "@/lib/supabase/server";
import {getPlanEntitlements} from "@/lib/entitlements";
type AccountClient=NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export async function readAccountEntitlements(supabase:AccountClient,userId:string){
 const profile=await supabase.from("profiles").select("plan").eq("id",userId).maybeSingle();
 if(profile.error)throw new Error("Account plan unavailable");
 return getPlanEntitlements(profile.data?.plan);
}

export async function enforceSaveQuota(supabase:AccountClient,userId:string,table:"favorites",limit:number|null){
 if(limit===null)return;
 const result=await supabase.from(table).select("id",{count:"exact",head:true}).eq("user_id",userId);
 if(requiresSignIn(result.error))throw result.error;
 if(result.error||!Number.isSafeInteger(result.count)||result.count!<0)throw new Error("Favorite quota unavailable");
 if(result.count!>=limit)throw new Error(`Free accounts can save up to ${limit} favorites`);
}

// A missing or malformed RPC contract must never enable count-then-insert fallback.
export async function saveHistoryAtomically(supabase:AccountClient,requestId:string,snapshot:{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>},expectedOwnerId:string){
 const id=z.string().uuid().parse(requestId);
 const owner=z.string().min(1).parse(expectedOwnerId);
 const result=await supabase.rpc("save_calculation_history_atomic",{p_expected_owner_id:owner,p_request_id:id,p_calculator_slug:snapshot.calculatorSlug,p_calculator_version:snapshot.calculatorVersion,p_input_data:snapshot.input,p_output_data:snapshot.output});
 if(requiresSignIn(result.error))throw result.error;
 if(result.error||!z.string().uuid().safeParse(result.data).success||result.data!==id)throw new Error("Could not save calculation history");
 return {id};
}
