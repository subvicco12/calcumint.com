"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canTransition, lifecycleStates, qaCheckTypes, requiredQaChecks, roleCanTransition, type AdminRole, type LifecycleState } from "@/lib/admin/publishing";

async function requirePlatformAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active) throw new Error("Platform admin access required");
  return { supabase, user, role: String(admin.role) as AdminRole };
}

const createSchema = z.object({
  calculatorKey: z.string().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(160),
  title: z.string().min(2).max(160),
  category: z.string().min(2).max(100),
  riskClass: z.enum(["standard", "financial", "health", "tax"]),
  rulePackRequired: z.boolean().default(false),
  sourceCount: z.coerce.number().int().min(0).max(1000).default(0)
});

export async function createCatalogCalculator(formData: FormData) {
  const { supabase, user } = await requirePlatformAdmin();
  const input = createSchema.parse({
    calculatorKey: formData.get("calculatorKey"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    category: formData.get("category"),
    riskClass: formData.get("riskClass"),
    rulePackRequired: formData.get("rulePackRequired") === "true",
    sourceCount: formData.get("sourceCount")
  });
  const { data, error } = await supabase.from("calculator_catalog_admin").insert({
    calculator_key: input.calculatorKey,
    slug: input.slug,
    title: input.title,
    category: input.category,
    risk_class: input.riskClass,
    source_count: input.sourceCount,
    metadata: { rulePackRequired: input.rulePackRequired },
    created_by: user.id
  }).select("id").single();
  if (error) throw new Error(error.message);
  const requiredChecks = requiredQaChecks(input.riskClass, input.rulePackRequired);
  const { error: checkError } = await supabase.from("calculator_qa_checks").insert(requiredChecks.map((checkType) => ({ calculator_id: data.id, check_type: checkType })));
  if (checkError) throw new Error(checkError.message);
  await supabase.from("calculator_review_events").insert({ calculator_id: data.id, actor_id: user.id, event_type: "created", to_state: "draft" });
  revalidatePath("/admin");
  revalidatePath("/admin/calculators");
}

export async function updateQaCheck(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin", "reviewer"] as AdminRole[]).includes(role)) throw new Error("Reviewer permission required");
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const checkType = z.enum(qaCheckTypes).parse(formData.get("checkType"));
  const status = z.enum(["pending", "passed", "failed", "waived"]).parse(formData.get("status"));
  const details = String(formData.get("details") ?? "").slice(0, 2000);
  const { error } = await supabase.from("calculator_qa_checks").upsert({ calculator_id: calculatorId, check_type: checkType, status, details, checked_by: user.id, checked_at: new Date().toISOString() }, { onConflict: "calculator_id,check_type" });
  if (error) throw new Error(error.message);
  await supabase.from("calculator_review_events").insert({ calculator_id: calculatorId, actor_id: user.id, event_type: "qa-check", notes: `${checkType}: ${status}` });
  revalidatePath(`/admin/calculators/${calculatorId}`);
  revalidatePath("/admin");
}

export async function transitionCalculator(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const target = z.enum(lifecycleStates).parse(formData.get("target")) as LifecycleState;
  const { data: calculator } = await supabase.from("calculator_catalog_admin").select("lifecycle").eq("id", calculatorId).maybeSingle();
  if (!calculator) throw new Error("Calculator not found");
  const current = String(calculator.lifecycle) as LifecycleState;
  if (!canTransition(current, target)) throw new Error(`Invalid lifecycle transition: ${current} → ${target}`);
  if (!roleCanTransition(role, target)) throw new Error("Your role cannot perform this transition");
  if (target === "certified" || target === "published") {
    const { data: gate, error: gateError } = await supabase.rpc("validate_calculator_publish_gate", { p_calculator_id: calculatorId });
    if (gateError) throw new Error(gateError.message);
    const result = Array.isArray(gate) ? gate[0] : gate;
    if (!result?.ok) throw new Error(`Publishing gate failed: ${(result?.failures ?? []).join("; ")}`);
  }
  const update: Record<string, unknown> = { lifecycle: target };
  if (target === "certified") update.last_reviewed_at = new Date().toISOString();
  if (target === "published") update.next_review_due_at = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("calculator_catalog_admin").update(update).eq("id", calculatorId);
  if (error) throw new Error(error.message);
  await supabase.from("calculator_review_events").insert({ calculator_id: calculatorId, actor_id: user.id, event_type: "lifecycle-transition", from_state: current, to_state: target });
  revalidatePath(`/admin/calculators/${calculatorId}`);
  revalidatePath("/admin");
}

export async function assignReviewer(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin"] as AdminRole[]).includes(role)) throw new Error("Admin permission required");
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const reviewerId = z.string().uuid().parse(formData.get("reviewerId"));
  const { data: reviewer } = await supabase.from("platform_admins").select("user_id,active,role").eq("user_id", reviewerId).maybeSingle();
  if (!reviewer?.active || !["owner", "admin", "reviewer"].includes(String(reviewer.role))) throw new Error("Reviewer must be an active review-capable admin");
  const { error } = await supabase.from("calculator_catalog_admin").update({ reviewer_id: reviewerId }).eq("id", calculatorId);
  if (error) throw new Error(error.message);
  await supabase.from("calculator_review_events").insert({ calculator_id: calculatorId, actor_id: user.id, event_type: "reviewer-assigned", metadata: { reviewerId } });
  revalidatePath(`/admin/calculators/${calculatorId}`);
}

const bulkItemSchema = z.object({
  calculatorKey: z.string().min(2).max(160), slug: z.string().regex(/^[a-z0-9-]+$/).max(160), title: z.string().min(2).max(160),
  category: z.string().min(2).max(100), riskClass: z.enum(["standard", "financial", "health", "tax"]).default("standard"), rulePackRequired: z.boolean().default(false), sourceCount: z.number().int().min(0).max(1000).default(0)
});

export async function importCalculatorInventory(formData: FormData) {
  const { supabase, user, role } = await requirePlatformAdmin();
  if (!(["owner", "admin"] as AdminRole[]).includes(role)) throw new Error("Admin permission required");
  const raw = String(formData.get("inventory") ?? "");
  const parsed = z.array(bulkItemSchema).min(1).max(250).parse(JSON.parse(raw));
  const { data: job, error: jobError } = await supabase.from("calculator_bulk_jobs").insert({ job_type: "inventory-import", requested_by: user.id, status: "processing", payload: { count: parsed.length } }).select("id").single();
  if (jobError) throw new Error(jobError.message);
  const rows = parsed.map((item) => ({ calculator_key: item.calculatorKey, slug: item.slug, title: item.title, category: item.category, risk_class: item.riskClass, source_count: item.sourceCount, metadata: { rulePackRequired: item.rulePackRequired }, created_by: user.id }));
  const { data: inserted, error } = await supabase.from("calculator_catalog_admin").upsert(rows, { onConflict: "calculator_key", ignoreDuplicates: true }).select("id,risk_class,metadata");
  if (error) {
    await supabase.from("calculator_bulk_jobs").update({ status: "failed", error_message: error.message, completed_at: new Date().toISOString() }).eq("id", job.id);
    throw new Error(error.message);
  }
  const checkRows = (inserted ?? []).flatMap((item) => requiredQaChecks(String(item.risk_class) as "standard" | "financial" | "health" | "tax", item.metadata?.rulePackRequired === true).map((checkType) => ({ calculator_id: item.id, check_type: checkType })));
  if (checkRows.length) await supabase.from("calculator_qa_checks").upsert(checkRows, { onConflict: "calculator_id,check_type", ignoreDuplicates: true });
  await supabase.from("calculator_bulk_jobs").update({ status: "completed", result: { received: parsed.length, inserted: inserted?.length ?? 0 }, completed_at: new Date().toISOString() }).eq("id", job.id);
  revalidatePath("/admin");
  revalidatePath("/admin/calculators");
}
