"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createApiKeySecret, normalizeScopes } from "@/lib/api/api-keys";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: memberships } = await supabase.from("organization_members").select("organization_id,role").eq("user_id", user.id).limit(1);
  const membership = memberships?.[0];
  if (!membership || !["owner", "admin"].includes(String(membership.role))) throw new Error("Owner or Admin permission required");
  return { supabase, user, organizationId: String(membership.organization_id) };
}

export async function createBusinessApiKey(formData: FormData) {
  const { supabase, user, organizationId } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const scopes = normalizeScopes(formData.getAll("scopes").map(String));
  if (name.length < 2 || scopes.length === 0) throw new Error("Name and at least one valid scope are required");
  const rateLimit = Math.max(1, Math.min(Number(formData.get("rateLimit") ?? 60), 5000));
  const monthlyQuota = Math.max(1, Math.min(Number(formData.get("monthlyQuota") ?? 10000), 10_000_000));
  const generated = createApiKeySecret(process.env.NODE_ENV === "production" ? "cm_live" : "cm_test");
  const { error } = await supabase.from("business_api_keys").insert({
    organization_id: organizationId,
    name,
    key_prefix: generated.prefix,
    key_hash: generated.hash,
    scopes,
    rate_limit_per_minute: rateLimit,
    monthly_quota: monthlyQuota,
    created_by: user.id
  });
  if (error) throw new Error(error.message);
  redirect(`/business/api?created=${encodeURIComponent(generated.secret)}`);
}

export async function revokeBusinessApiKey(formData: FormData) {
  const { supabase, organizationId } = await requireAdmin();
  const keyId = String(formData.get("keyId") ?? "");
  if (!keyId) throw new Error("API key is required");
  const { error } = await supabase.from("business_api_keys").update({ status: "revoked", revoked_at: new Date().toISOString() }).eq("id", keyId).eq("organization_id", organizationId);
  if (error) throw new Error(error.message);
  revalidatePath("/business/api");
}
