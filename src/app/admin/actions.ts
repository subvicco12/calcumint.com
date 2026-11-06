"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canTransition, lifecycleStates, qaCheckTypes, requiredQaChecks, roleCanTransition, type AdminRole, type LifecycleState } from "@/lib/admin/publishing";
import { buildVerifiedCatalogRegulatoryMetadata, resolveRegistryDefinition } from "@/calculators/regulatory-metadata";

async function requirePlatformAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin, error: adminError } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (adminError) throw new Error("Platform admin authorization lookup failed");
  if (!admin?.active) throw new Error("Platform admin access required");
  return { supabase, user, role: String(admin.role) as AdminRole };
}

const createSchema = z.object({
  calculatorKey: z.string().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(160),
  title: z.string().min(2).max(160),
  category: z.string().min(2).max(100),
  riskClass: z.enum(["standard", "financial", "health", "tax"]),
  rulePackRequired: z.boolean().default(false)
});

function prepareCatalogDraft(input: z.infer<typeof createSchema>) {
  const identity = { id: input.calculatorKey, slug: input.slug };
  const registryRegulatory = buildVerifiedCatalogRegulatoryMetadata(identity);
  const definition = resolveRegistryDefinition(identity);
  if (!registryRegulatory.matched || !definition) throw new Error("Catalog identity must exactly match a registered calculator id and slug");
  if (input.riskClass !== definition.riskClass) throw new Error("Calculator risk class must match the registered registry definition");
  // The existing audited creation RPC defaults the table version to1. Refuse
  // future successors until a version-aware database contract is adopted.
  if (definition.version !== 1) throw new Error("Registered version requires a version-aware draft creation contract");
  const effectiveRulePackRequired = input.rulePackRequired || registryRegulatory.rulePackRequired;
  const metadata = {
    ...(registryRegulatory.rulePackRequired ? { rulePackRequired: true, ruleMetadata: registryRegulatory.ruleMetadata } : { rulePackRequired: effectiveRulePackRequired }),
    engineBinding: { engineId: definition.id, slug: definition.slug, version: definition.version }
  };
  return { calculator_key: definition.id, slug: definition.slug, title: input.title, category: input.category, risk_class: definition.riskClass, metadata, version: definition.version };
}

