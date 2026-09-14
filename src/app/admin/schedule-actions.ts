"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdmin(roles: readonly string[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active || !roles.includes(String(admin.role))) throw new Error("Platform admin permission required");
  return { supabase, user };
}

export async function scheduleCalculatorPublication(formData: FormData) {
  const { supabase, user } = await requireAdmin(["owner", "admin"]);
  const calculatorId = z.string().uuid().parse(formData.get("calculatorId"));
  const raw = String(formData.get("publishAt") ?? "");
  const publishAt = new Date(raw);
  if (!Number.isFinite(publishAt.getTime()) || publishAt.getTime() <= Date.now()) throw new Error("Publication time must be in the future");
  const { data: calculator } = await supabase.from("calculator_catalog_admin").select("lifecycle").eq("id", calculatorId).maybeSingle();
  if (!calculator || calculator.lifecycle !== "certified") throw new Error("Only certified calculators can be scheduled");
  const { data: gate, error: gateError } = await supabase.rpc("validate_calculator_publish_gate", { p_calculator_id: calculatorId });
  const result = Array.isArray(gate) ? gate[0] : gate;
  if (gateError || !result?.ok) throw new Error(gateError?.message ?? `Publishing gate failed: ${(result?.failures ?? []).join("; ")}`);
  const { error } = await supabase.from("calculator_catalog_admin").update({ publish_at: publishAt.toISOString() }).eq("id", calculatorId);
  if (error) throw new Error(error.message);
  await supabase.from("calculator_review_events").insert({ calculator_id: calculatorId, actor_id: user.id, event_type: "publication-scheduled", notes: publishAt.toISOString() });
  revalidatePath(`/admin/calculators/${calculatorId}`);
}

export async function refreshReviewAlerts() {
  const { supabase } = await requireAdmin(["owner", "admin", "reviewer"]);
  const { error } = await supabase.rpc("refresh_admin_review_alerts");
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function resolveAdminAlert(formData: FormData) {
  const { supabase } = await requireAdmin(["owner", "admin", "reviewer"]);
  const alertId = z.string().uuid().parse(formData.get("alertId"));
  const { error } = await supabase.from("admin_alerts").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", alertId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
