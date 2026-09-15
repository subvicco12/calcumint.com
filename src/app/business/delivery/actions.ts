"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { embedConfigInputSchema, normalizeAllowedDomain } from "@/lib/embeds/schema";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createEmbedConfig(formData: FormData) {
  const { supabase, user } = await requireUser();
  const calculatorId = String(formData.get("calculatorId") ?? "");
  const organizationId = String(formData.get("organizationId") ?? "");
  const allowedDomains = String(formData.get("allowedDomains") ?? "").split(/[,\n]/).map(normalizeAllowedDomain).filter(Boolean);
  const leadFields = ["name","email","phone","company"].filter((field) => formData.get(`lead_${field}`) === "on");
  const parsed = embedConfigInputSchema.parse({
    name: String(formData.get("name") ?? "Website embed"),
    allowedDomains,
    allowDirect: formData.get("allowDirect") === "on",
    companyName: String(formData.get("companyName") ?? "").trim() || null,
    logoUrl: String(formData.get("logoUrl") ?? "").trim() || null,
    accentColor: String(formData.get("accentColor") ?? "#0b7a66"),
    hideCalcumintBrand: formData.get("hideCalcumintBrand") === "on",
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim() || null,
    ctaUrl: String(formData.get("ctaUrl") ?? "").trim() || null,
    leadCaptureEnabled: formData.get("leadCaptureEnabled") === "on",
    leadFields: leadFields.length ? leadFields : ["name","email"],
    consentText: String(formData.get("consentText") ?? "").trim() || null,
    privacyUrl: String(formData.get("privacyUrl") ?? "").trim() || null
  });
  const publicKey = randomBytes(24).toString("base64url");
  const { error } = await supabase.from("embed_configs").insert({
    organization_id: organizationId, calculator_id: calculatorId, public_key: publicKey, name: parsed.name,
    allowed_domains: parsed.allowedDomains, allow_direct: parsed.allowDirect, company_name: parsed.companyName ?? null,
    logo_url: parsed.logoUrl ?? null, accent_color: parsed.accentColor, hide_calcumint_brand: parsed.hideCalcumintBrand,
    cta_label: parsed.ctaLabel ?? null, cta_url: parsed.ctaUrl ?? null, lead_capture_enabled: parsed.leadCaptureEnabled,
    lead_fields: parsed.leadFields, consent_text: parsed.consentText ?? null, privacy_url: parsed.privacyUrl ?? null, created_by: user.id
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/business/delivery/${calculatorId}`);
}

export async function createShareLink(formData: FormData) {
  const { supabase, user } = await requireUser();
  const calculatorId = String(formData.get("calculatorId") ?? "");
  const organizationId = String(formData.get("organizationId") ?? "");
  const label = String(formData.get("label") ?? "Client share").trim().slice(0,120);
  const days = Math.min(90, Math.max(1, Number(formData.get("days") ?? 7)));
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
  const { error } = await supabase.from("share_links").insert({ organization_id: organizationId, calculator_id: calculatorId, token_hash: tokenHash, label, expires_at: expiresAt, created_by: user.id });
  if (error) throw new Error(error.message);
  redirect(`/business/delivery/${calculatorId}?share=${encodeURIComponent(token)}`);
}