export async function createCatalogCalculator(formData: FormData) {
  const { supabase } = await requirePlatformAdmin();
  const input = createSchema.parse({
    calculatorKey: formData.get("calculatorKey"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    category: formData.get("category"),
    riskClass: formData.get("riskClass"),
    rulePackRequired: formData.get("rulePackRequired") === "true"
  });
  const draft = prepareCatalogDraft(input);
  const { error } = await supabase.rpc("create_catalog_calculator_with_audit", {
    p_calculator_key: input.calculatorKey,
    p_slug: input.slug,
    p_title: input.title,
    p_category: input.category,
    p_risk_class: draft.risk_class,
    p_metadata: draft.metadata
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/calculators");
}


export async function addCalculatorSourceEvidence(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin", "reviewer"] as AdminRole[]).includes(role)) throw new Error("Reviewer permission required");
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const label = z.string().min(2).max(300).parse(formData.get("label"));
  const url = z.string().url().max(2000).parse(formData.get("url"));
  const sourceKind = z.enum(["reference", "official", "methodology"]).parse(formData.get("sourceKind") ?? "reference");
  const { data: calculator, error: calculatorError } = await supabase.from("calculator_catalog_admin").select("id").eq("id", calculatorId).maybeSingle();
  if (calculatorError || !calculator) throw new Error("Calculator lookup failed");
  const { error } = await supabase.from("calculator_source_evidence").insert({
    calculator_id: calculatorId, label, url, source_kind: sourceKind, reviewed_by: user.id
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/calculators/${calculatorId}`);
}

export async function updateQaCheck(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin", "reviewer"] as AdminRole[]).includes(role)) throw new Error("Reviewer permission required");
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const checkType = z.enum(qaCheckTypes).parse(formData.get("checkType"));
  const status = z.enum(["pending", "passed", "failed", "waived"]).parse(formData.get("status"));
  if (status === "waived" && !(["owner", "admin"] as AdminRole[]).includes(role)) throw new Error("Owner or admin permission required to waive QA evidence");
  const { data: calculator, error: calculatorError } = await supabase.from("calculator_catalog_admin").select("risk_class,metadata").eq("id", calculatorId).maybeSingle();
  if (calculatorError || !calculator) throw new Error("Calculator lookup failed");
  const riskClass = z.enum(["standard", "financial", "health", "tax"]).parse(calculator.risk_class);
  if (!requiredQaChecks(riskClass, calculator.metadata?.rulePackRequired === true).includes(checkType)) throw new Error("QA check is not applicable to this calculator");
  const details = String(formData.get("details") ?? "").slice(0, 2000);
  const { error } = await supabase.rpc("record_calculator_qa_decision", {
    p_calculator_id: calculatorId, p_check_type: checkType, p_status: status, p_details: details
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/calculators/${calculatorId}`);
  revalidatePath("/admin");
}

export async function transitionCalculator(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const target = z.enum(lifecycleStates).parse(formData.get("target")) as LifecycleState;
  const { data: calculator, error: calculatorError } = await supabase.from("calculator_catalog_admin").select("lifecycle").eq("id", calculatorId).maybeSingle();
  if (calculatorError || !calculator) throw new Error("Calculator lifecycle lookup failed");
  const current = String(calculator.lifecycle) as LifecycleState;
  if (!canTransition(current, target)) throw new Error(`Invalid lifecycle transition: ${current} → ${target}`);
  if (!roleCanTransition(role, target)) throw new Error("Your role cannot perform this transition");
  if (target === "certified" || target === "published") {
    const { data: gate, error: gateError } = await supabase.rpc("validate_calculator_publish_gate", { p_calculator_id: calculatorId });
    if (gateError) throw new Error(gateError.message);
    const result = Array.isArray(gate) ? gate[0] : gate;
    if (!result?.ok) throw new Error(`Publishing gate failed: ${(result?.failures ?? []).join("; ")}`);
  }
  const { error } = await supabase.rpc("transition_calculator_with_audit", {
    p_calculator_id: calculatorId, p_expected_lifecycle: current, p_target_lifecycle: target
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/calculators/${calculatorId}`);
  revalidatePath("/admin");
}

export async function assignReviewer(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin"] as AdminRole[]).includes(role)) throw new Error("Admin permission required");
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const reviewerId = z.string().uuid().parse(formData.get("reviewerId"));
  const { error } = await supabase.rpc("assign_calculator_reviewer", {
    p_calculator_id: calculatorId, p_reviewer_id: reviewerId
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/calculators/${calculatorId}`);
}

const bulkItemSchema = z.object({
  calculatorKey: z.string().min(2).max(160), slug: z.string().regex(/^[a-z0-9-]+$/).max(160), title: z.string().min(2).max(160),
  category: z.string().min(2).max(100), riskClass: z.enum(["standard", "financial", "health", "tax"]).default("standard"), rulePackRequired: z.boolean().default(false)
});

export async function importCalculatorInventory(formData: FormData) {
  const { supabase, role } = await requirePlatformAdmin();
  if (!(["owner", "admin"] as AdminRole[]).includes(role)) throw new Error("Admin permission required");
  const raw = String(formData.get("inventory") ?? "");
  const parsed = z.array(bulkItemSchema).min(1).max(250).parse(JSON.parse(raw));
  // Validate the entire registry-bound request before the only mutation. The
  // guarded invoker RPC commits drafts, pending QA, audits and job atomically.
  // Missing adoption fails closed; never fall back to independent table writes.
  const rows = parsed.map(prepareCatalogDraft);
  const { error } = await supabase.rpc("prepare_catalog_inventory_drafts", { p_items: rows });
  if (error) throw new Error(`Draft inventory preparation failed: ${error.message}`);
  revalidatePath("/admin");
  revalidatePath("/admin/calculators");
}
