"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCountryProfile,type CountryCode } from "@/calculators/country-intelligence";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?error=Authentication%20is%20not%20configured.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function updatePreferences(formData: FormData) {
  const { supabase, user } = await requireUser();
  const locale = String(formData.get("locale") ?? "en").slice(0, 16);
  const currency = String(formData.get("currency") ?? "USD").slice(0, 8).toUpperCase();
  const unitSystem = formData.get("unitSystem") === "us" ? "us" : "metric";

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    locale,
    currency,
    unit_system: unitSystem,
    country_code: country??null,
    updated_at: new Date().toISOString()
  });
  if (error) throw new Error("Could not update preferences");
  revalidatePath("/account");
}

export async function saveFavorite(calculatorSlug: string) {
  const { supabase, user } = await requireUser();
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
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("calculation_history").insert({
    user_id: user.id,
    calculator_slug: entry.calculatorSlug,
    calculator_version: entry.calculatorVersion,
    input_data: entry.input,
    output_data: entry.output
  });
  if (error) throw new Error("Could not save calculation history");
}
