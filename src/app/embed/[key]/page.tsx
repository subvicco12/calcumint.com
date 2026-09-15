import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema } from "@/lib/builder/definition";
import { isEmbedRequestAllowed } from "@/lib/embeds/origin";
import { PublicEmbedCalculator } from "@/components/public-embed-calculator";

type PageProps = { params: Promise<{ key: string }> };

export const metadata = { robots: { index: false, follow: false } };

export default async function EmbedPage({ params }: PageProps) {
  const { key } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) return <main className="embed-shell"><p>Embed service is not configured.</p></main>;
  const requestHeaders = await headers();
  const referer = requestHeaders.get("referer");
  const destination = requestHeaders.get("sec-fetch-dest");

  const { data: config } = await admin.from("embed_configs").select("id,organization_id,calculator_id,status,allowed_domains,allow_direct,company_name,logo_url,accent_color,hide_calcumint_brand,cta_label,cta_url,lead_capture_enabled,lead_fields,consent_text,privacy_url").eq("public_key", key).eq("status", "active").maybeSingle();
  if (!config || !isEmbedRequestAllowed(config.allowed_domains ?? [], Boolean(config.allow_direct), referer, destination)) notFound();

  const { data: calculator } = await admin.from("custom_calculators").select("id,status,published_version").eq("id", config.calculator_id).eq("status", "published").maybeSingle();
  if (!calculator?.published_version) notFound();
  const { data: versionRow } = await admin.from("custom_calculator_versions").select("definition").eq("calculator_id", calculator.id).eq("version", calculator.published_version).maybeSingle();
  const parsed = customCalculatorSchema.safeParse(versionRow?.definition);
  if (!parsed.success) notFound();

  return <main className="embed-shell"><PublicEmbedCalculator publicKey={key} definition={parsed.data} companyName={config.company_name} logoUrl={config.logo_url} accentColor={config.accent_color} hideCalcumintBrand={config.hide_calcumint_brand} ctaLabel={config.cta_label} ctaUrl={config.cta_url} leadCaptureEnabled={config.lead_capture_enabled} leadFields={config.lead_fields ?? ["name","email"]} consentText={config.consent_text} privacyUrl={config.privacy_url} /></main>;
}
