"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCountryProfile,type CountryCode } from "@/calculators/country-intelligence";
import {getPlanEntitlements} from "@/lib/entitlements";
import {readPersistedCalculationSnapshot,validateHistoricalCalculationSnapshot} from "@/lib/persisted-calculation";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?error=Authentication%20is%20not%20configured.");
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return { supabase, user };
}

type AccountClient=NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

async function readAccountEntitlements(supabase:AccountClient,userId:string){
 const profile=await supabase.from("profiles").select("plan").eq("id",userId).maybeSingle();
 if(profile.error)throw new Error("Account plan unavailable");
 return getPlanEntitlements(profile.data?.plan);
}

async function enforceSaveQuota(supabase:AccountClient,userId:string,table:"favorites"|"calculation_history",limit:number|null){
 if(limit===null)return;
 const result=await supabase.from(table).select("id",{count:"exact",head:true}).eq("user_id",userId);
 if(result.error||!Number.isSafeInteger(result.count)||result.count!<0)throw new Error(table==="favorites"?"Favorite quota unavailable":"History quota unavailable");
 if(result.count!>=limit)throw new Error(table==="favorites"?`Free accounts can save up to ${limit} favorites`:`Free accounts can keep up to ${limit} calculations`);
}

export async function updatePreferences(formData: FormData) {
  const { supabase, user } = await requireUser();
  const countryValue=String(formData.get("country")??"");
  const allowedCountries:readonly CountryCode[]=["IN","US","GB","CA","AU"];
  const country=allowedCountries.includes(countryValue as CountryCode)?countryValue as CountryCode:undefined;
  const profile=country?getCountryProfile(country):undefined;
  const locale=profile?.locale??String(formData.get("locale")??"en").slice(0,16);
  const currency=profile?.currency??String(formData.get("currency")??"USD").slice(0,8).toUpperCase();
  const unitSystem=profile?.unitSystem??(formData.get("unitSystem")==="us"?"us":"metric");
  const { error } = await supabase.from("user_preferences").upsert({
    user_id:user.id, locale, currency, unit_system:unitSystem, country_code:country??null,
    updated_at:new Date().toISOString()
  });
  if(error)throw new Error("Could not update preferences");
  revalidatePath("/account");
}

export async function saveFavorite(calculatorSlug: string) {
  const { supabase, user } = await requireUser();
  const entitlements=await readAccountEntitlements(supabase,user.id);
  await enforceSaveQuota(supabase,user.id,"favorites",entitlements.favoritesLimit);
  const { error } = await supabase.from("favorites").upsert({ user_id: user.id, calculator_slug: calculatorSlug });
  if (error) throw new Error("Could not save favorite");
  revalidatePath("/account");
}

export async function removeFavorite(calculatorSlug: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("calculator_slug", calculatorSlug);
  if (error) throw new Error("Could not remove favorite");
  revalidatePath("/account");
}

export async function saveCalculationHistory(entry: {
  calculatorSlug: string;
  calculatorVersion: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}) {
  // Copy before the first await so caller mutation cannot change the persisted revision.
  const snapshot=validateHistoricalCalculationSnapshot(entry);
  const { supabase, user } = await requireUser();
  const entitlements=await readAccountEntitlements(supabase,user.id);
  await enforceSaveQuota(supabase,user.id,"calculation_history",entitlements.historyLimit);
  const { error } = await supabase.from("calculation_history").insert({
    user_id: user.id,
    calculator_slug: snapshot.calculatorSlug,
    calculator_version: snapshot.calculatorVersion,
    input_data: snapshot.input,
    output_data: snapshot.output
  });
  if (error) throw new Error("Could not save calculation history");
}

export async function createCalculationProject(formData:FormData){const{supabase,user}=await requireUser();const entitlements=await readAccountEntitlements(supabase,user.id);if(!entitlements.projects)throw new Error("Projects require Pro or Business");const name=String(formData.get("name")??"").trim().slice(0,120);const description=String(formData.get("description")??"").trim().slice(0,1000);if(!name)throw new Error("Project name is required");const{error}=await supabase.from("calculation_projects").insert({user_id:user.id,name,description:description||null});if(error)throw new Error("Could not create project");revalidatePath("/account");}
export async function deleteCalculationProject(formData:FormData){const{supabase,user}=await requireUser();const id=String(formData.get("projectId")??"");if(!id)throw new Error("Project id is required");const{error}=await supabase.from("calculation_projects").delete().eq("id",id).eq("user_id",user.id);if(error)throw new Error("Could not delete project");revalidatePath("/account");}

export async function saveProjectScenario(formData:FormData){
 const{supabase,user}=await requireUser();
 const entitlements=await readAccountEntitlements(supabase,user.id);
 if(!entitlements.scenarios)throw new Error("Saved scenarios require Pro or Business");
 const projectId=String(formData.get("projectId")??"");
 const historyId=String(formData.get("historyId")??"");
 const name=String(formData.get("name")??"").trim().slice(0,120);
 if(!projectId||!historyId||!name)throw new Error("Project, calculation and scenario name are required");
 const[projectResult,historyResult]=await Promise.all([
  supabase.from("calculation_projects").select("id").eq("id",projectId).eq("user_id",user.id).maybeSingle(),
  supabase.from("calculation_history").select("calculator_slug,calculator_version,input_data,output_data").eq("id",historyId).eq("user_id",user.id).maybeSingle()
 ]);
 if(projectResult.error||historyResult.error)throw new Error("Project or calculation is temporarily unavailable");
 if(!projectResult.data||!historyResult.data)throw new Error("Project or calculation was not found");
 const snapshot=readPersistedCalculationSnapshot(historyResult.data);
 const{error}=await supabase.from("saved_scenarios").insert({
  user_id:user.id,project_id:projectId,name,
  calculator_slug:snapshot.calculatorSlug,calculator_version:snapshot.calculatorVersion,
  input_data:snapshot.input,output_data:snapshot.output
 });
 if(error)throw new Error("Could not save scenario");
 revalidatePath("/account");
}
export async function updateProjectScenarioName(formData:FormData){const{supabase,user}=await requireUser();const id=String(formData.get("scenarioId")??"");const name=String(formData.get("name")??"").trim().slice(0,120);if(!id||!name)throw new Error("Scenario and name are required");const entitlements=await readAccountEntitlements(supabase,user.id);if(!entitlements.scenarios)throw new Error("Saved scenarios require Pro or Business");const{error}=await supabase.from("saved_scenarios").update({name,updated_at:new Date().toISOString()}).eq("id",id).eq("user_id",user.id);if(error)throw new Error("Could not rename scenario");revalidatePath("/account");}
export async function deleteProjectScenario(formData:FormData){const{supabase,user}=await requireUser();const id=String(formData.get("scenarioId")??"");if(!id)throw new Error("Scenario id is required");const{error}=await supabase.from("saved_scenarios").delete().eq("id",id).eq("user_id",user.id);if(error)throw new Error("Could not delete scenario");revalidatePath("/account");}
