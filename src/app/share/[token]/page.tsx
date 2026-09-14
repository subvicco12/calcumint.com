import { createHash } from "node:crypto";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema } from "@/lib/builder/definition";
import { CustomCalculatorPreview } from "@/components/custom-calculator-preview";

type PageProps = { params: Promise<{ token: string }> };

export const metadata = { robots: { index: false, follow: false } };

export default async function SharedCalculatorPage({ params }: PageProps) {
  const { token } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) return <main className="embed-shell"><p>Share service is not configured.</p></main>;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data: share } = await admin.from("share_links").select("calculator_id,label,expires_at").eq("token_hash", tokenHash).eq("is_revoked", false).or("expires_at.is.null,expires_at.gt.now").maybeSingle();
  if (!share) notFound();
  const { data: calculator } = await admin.from("custom_calculators").select("name,status,published_version").eq("id", share.calculator_id).eq("status", "published").maybeSingle();
  if (!calculator?.published_version) notFound();
  const { data: versionRow } = await admin.from("custom_calculator_versions").select("definition").eq("calculator_id", share.calculator_id).eq("version", calculator.published_version).maybeSingle();
  const parsed = customCalculatorSchema.safeParse(versionRow?.definition);
  if (!parsed.success) notFound();
  return <main className="embed-shell share-shell"><section className="share-card"><span className="eyebrow">Secure client calculator</span><h1>{calculator.name}</h1>{share.label && <p>{share.label}</p>}<CustomCalculatorPreview definition={parsed.data}/>{share.expires_at && <small className="muted">This link expires {new Date(share.expires_at).toLocaleString()}.</small>}</section></main>;
}
