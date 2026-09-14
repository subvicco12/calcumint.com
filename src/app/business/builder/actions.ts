"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { customCalculatorSchema } from "@/lib/builder/definition";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 63);
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function parseDefinition(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let fields: unknown;
  let outputs: unknown;
  try {
    fields = JSON.parse(String(formData.get("fields") ?? "[]"));
    outputs = JSON.parse(String(formData.get("outputs") ?? "[]"));
  } catch {
    throw new Error("Fields and outputs must be valid JSON");
  }
  return customCalculatorSchema.parse({ name, description, fields, outputs });
}

export async function createCustomCalculator(formData: FormData) {
  const { supabase } = await requireUser();
  const organizationId = String(formData.get("organizationId") ?? "");
  const definition = parseDefinition(formData);
  const slug = slugify(String(formData.get("slug") ?? definition.name));
  if (!organizationId || slug.length < 2) throw new Error("Organization and valid slug are required");

  const { data, error } = await supabase.rpc("create_custom_calculator", {
    p_organization_id: organizationId,
    p_name: definition.name,
    p_slug: slug,
    p_description: definition.description,
    p_definition: definition
  });
  if (error) throw new Error(error.message);
  redirect(`/business/builder/${data}`);
}

export async function saveCustomCalculatorVersion(formData: FormData) {
  const { supabase, user } = await requireUser();
  const calculatorId = String(formData.get("calculatorId") ?? "");
  const definition = parseDefinition(formData);
  const changeNote = String(formData.get("changeNote") ?? "Updated in builder").trim().slice(0, 300);
  if (!calculatorId) throw new Error("Calculator is required");

  const { data: calculator, error: readError } = await supabase
    .from("custom_calculators")
    .select("id,current_version")
    .eq("id", calculatorId)
    .single();
  if (readError || !calculator) throw new Error(readError?.message ?? "Calculator not found");

  const nextVersion = Number(calculator.current_version) + 1;
  const { error: versionError } = await supabase.from("custom_calculator_versions").insert({
    calculator_id: calculatorId,
    version: nextVersion,
    definition,
    change_note: changeNote || null,
    created_by: user.id
  });
  if (versionError) throw new Error(versionError.message);

  const { error: updateError } = await supabase.from("custom_calculators").update({
    name: definition.name,
    description: definition.description,
    current_version: nextVersion,
    updated_at: new Date().toISOString()
  }).eq("id", calculatorId);
  if (updateError) throw new Error(updateError.message);
  revalidatePath(`/business/builder/${calculatorId}`);
}

export async function publishCustomCalculator(formData: FormData) {
  const { supabase } = await requireUser();
  const calculatorId = String(formData.get("calculatorId") ?? "");
  const version = Number(formData.get("version"));
  if (!calculatorId || !Number.isInteger(version) || version < 1) throw new Error("Valid calculator version is required");
  const { error } = await supabase.rpc("publish_custom_calculator", { p_calculator_id: calculatorId, p_version: version });
  if (error) throw new Error(error.message);
  revalidatePath(`/business/builder/${calculatorId}`);
  revalidatePath("/business/builder");
}
